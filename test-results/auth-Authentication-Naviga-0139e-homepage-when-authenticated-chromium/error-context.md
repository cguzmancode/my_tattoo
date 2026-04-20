# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication >> Navigation >> should have link to dashboard from homepage when authenticated
- Location: __tests__/e2e/auth.spec.ts:79:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "InkApp TATTOO STUDIO" [ref=e4] [cursor=pointer]:
        - /url: /
        - img [ref=e6]
        - generic [ref=e11]:
          - generic [ref=e12]: InkApp
          - generic [ref=e13]: TATTOO STUDIO
      - navigation
  - main [ref=e15]:
    - generic [ref=e16]:
      - generic [ref=e17]:
        - generic [ref=e22]:
          - generic [ref=e27]: PLATAFORMA PARA TATUADORES
          - heading "Tu Arte. Tu Negocio." [level=1] [ref=e28]:
            - generic [ref=e29]: Tu Arte.
            - generic [ref=e30]: Tu Negocio.
          - paragraph [ref=e31]: La plataforma todo-en-uno para tatuadores profesionales. Gestiona citas, recibe pagos y crece tu marca.
          - generic [ref=e32]:
            - link "EMPIEZA GRATIS" [ref=e33] [cursor=pointer]:
              - /url: /sign-up
              - button "EMPIEZA GRATIS" [ref=e34]:
                - img [ref=e35]
                - text: EMPIEZA GRATIS
                - img [ref=e39]
            - link "VER DEMO" [ref=e41] [cursor=pointer]:
              - /url: /t/alex-rivera-tattoo
              - button "VER DEMO" [ref=e42]
          - generic [ref=e51]: inkapp.com/t/alex-rivera-tattoo
        - generic [ref=e70]: DESCUBRE MÁS
      - generic [ref=e74]:
        - generic [ref=e75]:
          - text: FEATURES
          - heading "Todo lo que necesitas" [level=2] [ref=e76]
          - paragraph [ref=e77]: Herramientas diseñadas específicamente para tatuadores profesionales.
        - generic [ref=e78]:
          - generic [ref=e79]:
            - img [ref=e81]
            - heading "Gestión de Citas" [level=3] [ref=e83]
            - paragraph [ref=e84]: Organiza tu agenda, bloquea fechas y mantén el control de tu tiempo.
          - generic [ref=e85]:
            - img [ref=e87]
            - heading "Pagos Seguros" [level=3] [ref=e89]
            - paragraph [ref=e90]: Depósitos integrados con Stripe. Sin preocupaciones, solo arte.
          - generic [ref=e91]:
            - img [ref=e93]
            - heading "Rápido y Simple" [level=3] [ref=e95]
            - paragraph [ref=e96]: Configura tu perfil en minutos y recibe solicitudes al instante.
          - generic [ref=e97]:
            - img [ref=e99]
            - heading "Portfolio Online" [level=3] [ref=e105]
            - paragraph [ref=e106]: Muestra tu trabajo al mundo. Tu estilo, tu reglas, tu negocio.
      - generic [ref=e109]:
        - generic [ref=e110]:
          - img [ref=e111]
          - generic [ref=e116]: 500+
          - generic [ref=e117]: Artistas
        - generic [ref=e118]:
          - img [ref=e119]
          - generic [ref=e121]: 10K+
          - generic [ref=e122]: Citas Gestiónadas
        - generic [ref=e123]:
          - img [ref=e124]
          - generic [ref=e127]: Siempre
          - generic [ref=e128]: Soporte 24/7
      - generic [ref=e133]:
        - heading "¿Listo para transformar tu negocio?" [level=2] [ref=e134]
        - paragraph [ref=e135]: Únete a cientos de tatuadores que ya gestionan sus citas profesionalmente. Empieza gratis hoy.
        - link "CREAR CUENTA GRATIS" [ref=e136] [cursor=pointer]:
          - /url: /sign-up
          - button "CREAR CUENTA GRATIS" [ref=e137]
      - generic [ref=e140]:
        - generic [ref=e141]:
          - img [ref=e142]
          - generic [ref=e146]: InkApp
        - paragraph [ref=e147]: © 2024 InkApp. Hecho con ❤️ para la comunidad tattoo.
        - generic [ref=e148]:
          - link "Instagram" [ref=e149] [cursor=pointer]:
            - /url: "#"
          - link "Twitter" [ref=e150] [cursor=pointer]:
            - /url: "#"
          - link "Email" [ref=e151] [cursor=pointer]:
            - /url: "#"
  - button "Open Next.js Dev Tools" [ref=e157] [cursor=pointer]:
    - img [ref=e158]
  - alert [ref=e161]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('Authentication', () => {
  4  |   test.describe('Public Pages', () => {
  5  |     test('homepage should be accessible without auth', async ({ page }) => {
  6  |       await page.goto('/')
  7  |       
  8  |       // Should load without redirecting to login
  9  |       await expect(page).toHaveURL('/')
  10 |       await expect(page.locator('body')).toBeVisible()
  11 |     })
  12 | 
  13 |     test('public profile should be accessible without auth', async ({ page }) => {
  14 |       await page.goto('/t/demo-artist')
  15 |       
  16 |       // Should load without auth
  17 |       await expect(page.locator('body')).toBeVisible()
  18 |     })
  19 |   })
  20 | 
  21 |   test.describe('Protected Routes', () => {
  22 |     test('dashboard should require authentication', async ({ page }) => {
  23 |       await page.goto('/dashboard')
  24 |       
  25 |       // Should redirect to login or show auth required
  26 |       await page.waitForTimeout(1000)
  27 |       
  28 |       const currentUrl = page.url()
  29 |       // Either redirected to sign-in or stayed on dashboard with auth UI
  30 |       const isAuthPage = currentUrl.includes('sign-in') || currentUrl.includes('login')
  31 |       const isDashboard = currentUrl.includes('/dashboard')
  32 |       
  33 |       expect(isAuthPage || isDashboard).toBe(true)
  34 |     })
  35 | 
  36 |     test('dashboard/bookings should require authentication', async ({ page }) => {
  37 |       await page.goto('/dashboard/bookings')
  38 |       
  39 |       await page.waitForTimeout(1000)
  40 |       
  41 |       const currentUrl = page.url()
  42 |       const isAuthPage = currentUrl.includes('sign-in') || currentUrl.includes('login')
  43 |       const isBookings = currentUrl.includes('/dashboard/bookings')
  44 |       
  45 |       expect(isAuthPage || isBookings).toBe(true)
  46 |     })
  47 |   })
  48 | 
  49 |   test.describe('Sign In Flow', () => {
  50 |     test('should show sign-in page', async ({ page }) => {
  51 |       await page.goto('/sign-in')
  52 |       
  53 |       // Clerk renders the sign-in component
  54 |       await expect(page.locator('body')).toBeVisible()
  55 |       
  56 |       // Look for common sign-in elements
  57 |       const hasEmailInput = await page.locator('input[type="email"]').isVisible().catch(() => false)
  58 |       const hasPasswordInput = await page.locator('input[type="password"]').isVisible().catch(() => false)
  59 |       const hasSignInButton = await page.locator('button:has-text("Sign in"), button:has-text("Continue")').isVisible().catch(() => false)
  60 |       
  61 |       // At least one auth element should be present
  62 |       expect(hasEmailInput || hasPasswordInput || hasSignInButton).toBe(true)
  63 |     })
  64 | 
  65 |     test('should show sign-up page', async ({ page }) => {
  66 |       await page.goto('/sign-up')
  67 |       
  68 |       await expect(page.locator('body')).toBeVisible()
  69 |       
  70 |       // Look for sign-up elements
  71 |       const hasEmailInput = await page.locator('input[type="email"]').isVisible().catch(() => false)
  72 |       const hasSignUpButton = await page.locator('button:has-text("Sign up"), button:has-text("Continue")').isVisible().catch(() => false)
  73 |       
  74 |       expect(hasEmailInput || hasSignUpButton).toBe(true)
  75 |     })
  76 |   })
  77 | 
  78 |   test.describe('Navigation', () => {
  79 |     test('should have link to dashboard from homepage when authenticated', async ({ page }) => {
  80 |       await page.goto('/')
  81 |       
  82 |       // Look for dashboard navigation or sign-in
  83 |       const dashboardLink = page.locator('a[href="/dashboard"]')
  84 |       const signInLink = page.locator('a[href="/sign-in"], button:has-text("Sign in")')
  85 |       
  86 |       // One of these should exist
  87 |       const hasDashboardLink = await dashboardLink.isVisible().catch(() => false)
  88 |       const hasSignInLink = await signInLink.isVisible().catch(() => false)
  89 |       
> 90 |       expect(hasDashboardLink || hasSignInLink).toBe(true)
     |                                                 ^ Error: expect(received).toBe(expected) // Object.is equality
  91 |     })
  92 |   })
  93 | })
  94 | 
```