import { createSeededRng } from './seededRng';
import type { CellKind, Level } from './types';

const DEFAULT_ROWS = 8;
const DEFAULT_COLS = 8;

function key(row: number, col: number) {
  return `${row},${col}`;
}

/**
 * Produces a solvable level layout from `seed` (walls only; pathfinding left to player).
 * Start top-left, goal bottom-right. Wall count 8–15, deterministic.
 */
export function buildLevelFromSeed(seed: number): Level {
  const rows = DEFAULT_ROWS;
  const cols = DEFAULT_COLS;
  const grid: CellKind[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 'empty' as CellKind),
  );

  const start = { row: 0, col: 0 };
  const goal = { row: rows - 1, col: cols - 1 };
  grid[start.row][start.col] = 'start';
  grid[goal.row][goal.col] = 'goal';

  const rng = createSeededRng(seed);
  // Keep wall density moderate so start→goal path remains likely at small grid sizes.
  const wallCount = 5 + rng.nextInt(5);
  const blocked = new Set<string>([key(start.row, start.col), key(goal.row, goal.col)]);

  let placed = 0;
  const maxTries = rows * cols * 4;
  let tries = 0;
  while (placed < wallCount && tries < maxTries) {
    tries += 1;
    const r = rng.nextInt(rows);
    const c = rng.nextInt(cols);
    const k = key(r, c);
    if (blocked.has(k)) {
      continue;
    }
    blocked.add(k);
    grid[r][c] = 'wall';
    placed += 1;
  }

  return { rows, cols, grid, start, goal, seed };
}

export function getCell(
  level: Level,
  coord: { row: number; col: number },
): CellKind | undefined {
  return level.grid[coord.row]?.[coord.col];
}
