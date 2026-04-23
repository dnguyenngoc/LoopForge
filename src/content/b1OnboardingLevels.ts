import type {LevelSpec} from '../types/levelContent';

/** B1: five ultra-easy onboarding levels (1–5). Intention: first clear in <30s, zero ambiguity. */
export const B1_ONBOARDING_LEVELS: LevelSpec[] = [
  {
    id: 1,
    name: 'First Step',
    batch: 'B1',
    tutorialBeats: ['move', 'goal'],
    playfield: {w: 5, h: 5, start: {x: 0, y: 2}, goal: {x: 4, y: 2}},
    hazards: [],
    failPointIntent: 'none',
    notesForQA: 'Straight line, no failure pressure.',
  },
  {
    id: 2,
    name: 'Gentle Bend',
    batch: 'B1',
    tutorialBeats: ['move', 'goal'],
    playfield: {w: 5, h: 5, start: {x: 0, y: 4}, goal: {x: 4, y: 0}},
    hazards: [],
    failPointIntent: 'path_choice',
    notesForQA: 'One obvious diagonal; validate tutorial completion funnel.',
  },
  {
    id: 3,
    name: 'Spike Intro',
    batch: 'B1',
    tutorialBeats: ['hazard', 'move', 'goal'],
    playfield: {w: 5, h: 5, start: {x: 0, y: 2}, goal: {x: 4, y: 2}},
    hazards: [{id: 'h1', kind: 'spike', x: 2, y: 2}],
    failPointIntent: 'hazard_dodge',
    notesForQA: 'Single static hazard, wide tolerance.',
  },
  {
    id: 4,
    name: 'Two Step',
    batch: 'B1',
    tutorialBeats: ['hazard', 'reset', 'goal'],
    playfield: {w: 6, h: 5, start: {x: 0, y: 2}, goal: {x: 5, y: 2}},
    hazards: [
      {id: 'h1', kind: 'spike', x: 2, y: 1},
      {id: 'h2', kind: 'spike', x: 2, y: 3},
    ],
    failPointIntent: 'timing',
    notesForQA: 'Teach stop/wait; still generous windows.',
  },
  {
    id: 5,
    name: 'Capstone Tutor',
    batch: 'B1',
    tutorialBeats: ['hazard', 'back', 'goal'],
    playfield: {w: 6, h: 6, start: {x: 0, y: 0}, goal: {x: 5, y: 5}},
    hazards: [{id: 'h1', kind: 'spike', x: 2, y: 2, meta: {width: 2, height: 1}}],
    failPointIntent: 'path_choice',
    notesForQA: 'Combines prior beats; should still be trivial for >80% completion target.',
  },
];
