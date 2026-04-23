import { getCell } from './level';
import type { Level } from './types';
import type { CellCoord } from './types';

function isBlocked(level: Level, c: CellCoord) {
  const k = getCell(level, c);
  return k === undefined || k === 'wall';
}

/**
 * One orthogonal step toward `target` (row-first on diagonals) for line expansion.
 */
function stepOrthogonalToward(from: CellCoord, to: CellCoord): CellCoord | null {
  if (from.row === to.row && from.col === to.col) {
    return null;
  }
  const dr = to.row - from.row;
  const dc = to.col - from.col;
  if (dr !== 0 && dc !== 0) {
    return { row: from.row + (dr > 0 ? 1 : -1), col: from.col };
  }
  if (dr !== 0) {
    return { row: from.row + (dr > 0 ? 1 : -1), col: from.col };
  }
  return { row: from.row, col: from.col + (dc > 0 ? 1 : -1) };
}

/**
 * Extends a stroke from the current `path` toward `target` in integer grid steps.
 * Supports backtrack by moving onto the previous cell.
 */
export function appendStrokeToPath(
  level: Level,
  path: readonly CellCoord[],
  target: CellCoord,
): CellCoord[] {
  if (path.length === 0) {
    if (target.row === level.start.row && target.col === level.start.col) {
      return [target];
    }
    return [];
  }

  const out: CellCoord[] = path.map(p => ({ ...p }));
  let cur = out[out.length - 1]!;

  if (cur.row === target.row && cur.col === target.col) {
    return out;
  }

  let guard = 0;
  while ((cur.row !== target.row || cur.col !== target.col) && guard < 200) {
    guard += 1;
    if (out.length >= 2) {
      const prev = out[out.length - 2]!;
      const next = stepOrthogonalToward(cur, target);
      if (next && next.row === prev.row && next.col === prev.col) {
        out.pop();
        cur = out[out.length - 1]!;
        continue;
      }
    }
    const step = stepOrthogonalToward(cur, target);
    if (step === null) {
      break;
    }
    if (isBlocked(level, step)) {
      break;
    }
    if (out.some(p => p.row === step.row && p.col === step.col)) {
      break;
    }
    out.push(step);
    cur = step;
  }
  return out;
}
