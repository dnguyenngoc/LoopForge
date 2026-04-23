import {formatShareCardText} from '../src/share/shareCard';

describe('formatShareCardText', () => {
  it('includes score, seed, timestamp, mode', () => {
    const t = formatShareCardText({
      score: 10,
      seed: 0xdeadbeef,
      timestampIso: '2026-04-23T04:00:00.000Z',
      mode: 'endless',
    });
    expect(t).toContain('LoopForge');
    expect(t).toContain('Mode: endless');
    expect(t).toContain('Score: 10');
    expect(t).toContain('3735928559');
    expect(t).toContain('2026-04-23T04:00:00.000Z');
  });
});
