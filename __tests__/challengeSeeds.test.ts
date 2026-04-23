import {getDailySeed, getEndlessSeedForRun, getDailyAttemptNonce} from '../src/seed/challengeSeeds';
import {createMulberry32} from '../src/seed/mulberry32';
import {getAllLevels, getLevelById} from '../src/content/levelsRegistry';

describe('challengeSeeds', () => {
  it('daily seed stable per UTC day and changes next day', () => {
    const a = new Date('2026-01-10T10:00:00.000Z');
    const b = new Date('2026-01-10T22:00:00.000Z');
    const c = new Date('2026-01-11T00:30:00.000Z');
    const ra = getDailySeed(a);
    const rb = getDailySeed(b);
    const rc = getDailySeed(c);
    expect(ra.dateKey).toBe('2026-01-10');
    expect(ra.seed).toBe(rb.seed);
    expect(rc.dateKey).toBe('2026-01-11');
    expect(ra.seed).not.toBe(rc.seed);
  });

  it('endless seed is deterministic for same run and differs by runIndex', () => {
    const s0 = getEndlessSeedForRun(0, 'p1');
    const s0b = getEndlessSeedForRun(0, 'p1');
    const s1 = getEndlessSeedForRun(1, 'p1');
    const s0p2 = getEndlessSeedForRun(0, 'p2');
    expect(s0).toBe(s0b);
    expect(s0).not.toBe(s1);
    expect(s0).not.toBe(s0p2);
  });

  it('mulberry is deterministic for same seed', () => {
    const a = createMulberry32(123);
    const b = createMulberry32(123);
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });

  it('daily attempt nonce varies by attempt for same day', () => {
    const n0 = getDailyAttemptNonce('2026-01-10', 0);
    const n1 = getDailyAttemptNonce('2026-01-10', 1);
    expect(n0).not.toBe(n1);
  });
});

describe('level registry', () => {
  it('has 20 contiguous campaign levels with metadata', () => {
    const all = getAllLevels();
    expect(all).toHaveLength(20);
    for (const id of [1, 5, 6, 20] as const) {
      const level = getLevelById(id);
      expect(level).toBeDefined();
    }
  });
});
