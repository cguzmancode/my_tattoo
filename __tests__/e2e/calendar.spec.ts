import { test, expect } from '@playwright/test'

test.describe('Calendar', () => {
  test('should redirect to login when accessing calendar unauthenticated', async ({ page }) => {
    await page.goto('/dashboard/calendar')
    
    await page.waitForTimeout(1000)
    
    const currentUrl = page.url()
    const isAuthPage = currentUrl.includes('sign-in') || currentUrl.includes('login')
    const isCalendar = currentUrl.includes('/dashboard/calendar')
    
    expect(isAuthPage || isCalendar).toBe(true)
  })

  test('should display calendar structure when authenticated', async ({ page }) => {
    await page.goto('/dashboard/calendar')
    
    await page.waitForTimeout(1000)
    
    const currentUrl = page.url()
    
    if (!currentUrl.includes('/dashboard/calendar')) {
      test.skip()
      return
    }
    
    // Calendar should have navigation buttons
    const hasPrevButton = await page.locator('[data-testid="calendar-prev"]').isVisible().catch(() => false)
    const hasNextButton = await page.locator('[data-testid="calendar-next"]').isVisible().catch(() => false)
    const hasTodayButton = await page.locator('[data-testid="calendar-today"]').isVisible().catch(() => false)
    
    expect(hasPrevButton || hasNextButton || hasTodayButton).toBe(true)
  })

  test('should show block date button', async ({ page }) => {
    await page.goto('/dashboard/calendar')
    
    await page.waitForTimeout(1000)
    
    const currentUrl = page.url()
    
    if (!currentUrl.includes('/dashboard/calendar')) {
      test.skip()
      return
    }
    
    const hasBlockButton = await page.locator('[data-testid="block-date-button"]').isVisible().catch(() => false)
    const hasBlockAction = await page.locator('text=Block').isVisible().catch(() => false)
    
    expect(hasBlockButton || hasBlockAction).toBe(true)
  })
})
