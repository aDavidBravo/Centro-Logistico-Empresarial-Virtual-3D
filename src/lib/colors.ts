import type { Status } from './types';

export const STATUS_COLOR: Record<Status, string> = {
  ok: '#22c55e',
  warn: '#facc15',
  critical: '#ef4444',
};

export const STATUS_GLOW: Record<Status, string> = {
  ok: '#22ffaa',
  warn: '#ffd166',
  critical: '#ff4d6d',
};

export const COLORS = {
  cyan: '#22d3ee',
  cyanDim: '#0e7490',
  amber: '#f97316',
  amberDim: '#7c2d12',
  blue: '#3b82f6',
  blueDim: '#1e3a8a',
  magenta: '#d946ef',
  ground: '#070b18',
  pavement: '#0d1426',
  road: '#13202f',
  roadLine: '#22d3ee',
  steel: '#3f4754',
  steelLight: '#5b6473',
  green: '#1f2937',
  paint: '#1d3557',
  containerOk: '#1d4ed8',
  containerWarn: '#ca8a04',
  containerCritical: '#b91c1c',
};
