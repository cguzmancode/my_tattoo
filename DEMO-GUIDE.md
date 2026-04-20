# InkApp - Guía de Demo

## 🎯 Propósito
Esta guía te ayudará a realizar una demostración completa del MVP de InkApp a potenciales clientes (tatuadores).

---

## 📋 Flujo de Demo Completo

### 1. Introducción (2 minutos)
**Mensaje clave:**
> "InkApp es una plataforma todo-en-uno para tatuadores profesionales que te permite gestionar tu estudio, recibir solicitudes de clientes y organizar tu calendario de citas."

**Puntos a destacar:**
- Diseño profesional con tema oscuro "tattoo-friendly"
- Sin comisiones ni intermediarios
- Los clientes contactan directamente contigo
- Tú controlas tu agenda y disponibilidad

---

### 2. Vista del Cliente - Flujo Público (5 minutos)

#### Paso 2.1: Página de Inicio
- URL: `http://localhost:3000/`
- **Mostrar:** Hero section con CTA a registro
- **Destacar:** Diseño moderno, dark theme profesional

#### Paso 2.2: Perfil Público del Artista
- URL: `http://localhost:3000/t/alex-rivera-tattoo`
- **Mostrar:**
  - Foto de portada y avatar
  - Biografía del artista
  - Estilos de tatuaje (badges)
  - Portfolio de trabajos
  - Información de contacto y depósito

**Script:**
> "Así te ven los clientes. Tu perfil público es tu carta de presentación. Puedes personalizar tu bio, subir fotos de tu trabajo y establecer tu depósito de seguridad."

#### Paso 2.3: Formulario de Solicitud de Cita
- **Mostrar:**
  - Formulario completo con validación
  - Selector de fecha preferida
  - Selector de zona del cuerpo (body map)
  - Selector de tamaño del tatuaje
  - Campo para descripción detallada
  - Subida de imágenes de referencia (hasta 5)

**Script:**
> "Los clientes pueden solicitar citas directamente desde tu perfil. El formulario captura toda la información que necesitas: qué quieren, dónde, qué tamaño, y pueden subir imágenes de referencia para que entiendas mejor su idea."

---

### 3. Panel del Artista - Dashboard (5 minutos)

#### Paso 3.1: Login (si es necesario)
- URL: `http://localhost:3000/sign-in`
- **Mostrar:** Login con Clerk, tema oscuro consistente

#### Paso 3.2: Dashboard Principal
- URL: `http://localhost:3000/dashboard`
- **Mostrar:**
  - Estadísticas en tiempo real (total citas, pendientes, confirmadas)
  - Alerta de "Modo Demo" (explicar que en producción mostrarían datos reales)
  - Citas recientes
  - Acciones rápidas (compartir perfil, calendario)

**Script:**
> "Este es tu dashboard personal. Aquí ves un resumen de tu estudio: cuántas citas tienes pendientes, cuántas están confirmadas, y las solicitudes más recientes."

#### Paso 3.3: Gestión de Citas
- URL: `http://localhost:3000/dashboard/bookings`
- **Mostrar:**
  - Lista completa de citas
  - Filtros por estado (Pendiente, Aceptada, Confirmada, etc.)
  - Búsqueda por nombre de cliente
  - Detail drawer al hacer click en una cita

**Script:**
> "Puedes gestionar todas tus citas desde aquí. Filtrar por estado, buscar por cliente, y ver los detalles completos de cada solicitud."

#### Paso 3.4: Calendario
- URL: `http://localhost:3000/dashboard/calendar`
- **Mostrar:**
  - Calendario mensual/semanal
  - Citas confirmadas marcadas
  - Días bloqueados (vacaciones, no disponible)
  - Funcionalidad de bloquear/desbloquear fechas

**Script:**
> "Tu calendario te permite ver visualmente tu agenda. Puedes marcar días como no disponibles para que los clientes no soliciten citas esos días."

---

### 4. Registro de Nuevo Artista (3 minutos)

#### Paso 4.1: Sign Up
- URL: `http://localhost:3000/sign-up`
- **Mostrar:** Formulario de registro con Clerk

#### Paso 4.2: Onboarding
- URL: `http://localhost:3000/onboarding`
- **Mostrar:**
  - Paso 1: Información básica (nombre, bio)
  - Paso 2: Selección de estilos
  - Paso 3: Configuración de negocio (depósito, Instagram)

**Script:**
> "El proceso de registro es súper sencillo. En menos de 2 minutos puedes tener tu perfil listo para empezar a recibir solicitudes."

---

## 🎨 Datos de Demo Disponibles

### Artistas de Prueba:
1. **Alex "The Needle" Rivera** (`/t/alex-rivera-tattoo`)
   - Especialista en tradicional y neotradicional
   - $50 depósito

2. **Marina Delgado** (`/t/marina-delgado-ink`)
   - Especialista en fine line y minimalista
   - $30 depósito

3. **Carlos "The Realist" Mendoza** (`/t/carlos-realist-tattoo`)
   - Especialista en realismo y retratos
   - $80 depósito

4. **Yuki Tanaka** (`/t/yuki-tanaka-irezumi`)
   - Especialista en tatuaje japonés (irezumi)
   - $100 depósito

### Bookings de Prueba:
- 11 bookings con diferentes estados
- Nombres variados: María García, Carlos Rodríguez, Laura Martínez, etc.
- Estados: PENDING, ACCEPTED, CONFIRMED, COMPLETED, CANCELLED

---

## 📱 Responsive Demo

**Importante:** Mostrar que funciona en móvil:
- Abrir DevTools (F12)
- Activar modo responsive
- Seleccionar iPhone 12 Pro o similar
- Navegar por las páginas principales

---

## ✅ Checklist Pre-Demo

- [ ] Servidor corriendo: `pnpm dev`
- [ ] Base de datos con datos de prueba
- [ ] Screenshots actualizados en `test-results/screenshots/`
- [ ] URLs de prueba funcionando
- [ ] Modo demo activado

---

## 🎯 Preguntas Frecuentes del Cliente

**Q: ¿Cuánto cuesta?**
A: "Por ahora estamos en beta gratuita. Más adelante tendremos un plan mensual accesible para tatuadores."

**Q: ¿Puedo conectar mi Instagram?**
A: "Sí, en tu perfil puedes agregar tu link de Instagram y los clientes pueden ver tu portfolio."

**Q: ¿Cómo recibo los pagos del depósito?**
A: "Próximamente integraremos Stripe para que puedas recibir pagos directamente. Por ahora el depósito es indicativo y lo cobras por tu cuenta."

**Q: ¿Puedo bloquear días específicos?**
A: "Sí, en el calendario puedes marcar días como no disponibles, fines de semana, vacaciones, etc."

---

## 📸 Screenshots Recomendadas

Para el cierre de la demo, mostrar estos screenshots:

1. `04-dashboard.png` - Dashboard con estadísticas
2. `06b-bookings.png` - Lista de bookings con filtros
3. `03-public-profile.png` - Perfil público del artista
4. `booking-form-full.png` - Formulario de solicitud
5. `onboarding-step-1.png` - Proceso de registro

---

## 🚀 Siguientes Pasos para el Cliente

Si el tatuador está interesado:

1. **Registro:** Crear cuenta en `/sign-up`
2. **Onboarding:** Completar perfil
3. **Compartir:** Enviar enlace del perfil público a sus clientes
4. **Feedback:** Reportar bugs o sugerencias

---

## 📧 Contacto

Para soporte o feedback:
- Email: hola@inkapp.com
- Instagram: @inkapp

---

**Última actualización:** Abril 2026
**Versión:** MVP v1.0
