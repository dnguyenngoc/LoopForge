/**
 * Data shapes for level authoring. Gameplay/sim consume these once Epic A APIs land.
 */
export type FailPointIntent =
  | 'none'
  | 'timing'
  | 'hazard_dodge'
  | 'path_choice'
  | 'resource';

export type LevelBatch = 'B1' | 'B2';

export interface LevelHazard {
  id: string;
  kind: string;
  x: number;
  y: number;
  meta?: Record<string, unknown>;
}

export interface LevelSpec {
  id: number;
  name: string;
  batch: LevelBatch;
  /**
   * B1 onboarding: which tutorial beats to show (harness wires these to UI).
   * Keep ultra-easy: short paths, minimal reading.
   */
  tutorialBeats?: Array<'move' | 'goal' | 'hazard' | 'reset' | 'back'>;
  /**
   * B2 only: 1 = easiest in batch, 5 = hardest in this band (6–20 curve).
   */
  difficultyOnCurve?: 1 | 2 | 3 | 4 | 5;
  failPointIntent?: FailPointIntent;
  playfield: {
    w: number;
    h: number;
    start: { x: number; y: number };
    goal: { x: number; y: number };
  };
  hazards: LevelHazard[];
  notesForQA?: string;
}
