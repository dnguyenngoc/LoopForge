import {fnv1a32} from './hash32';

export type DailySeedInfo = {dateKey: string; seed: number};

/**
 * Rotates at UTC midnight: same calendar day in UTC → same layout seed; next day changes.
 */
export function getDailySeed(utc: Date = new Date()): DailySeedInfo {
  const y = utc.getUTCFullYear();
  const m = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const d = String(utc.getUTCDate()).padStart(2, '0');
  const dateKey = `${y}-${m}-${d}`;
  const seed = fnv1a32(`loopforge|daily|v1|${dateKey}`);
  return {dateKey, seed};
}

/**
 * Endless: deterministic per (profileSalt, runIndex). Advance runIndex every new run; profiles stay separate.
 */
export function getEndlessSeedForRun(
  runIndex: number,
  profileSalt: string = 'default',
): number {
  if (!Number.isInteger(runIndex) || runIndex < 0) {
    throw new Error('runIndex must be a non-negative integer');
  }
  return fnv1a32(`loopforge|endless|v1|${profileSalt}|${runIndex}`);
}

/**
 * Optional: re-seed a daily attempt counter without changing the daily calendar key.
 */
export function getDailyAttemptNonce(dateKey: string, attempt: number): number {
  if (!Number.isInteger(attempt) || attempt < 0) {
    throw new Error('attempt must be a non-negative integer');
  }
  return fnv1a32(`loopforge|daily|attempt|v1|${dateKey}|${attempt}`);
}
