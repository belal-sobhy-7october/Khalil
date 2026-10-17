/** Names of plan tasks, as the day's list shows them. */
import {
  VIDEOS, getGrammar, getVocabUnit, getPhraseSet, getQuestion, getScenario, getScript, getSound, getTypingText, getVoicePrompt,
} from '../../data/callCenter';
import type { PlanTask } from '../../data/callCenter/types';
import { getGrammarLesson } from '../../data/callCenter/ibrahimAdel';
import { getTest } from './quiz';

export function taskTitle(task: PlanTask): string {
  switch (task.kind) {
    case 'sound':
      return task.ref.includes(',') ? "Review this week's sounds" : getSound(task.ref)?.title ?? task.ref;
    case 'watch':
      return VIDEOS[task.ref]?.title ?? 'Video';
    case 'phrases':
      return getPhraseSet(task.ref)?.title ?? task.ref;
    case 'grammar':
      return getGrammar(task.ref)?.title ?? task.ref;
    case 'shadow':
      return getScript(task.ref)?.title ?? task.ref;
    case 'roleplay':
      return getScenario(task.ref)?.title ?? task.ref;
    case 'interview':
      return getQuestion(task.ref)?.q ?? task.ref;
    case 'voice':
      return getVoicePrompt(task.ref)?.title ?? task.ref;
    case 'typing':
      return getTypingText(task.ref)?.title ?? 'Typing test';
    case 'test':
      return getTest(task.ref)?.title ?? 'Test';
    case 'review':
      return task.ref.endsWith('-mistakes') ? 'Review before the exam' : 'Weekly review';
    case 'link':
      return 'EF SET: the free English test';
    case 'lesson': {
      const lesson = getGrammarLesson(task.ref);
      return lesson ? `Lesson ${lesson.number} of ${lesson.course.lessons.length}: ${lesson.title}` : 'Grammar lesson';
    }
    case 'vocab': {
      const unit = getVocabUnit(task.ref);
      return unit ? `New words: Unit ${unit.number} · ${unit.title}` : 'Review your due call center words';
    }
  }
}
