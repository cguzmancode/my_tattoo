# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication >> Sign In Flow >> should show sign-up page
- Location: __tests__/e2e/auth.spec.ts:65:9

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
    - generic [ref=e17]:
      - heading "404" [level=1] [ref=e18]
      - heading "This page could not be found." [level=2] [ref=e20]
  - alert [ref=e21]
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
> 74 |       expect(hasEmailInput || hasSignUpButton).toBe(true)
     |                                                ^ Error: expect(received).toBe(expected) // Object.is equality
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
  90 |       expect(hasDashboardLink || hasSignInLink).toBe(true)
  91 |     })
  92 |   })
  93 | })
  94 | 
```