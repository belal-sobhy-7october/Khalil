/** One renderer per kind of test item (see TestItem in data/callCenter/types.ts). */
import { useMemo, useState } from 'react';
import { Check, Headphones, Mic, RotateCcw, Volume2 } from 'lucide-react';
import { getScript, getScenario } from '../../data/callCenter';
import type { Skill, TestItem } from '../../data/callCenter/types';
import { recognizeOnce, speechRecognitionSupported } from '../../lib/speech';
import { useOnline } from '../../lib/offline';
import { SPEAKING_RUBRIC, accuracyPoints, bestAccuracy, speakingPercent, typingPoints, wordAccuracy } from '../../lib/callCenter/grading';
import { seeded, shuffle } from '../../lib/callCenter/quiz';
import { speakLines, speakText } from '../../lib/callCenter/voice';
import { writingFeedbackPrompt } from '../../lib/callCenter/prompts';
import { ChoiceQuestion } from './activities/GrammarActivity';
import RoleplayActivity from './activities/RoleplayActivity';
import TypingTest from './TypingTest';
import VoiceRecorder from './VoiceRecorder';
import { AiPartnerButtons, ReadAloud, primaryBtn, secondaryBtn } from './ui';

export interface ItemResult {
  points: number;
  max: number;
  skill: Skill;
  /** For the mistake log. */
  wrong?: { wrong: string; right: string; note?: string };
}

type Report = (r: ItemResult) => void;

const MAX_PLAYS = 2;

function PlayButton({ onPlay, plays, label = 'Play' }: { onPlay: () => void; plays: number; label?: string }) {
  return (
    <button type="button" onClick={onPlay} disabled={plays >= MAX_PLAYS} className={`${primaryBtn} disabled:opacity-50`}>
      <Volume2 size={13} /> {plays ? 'Play again' : label}
      <span className="opacity-75 tabular-nums">({MAX_PLAYS - plays} left)</span>
    </button>
  );
}

const fill = (q: string, word: string) => (q.includes('___') ? q.replace('___', word) : word);

function McqItem({ item, result, report }: { item: Extract<TestItem, { type: 'mcq' }>; result?: ItemResult; report: Report }) {
  const [chosen, setChosen] = useState<number | undefined>(undefined);
  const [plays, setPlays] = useState(0);
  return (
    <div className="space-y-3">
      {item.audio && (
        <PlayButton
          plays={plays}
          onPlay={() => {
            setPlays((p) => p + 1);
            speakText(item.audio ?? '');
          }}
        />
      )}
      <ChoiceQuestion
        item={item}
        chosen={result ? chosen : undefined}
        onChoose={(i) => {
          setChosen(i);
          const right = i === item.answer;
          report({
            points: right ? 1 : 0,
            max: 1,
            skill: item.skill,
            ...(right ? {} : { wrong: { wrong: fill(item.q, item.options[i]), right: fill(item.q, item.options[item.answer]), note: item.why } }),
          });
        }}
      />
    </div>
  );
}

function DictationItem({ item, result, report }: { item: Extract<TestItem, { type: 'dictation' }>; result?: ItemResult; report: Report }) {
  const [typed, setTyped] = useState('');
  const [plays, setPlays] = useState(0);
  const accuracy = result ? wordAccuracy(item.text, typed) : 0;
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink">Listen, then type exactly what you hear.</p>
      <PlayButton
        plays={plays}
        onPlay={() => {
          setPlays((p) => p + 1);
          speakText(item.text, 0.9);
        }}
      />
      <input
        dir="ltr"
        value={typed}
        disabled={!!result}
        onChange={(e) => setTyped(e.target.value)}
        spellCheck={false}
        className="w-full rounded-xl border border-border-subtle bg-transparent px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay-soft/40"
        placeholder="Type the sentence…"
      />
      {result ? (
        <p className="text-sm">
          <span className={result.points === 1 ? 'text-sage-soft-dark' : 'text-clay-soft-dark'}>{Math.round(accuracy * 100)}% of the words · </span>
          <span className="text-ink">{item.text}</span>
        </p>
      ) : (
        <button
          type="button"
          disabled={!typed.trim() || plays === 0}
          onClick={() => {
            const points = accuracyPoints(wordAccuracy(item.text, typed));
            report({ points, max: 1, skill: 'listening', ...(points < 1 ? { wrong: { wrong: typed, right: item.text, note: 'Dictation' } } : {}) });
          }}
          className={`${primaryBtn} disabled:opacity-50`}
        >
          <Check size={13} /> Check
        </button>
      )}
    </div>
  );
}

function RepeatItem({ item, result, report }: { item: Extract<TestItem, { type: 'repeat' }>; result?: ItemResult; report: Report }) {
  const online = useOnline();
  const canListen = online && speechRecognitionSupported();
  const [plays, setPlays] = useState(0);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);

  const listen = async () => {
    setListening(true);
    const r = await recognizeOnce('en-US', 9000);
    setListening(false);
    if (!r.ok) {
      setHeard('');
      return;
    }
    const accuracy = bestAccuracy(item.text, r.transcripts);
    setHeard(r.transcripts[0] ?? '');
    const points = accuracyPoints(accuracy);
    report({ points, max: 1, skill: 'speaking', ...(points < 1 ? { wrong: { wrong: r.transcripts[0] ?? '', right: item.text, note: 'Repeat' } } : {}) });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-ink">Listen, then say the sentence back exactly.</p>
      <div className="flex flex-wrap gap-2">
        <PlayButton
          plays={plays}
          onPlay={() => {
            setPlays((p) => p + 1);
            speakText(item.text, 0.95);
          }}
        />
        {canListen && !result && (
          <button type="button" disabled={plays === 0 || listening} onClick={() => void listen()} className={`${secondaryBtn} disabled:opacity-50`}>
            <Mic size={13} /> {listening ? 'Listening…' : 'Say it now'}
          </button>
        )}
      </div>
      {heard !== null && (
        <p className="text-xs text-ink-light" dir="ltr">
          Heard: <span className="text-ink">{heard || '(nothing; try again or check yourself below)'}</span>
        </p>
      )}
      {(result || (heard === '' && !result) || !canListen) && (
        <div className="space-y-2">
          {!reveal && !result ? (
            <button type="button" disabled={plays === 0} onClick={() => setReveal(true)} className={`${secondaryBtn} disabled:opacity-50`}>
              I said it: show the sentence
            </button>
          ) : (
            <p className="text-sm text-ink">{item.text}</p>
          )}
          {reveal && !result && (
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'All of it', points: 1 },
                { label: 'Most of it', points: 0.5 },
                { label: 'Not really', points: 0 },
              ].map((o) => (
                <button key={o.label} type="button" onClick={() => report({ points: o.points, max: 1, skill: 'speaking' })} className={secondaryBtn}>
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BuildItem({ item, result, report, seed }: { item: Extract<TestItem, { type: 'build' }>; result?: ItemResult; report: Report; seed: string }) {
  const order = useMemo(() => {
    const shuffled = shuffle(item.chunks.map((_, i) => i), seeded(seed));
    // Never show them already in the right order.
    return shuffled.every((v, i) => v === i) ? [...shuffled].reverse() : shuffled;
  }, [item.chunks, seed]);
  const [picked, setPicked] = useState<number[]>([]);
  const sentence = item.chunks.join(' ');
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink">Tap the parts in the right order to make a sentence, then say it out loud.</p>
      <div className="min-h-11 rounded-xl border border-dashed border-border-subtle p-2 text-sm text-ink" dir="ltr">
        {picked.map((i) => item.chunks[i]).join(' ') || <span className="text-ink-lighter">Your sentence…</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {order.map((i) => (
          <button
            key={i}
            type="button"
            disabled={picked.includes(i) || !!result}
            onClick={() => setPicked((p) => [...p, i])}
            className="px-3 py-1.5 rounded-lg border border-border-subtle text-sm text-ink hover:border-clay-soft disabled:opacity-40"
          >
            {item.chunks[i]}
          </button>
        ))}
      </div>
      {result ? (
        <p className="text-sm">
          <span className={result.points ? 'text-sage-soft-dark' : 'text-clay-soft-dark'}>{result.points ? 'Right: ' : 'The right order: '}</span>
          <span className="text-ink">{sentence}</span>
        </p>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={picked.length !== item.chunks.length}
            onClick={() => {
              // By the words, so two chunks that read the same can go either way.
              const right = picked.map((i) => item.chunks[i]).join(' ') === sentence;
              speakText(sentence);
              report({ points: right ? 1 : 0, max: 1, skill: 'grammar', ...(right ? {} : { wrong: { wrong: picked.map((i) => item.chunks[i]).join(' '), right: sentence, note: 'Word order' } }) });
            }}
            className={`${primaryBtn} disabled:opacity-50`}
          >
            <Check size={13} /> Check
          </button>
          <button type="button" onClick={() => setPicked([])} className={secondaryBtn}>
            <RotateCcw size={13} /> Clear
          </button>
        </div>
      )}
    </div>
  );
}

function ListenItem({ item, report }: { item: Extract<TestItem, { type: 'listen' }>; report: Report }) {
  const script = getScript(item.scriptId);
  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  if (!script) return null;
  const choose = (qi: number, option: number) => {
    const next = { ...answers, [qi]: option };
    setAnswers(next);
    if (Object.keys(next).length < script.questions.length) return;
    const wrong = script.questions.find((q, i) => next[i] !== q.answer);
    report({
      points: script.questions.filter((q, i) => next[i] === q.answer).length,
      max: script.questions.length,
      skill: 'listening',
      ...(wrong ? { wrong: { wrong: `${wrong.q} → ${wrong.options[next[script.questions.indexOf(wrong)]]}`, right: wrong.options[wrong.answer], note: script.title } } : {}),
    });
  };
  return (
    <div className="space-y-4">
      <p className="text-sm text-ink">Listen to the whole call, then answer the questions. (No transcript: like the real test.)</p>
      <button
        type="button"
        disabled={plays >= MAX_PLAYS || playing}
        onClick={() => {
          setPlays((p) => p + 1);
          setPlaying(true);
          speakLines(
            script.lines.map((l) => ({ text: l.text, who: l.who })),
            { onLine: (i) => i === -1 && setPlaying(false) }
          );
        }}
        className={`${primaryBtn} disabled:opacity-50`}
      >
        <Headphones size={13} /> {playing ? 'Playing…' : plays ? 'Play again' : 'Play the call'} <span className="opacity-75">({MAX_PLAYS - plays} left)</span>
      </button>
      {plays > 0 && (
        <div className="space-y-4">
          {script.questions.map((q, i) => (
            <ChoiceQuestion key={q.q} item={q} number={i + 1} chosen={answers[i]} onChoose={(o) => choose(i, o)} />
          ))}
        </div>
      )}
    </div>
  );
}

function RetellItem({ item, report, recordKey }: { item: Extract<TestItem, { type: 'retell' }>; report: Report; recordKey: string }) {
  const [plays, setPlays] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState(false);
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink">Listen to the story, then retell it in your own words (about 30 seconds).</p>
      <PlayButton
        plays={plays}
        label="Play the story"
        onPlay={() => {
          setPlays((p) => p + 1);
          speakText(item.story, 0.95);
        }}
      />
      {plays > 0 && <VoiceRecorder promptId={recordKey} target={[20, 45]} history={false} onTake={() => setRecorded(true)} />}
      {recorded && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-ink">Listen to your take: which of these did you say?</div>
          {item.points.map((p, i) => (
            <label key={p} className="flex items-start gap-2 text-sm text-ink">
              <input type="checkbox" disabled={done} checked={!!checked[i]} onChange={(e) => setChecked((c) => ({ ...c, [i]: e.target.checked }))} className="mt-1 accent-clay-soft" />
              {p}
            </label>
          ))}
          {!done && (
            <button
              type="button"
              onClick={() => {
                setDone(true);
                const got = item.points.filter((_, i) => checked[i]).length;
                report({ points: (got / item.points.length) * 2, max: 2, skill: 'speaking' });
              }}
              className={primaryBtn}
            >
              <Check size={13} /> Score it
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** Self-rating with the speaking rubric (1–5 each). */
function SpeakingRating({ onScore }: { onScore: (percent: number) => void }) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const complete = SPEAKING_RUBRIC.every((c) => ratings[c.id]);
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-ink">Listen to your take and rate it honestly (5 = {SPEAKING_RUBRIC[0].five.toLowerCase()})</div>
      {SPEAKING_RUBRIC.map((c) => (
        <div key={c.id} className="flex flex-wrap items-center gap-2">
          <span className="w-28 text-sm text-ink">{c.name}</span>
          <div className="flex rounded-lg bg-ink/5 p-0.5" role="group" aria-label={c.name}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                disabled={done}
                aria-pressed={ratings[c.id] === n}
                onClick={() => setRatings((r) => ({ ...r, [c.id]: n }))}
                className={`w-8 py-1 rounded-md text-xs tabular-nums ${ratings[c.id] === n ? 'bg-card text-ink shadow-sm font-semibold' : 'text-ink-light'}`}
              >
                {n}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-ink-light">5 = {c.five}</span>
        </div>
      ))}
      {!done && (
        <button
          type="button"
          disabled={!complete}
          onClick={() => {
            setDone(true);
            onScore(speakingPercent(ratings));
          }}
          className={`${primaryBtn} disabled:opacity-50`}
        >
          <Check size={13} /> Score it
        </button>
      )}
    </div>
  );
}

function SpeakItem({ item, report, recordKey }: { item: Extract<TestItem, { type: 'speak' }>; report: Report; recordKey: string }) {
  const [recorded, setRecorded] = useState(false);
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-1">
        <p className="flex-1 text-base font-semibold text-ink">{item.prompt}</p>
        <button type="button" onClick={() => speakText(item.prompt)} aria-label="Listen to the question" className="p-1.5 text-ink-light hover:text-clay-soft">
          <Volume2 size={15} />
        </button>
      </div>
      <VoiceRecorder promptId={recordKey} target={[Math.round(item.seconds * 0.5), item.seconds]} history={false} onTake={() => setRecorded(true)} />
      {recorded && <SpeakingRating onScore={(percent) => report({ points: (percent / 100) * 3, max: 3, skill: 'speaking' })} />}
    </div>
  );
}

function WriteItem({ item, report }: { item: Extract<TestItem, { type: 'write' }>; report: Report }) {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState(false);
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink">{item.prompt}</p>
      <textarea
        dir="ltr"
        rows={5}
        value={text}
        disabled={submitted}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-xl border border-border-subtle bg-transparent p-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay-soft/40"
        placeholder="Write your reply…"
      />
      {!submitted ? (
        <button type="button" disabled={!text.trim()} onClick={() => setSubmitted(true)} className={`${primaryBtn} disabled:opacity-50`}>
          <Check size={13} /> Done: compare with a model
        </button>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl bg-sage-soft/8 border border-sage-soft/30 p-3 text-sm text-ink">{item.model}</div>
          <ReadAloud text={item.model} />
          <div className="text-sm font-medium text-ink">Does your reply have…</div>
          {item.checklist.map((c, i) => (
            <label key={c} className="flex items-start gap-2 text-sm text-ink">
              <input type="checkbox" disabled={done} checked={!!checked[i]} onChange={(e) => setChecked((x) => ({ ...x, [i]: e.target.checked }))} className="mt-1 accent-clay-soft" />
              {c}
            </label>
          ))}
          <AiPartnerButtons prompt={writingFeedbackPrompt(item.prompt, text)} />
          {!done && (
            <button
              type="button"
              onClick={() => {
                setDone(true);
                const got = item.checklist.filter((_, i) => checked[i]).length;
                report({ points: (got / item.checklist.length) * 2, max: 2, skill: 'writing' });
              }}
              className={primaryBtn}
            >
              <Check size={13} /> Score it
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CallItem({ item, report }: { item: Extract<TestItem, { type: 'call' }>; report: Report }) {
  const scenario = getScenario(item.scenarioId);
  return (
    <div className="space-y-3">
      <p className="text-base font-semibold text-ink">Mock call: {scenario?.title}</p>
      <RoleplayActivity refId={item.scenarioId} onScore={(percent) => report({ points: (percent / 100) * 3, max: 3, skill: 'calls' })} />
    </div>
  );
}

export function TestItemView({ item, result, report, seed, recordKey }: {
  item: TestItem;
  result?: ItemResult;
  report: Report;
  /** Seeds the order of shuffled parts. */
  seed: string;
  /** Where recordings for this item are kept. */
  recordKey: string;
}) {
  switch (item.type) {
    case 'mcq':
      return <McqItem item={item} result={result} report={report} />;
    case 'dictation':
      return <DictationItem item={item} result={result} report={report} />;
    case 'repeat':
      return <RepeatItem item={item} result={result} report={report} />;
    case 'build':
      return <BuildItem item={item} result={result} report={report} seed={seed} />;
    case 'listen':
      return <ListenItem item={item} report={report} />;
    case 'retell':
      return <RetellItem item={item} report={report} recordKey={recordKey} />;
    case 'speak':
      return <SpeakItem item={item} report={report} recordKey={recordKey} />;
    case 'write':
      return <WriteItem item={item} report={report} />;
    case 'typing':
      return (
        <TypingTest
          textId={item.textId}
          target={{ wpm: item.wpm, accuracy: item.accuracy }}
          onResult={(s) => report({ points: typingPoints(s, item.wpm, item.accuracy) * 2, max: 2, skill: 'typing' })}
        />
      );
    case 'call':
      return <CallItem item={item} report={report} />;
  }
}
