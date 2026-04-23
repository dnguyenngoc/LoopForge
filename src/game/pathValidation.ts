import { getCell } from './level';
import type { CellCoord, Level, ValidationResult } from './types';

function isOrthogonal(a: CellCoord, b: CellCoord) {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  return dr + dc === 1;
}

/**
 * Rules while the player is still drawing: valid prefix, not necessarily at goal.
 */
export function validatePathPrefix(level: Level, path: readonly CellCoord[]): ValidationResult {
  if (path.length === 0) {
    return { ok: true };
  }
  if (path[0].row !== level.start.row || path[0].col !== level.start.col) {
    return { ok: false, reason: 'not_starting_at_start' };
  }

  const seen = new Set<string>();
  for (let i = 0; i < path.length; i += 1) {
    const cur = path[i]!;
    const curKey = `${cur.row},${cur.col}`;

    if (seen.has(curKey)) {
      return { ok: false, reason: 'revisited_cell' };
    }
    seen.add(curKey);

    const kind = getCell(level, cur);
    if (kind === undefined) {
      return { ok: false, reason: 'blocked_by_wall' };
    }
    if (kind === 'wall') {
      return { ok: false, reason: 'blocked_by_wall' };
    }
    if (i > 0) {
      const prev = path[i - 1]!;
      if (!isOrthogonal(prev, cur)) {
        return { ok: false, reason: 'not_orthogonal_step' };
      }
    }
  }
  return { ok: true };
}

/**
 * Synchronous path validation (target < 50ms for typical path lengths) — O(n) over cells.
 * Call on Run (full path to goal).
 */
export function validatePathForRun(level: Level, path: readonly CellCoord[]): ValidationResult {
  if (path.length === 0) {
    return { ok: false, reason: 'empty_path' };
  }
  if (path[0].row !== level.start.row || path[0].col !== level.start.col) {
    return { ok: false, reason: 'not_starting_at_start' };
  }

  const seen = new Set<string>();
  for (let i = 0; i < path.length; i += 1) {
    const cur = path[i]!;
    const curKey = `${cur.row},${cur.col}`;

    if (seen.has(curKey)) {
      return { ok: false, reason: 'revisited_cell' };
    }
    seen.add(curKey);

    const kind = getCell(level, cur);
    if (kind === undefined) {
      return { ok: false, reason: 'blocked_by_wall' };
    }
    if (kind === 'wall') {
      return { ok: false, reason: 'blocked_by_wall' };
    }
    if (i > 0) {
      const prev = path[i - 1]!;
      if (!isOrthogonal(prev, cur)) {
        return { ok: false, reason: 'not_orthogonal_step' };
      }
    }
  }

  const last = path[path.length - 1]!;
  if (last.row !== level.goal.row || last.col !== level.goal.col) {
    return { ok: false, reason: 'goal_not_reached' };
  }

  return { ok: true };
}
