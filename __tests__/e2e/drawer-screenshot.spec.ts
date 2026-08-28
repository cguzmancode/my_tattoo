import { test } from '@playwright/test'

test.describe('📸 Booking Detail Drawer Screenshots', () => {
  test('Full drawer view', async ({ page }) => {
    // Ir a la página de bookings
    await page.goto('/dashboard/bookings')
    await page.waitForTimeout(2000)

    // Hacer click en la primera card (María García)
    const firstCard = await page.locator('.space-y-4 > div').first()
    await firstCard.click()
    await page.waitForTimeout(1000)

    // Esperar a que el drawer se abra
    await page.waitForSelector('text=Información de Contacto')

    // Screenshot del drawer en vista
    await page.screenshot({
      path: 'test-results/screenshots/drawer-view.png',
      fullPage: true
    })

    console.log('✅ Screenshot: Drawer view mode')
  })

  test('Drawer edit mode', async ({ page }) => {
    // Ir a la página de bookings
    await page.goto('/dashboard/bookings')
    await page.waitForTimeout(2000)

    // Hacer click en la primera card
    const firstCard = await page.locator('.space-y-4 > div').first()
    await firstCard.click()
    await page.waitForTimeout(1000)

    // Esperar a que el drawer se abra
    await page.waitForSelector('text=Información de Contacto')

    // Click en botón de editar (buscar el botón con icono de lápiz)
    await page.click('button:has(.lucide-edit2)')
    await page.waitForTimeout(500)

    // Screenshot del drawer en modo edición
    await page.screenshot({
      path: 'test-results/screenshots/drawer-edit.png',
      fullPage: true
    })

    console.log('✅ Screenshot: Drawer edit mode')
  })
})
