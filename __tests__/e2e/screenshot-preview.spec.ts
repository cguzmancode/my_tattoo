import { test, expect } from '@playwright/test'

// Este test genera screenshots de todas las páginas para preview visual
test.describe('📸 Screenshot Preview - UX Redesign', () => {
  test.afterAll(() => {
    console.log('\n📁 Screenshots guardados en: test-results/screenshots/')
    console.log('Revisa las imágenes para ver el progreso del rediseño\n')
  })

  test('01 - Homepage', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/screenshots/01-homepage.png', fullPage: true })
    console.log('✅ Screenshot: Homepage con hero, features, stats')
  })

  test('02 - Sign-in page', async ({ page }) => {
    await page.goto('/sign-in')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-results/screenshots/02-sign-in.png', fullPage: true })
    console.log('✅ Screenshot: Sign-in con tema tattoo')
  })

  test('03 - Public profile', async ({ page }) => {
    await page.goto('/t/alex-rivera-tattoo')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/screenshots/03-public-profile.png', fullPage: true })
    console.log('✅ Screenshot: Perfil público del artista')
  })

  test('04 - Dashboard overview', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/screenshots/04-dashboard.png', fullPage: true })
    console.log('✅ Screenshot: Dashboard con stats y bookings')
  })

  test('05 - Calendar', async ({ page }) => {
    await page.goto('/dashboard/calendar')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/screenshots/05-calendar.png', fullPage: true })
    console.log('✅ Screenshot: Calendario con grid animado')
  })

  test('06 - Settings', async ({ page }) => {
    await page.goto('/dashboard/settings')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/screenshots/06-settings.png', fullPage: true })
    console.log('✅ Screenshot: Settings con formulario estilizado')
  })

  test('06b - Bookings', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/screenshots/06b-bookings.png', fullPage: true })
    console.log('✅ Screenshot: Citas/Bookings')
  })

  test('07 - 404 Page', async ({ page }) => {
    await page.goto('/t/non-existent-slug')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-results/screenshots/07-404.png', fullPage: true })
    console.log('✅ Screenshot: Página 404')
  })
})
