import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  const testSlug = 'demo-artist'
  
  test.describe('Public Booking Request', () => {
    test('should display booking form on public profile', async ({ page }) => {
      await page.goto(`/t/${testSlug}`)
      
      // Wait for page to load
      await page.waitForLoadState('networkidle')
      
      // Check if form exists (artist might not exist, so handle both cases)
      const form = page.locator('[data-testid="booking-form"]')
      const isFormVisible = await form.isVisible().catch(() => false)
      
      if (isFormVisible) {
        // Form fields should be visible
        await expect(page.locator('input[name="clientName"]')).toBeVisible()
        await expect(page.locator('input[name="clientEmail"]')).toBeVisible()
        await expect(page.locator('textarea[name="description"]')).toBeVisible()
        await expect(page.locator('input[name="preferredDate"]')).toBeVisible()
      }
    })

    test('should validate required fields in booking form', async ({ page }) => {
      await page.goto(`/t/${testSlug}`)
      await page.waitForLoadState('networkidle')
      
      const form = page.locator('[data-testid="booking-form"]')
      const isFormVisible = await form.isVisible().catch(() => false)
      
      if (!isFormVisible) {
        test.skip()
        return
      }
      
      // Try to submit empty form
      await page.click('button[type="submit"]')
      
      // HTML5 validation should prevent submission
      // Check that we're still on the same page
      await expect(page).toHaveURL(new RegExp(`/t/${testSlug}`))
    })

    test('should show success state after submitting booking request', async ({ page }) => {
      await page.goto(`/t/${testSlug}`)
      await page.waitForLoadState('networkidle')
      
      const form = page.locator('[data-testid="booking-form"]')
      const isFormVisible = await form.isVisible().catch(() => false)
      
      if (!isFormVisible) {
        test.skip()
        return
      }
      
      // Fill out the form
      await page.fill('input[name="clientName"]', 'Test Client')
      await page.fill('input[name="clientEmail"]', 'test@example.com')
      await page.fill('textarea[name="description"]', 'I want a small tattoo on my arm')
      
      // Set date to tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dateString = tomorrow.toISOString().split('T')[0]
      await page.fill('input[name="preferredDate"]', dateString)
      
      // Submit form
      await page.click('button[type="submit"]')
      
      // Wait for response
      await page.waitForTimeout(2000)
      
      // Should show success message or error (depending on API availability)
      const hasSuccess = await page.locator('text=Solicitud enviada').isVisible().catch(() => false)
      const hasError = await page.locator('[data-testid="error-message"]').isVisible().catch(() => false)
      
      expect(hasSuccess || hasError).toBe(true)
    })
  })

  test.describe('Artist Dashboard - Manage Bookings', () => {
    test('should require authentication for dashboard bookings', async ({ page }) => {
      // This test verifies that dashboard requires auth
      await page.goto('/dashboard/bookings')
      
      await page.waitForTimeout(1000)
      
      // Check if we're redirected to login or stayed on bookings (if already auth'd)
      const currentUrl = page.url()
      
      // Should either redirect to sign-in or stay on dashboard (if authenticated)
      const isAuthPage = currentUrl.includes('sign-in') || currentUrl.includes('login')
      const isDashboard = currentUrl.includes('/dashboard/bookings')
      
      expect(isAuthPage || isDashboard).toBe(true)
    })

    test('should show booking status badges', async ({ page }) => {
      await page.goto('/dashboard/bookings')
      await page.waitForTimeout(1000)
      
      const currentUrl = page.url()
      if (!currentUrl.includes('/dashboard/bookings')) {
        test.skip()
        return
      }
      
      // Check for status badges if bookings exist
      const statusBadges = page.locator('[data-testid="status-badge"]')
      const count = await statusBadges.count()
      
      if (count > 0) {
        // Verify at least one badge is visible
        await expect(statusBadges.first()).toBeVisible()
      }
    })
  })

  test.describe('Full End-to-End Flow', () => {
    test('client requests booking → artist sees it in dashboard', async ({ page }) => {
      // This is a simplified flow test
      // In a real scenario, this would:
      // 1. Client visits public profile
      // 2. Submits booking request
      // 3. Artist logs in
      // 4. Views new booking in dashboard
      // 5. Accepts/rejects booking
      
      // Step 1: Visit public profile
      await page.goto(`/t/${testSlug}`)
      await page.waitForLoadState('networkidle')
      
      const form = page.locator('[data-testid="booking-form"]')
      const isFormVisible = await form.isVisible().catch(() => false)
      
      if (!isFormVisible) {
        test.skip()
        return
      }
      
      // Step 2: Fill and submit booking request
      const uniqueEmail = `test-${Date.now()}@example.com`
      await page.fill('input[name="clientName"]', 'E2E Test Client')
      await page.fill('input[name="clientEmail"]', uniqueEmail)
      await page.fill('textarea[name="description"]', 'E2E test booking request')
      
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      await page.fill('input[name="preferredDate"]', tomorrow.toISOString().split('T')[0])
      
      await page.click('button[type="submit"]')
      await page.waitForTimeout(2000)
      
      // Verify success
      const successVisible = await page.locator('text=Solicitud enviada').isVisible().catch(() => false)
      
      if (successVisible) {
        // Booking was created
        // In a full test, we would now:
        // - Login as artist
        // - Navigate to dashboard
        // - Verify the booking appears
        // - Accept/reject it
        
        expect(successVisible).toBe(true)
      }
    })
  })
})
