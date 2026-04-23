/**
 * Simple deterministic PRNG for proc/consumers (e.g. hazard shuffles) from a 32-bit seed.
 */
export function createMulberry32(seed: number) {
  let a = seed >>> 0;
  return function next(): number {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 0xffffffff;
  };
}
