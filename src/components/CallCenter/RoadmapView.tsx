import { useState } from 'react';
import { CheckCircle2, ChevronDown, Circle, Lock } from 'lucide-react';
import { LEVELS, PLAN_DAYS } from '../../data/callCenter';
import type { PlanLevel } from '../../data/callCenter/types';
import {
  bestAttempt, bestTyping, dayDone, latestEfset, levelProgress, passedTest, weekProgress,
} from '../../lib/callCenter/progress';
import { TYPING_TARGETS } from '../../lib/callCenter/quiz';
import { ProgressBar, ProgressRing } from '../English/CourseVisuals';
import { useCallCenter } from './CallCenterContext';
import { ArabicNote, Card, Pill } from './ui';

/** Each level's exit criteria, checked against what's saved. */
function useExitChecks(level: PlanLevel): Array<{ text: string; ok: boolean | null }> {
  const { tests, typing, settings, calls } = useCallCenter();
  const examBest = level.examId ? bestAttempt(tests[level.examId]) : null;
  const typingBest = bestTyping(typing);
  const target = TYPING_TARGETS[level.id];
  const efset = latestEfset(settings);
  return level.exit.map((text) => {
    if (/exam|simulation/i.test(text) && level.examId) return { text: examBest ? `${text} · best ${examBest.percent}%` : text, ok: !!examBest?.passed };
    if (/^Typing/.test(text)) {
      const ok = !!typingBest && typingBest.wpm >= target.wpm && typingBest.accuracy >= target.accuracy;
      return { text: typingBest ? `${text} · best ${typingBest.wpm} words/min, ${typingBest.accuracy}%` : text, ok };
    }
    if (/EF SET/.test(text)) {
      const need = Number(text.match(/(\d+)/)?.[1] ?? 0);
      return { text: efset !== null ? `${text} · last ${efset}` : text, ok: efset !== null && efset >= need };
    }
    if (/mock call/i.test(text)) {
      const need = Number(text.match(/(\d+)%/)?.[1] ?? 0);
      const best = calls.reduce((m, c) => Math.max(m, c.percent), 0);
      return { text: calls.length ? `${text} · best ${best}%` : text, ok: best >= need };
    }
    if (/diagnostic test/i.test(text)) return { text, ok: !!tests['L0-DIAG']?.length };
    return { text, ok: null };
  });
}

function LevelCard({ level, onOpenDay, defaultOpen }: { level: PlanLevel; onOpenDay: (index: number) => void; defaultOpen: boolean }) {
  const { tasks, tests } = useCallCenter();
  const [open, setOpen] = useState(defaultOpen);
  const progress = levelProgress(level, tasks);
  const checks = useExitChecks(level);
  const previous = LEVELS[level.number - 1];
  const locked = level.status === 'ready' && previous?.examId && !passedTest(tests, previous.examId);
  const planned = level.status === 'planned';
  const dayIndex = (id: string) => PLAN_DAYS.findIndex((d) => d.day.id === id);

  return (
    <Card className={planned ? 'opacity-90' : ''}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-center gap-4 text-start">
        <ProgressRing ratio={planned ? 0 : progress.ratio} size={56} stroke={5}>
          <span className="text-sm font-bold text-ink tabular-nums">{planned ? level.number : `${Math.floor(progress.ratio * 100)}%`}</span>
        </ProgressRing>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-ink-light">Level {level.number}</span>
            <Pill tone="accent">{level.cefr}</Pill>
            {planned && <Pill>Coming next</Pill>}
            {locked && (
              <Pill>
                <Lock size={10} /> Pass level {previous.number} first
              </Pill>
            )}
          </div>
          <div className="text-lg font-bold text-ink">{level.name}</div>
          <p className="text-sm text-ink-light">{level.goal}</p>
        </div>
        <ChevronDown size={18} className={`shrink-0 text-ink-light transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="text-xs font-semibold text-ink mb-1.5">To pass this level</div>
            <ul className="space-y-1">
              {checks.map((c) => (
                <li key={c.text} className="flex items-start gap-2 text-sm text-ink">
                  {c.ok ? <CheckCircle2 size={16} className="shrink-0 mt-px text-sage-soft" /> : <Circle size={16} className="shrink-0 mt-px text-ink-lighter" />}
                  {c.text}
                </li>
              ))}
            </ul>
          </div>

          {planned && level.outline && (
            <div className="space-y-2">
              <ArabicNote>الليفل ده متخطط بالكامل في ROADMAP.md جوه المشروع. لما تخلّص ليفل 3، قول لـ Claude «ابدأ ليفل {level.number}» وهيكمل من هنا.</ArabicNote>
              <ol className="space-y-1.5">
                {level.outline.map((w, i) => (
                  <li key={w.title} className="text-sm">
                    <span className="font-medium text-ink">
                      Week {i + 1}: {w.title}
                    </span>
                    <span className="text-ink-light"> · {w.focus}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {level.weeks.map((w) => {
            const wp = weekProgress(w, tasks);
            const quiz = bestAttempt(tests[w.quizId]);
            return (
              <div key={w.id} className="rounded-xl border border-border-subtle p-3 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-ink">
                    Week {w.number}: {w.title}
                  </span>
                  {quiz && <Pill tone={quiz.passed ? 'good' : 'neutral'}>Quiz {quiz.percent}%</Pill>}
                </div>
                <p className="text-xs text-ink-light">{w.goal}</p>
                <ProgressBar ratio={wp.ratio} size="sm" label={w.title} />
                <div className="flex flex-wrap gap-1.5">
                  {w.days.map((d, i) => {
                    const done = dayDone(d, tasks);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => onOpenDay(dayIndex(d.id))}
                        title={d.title}
                        className={`px-2.5 py-1 rounded-lg text-xs tabular-nums border transition-colors ${
                          done ? 'border-sage-soft bg-sage-soft/15 text-sage-soft-dark' : 'border-border-subtle text-ink-light hover:border-clay-soft hover:text-ink'
                        }`}
                      >
                        {i === 5 ? 'Quiz' : `Day ${i + 1}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {level.extraDays.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onOpenDay(dayIndex(d.id))}
              className={`w-full flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm text-start ${
                dayDone(d, tasks) ? 'border-sage-soft/50 bg-sage-soft/8' : 'border-border-subtle hover:border-clay-soft'
              }`}
            >
              <span className="font-medium text-ink">{d.title}</span>
              {dayDone(d, tasks) ? <CheckCircle2 size={16} className="text-sage-soft" /> : <span className="text-xs text-ink-light">Open</span>}
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

/** All levels: where you are, what's left, and what each level needs to pass. */
export default function RoadmapView({ currentIndex, onOpenDay }: { currentIndex: number; onOpenDay: (index: number) => void }) {
  const currentLevel = PLAN_DAYS[currentIndex]?.level.id;
  return (
    <div className="space-y-3">
      <ArabicNote>
        الخطة: ليفل 0 تشخيص، 1 أساسيات، 2 مكالمات، 3 انترفيو (بعده تقدّم على الشغل). 4 و 5 للوصول لـ C1 و overqualified. كل ليفل في آخره امتحان، وكل أسبوع في آخره quiz.
      </ArabicNote>
      {LEVELS.map((level) => (
        <LevelCard key={level.id} level={level} onOpenDay={onOpenDay} defaultOpen={level.id === currentLevel} />
      ))}
    </div>
  );
}
