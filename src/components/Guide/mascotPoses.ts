/**
 * Khalil, the app's character. His pictures are `src/assets/mascot/<pose>.webp`
 * (docs/mascot/README.md lists the poses and how they were drawn); a pose
 * without its picture yet shows the "خ" badge instead, with no request.
 */

export const MASCOT_POSES = [
  'welcome',
  'explain',
  'tasks',
  'wird',
  'focus',
  'languages',
  'skills',
  'analytics',
  'save',
  'celebrate',
  'thinking',
  'avatar',
] as const;
export type MascotPose = (typeof MASCOT_POSES)[number];

const FILES = import.meta.glob<string>('../../assets/mascot/*.webp', { eager: true, query: '?url', import: 'default' });

/** The picture of a pose, if it has been added. */
export function mascotUrl(pose: MascotPose): string | null {
  return FILES[`../../assets/mascot/${pose}.webp`] ?? null;
}
