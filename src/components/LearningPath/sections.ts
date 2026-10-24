import { BookOpen, Headphones, Library, Mic2, PenLine, Repeat, type LucideIcon } from 'lucide-react';
import type { CourseSectionId } from '../../data/courses';
import type { PathSection } from '../../lib/learningPath';

/** A tab of the English hub the path can open. */
export type HubTab = 'vocabulary' | CourseSectionId;

/** The hub's sections as the path shows them: English names in both languages, as on the hub's tabs. */
export const SECTION_META: Record<PathSection, { name: string; icon: LucideIcon }> = {
  vocabulary: { name: 'Vocabulary', icon: BookOpen },
  pronunciation: { name: 'Pronunciation & Accent', icon: Mic2 },
  listening: { name: 'Listening', icon: Headphones },
  reading: { name: 'Reading', icon: Library },
  grammar: { name: 'Grammar', icon: PenLine },
  shadowing: { name: 'Shadowing', icon: Repeat },
};
