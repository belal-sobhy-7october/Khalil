import { useMemo, useState } from 'react';
import { Volume2, PlayCircle, Copy, Check, ExternalLink, Play, Brain, Plus, Loader2, MonitorPlay } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { getPronunciationPrefs, speakBrowser, speakWord } from '../../lib/pronunciation';
import { buildAiPrompt } from '../../lib/topicChallenge';
import { packById, type PathTask } from '../../lib/learningPath';
import { getCourseSection, type CourseSectionId } from '../../data/courses';
import { clockLength, type CourseProgress } from '../../lib/courseProgress';
import { lessonById, nextHubLesson } from '../../lib/hubLessons';
import { useDueSummary, useMinuteClock } from '../../lib/useDueSummary';
import { useWaitLabel } from '../../lib/useWaitLabel';
import type { PackItem } from '../../data/topicPacks';
import { GrammarCard, QuestionList, SpeakingTask } from '../Vocabulary/TopicLesson';
import YouGlishModal from '../Vocabulary/YouGlishModal';
import FlashcardReview from '../Vocabulary/FlashcardReview';

export type HubTab = 'vocabulary' | CourseSectionId;

const AI_PARTNERS = [
  { name: 'Talkpal', url: 'https://app.talkpal.ai/' },
  { name: 'ChatGPT', url: 'https://chatgpt.com/' },
  { name: 'Gemini', url: 'https://gemini.google.com/' },
];

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

const key = (w: string) => w.trim().toLowerCase();

function LinkButton({ href, children, onClick, primary = false }: { href?: string; children: React.ReactNode; onClick?: () => void; primary?: boolean }) {
  const cls = `inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg ${primary ? 'bg-clay-soft text-white hover:bg-clay-soft-dark' : 'bg-ink/5 text-ink hover:bg-ink/10'}`;
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onClick}>
      <ExternalLink size={13} /> {children}
    </a>
  ) : (
    <button onClick={onClick} className={cls}>{children}</button>
  );
}

function WordRow({ item, onYouGlish }: { item: PackItem; onYouGlish: (w: string) => void }) {
  const { t } = useTranslation();
  const accent = getPronunciationPrefs().accent;
  return (
    <li className="py-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-semibold text-ink">{item.word}</span>
        <button onClick={() => void speakWord(item.word, accent)} className="p-1 rounded hover:bg-ink/5" aria-label={`${t('vocabulary.pronounce')}: ${item.word}`}>
          <Volume2 size={14} className="text-ink-light" />
        </button>
        <button onClick={() => onYouGlish(item.word)} className="p-1 rounded hover:bg-ink/5" aria-label={`YouGlish: ${item.word}`}>
          <PlayCircle size={14} className="text-ink-light" />
        </button>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink/5 text-ink-light">{item.pos}</span>
      </div>
      <div className="text-sm text-ink mt-0.5">{item.definition}</div>
      <div className="text-xs text-ink-light italic">{item.example}</div>
    </li>
  );
}

/** Puts a topic's words into the flashcards (as the Topic Library does), so the review brings them back. */
function AddToFlashcards({ topic, words }: { topic: string; words: PackItem[] }) {
  const { t } = useTranslation();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const importVocabularyItems = useAppStore((s) => s.importVocabularyItems);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState<number | null>(null);
  const owned = useMemo(() => new Set(vocabularyItems.map((i) => key(i.word))), [vocabularyItems]);
  const missing = words.filter((w) => !owned.has(key(w.word)));

  if (!missing.length) {
    return (
      <p className="text-xs text-green-700 dark:text-green-400 flex items-center gap-1.5" dir="auto">
        <Check size={13} /> {added ? t('path.words.added').replace('{n}', String(added)) : t('path.words.inList')}
      </p>
    );
  }
  const add = async () => {
    setBusy(true);
    const result = await importVocabularyItems(
      missing.map((w) => ({ word: w.word, type: w.type, definition: w.definition, exampleSentence: w.example, masteryLevel: 0 })),
      { duplicateMode: 'skip', categoryForAll: topic }
    );
    setAdded(result.inserted);
    setBusy(false);
  };
  return (
    <LinkButton primary onClick={() => void add()}>
      {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
      {t('path.words.add').replace('{count}', String(missing.length))}
    </LinkButton>
  );
}

/** Today's flashcards, from Vocabulary: the review opens right here and ticks the task when it ends. */
function ReviewTask({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation();
  const waitLabel = useWaitLabel();
  const summary = useDueSummary();
  const now = useMinuteClock();
  const [open, setOpen] = useState(false);
  const total = summary.due + summary.newToday;
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink">
        <span className="flex items-center gap-1.5"><Brain size={15} className="text-clay-soft" /> <b className="tabular-nums">{summary.due}</b> {t('vocabulary.srs.dueNow')}</span>
        {summary.newToday > 0 && <span className="text-sky-600 dark:text-sky-400">{t('vocabulary.srs.newToday').replace('{count}', String(summary.newToday))}</span>}
        {summary.hardDue > 0 && <span className="text-red-600 dark:text-red-400">{t('vocabulary.srs.notifyHard').replace('{count}', String(summary.hardDue))}</span>}
      </div>
      {total ? (
        <LinkButton primary onClick={() => setOpen(true)}>{t('path.review.start').replace('{count}', String(total))}</LinkButton>
      ) : (
        <p className="text-xs text-ink-light">
          {t('path.review.clear')}
          {summary.nextAt && ` ${t('vocabulary.srs.nextAt').replace('{t}', waitLabel(Date.parse(summary.nextAt) - now.getTime()))}`}
        </p>
      )}
      {open && <FlashcardReview onClose={() => setOpen(false)} onFinished={onComplete} />}
    </div>
  );
}

/** The next lesson of a hub section, from the source you picked there; finishing it there ticks the task. */
function CourseTask({ section, progress, doneLesson, onOpenTab }: { section: CourseSectionId; progress: CourseProgress; doneLesson?: string; onOpenTab: (tab: HubTab) => void }) {
  const { t } = useTranslation();
  const name = getCourseSection(section).name;
  const next = nextHubLesson(section, progress);
  const done = doneLesson ? lessonById(doneLesson) : null;
  return (
    <div className="space-y-2">
      {done ? (
        <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-1.5" dir="auto">
          <Check size={14} /> {t('path.course.doneWith').replace('{title}', done.title)}
        </p>
      ) : next?.lesson ? (
        <div className="flex items-start gap-2 rounded-lg bg-ink/3 border border-border-subtle p-3">
          <MonitorPlay size={16} className="text-clay-soft shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-[11px] text-ink-lighter" dir="ltr">{next.source.name}</div>
            <div className="text-sm font-medium text-ink" dir="auto">{next.lesson.title}</div>
            {next.lesson.seconds > 0 && <div className="text-xs text-ink-light tabular-nums" dir="ltr">{clockLength(next.lesson.seconds)}</div>}
          </div>
        </div>
      ) : (
        <p className="text-xs text-ink-light" dir="auto">
          {next && next.source.groups.some((g) => g.lessons.length)
            ? t('path.course.none').replace('{source}', next.source.name).replace('{section}', name)
            : t('path.course.pick').replace('{section}', name)}
        </p>
      )}
      <LinkButton primary={!done} onClick={() => onOpenTab(section)}>{t('path.course.open').replace('{section}', name)}</LinkButton>
    </div>
  );
}

/** The flashcards of some topics' words, whatever their schedule (phase reviews in the final week). */
function TopicWordsReview({ packIds }: { packIds: string[] }) {
  const { t } = useTranslation();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const [open, setOpen] = useState(false);
  const words = useMemo(() => packIds.flatMap((id) => packById(id)?.items ?? []), [packIds]);
  const ids = useMemo(() => {
    const wanted = new Set(words.map((w) => key(w.word)));
    return vocabularyItems.filter((i) => wanted.has(key(i.word))).map((i) => i.id);
  }, [words, vocabularyItems]);
  const missing = words.length - ids.length;
  return (
    <div className="space-y-2">
      {ids.length > 0 && <LinkButton primary onClick={() => setOpen(true)}>{t('path.check.start').replace('{count}', String(ids.length))}</LinkButton>}
      {missing > 0 && <p className="text-xs text-ink-light" dir="auto">{t('path.check.missing').replace('{count}', String(missing))}</p>}
      {open && <FlashcardReview initialItemIds={ids} onClose={() => setOpen(false)} />}
    </div>
  );
}

function Notes({ value, onChange, rows = 5 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  const { t } = useTranslation();
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      dir="auto"
      placeholder={t('path.notesPlaceholder')}
      className="w-full px-3 py-2 bg-ink/5 border border-border-subtle rounded-lg text-sm text-ink placeholder:text-ink-lighter focus:outline-none focus:border-clay-soft"
    />
  );
}

function PromptBox({ prompt }: { prompt: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-2">
      <div className="relative">
        <textarea readOnly value={prompt} rows={5} dir="ltr" className="w-full px-3 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink text-xs" />
        <button
          onClick={async () => setCopied(await copyText(prompt))}
          className="absolute top-2 end-2 flex items-center gap-1 px-2 py-1 text-xs rounded bg-card border border-border-subtle text-ink hover:bg-ink/5"
        >
          {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
          {t(copied ? 'vocabulary.challenge.copied' : 'vocabulary.challenge.copyPrompt')}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {AI_PARTNERS.map((p) => (
          <LinkButton key={p.name} href={p.url} onClick={() => void copyText(prompt).then(setCopied)}>{p.name}</LinkButton>
        ))}
      </div>
    </div>
  );
}

function ParagraphPlayer({ text }: { text: string }) {
  const { t } = useTranslation();
  const accent = getPronunciationPrefs().accent;
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-2">
      <p className="text-sm text-ink leading-relaxed rounded-xl bg-ink/3 border border-border-subtle p-3" dir="ltr">{text}</p>
      <div className="flex flex-wrap gap-2">
        <LinkButton onClick={() => speakBrowser(text, accent, 0.9)}><Play size={13} /> {t('path.play')}</LinkButton>
        <LinkButton href="https://www.naturalreaders.com/online/" onClick={() => void copyText(text).then(setCopied)}>
          {copied ? t('vocabulary.challenge.copied') : t('vocabulary.challenge.openNaturalReaders')}
        </LinkButton>
      </div>
    </div>
  );
}

/** The content of one task: what to study and the tools for it, taken from the English hub. */
export default function PathTaskBody({ task, note, onNote, progress, doneLesson, onOpenTab, onComplete }: {
  task: PathTask;
  note: string;
  onNote: (v: string) => void;
  /** The hub's lesson progress (english-course-progress). */
  progress: CourseProgress;
  /** The hub lesson that did this course task, once done. */
  doneLesson?: string;
  onOpenTab: (tab: HubTab) => void;
  /** Ticks the task (e.g. when its review session ends). */
  onComplete: () => void;
}) {
  const { t } = useTranslation();
  const [youglish, setYouglish] = useState<string | null>(null);
  const pack = packById(task.packId);
  const accent = getPronunciationPrefs().accent;
  const topics = (task.packIds ?? []).map((id) => packById(id)).filter((p): p is NonNullable<typeof p> => !!p);

  let body: React.ReactNode = null;
  switch (task.kind) {
    case 'review':
      body = <ReviewTask onComplete={onComplete} />;
      break;
    case 'warmUp':
      body = pack && <QuestionList questions={pack.warmUp} />;
      break;
    case 'words':
      body = pack && task.words && (
        <>
          <ul className="divide-y divide-border-subtle" dir="ltr">
            {pack.items.slice(task.words[0], task.words[1]).map((item) => <WordRow key={item.word} item={item} onYouGlish={setYouglish} />)}
          </ul>
          <AddToFlashcards topic={pack.title} words={pack.items.slice(task.words[0], task.words[1])} />
        </>
      );
      break;
    case 'sentences':
      body = pack && task.words && (
        <>
          <p className="text-sm text-ink" dir="ltr">{pack.items.slice(task.words[0], task.words[1]).map((i) => i.word).join(' · ')}</p>
          <Notes value={note} onChange={onNote} rows={6} />
        </>
      );
      break;
    case 'grammar':
      body = pack && (
        <>
          <div dir="ltr"><GrammarCard pack={pack} /></div>
          <Notes value={note} onChange={onNote} />
        </>
      );
      break;
    case 'paragraph':
      body = pack && <ParagraphPlayer text={pack.paragraph} />;
      break;
    case 'course':
      body = task.section && <CourseTask section={task.section} progress={progress} doneLesson={doneLesson} onOpenTab={onOpenTab} />;
      break;
    case 'accent': {
      const a = task.accent;
      if (a?.kind === 'sound') {
        body = (
          <div className="space-y-2" dir="ltr">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-clay-soft">/{a.sound.ipa}/</span>
              {a.sound.tip && <span className="text-sm text-ink-light">{a.sound.tip}</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {a.sound.examples.map((w) => (
                <span key={w} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-ink/5 text-sm text-ink">
                  {w}
                  <button onClick={() => void speakWord(w, accent)} className="p-0.5" aria-label={`${t('vocabulary.pronounce')}: ${w}`}><Volume2 size={13} className="text-ink-light" /></button>
                  <button onClick={() => setYouglish(w)} className="p-0.5" aria-label={`YouGlish: ${w}`}><PlayCircle size={13} className="text-ink-light" /></button>
                </span>
              ))}
            </div>
            <LinkButton onClick={() => onOpenTab('pronunciation')}>{t('path.open.pronunciationTab')}</LinkButton>
          </div>
        );
      } else if (a?.kind === 'feature') {
        body = (
          <div className="space-y-2" dir="ltr">
            <p className="text-sm text-ink">{a.feature.explanation}</p>
            <div className="flex flex-wrap gap-2">
              {a.feature.examples.map((w) => (
                <button key={w} onClick={() => speakBrowser(w, accent, 0.85)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-ink/5 text-sm text-ink hover:bg-ink/10">
                  <Volume2 size={13} className="text-ink-light" /> {w}
                </button>
              ))}
            </div>
            <LinkButton onClick={() => onOpenTab('pronunciation')}>{t('path.open.pronunciationTab')}</LinkButton>
          </div>
        );
      }
      break;
    }
    case 'check':
      body = <TopicWordsReview packIds={task.packIds ?? []} />;
      break;
    case 'discussion':
      body = pack && <div dir="ltr"><QuestionList questions={pack.discussion} /></div>;
      break;
    case 'speakingTask':
      body = pack && <div dir="ltr"><SpeakingTask pack={pack} /></div>;
      break;
    case 'aiTalk':
      body = pack && <PromptBox prompt={buildAiPrompt(pack.title, [])} />;
      break;
    case 'weeklyWriting':
      body = (
        <>
          <p className="text-sm text-ink" dir="ltr">{topics.map((p) => `${p.emoji} ${p.title}`).join(' · ')}</p>
          <Notes value={note} onChange={onNote} rows={8} />
          <p className="text-xs text-ink-lighter tabular-nums" dir="auto">{t('path.wordCount').replace('{n}', String(note.trim() ? note.trim().split(/\s+/).length : 0))}</p>
        </>
      );
      break;
    case 'replay':
      body = (
        <div className="space-y-4">
          {topics.map((p) => (
            <div key={p.id} className="space-y-1">
              <div className="text-sm font-semibold text-ink" dir="ltr">{p.emoji} {p.title}</div>
              <ParagraphPlayer text={p.paragraph} />
            </div>
          ))}
        </div>
      );
      break;
    case 'reRecord':
      body = (
        <ul className="space-y-1 text-sm text-ink list-disc ps-5" dir="ltr">
          {topics.map((p) => <li key={p.id}>{p.task.prompt}</li>)}
        </ul>
      );
      break;
    case 'mockTalk':
      body = (
        <PromptBox
          prompt={[
            "I'm an English learner at B2 level and I've just finished a 90-day course. Let's have a 20-minute conversation in three parts.",
            ...topics.map((p, i) => `Part ${i + 1} — ${p.title}: ask me some of these, one at a time: ${p.discussion.slice(0, 4).join(' / ')}`),
            'Keep your replies short so I speak more than you. At the end, give me a CEFR-style estimate of my speaking level, my main mistakes with corrections and three things to work on next.',
          ].join('\n')}
        />
      );
      break;
    case 'finalTest':
      body = (
        <ol className="space-y-1 text-sm text-ink list-decimal ps-5" dir="ltr">
          {topics.map((p) => <li key={p.id}><span className="font-semibold">{p.title}:</span> {p.task.prompt}</li>)}
        </ol>
      );
      break;
    case 'reflection':
      body = <Notes value={note} onChange={onNote} rows={8} />;
      break;
    default:
      body = null;
  }

  return (
    <>
      {body}
      {youglish && <YouGlishModal word={youglish} onClose={() => setYouglish(null)} />}
    </>
  );
}
