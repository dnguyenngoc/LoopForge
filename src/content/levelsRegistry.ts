import {B1_ONBOARDING_LEVELS} from './b1OnboardingLevels';
import {B2_HANDCRAFTED_LEVELS} from './b2HandcraftedLevels';
import type {LevelSpec} from '../types/levelContent';

const ALL: LevelSpec[] = [...B1_ONBOARDING_LEVELS, ...B2_HANDCRAFTED_LEVELS].sort(
  (a, b) => a.id - b.id,
);

const byId = new Map(ALL.map(l => [l.id, l]));

export function getLevelById(id: number): LevelSpec | undefined {
  return byId.get(id);
}

export function getAllLevels(): LevelSpec[] {
  return ALL;
}

export function getLevelsByBatch(batch: LevelSpec['batch']): LevelSpec[] {
  return ALL.filter(l => l.batch === batch);
}

export function assertRegistryIntegrity(): void {
  for (let i = 0; i < ALL.length; i++) {
    const expected = i + 1;
    if (ALL[i]!.id !== expected) {
      throw new Error(`Level registry gap: index ${i} has id ${ALL[i]!.id}, expected ${expected}`);
    }
  }
}

assertRegistryIntegrity();
