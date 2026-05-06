import { useStore } from '@/store/useStore';
import { useState } from 'react';

export function Waterfall() {
  const data = useStore(s => s.world.clientLoad);
  const [mode, setMode] = useState<'client' | 'supplier'>('client');
  const max = Math.max(...data.map(d => d.used));
  const total = data.reduce((acc, d) => acc + d.used, 0);

  return (
    <div className="holo-panel p-4 h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-[12px] text-white font-semibold">Outbound Capacity Utilization</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Used vs Available · By {mode}</div>
        </div>
        <div className="flex bg-[#0a1424] rounded-sm overflow-hidden border border-cyan-glow/15">
          <button
            className={`px-2.5 py-1 text-[10px] ${mode === 'supplier' ? 'bg-cyan-glow/20 text-white' : 'text-gray-500'}`}
            onClick={() => setMode('supplier')}
          >Supplier</button>
          <button
            className={`px-2.5 py-1 text-[10px] ${mode === 'client' ? 'bg-cyan-glow/20 text-white' : 'text-gray-500'}`}
            onClick={() => setMode('client')}
          >Client</button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-2 text-[9px] text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 inline-block" /> Aumento</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 inline-block" /> Disminución</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-900 inline-block" /> Total</span>
      </div>

      <div className="flex-1 flex items-end gap-1 pb-6 relative">
        {/* Eje Y */}
        <div className="flex flex-col justify-between h-full text-[9px] text-gray-500 mr-1 py-0">
          {[1400, 1200, 1000, 800, 600, 400, 200, 0].map(v => (
            <div key={v} className="leading-none">{v.toLocaleString('de-DE')}</div>
          ))}
        </div>
        {/* Barras waterfall */}
        <div className="flex-1 flex items-end gap-1 h-full relative">
          {/* Líneas guía */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="border-t border-cyan-glow/5" />
            ))}
          </div>
          {data.map((d, i) => {
            const h = (d.used / max) * 100;
            return (
              <div key={d.client} className="flex-1 flex flex-col items-center justify-end relative">
                <span className="text-[8px] text-gray-400 mb-1">{d.used}</span>
                <div
                  className="w-full transition-all"
                  style={{
                    height: `${h}%`,
                    background: 'linear-gradient(180deg, #60a5fa, #2563eb)',
                    boxShadow: '0 0 8px rgba(59,130,246,0.5)',
                  }}
                />
                <span className="text-[8px] text-gray-500 mt-1 absolute -bottom-5 rotate-0 whitespace-nowrap">{d.client.replace('Client ', '')}</span>
              </div>
            );
          })}
          {/* Total bar */}
          <div className="flex-1 flex flex-col items-center justify-end relative">
            <span className="text-[8px] text-cyan-glow mb-1 font-bold">{total.toLocaleString('de-DE')}</span>
            <div className="w-full" style={{ height: '95%', background: '#1e3a8a', boxShadow: '0 0 10px rgba(30,58,138,0.7)' }} />
            <span className="text-[8px] text-cyan-glow mt-1 absolute -bottom-5 font-bold">Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}
