export type CellKind = 'empty' | 'wall' | 'start' | 'goal';

export type CellCoord = { row: number; col: number };

export type Level = {
  rows: number;
  cols: number;
  grid: CellKind[][];
  start: CellCoord;
  goal: CellCoord;
  seed: number;
};

/**
 * Actionable reason codes for validation / simulation (A1 + A2).
 * Used for tags and future hazard-specific failures in A3.
 */
export type FailReasonCode =
  | 'empty_path'
  | 'not_starting_at_start'
  | 'not_orthogonal_step'
  | 'revisited_cell'
  | 'blocked_by_wall'
  | 'goal_not_reached'
  | 'no_path_to_goal'
  | 'hazard_block';

export type ValidationResult = { ok: true } | { ok: false; reason: FailReasonCode };

export type GamePhase =
  | 'idle'
  | 'drawing'
  | 'validating'
  | 'running'
  | 'success'
  | 'fail';
