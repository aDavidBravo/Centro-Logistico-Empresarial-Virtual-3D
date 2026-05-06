export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export const pick = <T>(rng: () => number, arr: readonly T[]) => arr[Math.floor(rng() * arr.length)];
export const randInt = (rng: () => number, min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
export const randRange = (rng: () => number, min: number, max: number) => rng() * (max - min) + min;

export function gauss(rng: () => number, mean = 0, std = 1) {
  const u = 1 - rng(), v = rng();
  return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
