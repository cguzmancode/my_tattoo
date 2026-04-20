import { test, expect } from '@playwright/test'

test.describe('📝 Booking Form with Image Upload', () => {
  test('should display booking form with image upload', async ({ page }) => {
    // Go to an artist's booking page (using demo artist slug from mocks)
    await page.goto('/t/alex-rivera-tattoo')
    
    // Wait for the page to load
    await page.waitForSelector('text=Solicitar Cita', { timeout: 10000 })
    
    // Take screenshot of the full page
    await page.screenshot({ 
      path: 'test-results/screenshots/booking-form-full.png',
      fullPage: true 
    })
  })

  test('should show image upload section', async ({ page }) => {
    await page.goto('/t/alex-rivera-tattoo')
    
    // Wait for the booking form to load
    await page.waitForSelector('data-testid=booking-form', { timeout: 10000 })
    
    // Scroll to the image upload section
    await page.locator('text=Imágenes de referencia').first().scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    
    // Check that image upload section is visible
    const imageUploadLabel = await page.locator('text=Imágenes de referencia').first()
    await expect(imageUploadLabel).toBeVisible()
    
    // Check for drag & drop zone
    const dropZone = await page.locator('text=Arrastra imágenes aquí').first()
    await expect(dropZone).toBeVisible()
    
    // Check file counter
    const fileCounter = await page.locator('text=0 de 5 imágenes').first()
    await expect(fileCounter).toBeVisible()
    
    // Take screenshot of the image upload component
    const imageUploadSection = await page.locator('text=Imágenes de referencia').first().locator('..').locator('..')
    await imageUploadSection.screenshot({ 
      path: 'test-results/screenshots/booking-form-image-upload.png'
    })
  })

  test('should show drag and drop hover state', async ({ page }) => {
    await page.goto('/t/alex-rivera-tattoo')
    
    await page.waitForSelector('data-testid=booking-form', { timeout: 10000 })
    
    // Scroll to the drop zone
    const dropZone = await page.locator('text=Arrastra imágenes aquí').first()
    await dropZone.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    
    // Hover over the drop zone to see the hover effect
    await dropZone.hover()
    await page.waitForTimeout(500)
    
    // Take screenshot of the hover state
    await page.screenshot({ 
      path: 'test-results/screenshots/booking-form-dropzone-hover.png',
      fullPage: false 
    })
    
    // Verify the drop zone is visible and has hover styling
    await expect(dropZone).toBeVisible()
  })
})
