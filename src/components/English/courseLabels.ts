/** Translation keys that depend on the kind of lesson (watch a video, listen to an episode, read a book). */
import type { LessonKind } from '../../data/courses';

export const markDoneKey = (kind: LessonKind) =>
  kind === 'audio' ? 'english.courses.markListened' : kind === 'book' ? 'english.courses.markRead' : 'english.courses.markDone';

export const doneKey = (kind: LessonKind) =>
  kind === 'audio' ? 'english.courses.listenedIt' : kind === 'book' ? 'english.courses.readIt' : 'english.courses.watchedIt';
