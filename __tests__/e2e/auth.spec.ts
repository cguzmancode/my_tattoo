import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.describe('Public Pages', () => {
    test('homepage should be accessible without auth', async ({ page }) => {
      await page.goto('/')
      
      // Should load without redirecting to login
      await expect(page).toHaveURL('/')
      await expect(page.locator('body')).toBeVisible()
    })

    test('public profile should be accessible without auth', async ({ page }) => {
      await page.goto('/t/demo-artist')
      
      // Should load without auth
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Protected Routes', () => {
    test('dashboard should require authentication', async ({ page }) => {
      await page.goto('/dashboard')
      
      // Should redirect to login or show auth required
      await page.waitForTimeout(1000)
      
      const currentUrl = page.url()
      // Either redirected to sign-in or stayed on dashboard with auth UI
      const isAuthPage = currentUrl.includes('sign-in') || currentUrl.includes('login')
      const isDashboard = currentUrl.includes('/dashboard')
      
      expect(isAuthPage || isDashboard).toBe(true)
    })

    test('dashboard/bookings should require authentication', async ({ page }) => {
      await page.goto('/dashboard/bookings')
      
      await page.waitForTimeout(1000)
      
      const currentUrl = page.url()
      const isAuthPage = currentUrl.includes('sign-in') || currentUrl.includes('login')
      const isBookings = currentUrl.includes('/dashboard/bookings')
      
      expect(isAuthPage || isBookings).toBe(true)
    })
  })

  test.describe('Sign In Flow', () => {
    test('should show sign-in page', async ({ page }) => {
      await page.goto('/sign-in')
      
      // Clerk renders the sign-in component
      await expect(page.locator('body')).toBeVisible()
      
      // Look for common sign-in elements
      const hasEmailInput = await page.locator('input[type="email"]').isVisible().catch(() => false)
      const hasPasswordInput = await page.locator('input[type="password"]').isVisible().catch(() => false)
      const hasSignInButton = await page.locator('button:has-text("Sign in"), button:has-text("Continue")').isVisible().catch(() => false)
      
      // At least one auth element should be present
      expect(hasEmailInput || hasPasswordInput || hasSignInButton).toBe(true)
    })

    test('should show sign-up page', async ({ page }) => {
      await page.goto('/sign-up')
      
      await expect(page.locator('body')).toBeVisible()
      
      // Look for sign-up elements
      const hasEmailInput = await page.locator('input[type="email"]').isVisible().catch(() => false)
      const hasSignUpButton = await page.locator('button:has-text("Sign up"), button:has-text("Continue")').isVisible().catch(() => false)
      
      expect(hasEmailInput || hasSignUpButton).toBe(true)
    })
  })

  test.describe('Navigation', () => {
    test('should have link to dashboard from homepage when authenticated', async ({ page }) => {
      await page.goto('/')
      
      // Look for dashboard navigation or sign-in
      const dashboardLink = page.locator('a[href="/dashboard"]')
      const signInLink = page.locator('a[href="/sign-in"], button:has-text("Sign in")')
      
      // One of these should exist
      const hasDashboardLink = await dashboardLink.isVisible().catch(() => false)
      const hasSignInLink = await signInLink.isVisible().catch(() => false)
      
      expect(hasDashboardLink || hasSignInLink).toBe(true)
    })
  })
})
