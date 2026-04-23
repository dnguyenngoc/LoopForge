import { validatePathForRun } from './pathValidation';
import type { Level } from './types';
import type { CellCoord, FailReasonCode, GamePhase } from './types';

export type SimSnapshot = {
  phase: GamePhase;
  runStepIndex: number;
  lastFailReason: FailReasonCode | null;
};

export function createInitialSim(): SimSnapshot {
  return { phase: 'idle', runStepIndex: 0, lastFailReason: null };
}

/**
 * A2: auto-run = stepping along the path after validation, ending in success.
 * (Hazard hooks will extend this in A3 with extra fail tags.)
 */
export function beginRun(
  level: Level,
  path: readonly CellCoord[],
): { snapshot: SimSnapshot; ok: true } | { snapshot: SimSnapshot; ok: false; reason: FailReasonCode } {
  const v = validatePathForRun(level, path);
  if (!v.ok) {
    return {
      ok: false,
      reason: v.reason,
      snapshot: { phase: 'fail', runStepIndex: 0, lastFailReason: v.reason },
    };
  }
  return {
    ok: true,
    snapshot: { phase: 'running', runStepIndex: 0, lastFailReason: null },
  };
}

export function advanceRun(
  current: SimSnapshot,
  pathLength: number,
): SimSnapshot {
  if (current.phase !== 'running') {
    return current;
  }
  if (pathLength === 0) {
    return { phase: 'fail', runStepIndex: 0, lastFailReason: 'empty_path' };
  }
  const nextIndex = current.runStepIndex + 1;
  if (nextIndex >= pathLength) {
    return { phase: 'success', runStepIndex: pathLength - 1, lastFailReason: null };
  }
  return { ...current, runStepIndex: nextIndex, phase: 'running' };
}

export function resetAfterFail(): SimSnapshot {
  return { phase: 'idle', runStepIndex: 0, lastFailReason: null };
}
