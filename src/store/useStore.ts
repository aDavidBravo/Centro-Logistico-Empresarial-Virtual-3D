import { create } from 'zustand';
import { generate, type World } from '@/data/generator';
import type { SectorKey } from '@/lib/types';

export type TopTab = 'occupancy' | 'inbound' | 'wip' | 'outbound' | 'transport';

interface UIState {
  tab: TopTab;
  selectedSector: SectorKey | null;
  hoverEntityId: string | null;
  filters: { zone: string; rack: string; level: string; depth: string; client: string; supplier: string; carrier: string };
  showOverlays: boolean;
  showRoutes: boolean;
  paused: boolean;
  simSpeed: number;
}

interface AppState extends UIState {
  world: World;
  setTab: (t: TopTab) => void;
  selectSector: (s: SectorKey | null) => void;
  setHover: (id: string | null) => void;
  setFilter: (k: keyof UIState['filters'], v: string) => void;
  resetFilters: () => void;
  toggleOverlays: () => void;
  toggleRoutes: () => void;
  togglePause: () => void;
  setSimSpeed: (n: number) => void;
  tick: (dt: number) => void;
}

const defaultFilters: UIState['filters'] = {
  zone: 'Todas', rack: 'Todas', level: 'Todas', depth: 'Todas',
  client: 'Todos', supplier: 'Todos', carrier: 'Todos',
};

export const useStore = create<AppState>((set, get) => ({
  world: generate(42),
  tab: 'occupancy',
  selectedSector: null,
  hoverEntityId: null,
  filters: defaultFilters,
  showOverlays: true,
  showRoutes: true,
  paused: false,
  simSpeed: 1,

  setTab: (t) => set({ tab: t }),
  selectSector: (s) => set({ selectedSector: s, tab: s ? (s === 'storage' ? 'occupancy' : s) : get().tab }),
  setHover: (id) => set({ hoverEntityId: id }),
  setFilter: (k, v) => set(s => ({ filters: { ...s.filters, [k]: v } })),
  resetFilters: () => set({ filters: defaultFilters }),
  toggleOverlays: () => set(s => ({ showOverlays: !s.showOverlays })),
  toggleRoutes: () => set(s => ({ showRoutes: !s.showRoutes })),
  togglePause: () => set(s => ({ paused: !s.paused })),
  setSimSpeed: (n) => set({ simSpeed: n }),

  tick: (dt) => {
    if (get().paused) return;
    const sp = get().simSpeed;
    set(state => {
      const w = state.world;
      // mover AGVs/forklifts en pequeño bucle local
      const vehicles = w.vehicles.map(v => {
        if (v.kind !== 'agv' && v.kind !== 'forklift') return v;
        const t = (Date.now() / 1000) * v.speed * sp + v.pathSeed * 100;
        const radius = 5 + (v.pathSeed * 6);
        const cx = v.pos[0] + Math.cos(t) * 0.02;
        const cz = v.pos[2] + Math.sin(t * 0.7) * 0.02;
        return { ...v, pos: [cx, v.pos[1], cz] as [number, number, number], rot: t * 0.5 };
      });
      // drones en hover lento
      const drones = w.drones.map(d => {
        const tt = Date.now() / 1000;
        const dx = d.target[0] - d.pos[0];
        const dz = d.target[2] - d.pos[2];
        const dy = d.target[1] - d.pos[1];
        const len = Math.hypot(dx, dz, dy) || 1;
        const step = 0.04 * sp;
        let nx = d.pos[0] + (dx / len) * step;
        let ny = d.pos[1] + (dy / len) * step + Math.sin(tt + d.hover) * 0.005;
        let nz = d.pos[2] + (dz / len) * step;
        let target = d.target;
        if (len < 1.2) {
          target = [120 + (Math.random() - 0.5) * 30, 8 + Math.random() * 10, -10 + (Math.random() - 0.5) * 40];
        }
        return { ...d, pos: [nx, ny, nz] as [number, number, number], target };
      });
      // brazos con state cycling
      const arms = w.arms.map(a => ({
        ...a,
        state: ((Date.now() / 600 + a.station) % 3) < 1 ? 'pick' : ((Date.now() / 600 + a.station) % 3) < 2 ? 'place' : 'idle' as any,
      }));
      return { world: { ...w, vehicles, drones, arms } };
    });
  },
}));
