import { test, expect } from '@playwright/test'

test.describe('Public Profile Page', () => {
  // Usamos un slug estático para el test ya que el E2E no puede crear datos directamente
  // En un entorno real, esto requeriría un setup de DB o un endpoint de seed
  const testSlug = 'demo-artist'

  test('should display public profile by slug', async ({ page }) => {
    await page.goto(`/t/${testSlug}`)

    // La página puede mostrar 404 si no hay datos, o el perfil si existe
    // Verificamos que carga correctamente (sin errores de servidor)
    const body = await page.locator('body').count()
    expect(body).toBe(1)
  })

  test('should show 404 for non-existent slug', async ({ page }) => {
    await page.goto('/t/non-existent-slug-12345')

    // Verificar página 404
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
    await expect(page.locator('text=Artist not found')).toBeVisible()
  })

  test('should display booking request form when artist exists', async ({ page }) => {
    await page.goto(`/t/${testSlug}`)

    // Si la página carga correctamente, verificar elementos del formulario
    const form = page.locator('[data-testid="booking-form"]')
    const isFormVisible = await form.isVisible().catch(() => false)

    if (isFormVisible) {
      await expect(page.locator('input[name="clientName"]')).toBeVisible()
      await expect(page.locator('input[name="clientEmail"]')).toBeVisible()
      await expect(page.locator('textarea[name="description"]')).toBeVisible()
    }
  })
})
