/** Names of plan tasks, as the day's list shows them. */
import { getChapter } from '../../data/sales/knowledge';
import { getDrill, getLesson, getListen, getMission, getRoleplay, getSpeak, getWeek } from '../../data/sales/plan';
import type { Lang, SalesTask, SalesWeek } from '../../data/sales/types';
import { quizTitle } from './quiz';

export function taskTitle(task: SalesTask, lang: Lang): string {
  const en = lang === 'en';
  switch (task.kind) {
    case 'lesson':
      return getLesson(task.ref)?.title ?? task.ref;
    case 'listen':
      return getListen(task.ref)?.title ?? task.ref;
    case 'drill':
      return getDrill(task.ref)?.title ?? task.ref;
    case 'roleplay':
      return getRoleplay(task.ref)?.title ?? task.ref;
    case 'mission':
      return getMission(task.ref)?.title ?? task.ref;
    case 'speak':
      return getSpeak(task.ref)?.title ?? task.ref;
    case 'journal':
      return en ? 'Your notebook: one line about today' : 'دفترك: سطران عن اليوم';
    case 'words': {
      const week = getWeek(task.ref);
      return `${week?.content.words?.length ?? 12} sales words for your flashcards`;
    }
    case 'review':
      return task.ref.includes('-W') ? (en ? "Review the week's lessons" : 'راجع دروس الأسبوع') : en ? 'Review before the exam' : 'مراجعة قبل الامتحان';
    case 'quiz':
      return quizTitle(task.ref);
    case 'knowledge': {
      const found = getChapter(task.ref);
      return found ? `${found.book.title}: ${found.chapter.title}` : task.ref;
    }
  }
}

/** The tasks of an Extra topic (outside the plan): its lessons, drills and role-plays, saved as `extra:<kind>:<id>`. */
export const extraTasks = (week: SalesWeek): SalesTask[] => [
  ...week.content.lessons.map((l) => ({ id: `extra:lesson:${l.id}`, kind: 'lesson' as const, ref: l.id, minutes: 15 })),
  ...week.content.drills.map((d) => ({ id: `extra:drill:${d.id}`, kind: 'drill' as const, ref: d.id, minutes: 15 })),
  ...week.content.roleplays.map((r) => ({ id: `extra:roleplay:${r.id}`, kind: 'roleplay' as const, ref: r.id, minutes: 25 })),
];

/** The flashcard group a Level 3 week's words go into. */
export const wordsCategory = (week: SalesWeek) => `Sales English ${week.number}: ${week.title}`;
