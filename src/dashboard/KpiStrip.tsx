import { useStore } from '@/store/useStore';

interface CardProps {
  title: string;
  value: string;
  unit?: string;
  sub?: { label: string; value: string }[];
  accent: string;
  status?: 'ok' | 'warn' | 'critical';
}

function KpiCard({ title, value, unit, sub, accent, status = 'ok' }: CardProps) {
  const statusColor = status === 'critical' ? '#ef4444' : status === 'warn' ? '#facc15' : '#22ffaa';
  return (
    <div className="holo-panel relative flex-1 px-4 py-3">
      <div className="flex items-start justify-between mb-2">
        <span className="label-mini">{title}</span>
        <span className="tick" style={{ color: statusColor }} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="kpi-num text-4xl text-white" style={{ textShadow: `0 0 12px ${accent}80` }}>{value}</span>
        {unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
      </div>
      {sub && (
        <div className="grid grid-cols-2 gap-1 mt-3 pt-2 border-t border-cyan-glow/10">
          {sub.map(s => (
            <div key={s.label}>
              <div className="text-[9px] uppercase tracking-wider text-gray-500">{s.label}</div>
              <div className="kpi-num text-[15px] text-white">{s.value}</div>
            </div>
          ))}
        </div>
      )}
      {/* Decorative wave background */}
      <svg className="absolute right-0 bottom-0 opacity-20 pointer-events-none" width="120" height="60" viewBox="0 0 120 60" fill="none">
        <path d="M0 50 Q30 20 60 35 T120 30" stroke={accent} strokeWidth="1.5" />
        <path d="M0 55 Q30 30 60 40 T120 38" stroke={accent} strokeWidth="1" opacity="0.6" />
      </svg>
    </div>
  );
}

export function KpiStrip() {
  const kpi = useStore(s => s.world.kpi);
  return (
    <div className="grid grid-cols-4 gap-3 px-4 py-3">
      <KpiCard
        title="% Total Occupancy"
        value={`${kpi.totalOccupancyPct.toFixed(0)}`}
        unit="%"
        accent="#22d3ee"
        status="ok"
        sub={[
          { label: 'Total Capacity', value: kpi.totalCapacity.toLocaleString('de-DE') },
          { label: 'Used Capacity', value: kpi.totalUsed.toLocaleString('de-DE') },
        ]}
      />
      <KpiCard
        title="% Inbound Occupancy"
        value={`${kpi.inboundOccupancyPct}`}
        unit="%"
        accent="#3b82f6"
        status={kpi.inboundOccupancyPct > 92 ? 'warn' : 'ok'}
        sub={[
          { label: 'Inbound Capacity', value: kpi.inboundCapacity.toLocaleString('de-DE') },
          { label: 'Used Capacity', value: kpi.inboundUsed.toLocaleString('de-DE') },
        ]}
      />
      <KpiCard
        title="% Outbound Occupancy"
        value={`${kpi.outboundOccupancyPct}`}
        unit="%"
        accent="#06b6d4"
        status="ok"
        sub={[
          { label: 'Outbound Capacity', value: kpi.outboundCapacity.toLocaleString('de-DE') },
          { label: 'Used Capacity', value: kpi.outboundUsed.toLocaleString('de-DE') },
        ]}
      />
      <KpiCard
        title="Work in Progress (WIP)"
        value={`${kpi.wipCount}`}
        accent="#f97316"
        status="warn"
        sub={[
          { label: 'Preparation', value: `${kpi.wipPrep}` },
          { label: 'Production', value: `${kpi.wipProd}` },
        ]}
      />
    </div>
  );
}
