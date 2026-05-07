# 📸 Screenshot Checklist — CLEV3D

## ✅ Pasos para Capturar Screenshots

### 1️⃣ Prepara tu ambiente
```powershell
cd "C:\Users\david\.claude\projects\Pagina Web\centro-logistico-3d"
npm run dev
```
Espera a que diga "VITE v5.x.x ready in XXX ms" → Abre http://localhost:5173

---

### 2️⃣ Captura cada screenshot

#### Screenshot 1: Main Dashboard (Hero Image)
- **Archivo**: `screenshot-main-dashboard.png`
- **Qué mostrar**: Toda la pantalla con dashboard visible
- **Dimensiones**: 1920x1080 recomendado
- **Pasos**:
  1. Zooming out (Scroll) para ver todos los 5 sectores
  2. Posiciona el zoom para que se vea completo
  3. Toma screenshot de toda la ventana (sin barra de direcciones)

---

#### Screenshot 2: 3D Viewer Close-up
- **Archivo**: `screenshot-3d-viewer.png`
- **Qué mostrar**: Solo la escena 3D con detalles de sectores
- **Pasos**:
  1. Haz zoom in (Scroll) para ver detalle
  2. Rota la cámara para mostrar 3-4 sectores claramente
  3. Asegúrate que se vean las partículas de Order Flow (líneas cyan)
  4. Screenshot solo del área 3D

---

#### Screenshot 3: Dashboard Left Side
- **Archivo**: `screenshot-dashboard-left.png`
- **Qué mostrar**: Panel izquierdo con Waterfall + AI Recommendations
- **Pasos**:
  1. Maximiza el zoom out para tener buen ángulo
  2. Enfoca en la columna izquierda
  3. Asegúrate que se vea:
     - Gráfico Waterfall con barras de colores
     - Panel IA con 3 recomendaciones (ALTA/MEDIA/BAJA)
  4. Screenshot del panel izquierdo

---

#### Screenshot 4: Inspector Panel
- **Archivo**: `screenshot-inspector-panel.png`
- **Qué mostrar**: Panel lateral derecho (aparece al hacer click)
- **Pasos**:
  1. Haz click en cualquier sector (ej: STORAGE)
  2. Espera a que el panel deslice desde la derecha
  3. Screenshot mostrando:
     - Sparkline con la gráfica histórica
     - Lista de entidades (Racks, Vehicles, etc)
     - Estadísticas del sector

---

#### Screenshot 5: What-If Modal
- **Archivo**: `screenshot-whatif-modal.png`
- **Qué mostrar**: Modal de simulación de demanda
- **Pasos**:
  1. Busca el botón ⚡ "What-If Scenario" (esquina inferior derecha)
  2. Haz click para abrir el modal
  3. Opcionalmente ajusta el slider de demanda (1-10x)
  4. Screenshot de todo el modal con controles visibles

---

#### Screenshot 6: Alert Ticker
- **Archivo**: `screenshot-alert-ticker.png`
- **Qué mostrar**: Scrolling de alertas en la base
- **Pasos**:
  1. Mira la parte inferior de la pantalla 3D
  2. Deberías ver alertas scrolleando continuamente
  3. Screenshot enfocado en el área de alertas
  4. Asegúrate que se vean al menos 2-3 alertas con iconos

---

#### Screenshot 7: Top Controls
- **Archivo**: `screenshot-toolbar.png`
- **Qué mostrar**: Botones de control en la esquina superior izquierda
- **Pasos**:
  1. Mira la parte superior izquierda de la escena 3D
  2. Deberías ver: Play/Pause, Speed buttons, Overlays, Routes
  3. Screenshot enfocado en esa zona
  4. Asegúrate que todos los botones sean visibles

---

## 📁 Estructura de Carpetas

```
proyecto-root/
├── docs/
│   └── screenshots/
│       ├── screenshot-main-dashboard.png     ← Aquí iría el screenshot 1
│       ├── screenshot-3d-viewer.png          ← Screenshot 2
│       ├── screenshot-dashboard-left.png     ← Screenshot 3
│       ├── screenshot-inspector-panel.png    ← Screenshot 4
│       ├── screenshot-whatif-modal.png       ← Screenshot 5
│       ├── screenshot-alert-ticker.png       ← Screenshot 6
│       └── screenshot-toolbar.png            ← Screenshot 7
└── README.md (ya actualizado con referencias)
```

---

## 🎬 Cómo Tomar Screenshots en Windows

### Opción 1: Herramienta Recorte Nativa
```
Win + Shift + S → Selecciona área → Guarda como PNG
```

### Opción 2: Snip & Sketch
```
Win → Escribe "Snip & Sketch" → Captura → Guarda
```

### Opción 3: Captura de Pantalla Completa
```
Print Screen → Pega en Paint/VS Code → Guarda como PNG
```

### Opción 4: PowerShell Screenshot
```powershell
# Opcional: Script para automatizar
$screenshot = [System.Windows.Forms.Screen]::PrimaryScreen
[System.Windows.Forms.Screen]::PrimaryScreen
# Luego guarda en docs/screenshots/
```

---

## 📤 Pasos Finales (Push a GitHub)

Una vez tengas todos los 7 screenshots en `docs/screenshots/`:

```powershell
# 1. Verifica los archivos
ls docs/screenshots/ | ForEach-Object { Write-Host $_.Name }

# 2. Agrega al staging
git add docs/screenshots/
git add README.md  # Ya actualizado con referencias

# 3. Commit
git commit -m "docs: Add screenshots to README"

# 4. Push
git push origin main
```

---

## ✨ Optimizaciones Opcionales

### Comprimir Imágenes (Opcional)
```
Visita: https://tinypng.com/
Sube cada PNG y descarga optimizado
Objetivo: <500KB por imagen
```

### Mejorar Contraste (Opcional)
- Windows: Win+Shift+C para increase contrast
- Monitor: Ajusta brightness/saturation para mejor visualización

---

## 🚀 Result
Una vez pushes, tu README en GitHub mostrará:
- ✅ Hero image profesional
- ✅ Visualización 3D con detalles
- ✅ Dashboard BI con gráficos
- ✅ Panel inspector
- ✅ Modal What-If
- ✅ Alertas y controles

**Tu proyecto será 10x más atractivo en GitHub! 🎉**

---

**Próximos pasos después de screenshots:**
- [ ] Capturar los 7 screenshots
- [ ] Organizar en docs/screenshots/
- [ ] Pushear a GitHub
- [ ] Compartir en portfolio/LinkedIn
