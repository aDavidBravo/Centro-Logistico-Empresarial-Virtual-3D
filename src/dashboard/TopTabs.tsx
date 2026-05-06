import { useStore, type TopTab } from '@/store/useStore';

const TABS: { id: TopTab; label: string }[] = [
  { id: 'occupancy', label: 'Occupancy' },
  { id: 'inbound', label: 'Inbound' },
  { id: 'wip', label: 'WIP' },
  { id: 'outbound', label: 'Outbound' },
  { id: 'transport', label: 'Transport' },
];

export function TopTabs() {
  const tab = useStore(s => s.tab);
  const setTab = useStore(s => s.setTab);
  const selectSector = useStore(s => s.selectSector);

  return (
    <div className="flex items-center gap-2 px-3 h-[52px] bg-[#0c1426]/95 border-b border-cyan-glow/15 backdrop-blur">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-3 pl-1 pr-3 border-r border-cyan-glow/20 h-9">
        <div className="w-6 h-6 grid place-items-center rounded-sm" style={{ background: 'linear-gradient(135deg, #22d3ee, #a855f7)' }}>
          <span className="text-bg-0 font-bold text-[11px]">C</span>
        </div>
        <div className="leading-tight">
          <div className="text-[10px] tracking-[0.2em] text-cyan-glow font-display font-bold">CLEV3D</div>
          <div className="text-[9px] text-gray-400 -mt-0.5">Business Intelligence</div>
        </div>
      </div>

      {/* Tabs estilo Power BI */}
      <div className="flex items-center gap-1">
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                if (t.id === 'occupancy') selectSector(null);
                else selectSector(t.id as any);
              }}
              className={`px-5 py-2 text-[12px] font-medium tracking-wide transition relative ${
                active
                  ? 'bg-[#1e2647] text-white border border-cyan-glow/40'
                  : 'text-gray-400 hover:text-cyan-glow hover:bg-[#0f1830]'
              }`}
              style={active ? { boxShadow: '0 0 14px rgba(34,211,238,0.25), inset 0 -2px 0 #22d3ee' } : {}}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1" />

      {/* Status indicators a la derecha */}
      <div className="flex items-center gap-3 text-[10px] mr-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-success/90">LIVE</span>
        </div>
        <div className="text-gray-500">|</div>
        <div className="text-gray-400">{new Date().toLocaleString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
      </div>
    </div>
  );
}
