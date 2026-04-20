import { test, expect } from '@playwright/test'

test.describe('🎯 Body Zone Selector', () => {
  test('Screenshot - Body Zone Selector en formulario', async ({ page }) => {
    // Ir al perfil público del artista
    await page.goto('/t/alex-rivera-tattoo')

    // Esperar a que la página cargue
    await page.waitForTimeout(2000)

    // Hacer scroll hasta la sección de reserva
    await page.evaluate(() => {
      const bookingSection = document.querySelector('section:has(h2:contains("próximo tatuaje"))')
      if (bookingSection) bookingSection.scrollIntoView({ behavior: 'smooth' })
    })

    await page.waitForTimeout(1000)

    // Capturar screenshot del formulario completo
    await page.screenshot({
      path: 'test-results/screenshots/body-zone-form.png',
      fullPage: false
    })

    // Intentar hacer clic en el botón de zona del cuerpo si existe
    const zoneButton = page.locator('button:has-text("Selecciona la zona")')
    if (await zoneButton.isVisible().catch(() => false)) {
      await zoneButton.click()
      await page.waitForTimeout(1000)

      // Screenshot con el selector abierto
      await page.screenshot({
        path: 'test-results/screenshots/body-zone-selector-open.png',
        fullPage: false
      })

      // Seleccionar una zona (Forearm)
      const forearmZone = page.locator('svg').locator('path').nth(3)
      await forearmZone.click()
      await page.waitForTimeout(500)

      await page.screenshot({
        path: 'test-results/screenshots/body-zone-selected.png',
        fullPage: false
      })
    }

    console.log('✅ Screenshots del Body Zone Selector capturados')
  })
})
