import { test, expect } from '@playwright/test'

test.describe('📸 Booking Detail Drawer', () => {
  test('Drawer - Vista de detalle', async ({ page }) => {
    // Ir a la página de bookings
    await page.goto('/dashboard/bookings')
    await page.waitForTimeout(2000)

    // Hacer click en la primera cita
    await page.click('[data-testid="booking-card"]:first-of-type')
    await page.waitForTimeout(1000)

    // Screenshot del drawer abierto
    await page.screenshot({
      path: 'test-results/screenshots/booking-drawer-view.png',
      fullPage: false
    })

    console.log('✅ Screenshot: Drawer en modo vista')
  })

  test('Drawer - Modo edición', async ({ page }) => {
    // Ir a la página de bookings
    await page.goto('/dashboard/bookings')
    await page.waitForTimeout(2000)

    // Hacer click en la primera cita
    await page.click('[data-testid="booking-card"]:first-of-type')
    await page.waitForTimeout(1000)

    // Click en botón de editar
    await page.click('button[title="Editar"]')
    await page.waitForTimeout(500)

    // Screenshot del drawer en modo edición
    await page.screenshot({
      path: 'test-results/screenshots/booking-drawer-edit.png',
      fullPage: false
    })

    console.log('✅ Screenshot: Drawer en modo edición')
  })
})
