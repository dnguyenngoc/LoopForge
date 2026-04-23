/**
 * 32-bit deterministic PRNG. Uses only `Math.imul` + bit ops so results match
 * across Hermes (iOS/Android) and Jest/Node.
 */
export type SeededRng = {
  nextU32: () => number;
  nextInt: (n: number) => number;
};

export function createSeededRng(seed: number): SeededRng {
  let state = seed >>> 0;
  if (state === 0) {
    state = 0x9e3779b9; // avoid degenerate 0
  }

  const nextU32 = () => {
    // SplitMix32-based update (portable, fast)
    state = (state + 0x6d2b79f5) >>> 0;
    let z = state;
    z = Math.imul(z ^ (z >>> 15), z | 1) >>> 0;
    z = Math.imul(z ^ (z >>> 7), z | 61) >>> 0;
    z = (z ^ (z >>> 14)) >>> 0;
    return z >>> 0;
  };

  const nextInt = (n: number) => {
    if (n <= 0) {
      return 0;
    }
    return nextU32() % n;
  };

  return { nextU32, nextInt };
}
