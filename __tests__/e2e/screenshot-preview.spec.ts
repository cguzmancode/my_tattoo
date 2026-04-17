import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'

// Este test genera screenshots de las páginas para preview visual
test.describe('📸 Screenshot Preview', () => {
  test.afterAll(() => {
    console.log('\n📁 Screenshots guardados en: test-results/screenshots/')
    console.log('Para verlos abre la carpeta en tu navegador de archivos\n')
  })

  test('homepage screenshot', async ({ page }) => {
    await page.goto('/')
    await page.screenshot({ path: 'test-results/screenshots/01-homepage.png', fullPage: true })
    console.log('✅ Screenshot: Homepage')
  })

  test('sign-in screenshot', async ({ page }) => {
    await page.goto('/sign-in')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-results/screenshots/02-sign-in.png', fullPage: true })
    console.log('✅ Screenshot: Sign In')
  })

  test('public profile screenshot', async ({ page }) => {
    await page.goto('/t/demo-artist')
    await page.screenshot({ path: 'test-results/screenshots/03-public-profile.png', fullPage: true })
    console.log('✅ Screenshot: Public Profile')
  })

  test('404 page screenshot', async ({ page }) => {
    await page.goto('/t/non-existent-slug')
    await page.screenshot({ path: 'test-results/screenshots/04-404-page.png', fullPage: true })
    console.log('✅ Screenshot: 404 Page')
  })

  test('dashboard screenshot (redirects to sign-in)', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-results/screenshots/05-dashboard-redirect.png', fullPage: true })
    console.log('✅ Screenshot: Dashboard (auth redirect)')
  })
})
