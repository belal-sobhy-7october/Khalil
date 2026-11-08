import { describe, expect, it } from 'vitest';
import { translations } from '../../i18n/translations';
import { GUIDE_PARTS, GUIDE_STEPS, nextPartStart, stepsFor } from './steps';
import { MASCOT_POSES } from './mascotPoses';

describe("Khalil's tour", () => {
  it('has a title and a text for every step, and a name for every part, in both languages', () => {
    for (const lang of ['en', 'ar'] as const) {
      const guide = translations[lang].guide as unknown as { steps: Record<string, { title: string; text: string }>; parts: Record<string, string> };
      for (const step of GUIDE_STEPS) {
        expect(guide.steps[step.id]?.title, `${lang} ${step.id}`).toBeTruthy();
        expect(guide.steps[step.id]?.text, `${lang} ${step.id}`).toBeTruthy();
      }
      for (const part of GUIDE_PARTS) expect(guide.parts[part], `${lang} ${part}`).toBeTruthy();
    }
  });

  it('uses only known poses, and keeps each part in one run', () => {
    for (const step of GUIDE_STEPS) expect(MASCOT_POSES).toContain(step.pose);
    const order = GUIDE_STEPS.map((s) => s.part).filter((p, i, all) => all[i - 1] !== p);
    expect(order).toEqual([...GUIDE_PARTS]);
  });

  it('tells a guest, someone browsing and a signed-in account the right things', () => {
    expect(stepsFor('guest').map((s) => s.id)).toContain('guest');
    expect(stepsFor('guest').map((s) => s.id)).not.toContain('account');
    expect(stepsFor('browsing').map((s) => s.id)).toContain('guestBrowse');
    expect(stepsFor('member').map((s) => s.id)).toContain('account');
    expect(stepsFor('member').map((s) => s.id)).not.toContain('guest');
  });

  it('skips a part to the first step of the next one, and ends after the last', () => {
    const steps = stepsFor('guest');
    const tasks = steps.findIndex((s) => s.part === 'tasks');
    expect(steps[nextPartStart(steps, tasks + 1)].part).toBe('learn');
    expect(nextPartStart(steps, steps.length - 1)).toBe(-1);
  });
});
