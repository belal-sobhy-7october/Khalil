import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getQuestion } from '../../data/callCenter';
import { interviewQuestionPrompt } from '../../lib/callCenter/prompts';
import { useCallCenter } from './CallCenterContext';
import VoiceRecorder from './VoiceRecorder';
import { AiPartnerButtons, ArabicNote, NaturalReaderButton, SpeakButton, secondaryBtn } from './ui';

/**
 * One interview question: what they're checking, your recorded answer, your
 * own written version, and the model answer (hidden until you've tried).
 */
export default function QuestionCard({ questionId, onDone, showQuestion = false }: {
  questionId: string;
  onDone?: () => void;
  /** Repeat the question at the top (when it isn't already the card's title). */
  showQuestion?: boolean;
}) {
  const q = getQuestion(questionId);
  const { answers, saveAnswer } = useCallCenter();
  const [showModel, setShowModel] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  // Saved a moment after you stop typing (and when you leave), not only on blur.
  const pending = useRef<{ timer: number; save: () => void } | null>(null);
  const flush = () => {
    if (!pending.current) return;
    window.clearTimeout(pending.current.timer);
    pending.current.save();
    pending.current = null;
  };
  useEffect(() => () => flush(), []);
  if (!q) return <p className="text-sm text-ink-light">This question is missing.</p>;
  const mine = draft ?? answers[q.id]?.text ?? '';

  return (
    <div className="space-y-4">
      {showQuestion && (
        <div className="flex items-start gap-1">
          <p className="flex-1 text-lg font-semibold text-ink">{q.q}</p>
          <SpeakButton text={q.q} />
        </div>
      )}
      <div className="text-sm space-y-1.5">
        <p className="text-ink">
          <span className="font-medium">What they're checking: </span>
          {q.why}
        </p>
        <ul className="list-disc ps-5 text-ink-light space-y-0.5">
          {q.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {q.tipAr && <ArabicNote>{q.tipAr}</ArabicNote>}
      </div>

      <div>
        <div className="text-xs font-medium text-ink-light mb-1.5">Answer out loud (30–90 seconds)</div>
        <VoiceRecorder promptId={`q:${q.id}`} target={[30, 90]} onTake={onDone} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`answer-${q.id}`} className="text-xs font-medium text-ink-light">
          Your own answer: write it in your words, then say it without reading
        </label>
        <textarea
          id={`answer-${q.id}`}
          dir="ltr"
          rows={4}
          value={mine}
          onChange={(e) => {
            const text = e.target.value;
            setDraft(text);
            if (pending.current) window.clearTimeout(pending.current.timer);
            const save = () => saveAnswer(q.id, text);
            pending.current = { save, timer: window.setTimeout(() => { pending.current = null; save(); }, 800) };
          }}
          onBlur={() => {
            flush();
            setDraft(null);
          }}
          placeholder="I'm a software developer from Cairo…"
          className="w-full rounded-xl border border-border-subtle bg-transparent p-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay-soft/40"
        />
      </div>

      <div className="space-y-2">
        <button type="button" onClick={() => setShowModel((v) => !v)} className={secondaryBtn}>
          {showModel ? <EyeOff size={13} /> : <Eye size={13} />} {showModel ? 'Hide the model answer' : 'Show a model answer'}
        </button>
        {showModel && (
          <div className="rounded-xl bg-sage-soft/8 border border-sage-soft/30 p-3 space-y-3">
            <div className="flex items-start gap-1">
              <p className="flex-1 text-sm text-ink leading-relaxed">{q.answer}</p>
              <SpeakButton text={q.answer} />
            </div>
            <NaturalReaderButton text={q.answer} />
            <div>
              <div className="text-xs font-semibold text-ink mb-1">Phrases worth stealing</div>
              <ul className="space-y-1">
                {q.phrases.map((p) => (
                  <li key={p} className="flex items-center gap-1 text-sm text-ink">
                    <span className="flex-1">{p}</span>
                    <SpeakButton text={p.replace(/…/g, '')} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-ink mb-1">Mistakes people make</div>
              <ul className="list-disc ps-5 text-xs text-ink-light space-y-0.5">
                {q.mistakes.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="text-xs font-medium text-ink-light">Practice it with an AI interviewer</div>
        <AiPartnerButtons prompt={interviewQuestionPrompt(q)} />
      </div>
    </div>
  );
}
