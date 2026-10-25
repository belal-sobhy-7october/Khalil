/** The two home pages (Arabic and English): what Khalil is, and its free lessons. */
import { TOPIC_PACKS } from '../../data/topicPacks';
import { QUESTIONS, VOCAB_WORDS } from '../../data/callCenter';
import { ALL_CHAPTERS, KNOWLEDGE } from '../../data/sales/knowledge';
import { arCount, NOUNS } from '../arabicCount';
import type { Page } from '../render';
import { ROUTES } from '../routes';
import { webApplication, website } from '../schema';

const HOME_ALTERNATES = { ar: '/ar', en: '/en', 'x-default': '/' } as const;

export function homePages(origin: string): Page[] {
  const topics = TOPIC_PACKS.length;
  const words = VOCAB_WORDS.length;
  const questions = QUESTIONS.length;
  const chapters = ALL_CHAPTERS.length;

  const arFeatures = [
    'مسار التعلم: يبدأ من مستواك (من A1 إلى C1)، ويعطيك كل يوم قليلًا من كل مهارة: المفردات، والنطق، والاستماع، والقراءة، والقواعد، والتظليل (Shadowing). وتختار مدة كل فقرة بنفسك.',
    'بطاقات مراجعة ذكية: تراجع كل كلمة في الوقت المناسب بخوارزمية FSRS التي يستخدمها Anki، ويذكّرك خليل بموعد المراجعة.',
    `مكتبة المواضيع: ${arCount(topics, NOUNS.lesson)} للمحادثة، في كل درس 12 كلمة بمعناها في الموضوع ومثال، وقاعدة نحوية، وأسئلة نقاش، ومهمة كلام مدتها دقيقة.`,
    `الاستعداد لمراكز الاتصال: خطة من B1 إلى C1، و${arCount(words, NOUNS.word)}، و${arCount(questions, NOUNS.question)} من أسئلة المقابلات بإجابات نموذجية، ورسائل صوتية واختبارات.`,
    `تعلّم المبيعات: المبيعات والتسويق والتفاوض وعلم نفس القرار من الصفر، في ${arCount(KNOWLEDGE.length, NOUNS.book)} و${arCount(chapters, NOUNS.chapter)} بالعربية، ثم بالإنجليزية.`,
    'المهام والعادات: تركيز اليوم، ومهام اليوم والأسبوع، وتتبع العادات، والورد اليومي (الصلوات والقرآن والأذكار).',
    'مؤقت التركيز، والتقويم، والإشارات المرجعية، وإحصاءات تريك تقدّمك.',
  ];

  const enFeatures = [
    'Learning Path: starts at your level (A1 to C1) and gives you a little of every skill each day: vocabulary, pronunciation, listening, reading, grammar and shadowing. You choose how long each part takes.',
    'Smart flashcards: review every word at the right moment with FSRS, the algorithm Anki uses, with review reminders.',
    `Topic Library: ${topics} conversation lessons, each with 12 words in the meaning they have in the topic, an example, a grammar point, discussion questions and a one-minute speaking task.`,
    `Call Center Prep: a plan from B1 to C1, ${words} call center words, ${questions} interview questions with model answers, voice notes and tests.`,
    `Sales Prep: sales, marketing, negotiation and the psychology of decisions from zero, in ${KNOWLEDGE.length} short books (${chapters} chapters) in Arabic, then in English.`,
    'Tasks and habits: a daily focus, today’s and this week’s tasks, habit tracking and the daily wird (prayers, Quran and adhkar).',
    'A focus timer, a calendar, bookmarks and analytics that show your progress.',
  ];

  const arDescription = `تطبيق مجاني بالعربية والإنجليزية: مسار يومي لتعلم الإنجليزية من A1 إلى C1، وبطاقات مراجعة ذكية، و${arCount(topics, NOUNS.topic)} للمحادثة، واستعداد لوظائف مراكز الاتصال والمبيعات. ويعمل دون إنترنت.`;
  const enDescription = `A free app in Arabic and English: a daily English path from A1 to C1, smart flashcards, ${topics} conversation topics, call center and sales prep, tasks and habits. Works offline.`;

  const ar: Page = {
    path: ROUTES.home('ar'),
    lang: 'ar',
    section: 'home',
    title: 'خليل | تعلّم الإنجليزية مجانًا ونظّم يومك وعاداتك',
    description: arDescription,
    h1: 'خليل: تعلّم الإنجليزية والمهارات، ونظّم يومك، مجانًا',
    lead: 'خليل رفيق يومي بالعربية والإنجليزية: يعطيك كل يوم قليلًا من كل مهارة في الإنجليزية، ويعدّك لوظيفة، وينظّم مهامك وعاداتك وورْدك. مجاني، ويعمل في المتصفح على الهاتف والحاسوب، حتى دون إنترنت.',
    crumbs: [],
    alternates: HOME_ALTERNATES,
    blocks: [
      { kind: 'cta', title: 'ابدأ الآن مجانًا', text: 'سجّل الدخول بحساب Google، فتُحفظ بياناتك في حسابك وتجدها على كل أجهزتك.', href: '/', label: 'افتح خليل' },
      { kind: 'h2', text: 'ماذا تجد في خليل؟' },
      { kind: 'list', items: arFeatures },
      { kind: 'h2', text: 'دروس مجانية تقرؤها الآن دون تسجيل' },
      {
        kind: 'cards',
        items: [
          { href: ROUTES.topics('ar'), title: 'مواضيع المحادثة بالإنجليزية', meta: `${arCount(topics, NOUNS.lesson)} · من B1 إلى C1`, text: 'كلمات كل موضوع بمعانيها وأمثلتها، وقاعدة نحوية، وأسئلة نقاش، ومهمة كلام.' },
          { href: ROUTES.callCenter('ar'), title: 'الاستعداد لوظيفة في مركز اتصال', meta: `${arCount(questions, NOUNS.question)} · ${arCount(words, NOUNS.word)}`, text: 'مراحل التوظيف في مصر، وأسئلة المقابلة بإجابات نموذجية، وكلمات المكالمات.' },
          { href: ROUTES.sales, title: 'تعلّم المبيعات والتسويق والتفاوض', meta: `${arCount(chapters, NOUNS.chapter)} بالعربية`, text: 'لماذا يشتري الناس، وكيف تُبنى الثقة، وكيف تفاوض وتسوّق، بأمثلة من الحياة.' },
        ],
      },
      { kind: 'h2', text: 'أسئلة شائعة' },
      { kind: 'h3', text: 'هل خليل مجاني؟' },
      { kind: 'p', text: 'نعم، كل ما فيه مجاني، ويكفيك حساب Google لتسجيل الدخول.' },
      { kind: 'h3', text: 'هل يعمل دون إنترنت؟' },
      { kind: 'p', text: 'نعم. بعد أول فتح يحفظ خليل نفسه على جهازك، فيفتح وتستطيع مذاكرة المواضيع حتى دون إنترنت.' },
      { kind: 'h3', text: 'هل أحتاج إلى تثبيت تطبيق؟' },
      { kind: 'p', text: 'لا. يعمل خليل في المتصفح على الهاتف والحاسوب، ويمكنك إضافته إلى الشاشة الرئيسية ليفتح كأنه تطبيق.' },
      { kind: 'h3', text: 'بأي لغة يعمل؟' },
      { kind: 'p', text: 'بالعربية والإنجليزية، وتختار اللغة من الإعدادات. وكل ما فيه مكتوب بالفصحى.' },
      { kind: 'h3', text: 'من أين أبدأ في تعلم الإنجليزية؟' },
      { kind: 'p', text: ['افتح مسار التعلم في خليل واختر مستواك، أو ابدأ الآن بموضوع من ', { href: ROUTES.topics('ar'), label: 'مكتبة المواضيع' }, ' يناسب يومك.'] },
    ],
    jsonLd: [website(origin), webApplication(origin, 'ar', arDescription, arFeatures)],
  };

  const en: Page = {
    path: ROUTES.home('en'),
    lang: 'en',
    section: 'home',
    title: 'Khalil: Learn English for Free, Plan Your Day and Habits',
    description: enDescription,
    h1: 'Khalil: learn English and new skills, and plan your day, for free',
    lead: 'Khalil is a daily companion in Arabic and English. It gives you a little of every English skill each day, prepares you for a job, and organizes your tasks, habits and wird. It’s free and runs in the browser on your phone or computer, even offline.',
    crumbs: [],
    alternates: HOME_ALTERNATES,
    blocks: [
      { kind: 'cta', title: 'Start now, for free', text: 'Sign in with Google: your data is saved to your account, so you find it on all your devices.', href: '/', label: 'Open Khalil' },
      { kind: 'h2', text: 'What’s in Khalil?' },
      { kind: 'list', items: enFeatures },
      { kind: 'h2', text: 'Free lessons you can read now, no sign-in needed' },
      {
        kind: 'cards',
        items: [
          { href: ROUTES.topics('en'), title: 'English conversation topics', meta: `${topics} lessons · B1 to C1`, text: 'Words with meanings and examples, a grammar point, discussion questions and a speaking task.' },
          { href: ROUTES.callCenter('en'), title: 'Call center job prep', meta: `${questions} interview questions · ${words} words`, text: 'How English call centers in Egypt hire, interview questions with model answers, and call vocabulary.' },
          { href: ROUTES.sales, title: 'Sales, marketing and negotiation (Arabic)', meta: `${chapters} chapters in Arabic`, text: 'Why people buy, how trust is built, and how to negotiate and market, with real-life examples.', lang: 'en' },
        ],
      },
      { kind: 'h2', text: 'Questions people ask' },
      { kind: 'h3', text: 'Is Khalil free?' },
      { kind: 'p', text: 'Yes, everything in it is free. You only need a Google account to sign in.' },
      { kind: 'h3', text: 'Does it work offline?' },
      { kind: 'p', text: 'Yes. After the first visit, Khalil saves itself on your device, so it opens and you can study the topics with no internet.' },
      { kind: 'h3', text: 'Do I need to install an app?' },
      { kind: 'p', text: 'No. Khalil runs in the browser on phones and computers, and you can add it to your home screen so it opens like an app.' },
      { kind: 'h3', text: 'Which languages does it support?' },
      { kind: 'p', text: 'Arabic and English; you pick the language in Settings.' },
      { kind: 'h3', text: 'Where do I start learning English?' },
      { kind: 'p', text: ['Open the Learning Path in Khalil and choose your level, or start right now with a lesson from the ', { href: ROUTES.topics('en'), label: 'Topic Library' }, '.'] },
    ],
    jsonLd: [website(origin), webApplication(origin, 'en', enDescription, enFeatures)],
  };

  return [ar, en];
}
