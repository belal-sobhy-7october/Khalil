/**
 * The sales plan: levels → weeks → days → tasks. Days are study days, not
 * dates: Today shows the first unfinished one. Every week has the same six
 * days (see buildDays), so a week only lists what it teaches.
 */
import { LEVEL1_WEEKS } from './level1';
import { LEVEL2_WEEKS } from './level2';
import { LEVEL3_WEEKS } from './level3';
import { BASELINE_SPEAK, EXAM_ROLEPLAYS, EXAM_SPEAKING, START_LESSON } from './start';
import type {
  Drill, ListenItem, Mission, SalesDay, SalesLesson, SalesLevel, SalesLevelId, SalesRoleplay, SalesTask, SalesTaskKind, SalesWeek, SalesWeekSpec, SpeakPrompt,
} from './types';

export const DIAGNOSTIC_ID = 'S0-DIAG';

const task = (dayId: string, kind: SalesTaskKind, ref: string, minutes: number): SalesTask => ({ id: `${dayId}:${kind}:${ref}`, kind, ref, minutes });

/**
 * A week's six days. Lessons one a day; listening on days 1, 3 and 5; drills on
 * 1 and 3; role-plays on 2 and 5; the mission on 4; speaking on 1, 3 and 5; a
 * notebook line every study day; English weeks add their words on day 1.
 * Day 6 is the review and the weekly quiz.
 */
function buildDays(weekId: string, spec: SalesWeekSpec, quizId: string): SalesDay[] {
  const { lessons, listens, drills, roleplays, mission, speaking, words } = spec.content;
  const review = spec.lang === 'en' ? 'Review & weekly quiz' : 'مراجعة وكويز الأسبوع';
  const plan: Array<(id: string) => SalesTask[]> = [
    (id) => [
      task(id, 'lesson', lessons[0].id, 15),
      ...(words ? [task(id, 'words', weekId, 15)] : []),
      task(id, 'listen', listens[0].id, listens[0].minutes),
      task(id, 'drill', drills[0].id, 15),
      task(id, 'speak', speaking[0].id, 10),
    ],
    (id) => [task(id, 'lesson', lessons[1].id, 15), task(id, 'roleplay', roleplays[0].id, 25)],
    (id) => [task(id, 'lesson', lessons[2].id, 15), task(id, 'listen', listens[1].id, listens[1].minutes), task(id, 'drill', drills[1].id, 15), task(id, 'speak', speaking[1].id, 10)],
    (id) => [task(id, 'lesson', lessons[3].id, 15), task(id, 'mission', mission.id, 30)],
    (id) => [task(id, 'lesson', lessons[4].id, 15), task(id, 'listen', listens[2].id, listens[2].minutes), task(id, 'roleplay', roleplays[1].id, 25), task(id, 'speak', speaking[2].id, 10)],
  ];
  const study = plan.map((build, i) => {
    const id = `${weekId}-D${i + 1}`;
    return { id, title: lessons[i].title, tasks: [...build(id), task(id, 'journal', `d${i + 1}`, 5)] };
  });
  const quizDay = `${weekId}-D6`;
  return [...study, { id: quizDay, title: review, tasks: [task(quizDay, 'review', weekId, 15), task(quizDay, 'quiz', quizId, 20)] }];
}

function buildWeeks(level: SalesLevelId, specs: SalesWeekSpec[]): SalesWeek[] {
  return specs.map((spec) => {
    const id = `${level}-W${spec.number}`;
    const quizId = `${id}-QUIZ`;
    return { ...spec, id, level, quizId, days: buildDays(id, spec, quizId) };
  });
}

/** The last day of a level: review, the full role-play, the speaking task and the exam. */
function examDay(level: SalesLevelId, title: string, roleplay: string, speak: string): SalesDay {
  const id = `${level}-EXAM`;
  return {
    id,
    title,
    tasks: [task(id, 'review', level, 20), task(id, 'roleplay', roleplay, 30), task(id, 'speak', speak, 10), task(id, 'quiz', id, 30), task(id, 'journal', 'exam', 5)],
  };
}

const START_DAY: SalesDay = {
  id: 'S0-D1',
  title: 'أول يوم',
  tasks: [
    task('S0-D1', 'lesson', START_LESSON.id, 10),
    task('S0-D1', 'speak', BASELINE_SPEAK.id, 10),
    task('S0-D1', 'quiz', DIAGNOSTIC_ID, 15),
    task('S0-D1', 'journal', 'start', 10),
  ],
};

export const LEVELS: SalesLevel[] = [
  {
    id: 'S0',
    number: 0,
    name: 'نقطة البداية',
    lang: 'ar',
    goal: 'تعرف الخطة، تسجل «قبل»، وتقيس انت فين.',
    exit: ['اختبار البداية (مش امتحان نجاح، بس عشان تقيس)'],
    status: 'ready',
    weeks: [],
    extraDays: [START_DAY],
  },
  {
    id: 'S1',
    number: 1,
    name: 'أساسيات السيلز',
    lang: 'ar',
    goal: 'تفهم البيع صح، تسأل وتسمع، تعرض القيمة، ترد على الاعتراضات وتقفل.',
    exit: ['امتحان المستوى 80% أو أكتر', 'رول بلاي الامتحان 80% أو أكتر في التقييم', 'المهمات الأربعة في الحياة الحقيقية'],
    status: 'ready',
    weeks: buildWeeks('S1', LEVEL1_WEEKS),
    extraDays: [examDay('S1', 'امتحان المستوى 1', EXAM_ROLEPLAYS[0].id, EXAM_SPEAKING[0].id)],
    examId: 'S1-EXAM',
  },
  {
    id: 'S2',
    number: 2,
    name: 'السوق والشغلانة',
    lang: 'ar',
    goal: 'تلاقي عملاء وتعمل مكالمات باردة، تنظم الـ pipeline، تتفاوض، وتجهز لأول شغلانة.',
    exit: ['امتحان المستوى 80% أو أكتر', 'رول بلاي الامتحان 80% أو أكتر في التقييم', 'المهمات الأربعة في الحياة الحقيقية'],
    status: 'ready',
    weeks: buildWeeks('S2', LEVEL2_WEEKS),
    extraDays: [examDay('S2', 'امتحان المستوى 2', EXAM_ROLEPLAYS[1].id, EXAM_SPEAKING[1].id)],
    examId: 'S2-EXAM',
  },
  {
    id: 'S3',
    number: 3,
    name: 'Sales in English',
    lang: 'en',
    goal: 'The same skills in English: the words, discovery, pitch and objections, closing, and the English sales interview.',
    exit: ['Level exam 80% or more', 'Exam role-play 80% or more on the checklist', 'The four real-life missions', "The week's words in your flashcards"],
    status: 'ready',
    weeks: buildWeeks('S3', LEVEL3_WEEKS),
    extraDays: [examDay('S3', 'Level 3 exam', EXAM_ROLEPLAYS[2].id, EXAM_SPEAKING[2].id)],
    examId: 'S3-EXAM',
  },
  {
    id: 'S4',
    number: 4,
    name: 'التخصص',
    lang: 'ar',
    goal: 'بعد ما تبدأ الشغل أو قبله بشوية: تختار مجال وتتعمق فيه.',
    exit: ['تختار مسار واحد وتخلص أسابيعه'],
    status: 'planned',
    weeks: [],
    extraDays: [],
    outline: [
      { title: 'B2B وSaaS (SDR بالإنجليزي)', focus: 'إيميلات باردة، لينكدإن، مكالمات لشركات برا، وأدوات CRM.' },
      { title: 'بيع العقارات في مصر', focus: 'الكمبوندات، الأقساط، زيارات الموقع، والمتابعة الطويلة.' },
      { title: 'التيلي سيلز والريتيل المتقدم', focus: 'مكالمات أكتر في وقت أقل، الـ upsell، والـ cross-sell.' },
      { title: 'أول 90 يوم والترقية', focus: 'أرقامك، الـ feedback، وإزاي تبقى Senior أو Team Lead.' },
    ],
  },
];

export interface PlanDayRef {
  day: SalesDay;
  level: SalesLevel;
  week?: SalesWeek;
}

/** Every day of the plan, in order. */
export const PLAN_DAYS: PlanDayRef[] = LEVELS.flatMap((level) => [
  ...level.weeks.flatMap((week) => week.days.map((day) => ({ day, level, week }))),
  ...level.extraDays.map((day) => ({ day, level })),
]);

const WEEKS = LEVELS.flatMap((l) => l.weeks);
const content = WEEKS.map((w) => w.content);

const byId = <T extends { id: string }>(items: T[]) => new Map(items.map((x) => [x.id, x]));

export const ALL_LESSONS: SalesLesson[] = [START_LESSON, ...content.flatMap((c) => c.lessons)];
const LESSONS = byId(ALL_LESSONS);
const LISTENS = byId<ListenItem>(content.flatMap((c) => c.listens));
const DRILLS = byId<Drill>(content.flatMap((c) => c.drills));
const ROLEPLAYS = byId<SalesRoleplay>([...content.flatMap((c) => c.roleplays), ...EXAM_ROLEPLAYS]);
const MISSIONS = byId<Mission>(content.map((c) => c.mission));
const SPEAKING = byId<SpeakPrompt>([BASELINE_SPEAK, ...content.flatMap((c) => c.speaking), ...EXAM_SPEAKING]);
const WEEKS_BY_ID = byId(WEEKS);

export const getLesson = (id: string) => LESSONS.get(id);
export const getListen = (id: string) => LISTENS.get(id);
export const getDrill = (id: string) => DRILLS.get(id);
export const getRoleplay = (id: string) => ROLEPLAYS.get(id);
export const getMission = (id: string) => MISSIONS.get(id);
export const getSpeak = (id: string) => SPEAKING.get(id);
export const getWeek = (id: string) => WEEKS_BY_ID.get(id);
export const getLevel = (id: string) => LEVELS.find((l) => l.id === id);

/** The week a day belongs to, or its level for the plan's own days. */
export const dayRef = (dayId: string) => PLAN_DAYS.find((d) => d.day.id === dayId);
