import { useState } from 'react';
import { BookOpen, BookmarkPlus, Eye } from 'lucide-react';
import { getChapter } from '../../../data/sales/knowledge';
import { getDrill, getLevel, getMission, getWeek } from '../../../data/sales/plan';
import { JOURNAL_PROMPTS } from '../../../data/sales/start';
import type { Lang } from '../../../data/sales/types';
import { wordsCategory } from '../../../lib/sales/tasks';
import { openFlashcards } from '../../../lib/callCenter/navigation';
import { useAppStore } from '../../../store/appStore';
import { useSales } from '../SalesContext';
import { AiButtons, NoteBox, SpeakButton } from '../ui';
import { primaryBtn, secondaryBtn } from '../../CallCenter/ui';
import { pick } from '../../../lib/sales/text';
import { lessonPracticePrompt } from '../../../lib/sales/prompts';

/** Write your own line for each item, then reveal the model to compare. */
export function DrillActivity({ refId, taskId, lang, onDone }: { refId: string; taskId: string; lang: Lang; onDone: () => void }) {
  const drill = getDrill(refId);
  const [shown, setShown] = useState<Set<number>>(new Set());
  if (!drill) return null;
  const reveal = (i: number) => {
    const next = new Set(shown).add(i);
    setShown(next);
    if (next.size === drill.items.length) onDone();
  };
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink">{drill.instructions}</p>
      <ol className="space-y-3">
        {drill.items.map((item, i) => (
          <li key={item.prompt} className="space-y-1.5 rounded-xl border border-border-subtle p-3">
            <div className="text-sm font-medium text-ink">
              {i + 1}. {item.prompt}
            </div>
            <NoteBox noteKey={`${taskId}#${i}`} rows={2} lang={lang} placeholder={pick(lang, 'اكتب ردك الأول…', 'Write yours first…')} />
            {shown.has(i) ? (
              <div className="flex items-start gap-1 rounded-lg bg-sage-soft/8 border border-sage-soft/30 px-3 py-2">
                <p className="flex-1 text-sm text-ink whitespace-pre-line">{item.model}</p>
                {lang === 'en' && <SpeakButton text={item.model} compact />}
              </div>
            ) : (
              <button type="button" onClick={() => reveal(i)} className={secondaryBtn}>
                <Eye size={13} /> {pick(lang, 'قارن بالنموذج', 'Compare with the model')}
              </button>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** A small task in real life, with notes on what happened. */
export function MissionActivity({ refId, taskId, lang, onDone }: { refId: string; taskId: string; lang: Lang; onDone: () => void }) {
  const m = getMission(refId);
  if (!m) return null;
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink leading-relaxed">{m.what}</p>
      <ol className="list-decimal ps-5 text-sm text-ink space-y-0.5">
        {m.how.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ol>
      <div className="space-y-2">
        <div className="text-xs font-semibold text-ink-light">{pick(lang, 'بعد المهمة', 'After the mission')}</div>
        {m.reflect.map((q, i) => (
          <NoteBox key={q} noteKey={`${taskId}#${i}`} label={q} rows={2} lang={lang} />
        ))}
      </div>
      <button type="button" onClick={onDone} className={primaryBtn}>
        {pick(lang, 'عملت المهمة', 'Mission done')}
      </button>
    </div>
  );
}

const SPECIAL_PROMPTS: Record<string, { ar: string; en: string }> = {
  start: {
    ar: 'ليه عاوز تتعلم سيلز؟ وعاوز تكون فين بعد 3 شهور؟ (اكتب بصراحة، هترجعله في آخر كل مستوى)',
    en: 'Why do you want to learn sales, and where do you want to be in 3 months?',
  },
  exam: {
    ar: 'خلصت مستوى! إيه أكتر 3 حاجات اتغيرت فيك؟ وإيه أضعف نقطة هتشتغل عليها في المستوى الجاي؟',
    en: 'You finished a level! What are the three biggest changes in you, and the one weak point you will work on next?',
  },
};

/** The day's notebook line. */
export function JournalActivity({ refId, taskId, lang, onDone }: { refId: string; taskId: string; lang: Lang; onDone: () => void }) {
  const day = Number(refId.replace(/^d/, ''));
  const prompt = SPECIAL_PROMPTS[refId]?.[lang] ?? JOURNAL_PROMPTS[lang][(day - 1) % 5];
  return (
    <div className="space-y-2">
      <NoteBox noteKey={taskId} label={prompt} rows={4} lang={lang} onSaved={onDone} />
    </div>
  );
}

/** The week's English words: hear them, read the examples, then add them to the flashcards. */
export function WordsActivity({ refId, onDone }: { refId: string; onDone: () => void }) {
  const week = getWeek(refId);
  const importVocabularyItems = useAppStore((s) => s.importVocabularyItems);
  const [status, setStatus] = useState<string | null>(null);
  const words = week?.content.words;
  if (!week || !words) return null;
  const add = async () => {
    setStatus('Adding…');
    const r = await importVocabularyItems(
      words.map((w) => ({ word: w.word, type: w.word.includes(' ') ? ('phrase' as const) : ('word' as const), definition: w.definition, exampleSentence: w.example })),
      { duplicateMode: 'skip', categoryForAll: wordsCategory(week) }
    );
    setStatus(r.inserted ? `Added ${r.inserted} words to your flashcards (Learn Languages → English → Vocabulary).` : 'Already in your flashcards.');
    onDone();
  };
  return (
    <div className="space-y-3">
      <ul className="grid gap-2 sm:grid-cols-2">
        {words.map((w) => (
          <li key={w.word} className="rounded-xl border border-border-subtle p-3 space-y-0.5">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-ink">{w.word}</span>
              <SpeakButton text={w.word} compact />
              <span dir="rtl" lang="ar" className="ms-auto text-xs text-ink-light">
                {w.ar}
              </span>
            </div>
            <p className="text-sm text-ink">{w.definition}</p>
            <p className="text-xs text-ink-light italic flex items-start gap-1">
              <span className="flex-1">{w.example}</span>
              <SpeakButton text={w.example} compact />
            </p>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => void add()} className={primaryBtn}>
          <BookmarkPlus size={13} /> Add the {words.length} words to my flashcards
        </button>
        <button type="button" onClick={openFlashcards} className={secondaryBtn}>
          <BookOpen size={13} /> Open my flashcards
        </button>
      </div>
      {status && <p className="text-[11px] text-sage-soft-dark">{status}</p>}
    </div>
  );
}

/** Review day: the week's (or level's) lessons in one line each, and the questions you missed. */
export function ReviewActivity({ refId, lang, onDone }: { refId: string; lang: Lang; onDone: () => void }) {
  const { quizzes } = useSales();
  const week = getWeek(refId);
  const level = week ? null : getLevel(refId);
  const weeks = week ? [week] : level?.weeks ?? [];
  const lessons = weeks.flatMap((w) => w.content.lessons);
  const chapters = weeks.flatMap((w) => w.content.knowledge ?? []).flatMap((id) => getChapter(id)?.chapter ?? []);
  const quizIds = [...weeks.map((w) => w.quizId), ...(level?.examId ? [level.examId] : [])];
  const missed = new Map<string, string>();
  for (const id of quizIds) for (const a of quizzes[id] ?? []) for (const m of a.missed) missed.set(m.q, m.right);
  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-light">
        {week
          ? pick(lang, 'اقرا ملخص كل درس بصوت عالي، وبعدين راجع الأسئلة اللي غلطت فيها قبل الكويز.', 'Read each lesson summary out loud, then review the questions you missed before the quiz.')
          : pick(lang, 'قبل الامتحان: راجع ملخص كل دروس المستوى، وكل سؤال غلطت فيه في الكويزات.', 'Before the exam: review every lesson summary of the level and every question you missed.')}
      </p>
      <ul className="space-y-1.5">
        {lessons.map((l) => (
          <li key={l.id} className="rounded-xl bg-ink/3 px-3 py-2">
            <div className="text-sm font-semibold text-ink">{l.title}</div>
            <p className="text-sm text-ink-light">{l.summary}</p>
          </li>
        ))}
      </ul>
      {chapters.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-ink-light">فصول المعرفة</div>
          <ul className="space-y-1.5">
            {chapters.map((c) => (
              <li key={c.id} className="rounded-xl border border-border-subtle px-3 py-2">
                <div className="text-sm font-semibold text-ink">{c.title}</div>
                <p className="text-sm text-ink-light">{c.idea}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {missed.size > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-ink-light">{pick(lang, `أسئلة غلطت فيها (${missed.size})`, `Questions you missed (${missed.size})`)}</div>
          <ul className="space-y-1 text-sm">
            {[...missed].slice(0, week ? 10 : 30).map(([q, right]) => (
              <li key={q} className="rounded-lg border border-border-subtle px-3 py-1.5">
                <span className="text-ink">{q}</span>
                <span className="text-ink-light"> → </span>
                <span className="text-sage-soft-dark">{right}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {week && (
        <details>
          <summary className="cursor-pointer py-1 text-xs text-ink-light hover:text-ink">{pick(lang, 'اتمرن على الأسبوع كله مع الـ AI (اختياري)', 'Practice the whole week with an AI (optional)')}</summary>
          <div className="mt-2">
            <AiButtons prompt={lessonPracticePrompt(week.title, week.goal, lang)} lang={lang} />
          </div>
        </details>
      )}
      <button type="button" onClick={onDone} className={secondaryBtn}>
        {pick(lang, 'راجعت', 'Reviewed')}
      </button>
    </div>
  );
}
