import { test, expect } from '@playwright/test'

test.describe('E2E Smoke Tests', () => {
  test('homepage should load', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/InkApp/)
  })

  test('should display basic page structure', async ({ page }) => {
    await page.goto('/')
    const body = await page.locator('body').count()
    expect(body).toBe(1)
  })
})
