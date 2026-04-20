# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: signup-onboarding.spec.ts >> 🎨 Sign-Up y Onboarding de Artista >> should show step 2 - Tattoo styles selection
- Location: __tests__/e2e/signup-onboarding.spec.ts:42:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Traditional')
Expected: visible
Error: strict mode violation: locator('text=Traditional') resolved to 2 elements:
    1) <button class="px-3 py-2 rounded-lg text-xs font-medium transition-all bg-[#0a0a0a] text-[#a1a1a1] border border-white/10 hover:border-[#ff6b35]/50">Traditional</button> aka getByRole('button', { name: 'Traditional', exact: true })
    2) <button class="px-3 py-2 rounded-lg text-xs font-medium transition-all bg-[#0a0a0a] text-[#a1a1a1] border border-white/10 hover:border-[#ff6b35]/50">Neotraditional</button> aka getByRole('button', { name: 'Neotraditional' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Traditional')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "InkApp TATTOO STUDIO" [ref=e4] [cursor=pointer]:
        - /url: /
        - img [ref=e6]
        - generic [ref=e11]:
          - generic [ref=e12]: InkApp
          - generic [ref=e13]: TATTOO STUDIO
      - navigation [ref=e14]:
        - button "INICIAR SESIÓN" [ref=e15]
        - button "REGISTRARSE" [ref=e16]
  - main [ref=e18]:
    - generic [ref=e20]:
      - generic [ref=e21]:
        - img [ref=e24]
        - heading "Completa tu perfil" [level=1] [ref=e29]
        - paragraph [ref=e30]: Cuéntanos sobre ti para crear tu portfolio
      - generic [ref=e34]:
        - generic [ref=e35]: Perfil
        - generic [ref=e36]: Estilos
        - generic [ref=e37]: Finalizar
      - generic [ref=e40]:
        - generic [ref=e41]:
          - img [ref=e43]
          - generic [ref=e49]:
            - heading "Estilos de tatuaje" [level=2] [ref=e50]
            - paragraph [ref=e51]: Selecciona tus especialidades
        - generic [ref=e52]:
          - button "Traditional" [ref=e53]
          - button "Neotraditional" [ref=e54]
          - button "Blackwork" [ref=e55]
          - button "Japanese" [ref=e56]
          - button "Tribal" [ref=e57]
          - button "Realism" [ref=e58]
          - button "Watercolor" [ref=e59]
          - button "Minimalist" [ref=e60]
          - button "Geometric" [ref=e61]
          - button "Script" [ref=e62]
          - button "Illustrative" [ref=e63]
          - button "Black and Grey" [ref=e64]
          - button "Color" [ref=e65]
          - button "Dotwork" [ref=e66]
          - button "Fine Line" [ref=e67]
        - generic [ref=e68]:
          - button "Atrás" [ref=e69]
          - button "Continuar" [disabled] [ref=e70]:
            - text: Continuar
            - img [ref=e71]
  - button "Open Next.js Dev Tools" [ref=e78] [cursor=pointer]:
    - img [ref=e79]
  - alert [ref=e82]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | test.describe('🎨 Sign-Up y Onboarding de Artista', () => {
  4   |   
  5   |   test('should display sign-up page with InkApp branding', async ({ page }) => {
  6   |     await page.goto('/sign-up')
  7   |     
  8   |     // Esperar a que cargue la página
  9   |     await page.waitForLoadState('networkidle')
  10  |     
  11  |     // Verificar elementos visibles
  12  |     await expect(page.locator('text=Crea tu cuenta')).toBeVisible()
  13  |     await expect(page.locator('text=Únete a InkApp')).toBeVisible()
  14  |     
  15  |     // Tomar screenshot
  16  |     await page.screenshot({ 
  17  |       path: 'test-results/screenshots/sign-up-page.png',
  18  |       fullPage: true 
  19  |     })
  20  |   })
  21  | 
  22  |   test('should display onboarding page', async ({ page }) => {
  23  |     // En modo demo, podemos acceder directamente
  24  |     await page.goto('/onboarding')
  25  |     
  26  |     await page.waitForLoadState('networkidle')
  27  |     
  28  |     // Verificar elementos del onboarding
  29  |     await expect(page.locator('text=Completa tu perfil')).toBeVisible()
  30  |     await expect(page.locator('text=Cuéntanos sobre ti')).toBeVisible()
  31  |     
  32  |     // Verificar que estamos en el paso 1
  33  |     await expect(page.locator('text=Información básica')).toBeVisible()
  34  |     
  35  |     // Tomar screenshot
  36  |     await page.screenshot({ 
  37  |       path: 'test-results/screenshots/onboarding-step-1.png',
  38  |       fullPage: true 
  39  |     })
  40  |   })
  41  | 
  42  |   test('should show step 2 - Tattoo styles selection', async ({ page }) => {
  43  |     await page.goto('/onboarding')
  44  |     await page.waitForLoadState('networkidle')
  45  |     
  46  |     // Completar paso 1
  47  |     await page.fill('input[placeholder*="Alex"]', 'Demo Tattoo Artist')
  48  |     await page.fill('textarea[placeholder*="historia"]', 'Especialista en tatuajes tradicionales con 5 años de experiencia.')
  49  |     
  50  |     // Click en continuar
  51  |     await page.click('button:has-text("Continuar")')
  52  |     await page.waitForTimeout(500)
  53  |     
  54  |     // Verificar que estamos en el paso 2
  55  |     await expect(page.locator('text=Estilos de tatuaje')).toBeVisible()
  56  |     
  57  |     // Verificar que hay estilos disponibles
> 58  |     await expect(page.locator('text=Traditional')).toBeVisible()
      |                                                    ^ Error: expect(locator).toBeVisible() failed
  59  |     await expect(page.locator('text=Neotraditional')).toBeVisible()
  60  |     
  61  |     // Tomar screenshot
  62  |     await page.screenshot({ 
  63  |       path: 'test-results/screenshots/onboarding-step-2.png',
  64  |       fullPage: true 
  65  |     })
  66  |   })
  67  | 
  68  |   test('should show step 3 - Business info', async ({ page }) => {
  69  |     await page.goto('/onboarding')
  70  |     await page.waitForLoadState('networkidle')
  71  |     
  72  |     // Completar paso 1
  73  |     await page.fill('input[placeholder*="Alex"]', 'Demo Tattoo Artist')
  74  |     await page.fill('textarea[placeholder*="historia"]', 'Especialista en tatuajes tradicionales con 5 años de experiencia.')
  75  |     await page.click('button:has-text("Continuar")')
  76  |     await page.waitForTimeout(500)
  77  |     
  78  |     // Completar paso 2 - seleccionar estilos
  79  |     await page.click('text=Traditional')
  80  |     await page.click('text=Neotraditional')
  81  |     await page.click('button:has-text("Continuar")')
  82  |     await page.waitForTimeout(500)
  83  |     
  84  |     // Verificar que estamos en el paso 3
  85  |     await expect(page.locator('text=Información de negocio')).toBeVisible()
  86  |     await expect(page.locator('text=Depósito requerido')).toBeVisible()
  87  |     
  88  |     // Tomar screenshot
  89  |     await page.screenshot({ 
  90  |       path: 'test-results/screenshots/onboarding-step-3.png',
  91  |       fullPage: true 
  92  |     })
  93  |   })
  94  | 
  95  |   test('should show full onboarding flow', async ({ page }) => {
  96  |     await page.goto('/onboarding')
  97  |     await page.waitForLoadState('networkidle')
  98  |     
  99  |     // Screenshot inicial
  100 |     await page.screenshot({ path: 'test-results/screenshots/onboarding-flow-01-start.png' })
  101 |     
  102 |     // Paso 1: Información básica
  103 |     await page.fill('input[placeholder*="Alex"]', 'Demo Tattoo Artist')
  104 |     await page.fill('textarea[placeholder*="historia"]', 'Especialista en tatuajes tradicionales con 5 años de experiencia. Estudio ubicado en Madrid.')
  105 |     await page.click('button:has-text("Continuar")')
  106 |     await page.waitForTimeout(500)
  107 |     await page.screenshot({ path: 'test-results/screenshots/onboarding-flow-02-styles.png' })
  108 |     
  109 |     // Paso 2: Estilos
  110 |     await page.click('text=Traditional')
  111 |     await page.click('text=Blackwork')
  112 |     await page.click('text=Japanese')
  113 |     await page.click('button:has-text("Continuar")')
  114 |     await page.waitForTimeout(500)
  115 |     await page.screenshot({ path: 'test-results/screenshots/onboarding-flow-03-business.png' })
  116 |     
  117 |     // Paso 3: Información de negocio
  118 |     await page.fill('input[type="number"]', '50')
  119 |     await page.fill('input[placeholder*="@tu_usuario"]', '@demotattoo')
  120 |     await page.screenshot({ path: 'test-results/screenshots/onboarding-flow-04-complete.png' })
  121 |   })
  122 | })
  123 | 
```