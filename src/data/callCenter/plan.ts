/**
 * The plan: levels → weeks → days → tasks. Levels 0–3 are ready (they get
 * you hired); 4 and 5 are outlined here and written up in ROADMAP.md, to be
 * built next.
 *
 * A week lists what it teaches (WeekContent); its six days are built from
 * that with one template, so every week has the same rhythm:
 *   days 1–5: sound · video · phrases or grammar · shadowing or role-play ·
 *             speaking · typing
 *   day 6:    review + the weekly quiz
 * Days are study days, not dates: do the next one whenever you're ready
 * (with 6 hours a day, up to two a day plus the power hours).
 */
import type { LevelId, PlanDay, PlanLevel, PlanTask, PlanWeek, WeekContent } from './types';
import { VIDEOS } from './videos';

interface WeekSpec {
  title: string;
  goal: string;
  noteAr: string;
  content: WeekContent;
}

const WEEKS: Record<'L1' | 'L2' | 'L3', WeekSpec[]> = {
  L1: [
    {
      title: 'Sounds & Your Story',
      goal: 'Introduce yourself in a clear one-minute voice note, and fix the four sounds that give Egyptian speakers away.',
      noteAr: 'أول أسبوع: هنظبط الأصوات اللي بتفضحنا (P/B و V/F) ونسجل أول voice note. متقلقش من أول تسجيل، ده نقطة البداية مش حكم عليك.',
      content: {
        sounds: ['p-b', 'f-v', 'i-ee', 'e-ae'],
        phraseSets: ['intro-yourself', 'talk-skills'],
        grammar: 'present-simple-continuous',
        scripts: ['s-voice-note-intro', 's-login-capslock'],
        scenarios: ['r-recruiter-first-call', 'r-login-help'],
        speaking: ['voice:intro', 'tell-me-about-yourself', 'free-time', 'describe-yourself', 'voice:intro'],
        videos: ['oWP9Riq-ZBg', '1AmS9h8g3E4', '4qiYg8MvsWc', 'r09MNxGHBvI', '4z-sDnrs-FA'],
        typing: ['t-intro-notes', 't-login-ticket'],
      },
    },
    {
      title: 'Numbers, Letters & Spelling',
      goal: "Take a customer's name, phone, email and address without a single mistake, and spell yours with the NATO alphabet.",
      noteAr: 'الأرقام والتهجئة أكتر حاجة بتوقّع الناس في أول مكالمة. لو ظبطتها، نص الشغل خلص.',
      content: {
        sounds: ['letters-nato', 'numbers-teens', 'th-voiceless', 'th-voiced'],
        phraseSets: ['spelling-confirming', 'asking-details'],
        grammar: 'question-forms',
        scripts: ['s-taking-details', 's-order-number'],
        scenarios: ['r-update-contact', 'r-recruiter-details'],
        speaking: ['where-from', 'voice:details', 'what-studied', 'why-call-center', 'voice:intro'],
        videos: ['LnXUl2e2Np0', 'i3hd1rTVWWQ', 'bDTvkPMUF40', 'Co8fpooFWqY', 'yu6c89NUrKU'],
        typing: ['t-customer-details', 't-address-note'],
      },
    },
    {
      title: 'Tell Your Story: Tenses',
      goal: 'Talk about your past, your experience and your skills with the right tenses: the base of every interview answer.',
      noteAr: 'الأزمنة هي اللي بتفرق بين حد بيتكلم انجليزي وحد بيترجم من العربي. ركّز على past simple و present perfect.',
      content: {
        sounds: ['ed-endings', 's-endings', 'clusters', 'ch-sh'],
        phraseSets: ['talking-experience', 'telling-a-story'],
        grammar: 'past-vs-present-perfect',
        scripts: ['s-interview-experience', 's-what-happened'],
        scenarios: ['r-programmer-why-support', 'r-what-happened'],
        speaking: ['experience', 'programmer-why-support', 'solved-problem', 'why-leave-last-job', 'voice:why-tech-support'],
        videos: ['KN2jyw6D1ak', 'sj-dX3fZmq0', '45VicNg0aQI', 'mTJb7ne0Mbg', '4g2vrWF-mnU'],
        typing: ['t-experience-summary', 't-incident-note'],
      },
    },
    {
      title: 'Polite Phone English',
      goal: 'Open and close a call, make polite requests and offers, and put someone on hold without sounding rude.',
      noteAr: 'في الكول سنتر الأدب مش كلمة please وبس. هنتعلم could و would و I\'ll بالشكل اللي العميل الأمريكي مستنيه.',
      content: {
        sounds: ['word-stress', 'intonation', 'contractions', 'j-sound'],
        phraseSets: ['open-close-call', 'polite-requests-offers', 'hold-basics'],
        grammar: 'polite-modals',
        scripts: ['s-change-address', 's-book-technician'],
        scenarios: ['r-change-address', 'r-book-technician'],
        speaking: ['good-customer-service', 'shifts', 'strengths', 'weakness', 'tell-me-about-yourself'],
        videos: ['QWBwCoecvkM', 'NzYxS_Xy0oM', 'MzhjD-XrYjg', '2e4jGjfnRQY', 'YqPOQLH_Evw'],
        typing: ['t-hold-note', 't-appointment-note'],
      },
    },
  ],
  L2: [
    {
      title: 'The Call Flow',
      goal: 'Run a whole call in order: greeting, verification, the problem, the fix and the closing.',
      noteAr: 'كل مكالمة ليها هيكل ثابت. لو حفظت الهيكل، عمرك ما هتتوه في مكالمة حتى لو العميل صعب.',
      content: {
        sounds: ['linking', 'thought-groups', 'ow-diphthong', 'ei-diphthong'],
        phraseSets: ['call-opening', 'verification', 'call-closing'],
        grammar: 'future-forms',
        scripts: ['s-order-status', 's-verification'],
        scenarios: ['r-order-status', 'r-verify-forgot-pin'],
        speaking: ['call-flow', 'voice:read-aloud-1', 'why-our-company', 'start-date', 'voice:intro'],
        videos: ['8Kqlc-SyNmA', 'K6n6uspapos', 'ilohgPkSj9c', '13SYL1xdqek', 'seQ5RRI6H4c'],
        typing: ['t-call-summary-order', 't-verification-note'],
      },
    },
    {
      title: 'Listen, Probe, Paraphrase',
      goal: 'Find the real problem fast with open and closed questions and paraphrasing, and ask people to repeat without sounding lost.',
      noteAr: 'العميل الأمريكي بيتكلم بسرعة. مش عيب تقوله Could you repeat that؟ العيب إنك تخمّن.',
      content: {
        sounds: ['reductions', 'flap-t', 'schwa', 'o-vowels'],
        phraseSets: ['probing-questions', 'paraphrasing', 'asking-repeat'],
        grammar: 'question-types',
        scripts: ['s-vague-problem', 's-fast-talker'],
        scenarios: ['r-vague-complaint', 'r-fast-talker'],
        speaking: ['didnt-understand', 'active-listening', 'fluency-weekend', 'pressure', 'voice:read-aloud-2'],
        videos: ['5pQcnCn6ZEU', 'eSqzEbfiAb4', '-stGMAQTibc', 'NPSA2pfFy1k', '0fSmHgOQy3Q'],
        typing: ['t-probing-notes', 't-chat-clarify'],
      },
    },
    {
      title: 'Empathy & Positive Scripting',
      goal: "Calm an upset customer with real empathy, and say no in a positive way.",
      noteAr: 'الـ empathy مش إنك تقول sorry عشر مرات. هي إنك تسمّي مشكلته وتوريه إنك فاهمه، وبعدين تقوله هتعمل إيه.',
      content: {
        sounds: ['tone-warm', 'stress-shift', 'r-american', 'dark-l'],
        phraseSets: ['empathy', 'apologizing', 'positive-scripting'],
        grammar: 'softening-language',
        scripts: ['s-late-delivery', 's-saying-no'],
        scenarios: ['r-double-charge', 'r-refund-not-possible'],
        speaking: ['angry-customer', 'say-no', 'empathy-meaning', 'feedback', 'voice:empathy-lines'],
        videos: ['ujlp-kC6sZg', 'e0sMbGp-Nzw', 'JsVOye5Nj2s', 'Ewxa8KCfxnc', '33ozXz9F1ug'],
        typing: ['t-apology-chat', 't-apology-email'],
      },
    },
    {
      title: 'Billing, Payments & Orders',
      goal: 'Explain charges, refunds and delivery times clearly, so you can handle any general customer service account.',
      noteAr: 'حتى لو هدفك tech support، أغلب الأكونتات فيها billing. خليك جاهز لأي حاجة.',
      content: {
        sounds: ['prices-dates', 'stop-t', 'us-names', 'silent-letters'],
        phraseSets: ['billing', 'orders-returns', 'setting-expectations'],
        grammar: 'passive-voice',
        scripts: ['s-unknown-charge', 's-return-refund'],
        scenarios: ['r-overcharged', 'r-damaged-item'],
        speaking: ['kpis', 'mistake-at-work', 'upset-customer-story', 'fluency-movie', 'voice:read-aloud-3'],
        videos: ['WIZcRCVYQ18', 'wZiUgLaKNec', '0bB-QGS3wR8', 'QdAP9ENItNo', 'o34GHVojoiY'],
        typing: ['t-refund-email', 't-billing-note'],
      },
    },
    {
      title: 'Tech Support I: Step by Step',
      goal: 'Walk a non-technical customer through troubleshooting, one clear step at a time.',
      noteAr: 'إنت مبرمج، فالتكنيكال مش المشكلة. التحدي إنك تشرح لست عندها 70 سنة إزاي تعمل restart للراوتر من غير ولا مصطلح.',
      content: {
        sounds: ['tech-words', 'spelling-urls', 'list-intonation', 'tricky-words'],
        phraseSets: ['step-by-step', 'checking-screen', 'explaining-simply'],
        grammar: 'instructions-sequencers',
        scripts: ['s-no-internet', 's-slow-wifi'],
        scenarios: ['r-no-internet-elderly', 'r-wifi-drops'],
        speaking: ['explain-tech-simply', 'troubleshooting-approach', 'modem-vs-router', 'dont-know-answer', 'voice:explain-restart'],
        videos: ['iX-lwmQfOos', 'lN81K81Tzpc', 'gnnzVfVEKSE', 'LsvifVF2o_Y', '9n84Nrsjh1A'],
        typing: ['t-troubleshoot-steps', 't-ticket-wifi'],
      },
    },
    {
      title: 'Tech Support II: Accounts & Escalation',
      goal: 'Handle password resets, slow devices and app problems, write clean ticket notes, and escalate the right way.',
      noteAr: 'الشركات بتحب الـ agent اللي بيكتب notes واضحة وبيعرف إمتى يصعّد المشكلة. ده اللي هيفرّقك عن غيرك.',
      content: {
        sounds: ['pace', 'confident-voice', 'schwa', 'linking'],
        phraseSets: ['account-password', 'escalation-transfer', 'ticket-notes'],
        grammar: 'checks-and-notes',
        scripts: ['s-password-2fa', 's-escalation'],
        scenarios: ['r-locked-out', 'r-slow-laptop'],
        speaking: ['escalate-when', 'computer-skills', 'tech-problem-solved', 'teamwork-conflict', 'voice:why-tech-support'],
        videos: ['RsiwmpF4_s8', 'zI01NcNV1Sw', 'uUtmcnn3O2U', 'nt78gsP4-BA', 'EnYrCXXsgJM'],
        typing: ['t-ticket-password', 't-escalation-note'],
      },
    },
  ],
  L3: [
    {
      title: 'Your Voice Note & the HR Call',
      goal: 'Record a voice note that gets you a callback, and pass the ten-minute HR screening call.',
      noteAr: 'دي النقطة اللي وقعتك في eClerx. هنشتغل عليها لحد ما الريكورد بتاعك يبقى أحسن من المطلوب.',
      content: {
        sounds: ['pace', 'tone-warm', 'thought-groups', 'intonation'],
        phraseSets: ['buying-time', 'structuring-answers'],
        grammar: 'linking-ideas',
        scripts: ['s-hr-screening', 's-model-voice-note'],
        scenarios: ['r-hr-screening', 'r-hr-tricky'],
        speaking: ['voice:intro', 'military-status', 'salary-expectation', 'overqualified', 'voice:intro'],
        videos: ['YFlxRB-bSkg', 'vrJ3Hb6-pcw', 'A3d0jeDQJdM', '_zpWmShXDzw', 'tsPvthr-K0w'],
        typing: ['t-cover-message', 't-availability-email'],
      },
    },
    {
      title: 'The Assessment',
      goal: 'Beat the online test: Versant-style speaking, grammar and reading, and typing at 35+ words per minute.',
      noteAr: 'الأسسمنت مش امتحان مدرسة، هو اختبار سرعة ووضوح. هنتدرب على نفس شكل الأسئلة لحد ما تبقى عادية بالنسبالك.',
      content: {
        sounds: ['clusters', 'ed-endings', 's-endings', 'th-voiced'],
        phraseSets: ['open-question-answers', 'retelling'],
        grammar: 'error-clinic',
        scripts: ['s-colleagues-shift', 's-office-move'],
        scenarios: ['r-assessment-mock', 'r-open-questions'],
        speaking: ['fluency-technology', 'fluency-goal', 'where-from', 'fluency-weekend', 'voice:read-aloud-4'],
        videos: ['VxOLWNzs65U', 'Pa47N7W6WaQ', 'NBV6JBNx-bs', 'zXq1ei-GCOk', 'ekfq6W3cD6E'],
        typing: ['t-assessment-1', 't-assessment-2'],
      },
    },
    {
      title: 'The Operations Interview',
      goal: "Ace the final round: mock calls, 'sell me this pen', STAR answers and explaining tech simply.",
      noteAr: 'الـ operations manager مش بيدوّر على انجليزي perfect. بيدوّر على حد هادي ومنظم وبيحل المشكلة. وريه ده.',
      content: {
        sounds: ['stress-shift', 'flap-t', 'reductions', 'confident-voice'],
        phraseSets: ['star-answers', 'sales-pitch', 'describing'],
        grammar: 'second-conditional',
        scripts: ['s-ops-mock-call', 's-sell-pen'],
        scenarios: ['r-ops-mock-call', 'r-ops-interview'],
        speaking: ['sell-pen', 'describe-color', 'pressure', 'teamwork-conflict', 'why-hire-you'],
        videos: ['VGDAl0e4AF4', 'EzDQUBevzN8', 'PlAxAbBCKuk', 'S07WDdDMnkI', 'hH28QO2dBgM'],
        typing: ['t-mock-call-notes', 't-star-story'],
      },
    },
    {
      title: 'Full Simulations & Applying',
      goal: 'Go through the whole hiring process again and again, fix what breaks, and start applying with a strong CV and voice note.',
      noteAr: 'آخر أسبوع قبل ما تقدّم بجد. هنعمل الـ hiring process كامل كذا مرة، وكل مرة هتبقى أحسن من اللي قبلها.',
      content: {
        sounds: ['p-b', 'f-v', 'i-ee', 'ow-diphthong'],
        phraseSets: ['questions-for-interviewer', 'follow-up-messages'],
        grammar: 'interview-grammar-review',
        scripts: ['s-final-interview', 's-premium-call'],
        scenarios: ['r-full-sim-telecom', 'r-full-sim-retail'],
        speaking: ['questions-for-us', 'five-years', 'why-hire-you', 'tell-me-about-yourself', 'voice:intro'],
        videos: ['ogu3ozlULrI', 'cwS1oXAlsT4', '81nQ4EyLFBM', 'M3ARCGEZouk', 'uhK9zr5CWQs'],
        typing: ['t-final-1', 't-final-2'],
      },
    },
  ],
};

const minutesOfVideo = (id: string) => Math.max(3, Math.ceil((VIDEOS[id]?.seconds ?? 600) / 60));

function task(dayId: string, kind: PlanTask['kind'], ref: string, minutes: number, note?: string): PlanTask {
  return { id: `${dayId}:${kind}:${ref}`, kind, ref, minutes, ...(note ? { note } : {}) };
}

/** The speaking task of a day: an interview question or a voice note (`voice:` ids). */
function speakingTask(dayId: string, ref: string, note?: string): PlanTask {
  return ref.startsWith('voice:') ? task(dayId, 'voice', ref.slice(6), 15, note) : task(dayId, 'interview', ref, 15, note);
}

/** The six days of a week, from what it teaches. */
export function buildDays(weekId: string, c: WeekContent): PlanDay[] {
  const d = (n: number) => `${weekId}-D${n}`;
  const phrases3 = c.phraseSets[2] ?? c.phraseSets[0];
  const reviewSounds = c.sounds.join(',');
  return [
    {
      id: d(1),
      title: 'Learn the week',
      tasks: [
        task(d(1), 'sound', c.sounds[0], 10),
        task(d(1), 'watch', c.videos[0], minutesOfVideo(c.videos[0])),
        task(d(1), 'phrases', c.phraseSets[0], 15),
        task(d(1), 'grammar', c.grammar, 15, 'Read the rule, then do the exercises.'),
        speakingTask(d(1), c.speaking[0]),
        task(d(1), 'typing', c.typing[0], 5),
      ],
    },
    {
      id: d(2),
      title: 'Shadow a real call',
      tasks: [
        task(d(2), 'sound', c.sounds[1], 10),
        task(d(2), 'watch', c.videos[1], minutesOfVideo(c.videos[1])),
        task(d(2), 'phrases', c.phraseSets[1], 15),
        task(d(2), 'shadow', c.scripts[0], 15),
        speakingTask(d(2), c.speaking[1]),
        task(d(2), 'typing', c.typing[1], 5),
      ],
    },
    {
      id: d(3),
      title: 'Your first role-play',
      tasks: [
        task(d(3), 'sound', c.sounds[2], 10),
        task(d(3), 'watch', c.videos[2], minutesOfVideo(c.videos[2])),
        task(d(3), 'grammar', c.grammar, 15, 'Second round: answer without looking at the rule.'),
        task(d(3), 'roleplay', c.scenarios[0], 20),
        speakingTask(d(3), c.speaking[2]),
        task(d(3), 'typing', c.typing[0], 5, 'Beat your score from day 1.'),
      ],
    },
    {
      id: d(4),
      title: 'More phrases, another call',
      tasks: [
        task(d(4), 'sound', c.sounds[3], 10),
        task(d(4), 'watch', c.videos[3], minutesOfVideo(c.videos[3])),
        task(d(4), 'phrases', phrases3, 15, c.phraseSets[2] ? undefined : 'Review: say every phrase without reading it.'),
        task(d(4), 'shadow', c.scripts[1], 15),
        speakingTask(d(4), c.speaking[3]),
        task(d(4), 'typing', c.typing[1], 5, 'Beat your score from day 2.'),
      ],
    },
    {
      id: d(5),
      title: 'Put it all together',
      tasks: [
        task(d(5), 'sound', reviewSounds, 10, "Review the week's four sounds."),
        task(d(5), 'watch', c.videos[4], minutesOfVideo(c.videos[4])),
        task(d(5), 'roleplay', c.scenarios[1], 20),
        speakingTask(d(5), c.speaking[4], 'Record it, then compare it with your earlier takes.'),
        task(d(5), 'typing', c.typing[0], 5),
      ],
    },
    {
      id: d(6),
      title: 'Review & weekly quiz',
      tasks: [
        task(d(6), 'review', weekId, 20, "Flashcards of the week's phrases, then re-record your weakest answer."),
        task(d(6), 'test', `${weekId}-QUIZ`, 30, 'Pass mark: 80%. Retake it after a review if you need to.'),
      ],
    },
  ];
}

function buildWeeks(level: 'L1' | 'L2' | 'L3'): PlanWeek[] {
  return WEEKS[level].map((spec, i) => {
    const id = `${level}-W${i + 1}`;
    return {
      id,
      level,
      number: i + 1,
      title: spec.title,
      goal: spec.goal,
      noteAr: spec.noteAr,
      content: spec.content,
      days: buildDays(id, spec.content),
      quizId: `${id}-QUIZ`,
    };
  });
}

function examDay(level: LevelId, title: string): PlanDay {
  const id = `${level}-EXAM`;
  return {
    id,
    title,
    tasks: [
      task(id, 'review', `${level}-mistakes`, 20, 'Go over your mistake log and your weakest recordings first.'),
      task(id, 'test', id, 60, 'Take it in one sitting, like the real thing. Pass mark: 80%.'),
    ],
  };
}

export const EFSET_URL = 'https://www.efset.org/ef-set-50/';

export const LEVELS: PlanLevel[] = [
  {
    id: 'L0',
    number: 0,
    name: 'Diagnostic',
    cefr: 'Your starting point',
    goal: 'Find your real level in every skill, and record your "before".',
    exit: ['Finish the diagnostic test', 'Record your baseline voice note', 'Save your EF SET score'],
    status: 'ready',
    weeks: [],
    extraDays: [
      {
        id: 'L0-D1',
        title: 'Diagnostic day',
        tasks: [
          task('L0-D1', 'voice', 'intro', 10, "Don't prepare. This is your \"before\" recording; you'll compare every level with it."),
          task('L0-D1', 'test', 'L0-DIAG', 40, 'Not pass/fail: it shows where to focus.'),
          task('L0-D1', 'link', 'efset', 50, 'Free, 50 minutes, reading and listening. Save your score here; the certificate goes on your CV later.'),
        ],
      },
    ],
  },
  {
    id: 'L1',
    number: 1,
    name: 'Foundation',
    cefr: 'B1 → B1+',
    goal: 'Fix the basics recruiters punish: sounds, tenses, questions, numbers, and a clear voice note.',
    exit: ['Level exam: 80% or more', 'Typing: 25 words per minute at 90% accuracy', 'A one-minute voice note with no long pauses'],
    status: 'ready',
    weeks: buildWeeks('L1'),
    extraDays: [examDay('L1', 'Level 1 exam')],
    examId: 'L1-EXAM',
  },
  {
    id: 'L2',
    number: 2,
    name: 'Customer Service Core',
    cefr: 'B1+ → B2',
    goal: 'Handle a whole call on any account, tech support first.',
    exit: ['Level exam: 80% or more', 'A mock call of 70% or more on the QA rubric', 'Typing: 30 words per minute at 92% accuracy'],
    status: 'ready',
    weeks: buildWeeks('L2'),
    extraDays: [examDay('L2', 'Level 2 exam')],
    examId: 'L2-EXAM',
  },
  {
    id: 'L3',
    number: 3,
    name: 'Interview Bootcamp',
    cefr: 'B2 → B2+ · job-ready',
    goal: 'Pass every stage: the voice note, the HR call, the assessment and the operations interview.',
    exit: ['The hiring simulation: 80% or more', 'Typing: 35 words per minute at 95% accuracy', 'EF SET: 55 or more', 'Start applying'],
    status: 'ready',
    weeks: buildWeeks('L3'),
    extraDays: [examDay('L3', 'Level 3 exam: the hiring simulation')],
    examId: 'L3-EXAM',
  },
  {
    id: 'L4',
    number: 4,
    name: 'Advanced',
    cefr: 'B2+ → C1',
    goal: 'Sound natural and handle complex calls: connected speech, diplomacy, escalations and any accent.',
    exit: ['EF SET: 61 or more (C1)', 'A premium mock call of 85% or more', 'Two-minute answers to surprise questions, with a clear structure'],
    status: 'planned',
    weeks: [],
    extraDays: [],
    outline: [
      { title: 'Connected speech & intonation', focus: 'Linking, reductions, the flap T and sentence stress; shadow fast, natural calls.' },
      { title: 'Diplomatic language', focus: 'Softening, hedging, saying no to angry customers and setting limits politely.' },
      { title: 'Escalations & supervisor calls', focus: 'Threats to cancel, complaints to management, legal words.' },
      { title: 'Retention & sales', focus: 'Saving a cancellation, upselling naturally, handling objections.' },
      { title: 'Complex troubleshooting', focus: 'Multi-step tech issues, remote tools, explaining the root cause.' },
      { title: 'Accents of the world', focus: 'Southern US, UK regional, Australian and Indian English; very fast speakers.' },
      { title: 'Chat & email support', focus: 'Short, clear writing; templates; tone in writing; two chats at once.' },
      { title: 'C1 review & exam', focus: 'Mixed conditionals, inversion, cleft sentences; the C1 exam.' },
    ],
  },
  {
    id: 'L5',
    number: 5,
    name: 'Overqualified',
    cefr: 'C1 → C1+',
    goal: 'Premium accounts and team-leader-level communication.',
    exit: ['EF SET: 65 or more', 'Calls: 90% or more on the QA rubric', 'Typing: 45 words per minute at 97% accuracy'],
    status: 'planned',
    weeks: [],
    extraDays: [],
    outline: [
      { title: 'Premium account simulations', focus: 'Big-brand tech support, travel and banking calls, polished from start to finish.' },
      { title: 'Leadership communication', focus: 'QA language, coaching a colleague, explaining KPIs, running a team huddle.' },
      { title: 'Spontaneity', focus: 'Surprise topics, small talk, humor, handling interruptions.' },
      { title: 'The Overqualified exam', focus: 'A full premium hiring simulation, certificates and premium applications.' },
    ],
  },
];

/** Every day of the plan in order (diagnostic, the weeks, each level's exam). */
export const PLAN_DAYS: Array<{ day: PlanDay; level: PlanLevel; week: PlanWeek | null }> = LEVELS.flatMap((level) => [
  ...(level.id === 'L0' ? level.extraDays.map((day) => ({ day, level, week: null })) : []),
  ...level.weeks.flatMap((week) => week.days.map((day) => ({ day, level, week }))),
  ...(level.id === 'L0' ? [] : level.extraDays.map((day) => ({ day, level, week: null }))),
]);
