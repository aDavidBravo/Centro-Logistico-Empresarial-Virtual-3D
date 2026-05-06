import { mulberry32, pick, randInt, randRange, gauss } from '@/lib/rng';
import { SECTORS } from '@/lib/layout';
import type {
  Category, SKU, RackUnit, Vehicle, Drone, RoboticArm, Conveyor, Container,
  AlertEvt, AIRecommendation, KPISnapshot, ClientLoad, Status, Vec3, SectorKey,
} from '@/lib/types';

const CATEGORIES: Category[] = ['electronics', 'apparel', 'home', 'books', 'beauty', 'grocery', 'toys', 'sports'];
const NAME_PREFIX: Record<Category, string[]> = {
  electronics: ['EchoPod', 'NovaTab', 'PrismCam', 'OrbitWatch', 'PulseBuds', 'VegaDrive'],
  apparel: ['NorthRun', 'UrbanCore', 'CloudFit', 'TrailMax', 'StreetWeave'],
  home: ['LumenLamp', 'AirMist', 'SoftWeave', 'ChefPro', 'NestSet'],
  books: ['Atlas', 'Codex', 'Veritas', 'Lumen', 'Saga'],
  beauty: ['GlowPure', 'VeluxeSerum', 'AuraBalm', 'Petal', 'HydraSilk'],
  grocery: ['CrispBite', 'GoldenOat', 'BrewSelect', 'PureSpring', 'HarvestJar'],
  toys: ['BlockKing', 'PuzzleX', 'StarRover', 'PlushPal', 'MazeQuest'],
  sports: ['FleetRun', 'CoreFlex', 'ProTrek', 'AeroLift', 'StridePro'],
};
export const CITIES = ['Bogotá', 'Medellín', 'Cali', 'Lima', 'Quito', 'Santiago', 'Buenos Aires', 'São Paulo', 'Ciudad de México', 'Panamá'];
export const CLIENTS = ['Client A', 'Client B', 'Client C', 'Client D', 'Client E', 'Client F', 'Client G', 'Client H', 'Client I', 'Client J'];
export const SUPPLIERS = ['Acme', 'Globex', 'Initech', 'Soylent', 'Umbrella', 'Massive', 'Pied Piper'];
export const CARRIERS = ['DHL', 'FedEx', 'UPS', 'TNT', 'Aramex', 'CleVTrans'];

export interface World {
  skus: SKU[];
  racks: RackUnit[];
  vehicles: Vehicle[];
  drones: Drone[];
  arms: RoboticArm[];
  conveyors: Conveyor[];
  containers: Container[];
  alerts: AlertEvt[];
  recs: AIRecommendation[];
  kpi: KPISnapshot;
  clientLoad: ClientLoad[];
}

function status(rng: () => number): Status {
  const r = rng();
  return r < 0.08 ? 'critical' : r < 0.28 ? 'warn' : 'ok';
}

function buildRacks(rng: () => number, sectorPos: Vec3, sectorSize: [number, number]): RackUnit[] {
  const out: RackUnit[] = [];
  const [cx, , cz] = sectorPos;
  const [w, d] = sectorSize;
  const rows = 6;
  const cols = 8;
  const levels = 4;
  const stepX = (w - 8) / cols;
  const stepZ = (d - 14) / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = cx - w / 2 + 4 + c * stepX + stepX / 2;
      const z = cz - d / 2 + 7 + r * stepZ + stepZ / 2;
      for (let lvl = 0; lvl < levels; lvl++) {
        const occ = Math.max(0, Math.min(100, gauss(rng, 88, 10)));
        out.push({
          id: `R-${r}-${c}-L${lvl}`,
          sector: 'storage',
          x, z,
          y: 0.6 + lvl * 1.4,
          level: lvl,
          occupancyPct: +occ.toFixed(1),
          status: occ < 25 ? 'critical' : occ > 95 ? 'warn' : 'ok',
        });
      }
    }
  }
  return out;
}

export function generate(seed = 42): World {
  const rng = mulberry32(seed);
  const skus: SKU[] = Array.from({ length: 6000 }, (_, i) => {
    const cat = pick(rng, CATEGORIES);
    const r = rng();
    const abc = r < 0.2 ? 'A' : r < 0.55 ? 'B' : 'C';
    return {
      id: `SKU-${(i + 1).toString().padStart(5, '0')}`,
      name: `${pick(rng, NAME_PREFIX[cat])} ${randInt(rng, 100, 999)}`,
      category: cat,
      weightKg: +Math.max(0.05, gauss(rng, 0.8, 0.6)).toFixed(2),
      volumeL: +Math.max(0.1, gauss(rng, 2.4, 1.6)).toFixed(2),
      price: +Math.max(2, gauss(rng, 38, 22)).toFixed(2),
      abc,
      rotationDays: abc === 'A' ? randInt(rng, 2, 7) : abc === 'B' ? randInt(rng, 8, 21) : randInt(rng, 22, 60),
    };
  });

  const storage = SECTORS.find(s => s.id === 'storage')!;
  const racks = buildRacks(rng, storage.pos, storage.size);

  // Vehículos
  const vehicles: Vehicle[] = [];
  // Trailers en inbound
  for (let i = 0; i < 4; i++) {
    vehicles.push({
      id: `TRK-${(i + 1).toString().padStart(2, '0')}-IN`,
      kind: 'trailer',
      pos: [-110 + i * 8, 0, -25 + i * 4] as Vec3,
      rot: Math.PI / 2,
      loadPct: randInt(rng, 35, 95),
      status: status(rng),
      origin: pick(rng, SUPPLIERS),
      destination: 'INBOUND',
      cargo: `${randInt(rng, 80, 220)} pallets`,
      speed: 0,
      pathSeed: rng(),
      routeSector: 'inbound',
    });
  }
  // Trailers en outbound
  for (let i = 0; i < 5; i++) {
    vehicles.push({
      id: `TRK-${(i + 1).toString().padStart(2, '0')}-OUT`,
      kind: 'trailer',
      pos: [70 + i * 7, 0, -28 + i * 3] as Vec3,
      rot: -Math.PI / 2,
      loadPct: randInt(rng, 40, 100),
      status: status(rng),
      origin: 'OUTBOUND',
      destination: pick(rng, CITIES),
      cargo: `${randInt(rng, 80, 220)} pallets`,
      speed: 0,
      pathSeed: rng(),
      routeSector: 'outbound',
    });
  }
  // Camiones medianos en transport
  for (let i = 0; i < 6; i++) {
    vehicles.push({
      id: `VAN-${(i + 1).toString().padStart(2, '0')}`,
      kind: 'van',
      pos: [120 + (i % 3) * 6, 0, -30 + Math.floor(i / 3) * 8] as Vec3,
      rot: 0,
      loadPct: randInt(rng, 20, 90),
      status: status(rng),
      origin: 'OUTBOUND',
      destination: pick(rng, CITIES),
      cargo: `${randInt(rng, 12, 48)} cajas`,
      speed: 0,
      pathSeed: rng(),
      routeSector: 'transport',
    });
  }
  // AGVs / forklifts en pasillos
  for (let i = 0; i < 14; i++) {
    const sector = pick(rng, SECTORS);
    vehicles.push({
      id: `AGV-${(i + 1).toString().padStart(2, '0')}`,
      kind: i % 3 === 0 ? 'forklift' : 'agv',
      pos: [sector.pos[0] + randRange(rng, -sector.size[0] / 2 + 4, sector.size[0] / 2 - 4), 0, sector.pos[2] + randRange(rng, -sector.size[1] / 2 + 4, sector.size[1] / 2 - 4)] as Vec3,
      rot: rng() * Math.PI * 2,
      loadPct: randInt(rng, 0, 100),
      status: status(rng),
      origin: sector.label,
      destination: 'STORAGE',
      cargo: `pallet ${randInt(rng, 1, 999)}`,
      speed: randRange(rng, 1.2, 2.4),
      pathSeed: rng(),
      routeSector: sector.id,
    });
  }

  // Drones en transport
  const drones: Drone[] = Array.from({ length: 8 }, (_, i) => ({
    id: `DRN-${(i + 1).toString().padStart(2, '0')}`,
    pos: [120 + randRange(rng, -15, 15), randRange(rng, 8, 18), -10 + randRange(rng, -10, 30)] as Vec3,
    target: [120 + randRange(rng, -15, 15), randRange(rng, 8, 18), -10 + randRange(rng, -10, 30)] as Vec3,
    hover: rng() * Math.PI * 2,
    loadPct: randInt(rng, 0, 100),
    battery: randInt(rng, 30, 100),
    status: status(rng),
    destinationCity: pick(rng, CITIES),
  }));

  // Brazos robóticos en WIP — 2 líneas de 4
  const arms: RoboticArm[] = [];
  const wip = SECTORS.find(s => s.id === 'wip')!;
  for (let line = 0; line < 2; line++) {
    for (let i = 0; i < 4; i++) {
      const x = wip.pos[0] - wip.size[0] / 2 + 8 + i * (wip.size[0] - 16) / 3;
      const z = wip.pos[2] - 14 + line * 18;
      arms.push({
        id: `ARM-L${line + 1}-${i + 1}`,
        pos: [x, 0, z],
        station: line * 4 + i,
        state: pick(rng, ['idle', 'pick', 'place'] as const),
        cyclesPerHour: randInt(rng, 60, 220),
        status: status(rng),
      });
    }
  }

  // Conveyors en WIP
  const conveyors: Conveyor[] = [];
  for (let line = 0; line < 2; line++) {
    const z = wip.pos[2] - 14 + line * 18;
    conveyors.push({
      id: `CONV-${line + 1}`,
      from: [wip.pos[0] - wip.size[0] / 2 + 4, 0.4, z],
      to: [wip.pos[0] + wip.size[0] / 2 - 4, 0.4, z],
      active: true,
      speed: randRange(rng, 0.4, 1.2),
      load: randRange(rng, 0.3, 0.95),
    });
  }

  // Containers apilados en outbound yard
  const containers: Container[] = [];
  const outb = SECTORS.find(s => s.id === 'outbound')!;
  for (let i = 0; i < 18; i++) {
    const col = i % 6, row = Math.floor(i / 6);
    containers.push({
      id: `${'CLEV'}-${(2026)}-${(i + 1000).toString().padStart(4, '0')}-${'O'}`,
      pos: [outb.pos[0] - outb.size[0] / 2 + 6 + col * 4, 0.6 + (i % 3) * 2.4, outb.pos[2] + 18 + row * 5],
      sector: 'outbound',
      status: status(rng),
      destinationCity: pick(rng, CITIES),
      contentSku: pick(rng, skus).id,
    });
  }
  // Containers en inbound yard
  const inb = SECTORS.find(s => s.id === 'inbound')!;
  for (let i = 0; i < 12; i++) {
    const col = i % 4, row = Math.floor(i / 4);
    containers.push({
      id: `${'CLEV'}-${(2026)}-${(i + 2000).toString().padStart(4, '0')}-${'I'}`,
      pos: [inb.pos[0] - inb.size[0] / 2 + 6 + col * 4, 0.6 + (i % 2) * 2.4, inb.pos[2] + 16 + row * 5],
      sector: 'inbound',
      status: status(rng),
      destinationCity: 'STORAGE',
      contentSku: pick(rng, skus).id,
    });
  }

  // Alerts iniciales
  const alerts: AlertEvt[] = [
    { id: 'a1', t: Date.now() - 60_000, level: 'warn', sector: 'wip', message: 'Línea 2 throughput -18% (estación 5 lenta)' },
    { id: 'a2', t: Date.now() - 30_000, level: 'critical', sector: 'outbound', message: 'Dock 3 sin trailer asignado · cola 14 pedidos' },
    { id: 'a3', t: Date.now() - 12_000, level: 'info', sector: 'storage', message: 'Reposición zona D-04 completada' },
    { id: 'a4', t: Date.now() - 5_000, level: 'warn', sector: 'transport', message: 'Drone DRN-04 batería 28% · regresar' },
  ];

  const recs: AIRecommendation[] = [
    { id: 'r1', t: Date.now(), priority: 'high', sector: 'outbound', message: 'Reasignar TRK-04-OUT al dock 3', impact: '-14min delay · +SLA 4.2%' },
    { id: 'r2', t: Date.now(), priority: 'med', sector: 'wip', message: 'Pausar línea 2 estación 5 · mantener estación 4', impact: '+throughput 9%' },
    { id: 'r3', t: Date.now(), priority: 'low', sector: 'storage', message: 'Mover SKU electronics A→D2 (rotación alta)', impact: 'pick path -22%' },
  ];

  // KPI
  const totalCap = racks.length * 60;
  const totalUsed = Math.round(racks.reduce((acc, r) => acc + (r.occupancyPct / 100) * 60, 0));
  const kpi: KPISnapshot = {
    totalOccupancyPct: +(100 * totalUsed / totalCap).toFixed(1),
    inboundOccupancyPct: 90,
    outboundOccupancyPct: 87,
    wipCount: 42,
    totalCapacity: 3136,
    totalUsed: 2775,
    inboundCapacity: 1680,
    inboundUsed: 1515,
    outboundCapacity: 1456,
    outboundUsed: 1260,
    wipPrep: 6,
    wipProd: 18,
    wipPack: 18,
    ordersPerMin: 47,
    pickRatePerMin: 38,
    packRatePerMin: 35,
    shipRatePerMin: 32,
    slaCompliance: 96.4,
  };

  const clientLoad: ClientLoad[] = CLIENTS.map(c => ({ client: c, used: randInt(rng, 16, 256) })).sort((a, b) => b.used - a.used);

  return { skus, racks, vehicles, drones, arms, conveyors, containers, alerts, recs, kpi, clientLoad };
}
