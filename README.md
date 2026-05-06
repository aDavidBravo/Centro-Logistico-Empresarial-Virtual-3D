# CLEV3D · Centro Logístico Empresarial Virtual 3D

Gemelo digital interactivo en 3D de un megacentro logístico tipo Amazon · estilo APICA Antwerp.

## Stack

- Vite + React 18 + TypeScript
- React Three Fiber + drei (3D)
- Tailwind CSS (UI · estilo BI dark)
- Zustand (state)
- Framer Motion (panel animations)

## Layout campus (5 sectores)

| Sector | Visual | Función |
|---|---|---|
| **INBOUND** | Trailers en gates · containers azules apilados · zonas pintadas | Recepción · validación |
| **STORAGE** | Torres de racks instanciados · color por ocupación | Almacenamiento · 6.000 SKUs |
| **WIP** | Conveyors animados · brazos robóticos naranjas | Empaque · 8 estaciones |
| **OUTBOUND** | Docks de salida · containers cyan · LEDs de estado | Despacho · clasificación por destino |
| **TRANSPORT** | Drone port · vans · trailers · drones flotando | Última milla |

## Instalación

```bash
npm install --legacy-peer-deps
npm run dev
```

Abre http://localhost:5173

## Controles

- **Click en sector** → abre panel inspector lateral
- **Arrastrar** → orbitar cámara · **Scroll** → zoom · **Click derecho + drag** → pan
- **Hover sobre vehículo** → tooltip con ID/cargo/destino
- **Toolbar superior izquierda** → pausar/velocidad/overlays/rutas
- **Top tabs** (Occupancy / Inbound / WIP / Outbound / Transport) → navegación entre sectores

## Códigos visibles (estilo industrial real)

- `CLEV-2026-NNNN-X` — containers
- `TRK-NN-XXX` — trailers (origen IN/OUT)
- `VAN-NN` — camionetas
- `AGV-NN` / `FLK-NN` — robots de piso · forklifts
- `ARM-LN-NN` — brazos robóticos
- `DRN-NN` — drones

## Color semáforo (universal)

- 🟢 Verde — OK
- 🟡 Amarillo — WARN
- 🔴 Rojo — CRITICAL

## Roadmap

- ✅ Layout campus con 5 sectores diferenciados
- ✅ Top tabs · filter bar · KPI strip · waterfall chart estilo Power BI
- ✅ Inspector lateral con sparkline + lista de entidades
- ✅ AI Panel con recomendaciones priorizadas
- ✅ Alert ticker scrolling
- ⏳ Cámara cinemática hacia sector seleccionado
- ⏳ Animación de pedidos viajando entre sectores
- ⏳ What-if scenarios (spike de demanda)
- ⏳ Backend FastAPI · WebSocket
- ⏳ Deploy Vercel + integración a página personal
