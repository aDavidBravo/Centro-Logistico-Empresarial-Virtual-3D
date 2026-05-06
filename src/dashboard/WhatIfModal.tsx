import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';

interface ScenarioResults {
  peakOccupancy: number;
  avgThroughput: number;
  bottlenecks: string[];
  impactDurationMinutes: number;
  estimatedCost: number;
}

export function WhatIfModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [multiplier, setMultiplier] = useState(2);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<ScenarioResults | null>(null);

  const handleRunSimulation = async () => {
    setIsSimulating(true);

    // Simular delay de 2 segundos (en producción sería web worker)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Calcular resultados basado en parámetros
    const baseOccupancy = 78;
    const peakOccupancy = Math.min(100, baseOccupancy + multiplier * 8);
    const avgThroughput = 42 * multiplier;
    const bottlenecks = multiplier > 5 ? ['STORAGE', 'WIP'] : multiplier > 2 ? ['WIP'] : [];
    const impactDuration = durationMinutes + (multiplier > 5 ? 10 : multiplier > 2 ? 5 : 0);

    setResults({
      peakOccupancy,
      avgThroughput,
      bottlenecks,
      impactDurationMinutes: impactDuration,
      estimatedCost: multiplier * durationMinutes * 125,
    });

    setIsSimulating(false);
  };

  const handleExport = () => {
    if (!results) return;
    const csv = `Scenario Results\nMultiplier,${multiplier}x\nDuration,${durationMinutes} min\nPeak Occupancy,${results.peakOccupancy}%\nAvg Throughput,${results.avgThroughput} orders/h\nImpact Duration,${results.impactDurationMinutes} min\nBottlenecks,"${results.bottlenecks.join(', ')}"`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whatif-${Date.now()}.csv`;
    a.click();
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 px-4 py-2 bg-gradient-to-r from-cyan-glow/20 to-magenta-glow/20 border border-cyan-glow/50 text-cyan-glow rounded-lg text-sm font-semibold hover:border-cyan-glow transition-all z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ⚡ What-If Scenario
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSimulating && setIsOpen(false)}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-gradient-to-br from-bg-0 via-bg-1 to-bg-0 border border-cyan-glow/30 rounded-lg p-8 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                What-If Scenario Simulator
              </h2>

              {!results ? (
                <div className="space-y-6">
                  {/* Multiplier Slider */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Demand Multiplier: <span className="text-cyan-glow font-bold">{multiplier}x</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={multiplier}
                      onChange={e => setMultiplier(Number(e.target.value))}
                      className="w-full accent-cyan-glow"
                      disabled={isSimulating}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1x (normal)</span>
                      <span>10x (critical)</span>
                    </div>
                  </div>

                  {/* Duration Select */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Spike Duration
                    </label>
                    <select
                      value={durationMinutes}
                      onChange={e => setDurationMinutes(Number(e.target.value))}
                      className="w-full bg-bg-1/50 border border-cyan-glow/20 rounded px-3 py-2 text-white text-sm focus:border-cyan-glow outline-none transition"
                      disabled={isSimulating}
                    >
                      <option value="5">5 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                    </select>
                  </div>

                  {/* Info */}
                  <div className="bg-warn/10 border border-warn/30 rounded p-3 text-xs text-gray-300">
                    💡 Scenario will simulate {multiplier}x orders for {durationMinutes} minutes and predict system impact.
                  </div>

                  {/* Run Button */}
                  <motion.button
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                    className="w-full py-3 bg-gradient-to-r from-cyan-glow/30 to-success/30 hover:from-cyan-glow/50 hover:to-success/50 border border-cyan-glow/50 text-cyan-glow rounded font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSimulating ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Simulating...
                      </span>
                    ) : (
                      'Run Simulation'
                    )}
                  </motion.button>

                  {/* Close Button */}
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    disabled={isSimulating}
                    className="w-full py-2 bg-gray-900/50 border border-gray-700/50 hover:border-gray-600 text-gray-400 rounded text-sm transition disabled:opacity-50"
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              ) : (
                <ScenarioResults results={results} onExport={handleExport} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ScenarioResults({
  results,
  onExport,
}: {
  results: ScenarioResults;
  onExport: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Peak Occupancy"
          value={`${results.peakOccupancy}%`}
          status={results.peakOccupancy > 90 ? 'critical' : results.peakOccupancy > 75 ? 'warn' : 'ok'}
        />
        <MetricCard
          label="Avg Throughput"
          value={`${results.avgThroughput}/h`}
          status="ok"
        />
        <MetricCard
          label="Impact Duration"
          value={`${results.impactDurationMinutes}m`}
          status="ok"
        />
        <MetricCard
          label="Est. Cost"
          value={`$${results.estimatedCost}`}
          status="ok"
        />
      </div>

      {/* Bottlenecks */}
      {results.bottlenecks.length > 0 && (
        <div className="bg-danger/10 border border-danger/30 rounded p-3">
          <h3 className="text-xs font-bold text-danger mb-2">⚠️ Bottlenecks Detected</h3>
          <div className="space-y-1">
            {results.bottlenecks.map(b => (
              <div key={b} className="text-xs text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                {b} sector will reach capacity
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-success/10 border border-success/30 rounded p-3">
        <h3 className="text-xs font-bold text-success mb-2">✅ Recommendations</h3>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Increase staff in WIP sector during spike</li>
          <li>• Activate overflow storage zones</li>
          <li>• Monitor real-time metrics closely</li>
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <motion.button
          onClick={onExport}
          className="flex-1 py-2 bg-cyan-glow/20 hover:bg-cyan-glow/30 border border-cyan-glow/50 text-cyan-glow rounded text-sm font-semibold transition"
          whileTap={{ scale: 0.98 }}
        >
          📥 Export CSV
        </motion.button>
        <motion.button
          onClick={() => window.location.reload()}
          className="flex-1 py-2 bg-magenta-glow/20 hover:bg-magenta-glow/30 border border-magenta-glow/50 text-magenta-glow rounded text-sm font-semibold transition"
          whileTap={{ scale: 0.98 }}
        >
          ↻ New Scenario
        </motion.button>
      </div>
    </motion.div>
  );
}

function MetricCard({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: 'ok' | 'warn' | 'critical';
}) {
  const colors = {
    ok: 'border-success/30 bg-success/5',
    warn: 'border-amber-glow/30 bg-warn/5',
    critical: 'border-danger/30 bg-danger/5',
  };

  return (
    <div className={`border rounded p-2 ${colors[status]}`}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-lg font-bold text-white">{value}</div>
    </div>
  );
}
