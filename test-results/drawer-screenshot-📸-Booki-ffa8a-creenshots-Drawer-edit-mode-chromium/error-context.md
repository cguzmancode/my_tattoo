# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: drawer-screenshot.spec.ts >> 📸 Booking Detail Drawer Screenshots >> Drawer edit mode
- Location: __tests__/e2e/drawer-screenshot.spec.ts:26:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has(.lucide-edit2)')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e7]:
      - img [ref=e8]
    - generic [ref=e11]:
      - button "Open issues overlay" [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: "0"
          - generic [ref=e15]: "1"
        - generic [ref=e16]: Issue
      - button "Collapse issues badge" [ref=e17]:
        - img [ref=e18]
  - banner [ref=e20]:
    - generic [ref=e21]:
      - link "InkApp TATTOO STUDIO" [ref=e22] [cursor=pointer]:
        - /url: /
        - img [ref=e24]
        - generic [ref=e29]:
          - generic [ref=e30]: InkApp
          - generic [ref=e31]: TATTOO STUDIO
      - navigation [ref=e32]:
        - button "INICIAR SESIÓN" [ref=e33]
        - button "REGISTRARSE" [ref=e34]
  - main [ref=e36]:
    - generic [ref=e37]:
      - complementary [ref=e38]:
        - link "InkApp DASHBOARD" [ref=e40] [cursor=pointer]:
          - /url: /dashboard
          - img [ref=e42]
          - generic [ref=e46]:
            - generic [ref=e47]: InkApp
            - generic [ref=e48]: DASHBOARD
        - navigation [ref=e49]:
          - generic [ref=e50]: MENÚ
          - link "Overview" [ref=e52] [cursor=pointer]:
            - /url: /dashboard
            - img [ref=e54]
            - generic [ref=e55]: Overview
            - img [ref=e57]
          - link "Citas" [ref=e60] [cursor=pointer]:
            - /url: /dashboard/bookings
            - img [ref=e63]
            - generic [ref=e65]: Citas
            - img [ref=e67]
          - link "Calendario" [ref=e70] [cursor=pointer]:
            - /url: /dashboard/calendar
            - img [ref=e71]
            - generic [ref=e73]: Calendario
          - link "Ajustes" [ref=e75] [cursor=pointer]:
            - /url: /dashboard/settings
            - img [ref=e76]
            - generic [ref=e79]: Ajustes
        - generic [ref=e82]:
          - paragraph [ref=e83]: Alex Rivera
          - paragraph [ref=e84]: Artista
      - main [ref=e85]:
        - generic [ref=e87]:
          - generic [ref=e88]:
            - generic [ref=e89]:
              - heading "Citas" [level=1] [ref=e90]
              - paragraph [ref=e91]: Gestiona las solicitudes de tus clientes
            - generic [ref=e93]:
              - img [ref=e94]
              - generic [ref=e96]: 8 total
          - generic [ref=e97]:
            - generic [ref=e98]:
              - img [ref=e99]
              - textbox "Buscar por cliente..." [ref=e102]
            - button "Filtrar" [ref=e104]:
              - img [ref=e105]
              - text: Filtrar
          - generic [ref=e108]:
            - generic [ref=e110] [cursor=pointer]:
              - generic [ref=e111]:
                - generic [ref=e112]:
                  - generic [ref=e114]: M
                  - generic [ref=e116]:
                    - heading "María García" [level=3] [ref=e117]
                    - paragraph [ref=e118]: maria@example.com
                - generic [ref=e119]: Pendiente
              - generic [ref=e121]:
                - generic [ref=e122]:
                  - generic [ref=e123]:
                    - img [ref=e125]
                    - generic [ref=e129]: Forearm
                  - generic [ref=e135]: Medium (10-15cm)
                - generic [ref=e136]:
                  - generic [ref=e137]: 🎨
                  - paragraph [ref=e138]: "\"Quiero un diseño de una rosa tradicional con un banner que d...\""
              - generic [ref=e139]:
                - generic [ref=e141]:
                  - img [ref=e142]
                  - generic [ref=e145]: 1/10/2024
                - generic [ref=e146]:
                  - generic [ref=e147]: Ver detalles
                  - img [ref=e148]
            - generic [ref=e153] [cursor=pointer]:
              - generic [ref=e154]:
                - generic [ref=e155]:
                  - generic [ref=e157]: C
                  - generic [ref=e159]:
                    - heading "Carlos Rodríguez" [level=3] [ref=e160]
                    - paragraph [ref=e161]: carlos@example.com
                - generic [ref=e162]: Pendiente
              - generic [ref=e164]:
                - generic [ref=e165]:
                  - generic [ref=e166]:
                    - img [ref=e168]
                    - generic [ref=e171]: Chest
                  - generic [ref=e177]: Large (20-30cm)
                - generic [ref=e178]:
                  - generic [ref=e179]: 🎨
                  - paragraph [ref=e180]: "\"Dragón japonés estilo irezumi, en blanco y negro con sombrea...\""
              - generic [ref=e181]:
                - generic [ref=e183]:
                  - img [ref=e184]
                  - generic [ref=e187]: 1/12/2024
                - generic [ref=e188]:
                  - generic [ref=e189]: Ver detalles
                  - img [ref=e190]
            - generic [ref=e195] [cursor=pointer]:
              - generic [ref=e196]:
                - generic [ref=e197]:
                  - generic [ref=e199]: L
                  - generic [ref=e201]:
                    - heading "Laura Martínez" [level=3] [ref=e202]
                    - paragraph [ref=e203]: laura@example.com
                - generic [ref=e204]: Aceptada
              - generic [ref=e206]:
                - generic [ref=e207]:
                  - generic [ref=e208]:
                    - img [ref=e210]
                    - generic [ref=e213]: Shoulder
                  - generic [ref=e219]: Small (5-8cm)
                - generic [ref=e220]:
                  - generic [ref=e221]: 🎨
                  - paragraph [ref=e222]: "\"Tatuaje minimalista de una luna con una cara sutil. Estilo f...\""
              - generic [ref=e223]:
                - generic [ref=e225]:
                  - img [ref=e226]
                  - generic [ref=e229]: 1/8/2024
                - generic [ref=e230]:
                  - generic [ref=e231]: Ver detalles
                  - img [ref=e232]
            - generic [ref=e237] [cursor=pointer]:
              - generic [ref=e238]:
                - generic [ref=e239]:
                  - generic [ref=e241]: J
                  - generic [ref=e243]:
                    - heading "Juan López" [level=3] [ref=e244]
                    - paragraph [ref=e245]: juan@example.com
                - generic [ref=e246]: Aceptada
              - generic [ref=e248]:
                - generic [ref=e249]:
                  - generic [ref=e250]:
                    - img [ref=e252]
                    - generic [ref=e255]: Back
                  - generic [ref=e261]: Extra Large (Full Back)
                - generic [ref=e262]:
                  - generic [ref=e263]: 🎨
                  - paragraph [ref=e264]: "\"Calavera mexicana con elementos florales y un reloj. Estilo ...\""
              - generic [ref=e265]:
                - generic [ref=e267]:
                  - img [ref=e268]
                  - generic [ref=e271]: 1/5/2024
                - generic [ref=e272]:
                  - generic [ref=e273]: Ver detalles
                  - img [ref=e274]
            - generic [ref=e279] [cursor=pointer]:
              - generic [ref=e280]:
                - generic [ref=e281]:
                  - generic [ref=e283]: A
                  - generic [ref=e285]:
                    - heading "Ana Fernández" [level=3] [ref=e286]
                    - paragraph [ref=e287]: ana@example.com
                - generic [ref=e288]: Confirmada
              - generic [ref=e290]:
                - generic [ref=e291]:
                  - generic [ref=e292]:
                    - img [ref=e294]
                    - generic [ref=e297]: Thigh
                  - generic [ref=e303]: Large (20-25cm)
                - generic [ref=e304]:
                  - generic [ref=e305]: 🎨
                  - paragraph [ref=e306]: "\"Serpiente enroscada con rosas y dagas. Estilo tradicional co...\""
              - generic [ref=e307]:
                - generic [ref=e309]:
                  - img [ref=e310]
                  - generic [ref=e313]: 1/1/2024
                - generic [ref=e314]:
                  - generic [ref=e315]: Ver detalles
                  - img [ref=e316]
            - generic [ref=e321] [cursor=pointer]:
              - generic [ref=e322]:
                - generic [ref=e323]:
                  - generic [ref=e325]: P
                  - generic [ref=e327]:
                    - heading "Pedro Sánchez" [level=3] [ref=e328]
                    - paragraph [ref=e329]: pedro@example.com
                - generic [ref=e330]: Confirmada
              - generic [ref=e332]:
                - generic [ref=e333]:
                  - generic [ref=e334]:
                    - img [ref=e336]
                    - generic [ref=e339]: Calf
                  - generic [ref=e345]: Medium (12-18cm)
                - generic [ref=e346]:
                  - generic [ref=e347]: 🎨
                  - paragraph [ref=e348]: "\"Ancla con cadenas y rosas. Estilo tradicional americano, col...\""
              - generic [ref=e349]:
                - generic [ref=e351]:
                  - img [ref=e352]
                  - generic [ref=e355]: 12/28/2023
                - generic [ref=e356]:
                  - generic [ref=e357]: Ver detalles
                  - img [ref=e358]
            - generic [ref=e363] [cursor=pointer]:
              - generic [ref=e364]:
                - generic [ref=e365]:
                  - generic [ref=e367]: S
                  - generic [ref=e369]:
                    - heading "Sofía Ruiz" [level=3] [ref=e370]
                    - paragraph [ref=e371]: sofia@example.com
                - generic [ref=e372]: Cancelada
              - generic [ref=e374]:
                - generic [ref=e375]:
                  - generic [ref=e376]:
                    - img [ref=e378]
                    - generic [ref=e381]: Wrist
                  - generic [ref=e387]: Small (5-7cm)
                - generic [ref=e388]:
                  - generic [ref=e389]: 🎨
                  - paragraph [ref=e390]: "\"Letras con el nombre de mi hija en estilo script.\""
              - generic [ref=e391]:
                - generic [ref=e393]:
                  - img [ref=e394]
                  - generic [ref=e397]: 1/3/2024
                - generic [ref=e398]:
                  - generic [ref=e399]: Ver detalles
                  - img [ref=e400]
            - generic [ref=e405] [cursor=pointer]:
              - generic [ref=e406]:
                - generic [ref=e407]:
                  - generic [ref=e409]: M
                  - generic [ref=e411]:
                    - heading "Miguel Torres" [level=3] [ref=e412]
                    - paragraph [ref=e413]: miguel@example.com
                - generic [ref=e414]: Pendiente
              - generic [ref=e416]:
                - generic [ref=e417]:
                  - generic [ref=e418]:
                    - img [ref=e420]
                    - generic [ref=e424]: Upper Arm
                  - generic [ref=e430]: Medium (10-14cm)
                - generic [ref=e431]:
                  - generic [ref=e432]: 🎨
                  - paragraph [ref=e433]: "\"Lobo aullando a la luna con bosque de fondo. Estilo blackwor...\""
              - generic [ref=e434]:
                - generic [ref=e436]:
                  - img [ref=e437]
                  - generic [ref=e440]: 1/13/2024
                - generic [ref=e441]:
                  - generic [ref=e442]: Ver detalles
                  - img [ref=e443]
          - generic [ref=e448]:
            - generic [ref=e449]:
              - generic [ref=e450]:
                - generic [ref=e451]: M
                - generic [ref=e452]:
                  - heading "María García" [level=2] [ref=e453]
                  - generic [ref=e454]:
                    - generic [ref=e455]: Pendiente
                    - generic [ref=e457]: "#-001"
              - generic [ref=e458]:
                - button [ref=e459]:
                  - img [ref=e460]
                - button [ref=e462]:
                  - img [ref=e463]
            - generic [ref=e466]:
              - generic [ref=e467]:
                - heading "Información de Contacto" [level=3] [ref=e468]
                - generic [ref=e469]:
                  - link "Email maria@example.com" [ref=e470] [cursor=pointer]:
                    - /url: mailto:maria@example.com
                    - img [ref=e472]
                    - generic [ref=e475]:
                      - paragraph [ref=e476]: Email
                      - paragraph [ref=e477]: maria@example.com
                  - link "Teléfono +34 612 345 678" [ref=e478] [cursor=pointer]:
                    - /url: tel:+34 612 345 678
                    - img [ref=e480]
                    - generic [ref=e482]:
                      - paragraph [ref=e483]: Teléfono
                      - paragraph [ref=e484]: +34 612 345 678
              - generic [ref=e485]:
                - heading "Detalles del Tatuaje" [level=3] [ref=e486]
                - generic [ref=e487]:
                  - generic [ref=e488]:
                    - img [ref=e490]
                    - generic [ref=e496]:
                      - paragraph [ref=e497]: Estilo
                      - paragraph [ref=e498]: No especificado
                  - generic [ref=e499]:
                    - generic [ref=e500]:
                      - img [ref=e502]
                      - generic [ref=e505]:
                        - paragraph [ref=e506]: Zona
                        - paragraph [ref=e507]: Forearm
                    - generic [ref=e508]:
                      - img [ref=e510]
                      - generic [ref=e513]:
                        - paragraph [ref=e514]: Tamaño
                        - paragraph [ref=e515]: Medium (10-15cm)
                  - generic [ref=e516]:
                    - paragraph [ref=e517]: Descripción
                    - paragraph [ref=e518]: "\"Quiero un diseño de una rosa tradicional con un banner que diga \"Mamá\". Colores vivos, estilo old school.\""
              - generic [ref=e519]:
                - heading "Fechas" [level=3] [ref=e520]
                - generic [ref=e522]:
                  - img [ref=e524]
                  - generic [ref=e526]:
                    - paragraph [ref=e527]: Fechas preferidas
                    - generic [ref=e528]:
                      - generic [ref=e529]: 15 feb
                      - generic [ref=e530]: 16 feb
              - generic [ref=e531]:
                - heading "Imágenes de Referencia" [level=3] [ref=e532]
                - generic [ref=e533]:
                  - paragraph [ref=e534]: No hay imágenes de referencia
                  - paragraph [ref=e535]: El cliente no ha subido imágenes
            - generic [ref=e536]:
              - generic [ref=e537]:
                - button "Aceptar" [ref=e538]
                - button "Rechazar" [ref=e539]
              - button "Contactar Cliente" [ref=e540]
  - alert [ref=e541]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('📸 Booking Detail Drawer Screenshots', () => {
  4  |   test('Full drawer view', async ({ page }) => {
  5  |     // Ir a la página de bookings
  6  |     await page.goto('/dashboard/bookings')
  7  |     await page.waitForTimeout(2000)
  8  | 
  9  |     // Hacer click en la primera card (María García)
  10 |     const firstCard = await page.locator('.space-y-4 > div').first()
  11 |     await firstCard.click()
  12 |     await page.waitForTimeout(1000)
  13 | 
  14 |     // Esperar a que el drawer se abra
  15 |     await page.waitForSelector('text=Información de Contacto')
  16 | 
  17 |     // Screenshot del drawer en vista
  18 |     await page.screenshot({
  19 |       path: 'test-results/screenshots/drawer-view.png',
  20 |       fullPage: true
  21 |     })
  22 | 
  23 |     console.log('✅ Screenshot: Drawer view mode')
  24 |   })
  25 | 
  26 |   test('Drawer edit mode', async ({ page }) => {
  27 |     // Ir a la página de bookings
  28 |     await page.goto('/dashboard/bookings')
  29 |     await page.waitForTimeout(2000)
  30 | 
  31 |     // Hacer click en la primera card
  32 |     const firstCard = await page.locator('.space-y-4 > div').first()
  33 |     await firstCard.click()
  34 |     await page.waitForTimeout(1000)
  35 | 
  36 |     // Esperar a que el drawer se abra
  37 |     await page.waitForSelector('text=Información de Contacto')
  38 | 
  39 |     // Click en botón de editar (buscar el botón con icono de lápiz)
> 40 |     await page.click('button:has(.lucide-edit2)')
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  41 |     await page.waitForTimeout(500)
  42 | 
  43 |     // Screenshot del drawer en modo edición
  44 |     await page.screenshot({
  45 |       path: 'test-results/screenshots/drawer-edit.png',
  46 |       fullPage: true
  47 |     })
  48 | 
  49 |     console.log('✅ Screenshot: Drawer edit mode')
  50 |   })
  51 | })
  52 | 
```