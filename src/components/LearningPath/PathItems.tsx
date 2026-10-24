import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Brain, Check, ExternalLink, Loader2, Pause, Play, PlayCircle, Plus, Volume2 } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { getPronunciationPrefs, speakBrowser, speakWord } from '../../lib/pronunciation';
import { clockLength, isNearEnd } from '../../lib/courseProgress';
import { wordKey, type AccentItem, type PathItem } from '../../lib/learningPath';
import { useDueSummary, useMinuteClock } from '../../lib/useDueSummary';
import { useWaitLabel } from '../../lib/useWaitLabel';
import { readOnSite } from '../../data/courses';
import type { PackItem, TopicPack } from '../../data/topicPacks';
import { GrammarCard } from '../Vocabulary/TopicLesson';
import YouGlishModal from '../Vocabulary/YouGlishModal';
import FlashcardReview from '../Vocabulary/FlashcardReview';
import LoopPlayer from '../English/LoopPlayer';
import { ProgressBar } from '../English/CourseVisuals';

export type LessonItem = Extract<PathItem, { kind: 'lesson' }>;

export function ActionButton({ href, children, onClick, primary = false }: { href?: string; children: React.ReactNode; onClick?: () => void; primary?: boolean }) {
  const cls = `inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg ${primary ? 'bg-clay-soft text-white hover:bg-clay-soft-dark' : 'bg-ink/5 text-ink hover:bg-ink/10'}`;
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onClick}>
      <ExternalLink size={13} /> {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>{children}</button>
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

/** The day's words, and a button that puts them into the flashcards (as the Topic Library does). */
export function WordsBody({ pack, words }: { pack: TopicPack; words: PackItem[] }) {
  const { t } = useTranslation();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const importVocabularyItems = useAppStore((s) => s.importVocabularyItems);
  const [youglish, setYouglish] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState<number | null>(null);
  const owned = useMemo(() => new Set(vocabularyItems.map((i) => wordKey(i.word))), [vocabularyItems]);
  const missing = words.filter((w) => !owned.has(wordKey(w.word)));

  const add = async () => {
    setBusy(true);
    const result = await importVocabularyItems(
      missing.map((w) => ({ word: w.word, type: w.type, definition: w.definition, exampleSentence: w.example, masteryLevel: 0 })),
      { duplicateMode: 'skip', categoryForAll: pack.title }
    );
    setAdded(result.inserted);
    setBusy(false);
  };

  return (
    <div className="space-y-2">
      <ul className="divide-y divide-border-subtle" dir="ltr">
        {words.map((item) => <WordRow key={item.word} item={item} onYouGlish={setYouglish} />)}
      </ul>
      {missing.length ? (
        <ActionButton primary onClick={() => void add()}>
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          {t('path.words.add').replace('{count}', String(missing.length))}
        </ActionButton>
      ) : (
        <p className="text-xs text-green-700 dark:text-green-400 flex items-center gap-1.5" dir="auto">
          <Check size={13} /> {added ? t('path.words.added').replace('{n}', String(added)) : t('path.words.inList')}
        </p>
      )}
      {youglish && <YouGlishModal word={youglish} onClose={() => setYouglish(null)} />}
    </div>
  );
}

/** The flashcards due now: the review opens right here and ticks the item when it ends. */
export function ReviewBody({ onComplete }: { onComplete: () => void }) {
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
        <ActionButton primary onClick={() => setOpen(true)}>{t('path.review.start').replace('{count}', String(total))}</ActionButton>
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

export function GrammarBody({ pack, note, onNote }: { pack: TopicPack; note: string; onNote: (v: string) => void }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <p className="text-sm text-ink-light">{t('path.item.grammarHint')}</p>
      <div dir="ltr"><GrammarCard pack={pack} /></div>
      <textarea
        value={note}
        onChange={(e) => onNote(e.target.value)}
        rows={4}
        dir="auto"
        placeholder={t('path.notesPlaceholder')}
        className="w-full px-3 py-2 bg-ink/5 border border-border-subtle rounded-lg text-sm text-ink placeholder:text-ink-lighter focus:outline-none focus:border-clay-soft"
      />
    </div>
  );
}

export function SoundBody({ accent }: { accent: AccentItem }) {
  const { t } = useTranslation();
  const [youglish, setYouglish] = useState<string | null>(null);
  const prefs = getPronunciationPrefs().accent;
  return (
    <div className="space-y-2">
      <p className="text-sm text-ink-light">{t('path.item.soundHint')}</p>
      <div className="space-y-2" dir="ltr">
        {accent.kind === 'sound' ? (
          <>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-clay-soft">/{accent.sound.ipa}/</span>
              {accent.sound.tip && <span className="text-sm text-ink-light">{accent.sound.tip}</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {accent.sound.examples.map((w) => (
                <span key={w} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-ink/5 text-sm text-ink">
                  {w}
                  <button onClick={() => void speakWord(w, prefs)} className="p-0.5" aria-label={`${t('vocabulary.pronounce')}: ${w}`}><Volume2 size={13} className="text-ink-light" /></button>
                  <button onClick={() => setYouglish(w)} className="p-0.5" aria-label={`YouGlish: ${w}`}><PlayCircle size={13} className="text-ink-light" /></button>
                </span>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-ink">{accent.feature.explanation}</p>
            <div className="flex flex-wrap gap-2">
              {accent.feature.examples.map((w) => (
                <button key={w} onClick={() => speakBrowser(w, prefs, 0.85)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-ink/5 text-sm text-ink hover:bg-ink/10">
                  <Volume2 size={13} className="text-ink-light" /> {w}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {youglish && <YouGlishModal word={youglish} onClose={() => setYouglish(null)} />}
    </div>
  );
}

/** How often the playing lesson's place is saved. */
const SAVE_EVERY_MS = 15_000;
/** Seconds before a part's end that count as having reached it. */
const PART_END = 5;

/**
 * A lesson (or a part of one) playing inside the path. Where it got to is
 * saved now and then, as in the hub; reaching the end of a part ticks the
 * part, and reaching the end of the lesson ticks the lesson.
 */
export function LessonPlayer({ item, start, loop, onSave, onFinish, onPartEnd }: {
  item: LessonItem;
  start: number;
  /** The shadowing controls (A–B loop, speed). */
  loop: boolean;
  onSave: (seconds: number) => void;
  onFinish: () => void;
  onPartEnd: () => void;
}) {
  const { lesson, part } = item;
  const [now, setNow] = useState(start);
  const last = useRef<number | null>(null);
  const saved = useRef(0);
  const finished = useRef(false);
  const partEnded = useRef(false);
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  });
  // Keep where it got to when the player closes.
  useEffect(
    () => () => {
      if (last.current !== null && !finished.current) onSaveRef.current(last.current);
    },
    []
  );

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    onFinish();
  };
  const onProgress = (seconds: number, playing: boolean) => {
    setNow(seconds);
    last.current = seconds;
    if (isNearEnd(seconds, lesson.seconds)) return finish();
    if (part && !partEnded.current && seconds >= part.to - PART_END) {
      partEnded.current = true;
      onPartEnd();
    }
    if (!playing || Date.now() - saved.current >= SAVE_EVERY_MS) {
      saved.current = Date.now();
      onSave(seconds);
    }
  };

  const from = part?.from ?? 0;
  const to = part?.to ?? lesson.seconds;
  const shown = Math.min(Math.max(now, from), to);
  return (
    <div className="space-y-2">
      <LoopPlayer source={{ videoId: lesson.id, listId: null, start: start || undefined }} onProgress={onProgress} onEnded={finish} compact={!loop} />
      {to > from && (
        <div className="space-y-1">
          <ProgressBar ratio={(shown - from) / (to - from)} label={lesson.title} />
          <div className="flex justify-between text-[11px] tabular-nums text-ink-light">
            <span dir="ltr">{clockLength(shown)}</span>
            <span dir="ltr">{clockLength(to)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/** A lesson's line: its title, length (or part), and Play — or Read for a text on another site. */
export function LessonLine({ item, playing, onPlay }: { item: LessonItem; playing: boolean; onPlay: () => void }) {
  const { t } = useTranslation();
  const { lesson, part } = item;
  const length = part
    ? t('path.item.part').replace('{n}', String(part.index)).replace('{count}', String(part.count)).replace('{from}', clockLength(part.from)).replace('{to}', clockLength(part.to))
    : lesson.seconds > 0
      ? clockLength(lesson.seconds)
      : '';
  return (
    <div className="flex items-start gap-2 min-w-0">
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-medium text-ink"><bdi>{lesson.title}</bdi></span>
        <span className="block text-[11px] text-ink-lighter"><bdi>{item.groupName}</bdi>{length && <> · <span dir="ltr" className="tabular-nums">{length}</span></>}</span>
      </span>
      {readOnSite(lesson.kind) ? (
        <ActionButton href={lesson.url}>
          <BookOpen size={13} /> {t('path.item.read')}
        </ActionButton>
      ) : (
        <button
          type="button"
          onClick={onPlay}
          aria-pressed={playing}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg ${playing ? 'bg-ink/10 text-ink' : 'bg-clay-soft text-white hover:bg-clay-soft-dark'}`}
        >
          {playing ? <Pause size={13} /> : <Play size={13} />} {t(playing ? 'path.item.playing' : 'path.item.play')}
        </button>
      )}
    </div>
  );
}

/** The five steps for listening, from the hub's own advice. */
export function ListenSteps() {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-border-subtle p-3">
      <h4 className="text-xs font-semibold text-ink mb-2">{t('path.listen.title')}</h4>
      <ol className="grid gap-1.5 sm:grid-cols-5">
        {['1', '2', '3', '4', '5'].map((n) => (
          <li key={n} className="flex gap-2 text-xs">
            <span className="w-4 h-4 shrink-0 rounded-full bg-clay-soft/15 text-clay-soft text-[10px] flex items-center justify-center">{n}</span>
            <span className="text-ink-light">{t(`path.listen.${n}`)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
