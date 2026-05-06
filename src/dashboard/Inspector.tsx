import { useStore } from '@/store/useStore';
import { SECTOR_BY_ID } from '@/lib/layout';
import { motion, AnimatePresence } from 'framer-motion';

export function Inspector() {
  const selected = useStore(s => s.selectedSector);
  const select = useStore(s => s.selectSector);
  const world = useStore(s => s.world);

  if (!selected) return null;
  const sector = SECTOR_BY_ID[selected];

  // Datos contextuales por sector
  const vehiclesIn = world.vehicles.filter(v => v.routeSector === selected);
  const containersIn = world.containers.filter(c => c.sector === selected);
  const dronesIn = selected === 'transport' ? world.drones : [];
  const armsIn = selected === 'wip' ? world.arms : [];

  const occupancyBySector: Record<string, number> = {
    inbound: world.kpi.inboundOccupancyPct,
    outbound: world.kpi.outboundOccupancyPct,
    storage: world.kpi.totalOccupancyPct,
    wip: 78,
    transport: 64,
  };

  return (
    <AnimatePresence>
      <motion.aside
        key={selected}
        initial={{ x: 380, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 380, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 28 }}
        className="absolute top-0 right-0 bottom-0 w-[360px] z-30"
      >
        <div className="holo-panel h-full flex flex-col overflow-hidden" style={{ borderColor: sector.glow + '60' }}>
          {/* Header */}
          <div className="px-4 py-3 border-b" style={{ borderColor: sector.glow + '40', background: `linear-gradient(180deg, ${sector.glow}15, transparent)` }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] tracking-[0.25em] text-gray-400">SECTOR INSPECTOR</div>
                <div className="text-xl font-display font-bold mt-0.5 glow" style={{ color: sector.glow }}>{sector.label}</div>
              </div>
              <button onClick={() => select(null)} className="text-gray-500 hover:text-danger text-lg leading-none">✕</button>
            </div>
            <div className="text-[10px] text-gray-400 mt-1">{sector.description}</div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-2 p-3">
            <div className="bg-[#0a1224] border border-cyan-glow/10 p-2 rounded-sm">
              <div className="label-mini">Ocupación</div>
              <div className="kpi-num text-2xl" style={{ color: sector.glow }}>{occupancyBySector[selected]}%</div>
              <div className="bar mt-1"><span style={{ width: `${occupancyBySector[selected]}%` }} /></div>
            </div>
            <div className="bg-[#0a1224] border border-cyan-glow/10 p-2 rounded-sm">
              <div className="label-mini">Throughput / hr</div>
              <div className="kpi-num text-2xl text-white">{Math.round(120 + Math.random() * 80)}</div>
              <div className="text-[9px] text-success mt-1">+ 4.8% vs ayer</div>
            </div>
            <div className="bg-[#0a1224] border border-cyan-glow/10 p-2 rounded-sm">
              <div className="label-mini">Vehículos activos</div>
              <div className="kpi-num text-2xl text-white">{vehiclesIn.length}</div>
            </div>
            <div className="bg-[#0a1224] border border-cyan-glow/10 p-2 rounded-sm">
              <div className="label-mini">Containers</div>
              <div className="kpi-num text-2xl text-white">{containersIn.length}</div>
            </div>
          </div>

          {/* Sparkline */}
          <div className="px-3">
            <div className="bg-[#0a1224] border border-cyan-glow/10 p-2 rounded-sm">
              <div className="flex items-center justify-between">
                <span className="label-mini">Throughput · 24h</span>
                <span className="text-[9px] text-success">▲ 4.8%</span>
              </div>
              <svg viewBox="0 0 200 40" className="w-full mt-1">
                <defs>
                  <linearGradient id={`grad-${selected}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sector.glow} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={sector.glow} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={Array.from({ length: 24 }).map((_, i) => {
                    const x = (i / 23) * 200;
                    const y = 30 - (Math.sin(i * 0.6 + selected.length) * 8 + Math.cos(i * 0.3) * 5 + 12);
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  stroke={sector.glow}
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d={Array.from({ length: 24 }).map((_, i) => {
                    const x = (i / 23) * 200;
                    const y = 30 - (Math.sin(i * 0.6 + selected.length) * 8 + Math.cos(i * 0.3) * 5 + 12);
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ') + ` L 200 40 L 0 40 Z`}
                  fill={`url(#grad-${selected})`}
                />
              </svg>
            </div>
          </div>

          {/* Lista de entidades */}
          <div className="flex-1 overflow-y-auto px-3 pt-3 pb-3">
            <div className="label-mini mb-2">Entidades en sector ({vehiclesIn.length + containersIn.length + dronesIn.length + armsIn.length})</div>
            <div className="space-y-1">
              {vehiclesIn.slice(0, 8).map(v => (
                <div key={v.id} className="flex items-center justify-between px-2 py-1.5 bg-[#0a1224] border border-cyan-glow/5 hover:border-cyan-glow/30 rounded-sm transition">
                  <div className="flex items-center gap-2">
                    <span className="tick" style={{ color: v.status === 'critical' ? '#ef4444' : v.status === 'warn' ? '#facc15' : '#22ffaa' }} />
                    <div>
                      <div className="text-[10px] text-white font-mono">{v.id}</div>
                      <div className="text-[9px] text-gray-500">{v.kind} · {v.cargo}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-cyan-glow">{v.loadPct}%</div>
                    <div className="text-[8px] text-gray-500">{v.destination}</div>
                  </div>
                </div>
              ))}
              {dronesIn.slice(0, 6).map(d => (
                <div key={d.id} className="flex items-center justify-between px-2 py-1.5 bg-[#0a1224] border border-cyan-glow/5 rounded-sm">
                  <div className="flex items-center gap-2">
                    <span className="tick" style={{ color: d.status === 'critical' ? '#ef4444' : d.status === 'warn' ? '#facc15' : '#22ffaa' }} />
                    <div>
                      <div className="text-[10px] text-white font-mono">{d.id}</div>
                      <div className="text-[9px] text-gray-500">drone · {d.destinationCity}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px]" style={{ color: d.battery > 50 ? '#22ffaa' : d.battery > 25 ? '#facc15' : '#ef4444' }}>
                      🔋 {d.battery}%
                    </div>
                  </div>
                </div>
              ))}
              {armsIn.slice(0, 8).map(a => (
                <div key={a.id} className="flex items-center justify-between px-2 py-1.5 bg-[#0a1224] border border-cyan-glow/5 rounded-sm">
                  <div className="flex items-center gap-2">
                    <span className="tick" style={{ color: a.status === 'critical' ? '#ef4444' : a.status === 'warn' ? '#facc15' : '#22ffaa' }} />
                    <div>
                      <div className="text-[10px] text-white font-mono">{a.id}</div>
                      <div className="text-[9px] text-gray-500">brazo · {a.state}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-cyan-glow">{a.cyclesPerHour}/h</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
