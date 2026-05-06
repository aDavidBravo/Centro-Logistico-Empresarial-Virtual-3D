import { useStore } from '@/store/useStore';

const LEVEL_COLOR = {
  info: '#22d3ee',
  warn: '#facc15',
  critical: '#ef4444',
} as const;

export function AlertTicker() {
  const alerts = useStore(s => s.world.alerts);
  return (
    <div className="holo-panel px-3 py-2 flex items-center gap-3 overflow-hidden">
      <div className="flex items-center gap-2 pr-3 border-r border-cyan-glow/15">
        <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest text-danger font-bold">Alerts</span>
      </div>
      <div className="flex-1 flex items-center gap-6 overflow-hidden">
        <div className="flex items-center gap-6 animate-[scroll_40s_linear_infinite] whitespace-nowrap">
          {[...alerts, ...alerts].map((a, i) => (
            <div key={`${a.id}-${i}`} className="flex items-center gap-2 text-[11px]">
              <span className="tick" style={{ color: LEVEL_COLOR[a.level] }} />
              <span className="text-gray-500 uppercase text-[9px]">[{a.sector}]</span>
              <span style={{ color: LEVEL_COLOR[a.level] }}>{a.message}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
