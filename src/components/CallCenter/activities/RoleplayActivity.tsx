import { Save, Sparkles } from 'lucide-react';
import { getScenario } from '../../../data/callCenter';
import { CALL_RUBRIC, INTERVIEW_RUBRIC, rubricPercent, type RubricCriterion } from '../../../lib/callCenter/grading';
import { roleplayPrompt } from '../../../lib/callCenter/prompts';
import { useCallCenter } from '../CallCenterContext';
import { AiPartnerButtons, ArabicNote, Pill, primaryBtn } from '../ui';
import { useSavedProgress } from '../useSavedProgress';

const LEVELS = [
  { value: 0, label: 'Missed' },
  { value: 1, label: 'Partly' },
  { value: 2, label: 'Great' },
];

/** Score a call or an interview with a 0–2 rubric (from the AI's feedback, or your own honest view). */
export function RubricScorer({ rubric, scores, onChange }: {
  rubric: RubricCriterion[];
  scores: Record<string, number>;
  onChange: (scores: Record<string, number>) => void;
}) {
  return (
    <ul className="space-y-2">
      {rubric.map((c) => (
        <li key={c.id} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-ink">{c.name}</div>
            <div className="text-xs text-ink-light">{c.great}</div>
          </div>
          <div className="flex rounded-lg bg-ink/5 p-0.5 shrink-0" role="group" aria-label={c.name}>
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                aria-pressed={scores[c.id] === l.value}
                onClick={() => onChange({ ...scores, [c.id]: l.value })}
                className={`px-2.5 py-1 rounded-md text-xs ${scores[c.id] === l.value ? 'bg-card text-ink shadow-sm font-medium' : 'text-ink-light'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** A role-play with an AI partner, then a QA score you save. */
export default function RoleplayActivity({ refId, onDone, onScore, progressKey }: {
  refId: string;
  /** Where the half-filled rubric is saved (the task id in the plan). */
  progressKey?: string;
  onDone?: () => void;
  /** In a test: report the percent instead of only saving it. */
  onScore?: (percent: number) => void;
}) {
  const scenario = getScenario(refId);
  const { calls, saveCall } = useCallCenter();
  // The rubric as you fill it in, saved until you save the score.
  const [draft, setDraft, clearDraft] = useSavedProgress<{ scores: Record<string, number>; saved: boolean }>(progressKey ?? `roleplay:${refId}`, { scores: {}, saved: false });
  const { scores, saved } = draft;
  if (!scenario) return <p className="text-sm text-ink-light">This role-play is missing.</p>;
  const rubric = scenario.role === 'candidate' ? INTERVIEW_RUBRIC : CALL_RUBRIC;
  const complete = rubric.every((c) => scores[c.id] !== undefined);
  const percent = rubricPercent(scores, rubric);
  const past = calls.filter((c) => c.scenarioId === scenario.id);

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-sm">
        <div className="flex flex-wrap gap-1.5">
          <Pill tone="accent">{scenario.role === 'candidate' ? "You're the candidate" : "You're the agent"}</Pill>
          <Pill>{scenario.account}</Pill>
        </div>
        <p className="text-ink">
          <span className="font-medium">{scenario.role === 'candidate' ? 'Interviewer: ' : 'Caller: '}</span>
          {scenario.persona}
        </p>
        <p className="text-ink">
          <span className="font-medium">Situation: </span>
          {scenario.situation}
        </p>
        <p className="text-ink">
          <span className="font-medium">Your goal: </span>
          {scenario.goal}
        </p>
        <div>
          <div className="font-medium text-ink">Don't skip:</div>
          <ul className="mt-1 list-disc ps-5 text-ink-light space-y-0.5">
            {scenario.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        {scenario.twist && (
          <p className="inline-flex items-center gap-1.5 text-xs text-clay-soft-dark">
            <Sparkles size={13} /> The AI has a surprise for you halfway through.
          </p>
        )}
      </div>

      <div className="rounded-xl bg-ink/3 p-3 space-y-2">
        <ArabicNote>
          انسخ البرومبت، افتح ChatGPT أو Gemini، شغّل الـ voice mode واتكلم كأنها مكالمة حقيقية. لما تخلص قول «end call» (أو «end interview») وهيقيّمك. انقل التقييم هنا.
        </ArabicNote>
        <AiPartnerButtons prompt={roleplayPrompt(scenario)} />
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-ink">Your score</div>
        <RubricScorer rubric={rubric} scores={scores} onChange={(s) => setDraft({ scores: s, saved: false })} />
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-lg font-bold tabular-nums text-ink">{percent}%</span>
          <button
            type="button"
            disabled={!complete || saved}
            onClick={() => {
              // In a test the result is saved with the test; in the plan, with your calls.
              if (onScore) {
                onScore(percent);
                clearDraft();
              } else {
                saveCall(scenario.id, percent);
                setDraft({ scores, saved: true });
              }
              onDone?.();
            }}
            className={`${primaryBtn} disabled:opacity-50`}
          >
            <Save size={13} /> {saved ? 'Saved' : 'Save this score'}
          </button>
          {!complete && <span className="text-xs text-ink-light">Score every line to save.</span>}
        </div>
        {past.length > 0 && !onScore && (
          <p className="text-xs text-ink-light">
            Earlier: {past.slice(-5).map((c) => `${c.percent}%`).join(' · ')}
          </p>
        )}
      </div>
    </div>
  );
}
