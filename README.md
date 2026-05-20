# InkApp — Sistema de Gestión para Tatuadores

> Plataforma fullstack para artistas freelance del tatuaje. Centraliza solicitudes de cita, calendario, mensajería cliente↔artista y perfil público con portfolio.

Proyecto personal construido sobre el stack más reciente de Next.js + Prisma + Clerk + Supabase, con énfasis en **arquitectura limpia y testabilidad**, no solo en hacer que funcione.

---

## 🧱 Stack

| Capa             | Tecnología                                  |
|------------------|---------------------------------------------|
| Framework        | **Next.js 16** (App Router, Server Actions) |
| Lenguaje         | TypeScript (strict)                         |
| ORM              | **Prisma 7** + `@prisma/adapter-pg`          |
| Base de datos    | PostgreSQL (Supabase)                       |
| Auth             | Clerk                                       |
| Storage          | Supabase Storage                            |
| Estilos          | Tailwind CSS v4                             |
| Animaciones      | Framer Motion 12                            |
| Email            | Resend + React Email                        |
| Validación       | Zod                                         |
| Testing          | Vitest 4 (unit + integration) + Playwright   |
| Package manager  | pnpm                                        |

---

## 🏛️ Arquitectura

El módulo `bookings` —el corazón del dominio— está implementado siguiendo **Clean Architecture / Hexagonal**:

```
src/modules/bookings/
├── domain/            # TypeScript puro, sin dependencias externas
│   ├── booking.ts             # Entidad inmutable con transiciones de estado
│   ├── booking-message.ts     # Entidad con validación de contenido
│   ├── booking-status.ts      # Enum + canTransitionTo()
│   ├── booking-id.ts          # Value object UUID
│   ├── proposed-date.ts       # Value object con regla "fecha futura"
│   └── errors.ts              # Errores tipados de dominio
│
├── application/       # Use cases + ports (interfaces)
│   ├── ports/
│   │   ├── booking-repository.ts
│   │   ├── booking-message-repository.ts
│   │   ├── notification-service.ts
│   │   └── clock.ts
│   └── use-cases/
│       ├── create-booking.ts
│       ├── accept-booking.ts
│       ├── reject-booking.ts
│       ├── confirm-booking.ts
│       ├── complete-booking.ts
│       ├── cancel-booking.ts
│       ├── add-message-to-booking.ts
│       └── get-artist-bookings.ts
│
├── infrastructure/    # Adapters reales contra el mundo exterior
│   ├── prisma-booking-repository.ts
│   ├── prisma-booking-message-repository.ts
│   ├── resend-notification-service.ts
│   └── system-clock.ts
│
├── test-support/      # Fakes/in-memory adapters reutilizables en tests
│
└── composition-root.ts   # Cableado manual de dependencias
```

Las **Server Actions** (`src/app/actions/bookings.ts`, `src/app/actions/booking-public.ts`) son thin controllers: hacen autenticación con Clerk, resuelven el `artistId` y delegan en los use cases vía el `composition-root`.

📄 Lee el ADR completo en [`ARCHITECTURE.md`](./ARCHITECTURE.md) — incluye decisiones técnicas, alternativas consideradas y métricas de éxito.

### Regla de oro

Las flechas de dependencia apuntan hacia adentro:

```
Presentation → Application → Domain ← Infrastructure
```

`Domain` no conoce a nadie. `Application` solo conoce `Domain` y sus propios `ports`. `Infrastructure` implementa esos ports. La consecuencia práctica: **el dominio se testea en milisegundos**, sin DB, sin red, sin mocks.

---

## ✅ Tests

| Tipo              | Comando                  | Notas                                                  |
|-------------------|--------------------------|--------------------------------------------------------|
| Unit              | `pnpm test:unit`         | Dominio + use cases con fakes. **~150 ms, 94 tests.**  |
| Integration       | `pnpm test:integration`  | Adapters Prisma contra DB real. Requiere `DATABASE_URL`. |
| E2E (screenshots) | `pnpm test:e2e`          | Playwright sobre flujos visuales.                      |

Los tests de dominio no tocan red ni DB. Los tests de use cases usan **adapters in-memory** (ver `src/modules/bookings/test-support/`). Solo los tests de adapters concretos pegan a Postgres.

---

## 🚀 Setup

```bash
# 1. Instalar dependencias
pnpm install

# 2. Crear .env en la raíz (ver bloque "Variables de entorno" abajo)

# 3. Sincronizar el esquema (solo dev)
pnpm db:push

# 4. Aplicar la lockdown de RLS y revokes (idempotente)
psql "$DATABASE_URL" -f prisma/security/01-rls-lockdown.sql

# 5. Servidor de desarrollo
pnpm dev
```

### Variables de entorno

`.env*` está en `.gitignore`. Crea un fichero `.env` en la raíz con estas claves (todos los valores aquí son **placeholders**, no secretos):

```bash
# Supabase Postgres (usado vía @prisma/adapter-pg en src/lib/prisma.ts)
DATABASE_URL=postgresql://user:password@host:5432/db

# Supabase Auth + Storage (Service Role key se usa en la API route de upload)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Clerk Auth (publishable + secret los lee @clerk/nextjs implícitamente)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Resend (notificaciones de email del módulo Bookings)
RESEND_API_KEY=re_...

# App URL (enlaces de acción en plantillas de email)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Opcional: bypass de auth + datos mock en desarrollo
# NEXT_PUBLIC_DEMO_MODE=true
```

Para ver el dashboard sin login, descomenta `NEXT_PUBLIC_DEMO_MODE=true` y ejecuta en modo desarrollo.

---

## 📦 Deploy

Despliegue **manual por tags** — los commits a `master` no despliegan.

```bash
git tag v1.2.3
git push origin v1.2.3
```

- Auto-deploy desactivado en `vercel.json` (`"deploymentEnabled": false`).
- GitHub Actions (`.github/workflows/deploy-on-tag.yml`) dispara deploy solo en tags `v*`.

---

## 🎯 Qué aprendí construyendo esto

> Sección honesta. No todo lo que está en producción es perfecto; este es un proyecto demo y se nota dónde se invirtió esfuerzo y dónde no.

- **Server Actions ≠ panaceas.** Llamar Server Actions desde `useEffect` es un antipatrón sutil pero importante: te trae datos *después* del primer paint, te impide hacer streaming, y no aprovecha la red de Vercel. Lo correcto es pasar datos como prop desde un Server Component padre. [Ver commit del fix](https://github.com/Cristiangp/my_tattoo/commits/master).
- **Adapter Pattern paga sus dividendos pronto.** Migrar `updateBookingStatus` de una Server Action mezclada (Prisma + Resend + estado + emails inline) a un pipeline de use cases tomó tiempo. Pero hoy puedo ejecutar 94 tests en 150 ms y saber que la lógica de negocio funciona, sin levantar nada.
- **`Result<T,E>` no siempre es la respuesta.** En TypeScript, errores tipados con clases (`InvalidStatusTransitionError`, `UnauthorizedBookingAccessError`) dan stack traces útiles y se integran natural con el `try/catch` que ya existe en las Server Actions. Adoptarlo costó menos y rinde lo mismo.
- **Las queries pueden saltarse el dominio.** No todo necesita pasar por un use case. Lecturas que devuelven datos enriquecidos con relations (`include: { messages }`) viven mejor como queries directas a Prisma — forzarlas por un repositorio "puro" sería sobre-ingeniería.

---

## 🔒 Notas sobre seguridad (proyecto demo)

InkApp es un **proyecto demo de portfolio**, no una app con tráfico real ni dinero real. El MVP cubre el ciclo de bookings (solicitud → aceptación → confirmación → completada). El cobro real está deliberadamente fuera de alcance — el artista coordina el depósito con el cliente por canales propios. Algunas medidas que se esperan en producción tampoco entran:

- Pagos online (Stripe / Adyen / similares) y sus webhooks firmados
- Rate limiting distribuido (Upstash / Vercel KV)
- Sistema de cola para reintentos de email

Sí se aplican:

- Validación de transiciones de estado a nivel de dominio (no en el caller).
- Verificación de propiedad del booking en cada mutación (`booking.isOwnedBy(artistId)`).
- Validación de identidad en mensajes: el cliente solo puede escribir si su email coincide con el booking; el artista solo si autenticó con Clerk y es el dueño.

---

## 📁 Más documentación

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — ADR completo con decisiones técnicas
- [`AGENTS.md`](./AGENTS.md) — Convenciones del proyecto para agentes y colaboradores
- [`plans/`](./plans/) — Roadmap y blueprints internos

---

*"Concepts > Code. AI is a tool, we direct."*
