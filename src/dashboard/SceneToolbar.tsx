import { useStore } from '@/store/useStore';

export function SceneToolbar() {
  const showOverlays = useStore(s => s.showOverlays);
  const showRoutes = useStore(s => s.showRoutes);
  const paused = useStore(s => s.paused);
  const simSpeed = useStore(s => s.simSpeed);
  const toggleOverlays = useStore(s => s.toggleOverlays);
  const toggleRoutes = useStore(s => s.toggleRoutes);
  const togglePause = useStore(s => s.togglePause);
  const setSimSpeed = useStore(s => s.setSimSpeed);

  return (
    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
      <div className="holo-panel px-2 py-1.5 flex items-center gap-1.5">
        <button
          onClick={togglePause}
          className={`px-2.5 py-1 text-[10px] rounded-sm transition ${paused ? 'bg-warn/20 text-amber-glow border border-amber-glow/40' : 'bg-success/15 text-success border border-success/30'}`}
        >
          {paused ? '▶ PLAY' : '❚❚ PAUSE'}
        </button>
        <div className="text-[10px] text-gray-500 px-1">×</div>
        {[0.5, 1, 2, 4].map(s => (
          <button
            key={s}
            onClick={() => setSimSpeed(s)}
            className={`w-7 h-6 text-[10px] rounded-sm transition ${
              simSpeed === s ? 'bg-cyan-glow/25 text-cyan-glow border border-cyan-glow/50' : 'text-gray-400 border border-cyan-glow/10 hover:border-cyan-glow/30'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="holo-panel px-2 py-1.5 flex items-center gap-1.5">
        <button
          onClick={toggleOverlays}
          className={`px-2 py-1 text-[10px] rounded-sm transition ${showOverlays ? 'bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/30' : 'text-gray-500 border border-cyan-glow/10'}`}
        >
          🏷 OVERLAYS
        </button>
        <button
          onClick={toggleRoutes}
          className={`px-2 py-1 text-[10px] rounded-sm transition ${showRoutes ? 'bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/30' : 'text-gray-500 border border-cyan-glow/10'}`}
        >
          ⤳ ROUTES
        </button>
      </div>
    </div>
  );
}
