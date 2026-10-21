/**
 * The plan's own days: the first day (Level 0) and what each level exam uses
 * (a role-play and a speaking task), plus the daily notebook prompts.
 */
import type { SalesLesson, SalesRoleplay, SpeakPrompt } from './types';

export const START_LESSON: SalesLesson = {
  id: 'start-here',
  title: 'ابدأ هنا: الخطة ماشية إزاي',
  summary: 'كل يوم ساعة لساعة ونص: درس صغير، حاجة تسمعها، تمرين، كلام بصوت عالي، وسطرين في دفترك. كل حاجة متسجلة هنا.',
  points: [
    { title: 'ركّز على النهارده بس', text: 'افتح تبويب «النهارده» وخلّص مهامه. الخطة كلها في «الخريطة» لو حبيت تبص، بس مش محتاج تشيل همها.' },
    { title: 'عربي الأول، وبعدين إنجليزي', text: 'المستوى 1 و 2 بالعربي (الأساسيات، وبعدين السوق والشغلانة). المستوى 3 نفس المهارات بالإنجليزي.' },
    { title: 'كل أسبوع ليه شكل ثابت', text: '5 أيام تعلم وتمرين، ويوم سادس مراجعة وكويز. في آخر كل مستوى امتحان ورول بلاي كامل.' },
    { title: 'السيلز بيتعلم بالكلام', text: 'القراية لوحدها مش هتعملك بياع. الرول بلاي مع الـ AI والمهمات في الحياة الحقيقية هي اللي بتفرق، فمتسيبهاش.' },
  ],
  mistakes: ['تقرا الدروس وتفوّت الرول بلاي والكلام بصوت عالي.', 'تحاول تخلص أسبوع في يوم وتتحرق.'],
  check: [
    { q: 'إيه أكتر حاجة بتعملك بياع؟', options: ['قراية دروس كتير', 'التمرين بالكلام والرول بلاي والمهمات', 'حفظ التعريفات', 'مشاهدة فيديوهات بس'], answer: 1 },
    { q: 'المستوى التالت بأنهي لغة؟', options: ['عربي', 'إنجليزي', 'الاتنين بالنص', 'فرنساوي'], answer: 1 },
  ],
};

export const BASELINE_SPEAK: SpeakPrompt = {
  id: 'baseline-pitch',
  title: 'تسجيل البداية: بيعلي القلم ده',
  prompt: 'امسك أي قلم وبيعه لي في دقيقة، بالعربي، زي ما تحب، من غير تحضير. ده تسجيل «قبل»: هتسمعه تاني في آخر المستوى الأول وتشوف الفرق.',
  seconds: 60,
  structure: ['قول اللي ييجي في دماغك', 'متوقفش لو اتلخبطت', 'نزّل التسجيل واحتفظ بيه'],
};

/** A full sale for each level exam, from the first hello to the next step. */
export const EXAM_ROLEPLAYS: SalesRoleplay[] = [
  {
    id: 'exam-s1-full-sale',
    title: 'امتحان المستوى 1: بيعة كاملة',
    youSell: 'اشتراك سنة في جيم «فِت هاوس» بـ 6000 جنيه (أو 600 في الشهر).',
    persona: 'موظف 28 سنة، عاوز يبقى لياقته أحسن بس شاكك في نفسه وفي السعر.',
    situation: 'اشترك قبل كده ووقف بعد شهر لأن المواعيد مكانتش مناسبة. هيقول «غالي» و«هفكر».',
    goal: 'بيعة كاملة: افتتاح، أسئلة SPIN، عرض بالـ FAB، رد على الاعتراضات بـ LAER، وقفل أو خطوة جاية بميعاد.',
    steps: [
      'افتتاح فيه اسم وهدف واستئذان',
      'سؤالين مفتوحين على الأقل قبل العرض',
      'سؤال تأثير (Implication)',
      'لخّصت كلامه قبل العرض',
      'كل ميزة معاها «وده معناه بالنسبالك»',
      'رديت على «غالي» بسؤال قبل الرد',
      'رديت على «هفكر» وعرفت السبب',
      'طلبت القرار بوضوح وسكت',
    ],
    twist: 'في الآخر يقول: «طب لو نزلت 1000 أمضي دلوقتي».',
  },
  {
    id: 'exam-s2-cold-to-close',
    title: 'امتحان المستوى 2: من مكالمة باردة لصفقة',
    youSell: 'نظام كاشير ومخزون لمحلات الملابس اسمه «ستور برو» بـ 900 جنيه في الشهر.',
    persona: 'صاحبة محلين هدوم، مشغولة، أول رد «مش فاضية»، بتفاوض جامد.',
    situation: 'المخزون بيتحسب على إيدها وبتخسر مقاسات بتخلص من غير ما تعرف. حد تاني عرض عليها 700.',
    goal: 'تعدي الصد، تعمل اكتشاف، تعرض، تتفاوض بـ خد وهات من غير ما تنزل تحت 800، وتقفل أو تحجز خطوة جاية.',
    steps: [
      'افتتاح بارد كويس وعديت «مش فاضية»',
      'سؤال مشكلة وسؤال تأثير',
      'قيمة بالأرقام (المقاسات اللي بتخلص)',
      'رديت على «حد تاني أرخص» من غير هجوم',
      'كل تنازل قصاده طلب',
      'قفلت أو حجزت خطوة بميعاد',
      'كنت صادق في كل الشروط',
    ],
    twist: 'في النص تقول: «ابعتلي العرض على الواتساب وخلاص».',
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
    title: 'بيعلي القلم ده (تاني)',
    prompt: 'نفس تسجيل أول يوم: بيعلي القلم ده في دقيقة. المرة دي بأسئلة الأول، وفوايد، وقفل. وبعدين اسمع تسجيل أول يوم.',
    seconds: 60,
    structure: ['سؤالين', 'فايدتين مربوطين', 'سؤال قفل'],
  },
  {
    id: 'exam-s2-my-numbers-pitch',
    title: 'Pitch لنفسك لمدير سيلز',
    prompt: 'بيع نفسك لمدير مبيعات في 90 ثانية: مين انت، اتعلمت إيه، أرقامك (أيام، رول بلاي، مكالمات)، وليه تنفع في التيلي سيلز.',
    seconds: 90,
    structure: ['مين انت', 'اتعلمت إيه بالأرقام', 'مثال من رول بلاي أو مهمة', 'ليه تنفع'],
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
    'إيه أهم فكرة اتعلمتها النهارده؟ وهتجربها إمتى ومع مين؟',
    'إيه أصعب حاجة في الرول بلاي النهارده؟ لو هتعيده، هتقول إيه مختلف؟',
    'جملة واحدة سمعتها أو اتعلمتها النهارده هتستخدمها كتير؟ اكتبها بكلامك.',
    'المهمة النهارده علمتك إيه عن الناس؟',
    'قارن نفسك بأول يوم في الأسبوع: إيه اللي بقى أسهل؟',
  ],
  en: [
    'What is the one idea from today you will use? Write it in English, then in Arabic if you need to.',
    'What was hard in today\'s role-play? What will you say differently next time?',
    'One English phrase from today you want to own. Write three sentences with it.',
    'What did today\'s mission teach you about people, or about your English?',
    'What is easier now than on day 1 of this week?',
  ],
} as const;
