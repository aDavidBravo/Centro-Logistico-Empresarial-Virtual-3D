// Campus layout: 5 sectores en línea con carreteras y áreas verdes
import type { Vec3 } from './types';

export type SectorId = 'inbound' | 'storage' | 'wip' | 'outbound' | 'transport';

export interface SectorDef {
  id: SectorId;
  label: string;
  pos: Vec3;            // centro del sector en el suelo
  size: [number, number]; // ancho (X), profundidad (Z)
  color: string;        // color base sector
  glow: string;         // color de halo selección
  description: string;
}

export const CAMPUS = {
  width: 260,           // X
  depth: 110,           // Z
  roadY: 0.02,
  groundColor: '#0a1020',
};

// Sectores ordenados de izquierda (recepción) a derecha (despacho)
export const SECTORS: SectorDef[] = [
  {
    id: 'inbound',
    label: 'INBOUND',
    pos: [-95, 0, 0],
    size: [40, 70],
    color: '#1e3a8a',
    glow: '#3b82f6',
    description: 'Recepción de mercadería · trailers entrantes · validación y clasificación',
  },
  {
    id: 'storage',
    label: 'STORAGE',
    pos: [-40, 0, 0],
    size: [50, 80],
    color: '#0f1e3d',
    glow: '#22d3ee',
    description: 'Torres de racks · 4 niveles · ABC rotation · 6.000 SKUs',
  },
  {
    id: 'wip',
    label: 'WIP · PACKING',
    pos: [25, 0, 0],
    size: [50, 70],
    color: '#3b1d04',
    glow: '#f97316',
    description: 'Líneas de empaque · brazos robóticos · selladoras · 8 estaciones',
  },
  {
    id: 'outbound',
    label: 'OUTBOUND',
    pos: [85, 0, 0],
    size: [40, 70],
    color: '#0c2a4a',
    glow: '#06b6d4',
    description: 'Docks de salida · trailers cargando · clasificación por destino',
  },
  {
    id: 'transport',
    label: 'TRANSPORT',
    pos: [135, 0, 0],
    size: [50, 80],
    color: '#1a1a2e',
    glow: '#a855f7',
    description: 'Flota mixta · trailers · vans · drones · última milla',
  },
];

export const SECTOR_BY_ID = Object.fromEntries(SECTORS.map(s => [s.id, s])) as Record<SectorId, SectorDef>;

// Carretera principal (eje X) que conecta sectores
export const MAIN_ROAD = {
  z: 0,
  width: 6,
  fromX: -130,
  toX: 165,
};

// Códigos para los IDs de containers / vehículos / pallets
export const ID_PREFIX = {
  container: 'CLEV',
  trailer: 'TRK',
  van: 'VAN',
  forklift: 'FLK',
  agv: 'AGV',
  drone: 'DRN',
  arm: 'ARM',
};
