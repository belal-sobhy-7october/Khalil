/** Translation keys that depend on the kind of lesson (watch a video, listen to an episode, read a book or a text). */
import { readOnSite, type LessonKind } from '../../data/courses';

export const markDoneKey = (kind: LessonKind) =>
  kind === 'audio' ? 'english.courses.markListened' : readOnSite(kind) ? 'english.courses.markRead' : 'english.courses.markDone';

export const doneKey = (kind: LessonKind) =>
  kind === 'audio' ? 'english.courses.listenedIt' : readOnSite(kind) ? 'english.courses.readIt' : 'english.courses.watchedIt';
