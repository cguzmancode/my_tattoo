import { test, expect } from '@playwright/test'

test.describe('🎨 Sign-Up y Onboarding de Artista', () => {
  
  test('should display sign-up page with InkApp branding', async ({ page }) => {
    await page.goto('/sign-up')
    
    // Esperar a que cargue la página
    await page.waitForLoadState('networkidle')
    
    // Verificar elementos visibles
    await expect(page.locator('text=Crea tu cuenta')).toBeVisible()
    await expect(page.locator('text=Únete a InkApp')).toBeVisible()
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/sign-up-page.png',
      fullPage: true 
    })
  })

  test('should display onboarding page', async ({ page }) => {
    // En modo demo, podemos acceder directamente
    await page.goto('/onboarding')
    
    await page.waitForLoadState('networkidle')
    
    // Verificar elementos del onboarding
    await expect(page.locator('text=Completa tu perfil')).toBeVisible()
    await expect(page.locator('text=Cuéntanos sobre ti')).toBeVisible()
    
    // Verificar que estamos en el paso 1
    await expect(page.locator('text=Información básica')).toBeVisible()
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/onboarding-step-1.png',
      fullPage: true 
    })
  })

  test('should show step 2 - Tattoo styles selection', async ({ page }) => {
    await page.goto('/onboarding')
    await page.waitForLoadState('networkidle')
    
    // Completar paso 1
    await page.fill('input[placeholder*="Alex"]', 'Demo Tattoo Artist')
    await page.fill('textarea[placeholder*="historia"]', 'Especialista en tatuajes tradicionales con 5 años de experiencia.')
    
    // Click en continuar
    await page.click('button:has-text("Continuar")')
    await page.waitForTimeout(500)
    
    // Verificar que estamos en el paso 2
    await expect(page.locator('text=Estilos de tatuaje')).toBeVisible()
    
    // Verificar que hay estilos disponibles
    await expect(page.locator('text=Traditional')).toBeVisible()
    await expect(page.locator('text=Neotraditional')).toBeVisible()
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/onboarding-step-2.png',
      fullPage: true 
    })
  })

  test('should show step 3 - Business info', async ({ page }) => {
    await page.goto('/onboarding')
    await page.waitForLoadState('networkidle')
    
    // Completar paso 1
    await page.fill('input[placeholder*="Alex"]', 'Demo Tattoo Artist')
    await page.fill('textarea[placeholder*="historia"]', 'Especialista en tatuajes tradicionales con 5 años de experiencia.')
    await page.click('button:has-text("Continuar")')
    await page.waitForTimeout(500)
    
    // Completar paso 2 - seleccionar estilos
    await page.click('text=Traditional')
    await page.click('text=Neotraditional')
    await page.click('button:has-text("Continuar")')
    await page.waitForTimeout(500)
    
    // Verificar que estamos en el paso 3
    await expect(page.locator('text=Información de negocio')).toBeVisible()
    await expect(page.locator('text=Depósito requerido')).toBeVisible()
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/onboarding-step-3.png',
      fullPage: true 
    })
  })

  test('should show full onboarding flow', async ({ page }) => {
    await page.goto('/onboarding')
    await page.waitForLoadState('networkidle')
    
    // Screenshot inicial
    await page.screenshot({ path: 'test-results/screenshots/onboarding-flow-01-start.png' })
    
    // Paso 1: Información básica
    await page.fill('input[placeholder*="Alex"]', 'Demo Tattoo Artist')
    await page.fill('textarea[placeholder*="historia"]', 'Especialista en tatuajes tradicionales con 5 años de experiencia. Estudio ubicado en Madrid.')
    await page.click('button:has-text("Continuar")')
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/screenshots/onboarding-flow-02-styles.png' })
    
    // Paso 2: Estilos
    await page.click('text=Traditional')
    await page.click('text=Blackwork')
    await page.click('text=Japanese')
    await page.click('button:has-text("Continuar")')
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/screenshots/onboarding-flow-03-business.png' })
    
    // Paso 3: Información de negocio
    await page.fill('input[type="number"]', '50')
    await page.fill('input[placeholder*="@tu_usuario"]', '@demotattoo')
    await page.screenshot({ path: 'test-results/screenshots/onboarding-flow-04-complete.png' })
  })
})
