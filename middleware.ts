import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/t/:slug*',
  '/api/webhooks/(.*)',
])

const isIgnoredRoute = createRouteMatcher([
  '/_next/(.*)',
  '/static/(.*)',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
])

export default clerkMiddleware(async (auth, req) => {
  if (isIgnoredRoute(req)) {
    return
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
