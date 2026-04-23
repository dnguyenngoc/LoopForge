import { buildLevelFromSeed, getCell } from '../src/game/level';
import { createSeededRng } from '../src/game/seededRng';
import { validatePathForRun, validatePathPrefix } from '../src/game/pathValidation';
import { advanceRun, beginRun } from '../src/game/simulation';
import type { CellCoord, Level } from '../src/game/types';

function neighbors(level: Level, c: CellCoord): CellCoord[] {
  const cand = [
    { row: c.row - 1, col: c.col },
    { row: c.row + 1, col: c.col },
    { row: c.row, col: c.col - 1 },
    { row: c.row, col: c.col + 1 },
  ];
  return cand.filter(n => {
    const k = getCell(level, n);
    return k === 'empty' || k === 'start' || k === 'goal';
  });
}

/**
 * BFS for an orthogonal start→goal path (empty/goal), used only in tests.
 */
function findPathBfs(level: Level): CellCoord[] | null {
  const start = level.start;
  const goal = level.goal;
  const q: CellCoord[][] = [[start]];
  const seen = new Set<string>([`${start.row},${start.col}`]);

  while (q.length > 0) {
    const path = q.shift()!;
    const last = path[path.length - 1]!;
    if (last.row === goal.row && last.col === goal.col) {
      return path;
    }
    for (const n of neighbors(level, last)) {
      const k = `${n.row},${n.col}`;
      if (seen.has(k)) {
        continue;
      }
      seen.add(k);
      q.push([...path, n]);
    }
  }
  return null;
}

describe('A1 + A2 — levels, validation, and simulation', () => {
  it('builds the same level layout for the same seed', () => {
    const a = buildLevelFromSeed(2026);
    const b = buildLevelFromSeed(2026);
    expect(a.grid).toEqual(b.grid);
  });

  it('yields the same PRNG stream for the same seed', () => {
    const r1 = createSeededRng(7);
    const r2 = createSeededRng(7);
    for (let i = 0; i < 32; i += 1) {
      expect(r1.nextU32()).toBe(r2.nextU32());
    }
  });

  it('rejects a prefix that does not start on the start cell', () => {
    const level = buildLevelFromSeed(3);
    const v = validatePathPrefix(level, [{ row: 1, col: 0 }]);
    expect(v).toEqual({ ok: false, reason: 'not_starting_at_start' });
  });

  it('validates a BFS path as a full run (first solvable seed in range)', () => {
    let level: Level | null = null;
    let path: CellCoord[] | null = null;
    for (let s = 0; s < 500; s += 1) {
      const L = buildLevelFromSeed(s);
      const p = findPathBfs(L);
      if (p) {
        level = L;
        path = p;
        break;
      }
    }
    if (!level || !path) {
      throw new Error('no solvable level in seed 0..499 (unexpected for this generator)');
    }
    expect(validatePathForRun(level, path).ok).toBe(true);
  });

  it('drives the run state machine to success for a valid path', () => {
    let level: Level | null = null;
    let path: CellCoord[] | null = null;
    for (let s = 0; s < 500; s += 1) {
      const L = buildLevelFromSeed(s);
      const p = findPathBfs(L);
      if (p) {
        level = L;
        path = p;
        break;
      }
    }
    if (!level || !path) {
      throw new Error('no solvable level in seed 0..499 (unexpected for this generator)');
    }
    const br = beginRun(level, path);
    expect(br.ok).toBe(true);
    if (!br.ok) {
      return;
    }
    let s = br.snapshot;
    for (let i = 0; i < 500; i += 1) {
      if (s.phase === 'success' || s.phase === 'fail') {
        break;
      }
      s = advanceRun(s, path.length);
    }
    expect(s.phase).toBe('success');
  });
});
