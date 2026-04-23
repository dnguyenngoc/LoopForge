import {Share} from 'react-native';

export type ShareCardInput = {
  score: number;
  seed: number;
  /** ISO-8601 timestamp string (e.g. new Date().toISOString()) */
  timestampIso: string;
  mode: 'daily' | 'endless' | 'campaign';
};

export function formatShareCardText(input: ShareCardInput): string {
  const {score, seed, timestampIso, mode} = input;
  return [
    'LoopForge',
    `Mode: ${mode}`,
    `Score: ${score}`,
    `Seed: ${seed >>> 0}`,
    `Time: ${timestampIso}`,
  ].join('\n');
}

export async function shareScoreCard(input: ShareCardInput): Promise<void> {
  const message = formatShareCardText(input);
  await Share.share({message, title: 'LoopForge score'});
}
