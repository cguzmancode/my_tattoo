# InkApp - Sistema de Gestión para Tatuadores

Plataforma completa para artistas del tatuaje para gestionar citas, disponibilidad y pagos.

## 🚀 Tecnologías

- **Next.js 16** - Framework React con App Router
- **Prisma 7** - ORM para PostgreSQL
- **Supabase** - Base de datos y storage
- **Clerk** - Autenticación y autorización
- **Tailwind CSS v4** - Estilos
- **Framer Motion** - Animaciones

## 📋 Características

- ✅ Gestión de citas (PENDING → ACCEPTED → CONFIRMED → COMPLETED)
- ✅ Calendario de disponibilidad
- ✅ Sistema de pagos con Stripe
- ✅ Perfil público para artistas
- ✅ Subida de imágenes

## 🛠️ Desarrollo

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar en desarrollo
pnpm dev

# Ejecutar tests
pnpm test:unit
pnpm test:integration
```

## 🚀 Despliegue

Este proyecto usa **despliegue manual por tags**.

### Flujo de trabajo

1. **Desarrollo normal** - commits a `master` no despliegan automáticamente
2. **Crear tag** para desplegar:

```bash
# Crear tag
git tag v1.2.3

# Push del tag (esto despliega automáticamente)
git push origin v1.2.3
```

### Configuración de despliegue

- Auto-deploy desactivado en `vercel.json`
- GitHub Actions ejecuta deploy solo en tags `v*`
- Deploy Hook de Vercel configurado

---

**Nota**: Commits con `[skip ci]` en el mensaje omiten el workflow de CI/CD.
