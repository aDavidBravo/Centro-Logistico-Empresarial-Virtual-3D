# ⚡ Quick Start — CLEV3D

Get up and running in 5 minutes.

---

## 🎯 Choose Your Path

### Option 1: Frontend Only (Fastest)
```bash
git clone https://github.com/aDavidBravo/centro-logistico-3d.git
cd centro-logistico-3d
npm install --legacy-peer-deps
npm run dev
```
👉 Open http://localhost:5173

**Uses:** Synthetic data, no backend needed
⏱️ **Time:** 2 minutes

---

### Option 2: Full Stack with Docker
```bash
git clone https://github.com/aDavidBravo/centro-logistico-3d.git
cd centro-logistico-3d
docker-compose up -d
```

**Services:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Database: localhost:5432 (clev3d/clev3d)
- Redis: localhost:6379

⏱️ **Time:** 3-5 minutes (first run: image download)

---

### Option 3: Backend Only
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
python main.py
```

👉 Backend API at http://localhost:8000
- Health: http://localhost:8000/api/health
- WebSocket: ws://localhost:8000/ws/live

⏱️ **Time:** 2 minutes

---

## 🕹️ Using CLEV3D

### 3D Viewer Controls
| Action | Control |
|--------|---------|
| Rotate | Click + drag |
| Zoom | Scroll wheel |
| Pan | Right-click + drag |
| Select sector | Click on sector |
| Deselect | Click on empty area |
| Hover vehicle | See tooltip with details |

### Top Toolbar
- **Play/Pause:** Pause simulation
- **Speed:** 0.5x, 1x, 2x, 4x
- **Overlays:** Show/hide labels
- **Routes:** Show/hide particle flow

### Top Tabs
- Occupancy (total view)
- Inbound (receive dock)
- WIP (packing line)
- Outbound (shipping)
- Transport (last mile)

### Bottom-Right Button
- **⚡ What-If Scenario:** Simulate demand spikes

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **README.md** | Complete feature list & controls |
| **ARCHITECTURE.md** | System design & data flow |
| **DEPLOYMENT.md** | Deploy to Vercel, run with Docker |
| **QUICK_START.md** | This file (5-min setup) |

---

## 🔧 Troubleshooting

**Port already in use?**
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 5174
```

**npm install fails?**
```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or clear cache
npm cache clean --force && npm install --legacy-peer-deps
```

**Docker issues?**
```bash
# Rebuild without cache
docker-compose up --build --no-cache

# Reset everything
docker-compose down -v
docker-compose up -d
```

---

## 🚀 Next Steps

1. ✅ **Running locally?** Explore the 5 sectors in the 3D viewer
2. 🎯 **Want backend?** Check [DEPLOYMENT.md](./DEPLOYMENT.md)
3. 🏗️ **Need architecture?** Read [ARCHITECTURE.md](./ARCHITECTURE.md)
4. 📖 **Full features?** See [README.md](./README.md)

---

## 💡 Pro Tips

- **Hover vehicles** to see ID, cargo, destination
- **Click sectors** to open inspector panel with real-time stats
- **⚡ What-If modal** to simulate demand scenarios (bottom-right)
- **Top tabs** switch between sector views instantly
- **Filters** narrow down by zone, rack, client, supplier

---

## 📞 Need Help?

- **Issues:** https://github.com/aDavidBravo/centro-logistico-3d/issues
- **Docs:** All in repo root (.md files)
- **Code:** Well-commented source in `src/`

---

**Ready? 👉 `npm install --legacy-peer-deps && npm run dev`**

Generated with Claude Code 🤖
