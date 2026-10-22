import { useMemo, useState } from 'react';
import { Volume2, PlayCircle, Copy, Check, ExternalLink, Eye, Play } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { getPronunciationPrefs, speakBrowser, speakWord } from '../../lib/pronunciation';
import { buildAiPrompt } from '../../lib/topicChallenge';
import { packById, type PathTask } from '../../lib/learningPath';
import type { CourseSectionId } from '../../data/courseCatalog';
import { LISTENING_TIME, STUDY_SOURCES } from '../../data/englishStudy';
import type { PackItem } from '../../data/topicPacks';
import { GrammarCard, QuestionList, SpeakingTask } from '../Vocabulary/TopicLesson';
import YouGlishModal from '../Vocabulary/YouGlishModal';

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

/** Opens a section of the English hub (Reading, Shadowing…) without touching any data. */
function openEnglishTab(tab: CourseSectionId) {
  try {
    localStorage.setItem('khalil-english-tab', tab);
  } catch {
    // the section opens on its last tab
  }
  window.dispatchEvent(new CustomEvent('khalil:navigate', { detail: 'vocabulary' }));
}

function LinkButton({ href, children, onClick }: { href?: string; children: React.ReactNode; onClick?: () => void }) {
  const cls = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-ink/5 text-ink hover:bg-ink/10';
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

/** One card at a time: say the meaning, reveal it, mark it. Nothing is saved to the word list. */
function QuickCheck({ items }: { items: PackItem[] }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState(0);
  if (!items.length) return null;
  if (index >= items.length) {
    return (
      <div className="flex items-center gap-3 text-sm text-ink" dir="auto">
        <span>{t('path.check.result').replace('{k}', String(known)).replace('{n}', String(items.length))}</span>
        <button onClick={() => { setIndex(0); setKnown(0); setRevealed(false); }} className="text-clay-soft hover:underline">{t('path.check.again')}</button>
      </div>
    );
  }
  const item = items[index];
  const next = (knew: boolean) => {
    if (knew) setKnown((k) => k + 1);
    setRevealed(false);
    setIndex((i) => i + 1);
  };
  return (
    <div className="rounded-xl border border-border-subtle p-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-ink-lighter">
        <span className="tabular-nums">{index + 1} / {items.length}</span>
      </div>
      <div className="text-lg font-semibold text-ink">{item.word}</div>
      {revealed ? (
        <>
          <div className="text-sm text-ink">{item.definition}</div>
          <div className="text-xs italic text-ink-light">{item.example}</div>
          <div className="flex gap-2" dir="auto">
            <button onClick={() => next(true)} className="px-3 py-1.5 text-sm rounded-lg bg-green-600 text-white">{t('path.check.knew')}</button>
            <button onClick={() => next(false)} className="px-3 py-1.5 text-sm rounded-lg bg-ink/10 text-ink">{t('path.check.notYet')}</button>
          </div>
        </>
      ) : (
        <button onClick={() => setRevealed(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-clay-soft text-white" dir="auto">
          <Eye size={14} /> {t('path.check.reveal')}
        </button>
      )}
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

/** The content of one task: what to study and the tools for it. */
export default function PathTaskBody({ task, note, onNote }: { task: PathTask; note: string; onNote: (v: string) => void }) {
  const { t } = useTranslation();
  const [youglish, setYouglish] = useState<string | null>(null);
  const pack = packById(task.packId);
  const accent = getPronunciationPrefs().accent;
  const checkItems = useMemo(() => {
    if (task.packIds) return task.packIds.flatMap((id) => packById(id)?.items ?? []);
    if (pack && task.words) return pack.items.slice(task.words[0], task.words[1]);
    return [];
  }, [task, pack]);
  const topics = (task.packIds ?? []).map((id) => packById(id)).filter((p): p is NonNullable<typeof p> => !!p);

  let body: React.ReactNode = null;
  switch (task.kind) {
    case 'warmUp':
      body = pack && <QuestionList questions={pack.warmUp} />;
      break;
    case 'words':
      body = pack && task.words && (
        <ul className="divide-y divide-border-subtle" dir="ltr">
          {pack.items.slice(task.words[0], task.words[1]).map((item) => <WordRow key={item.word} item={item} onYouGlish={setYouglish} />)}
        </ul>
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
    case 'reading': {
      const book = STUDY_SOURCES.find((s) => s.id === 'reading-listening-book');
      body = (
        <>
          <div className="flex flex-wrap gap-2">
            <LinkButton onClick={() => openEnglishTab('reading')}>{t('path.open.readingTab')}</LinkButton>
            {book && <LinkButton href={book.url}>{book.name}</LinkButton>}
          </div>
          <Notes value={note} onChange={onNote} rows={3} />
        </>
      );
      break;
    }
    case 'shadowing':
      body = (
        <div className="flex flex-wrap gap-2">
          <LinkButton onClick={() => openEnglishTab('shadowing')}>{t('path.open.shadowingTab')}</LinkButton>
          <LinkButton href={`${LISTENING_TIME}/playlists`}>Listening Time</LinkButton>
        </div>
      );
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
            <LinkButton onClick={() => openEnglishTab('pronunciation')}>{t('path.open.pronunciationTab')}</LinkButton>
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
            <LinkButton onClick={() => openEnglishTab('pronunciation')}>{t('path.open.pronunciationTab')}</LinkButton>
          </div>
        );
      }
      break;
    }
    case 'check':
      body = <div dir="ltr"><QuickCheck items={checkItems} /></div>;
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
