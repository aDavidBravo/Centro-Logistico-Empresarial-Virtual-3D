import { Scene } from './scene/Scene';
import { TopTabs } from './dashboard/TopTabs';
import { FilterBar } from './dashboard/FilterBar';
import { KpiStrip } from './dashboard/KpiStrip';
import { Waterfall } from './dashboard/Waterfall';
import { Inspector } from './dashboard/Inspector';
import { AlertTicker } from './dashboard/AlertTicker';
import { AIPanel } from './dashboard/AIPanel';
import { SceneToolbar } from './dashboard/SceneToolbar';
import { WhatIfModal } from './dashboard/WhatIfModal';
import { useStore } from './store/useStore';

export default function App() {
  const sector = useStore(s => s.selectedSector);

  return (
    <div className="w-full h-full flex flex-col scanlines vignette">
      <TopTabs />
      <FilterBar />
      <KpiStrip />

      {/* Cuerpo principal: 2 columnas (chart + 3D viewer) */}
      <div className="flex-1 grid grid-cols-12 gap-3 px-4 pb-3 min-h-0">
        {/* Columna izquierda — chart */}
        <div className="col-span-3 flex flex-col gap-3 min-h-0">
          <div className="flex-1 min-h-0">
            <Waterfall />
          </div>
          <div className="h-[260px]">
            <AIPanel />
          </div>
        </div>

        {/* Columna derecha — 3D viewer */}
        <div className="col-span-9 holo-panel relative overflow-hidden">
          {/* Header del viewer */}
          <div className="absolute top-0 left-0 right-0 z-10 px-4 py-2 flex items-center justify-between bg-gradient-to-b from-bg-0/90 to-transparent pointer-events-none">
            <div>
              <div className="text-[12px] text-white font-semibold">3D Digital Twin · Centro Logístico Empresarial Virtual</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                Operational Flow · Inbound → Storage → WIP → Outbound → Transport
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-success">STREAMING</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-success">●</span><span>OK</span>
                <span className="text-amber-glow">●</span><span>WARN</span>
                <span className="text-danger">●</span><span>CRITICAL</span>
              </div>
            </div>
          </div>

          <SceneToolbar />

          {/* Canvas 3D */}
          <div className="absolute inset-0">
            <Scene />
          </div>

          {/* Inspector lateral derecho */}
          <Inspector />

          {/* Footer del viewer (ticker) */}
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <AlertTicker />
          </div>

          {/* Hint de selección */}
          {!sector && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 text-[10px] text-cyan-glow/70 bg-bg-0/70 px-3 py-1 rounded-sm border border-cyan-glow/20 pointer-events-none">
              CLICK en un sector para ver detalles · ARRASTRAR para rotar · SCROLL para zoom
            </div>
          )}
        </div>
      </div>

      {/* What-If Modal */}
      <WhatIfModal />
    </div>
  );
}
