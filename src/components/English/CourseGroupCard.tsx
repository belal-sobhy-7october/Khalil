import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronDown, CircleCheckBig, Headphones, ListChecks, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { EASE } from './courseMotion';
import { markDoneKey } from './courseLabels';
import { videoThumb, type CourseGroup, type CourseLesson } from '../../data/courses';
import { clockLength, lessonFraction, lessonStats, type CourseProgress, type WatchPositions } from '../../lib/courseProgress';
import { AnimatedNumber, DoneCheck, PlayingBars, ProgressBar, Thumb, ThumbProgress } from './CourseVisuals';

export type LessonFilter = 'all' | 'remaining' | 'done';

/** How long a lesson ticked under a filter stays in view, so the tick is seen before it leaves. */
const LINGER_MS = 900;
/** Long levels (some have 200 stories) show this many lessons at a time. */
const PAGE = 40;

/** The small picture at the start of a lesson row. */
function LessonArt({ lesson, done, fraction }: { lesson: CourseLesson; done: boolean; fraction: number }) {
  if (lesson.kind === 'audio') {
    return (
      <span className={`hidden sm:flex w-10 h-10 shrink-0 rounded-lg items-center justify-center bg-clay-soft/10 text-clay-soft ${done ? 'opacity-50' : ''}`}>
        <Headphones size={16} />
      </span>
    );
  }
  if (lesson.kind === 'book') {
    return (
      <span className="relative hidden sm:block w-9 shrink-0 aspect-[2/3] rounded overflow-hidden bg-ink/10">
        {lesson.image && <Thumb src={lesson.image} className={`w-full h-full object-cover ${done ? 'opacity-50' : ''}`} />}
      </span>
    );
  }
  return (
    <span className="relative hidden sm:block w-16 shrink-0 aspect-video rounded-md overflow-hidden bg-ink/10">
      <Thumb src={videoThumb(lesson.id)} className={`w-full h-full object-cover transition-opacity duration-300 ${done ? 'opacity-50' : ''}`} />
      <ThumbProgress fraction={fraction} />
    </span>
  );
}

/** The level's picture in its header: the first video, the first book's cover or a podcast tile. */
function GroupCover({ group }: { group: CourseGroup }) {
  const first = group.lessons[0];
  if (!first || first.kind === 'audio') {
    return (
      <span className="w-full h-full flex items-center justify-center bg-linear-to-br from-clay-soft/25 to-gold-soft/25 text-clay-soft-dark">
        <Headphones size={20} />
      </span>
    );
  }
  if (first.kind === 'book') {
    return first.image ? (
      <Thumb src={first.image} className="w-full h-full object-cover" />
    ) : (
      <span className="w-full h-full flex items-center justify-center text-ink-light">
        <BookOpen size={20} />
      </span>
    );
  }
  return <Thumb src={videoThumb(first.id)} className="w-full h-full object-cover" />;
}

/** One level as a to-do list: a tick box per lesson and its own progress bar. */
export default function CourseGroupCard({
  group, progress, positions, open, onToggleOpen, filter, activeId, nextId, onOpenLesson, onSetDone, formatDuration,
}: {
  group: CourseGroup;
  progress: CourseProgress;
  positions: WatchPositions;
  open: boolean;
  onToggleOpen: () => void;
  filter: LessonFilter;
  /** The lesson open in the player. */
  activeId?: string;
  /** The source's next lesson, marked in the list. */
  nextId?: string;
  onOpenLesson: (lesson: CourseLesson) => void;
  onSetDone: (ids: string[], done: boolean) => void;
  formatDuration: (seconds: number) => string;
}) {
  const { t } = useTranslation();
  const [lingering, setLingering] = useState<string[]>([]);
  const [limit, setLimit] = useState(() => {
    const nextIndex = group.lessons.findIndex((l) => l.id === nextId);
    return Math.max(PAGE, nextIndex + 10);
  });
  const stats = lessonStats(group.lessons, progress, positions);
  const complete = stats.percent === 100;
  const matching = group.lessons
    .map((lesson, index) => ({ lesson, index }))
    .filter(({ lesson }) => filter === 'all' || lingering.includes(lesson.id) || (filter === 'done') === !!progress[lesson.id]);
  const activeIndex = matching.findIndex(({ lesson }) => lesson.id === activeId);
  const shownCount = Math.max(limit, activeIndex + 5);
  const shown = matching.slice(0, shownCount);
  const hidden = matching.length - shown.length;
  const showsTime = group.lessons.some((l) => l.seconds > 0);

  const toggle = (id: string, done: boolean) => {
    onSetDone([id], !done);
    if (filter === 'all') return;
    setLingering((l) => [...l, id]);
    window.setTimeout(() => setLingering((l) => l.filter((x) => x !== id)), LINGER_MS);
  };

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-colors duration-500 ${
        complete ? 'border-gold-soft/50 bg-gold-soft/5' : 'border-border-subtle bg-card/40'
      }`}
    >
      <button
        type="button"
        onClick={onToggleOpen}
        aria-expanded={open}
        className="w-full flex items-center gap-3 p-3 text-start hover:bg-ink/[0.03] transition-colors"
      >
        <div className="relative w-20 shrink-0 aspect-video rounded-lg overflow-hidden bg-ink/10">
          <GroupCover group={group} />
          <span className="absolute bottom-0.5 end-0.5 px-1 rounded bg-black/75 text-[10px] text-white tabular-nums">{stats.total}</span>
          <AnimatePresence initial={false}>
            {complete && (
              <motion.span
                key="complete"
                className="absolute inset-0 flex items-center justify-center bg-sage-soft/75 text-white"
                initial={{ opacity: 0, scale: 1.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <CircleCheckBig size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="text-sm font-semibold text-ink leading-snug line-clamp-2">
            <bdi>{group.name}</bdi>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-ink-light [&>span]:whitespace-nowrap">
            <span className="tabular-nums">
              {t('english.courses.lessonsDone').replace('{done}', String(stats.done)).replace('{total}', String(stats.total))}
            </span>
            {showsTime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{formatDuration(stats.seconds)}</span>
              </>
            )}
            <span className={`ms-auto tabular-nums font-semibold ${complete ? 'text-gold-soft-dark' : 'text-ink-light'}`}>
              {complete ? (
                t('english.courses.complete')
              ) : (
                <>
                  <AnimatedNumber value={stats.percent} />%
                </>
              )}
            </span>
          </div>
          <ProgressBar ratio={stats.ratio} size="sm" label={group.name} />
        </div>
        <ChevronDown size={18} className={`shrink-0 text-ink-lighter transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="lessons"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="overflow-hidden border-t border-border-subtle"
          >
            {matching.length === 0 && (
              <p className="px-4 py-3 text-xs text-ink-light">
                {t(filter === 'done' ? 'english.courses.noneDone' : 'english.courses.nothingLeft')}
              </p>
            )}
            <ul>
              <AnimatePresence initial={false}>
                {shown.map(({ lesson, index }) => {
                  const done = !!progress[lesson.id];
                  const fraction = lessonFraction(lesson, progress, positions);
                  const partial = !done && fraction > 0;
                  const active = activeId === lesson.id;
                  const isNext = !active && lesson.id === nextId;
                  return (
                    <motion.li
                      key={lesson.id}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`flex items-center gap-3 px-3 py-2 border-b border-border-subtle transition-colors duration-300 ${
                          active ? 'bg-clay-soft/10' : 'hover:bg-ink/[0.03]'
                        }`}
                      >
                        <DoneCheck
                          done={done}
                          fraction={fraction}
                          onToggle={() => toggle(lesson.id, done)}
                          label={`${t(done ? 'english.courses.markNotDone' : markDoneKey(lesson.kind))}: ${lesson.title}`}
                        />
                        <button
                          type="button"
                          onClick={() => onOpenLesson(lesson)}
                          className="flex-1 min-w-0 flex items-center gap-3 text-start"
                          aria-label={`${t(lesson.kind === 'book' ? 'english.courses.open' : 'english.links.play')}: ${lesson.title}`}
                        >
                          <span className="w-6 shrink-0 text-center text-[11px] tabular-nums text-ink-lighter">
                            {active && lesson.kind !== 'book' ? <PlayingBars /> : index + 1}
                          </span>
                          <LessonArt lesson={lesson} done={done} fraction={partial ? fraction : 0} />
                          <span className="flex-1 min-w-0">
                            <span
                              className={`text-[13px] leading-snug line-clamp-2 transition-colors duration-300 ${
                                done ? 'text-ink-light' : 'text-ink'
                              } ${active ? 'font-semibold' : ''}`}
                            >
                              <bdi>{lesson.title}</bdi>
                            </span>
                            {isNext && (
                              <span className="inline-block mt-1 px-1.5 py-px rounded-full bg-clay-soft/15 text-clay-soft-dark text-[10px] font-semibold">
                                {t('english.courses.continue')}
                              </span>
                            )}
                          </span>
                          {lesson.seconds > 0 && (
                            <span className="shrink-0 text-end text-[10px] tabular-nums leading-tight">
                              {partial ? (
                                <span className="text-clay-soft-dark">
                                  {t('english.courses.left').replace(
                                    '{time}',
                                    clockLength(lesson.seconds - (positions[lesson.id] ?? 0))
                                  )}
                                </span>
                              ) : (
                                <span className="text-ink-lighter" dir="ltr">{clockLength(lesson.seconds)}</span>
                              )}
                            </span>
                          )}
                        </button>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
            {hidden > 0 && (
              <button
                type="button"
                onClick={() => setLimit(shownCount + PAGE)}
                className="w-full py-2.5 text-xs font-medium text-clay-soft hover:bg-clay-soft/5 border-b border-border-subtle"
              >
                {t('english.courses.showMore').replace('{count}', String(hidden))}
              </button>
            )}
            <div className="flex justify-end px-3 py-2">
              {complete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(t('english.courses.resetConfirm'))) onSetDone(group.lessons.map((l) => l.id), false);
                  }}
                  className="flex items-center gap-1.5 text-[11px] text-ink-lighter hover:text-ink"
                >
                  <RotateCcw size={12} /> {t('english.courses.reset')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSetDone(group.lessons.map((l) => l.id), true)}
                  className="flex items-center gap-1.5 text-[11px] text-ink-lighter hover:text-ink"
                >
                  <ListChecks size={12} /> {t('english.courses.markAll')}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
