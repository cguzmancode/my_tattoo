import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Rutas que requieren autenticación
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/onboarding',
  '/api/upload',
])

export default clerkMiddleware(async (auth, req) => {
  // Si es una ruta protegida, requerir autenticación
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
  // Las rutas públicas pasan sin autenticación
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
