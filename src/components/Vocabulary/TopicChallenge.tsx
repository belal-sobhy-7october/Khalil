import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  X, Volume2, PlayCircle, Mic, Check, Headphones, Copy, ExternalLink, Square, Pencil,
  RotateCcw, Video, MessageCircle, Play, Pause, Trophy, Loader2,
} from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { speakBrowser, speakWord, getPronunciationPrefs } from '../../lib/pronunciation';
import { matchesSpoken, recognizeOnce, speechRecognitionSupported } from '../../lib/speech';
import { useRecorder } from '../../lib/useRecorder';
import {
  EMPTY_CHALLENGE, TALK_GOAL_SECONDS, buildAiPrompt, buildPracticeTexts, findPackForTopic, loadChallenge, saveChallenge,
  stepStatus, youtubeId, type ChallengeData, type StepKey,
} from '../../lib/topicChallenge';
import type { VocabularyCategory } from '../../types';
import YouGlishModal from './YouGlishModal';
import { GrammarCard, QuestionList, SpeakingTask } from './TopicLesson';
import { useDialog } from '../../lib/useDialog';

const STEPS: Array<{ key: StepKey; icon: typeof Mic }> = [
  { key: 'words', icon: Mic },
  { key: 'listen', icon: Headphones },
  { key: 'shadow', icon: Video },
  { key: 'talk', icon: MessageCircle },
];

const NATURAL_READERS_URL = 'https://www.naturalreaders.com/online/';
const AI_PARTNERS = [
  { name: 'Talkpal', url: 'https://app.talkpal.ai/' },
  { name: 'ChatGPT', url: 'https://chatgpt.com/' },
  { name: 'Gemini', url: 'https://gemini.google.com/' },
];

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function PracticeTextCard({ index, text, done, onToggleDone, accent }: {
  index: number;
  text: string;
  done: boolean;
  onToggleDone: () => void;
  accent: 'us' | 'uk';
}) {
  const { t } = useTranslation();
  const { recording, url, error, start, stop } = useRecorder();
  const [copied, setCopied] = useState(false);

  const openNaturalReaders = async () => {
    setCopied(await copyText(text));
    window.open(NATURAL_READERS_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${done ? 'border-green-500/50 bg-green-500/5' : 'border-border-subtle'}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-ink-light">{t('vocabulary.challenge.textN').replace('{n}', String(index + 1))}</span>
        <button
          onClick={onToggleDone}
          aria-pressed={done}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors ${
            done ? 'bg-green-500 text-white' : 'bg-ink/5 text-ink hover:bg-ink/10'
          }`}
        >
          <Check size={12} /> {t(done ? 'vocabulary.challenge.repeated' : 'vocabulary.challenge.markRepeated')}
        </button>
      </div>
      <p className="text-ink leading-relaxed" dir="ltr">{text}</p>
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={openNaturalReaders} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-clay-soft text-white text-xs hover:bg-clay-soft-dark">
          <ExternalLink size={13} /> {t('vocabulary.challenge.openNaturalReaders')}
        </button>
        <button onClick={() => speakBrowser(text, accent, 0.9)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink/5 text-ink text-xs hover:bg-ink/10">
          <Volume2 size={13} /> {t('vocabulary.challenge.quickListen')}
        </button>
        {recording ? (
          <button onClick={stop} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs animate-pulse">
            <Square size={12} /> {t('vocabulary.challenge.stopRecording')}
          </button>
        ) : (
          <button onClick={() => void start()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink/5 text-ink text-xs hover:bg-ink/10">
            <Mic size={13} /> {t(url ? 'vocabulary.challenge.recordAgain' : 'vocabulary.challenge.recordYourself')}
          </button>
        )}
        {url && <audio src={url} controls className="h-8 max-w-full" />}
      </div>
      {copied && <p className="text-[11px] text-green-600">{t('vocabulary.challenge.copiedPaste')}</p>}
      {error && <p className="text-[11px] text-red-500">{t('vocabulary.challenge.micBlocked')}</p>}
    </div>
  );
}

/** `paragraph`: the topic's own text, practiced first (the Call Center units bring theirs). */
export default function TopicChallenge({ category, paragraph, onClose }: { category: VocabularyCategory; paragraph?: string; onClose: () => void }) {
  const { t } = useTranslation();
  const userId = useAppStore((s) => s.session?.user?.id);
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const accent = getPronunciationPrefs().accent;

  const items = useMemo(() => vocabularyItems.filter((i) => i.categoryId === category.id), [vocabularyItems, category.id]);
  const [data, setData] = useState<ChallengeData | null>(null);
  const dataRef = useRef<ChallengeData | null>(null);
  const [step, setStep] = useState<StepKey>('words');

  // Talk timer state lives here so it can be seeded from the saved progress.
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const secondsRef = useRef(0);

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    void loadChallenge(userId, category.id).then((d) => {
      if (!alive) return;
      dataRef.current = d;
      secondsRef.current = d.talkSeconds;
      setSeconds(d.talkSeconds);
      setData(d);
    });
    return () => {
      alive = false;
    };
  }, [userId, category.id]);

  const update = useCallback(
    (patch: Partial<ChallengeData> | ((d: ChallengeData) => Partial<ChallengeData>)) => {
      const base = dataRef.current ?? EMPTY_CHALLENGE;
      const next = { ...base, ...(typeof patch === 'function' ? patch(base) : patch) };
      dataRef.current = next;
      setData(next);
      if (userId) void saveChallenge(userId, category.id, next);
    },
    [userId, category.id]
  );

  const generatedTexts = useMemo(() => buildPracticeTexts(category.name, items, paragraph), [category.name, items, paragraph]);
  const texts = data?.customTexts?.length ? data.customTexts : generatedTexts;
  const status = data ? stepStatus(data, items, texts) : null;
  const allDone = !!status && status.words && status.listen && status.shadow && status.talk;

  useEffect(() => {
    if (allDone && data && !data.completedAt) update({ completedAt: new Date().toISOString() });
  }, [allDone, data, update]);

  // ---- step 1: pronunciation ----
  const [youglishWord, setYouglishWord] = useState<string | null>(null);
  const [listeningId, setListeningId] = useState<string | null>(null);
  const [heard, setHeard] = useState<Record<string, string>>({});
  const [speechError, setSpeechError] = useState<string | null>(null);
  const canRecognize = speechRecognitionSupported() && !speechError;

  const passed = new Set(data?.words ?? []);
  const setWordPassed = (id: string, ok: boolean) =>
    update((d) => ({ words: ok ? [...new Set([...d.words, id])] : d.words.filter((w) => w !== id) }));

  const tryWord = async (id: string, word: string) => {
    setListeningId(id);
    const res = await recognizeOnce(accent === 'uk' ? 'en-GB' : 'en-US');
    setListeningId(null);
    if (!res.ok) {
      if (['not-allowed', 'service-not-allowed', 'network', 'not-supported', 'start-failed'].includes(res.error)) {
        setSpeechError(res.error);
      } else {
        setHeard((h) => ({ ...h, [id]: '…' }));
      }
      return;
    }
    const ok = matchesSpoken(word, res.transcripts);
    setHeard((h) => ({ ...h, [id]: res.transcripts[0] ?? '' }));
    if (ok) setWordPassed(id, true);
  };

  // ---- step 2: texts editing ----
  const [editingTexts, setEditingTexts] = useState<string | null>(null);

  // ---- step 3: shadowing ----
  const [videoDraft, setVideoDraft] = useState('');
  const videoId = youtubeId(data?.videoUrl);

  // ---- step 4: talk timer ----
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      secondsRef.current += 1;
      setSeconds(secondsRef.current);
      if (secondsRef.current % 15 === 0 || secondsRef.current === TALK_GOAL_SECONDS) update({ talkSeconds: secondsRef.current });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, update]);
  const pauseTimer = () => {
    setRunning(false);
    update({ talkSeconds: secondsRef.current });
  };
  const aiPrompt = useMemo(() => buildAiPrompt(category.name, items), [category.name, items]);
  const pack = useMemo(() => findPackForTopic(category.name), [category.name]);
  const [promptCopied, setPromptCopied] = useState(false);

  const handleClose = () => {
    if (running) update({ talkSeconds: secondsRef.current });
    onClose();
  };

  const stepTitle = (k: StepKey) => t(`vocabulary.challenge.step.${k}`);

  const dialog = useDialog(() => handleClose());

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div {...dialog.props} className="bg-card border border-border-subtle rounded-2xl w-full max-w-3xl max-h-[92svh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 id={dialog.titleId} className="text-lg font-bold text-ink flex items-center gap-2">
              <Trophy size={18} className="text-clay-soft shrink-0" />
              <span className="truncate">{t('vocabulary.challenge.title').replace('{name}', category.name)}</span>
            </h2>
            <p className="text-xs text-ink-light">{t('vocabulary.challenge.subtitle')}</p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-ink/5 rounded-lg transition-colors" aria-label={t('common.close')}>
            <X size={20} className="text-ink-light" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-4 pt-3 grid grid-cols-4 gap-2" role="tablist">
          {STEPS.map(({ key, icon: Icon }, i) => {
            const done = status?.[key];
            const active = step === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={active}
                onClick={() => setStep(key)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-colors ${
                  active ? 'border-clay-soft bg-clay-soft/10' : 'border-border-subtle hover:bg-ink/5'
                }`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center ${done ? 'bg-green-500 text-white' : 'bg-ink/5 text-ink-light'}`}>
                  {done ? <Check size={14} /> : <Icon size={14} />}
                </span>
                <span className="text-[11px] leading-tight text-ink">
                  {i + 1}. {stepTitle(key)}
                  {key === 'shadow' && <span className="block text-[10px] text-ink-lighter">{t('vocabulary.challenge.optional')}</span>}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {allDone && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/40 text-sm text-ink">
              <Trophy size={20} className="text-green-600 shrink-0" />
              {t('vocabulary.challenge.completed')}
            </div>
          )}

          {!data ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-clay-soft" /></div>
          ) : step === 'words' ? (
            <>
              <p className="text-sm text-ink-light">{t('vocabulary.challenge.wordsHint')}</p>
              {speechError && <p className="text-xs text-amber-600">{t('vocabulary.challenge.speechUnavailable')}</p>}
              <p className="text-xs text-ink-light tabular-nums">{passed.size} / {items.length}</p>
              <ul className="divide-y divide-border-subtle border border-border-subtle rounded-xl">
                {items.map((item) => {
                  const ok = passed.has(item.id);
                  return (
                    <li key={item.id} className="flex flex-wrap items-center gap-2 px-3 py-2" dir="ltr">
                      <span className={`font-medium flex-1 min-w-[8rem] ${ok ? 'text-green-600' : 'text-ink'}`}>{item.word}</span>
                      {heard[item.id] && !ok && (
                        <span className="text-[11px] text-amber-600" dir="auto">
                          {t('vocabulary.challenge.heard')} “{heard[item.id]}”
                        </span>
                      )}
                      <button onClick={() => void speakWord(item.word, accent)} className="p-1.5 rounded hover:bg-ink/5" aria-label={`${t('vocabulary.pronounce')}: ${item.word}`}>
                        <Volume2 size={15} className="text-ink-light" />
                      </button>
                      <button onClick={() => setYouglishWord(item.word)} className="p-1.5 rounded hover:bg-ink/5" aria-label={`YouGlish: ${item.word}`}>
                        <PlayCircle size={15} className="text-ink-light" />
                      </button>
                      {canRecognize && (
                        <button
                          onClick={() => void tryWord(item.id, item.word)}
                          disabled={listeningId !== null}
                          className={`p-1.5 rounded ${listeningId === item.id ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-ink/5 text-ink-light'}`}
                          aria-label={`${t('vocabulary.challenge.sayIt')}: ${item.word}`}
                        >
                          <Mic size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => setWordPassed(item.id, !ok)}
                        aria-pressed={ok}
                        aria-label={`${t('vocabulary.challenge.markCorrect')}: ${item.word}`}
                        className={`p-1.5 rounded ${ok ? 'bg-green-500 text-white' : 'bg-ink/5 text-ink-lighter hover:text-ink'}`}
                      >
                        <Check size={15} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : step === 'listen' ? (
            <>
              <p className="text-sm text-ink-light">{t('vocabulary.challenge.listenHint')}</p>
              {editingTexts !== null ? (
                <div className="space-y-2">
                  <p className="text-xs text-ink-light">{t('vocabulary.challenge.editHint')}</p>
                  <textarea
                    value={editingTexts}
                    onChange={(e) => setEditingTexts(e.target.value)}
                    rows={12}
                    dir="ltr"
                    className="w-full px-3 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink text-sm focus:outline-none focus:border-clay-soft"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditingTexts(null)} className="px-3 py-1.5 text-sm rounded-lg bg-ink/5 text-ink">{t('common.cancel')}</button>
                    <button
                      onClick={() => {
                        const parts = editingTexts.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).slice(0, 3);
                        update({ customTexts: parts.length ? parts : undefined, textsDone: [] });
                        setEditingTexts(null);
                      }}
                      className="px-3 py-1.5 text-sm rounded-lg bg-clay-soft text-white"
                    >
                      {t('common.save')}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingTexts(texts.join('\n\n'))} className="flex items-center gap-1.5 text-xs text-ink-light hover:text-ink">
                      <Pencil size={12} /> {t('vocabulary.challenge.editTexts')}
                    </button>
                    {data.customTexts?.length ? (
                      <button onClick={() => update({ customTexts: undefined, textsDone: [] })} className="flex items-center gap-1.5 text-xs text-ink-light hover:text-ink">
                        <RotateCcw size={12} /> {t('vocabulary.challenge.resetTexts')}
                      </button>
                    ) : null}
                  </div>
                  {texts.length === 0 ? (
                    <p className="text-sm text-ink-light text-center py-6">{t('vocabulary.challenge.noTexts')}</p>
                  ) : (
                    texts.map((text, i) => (
                      <PracticeTextCard
                        key={`${i}-${text.slice(0, 20)}`}
                        index={i}
                        text={text}
                        accent={accent}
                        done={data.textsDone.includes(i)}
                        onToggleDone={() =>
                          update((d) => ({ textsDone: d.textsDone.includes(i) ? d.textsDone.filter((x) => x !== i) : [...d.textsDone, i] }))
                        }
                      />
                    ))
                  )}
                </>
              )}
            </>
          ) : step === 'shadow' ? (
            <>
              <p className="text-sm text-ink-light">{t('vocabulary.challenge.shadowHint')}</p>
              <ul className="text-xs text-ink-light list-disc ps-5 space-y-1">
                <li>{t('vocabulary.challenge.shadowTip1')}</li>
                <li>{t('vocabulary.challenge.shadowTip2')}</li>
                <li>{t('vocabulary.challenge.shadowTip3')}</li>
              </ul>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (videoDraft.trim()) update({ videoUrl: videoDraft.trim() });
                  setVideoDraft('');
                }}
              >
                <input
                  value={videoDraft}
                  onChange={(e) => setVideoDraft(e.target.value)}
                  placeholder={data.videoUrl ? t('vocabulary.challenge.changeVideo') : t('vocabulary.challenge.videoPlaceholder')}
                  dir="ltr"
                  className="flex-1 min-w-0 px-3 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink text-sm focus:outline-none focus:border-clay-soft"
                />
                <button type="submit" className="px-3 py-2 text-sm rounded-lg bg-clay-soft text-white">{t('common.save')}</button>
              </form>
              {videoId ? (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                    title="Shadowing video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : data.videoUrl ? (
                <a href={data.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-clay-soft" dir="ltr">
                  <ExternalLink size={14} /> {data.videoUrl}
                </a>
              ) : null}
              <div className="flex gap-2">
                <button
                  onClick={() => update({ shadowing: data.shadowing === 'done' ? undefined : 'done' })}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg ${data.shadowing === 'done' ? 'bg-green-500 text-white' : 'bg-ink/5 text-ink hover:bg-ink/10'}`}
                >
                  <Check size={14} /> {t('vocabulary.challenge.shadowDone')}
                </button>
                <button
                  onClick={() => update({ shadowing: data.shadowing === 'skipped' ? undefined : 'skipped' })}
                  className={`px-3 py-2 text-sm rounded-lg ${data.shadowing === 'skipped' ? 'bg-ink text-card' : 'bg-ink/5 text-ink hover:bg-ink/10'}`}
                >
                  {t('vocabulary.challenge.skip')}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-ink-light">{t('vocabulary.challenge.talkHint')}</p>
              {pack && (
                <div className="space-y-3" dir="ltr">
                  <details className="rounded-xl border border-border-subtle p-3" open>
                    <summary className="text-sm font-semibold text-ink cursor-pointer" dir="auto">{t('vocabulary.library.lesson.discussion')}</summary>
                    <div className="mt-2"><QuestionList questions={[...pack.warmUp, ...pack.discussion]} /></div>
                  </details>
                  <details className="rounded-xl border border-border-subtle p-3">
                    <summary className="text-sm font-semibold text-ink cursor-pointer" dir="auto">{t('vocabulary.library.lesson.grammar')}</summary>
                    <div className="mt-2"><GrammarCard pack={pack} /></div>
                  </details>
                  <SpeakingTask pack={pack} />
                </div>
              )}
              <div className="relative">
                <textarea readOnly value={aiPrompt} rows={6} dir="ltr" className="w-full px-3 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink text-xs" />
                <button
                  onClick={async () => setPromptCopied(await copyText(aiPrompt))}
                  className="absolute top-2 end-2 flex items-center gap-1 px-2 py-1 text-xs rounded bg-card border border-border-subtle text-ink hover:bg-ink/5"
                >
                  {promptCopied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                  {t(promptCopied ? 'vocabulary.challenge.copied' : 'vocabulary.challenge.copyPrompt')}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {AI_PARTNERS.map((p) => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => void copyText(aiPrompt).then(setPromptCopied)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-ink/5 text-ink hover:bg-ink/10"
                  >
                    <ExternalLink size={14} /> {p.name}
                  </a>
                ))}
              </div>
              <div className="rounded-xl border border-border-subtle p-4 flex flex-col items-center gap-3">
                <div className={`text-4xl font-bold tabular-nums ${seconds >= TALK_GOAL_SECONDS ? 'text-green-600' : 'text-ink'}`}>
                  {formatTime(Math.min(seconds, 99 * 60))} <span className="text-base text-ink-lighter">/ {formatTime(TALK_GOAL_SECONDS)}</span>
                </div>
                <div className="w-full h-2 bg-ink/8 rounded-full overflow-hidden">
                  <div className="h-full bg-clay-soft transition-all" style={{ width: `${Math.min(100, (seconds / TALK_GOAL_SECONDS) * 100)}%` }} />
                </div>
                <button
                  onClick={() => (running ? pauseTimer() : setRunning(true))}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white ${running ? 'bg-ink' : 'bg-clay-soft hover:bg-clay-soft-dark'}`}
                >
                  {running ? <Pause size={16} /> : <Play size={16} />}
                  {t(running ? 'vocabulary.challenge.pause' : seconds > 0 ? 'vocabulary.challenge.resume' : 'vocabulary.challenge.startTimer')}
                </button>
                <p className="text-[11px] text-ink-lighter text-center">{t('vocabulary.challenge.timerHint')}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {youglishWord && <YouGlishModal word={youglishWord} onClose={() => setYouglishWord(null)} />}
    </div>
  );
}
