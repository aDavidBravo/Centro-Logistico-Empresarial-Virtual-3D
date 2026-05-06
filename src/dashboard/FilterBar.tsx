import { useStore } from '@/store/useStore';

const FILTERS = [
  { key: 'zone', label: 'Zone' },
  { key: 'rack', label: 'Rack' },
  { key: 'level', label: 'Level' },
  { key: 'depth', label: 'Depth' },
  { key: 'client', label: 'Client' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'carrier', label: 'Carrier' },
] as const;

export function FilterBar() {
  const filters = useStore(s => s.filters);
  const setFilter = useStore(s => s.setFilter);
  const reset = useStore(s => s.resetFilters);

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[#0a1224]/95 border-b border-cyan-glow/10">
      {FILTERS.map((f) => (
        <div key={f.key} className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-gray-400">{f.label}</span>
          <button
            className="px-3 h-7 text-[11px] bg-[#0f1a30] border border-cyan-glow/15 hover:border-cyan-glow/40 text-cyan-glow/90 flex items-center gap-2 rounded-sm transition"
            onClick={() => setFilter(f.key as any, filters[f.key as keyof typeof filters] === 'Todas' ? 'A' : 'Todas')}
          >
            <span>{filters[f.key as keyof typeof filters]}</span>
            <span className="text-cyan-glow/60">▾</span>
          </button>
        </div>
      ))}
      <div className="flex-1" />
      <button
        onClick={reset}
        className="px-2 h-7 text-[11px] bg-[#0f1a30] hover:bg-danger/20 hover:text-danger border border-cyan-glow/15 text-gray-400 rounded-sm transition"
      >
        Limpiar filtros ⌫
      </button>
    </div>
  );
}
