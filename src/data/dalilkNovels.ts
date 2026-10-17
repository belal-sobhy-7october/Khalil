/**
 * Dalilk's novel library (https://dalilk.com/resources/fluency/read): graded
 * English novels, each with audio and questions, read on Dalilk's site.
 * The Reading section shows the library once this list has novels in it.
 */
export type NovelLevel = 'beginner' | 'intermediate' | 'upper';

export interface DalilkNovel {
  /** Stable key for progress (from the novel's address). */
  slug: string;
  title: string;
  level: NovelLevel;
  url: string;
  cover?: string;
}

export const DALILK_NOVELS: DalilkNovel[] = [];
