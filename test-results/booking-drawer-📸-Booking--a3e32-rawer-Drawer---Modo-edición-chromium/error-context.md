# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-drawer.spec.ts >> 📸 Booking Detail Drawer >> Drawer - Modo edición
- Location: __tests__/e2e/booking-drawer.spec.ts:22:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button[title="Editar"]')

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
            - img [ref=e89]
            - generic [ref=e91]:
              - paragraph [ref=e92]: Modo Demo
              - paragraph [ref=e93]: Estás viendo datos de demostración. Inicia sesión para ver tus datos reales.
          - generic [ref=e94]:
            - generic [ref=e95]:
              - heading "Citas" [level=1] [ref=e96]
              - paragraph [ref=e97]: Gestiona las solicitudes de tus clientes
            - generic [ref=e99]:
              - img [ref=e100]
              - generic [ref=e102]: 8 total
          - generic [ref=e103]:
            - generic [ref=e105]:
              - img [ref=e106]
              - textbox "Buscar por cliente..." [ref=e109]
            - generic [ref=e110]:
              - img [ref=e111]
              - button "Todas" [ref=e113]
              - button "Pendientes" [ref=e114]
              - button "Aceptadas" [ref=e115]
              - button "Confirmadas" [ref=e116]
              - button "Completadas" [ref=e117]
              - button "Canceladas" [ref=e118]
          - generic [ref=e120]:
            - generic [ref=e122] [cursor=pointer]:
              - generic [ref=e123]:
                - generic [ref=e124]:
                  - generic [ref=e126]: M
                  - generic [ref=e128]:
                    - heading "María García" [level=3] [ref=e129]
                    - paragraph [ref=e130]: maria@example.com
                - generic [ref=e131]: Pendiente
              - generic [ref=e133]:
                - generic [ref=e134]:
                  - generic [ref=e135]:
                    - img [ref=e137]
                    - generic [ref=e141]: Forearm
                  - generic [ref=e147]: Medium (10-15cm)
                - generic [ref=e148]:
                  - generic [ref=e149]: 🎨
                  - paragraph [ref=e150]: "\"Quiero un diseño de una rosa tradicional con un banner que d...\""
              - generic [ref=e151]:
                - generic [ref=e153]:
                  - img [ref=e154]
                  - generic [ref=e157]: 1/10/2024
                - generic [ref=e158]:
                  - generic [ref=e159]: Ver detalles
                  - img [ref=e160]
            - generic [ref=e165] [cursor=pointer]:
              - generic [ref=e166]:
                - generic [ref=e167]:
                  - generic [ref=e169]: C
                  - generic [ref=e171]:
                    - heading "Carlos Rodríguez" [level=3] [ref=e172]
                    - paragraph [ref=e173]: carlos@example.com
                - generic [ref=e174]: Pendiente
              - generic [ref=e176]:
                - generic [ref=e177]:
                  - generic [ref=e178]:
                    - img [ref=e180]
                    - generic [ref=e183]: Chest
                  - generic [ref=e189]: Large (20-30cm)
                - generic [ref=e190]:
                  - generic [ref=e191]: 🎨
                  - paragraph [ref=e192]: "\"Dragón japonés estilo irezumi, en blanco y negro con sombrea...\""
              - generic [ref=e193]:
                - generic [ref=e195]:
                  - img [ref=e196]
                  - generic [ref=e199]: 1/12/2024
                - generic [ref=e200]:
                  - generic [ref=e201]: Ver detalles
                  - img [ref=e202]
            - generic [ref=e207] [cursor=pointer]:
              - generic [ref=e208]:
                - generic [ref=e209]:
                  - generic [ref=e211]: L
                  - generic [ref=e213]:
                    - heading "Laura Martínez" [level=3] [ref=e214]
                    - paragraph [ref=e215]: laura@example.com
                - generic [ref=e216]: Aceptada
              - generic [ref=e218]:
                - generic [ref=e219]:
                  - generic [ref=e220]:
                    - img [ref=e222]
                    - generic [ref=e225]: Shoulder
                  - generic [ref=e231]: Small (5-8cm)
                - generic [ref=e232]:
                  - generic [ref=e233]: 🎨
                  - paragraph [ref=e234]: "\"Tatuaje minimalista de una luna con una cara sutil. Estilo f...\""
              - generic [ref=e235]:
                - generic [ref=e237]:
                  - img [ref=e238]
                  - generic [ref=e241]: 1/8/2024
                - generic [ref=e242]:
                  - generic [ref=e243]: Ver detalles
                  - img [ref=e244]
            - generic [ref=e249] [cursor=pointer]:
              - generic [ref=e250]:
                - generic [ref=e251]:
                  - generic [ref=e253]: J
                  - generic [ref=e255]:
                    - heading "Juan López" [level=3] [ref=e256]
                    - paragraph [ref=e257]: juan@example.com
                - generic [ref=e258]: Aceptada
              - generic [ref=e260]:
                - generic [ref=e261]:
                  - generic [ref=e262]:
                    - img [ref=e264]
                    - generic [ref=e267]: Back
                  - generic [ref=e273]: Extra Large (Full Back)
                - generic [ref=e274]:
                  - generic [ref=e275]: 🎨
                  - paragraph [ref=e276]: "\"Calavera mexicana con elementos florales y un reloj. Estilo ...\""
              - generic [ref=e277]:
                - generic [ref=e279]:
                  - img [ref=e280]
                  - generic [ref=e283]: 1/5/2024
                - generic [ref=e284]:
                  - generic [ref=e285]: Ver detalles
                  - img [ref=e286]
            - generic [ref=e291] [cursor=pointer]:
              - generic [ref=e292]:
                - generic [ref=e293]:
                  - generic [ref=e295]: A
                  - generic [ref=e297]:
                    - heading "Ana Fernández" [level=3] [ref=e298]
                    - paragraph [ref=e299]: ana@example.com
                - generic [ref=e300]: Confirmada
              - generic [ref=e302]:
                - generic [ref=e303]:
                  - generic [ref=e304]:
                    - img [ref=e306]
                    - generic [ref=e309]: Thigh
                  - generic [ref=e315]: Large (20-25cm)
                - generic [ref=e316]:
                  - generic [ref=e317]: 🎨
                  - paragraph [ref=e318]: "\"Serpiente enroscada con rosas y dagas. Estilo tradicional co...\""
              - generic [ref=e319]:
                - generic [ref=e321]:
                  - img [ref=e322]
                  - generic [ref=e325]: 1/1/2024
                - generic [ref=e326]:
                  - generic [ref=e327]: Ver detalles
                  - img [ref=e328]
            - generic [ref=e333] [cursor=pointer]:
              - generic [ref=e334]:
                - generic [ref=e335]:
                  - generic [ref=e337]: P
                  - generic [ref=e339]:
                    - heading "Pedro Sánchez" [level=3] [ref=e340]
                    - paragraph [ref=e341]: pedro@example.com
                - generic [ref=e342]: Confirmada
              - generic [ref=e344]:
                - generic [ref=e345]:
                  - generic [ref=e346]:
                    - img [ref=e348]
                    - generic [ref=e351]: Calf
                  - generic [ref=e357]: Medium (12-18cm)
                - generic [ref=e358]:
                  - generic [ref=e359]: 🎨
                  - paragraph [ref=e360]: "\"Ancla con cadenas y rosas. Estilo tradicional americano, col...\""
              - generic [ref=e361]:
                - generic [ref=e363]:
                  - img [ref=e364]
                  - generic [ref=e367]: 12/28/2023
                - generic [ref=e368]:
                  - generic [ref=e369]: Ver detalles
                  - img [ref=e370]
            - generic [ref=e375] [cursor=pointer]:
              - generic [ref=e376]:
                - generic [ref=e377]:
                  - generic [ref=e379]: S
                  - generic [ref=e381]:
                    - heading "Sofía Ruiz" [level=3] [ref=e382]
                    - paragraph [ref=e383]: sofia@example.com
                - generic [ref=e384]: Cancelada
              - generic [ref=e386]:
                - generic [ref=e387]:
                  - generic [ref=e388]:
                    - img [ref=e390]
                    - generic [ref=e393]: Wrist
                  - generic [ref=e399]: Small (5-7cm)
                - generic [ref=e400]:
                  - generic [ref=e401]: 🎨
                  - paragraph [ref=e402]: "\"Letras con el nombre de mi hija en estilo script.\""
              - generic [ref=e403]:
                - generic [ref=e405]:
                  - img [ref=e406]
                  - generic [ref=e409]: 1/3/2024
                - generic [ref=e410]:
                  - generic [ref=e411]: Ver detalles
                  - img [ref=e412]
            - generic [ref=e417] [cursor=pointer]:
              - generic [ref=e418]:
                - generic [ref=e419]:
                  - generic [ref=e421]: M
                  - generic [ref=e423]:
                    - heading "Miguel Torres" [level=3] [ref=e424]
                    - paragraph [ref=e425]: miguel@example.com
                - generic [ref=e426]: Pendiente
              - generic [ref=e428]:
                - generic [ref=e429]:
                  - generic [ref=e430]:
                    - img [ref=e432]
                    - generic [ref=e436]: Upper Arm
                  - generic [ref=e442]: Medium (10-14cm)
                - generic [ref=e443]:
                  - generic [ref=e444]: 🎨
                  - paragraph [ref=e445]: "\"Lobo aullando a la luna con bosque de fondo. Estilo blackwor...\""
              - generic [ref=e446]:
                - generic [ref=e448]:
                  - img [ref=e449]
                  - generic [ref=e452]: 1/13/2024
                - generic [ref=e453]:
                  - generic [ref=e454]: Ver detalles
                  - img [ref=e455]
          - generic [ref=e460]:
            - generic [ref=e461]:
              - generic [ref=e462]:
                - generic [ref=e463]: M
                - generic [ref=e464]:
                  - heading "María García" [level=2] [ref=e465]
                  - generic [ref=e466]:
                    - generic [ref=e467]: Pendiente
                    - generic [ref=e469]: "#-001"
              - generic [ref=e470]:
                - button [ref=e471]:
                  - img [ref=e472]
                - button [ref=e474]:
                  - img [ref=e475]
            - generic [ref=e478]:
              - generic [ref=e479]:
                - heading "Información de Contacto" [level=3] [ref=e480]
                - generic [ref=e481]:
                  - link "Email maria@example.com" [ref=e482] [cursor=pointer]:
                    - /url: mailto:maria@example.com
                    - img [ref=e484]
                    - generic [ref=e487]:
                      - paragraph [ref=e488]: Email
                      - paragraph [ref=e489]: maria@example.com
                  - link "Teléfono +34 612 345 678" [ref=e490] [cursor=pointer]:
                    - /url: tel:+34 612 345 678
                    - img [ref=e492]
                    - generic [ref=e494]:
                      - paragraph [ref=e495]: Teléfono
                      - paragraph [ref=e496]: +34 612 345 678
              - generic [ref=e497]:
                - heading "Detalles del Tatuaje" [level=3] [ref=e498]
                - generic [ref=e499]:
                  - generic [ref=e500]:
                    - img [ref=e502]
                    - generic [ref=e508]:
                      - paragraph [ref=e509]: Estilo
                      - paragraph [ref=e510]: Traditional
                  - generic [ref=e511]:
                    - generic [ref=e512]:
                      - img [ref=e514]
                      - generic [ref=e517]:
                        - paragraph [ref=e518]: Zona
                        - paragraph [ref=e519]: Forearm
                    - generic [ref=e520]:
                      - img [ref=e522]
                      - generic [ref=e525]:
                        - paragraph [ref=e526]: Tamaño
                        - paragraph [ref=e527]: Medium (10-15cm)
                  - generic [ref=e528]:
                    - paragraph [ref=e529]: Descripción
                    - paragraph [ref=e530]: "\"Quiero un diseño de una rosa tradicional con un banner que diga \"Mamá\". Colores vivos, estilo old school.\""
              - generic [ref=e531]:
                - heading "Fechas" [level=3] [ref=e532]
                - generic [ref=e534]:
                  - img [ref=e536]
                  - generic [ref=e538]:
                    - paragraph [ref=e539]: Fechas preferidas
                    - generic [ref=e540]:
                      - generic [ref=e541]: 15 feb
                      - generic [ref=e542]: 16 feb
              - generic [ref=e543]:
                - heading "Imágenes de Referencia" [level=3] [ref=e544]
                - generic [ref=e545]:
                  - paragraph [ref=e546]: No hay imágenes de referencia
                  - paragraph [ref=e547]: El cliente no ha subido imágenes
            - generic [ref=e548]:
              - generic [ref=e549]:
                - button "Aceptar" [ref=e550]
                - button "Rechazar" [ref=e551]
              - button "Contactar Cliente" [ref=e552]
  - alert [ref=e553]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('📸 Booking Detail Drawer', () => {
  4  |   test('Drawer - Vista de detalle', async ({ page }) => {
  5  |     // Ir a la página de bookings
  6  |     await page.goto('/dashboard/bookings')
  7  |     await page.waitForTimeout(2000)
  8  | 
  9  |     // Hacer click en la primera cita
  10 |     await page.click('[data-testid="booking-card"]:first-of-type')
  11 |     await page.waitForTimeout(1000)
  12 | 
  13 |     // Screenshot del drawer abierto
  14 |     await page.screenshot({
  15 |       path: 'test-results/screenshots/booking-drawer-view.png',
  16 |       fullPage: false
  17 |     })
  18 | 
  19 |     console.log('✅ Screenshot: Drawer en modo vista')
  20 |   })
  21 | 
  22 |   test('Drawer - Modo edición', async ({ page }) => {
  23 |     // Ir a la página de bookings
  24 |     await page.goto('/dashboard/bookings')
  25 |     await page.waitForTimeout(2000)
  26 | 
  27 |     // Hacer click en la primera cita
  28 |     await page.click('[data-testid="booking-card"]:first-of-type')
  29 |     await page.waitForTimeout(1000)
  30 | 
  31 |     // Click en botón de editar
> 32 |     await page.click('button[title="Editar"]')
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  33 |     await page.waitForTimeout(500)
  34 | 
  35 |     // Screenshot del drawer en modo edición
  36 |     await page.screenshot({
  37 |       path: 'test-results/screenshots/booking-drawer-edit.png',
  38 |       fullPage: false
  39 |     })
  40 | 
  41 |     console.log('✅ Screenshot: Drawer en modo edición')
  42 |   })
  43 | })
  44 | 
```