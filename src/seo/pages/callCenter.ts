/**
 * Call Center Prep in public: a guide in each language (how English call
 * centers in Egypt hire, the numbers, the salaries, the plan), the interview
 * question bank (a page per question) and the word bank (a page per unit).
 * The questions and words are in English, so they have English pages; the
 * Arabic guide lists them with Arabic headings.
 */
import { LEVELS, QUESTIONS, VOCAB_UNITS, VOCAB_WORDS } from '../../data/callCenter';
import { QUESTION_GROUPS } from '../../data/callCenter/interview';
import { COMPANIES, FREE_TOOLS, HIRING_STAGES, SALARY_GUIDE, TARGETS, WHERE_TO_APPLY, type StageId } from '../../data/callCenter/resources';
import type { InterviewQuestion, LevelId, QuestionGroup } from '../../data/callCenter/types';
import type { VocabUnit } from '../../data/callCenter/vocab';
import { MEANINGS_AR, UNIT_TITLES_AR } from '../../data/callCenter/vocabAr';
import { arCount, NOUNS } from '../arabicCount';
import { clip, type Block, type Card, type Lang, type Page } from '../render';
import { ROUTES, slugify } from '../routes';
import { article, breadcrumbs, itemList } from '../schema';

/** The Arabic guide's own words for the English data (resources.ts, plan.ts). */
export const AR = {
  groups: {
    hr: 'فرز الموارد البشرية',
    egypt: 'أسئلة تُطرح في مصر',
    behavioral: 'أسئلة السلوك (STAR)',
    situational: 'أسئلة المواقف',
    tech: 'الدعم الفني',
    fluency: 'مواضيع الطلاقة',
  } satisfies Record<QuestionGroup, string>,
  stages: {
    'voice-note': {
      name: 'الرسالة الصوتية',
      what: 'يطلب كثير من مسؤولي التوظيف (على واتساب أو تيليجرام أو X) رسالة صوتية مدتها دقيقة أو دقيقتان قبل أي خطوة أخرى. إنهم يسمعون صوتك وطريقة كلامك، لا سيرتك الذاتية.',
      traps: ['التسرّع، أو السكتات الطويلة', 'الأصوات العربية الواضحة (P وB، وV وF، والحروف المتحركة المسطّحة)', 'نبرة محفوظة كأنها آلية', 'الضوضاء، أو هاتف بعيد عن فمك'],
    },
    'hr-call': {
      name: 'مكالمة الفرز مع الموارد البشرية',
      what: 'مكالمة هاتفية من 5 إلى 10 دقائق: عرّفني بنفسك، ولماذا هذه الوظيفة، والورديات، والراتب، وموقفك من التجنيد. يقيسون الطلاقة والنطق والاستماع والأسلوب.',
      traps: ['الإجابة بكلمة واحدة', 'عدم فهم الأسئلة السريعة', 'التردد في الورديات أو الراتب', 'أن تبدو غير واثق'],
    },
    assessment: {
      name: 'الاختبار الإلكتروني',
      what: 'اختبار في الإنجليزية (قواعد، ومفردات، وقراءة، واستماع، وكلام مسجّل، وكثيرًا ما يشبه اختبار Versant)، واختبار سرعة الكتابة (ذُكر أن Concentrix تطلب نحو 35 كلمة في الدقيقة)، وأحيانًا اختبار ذكاء أو قدرات.',
      traps: ['الصمت في أجزاء الكلام', 'أخطاء أساسية: أدوات التعريف، وحرف s، والأزمنة', 'بطء الكتابة', 'الارتباك أمام المؤقت'],
    },
    'ops-interview': {
      name: 'مقابلة العمليات',
      what: 'الجولة الأخيرة مع قائد فريق أو مدير عمليات: مكالمة تجريبية، وأسئلة مواقف وسلوك، و«بِعني هذا القلم»، و«صِف لونًا لشخص كفيف».',
      traps: ['أن تفقد السيطرة على عميل غاضب في المكالمة التجريبية', 'قصص بلا نتيجة', 'لوم العميل', 'ألا تسأل أي سؤال في النهاية'],
    },
    offer: {
      name: 'العرض والحساب',
      what: 'مستواك في التقييم يحدد الحساب (Account) والراتب: مستوى B2 يفتح أغلب الحسابات الإنجليزية، وC1 يفتح الحسابات المميزة والأمريكية.',
      traps: ['قبول أول عرض دون أن تعرف الحساب', 'ألا تسأل عن التدريب وبدلات الورديات'],
    },
  } satisfies Record<StageId, { name: string; what: string; traps: string[] }>,
  targets: {
    Typing: { name: 'سرعة الكتابة', hired: '35 كلمة في الدقيقة · دقة 95%', overqualified: '45 كلمة أو أكثر · دقة 97%', note: 'ذُكر أن Concentrix في الإسكندرية تطلب 35 كلمة في الدقيقة.' },
    'EF SET (free)': { name: 'EF SET (مجاني)', hired: '51–60 = B2', overqualified: '61–70 = C1، و71 فأكثر = C2', note: 'قراءة واستماع، مع شهادة مجانية لسيرتك الذاتية وLinkedIn.' },
    'Versant (if they use it)': { name: 'Versant (إن استُخدم)', hired: '58–68 = B2', overqualified: '69–78 = C1', note: 'الدرجة من 20 إلى 80، وكل شركة تحدد حدّها الأدنى.' },
    'Mock call (QA rubric)': { name: 'المكالمة التجريبية (معايير الجودة)', hired: '75% فأكثر', overqualified: '90% فأكثر', note: 'تُقيَّم بالمعايير نفسها التي تقيّم بها تمثيل الأدوار في خليل.' },
  } as Record<string, { name: string; hired: string; overqualified: string; note: string }>,
  salaries: {
    B1: { level: 'B1', range: '≈ 9,000–11,000', note: 'الحسابات الإنجليزية البسيطة.' },
    'B2 / B2+': { level: 'B2 / B2+', range: '≈ 15,000–21,000', note: 'أغلب الحسابات الإنجليزية، وقد عرض إعلان في 2026 راتبًا صافيًا قدره 20,839 جنيهًا لمستوى B2/B2+.' },
    'C1 · premium · US accounts': { level: 'C1 · الحسابات المميزة والأمريكية', range: '≈ 20,000–25,000+', note: 'يضيف بعضها عمولة أو مكافآت.' },
  } as Record<string, { level: string; range: string; note: string }>,
  whereToApply: [
    'صفحات الوظائف في مواقع الشركات، وصفحاتها على LinkedIn',
    'موقعا Wuzzuf وForasna',
    'الترشيح: اسأل موظفين يعملون هناك بالفعل (التوظيف أسرع غالبًا بالترشيح)',
    'قنوات مسؤولي التوظيف على تيليجرام وفيسبوك وX: أرسل رسالة قصيرة، وسيرتك الذاتية، وأفضل رسالة صوتية لديك',
  ],
  levels: {
    L0: { name: 'التشخيص', cefr: 'نقطة البداية', goal: 'اعرف مستواك الحقيقي في كل مهارة، وسجّل صوتك «قبل» البداية.' },
    L1: { name: 'الأساس', cefr: 'B1 → B1+', goal: 'أصلح الأساسيات التي يحاسب عليها مسؤولو التوظيف: الأصوات، والأزمنة، والأسئلة، والأرقام، ورسالة صوتية واضحة.' },
    L2: { name: 'جوهر خدمة العملاء', cefr: 'B1+ → B2', goal: 'أدِر مكالمة كاملة على أي حساب، بدءًا بالدعم الفني.' },
    L3: { name: 'معسكر المقابلات', cefr: 'B2 → B2+ · جاهز للعمل', goal: 'اجتز كل مرحلة: الرسالة الصوتية، ومكالمة الموارد البشرية، والاختبار، ومقابلة العمليات.' },
    L4: { name: 'المستوى المتقدم', cefr: 'B2+ → C1', goal: 'تكلّم بطبيعية وأدِر المكالمات الصعبة: الكلام المتصل، واللباقة، والتصعيد، وفهم أي لهجة.' },
    L5: { name: 'فوق المطلوب', cefr: 'C1 → C1+', goal: 'الحسابات المميزة، وتواصل بمستوى قائد الفريق.' },
  } satisfies Record<LevelId, { name: string; cefr: string; goal: string }>,
};

export const unitSlug = (unit: VocabUnit) => slugify(unit.title);

const questionTitle = (q: InterviewQuestion) => q.q.replace(/[.?!]+$/, '');
const groupOf = (id: QuestionGroup) => QUESTION_GROUPS.find((g) => g.id === id)?.name ?? id;

function questionCard(q: InterviewQuestion, lang: Lang): Card {
  return { href: ROUTES.question(q.id), title: q.q, text: lang === 'en' ? q.why : undefined, lang: lang === 'ar' ? 'en' : undefined };
}

function unitCard(unit: VocabUnit, lang: Lang): Card {
  return {
    href: ROUTES.vocabularyUnit(lang, unitSlug(unit)),
    title: `${unit.number}. ${lang === 'ar' ? UNIT_TITLES_AR[unit.id] : unit.title}`,
    meta: lang === 'ar' ? arCount(unit.words.length, NOUNS.word) : `${unit.words.length} words`,
    text: unit.words.slice(0, 5).map((w) => w.word).join(' · '),
  };
}

function hubPage(lang: Lang, origin: string): Page {
  const path = ROUTES.callCenter(lang);
  const alternates = { ar: ROUTES.callCenter('ar'), en: ROUTES.callCenter('en'), 'x-default': ROUTES.callCenter('en') };
  const questionsByGroup = (label: (g: QuestionGroup) => string): Block[] =>
    QUESTION_GROUPS.flatMap(({ id }): Block[] => {
      const list = QUESTIONS.filter((q) => q.group === id);
      return list.length ? [{ kind: 'h3', text: `${label(id)} (${list.length})` }, { kind: 'cards', items: list.map((q) => questionCard(q, lang)) }] : [];
    });

  if (lang === 'ar') {
    const crumbs = [{ href: ROUTES.home('ar'), label: 'الرئيسية' }];
    const h1 = 'كيف تحصل على وظيفة في مركز اتصال بالإنجليزية في مصر؟';
    return {
      path,
      lang,
      section: 'callcenter',
      title: 'وظيفة مركز اتصال بالإنجليزية في مصر: خطة مجانية وأسئلة المقابلة | خليل',
      description: clip(
        `دليل مجاني للعمل في مراكز الاتصال (الكول سنتر) بالإنجليزية في مصر: مراحل التوظيف، والرواتب التقريبية، و${arCount(QUESTIONS.length, NOUNS.question)} من أسئلة المقابلة بإجابات نموذجية، و${arCount(VOCAB_WORDS.length, NOUNS.word)} للمكالمات.`,
        200
      ),
      h1,
      crumb: 'مراكز الاتصال',
      lead: 'مراكز الاتصال بالإنجليزية (ويسميها كثيرون «الكول سنتر») من أسرع الأبواب إلى وظيفة في مصر لمن يتكلم الإنجليزية. يشرح هذا الدليل كيف توظّف هذه الشركات، وماذا تختبر، وكيف تستعد خطوة خطوة من مستوى B1 إلى C1، مجانًا.',
      crumbs,
      alternates,
      blocks: [
        { kind: 'h2', text: 'مراحل التوظيف، وماذا يختبرون في كل مرحلة', id: 'stages' },
        ...HIRING_STAGES.flatMap((stage, i): Block[] => [
          { kind: 'h3', text: `${i + 1}. ${AR.stages[stage.id].name}` },
          { kind: 'p', text: AR.stages[stage.id].what },
          { kind: 'p', text: 'ما الذي يُسقط المتقدمين هنا:' },
          { kind: 'list', items: AR.stages[stage.id].traps },
        ]),
        { kind: 'h2', text: 'الأرقام التي تحتاج إليها', id: 'targets' },
        {
          kind: 'table',
          head: ['المقياس', 'لتُقبل', 'لتتفوق', 'ملاحظة'],
          rows: TARGETS.map((t) => {
            const a = AR.targets[t.name];
            return [a.name, a.hired, a.overqualified, a.note];
          }),
        },
        { kind: 'h2', text: 'الرواتب التقريبية (بالجنيه المصري شهريًا)', id: 'salaries' },
        {
          kind: 'table',
          head: ['المستوى', 'الراتب الشهري', 'ملاحظة'],
          rows: SALARY_GUIDE.map((s) => {
            const a = AR.salaries[s.level];
            return [a.level, a.range, a.note];
          }),
        },
        { kind: 'p', text: 'أرقام تقريبية من إعلانات وظائف مصرية في 2026، والرواتب تتغير، فاعتبرها دليلًا لا وعدًا.', note: true },
        { kind: 'h2', text: 'شركات توظّف بالإنجليزية في مصر', id: 'companies' },
        { kind: 'list', items: COMPANIES, lang: 'en' },
        { kind: 'p', text: 'راجع صفحة الوظائف لكل شركة وصفحتها على LinkedIn قبل التقديم.' },
        { kind: 'h2', text: 'أين تقدّم؟', id: 'apply' },
        { kind: 'list', items: AR.whereToApply },
        { kind: 'h2', text: 'أسئلة المقابلة بإجابات نموذجية', id: 'interview' },
        {
          kind: 'p',
          text: [
            `جمعنا ${arCount(QUESTIONS.length, NOUNS.question)} مما تسأله مراكز الاتصال. في صفحة كل سؤال: ماذا يقيس السؤال حقًا، وكيف تجيب، وإجابة نموذجية بالإنجليزية، وعبارات تستعملها، وأخطاء تتجنبها. `,
            { href: ROUTES.interview, label: 'كل الأسئلة في صفحة واحدة' },
            '.',
          ],
        },
        ...questionsByGroup((g) => AR.groups[g]),
        { kind: 'h2', text: 'كلمات المكالمات بالإنجليزية', id: 'vocabulary' },
        {
          kind: 'p',
          text: [
            `${arCount(VOCAB_WORDS.length, NOUNS.word)} في ${arCount(VOCAB_UNITS.length, NOUNS.unit)}، كل كلمة بمعناها بالعربية وتعريفها ومثال من مركز اتصال، وفي آخر كل وحدة نص قصير يجمع كلماتها. `,
            { href: ROUTES.vocabulary('ar'), label: 'كل الوحدات' },
            '.',
          ],
        },
        { kind: 'cards', items: VOCAB_UNITS.map((u) => unitCard(u, 'ar')) },
        { kind: 'h2', text: 'خطة خليل: من B1 إلى C1', id: 'plan' },
        {
          kind: 'list',
          items: LEVELS.map((l) => `${AR.levels[l.id].name} (${AR.levels[l.id].cefr}): ${AR.levels[l.id].goal}${l.status === 'planned' ? ' (قيد الإعداد)' : ''}`),
        },
        { kind: 'h2', text: 'أدوات مجانية تستعملها الخطة', id: 'tools' },
        { kind: 'list', items: FREE_TOOLS.map((t) => [{ href: t.url, label: t.name }]), lang: 'en' },
        {
          kind: 'cta',
          title: 'استعد في خليل يومًا بيوم',
          text: 'خطة يومية، وتسجيل صوتك ومقارنة محاولاتك، وأسئلة المقابلة، وبطاقات مراجعة للكلمات، واختبارات أسبوعية. مجانًا.',
          href: '/',
          label: 'افتح خليل',
        },
      ],
      jsonLd: [
        article({ origin, path, lang, headline: h1, description: 'دليل مجاني للعمل في مراكز الاتصال بالإنجليزية في مصر.', about: ['Call center jobs in Egypt', 'Call center interview'] }),
        breadcrumbs(crumbs, h1, path, origin),
      ],
    };
  }

  const crumbs = [{ href: ROUTES.home('en'), label: 'Home' }];
  const h1 = 'How to get an English call center job in Egypt';
  return {
    path,
    lang,
    section: 'callcenter',
    title: 'English Call Center Jobs in Egypt: Free Prep Plan & Interview Answers | Khalil',
    description: clip(
      `A free guide to English call center jobs in Egypt: how hiring works, rough salaries, ${QUESTIONS.length} interview questions with model answers and ${VOCAB_WORDS.length} call center words.`
    ),
    h1,
    crumb: 'Call center prep',
    lead: 'English call centers are one of the fastest ways into a job in Egypt for people who speak English. This guide explains how these companies hire, what they test, and how to prepare step by step from B1 to C1, for free.',
    crumbs,
    alternates,
    blocks: [
      { kind: 'h2', text: 'The hiring stages, and what each one checks', id: 'stages' },
      ...HIRING_STAGES.flatMap((stage, i): Block[] => [
        { kind: 'h3', text: `${i + 1}. ${stage.name}` },
        { kind: 'p', text: stage.what },
        { kind: 'p', text: 'What gets people rejected here:' },
        { kind: 'list', items: stage.traps },
      ]),
      { kind: 'h2', text: 'The numbers to beat', id: 'targets' },
      { kind: 'table', head: ['Measure', 'To get hired', 'To stand out', 'Note'], rows: TARGETS.map((t) => [t.name, t.hired, t.overqualified, t.note]) },
      { kind: 'h2', text: 'Rough monthly salaries (EGP)', id: 'salaries' },
      { kind: 'table', head: ['Level', 'Monthly salary', 'Note'], rows: SALARY_GUIDE.map((s) => [s.level, s.range, s.note]) },
      { kind: 'p', text: 'Rough figures from Egyptian job ads in 2026. Salaries change, so treat them as a guide, not a promise.', note: true },
      { kind: 'h2', text: 'Companies hiring for English accounts in Egypt', id: 'companies' },
      { kind: 'list', items: COMPANIES },
      { kind: 'p', text: 'Check each company’s careers page and LinkedIn page before you apply.' },
      { kind: 'h2', text: 'Where to apply', id: 'apply' },
      { kind: 'list', items: WHERE_TO_APPLY },
      { kind: 'h2', text: 'Interview questions with model answers', id: 'interview' },
      {
        kind: 'p',
        text: [
          `${QUESTIONS.length} questions call centers ask. Each page explains what the question really checks, how to answer, a model answer, phrases to reuse and mistakes to avoid. `,
          { href: ROUTES.interview, label: 'See all the questions on one page' },
          '.',
        ],
      },
      ...questionsByGroup(groupOf),
      { kind: 'h2', text: 'Call center vocabulary', id: 'vocabulary' },
      {
        kind: 'p',
        text: [
          `${VOCAB_WORDS.length} words in ${VOCAB_UNITS.length} units, each in the meaning it has on a call with a call center example, and a short text that uses the unit’s words. `,
          { href: ROUTES.vocabulary('en'), label: 'All the units' },
          '.',
        ],
      },
      { kind: 'cards', items: VOCAB_UNITS.map((u) => unitCard(u, 'en')) },
      { kind: 'h2', text: 'Khalil’s plan: from B1 to C1', id: 'plan' },
      { kind: 'list', items: LEVELS.map((l) => `${l.name} (${l.cefr}): ${l.goal}${l.status === 'planned' ? ' (coming soon)' : ''}`) },
      { kind: 'h2', text: 'Free tools the plan uses', id: 'tools' },
      { kind: 'list', items: FREE_TOOLS.map((t) => [{ href: t.url, label: t.name }, `: ${t.what}`]) },
      {
        kind: 'cta',
        title: 'Prepare in Khalil, day by day',
        text: 'A daily plan, voice recording with take comparison, the interview bank, flashcards for the words and weekly tests. Free.',
        href: '/',
        label: 'Open Khalil',
      },
    ],
    jsonLd: [
      article({ origin, path, lang, headline: h1, description: 'A free guide to English call center jobs in Egypt.', about: ['Call center jobs in Egypt', 'Call center interview'] }),
      breadcrumbs(crumbs, h1, path, origin),
    ],
  };
}

function interviewIndex(origin: string): Page {
  const path = ROUTES.interview;
  const crumbs = [
    { href: ROUTES.home('en'), label: 'Home' },
    { href: ROUTES.callCenter('en'), label: 'Call center prep' },
  ];
  const h1 = 'Call center interview questions and answers';
  return {
    path,
    lang: 'en',
    section: 'callcenter',
    title: `Call Center Interview Questions and Answers: ${QUESTIONS.length} with Model Answers | Khalil`,
    description: clip(
      `${QUESTIONS.length} call center interview questions (HR screening, behavioral, situational, tech support) with what each one checks, a model answer, phrases to reuse and mistakes to avoid.`
    ),
    h1,
    crumb: 'Interview questions',
    lead: 'What English call centers ask, what they are really checking, and a model answer to learn from. Adapt each answer to your own story: recruiters can hear a memorized one.',
    crumbs,
    blocks: [
      ...QUESTION_GROUPS.flatMap(({ id, name }): Block[] => {
        const list = QUESTIONS.filter((q) => q.group === id);
        return list.length ? [{ kind: 'h2', text: `${name} (${list.length})`, id }, { kind: 'cards', items: list.map((q) => questionCard(q, 'en')) }] : [];
      }),
      {
        kind: 'cta',
        title: 'Practice your answers out loud',
        text: 'In Khalil you get a random question drill, record your answer, check your pace and compare takes. Free.',
        href: '/',
        label: 'Open Khalil',
      },
    ],
    jsonLd: [
      itemList(origin, h1, QUESTIONS.map((q) => ({ href: ROUTES.question(q.id), label: q.q }))),
      breadcrumbs(crumbs, h1, path, origin),
    ],
  };
}

function questionPage(q: InterviewQuestion, origin: string): Page {
  const path = ROUTES.question(q.id);
  const crumbs = [
    { href: ROUTES.home('en'), label: 'Home' },
    { href: ROUTES.callCenter('en'), label: 'Call center prep' },
    { href: ROUTES.interview, label: 'Interview questions' },
  ];
  const others = QUESTIONS.filter((x) => x.group === q.group && x.id !== q.id).slice(0, 6);
  const description = clip(`${q.why} How to answer "${questionTitle(q)}" in a call center interview, with a model answer, phrases and mistakes to avoid.`);
  const blocks: Block[] = [
    { kind: 'p', text: `${groupOf(q.group)} question`, note: true },
    { kind: 'h2', text: 'What they are really checking' },
    { kind: 'p', text: q.why },
    { kind: 'h2', text: 'How to answer' },
    { kind: 'list', items: q.tips },
    { kind: 'h2', text: 'Model answer' },
    { kind: 'quote', text: q.answer },
    { kind: 'p', text: 'Learn the structure, then tell it with your own story. Don’t memorize it word for word.' },
    { kind: 'h2', text: 'Phrases to reuse' },
    { kind: 'list', items: q.phrases },
    { kind: 'h2', text: 'Mistakes to avoid' },
    { kind: 'list', items: q.mistakes },
    ...(q.tipAr ? [{ kind: 'p', text: q.tipAr, lang: 'ar', note: true } as Block] : []),
    {
      kind: 'cta',
      title: 'Practice this answer in Khalil',
      text: 'Record yourself, check your pace and pauses, and compare your takes until it sounds natural. Free.',
      href: '/',
      label: 'Open Khalil',
    },
    ...(others.length ? ([{ kind: 'h2', text: `More ${groupOf(q.group).toLowerCase()} questions` }, { kind: 'cards', items: others.map((x) => questionCard(x, 'en')) }] as Block[]) : []),
  ];
  return {
    path,
    lang: 'en',
    section: 'callcenter',
    title: `${questionTitle(q)}: Call Center Interview Answer | Khalil`,
    description,
    h1: q.q,
    crumb: questionTitle(q),
    lead: 'A call center interview question, with what it checks, how to answer it, and a model answer.',
    crumbs,
    blocks,
    ogType: 'article',
    jsonLd: [
      article({ origin, path, lang: 'en', headline: `${questionTitle(q)}: call center interview answer`, description, about: ['Call center interview', q.q] }),
      breadcrumbs(crumbs, q.q, path, origin),
    ],
  };
}

const POS_AR: Record<string, string> = {
  noun: 'اسم',
  verb: 'فعل',
  adjective: 'صفة',
  adverb: 'ظرف',
  'phrasal verb': 'فعل مركّب',
  idiom: 'تعبير اصطلاحي',
  phrase: 'عبارة',
};

const VOCAB_ALTERNATES = { ar: ROUTES.vocabulary('ar'), en: ROUTES.vocabulary('en'), 'x-default': ROUTES.vocabulary('en') };
const unitAlternates = (unit: VocabUnit) => ({
  ar: ROUTES.vocabularyUnit('ar', unitSlug(unit)),
  en: ROUTES.vocabularyUnit('en', unitSlug(unit)),
  'x-default': ROUTES.vocabularyUnit('en', unitSlug(unit)),
});

function vocabularyIndex(lang: Lang, origin: string): Page {
  const path = ROUTES.vocabulary(lang);
  const units = VOCAB_UNITS.map((u) => ({ href: ROUTES.vocabularyUnit(lang, unitSlug(u)), label: lang === 'ar' ? UNIT_TITLES_AR[u.id] : u.title }));
  const cta = (title: string, text: string, label: string): Block => ({ kind: 'cta', title, text, href: '/', label });

  if (lang === 'ar') {
    const crumbs = [
      { href: ROUTES.home('ar'), label: 'الرئيسية' },
      { href: ROUTES.callCenter('ar'), label: 'مراكز الاتصال' },
    ];
    const h1 = 'كلمات مراكز الاتصال بالإنجليزية ومعانيها بالعربية';
    return {
      path,
      lang,
      section: 'callcenter',
      title: `كلمات إنجليزية لمراكز الاتصال بمعانيها بالعربية: ${arCount(VOCAB_WORDS.length, NOUNS.word)} | خليل`,
      description: clip(
        `${arCount(VOCAB_WORDS.length, NOUNS.word)} بالإنجليزية لمن يعمل في مراكز الاتصال (الكول سنتر)، في ${arCount(VOCAB_UNITS.length, NOUNS.unit)}: خدمة العملاء، والدعم الفني، والفواتير، والتحقق، ومراحل المكالمة. كل كلمة بمعناها بالعربية ومثال.`,
        200
      ),
      h1,
      crumb: 'الكلمات',
      lead: 'وحدة كل يوم، فتتم الكلمات كلها في شهر. لكل كلمة معناها في المكالمة بالعربية، وتعريفها بالإنجليزية، ومثال من مركز اتصال، وفي آخر كل وحدة نص قصير يجمع كلماتها.',
      crumbs,
      alternates: VOCAB_ALTERNATES,
      blocks: [
        { kind: 'cards', items: VOCAB_UNITS.map((u) => unitCard(u, 'ar')) },
        cta('احفظها ببطاقات المراجعة', 'في خليل تدخل كل وحدة إلى بطاقات مراجعة ذكية تذكّرك بموعد المراجعة، ولكل نص زر للاستماع إليه. مجانًا.', 'افتح خليل'),
      ],
      jsonLd: [itemList(origin, h1, units), breadcrumbs(crumbs, h1, path, origin)],
    };
  }

  const crumbs = [
    { href: ROUTES.home('en'), label: 'Home' },
    { href: ROUTES.callCenter('en'), label: 'Call center prep' },
  ];
  const h1 = 'Call center vocabulary: English words for customer service and tech support';
  return {
    path,
    lang,
    section: 'callcenter',
    title: `Call Center Vocabulary: ${VOCAB_WORDS.length} English Words in ${VOCAB_UNITS.length} Units | Khalil`,
    description: clip(
      `${VOCAB_WORDS.length} call center English words in ${VOCAB_UNITS.length} short units: customer service, tech support, billing, verification and the call flow. Each word with its meaning on a call and an example.`
    ),
    h1,
    crumb: 'Vocabulary',
    lead: 'One unit a day, and the whole word bank is yours in a month. Every word has the meaning it has on a call and a call center example, and every unit ends with a short text that uses its words.',
    crumbs,
    alternates: VOCAB_ALTERNATES,
    blocks: [
      { kind: 'cards', items: VOCAB_UNITS.map((u) => unitCard(u, 'en')) },
      cta('Learn them with flashcards', 'In Khalil every unit goes into smart flashcards that remind you when to review, and each text has a read-aloud bar. Free.', 'Open Khalil'),
    ],
    jsonLd: [itemList(origin, h1, units), breadcrumbs(crumbs, h1, path, origin)],
  };
}

function unitPage(unit: VocabUnit, lang: Lang, origin: string): Page {
  const path = ROUTES.vocabularyUnit(lang, unitSlug(unit));
  const ar = lang === 'ar';
  const name = ar ? UNIT_TITLES_AR[unit.id] : unit.title;
  const crumbs = ar
    ? [
        { href: ROUTES.home('ar'), label: 'الرئيسية' },
        { href: ROUTES.callCenter('ar'), label: 'مراكز الاتصال' },
        { href: ROUTES.vocabulary('ar'), label: 'الكلمات' },
      ]
    : [
        { href: ROUTES.home('en'), label: 'Home' },
        { href: ROUTES.callCenter('en'), label: 'Call center prep' },
        { href: ROUTES.vocabulary('en'), label: 'Vocabulary' },
      ];
  const prev = VOCAB_UNITS.find((u) => u.number === unit.number - 1);
  const next = VOCAB_UNITS.find((u) => u.number === unit.number + 1);
  const first = unit.words.slice(0, 6).map((w) => w.word);
  const h1 = ar ? `كلمات مراكز الاتصال بالإنجليزية: ${name}` : `Call center vocabulary: ${unit.title}`;
  const description = ar
    ? clip(`${arCount(unit.words.length, NOUNS.word)} بالإنجليزية عن «${name}» في مراكز الاتصال، كل كلمة بمعناها بالعربية وتعريفها ومثال من مكالمة: ${first.join('، ')}…`)
    : clip(`${unit.words.length} call center English words for ${unit.title.toLowerCase()} (unit ${unit.number} of ${VOCAB_UNITS.length}): ${first.join(', ')} and more, each with its meaning on a call and an example.`);
  const words = unit.words.map((w) => ({
    word: w.word,
    pos: ar ? POS_AR[w.pos] : w.pos,
    definition: w.definition,
    example: w.example,
    meaning: ar ? MEANINGS_AR[w.word] : undefined,
  }));
  const neighbors = [prev, next]
    .filter((u): u is VocabUnit => Boolean(u))
    .map((u) => ({ ...unitCard(u, lang), meta: u.number < unit.number ? (ar ? 'الوحدة السابقة' : 'Previous unit') : ar ? 'الوحدة التالية' : 'Next unit' }));
  return {
    path,
    lang,
    section: 'callcenter',
    title: ar ? `كلمات مراكز الاتصال: ${name} بالإنجليزية ومعانيها | خليل` : `Call Center Vocabulary: ${unit.title} (${unit.words.length} Words) | Khalil`,
    description,
    h1,
    crumb: name,
    lead: ar
      ? `الوحدة ${unit.number} من ${VOCAB_UNITS.length}: ${arCount(unit.words.length, NOUNS.word)}، لكل كلمة معناها في المكالمة بالعربية، وتعريفها بالإنجليزية، ومثال من مركز اتصال.`
      : `Unit ${unit.number} of ${VOCAB_UNITS.length}: ${unit.words.length} words, each in the meaning it has on a call, with a call center example.`,
    crumbs,
    alternates: unitAlternates(unit),
    blocks: [
      { kind: 'words', items: words, lang: ar ? 'en' : undefined },
      { kind: 'h2', text: ar ? 'اقرأه بصوت مرتفع' : 'Read it aloud' },
      {
        kind: 'p',
        text: ar ? 'يجمع هذا النص القصير كلمات الوحدة. اقرأه بصوت مرتفع مرتين، ثم أعد حكايته بكلماتك.' : 'This short text uses the unit’s words. Read it aloud twice, then retell it in your own words.',
      },
      { kind: 'quote', text: unit.text, lang: ar ? 'en' : undefined },
      ar
        ? { kind: 'cta', title: 'احفظ هذه الوحدة ببطاقات المراجعة', text: 'يضع خليل هذه الكلمات في بطاقات مراجعة ذكية ويذكّرك بموعد مراجعتها. مجانًا، ويعمل دون إنترنت.', href: '/', label: 'افتح خليل' }
        : { kind: 'cta', title: 'Learn this unit with flashcards', text: 'Khalil puts these words into smart flashcards and reminds you when it’s time to review. Free, and it works offline.', href: '/', label: 'Open Khalil' },
      { kind: 'cards', items: neighbors },
    ],
    ogType: 'article',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'DefinedTermSet',
        name: h1,
        description,
        url: `${origin}${path}`,
        inLanguage: lang,
        hasDefinedTerm: unit.words.map((w) => ({
          '@type': 'DefinedTerm',
          name: w.word,
          description: ar ? `${MEANINGS_AR[w.word]}: ${w.definition}` : w.definition,
          inLanguage: 'en',
        })),
      },
      breadcrumbs(crumbs, name, path, origin),
    ],
  };
}

export function callCenterPages(origin: string): Page[] {
  return [
    hubPage('ar', origin),
    hubPage('en', origin),
    interviewIndex(origin),
    ...QUESTIONS.map((q) => questionPage(q, origin)),
    vocabularyIndex('ar', origin),
    vocabularyIndex('en', origin),
    ...VOCAB_UNITS.flatMap((u) => [unitPage(u, 'ar', origin), unitPage(u, 'en', origin)]),
  ];
}
