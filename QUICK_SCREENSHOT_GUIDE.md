# 📸 Quick Screenshot Guide

## 🎯 5-Minute Screenshots (Minimal Steps)

### Start Here
```powershell
npm run dev
# → Open http://localhost:5173
```

---

## 📍 7 Screenshots — Location Map

```
┌─────────────────────────────────────────────────┐
│  [PLAY] [SPEED] [OVERLAYS] [ROUTES]  ← #7       │  ← Top left
│                                                 │
│  ┌──────────────────┬──────────────────────┐   │
│  │   #3             │                      │   │
│  │ WATERFALL        │                      │   │
│  │ CHART            │   #2: 3D VIEWER      │   │
│  │                  │   (ALL SECTORS)      │   │
│  │ #6: ALERTS       │                      │   │
│  │ TICKER           │   #1: MAIN VIEW      │   │
│  │ (BOTTOM)         │   (FULL SCREEN)      │   │
│  │                  │                      │   │
│  │ [⚡ WHAT-IF] #5  │              #4 →    │   │
│  └──────────────────┴──────────────────────┤   │
│                            [INSPECTOR PANEL]    │
└─────────────────────────────────────────────────┘
```

---

## 🎬 Step-by-Step

### #1: Main Dashboard (FIRST)
```
1. Zoom OUT (scroll wheel) to see full dashboard + 3D
2. Press Print Screen
3. Paste in Paint → Save as PNG
4. Save to: docs/screenshots/screenshot-main-dashboard.png
```
**What you see**: Entire UI with dashboard left + 3D center

---

### #2: 3D Viewer Close-up
```
1. Zoom IN (scroll) to see sector details
2. Rotate camera to show 3-4 sectors
3. Screenshot just the 3D area
4. Save as: screenshot-3d-viewer.png
```
**What you see**: Racks, trailers, drones, cyan flow particles

---

### #3: Dashboard Left Side
```
1. Keep zoom out (same as #1)
2. Crop/screenshot ONLY the left column
3. Must show:
   - Waterfall chart (colored bars)
   - AI Panel (3 recommendations)
4. Save as: screenshot-dashboard-left.png
```
**What you see**: Charts + recommendations

---

### #4: Inspector Panel
```
1. Click on ANY sector (e.g., STORAGE, INBOUND)
2. Wait for panel to slide in from RIGHT
3. Screenshot showing:
   - Sparkline graph
   - Entity list
   - Stats
4. Save as: screenshot-inspector-panel.png
```
**Click here**: On the 3D ground platform

---

### #5: What-If Modal
```
1. Look bottom-right corner of 3D viewer
2. Find button: ⚡ "What-If Scenario"
3. Click it
4. Modal appears in center
5. Screenshot the modal
6. Save as: screenshot-whatif-modal.png
```
**What you see**: Sliders, impact metrics, export button

---

### #6: Alert Ticker
```
1. Look at BOTTOM of 3D area
2. You'll see scrolling colored alerts
3. Screenshot just that bottom strip
4. Include 2-3 visible alerts
5. Save as: screenshot-alert-ticker.png
```
**What you see**: Red/yellow/blue alerts scrolling left-right

---

### #7: Top Controls
```
1. Look TOP-LEFT of 3D viewer
2. Find: [Play] [Speed dropdown] [Overlays] [Routes]
3. Screenshot just that toolbar area
4. Save as: screenshot-toolbar.png
```
**What you see**: Control buttons + dropdowns

---

## 🎯 Capture Tips

✅ **Good Screenshots Have:**
- Proper contrast (dark BI theme visible)
- Text is readable
- All UI elements sharp
- Consistent dimensions (1920x1080 hero, others ~1024x576)

❌ **Avoid:**
- Blurry text
- Partial UI cut off
- Low contrast
- Inconsistent sizes

---

## 📁 Final Structure

```
docs/screenshots/
├── screenshot-main-dashboard.png      [1920x1080] Hero
├── screenshot-3d-viewer.png           [Zoomed 3D detail]
├── screenshot-dashboard-left.png      [Left panel focus]
├── screenshot-inspector-panel.png     [Right panel]
├── screenshot-whatif-modal.png        [Modal dialog]
├── screenshot-alert-ticker.png        [Bottom alerts]
└── screenshot-toolbar.png             [Top controls]
```

---

## 🚀 After Screenshots

```powershell
# 1. Verify all 7 files in docs/screenshots/
ls docs/screenshots/

# 2. Push to GitHub
git add docs/screenshots/
git commit -m "docs: Add screenshots to README"
git push origin main

# 3. Check GitHub
# https://github.com/aDavidBravo/centro-logistico-3d
# README will show all beautiful images! 🎉
```

---

## ⚡ Ultra-Quick (2 min version)

If you just want the essentials:
1. Capture #1 (Main Dashboard) - it shows everything
2. Capture #2 (3D Zoomed) - shows the 3D detail
3. Capture #3 (Left Dashboard) - shows the BI styling

Then push. That's the minimum for an attractive README.

---

**All 7 screenshots = Professional GitHub showcase** ✨
