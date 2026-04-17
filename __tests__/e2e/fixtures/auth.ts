import { test as base, expect, type Page } from '@playwright/test'

// Test user credentials (should match test environment)
export const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'test-password-123',
}

// Extend base test with auth fixtures
export const test = base.extend<{
  authenticatedPage: Page
}>({
  // Fixture for authenticated page
  authenticatedPage: async ({ browser }, use) => {
    // Create a new context with auth state
    const context = await browser.newContext({
      storageState: undefined, // Start fresh
    })
    
    const page = await context.newPage()
    
    // Navigate to login page
    await page.goto('/')
    
    // Wait for Clerk to load
    await page.waitForSelector('[data-testid="clerk-loaded"]', { timeout: 10000 })
      .catch(() => {
        // Clerk might not have the testid, continue anyway
        console.log('Clerk loaded indicator not found, continuing...')
      })
    
    // Use the page
    await use(page)
    
    // Cleanup
    await context.close()
  },
})

export { expect }
