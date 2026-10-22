import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Flame, Keyboard, Library, MessageCircle, PartyPopper, Repeat, Zap } from 'lucide-react';
import { PLAN_DAYS, getScenario, getScript, getTypingText } from '../../data/callCenter';
import { dayDone, dayRatio, minutesOn } from '../../lib/callCenter/progress';
import { FREE_TALK_TOPICS, freeTalkPrompt, roleplayPrompt } from '../../lib/callCenter/prompts';
import { TYPING_TARGETS } from '../../lib/callCenter/quiz';
import { openEnglishTab, openFlashcards } from '../../lib/callCenter/navigation';
import { getToday } from '../../store/dateHelpers';
import { ProgressBar } from '../English/CourseVisuals';
import { useCallCenter } from './CallCenterContext';
import ShadowActivity from './activities/ShadowActivity';
import TaskCard from './TaskCard';
import TypingTest from './TypingTest';
import { AiPartnerButtons, ArabicNote, Card, Pill, primaryBtn, secondaryBtn } from './ui';

export type GoTab = (tab: 'voice' | 'interview' | 'tests' | 'library') => void;

/** Extra practice for long study days (the plan is built for up to six hours a day). */
function PowerHours({ dayIndex, onGoTab }: { dayIndex: number; onGoTab: GoTab }) {
  const { level, week } = PLAN_DAYS[dayIndex];
  const [open, setOpen] = useState<string | null>(null);
  if (!week) return null;
  const topic = FREE_TALK_TOPICS[dayIndex % FREE_TALK_TOPICS.length];
  const scenario = getScenario(week.content.scenarios[dayIndex % week.content.scenarios.length]);
  const script = getScript(week.content.scripts[(dayIndex + 1) % week.content.scripts.length]);
  const typing = getTypingText(week.content.typing[(dayIndex + 1) % week.content.typing.length]);
  const items = [
    {
      id: 'library',
      icon: Library,
      title: 'Watch 2–3 more videos (45 min)',
      text: 'Role-play calls and mock calls from the library, with a pen: write down every phrase you would steal.',
      body: (
        <button type="button" onClick={() => onGoTab('library')} className={primaryBtn}>
          Open the library
        </button>
      ),
    },
    scenario && {
      id: 'roleplay',
      icon: Repeat,
      title: `Another role-play: ${scenario.title} (20 min)`,
      text: 'Same call, but tell the AI to be angrier and faster this time.',
      body: <AiPartnerButtons prompt={`${roleplayPrompt(scenario)}\n\nThis is my second try: be 30% angrier and talk faster than a normal customer.`} />,
    },
    {
      id: 'talk',
      icon: MessageCircle,
      title: `Free talk with AI: ${topic} (20 min)`,
      text: 'Fluency comes from talking a lot. No notes, no stopping.',
      body: <AiPartnerButtons prompt={freeTalkPrompt(topic)} />,
    },
    script && {
      id: 'shadow',
      icon: Repeat,
      title: `Shadow again: ${script.title} (20 min)`,
      text: 'Shadow it three times at 1.1×: speed without losing clarity.',
      body: <ShadowActivity refId={script.id} onDone={() => {}} />,
    },
    typing && {
      id: 'typing',
      icon: Keyboard,
      title: `Typing: three more tests (10 min)`,
      text: typing.title,
      body: <TypingTest textId={typing.id} target={TYPING_TARGETS[level.id]} />,
    },
    {
      id: 'flashcards',
      icon: Zap,
      title: 'Flashcards and the English hub (30 min)',
      text: 'Review your due flashcards, then do the next lesson in Pronunciation or Listening.',
      body: (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={openFlashcards} className={secondaryBtn}>
            Flashcards
          </button>
          <button type="button" onClick={() => openEnglishTab('pronunciation')} className={secondaryBtn}>
            Pronunciation lessons
          </button>
          <button type="button" onClick={() => openEnglishTab('listening')} className={secondaryBtn}>
            Listening lessons
          </button>
        </div>
      ),
    },
  ].filter((x): x is NonNullable<typeof x> => !!x);

  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-2">
        <Zap size={18} className="text-gold-soft" />
        <h3 className="font-semibold text-ink">Power hours</h3>
        <Pill>optional</Pill>
      </div>
      <ArabicNote>
        لو هتذاكر 6 ساعات: المهام اللي فوق حوالي ساعتين. الباقي هنا: كلام واستماع كتير، لأن الطلاقة بتيجي من الكمية. ابدأ بـ 3 ساعات في أول أسبوع وزوّد تدريجي عشان متتحرقش.
      </ArabicNote>
      <ul className="divide-y divide-border-subtle">
        {items.map((item) => (
          <li key={item.id} className="py-2">
            <button type="button" onClick={() => setOpen(open === item.id ? null : item.id)} className="w-full flex items-start gap-3 text-start" aria-expanded={open === item.id}>
              <item.icon size={16} className="mt-0.5 shrink-0 text-clay-soft" />
              <span>
                <span className="block text-sm font-medium text-ink">{item.title}</span>
                <span className="block text-xs text-ink-light">{item.text}</span>
              </span>
            </button>
            {open === item.id && <div className="mt-3 ps-7">{item.body}</div>}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** The day to study: its tasks, its progress, and what's next. */
export default function TodayView({ dayIndex, currentIndex, onSelectDay, onRunTest, onGoTab }: {
  dayIndex: number;
  /** The first unfinished day. */
  currentIndex: number;
  onSelectDay: (index: number) => void;
  onRunTest: (testId: string, taskId: string) => void;
  onGoTab: GoTab;
}) {
  const { tasks } = useCallCenter();
  const { day, level, week } = PLAN_DAYS[dayIndex];
  const [open, setOpen] = useState<string | null>(() => day.tasks.find((t) => !tasks[t.id])?.id ?? null);
  const done = dayDone(day, tasks);
  const ratio = dayRatio(day, tasks);
  const todayMinutes = useMemo(() => minutesOn(getToday(), tasks), [tasks]);
  const dayNumber = week ? Number(day.id.split('-D')[1]) : null;
  const prev = dayIndex > 0 ? dayIndex - 1 : null;
  const next = dayIndex < PLAN_DAYS.length - 1 && PLAN_DAYS[dayIndex + 1].level.status === 'ready' ? dayIndex + 1 : null;

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-light">
              <span>
                Level {level.number} · {level.name}
              </span>
              {week && (
                <>
                  <span>·</span>
                  <span>
                    Week {week.number}: {week.title}
                  </span>
                </>
              )}
              {dayIndex === currentIndex ? <Pill tone="accent">Today</Pill> : dayIndex < currentIndex ? <Pill tone="good">Done</Pill> : <Pill>Ahead</Pill>}
            </div>
            <h2 className="mt-1 text-xl font-bold text-ink">
              {dayNumber ? `Day ${dayNumber}: ` : ''}
              {day.title}
            </h2>
            {week && <p className="mt-1 text-sm text-ink">{week.goal}</p>}
          </div>
          <div className="flex gap-1 shrink-0">
            <button type="button" disabled={prev === null} onClick={() => prev !== null && onSelectDay(prev)} aria-label="Previous day" className="p-2 rounded-lg hover:bg-ink/5 disabled:opacity-30">
              <ArrowLeft size={16} />
            </button>
            <button type="button" disabled={next === null} onClick={() => next !== null && onSelectDay(next)} aria-label="Next day" className="p-2 rounded-lg hover:bg-ink/5 disabled:opacity-30">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
        {week && <ArabicNote>{week.noteAr}</ArabicNote>}
        <div className="space-y-1">
          <ProgressBar ratio={ratio} label="Today's progress" />
          <div className="flex justify-between text-xs text-ink-light tabular-nums">
            <span>
              {day.tasks.filter((t) => tasks[t.id]).length} / {day.tasks.length} tasks · about {day.tasks.reduce((m, t) => m + t.minutes, 0)} min
            </span>
            <span className="inline-flex items-center gap-1">
              <Flame size={12} /> {todayMinutes} min studied today
            </span>
          </div>
        </div>
        {dayIndex !== currentIndex && (
          <button type="button" onClick={() => onSelectDay(currentIndex)} className="text-xs text-clay-soft hover:underline">
            Back to today's day
          </button>
        )}
      </Card>

      {done && (
        <Card className="flex flex-col sm:flex-row sm:items-center gap-3 border-sage-soft/50 bg-sage-soft/8">
          <PartyPopper size={28} className="text-gold-soft shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-ink">Day complete!</div>
            <ArabicNote>عاش يا بطل 💪 يوم كمان أقرب للشغلانة. لو لسه عندك طاقة، كمّل في الـ power hours أو ابدأ اليوم اللي بعده.</ArabicNote>
          </div>
          {next !== null && (
            <button type="button" onClick={() => onSelectDay(next)} className={primaryBtn}>
              Next day <ArrowRight size={13} />
            </button>
          )}
        </Card>
      )}

      {/* Working on a task keeps this day on screen even once it's finished (to see "Day complete"). */}
      <div className="space-y-2.5" onClickCapture={() => onSelectDay(dayIndex)}>
        {day.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            level={level.id}
            done={!!tasks[task.id]}
            open={open === task.id}
            onToggleOpen={() => setOpen(open === task.id ? null : task.id)}
            onRunTest={onRunTest}
            onGoTab={onGoTab}
          />
        ))}
      </div>

      <PowerHours dayIndex={dayIndex} onGoTab={onGoTab} />
    </div>
  );
}
