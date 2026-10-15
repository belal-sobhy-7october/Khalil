import { describe, expect, it } from 'vitest';
import { APPEARANCES, applyAppearance } from './appearance';

describe('applyAppearance', () => {
  it('sets colour variables for the mode and clears them for the default', () => {
    const root = document.createElement('html');
    applyAppearance('downtown', 'dark', root);
    expect(root.dataset.appearance).toBe('downtown');
    expect(root.style.getPropertyValue('--color-card')).toBe('#1C2418');
    expect(root.style.getPropertyValue('--app-bg-image')).toContain('radial-gradient');
    applyAppearance('downtown', 'light', root);
    expect(root.style.getPropertyValue('--color-card')).toBe('#F7F0DD');
    applyAppearance('default', 'dark', root);
    expect(root.style.getPropertyValue('--color-card')).toBe('');
    expect(root.style.getPropertyValue('--app-bg-image')).toBe('');
  });

  it('has unique ids and both modes for every palette and theme', () => {
    const ids = APPEARANCES.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const a of APPEARANCES.filter((x) => x.kind !== 'default')) {
      expect(a.light).not.toBeNull();
      expect(a.dark).not.toBeNull();
    }
  });
});
