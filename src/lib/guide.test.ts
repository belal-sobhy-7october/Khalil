import { afterEach, describe, expect, it } from 'vitest';
import { guideAvailable, guideSeen, useGuide } from './guide';
import { GUIDE_STEPS } from '../components/Guide/steps';
import { mascotUrl } from '../components/Guide/mascotPoses';

const picturesIn = GUIDE_STEPS.every((s) => mascotUrl(s.pose) !== null);

afterEach(() => {
  localStorage.clear();
  useGuide.setState({ active: false });
});

describe("Khalil's tour before his pictures are in", () => {
  it.skipIf(picturesIn)("doesn't open, unless this browser asks to try it", () => {
    expect(guideAvailable()).toBe(false);
    useGuide.getState().start();
    expect(useGuide.getState().active).toBe(false);

    localStorage.setItem('khalil-guide-preview', '1');
    expect(guideAvailable()).toBe(true);
    useGuide.getState().start();
    expect(useGuide.getState().active).toBe(true);
  });

  it('is marked as seen once finished or skipped', () => {
    localStorage.setItem('khalil-guide-preview', '1');
    useGuide.getState().start();
    useGuide.getState().finish();
    expect(useGuide.getState().active).toBe(false);
    expect(guideSeen()).toBe(true);
  });
});
