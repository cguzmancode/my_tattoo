# Architecture Decision Record — Clean Architecture en el módulo Bookings

> Fecha: 2026-05-11
> Estado: Aprobado · En implementación
> Alcance: Módulo `bookings` (resto del código sin tocar)

---

## 1. Contexto

InkApp creció como un MVP típico de Next.js: toda la lógica vive en `src/app/`, mezclando Server Actions, queries de Prisma, envío de emails con Resend y reglas de negocio en los mismos archivos.

Este patrón es perfectamente válido para validar una idea, pero arrastra costes que ya se notan:

- **Tests acoplados a infraestructura**: probar una regla de transición de estado de un `Booking` requiere DB, Clerk y Resend en marcha. Resultado: pocos tests unitarios, suite lenta.
- **Reglas de dominio dispersas**: la transición `PENDING → ACCEPTED → CONFIRMED → COMPLETED` está repartida entre `src/app/actions/bookings.ts`, `src/app/api/bookings/[id]/route.ts` y validaciones Zod sueltas. Sin una fuente única de verdad, el día que falle será difícil saber dónde mirar.
- **Antipatrones que el propio `AGENTS.md` prohíbe**: por ejemplo `useEffect` llamando a Server Actions en `src/components/dashboard/user-section.tsx`. Síntoma de capas borrosas.
- **Email handling frágil**: si Resend devuelve error, la Server Action sigue como si nada y el cliente nunca recibe confirmación. Una capa de aplicación bien definida tiene un único lugar donde tratar este efecto secundario.

El objetivo de este refactor **no es** sobre-ingeniar la app. Es demostrar criterio técnico aplicando Clean Architecture donde aporta valor real: el corazón del negocio (Bookings) y dejar el resto del código tal cual está.

---

## 2. Decisión

Adoptar **Clean Architecture / Arquitectura Hexagonal** únicamente en el módulo `bookings`, con tres capas internas y una capa de presentación que ya existe (Next.js App Router).

```
┌────────────────────────────────────────────────────────────┐
│  Presentation (Next.js — sin cambios estructurales)        │
│  src/app/actions/bookings.ts  ──┐                          │
│  src/app/api/bookings/...       │ thin controllers         │
└──────────────────────────────┬──┘                          │
                               │                             │
                               ▼                             │
┌────────────────────────────────────────────────────────────┐
│  Application                                               │
│  src/modules/bookings/application/                         │
│  ├── use-cases/         orquestación                       │
│  └── ports/             interfaces (depend on abstractions)│
└──────────────────────────────┬─────────────────────────────┘
                               │                             │
                               ▼                             │
┌────────────────────────────────────────────────────────────┐
│  Domain (sin dependencias externas — TypeScript puro)      │
│  src/modules/bookings/domain/                              │
│  ├── booking.ts             entity + reglas                │
│  ├── booking-status.ts      transiciones válidas           │
│  └── errors.ts              errores tipados                │
└────────────────────────────────────────────────────────────┘
                               ▲
                               │ implementa los ports
┌──────────────────────────────┴─────────────────────────────┐
│  Infrastructure                                            │
│  src/modules/bookings/infrastructure/                      │
│  ├── prisma-booking-repository.ts                          │
│  ├── resend-notification-service.ts                        │
│  └── system-clock.ts                                       │
└────────────────────────────────────────────────────────────┘
```

**Regla de oro**: las flechas de dependencia apuntan hacia adentro. `Domain` no conoce nada. `Application` solo conoce `Domain` y sus propios `ports`. `Infrastructure` implementa esos `ports`. `Presentation` consume use cases vía un `composition-root.ts`.

---

## 3. Estructura de carpetas

```
src/
├── app/                              # Sin cambios estructurales
│   ├── actions/
│   │   └── bookings.ts               # Thin controller — invoca use cases
│   └── api/
│       └── bookings/...              # Thin controller — invoca use cases
│
├── modules/
│   └── bookings/
│       ├── domain/
│       │   ├── booking.ts            # Entity con métodos accept(), confirm()...
│       │   ├── booking-id.ts         # Value object
│       │   ├── booking-status.ts     # Enum + canTransitionTo()
│       │   ├── proposed-date.ts      # Value object con validación
│       │   └── errors.ts             # Errores tipados de dominio
│       │
│       ├── application/
│       │   ├── ports/
│       │   │   ├── booking-repository.ts
│       │   │   ├── notification-service.ts
│       │   │   └── clock.ts
│       │   └── use-cases/
│       │       ├── create-booking.ts
│       │       ├── accept-booking.ts
│       │       ├── add-message-to-booking.ts
│       │       └── get-artist-bookings.ts
│       │
│       └── infrastructure/
│           ├── prisma-booking-repository.ts
│           ├── resend-notification-service.ts
│           └── system-clock.ts
│
├── composition-root.ts               # Donde se cablea todo
└── lib/                              # Sin cambios
```

---

## 4. Decisiones técnicas

### 4.1 Errores: clases tipadas, no `Result<T, E>`

```ts
// src/modules/bookings/domain/errors.ts
export class BookingNotFoundError extends Error { /* ... */ }
export class InvalidStatusTransitionError extends Error { /* ... */ }
export class UnauthorizedBookingAccessError extends Error { /* ... */ }
```

**Por qué clases en vez de `Result<T, E>`**:
- Más idiomático en TypeScript / Node.
- Stack traces útiles en producción.
- No requiere wrapping/unwrapping en cada llamada.
- Los controllers (Server Actions) ya están preparados para `try/catch`.

**Trade-off aceptado**: `throw` es invisible en la firma. Lo compensamos documentando los errores que puede lanzar cada use case en su JSDoc.

### 4.2 Dependency Injection: composición manual

Un único archivo `src/composition-root.ts` construye el grafo de dependencias. Sin frameworks (`tsyringe`, `inversify`, etc.).

```ts
// src/composition-root.ts
import { prisma } from '@/lib/prisma'
import { PrismaBookingRepository } from '@/modules/bookings/infrastructure/prisma-booking-repository'
import { ResendNotificationService } from '@/modules/bookings/infrastructure/resend-notification-service'
import { SystemClock } from '@/modules/bookings/infrastructure/system-clock'
import { AcceptBookingUseCase } from '@/modules/bookings/application/use-cases/accept-booking'

const repo = new PrismaBookingRepository(prisma)
const notifications = new ResendNotificationService()
const clock = new SystemClock()

export const acceptBookingUseCase = new AcceptBookingUseCase(repo, notifications, clock)
// ...
```

**Por qué manual**:
- Cero dependencias nuevas.
- Trivial de seguir para cualquiera que abra el repo.
- No esconde magia detrás de decorators.

### 4.3 Convenciones de archivo

- `kebab-case.ts` para todos los archivos.
- Una clase o función pública por archivo. El nombre del archivo coincide con el export.
- Tests al lado en `*.test.ts` (unitarios) o en `__tests__/integration/modules/bookings/` (integración).

### 4.4 Inmutabilidad en el dominio

Las entidades del dominio son inmutables. `Booking.accept()` no muta el booking actual: devuelve un nuevo `Booking` con el estado actualizado. Esto hace que las transiciones sean trivialmente testables y evita bugs de estado compartido.

---

## 5. Alternativas consideradas

| Alternativa | Por qué descartada |
|-------------|---------------------|
| Mantener todo en `src/app/` | El problema actual no se resuelve con disciplina, se resuelve con barreras. |
| Refactor completo (Bookings + Artists + Payments) | Multiplica el tiempo sin aportar más al portfolio. Demostrar el patrón en un módulo es suficiente. |
| `Result<T, E>` tipo Rust | Más ruido en TS sin ganar tanto. Funciona mejor en lenguajes con pattern matching nativo. |
| Framework DI (`tsyringe`, NestJS) | Sobre-ingeniería. La composición manual es perfectamente sostenible a esta escala. |
| Event-driven entre capas | Aún no hace falta. Añade complejidad antes de que duela. |

---

## 6. Qué entra y qué NO

### ✅ Entra en este refactor
- Módulo `bookings` completo en Clean Architecture.
- Tests unitarios del dominio.
- Tests con adapters in-memory de los use cases.
- Tests de integración de los adapters Prisma/Resend.
- Migración de Server Actions y Route Handlers a thin controllers.
- Eliminación del antipatrón `useEffect → Server Action` en `user-section.tsx`.

### ❌ No entra
- Refactor de `artists`, `profile`, `payments`, `calendar`.
- Hardening de seguridad de producción (Stripe firmado, rate limit distribuido, etc.). Decisión consciente: es un proyecto de portfolio.
- Cambios en el esquema de Prisma.
- Cambios de stack o librerías nuevas.

---

## 7. Cómo se verá un flujo completo

**Ejemplo: aceptar un booking desde el dashboard**

```ts
// src/app/actions/bookings.ts (thin controller)
'use server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { acceptBookingUseCase } from '@/composition-root'

export async function acceptBooking(bookingId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await acceptBookingUseCase.execute({ bookingId, artistClerkId: userId })
  revalidatePath('/dashboard/bookings')
}
```

```ts
// src/modules/bookings/application/use-cases/accept-booking.ts
export class AcceptBookingUseCase {
  constructor(
    private readonly bookings: BookingRepository,
    private readonly notifications: NotificationService,
    private readonly clock: Clock
  ) {}

  async execute(input: { bookingId: string; artistClerkId: string }): Promise<void> {
    const booking = await this.bookings.findById(input.bookingId)
    if (!booking) throw new BookingNotFoundError(input.bookingId)
    if (booking.artistClerkId !== input.artistClerkId) {
      throw new UnauthorizedBookingAccessError()
    }

    const accepted = booking.accept(this.clock.now())   // ← regla en dominio
    await this.bookings.save(accepted)
    await this.notifications.bookingAccepted(accepted)  // ← side effect aislado
  }
}
```

```ts
// src/modules/bookings/domain/booking.ts (extracto)
export class Booking {
  accept(now: Date): Booking {
    if (!this.status.canTransitionTo(BookingStatus.ACCEPTED)) {
      throw new InvalidStatusTransitionError(this.status, BookingStatus.ACCEPTED)
    }
    return new Booking({ ...this.props, status: BookingStatus.ACCEPTED, updatedAt: now })
  }
}
```

Tres líneas en la entidad. Cero dependencias externas. Cien por cien testable sin DB.

---

## 8. Métricas de éxito

El refactor se considera completado cuando:

1. Todos los tests existentes siguen pasando.
2. Hay al menos **15 tests unitarios** del dominio que corren en milisegundos sin DB.
3. Los use cases tienen tests con **adapters in-memory**.
4. El antipatrón `useEffect → Server Action` está eliminado.
5. El README explica la decisión arquitectónica con un diagrama.
6. Lighthouse mantiene o mejora los scores actuales.

---

## 9. Referencias

- *Clean Architecture* — Robert C. Martin (capítulos 16-22).
- *Hexagonal Architecture* — Alistair Cockburn.
- *Domain-Driven Design* — Eric Evans (Value Objects, Entities, Aggregates).

---

*Documento vivo. Cualquier cambio importante de criterio durante la implementación se refleja aquí.*
