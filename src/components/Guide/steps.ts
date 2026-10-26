import type { MascotPose } from './mascotPoses';

/** The tour's parts, in order; "Skip this part" jumps to the next one. */
export const GUIDE_PARTS = ['welcome', 'tasks', 'learn', 'tools', 'finish'] as const;
export type GuidePart = (typeof GUIDE_PARTS)[number];

export interface GuideStep {
  /** Its title and text are `guide.steps.<id>.title` / `.text`. */
  id: string;
  part: GuidePart;
  pose: MascotPose;
  /** The section to open for this step. */
  section?: string;
  /** What the step points at (lit up and scrolled into view), when it's on the page. */
  target?: string;
  /** For a guest account, someone browsing with no account, or a signed-in account only. */
  only?: 'guest' | 'browsing' | 'member';
}

export const GUIDE_STEPS: GuideStep[] = [
  { id: 'hello', part: 'welcome', pose: 'welcome', section: 'todo' },
  { id: 'priority', part: 'tasks', pose: 'tasks', section: 'todo', target: '#section-focus' },
  { id: 'tasks', part: 'tasks', pose: 'tasks', section: 'todo', target: '[data-guide="tasks"]' },
  { id: 'wird', part: 'tasks', pose: 'wird', section: 'todo', target: '#section-wird' },
  { id: 'focus', part: 'tasks', pose: 'focus', section: 'todo', target: '[data-guide="quick-focus"]' },
  { id: 'languages', part: 'learn', pose: 'languages', section: 'languages' },
  { id: 'skills', part: 'learn', pose: 'skills', section: 'skills' },
  { id: 'menu', part: 'tools', pose: 'analytics', section: 'todo', target: '[data-guide="menu"]' },
  { id: 'notes', part: 'tools', pose: 'explain', section: 'todo', target: '[data-guide="add-note"]' },
  { id: 'help', part: 'tools', pose: 'thinking', section: 'todo', target: '[data-guide="help"]' },
  { id: 'guest', part: 'finish', pose: 'save', target: '[data-guide="account"]', only: 'guest' },
  { id: 'guestBrowse', part: 'finish', pose: 'save', target: '[data-guide="account"]', only: 'browsing' },
  { id: 'account', part: 'finish', pose: 'explain', target: '[data-guide="account"]', only: 'member' },
  { id: 'end', part: 'finish', pose: 'celebrate' },
];

/** The steps for this visitor. */
export function stepsFor(who: 'guest' | 'browsing' | 'member'): GuideStep[] {
  return GUIDE_STEPS.filter((s) => !s.only || s.only === who);
}

/** The step "Skip this part" goes to: the first of the next part, or -1 at the last part. */
export function nextPartStart(steps: GuideStep[], index: number): number {
  const part = steps[index]?.part;
  const next = steps.findIndex((s, i) => i > index && s.part !== part);
  return next;
}
