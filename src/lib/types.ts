export type Vec3 = [number, number, number];

export type Category = 'electronics' | 'apparel' | 'home' | 'books' | 'beauty' | 'grocery' | 'toys' | 'sports';
export type Status = 'ok' | 'warn' | 'critical';

export interface SKU {
  id: string;
  name: string;
  category: Category;
  weightKg: number;
  volumeL: number;
  price: number;
  abc: 'A' | 'B' | 'C';
  rotationDays: number;
}

export type SectorKey = 'inbound' | 'storage' | 'wip' | 'outbound' | 'transport';

export interface SectorMetrics {
  id: SectorKey;
  occupancyPct: number;     // 0..100
  throughputPerHour: number;
  itemsInside: number;
  pending: number;
  status: Status;
  alerts: number;
}

export interface RackUnit {
  id: string;
  sector: 'storage';
  x: number; z: number; y: number;
  level: number;
  occupancyPct: number;
  status: Status;
  skuId?: string;
}

export type VehicleKind = 'trailer' | 'truck' | 'van' | 'drone' | 'forklift' | 'agv';

export interface Vehicle {
  id: string;
  kind: VehicleKind;
  pos: Vec3;
  rot: number;          // rotación Y en radianes
  loadPct: number;
  status: Status;
  origin?: string;
  destination?: string;
  cargo?: string;
  speed: number;
  pathSeed: number;
  routeSector?: SectorKey;
}

export interface RoboticArm {
  id: string;
  pos: Vec3;
  station: number;
  state: 'idle' | 'pick' | 'place';
  cyclesPerHour: number;
  status: Status;
}

export interface Conveyor {
  id: string;
  from: Vec3; to: Vec3;
  active: boolean;
  speed: number;
  load: number;
}

export interface Drone {
  id: string;
  pos: Vec3;
  target: Vec3;
  hover: number;
  loadPct: number;
  battery: number;
  status: Status;
  destinationCity?: string;
}

export interface Container {
  id: string;
  pos: Vec3;
  sector: SectorKey;
  status: Status;
  destinationCity?: string;
  contentSku?: string;
  trailerId?: string;
}

export interface AlertEvt {
  id: string;
  t: number;
  level: 'info' | 'warn' | 'critical';
  sector: SectorKey;
  message: string;
}

export interface AIRecommendation {
  id: string;
  t: number;
  priority: 'low' | 'med' | 'high';
  sector: SectorKey;
  message: string;
  impact: string; // ej. "-14min delay"
}

export interface KPISnapshot {
  totalOccupancyPct: number;
  inboundOccupancyPct: number;
  outboundOccupancyPct: number;
  wipCount: number;
  totalCapacity: number;
  totalUsed: number;
  inboundCapacity: number;
  inboundUsed: number;
  outboundCapacity: number;
  outboundUsed: number;
  wipPrep: number;
  wipProd: number;
  wipPack: number;
  ordersPerMin: number;
  pickRatePerMin: number;
  packRatePerMin: number;
  shipRatePerMin: number;
  slaCompliance: number;
}

export interface ClientLoad {
  client: string;
  used: number;
}
