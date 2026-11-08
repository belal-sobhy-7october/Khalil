/**
 * The plan's own days: the first day (Level 0) and what each level exam uses
 * (a role-play and a speaking task), plus the daily notebook prompts.
 */
import type { SalesLesson, SalesRoleplay, SpeakPrompt } from './types';

export const START_LESSON: SalesLesson = {
  id: 'start-here',
  title: 'ابدأ هنا: كيف تسير الخطة',
  summary: 'كل يوم من ساعة إلى ساعة ونصف: درس صغير، وشيء تستمع إليه، وتمرين، وكلام بصوت عالٍ، وسطران في دفترك. كل شيء مسجل هنا.',
  points: [
    { title: 'ركّز على اليوم فقط', text: 'افتح تبويب «اليوم» وأنجز مهامه. الخطة كلها في «الخريطة» إن أحببت أن تنظر إليها، لكنك لا تحتاج أن تحمل همّها.' },
    { title: 'المعرفة أولًا، بالعربية', text: 'المستويان 1 و2 بالعربية: أساسيات المبيعات، والسوق والتسويق والتفاوض، ومعها 4 كتب معرفة (فصل كل يوم). والمستوى 3 هو المهارات نفسها بالإنجليزية. أما بيع الأجهزة ففي تبويب «إضافي» خارج الخطة.' },
    { title: 'لكل أسبوع هيكل ثابت', text: '5 أيام تعلّم وتمرين، ويوم سادس للمراجعة والاختبار. وفي نهاية كل مستوى امتحان وتمثيل أدوار كامل.' },
    { title: 'المعرفة جزء من اليوم', text: 'في أغلب الأيام ستجد مهمة «فصل معرفة»: أفكار حقيقية في المبيعات والتفاوض والتسويق وعلم نفس القرار، تنفعك في الحياة وفي أي عمل. 10 دقائق، وأسئلتها في الاختبار.' },
    { title: 'المبيعات تُتعلَّم بالكلام', text: 'القراءة وحدها لن تجعلك بائعًا. تمثيل الأدوار مع الذكاء الاصطناعي والمهمات في الحياة الحقيقية هي ما يُحدث الفرق، فلا تتركها.' },
  ],
  mistakes: ['أن تقرأ الدروس وتفوّت تمثيل الأدوار والكلام بصوت عالٍ.', 'أن تحاول إنهاء أسبوع في يوم فتُنهك.'],
  check: [
    { q: 'ما أكثر شيء يجعلك بائعًا؟', options: ['قراءة دروس كثيرة', 'التمرين بالكلام وتمثيل الأدوار والمهمات', 'حفظ التعريفات', 'مشاهدة المقاطع فقط'], answer: 1 },
    { q: 'بأي لغة المستوى الثالث؟', options: ['العربية', 'الإنجليزية', 'نصفه بهذه ونصفه بتلك', 'الفرنسية'], answer: 1 },
  ],
};

export const BASELINE_SPEAK: SpeakPrompt = {
  id: 'baseline-pitch',
  title: 'تسجيل البداية: بِعني هذا القلم',
  prompt: 'أمسك أي قلم وبِعه لي في دقيقة، بالعربية، كما تحب، ومن غير تحضير. هذا تسجيل «قبل»: ستستمع إليه مرة أخرى في نهاية المستوى الأول وترى الفرق.',
  seconds: 60,
  structure: ['قل ما يخطر ببالك', 'لا تتوقف إن ارتبكت', 'نزّل التسجيل واحتفظ به'],
};

/** A full sale for each level exam, from the first hello to the next step. */
export const EXAM_ROLEPLAYS: SalesRoleplay[] = [
  {
    id: 'exam-s1-full-sale',
    title: 'امتحان المستوى 1: صفقة كاملة',
    youSell: 'اشتراك سنة في نادي «فِت هاوس» الرياضي بـ 6000 جنيه (أو 600 في الشهر).',
    persona: 'موظف في الثامنة والعشرين، يريد أن تتحسن لياقته لكنه يشك في نفسه وفي السعر.',
    situation: 'اشترك من قبل وتوقف بعد شهر لأن المواعيد لم تكن مناسبة. سيقول «غالٍ» و«سأفكر».',
    goal: 'صفقة كاملة: افتتاح، وأسئلة SPIN، وعرض بالـ FAB، ورد على الاعتراضات بـ LAER، ثم إغلاق أو خطوة تالية بموعد.',
    steps: [
      'افتتاح فيه اسم وهدف واستئذان',
      'سؤالان مفتوحان على الأقل قبل العرض',
      'سؤال أثر (Implication)',
      'لخّصت كلامه قبل العرض',
      'كل ميزة معها «وهذا يعني بالنسبة إليك»',
      'رددت على «غالٍ» بسؤال قبل الرد',
      'رددت على «سأفكر» وعرفت السبب',
      'طلبت القرار بوضوح ثم سكتّ',
    ],
    twist: 'في النهاية يقول: «حسنًا، إن خفضت 1000 وقّعت الآن».',
  },
  {
    id: 'exam-s2-cold-to-close',
    title: 'امتحان المستوى 2: من مكالمة باردة إلى صفقة',
    youSell: 'نظام كاشير ومخزون لمتاجر الملابس اسمه «ستور برو» بـ 900 جنيه في الشهر.',
    persona: 'صاحبة متجرين للملابس، مشغولة، أول رد منها «لست متفرغة»، وتفاوض بشدة.',
    situation: 'تحسب المخزون بيدها وتخسر مقاسات تنفد من غير أن تعرف. وقد عرض عليها غيرك 700.',
    goal: 'أن تتجاوز الصد، وتجري الاكتشاف، وتعرض، وتتفاوض بـ «خذ وأعطِ» من غير أن تنزل عن 800، ثم تُغلق أو تحجز خطوة تالية.',
    steps: [
      'افتتاح بارد جيد وتجاوزت «لست متفرغة»',
      'سؤال مشكلة وسؤال أثر',
      'قيمة بالأرقام (المقاسات التي تنفد)',
      'رددت على «غيرك أرخص» من غير هجوم',
      'كل تنازل يقابله طلب',
      'أغلقت أو حجزت خطوة بموعد',
      'كنت صادقًا في كل الشروط',
    ],
    twist: 'في منتصف الحديث تقول: «أرسل لي العرض على واتساب وانتهى الأمر».',
  },
  {
    id: 'exam-s3-english-sale',
    title: 'Level 3 exam: a full sales call in English',
    youSell: 'ClinicPro, online booking and reminders for clinics, $150 a month.',
    persona: 'James, owner of a physiotherapy clinic in Manchester. Polite, busy, a bit skeptical, normal-speed British English.',
    situation: 'About 6 no-shows a week. He thinks software is expensive and that his receptionist manages fine.',
    goal: 'Open, discover with SPIN, pitch with benefits, handle two objections, close with a summary close and confirm next steps.',
    steps: [
      'Permission-based opener',
      'Open and SPIN questions, including an implication question',
      'Recap in his words',
      "Benefits with 'which means that'",
      "Handled 'too expensive' with ROI",
      'Handled "my receptionist manages fine" without arguing',
      'Summary close, then silence',
      'Next steps with dates',
    ],
    twist: 'He asks you to repeat something because of your accent: stay calm and slow down.',
  },
];

/** A speaking task for each level exam. */
export const EXAM_SPEAKING: SpeakPrompt[] = [
  {
    id: 'exam-s1-pen-again',
    title: 'بِعني هذا القلم (مرة أخرى)',
    prompt: 'تسجيل اليوم الأول نفسه: بِعني هذا القلم في دقيقة. هذه المرة بالأسئلة أولًا، ثم الفوائد، ثم الإغلاق. وبعد ذلك استمع إلى تسجيل اليوم الأول.',
    seconds: 60,
    structure: ['سؤالان', 'فائدتان مرتبطتان', 'سؤال إغلاق'],
    compareWith: 'baseline-pitch',
  },
  {
    id: 'exam-s2-my-numbers-pitch',
    title: 'Pitch لنفسك أمام مدير مبيعات',
    prompt: 'سوّق نفسك لمدير مبيعات في 90 ثانية: من أنت، وماذا تعلمت، وأرقامك (أيام، وتمارين تمثيل أدوار، ومكالمات)، ولماذا تصلح للبيع عبر الهاتف.',
    seconds: 90,
    structure: ['من أنت', 'ماذا تعلمت بالأرقام', 'مثال من تمثيل الأدوار أو مهمة', 'لماذا تصلح'],
  },
  {
    id: 'exam-s3-english-pitch',
    title: 'Your English pitch and story',
    prompt: 'In English: your 30-second product pitch, then answer "Why should we hire you for this SDR role?" in one minute.',
    seconds: 90,
    structure: ['The pitch (30 seconds)', 'Why you (STAR story)', 'Close: what you will bring in your first 90 days'],
  },
];

/** The notebook line for a study day (by day number, 1–5), in the week's language. */
export const JOURNAL_PROMPTS = {
  ar: [
    'ما أهم فكرة تعلمتها اليوم؟ ومتى ستجربها ومع من؟',
    'ما أصعب شيء في تمثيل الأدوار اليوم؟ لو أعدته، فماذا ستقول بشكل مختلف؟',
    'ما الجملة الواحدة التي سمعتها أو تعلمتها اليوم وستستخدمها كثيرًا؟ اكتبها بكلماتك.',
    'ماذا علّمتك مهمة اليوم عن الناس؟',
    'قارن نفسك بأول يوم في الأسبوع: ما الذي صار أسهل؟',
  ],
  en: [
    'What is the one idea from today you will use? Write it in English, then in Arabic if you need to.',
    'What was hard in today\'s role-play? What will you say differently next time?',
    'One English phrase from today you want to own. Write three sentences with it.',
    'What did today\'s mission teach you about people, or about your English?',
    'What is easier now than on day 1 of this week?',
  ],
} as const;
