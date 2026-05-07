# 🏗️ CLEV3D Architecture

Complete system design, component interactions, and data flow documentation.

---

## 📊 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT TIER (Browser)                         │
├─────────────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + Vite                                       │
│  ├─ 3D Viewer (Three.js + React Three Fiber)                      │
│  ├─ Dashboard (Tailwind + Framer Motion)                          │
│  └─ State (Zustand)                                                │
└──────────┬──────────────────────────────────────────────────────────┘
           │ HTTP / WebSocket
           │
┌──────────▼──────────────────────────────────────────────────────────┐
│                    API TIER (FastAPI Backend)                        │
├─────────────────────────────────────────────────────────────────────┤
│  Python 3.11 + FastAPI                                              │
│  ├─ REST Endpoints (/api/sectors, /api/kpis, /api/alerts)        │
│  ├─ WebSocket Endpoint (/ws/live)                                 │
│  └─ ConnectionManager (broadcast 2s intervals)                    │
└──────────┬──────────────────────────────────────────────────────────┘
           │ SQL queries
           │
┌──────────▼──────────────────────────────────────────────────────────┐
│                     DATA TIER (PostgreSQL)                           │
├─────────────────────────────────────────────────────────────────────┤
│  PostgreSQL 16 + SQLAlchemy ORM                                     │
│  ├─ Sectors table (status, occupancy, metrics)                    │
│  ├─ Vehicles table (positions, status)                            │
│  ├─ KPI History table (time-series metrics)                       │
│  └─ Alerts table (real-time events)                               │
└─────────────────────────────────────────────────────────────────────┘

Additional: Redis cache, Docker orchestration
```

---

## 🎯 Data Flow Diagram

### Synthetic Data (Dev Mode)

```
useStore (Zustand)
  │
  ├─ generate(seed=42)
  │   ├─ Mulberry32 PRNG → 6000 SKUs
  │   ├─ 192 Racks with occupancy
  │   ├─ 22 Vehicles (positions, status)
  │   ├─ 8 Drones (target positions)
  │   ├─ 8 Robotic Arms (state cycling)
  │   └─ 5 Alerts + 3 AI recommendations
  │
  ├─ tick(dt) → each frame
  │   ├─ AGVs circular path (sin/cos)
  │   ├─ Drones lerp to target + retarget
  │   ├─ Arms state: pick → place → idle
  │   └─ Update Zustand world
  │
  └─ React Components listen (selectors)
      ├─ Scene (3D visualization)
      ├─ Dashboard (KPIs, charts)
      └─ Inspector (sector details)
```

### Real Data (Production Mode)

```
WebSocket /ws/live
  │
  └─ manager.broadcast(world_state) every 2s
      │
      ├─ Backend tick loop
      │   ├─ Query sectors from PostgreSQL
      │   ├─ Calculate KPIs
      │   ├─ Detect alerts
      │   └─ Serialize to JSON
      │
      └─ Frontend WebSocket handler
          └─ setStore({ world: message.data })
              └─ All components re-render with live data
```

---

## 🔧 Frontend Architecture

### Component Hierarchy

```
App.tsx (root layout)
├─ TopTabs (tab navigation)
├─ FilterBar (7 filters)
├─ KpiStrip (4 KPI cards)
├─ Grid (12-column layout)
│  ├─ Waterfall Chart (3 cols)
│  ├─ AIPanel (3 cols)
│  └─ 3D Viewer (9 cols)
│     ├─ Scene (Canvas)
│     │  ├─ Ground + Roads
│     │  ├─ SectorBase (5 platforms)
│     │  ├─ Sectors (Inbound, Storage, WIP, Outbound, Transport)
│     │  ├─ Vehicles (animated fleet)
│     │  ├─ OrderFlow (60 particles)
│     │  ├─ SectorLabels (3D billboards)
│     │  ├─ CinematicCamera (smooth lerp)
│     │  ├─ OrbitControls (camera manual)
│     │  └─ TickLoop (animation sync)
│     ├─ Inspector (sidebar panel)
│     ├─ SceneToolbar (pause, speed, overlays)
│     └─ AlertTicker (bottom scrolling)
└─ WhatIfModal (bottom-right button)
```

### State Management (Zustand)

```typescript
interface AppState {
  // Data
  world: World
  
  // UI State
  tab: 'occupancy' | 'inbound' | 'wip' | 'outbound' | 'transport'
  selectedSector: SectorKey | null
  hoverEntityId: string | null
  filters: { zone, rack, level, depth, client, supplier, carrier }
  showOverlays: boolean
  showRoutes: boolean
  paused: boolean
  simSpeed: 1 | 2 | 4 | 0.5
  
  // Actions
  setTab, selectSector, setHover, setFilter, resetFilters
  toggleOverlays, toggleRoutes, togglePause, setSimSpeed
  
  // Animation
  tick(dt): void  // called every frame from useFrame
}
```

### 3D Scene Architecture

```
Canvas (Vite + Three.js)
├─ Lights
│  ├─ ambientLight (soft fill)
│  ├─ directionalLight (main shadow)
│  ├─ directionalLight (cyan fill)
│  └─ pointLight (blue atmosphere)
├─ Sky
│  └─ Stars (3500 particles)
├─ Ground (infinite plane)
├─ Roads (cyan dashed lines)
├─ Sectors (5 separate zones)
│  ├─ SectorBase (platform + pillars + glow)
│  ├─ Inbound
│  │  ├─ Containers (stacked boxes)
│  │  └─ Gates (for trailers)
│  ├─ Storage
│  │  └─ InstancedMesh (192 racks)
│  ├─ WIP
│  │  ├─ RoboticArms (2 lines × 4 stations)
│  │  └─ ConveyorBelts (2 animated)
│  ├─ Outbound
│  │  └─ Docks (4 with LED status)
│  └─ Transport
│     ├─ DronePort (heli-pads)
│     ├─ Drones (8 hovering)
│     └─ Parking (vans, trailers)
├─ Vehicles (animated fleet)
│  ├─ Trailers (geometry + wheels + load bar)
│  ├─ Vans
│  ├─ AGVs (orange chassis)
│  ├─ Forklifts (mast + forks)
│  └─ Html Tooltips (on hover)
├─ OrderFlow (InstancedMesh 60 particles)
└─ SectorLabels (3D billboards)
```

---

## 🚀 Backend Architecture

### FastAPI Server Structure

```
backend/
├─ main.py (entry point)
│  ├─ CORS middleware config
│  ├─ ConnectionManager class
│  ├─ broadcast_loop() (async task)
│  ├─ Routes
│  │  ├─ GET / (root info)
│  │  ├─ GET /api/health
│  │  ├─ GET /api/sectors
│  │  ├─ GET /api/kpis
│  │  ├─ GET /api/alerts
│  │  └─ WS /ws/live
│  └─ generate_world_state() (mock data)
│
├─ models/ (Pydantic + SQLAlchemy)
│  ├─ Sector
│  ├─ Vehicle
│  ├─ KPISnapshot
│  └─ Alert
│
├─ routes/ (endpoint logic)
│  ├─ sectors.py
│  ├─ vehicles.py
│  ├─ kpis.py
│  └─ auth.py
│
└─ database.py (connection, migrations)
```

### WebSocket Flow

```
Client connects → /ws/live
  │
  └─ ConnectionManager.connect()
      ├─ ws.accept()
      └─ Add to active_connections[]
        │
        └─ [every 2 seconds] broadcast_loop()
            ├─ generate_world_state()
            ├─ Serialize to JSON
            └─ await manager.broadcast({ type: 'world_update', data: state })
                └─ for each active_connection:
                    └─ ws.send_json(message)
                        │
                        └─ Frontend WebSocket.onmessage
                            └─ setStore({ world: message.data })
```

---

## 🎨 Styling Architecture

### Tailwind CSS + Custom CSS

```
src/index.css
├─ @tailwind directives
├─ Custom classes
│  ├─ .holo-panel (glowing borders)
│  ├─ .scanlines (CRT effect)
│  ├─ .vignette (edge darkening)
│  ├─ .tick (pulse animation)
│  └─ Color utility classes
│
└─ Dark theme
   ├─ bg-0 (#03060d - darkest)
   ├─ bg-1 (#0a1224 - panels)
   ├─ cyan-glow (#22d3ee)
   ├─ magenta-glow (#d946ef)
   ├─ amber-glow (#facc15)
   └─ danger (#ef4444)
```

### Sector Color Coding

```
INBOUND:   bg-blue-900    (#1e3a8a) + glow-blue (#3b82f6)
STORAGE:   bg-blue-950    (#0f1e3d) + glow-cyan (#22d3ee)
WIP:       bg-orange-950  (#3b1d04) + glow-orange (#f97316)
OUTBOUND:  bg-blue-900    (#0c2a4a) + glow-teal (#06b6d4)
TRANSPORT: bg-slate-950   (#1a1a2e) + glow-purple (#a855f7)
```

---

## 🔄 Animation System

### useFrame Loop

```
Each frame (60 FPS):
┌─ Canvas.useFrame(state, dt)
│
├─ TickLoop component
│  └─ Zustand tick(dt)
│      ├─ Update vehicles (AGVs, forklifts)
│      │   └─ pos = circular path (sin/cos)
│      ├─ Update drones
│      │   └─ pos = lerp toward target
│      ├─ Update arms
│      │   └─ state = pick | place | idle (cycling)
│      └─ Update set({ world: { ...updated } })
│
├─ CinematicCamera component
│  └─ selected sector → smooth lerp(camera.position, target, 0.04)
│
├─ OrderFlow component
│  └─ 60 particles move along route + pulsate scale
│
└─ All Components re-render with Zustand selectors
```

### Animation Durations

```
Vehicle movement:  continuous (sim speed controlled)
Drone lerp:        0.04 ease per frame (smooth)
Arm state cycle:   600ms per cycle (pick → place → idle)
Particle pulsate:  1s sin wave
Camera lerp:       ~2.5s to sector (power2.inOut ease)
Panel slide-in:    240ms (Framer Motion spring)
```

---

## 🏢 Deployment Architecture

### Local Development (Docker Compose)

```
docker-compose.yml orchestrates:

frontend service (Vite dev server)
  ├─ Port 5173
  ├─ Volume: ./
  └─ Command: npm run dev

backend service (FastAPI)
  ├─ Port 8000
  ├─ Depends on: db
  ├─ Environment: DATABASE_URL, JWT_SECRET
  └─ Command: uvicorn main:app --reload

db service (PostgreSQL)
  ├─ Port 5432
  ├─ Image: postgres:16-alpine
  ├─ Volume: postgres_data
  └─ Environment: POSTGRES_USER/PASSWORD/DB

redis service (Cache)
  ├─ Port 6379
  ├─ Image: redis:7-alpine
  └─ Volume: redis_data
```

### Production (Vercel + Railway)

```
GitHub push to main
  │
  └─ GitHub Actions (.github/workflows/deploy.yml)
      ├─ Build frontend (npm run build)
      ├─ Build backend (docker build)
      └─ Deploy frontend to Vercel
      └─ Deploy backend to Railway
         │
         └─ vercel.json
             ├─ buildCommand: npm run build
             ├─ outputDirectory: dist
             └─ rewrites: SPA redirect to /index.html
```

### Environment Separation

```
Development:
├─ Frontend: http://localhost:5173
├─ Backend: http://localhost:8000
└─ Database: localhost:5432

Staging:
├─ Frontend: https://clev3d-staging.vercel.app
├─ Backend: https://api-staging.railway.app
└─ Database: AWS RDS (staging)

Production:
├─ Frontend: https://tu-domain.com
├─ Backend: https://api.tu-domain.com
└─ Database: AWS RDS (prod, encrypted)
```

---

## 🔐 Security Architecture

### Authentication (Future)

```
Frontend → Backend flow:
┌─ User login (email/password)
├─ Backend validates vs PostgreSQL
├─ Generate JWT token (HS256)
├─ Return { access_token, token_type: 'bearer' }
├─ Frontend stores in memory (or cookie)
└─ All future requests include: Authorization: Bearer <token>

JWT payload:
{
  "sub": "user_id",
  "exp": timestamp,
  "iat": timestamp,
  "scope": ["read:sectors", "write:scenarios"]
}
```

### CORS Configuration

```
Allowed origins:
├─ http://localhost:5173 (local dev)
├─ http://localhost:5174 (alternate port)
├─ https://clev3d-staging.vercel.app (staging)
└─ https://tu-domain.com (production)

Allowed methods: GET, POST, PUT, DELETE, OPTIONS
Allowed headers: Content-Type, Authorization
Credentials: true (for cookies/tokens)
```

---

## 📈 Scalability Considerations

### Current Limits

```
Frontend:
├─ Max entities: ~50 (vehicles + drones visible)
├─ Bundle size: 1.3MB (minified)
└─ Frame rate: 60 FPS stable

Backend:
├─ Max concurrent WebSocket clients: ~100
├─ Database connections: 20 (pgBouncer pool)
└─ Broadcast interval: 2 seconds

Data:
├─ Max SKUs: 6,000 (synthetic)
├─ Max racks: 192 (InstancedMesh)
└─ Message size per broadcast: ~10KB
```

### Optimization Strategies

```
Frontend:
├─ Code splitting (lazy load routes)
├─ Image optimization (defer non-critical)
├─ Virtualization for long lists
└─ Memoization (React.memo, useMemo)

Backend:
├─ Database indexing on frequently queried columns
├─ Redis caching for KPI calculations
├─ Pagination for /api/vehicles endpoint
└─ WebSocket message batching (combine updates)

Deployment:
├─ CDN for static assets (Vercel edge)
├─ Database read replicas (horizontal scaling)
├─ Load balancer for backend (auto-scaling)
└─ Monitoring & alerts (Sentry, Datadog)
```

---

## 🧪 Testing Architecture (Future)

```
Frontend:
├─ Unit tests (Vitest)
│  ├─ store/ (Zustand selectors)
│  ├─ lib/ (utility functions)
│  └─ components/ (snapshot tests)
├─ E2E tests (Playwright)
│  ├─ Navigation flows
│  ├─ WebSocket connections
│  └─ 3D scene interactions
└─ Visual regression (Percy)

Backend:
├─ Unit tests (pytest)
│  ├─ Route handlers
│  ├─ Data generators
│  └─ Utilities
├─ Integration tests
│  ├─ Database queries
│  ├─ WebSocket broadcasts
│  └─ CORS validation
└─ Load tests (Locust)
   └─ 100+ concurrent WebSocket clients
```

---

## 📚 Code Patterns Used

### Zustand Store Pattern

```typescript
// Selector pattern (avoid re-renders)
const sector = useStore(s => s.selectedSector);
const vehicles = useStore(s => s.world.vehicles);

// Batched updates
set(state => ({
  world: {
    ...state.world,
    vehicles: [...updatedVehicles]
  }
}));
```

### React Three Fiber Hooks

```typescript
// useFrame for animation loop
useFrame(({ camera }, dt) => {
  // This runs every frame
  // Update positions, rotations, etc.
});

// useThree for camera access
const { camera, gl } = useThree();
```

### Custom Hooks

```typescript
// useStore for typed Zustand access
const { world, tick, selectSector } = useStore();

// useFrame pattern
useFrame((state, dt) => tick(dt));
```

---

## 🔗 External Integrations (Future)

```
Real-time Data:
├─ IoT sensors (MQTT)
├─ Warehouse management system (WMS API)
├─ GPS fleet tracking
└─ Load cell sensors

Analytics:
├─ Mixpanel (user events)
├─ Datadog (infrastructure)
└─ Sentry (error tracking)

ML/AI:
├─ TensorFlow (demand prediction)
├─ OpenAI (natural language recommendations)
└─ Prophet (time-series forecasting)
```

---

**Architecture document generated with Claude Code 🤖**
