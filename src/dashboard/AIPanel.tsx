import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

const PRIO = {
  high: { color: '#ef4444', label: 'ALTA' },
  med: { color: '#facc15', label: 'MEDIA' },
  low: { color: '#22d3ee', label: 'BAJA' },
};

export function AIPanel() {
  const recs = useStore(s => s.world.recs);
  return (
    <div className="holo-panel p-3 flex flex-col gap-2 max-h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 grid place-items-center rounded-sm" style={{ background: 'linear-gradient(135deg, #d946ef, #22d3ee)' }}>
            <span className="text-[10px] font-bold text-bg-0">AI</span>
          </div>
          <div>
            <div className="text-[11px] text-white font-semibold">CLEV3D · Asistente IA</div>
            <div className="text-[9px] text-gray-500">Recomendaciones en vivo</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="tick text-success" />
          <span className="text-[9px] text-success">Active</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {recs.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0a1224] border-l-2 px-2.5 py-2 rounded-sm relative overflow-hidden"
            style={{ borderColor: PRIO[r.priority].color }}
          >
            <div className="flex items-start justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[8px] px-1.5 py-0.5 rounded-sm font-bold tracking-wider"
                  style={{ background: PRIO[r.priority].color + '25', color: PRIO[r.priority].color }}
                >
                  {PRIO[r.priority].label}
                </span>
                <span className="text-[9px] text-gray-500 uppercase">{r.sector}</span>
              </div>
            </div>
            <div className="text-[11px] text-white leading-snug">{r.message}</div>
            <div className="text-[9px] text-success mt-0.5">→ {r.impact}</div>
          </motion.div>
        ))}
      </div>

      <button className="mt-1 w-full px-2 py-1.5 text-[10px] uppercase tracking-wider bg-cyan-glow/10 hover:bg-cyan-glow/20 border border-cyan-glow/30 text-cyan-glow rounded-sm transition">
        Ver todas las recomendaciones →
      </button>
    </div>
  );
}
