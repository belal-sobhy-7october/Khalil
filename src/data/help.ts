/**
 * "Ask Khalil": short answers about using Khalil, searched on the device
 * (lib/helpSearch.ts), so they cost nothing and work with no internet. Each
 * answer can open the part it talks about. Arabic is Fusha.
 *
 * `keywords` are the words people may type for it, in both languages (any
 * form; the search ignores harakat, hamzas and "ال").
 */
import type { SettingsTab } from '../components/Settings/settingsTabs';

export interface HelpTopic {
  id: string;
  q: { ar: string; en: string };
  a: { ar: string; en: string };
  keywords: string[];
  /** What "Open it" opens: a section of the app, or a tab of Settings. */
  open?: { section: string } | { settings: SettingsTab };
  /** Shown before anything is typed. */
  popular?: boolean;
}

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'what',
    popular: true,
    q: { ar: 'ما خليل؟', en: 'What is Khalil?' },
    a: {
      ar: 'خليل رفيق يومي مجاني بالعربية والإنجليزية: تنظّم فيه مهامك وعاداتك وورْدك، وتتعلم الإنجليزية من مستواك، وتستعد لوظيفة في مركز اتصال، وتتعلم المبيعات والتسويق والتفاوض.',
      en: 'Khalil is a free daily companion in Arabic and English: plan your tasks, habits and wird, learn English from your own level, get ready for a call center job, and learn sales, marketing and negotiation.',
    },
    keywords: ['خليل', 'ما هو', 'التطبيق', 'الموقع', 'about', 'what', 'app', 'khalil'],
  },
  {
    id: 'guest',
    popular: true,
    q: { ar: 'هل تُحفظ بياناتي دون حساب؟', en: 'Is my data saved without an account?' },
    a: {
      ar: 'نعم، وأنت ضيف يُحفظ ما تفعله في هذا المتصفح وحده. أنشئ حسابًا بـ Google (زر «إنشاء حساب» في الأعلى) فيبقى كل ما فعلته كما هو، وتجده على كل أجهزتك.',
      en: "Yes. As a guest, what you do is saved in this browser only. Create an account with Google (\"Create account\" at the top): everything you did stays, and you'll find it on all your devices.",
    },
    keywords: ['حساب', 'ضيف', 'حفظ', 'احفظ', 'بيانات', 'تسجيل', 'جوجل', 'google', 'account', 'guest', 'save', 'sign up', 'data'],
  },
  {
    id: 'devices',
    q: { ar: 'كيف أفتح بياناتي على جهاز آخر؟', en: 'How do I get my data on another device?' },
    a: {
      ar: 'سجّل الدخول بحساب Google نفسه على الجهاز الآخر، فتظهر مهامك وكلماتك وتقدّمك كما هي. إن كنت ضيفًا فأنشئ حسابًا أولًا من هذا الجهاز.',
      en: "Sign in with the same Google account on the other device and your tasks, words and progress are there. If you're a guest, create an account on this device first.",
    },
    keywords: ['جهاز', 'هاتف', 'موبايل', 'لابتوب', 'مزامنة', 'دخول', 'device', 'phone', 'sync', 'sign in', 'login'],
  },
  {
    id: 'offline',
    q: { ar: 'هل يعمل دون إنترنت؟', en: 'Does it work offline?' },
    a: {
      ar: 'جزء منه. بعد أول فتح يُحفظ خليل على جهازك، فيفتح دون إنترنت، وتقرأ فيه مواضيع الإنجليزية ودروس مركز الاتصال والمبيعات. أما المقاطع وحفظ ما تفعله ومزامنته فتحتاج إلى إنترنت.',
      en: 'Partly. After the first visit Khalil is saved on your device, so it opens with no internet and you can study the English topics and the call center and sales lessons. Videos, and saving and syncing what you do, need a connection.',
    },
    keywords: ['انترنت', 'إنترنت', 'اتصال', 'نت', 'اوفلاين', 'offline', 'internet', 'connection', 'no network'],
  },
  {
    id: 'install',
    q: { ar: 'كيف أثبّته كتطبيق على هاتفي؟', en: 'How do I install it as an app?' },
    a: {
      ar: 'على أندرويد أو الحاسوب: افتح الإعدادات ثم «ثبّت خليل كتطبيق»، أو اختر «تثبيت» من قائمة المتصفح. على الآيفون: زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».',
      en: 'On Android or a computer: open Settings and choose "Install as an app", or use the browser menu\'s Install. On iPhone: Share, then "Add to Home Screen".',
    },
    keywords: ['تثبيت', 'ثبت', 'تطبيق', 'الشاشة الرئيسية', 'ايفون', 'اندرويد', 'install', 'app', 'home screen', 'iphone', 'android'],
    open: { settings: 'general' },
  },
  {
    id: 'priority',
    q: { ar: 'ما «أولوية واحدة لليوم»؟', en: 'What is "Your one priority for today"?' },
    a: {
      ar: 'أعلى صفحة المهام: اكتب أهم شيء تريد إنجازه اليوم واضغط «حفظ». يبقى أمامك طوال اليوم ويبدأ فارغًا في اليوم التالي.',
      en: 'At the top of the tasks page: write the one thing that matters most today and press Save. It stays in front of you all day and starts empty the next day.',
    },
    keywords: ['اولوية', 'أولوية', 'تركيز اليوم', 'هدف اليوم', 'priority', 'focus of the day', 'daily focus'],
    open: { section: 'todo' },
  },
  {
    id: 'tasks',
    popular: true,
    q: { ar: 'كيف أضيف مهمة؟', en: 'How do I add a task?' },
    a: {
      ar: 'في صفحة المهام اكتب المهمة في «المهام اليومية» أو «أهداف الأسبوع» واضغط Enter أو زر +. اختر أولويتها بالأعلام قبل الإضافة، واسحبها لترتّبها، وانقلها بين اليوم والأسبوع والمؤجلة.',
      en: "On the tasks page, type the task in Today's tasks or This week's goals and press Enter or +. Pick its priority with the flags first, drag to reorder, and move it between today, this week and the backlog.",
    },
    keywords: ['مهمة', 'مهام', 'اضافة', 'أضف', 'المؤجلة', 'الاسبوع', 'task', 'tasks', 'todo', 'add', 'backlog', 'week'],
    open: { section: 'todo' },
  },
  {
    id: 'done',
    q: { ar: 'أين تذهب المهام المنجزة؟', en: 'Where do finished tasks go?' },
    a: {
      ar: 'تختار ذلك من الإعدادات ← المهام والعادات: تبقى، أو تنزل إلى الأسفل، أو تختفي فورًا أو في اليوم التالي أو بعد 24 ساعة. المخفية محفوظة وتُحسب في التحليلات، وتجدها تحت «المنجزة».',
      en: 'You choose in Settings → Tasks & Habits: they stay, sink to the bottom, or hide at once, the next day or after 24 hours. Hidden ones are kept, counted in Analytics and listed under "Finished".',
    },
    keywords: ['منجزة', 'المنجز', 'اختفت', 'اخفاء', 'finished', 'completed', 'done', 'hide', 'disappeared'],
    open: { settings: 'tasks' },
  },
  {
    id: 'order',
    q: { ar: 'كيف أرتّب أجزاء الصفحة الرئيسية أو أخفي بعضها؟', en: 'How do I reorder or hide parts of the main page?' },
    a: {
      ar: 'من الإعدادات ← المهام والعادات: رتّب الأجزاء (الأولوية، المهام، الورد، العادات، المؤجلة) أو أخفِ ما لا تحتاج إليه. وتختار هناك أيضًا الصفحة التي يفتح عليها خليل.',
      en: 'In Settings → Tasks & Habits: reorder the parts (priority, tasks, wird, habits, backlog) or hide what you don\'t need. You also choose there which page Khalil opens on.',
    },
    keywords: ['ترتيب', 'رتب', 'اخفي', 'إخفاء', 'الصفحة الرئيسية', 'order', 'reorder', 'hide', 'main page', 'home'],
    open: { settings: 'tasks' },
  },
  {
    id: 'wird',
    popular: true,
    q: { ar: 'ما الورد؟ وكيف أعدّله؟', en: 'What is the wird, and how do I change it?' },
    a: {
      ar: 'الورد هو جدول عبادتك اليومي: الصلوات الخمس (في جماعة أو منفردًا)، والسنن الرواتب، والقيام، والقرآن، وأذكار الصباح والمساء. من الإعدادات ← الورد تخفي بنودًا وترتّبها وتضع أهدافًا، وتضيف بنودك أنت.',
      en: 'The wird is your daily worship sheet: the five prayers (in congregation or alone), the sunnah prayers, qiyam, Quran, and the morning and evening adhkar. In Settings → Wird you hide, reorder and set goals for items, and add your own.',
    },
    keywords: ['ورد', 'الورد', 'صلاة', 'الصلوات', 'قران', 'قرآن', 'اذكار', 'أذكار', 'قيام', 'رواتب', 'wird', 'prayer', 'quran', 'adhkar'],
    open: { section: 'wird' },
  },
  {
    id: 'habits',
    q: { ar: 'كيف أتابع عاداتي؟', en: 'How do I track my habits?' },
    a: {
      ar: 'في جزء «العادات» من الصفحة الرئيسية: أضف عادة وحدّد أيامها، ثم علّمها كل يوم. ترى نسبتك أسبوعًا أو شهرًا أو شهرين، وتظهر العادات المطلوبة اليوم في مهام اليوم.',
      en: "In the Habits part of the main page: add a habit and pick its days, then tick it each day. You see your rate over a week, a month or two months, and today's habits appear in today's tasks.",
    },
    keywords: ['عادة', 'عادات', 'متابعة', 'سلسلة', 'habit', 'habits', 'streak', 'track'],
    open: { section: 'life' },
  },
  {
    id: 'habitLink',
    q: { ar: 'ما ربط العادة بالورد؟', en: 'What does linking a habit to the wird do?' },
    a: {
      ar: 'إن كانت العادة هي بند في الورد (مثل صلاة الفجر في جماعة)، فاربطها به عند تعديلها: ما تعلّمه هنا يُعلَّم هناك، ولا تسجّل الشيء مرتين.',
      en: "If a habit is a wird item (like Fajr in congregation), link it when you edit it: ticking it here ticks it there, so you never record the same thing twice.",
    },
    keywords: ['ربط', 'مرتبطة', 'عادة', 'ورد', 'link', 'linked', 'habit', 'wird'],
    open: { section: 'life' },
  },
  {
    id: 'focus',
    popular: true,
    q: { ar: 'كيف أبدأ جلسة تركيز (بومودورو)؟', en: 'How do I start a focus session (Pomodoro)?' },
    a: {
      ar: 'اضغط «تركيز 25 دقيقة» في بطاقة «أولوية واحدة لليوم» فتبدأ فورًا. وفي صفحة التركيز تغيّر مدة الجلسة والاستراحات، وتختار صوتًا للخلفية، وتفتح المؤقت في نافذة عائمة.',
      en: 'Press "Focus 25 min" on the "one priority for today" card and it starts at once. On the Focus page you change the session and break lengths, pick a background sound and open the timer in a floating window.',
    },
    keywords: ['تركيز', 'بومودورو', 'مؤقت', 'جلسة', 'استراحة', 'دقيقة', 'focus', 'pomodoro', 'timer', 'session', 'break'],
    open: { section: 'focus' },
  },
  {
    id: 'chip',
    q: { ar: 'ما الدائرة العائمة التي فيها الوقت؟', en: 'What is the floating oval with the time?' },
    a: {
      ar: 'هي مؤقت التركيز، يبقى ظاهرًا في كل الصفحات ما دامت الجلسة تعمل. اضغط عليها لتفتح صفحة التركيز، ومن زر الإعدادات الصغير فيها تغيّر شفافيتها وحجمها وصوت الخلفية.',
      en: "It's the focus timer: it stays on every page while a session runs. Tap it to open the Focus page; its small settings button changes its transparency, size and background sound.",
    },
    keywords: ['عائم', 'عائمة', 'الدائرة', 'الوقت', 'floating', 'chip', 'oval', 'timer'],
    open: { section: 'focus' },
  },
  {
    id: 'path',
    popular: true,
    q: { ar: 'من أين أبدأ تعلّم الإنجليزية؟', en: 'Where do I start learning English?' },
    a: {
      ar: 'افتح «تعلّم اللغات» ثم الإنجليزية، وأول تبويب هو «مسار التعلم»: اختر مستواك (من A1 إلى C1) ووقتك اليومي، فيعطيك كل يوم قليلًا من كل مهارة: كلمات، ونطق، واستماع، وقراءة، وقواعد، ومحاكاة.',
      en: 'Open Learn Languages, then English: the first tab is the Learning Path. Pick your level (A1 to C1) and your daily time, and every day it gives you a little of every skill: words, pronunciation, listening, reading, grammar and shadowing.',
    },
    keywords: ['انجليزي', 'الإنجليزية', 'انجليزية', 'تعلم', 'مسار', 'مستوى', 'english', 'learn', 'path', 'level', 'start'],
    open: { section: 'vocabulary' },
  },
  {
    id: 'flashcards',
    q: { ar: 'كيف تعمل بطاقات المراجعة؟', en: 'How do the flashcards work?' },
    a: {
      ar: 'تراجع كل كلمة في الوقت المناسب: بعد كل بطاقة اختر «مرة أخرى» أو «صعب» أو «جيد» أو «سهل»، فيحدد خليل موعدها التالي (بطريقة Anki نفسها). وحين تحين المراجعة يظهر تنبيه في الصفحة الرئيسية.',
      en: 'You review each word at the right moment: after each card pick Again, Hard, Good or Easy, and Khalil schedules the next review (the same way Anki does). When reviews are due, a reminder shows on the main page.',
    },
    keywords: ['بطاقات', 'مراجعة', 'كلمات', 'حفظ الكلمات', 'انكي', 'flashcards', 'review', 'words', 'anki', 'vocabulary'],
    open: { section: 'vocabulary' },
  },
  {
    id: 'addWord',
    q: { ar: 'كيف أضيف كلمة إنجليزية إلى كلماتي؟', en: 'How do I add an English word to my words?' },
    a: {
      ar: 'ظلّل أي نص إنجليزي في أي مكان في خليل، فيظهر زر «أضف إلى كلماتي». وفي قسم الكلمات تضيف كلمة بيدك أو تستورد قائمة.',
      en: 'Select any English text anywhere in Khalil and an "Add to my words" button appears. In the Vocabulary tab you can also add a word by hand or import a list.',
    },
    keywords: ['اضافة كلمة', 'كلمة', 'تظليل', 'كلماتي', 'add word', 'select', 'my words', 'import'],
    open: { section: 'vocabulary' },
  },
  {
    id: 'topics',
    q: { ar: 'ما مكتبة المواضيع؟', en: 'What is the Topic Library?' },
    a: {
      ar: 'دروس محادثة بالإنجليزية (من B1 إلى C1)، كل درس كامل: تمهيد، ونحو 12 كلمة بمعناها في الموضوع ومثالها، وقاعدة نحوية، وأسئلة نقاش، ومهمة كلام دقيقة واحدة. وتعمل دون إنترنت.',
      en: 'English conversation lessons (B1 to C1), each a full lesson: a warm-up, about 12 words with their meaning in the topic and an example, a grammar point, discussion questions and a one-minute speaking task. They work offline.',
    },
    keywords: ['مواضيع', 'المواضيع', 'محادثة', 'مكتبة', 'درس', 'topics', 'topic library', 'conversation', 'lesson'],
    open: { section: 'vocabulary' },
  },
  {
    id: 'callcenter',
    q: { ar: 'ما الاستعداد لمركز الاتصال؟', en: 'What is Call Center Prep?' },
    a: {
      ar: 'في «تعلّم المهارات»: خطة من B1 إلى C1 لوظيفة مركز اتصال بالإنجليزية في مصر، فيها كلمات المكالمات، وأسئلة المقابلة بإجابات نموذجية، وتسجيل صوتك، واختبارات، ومهمة كل يوم.',
      en: 'In Learn Skills: a plan from B1 to C1 for an English call center job in Egypt, with call vocabulary, interview questions with model answers, voice recordings, tests and a task every day.',
    },
    keywords: ['مركز اتصال', 'كول سنتر', 'مقابلة', 'وظيفة', 'call center', 'callcenter', 'interview', 'job'],
    open: { section: 'callcenter' },
  },
  {
    id: 'sales',
    q: { ar: 'ما تعلّم المبيعات؟', en: 'What is Sales Prep?' },
    a: {
      ar: 'في «تعلّم المهارات»: المبيعات والتسويق والتفاوض وعلم نفس القرار من الصفر، في كتب قصيرة بالعربية ثم بالإنجليزية، بمهمة واحدة كل يوم.',
      en: 'In Learn Skills: sales, marketing, negotiation and the psychology of decisions from zero, in short books in Arabic and then in English, with one task a day.',
    },
    keywords: ['مبيعات', 'تسويق', 'تفاوض', 'بيع', 'sales', 'marketing', 'negotiation', 'selling'],
    open: { section: 'sales' },
  },
  {
    id: 'soon',
    q: { ar: 'ماذا تعني «قريبًا» على بعض اللغات والمهارات؟', en: 'What does "Soon" on some languages and skills mean?' },
    a: {
      ar: 'هي أقسام نعمل عليها مع متخصصين ولم تُفتح بعد، وكل قسم يُفتح حين يكتمل. المفتوح الآن من اللغات: الإنجليزية.',
      en: "They're sections we're building with specialists; each opens when it's ready. Open now among the languages: English.",
    },
    keywords: ['قريبا', 'قريبًا', 'لغات', 'مهارات', 'soon', 'languages', 'skills', 'coming'],
    open: { section: 'skills' },
  },
  {
    id: 'calendar',
    q: { ar: 'كيف أستخدم التقويم؟', en: 'How do I use the calendar?' },
    a: {
      ar: 'من القائمة افتح «التقويم»: أضف موعدًا بالضغط على يوم أو وقت، وغيّر العرض بين الشهر والأسبوع واليوم، واضغط على موعد لتعدّله أو تحذفه.',
      en: 'Open Calendar from the menu: add an event by clicking a day or a time, switch between month, week and day, and click an event to edit or delete it.',
    },
    keywords: ['تقويم', 'موعد', 'مواعيد', 'calendar', 'event', 'schedule'],
    open: { section: 'calendar' },
  },
  {
    id: 'bookmarks',
    q: { ar: 'ما المفضلة؟', en: 'What are Bookmarks?' },
    a: {
      ar: 'مكان تحفظ فيه روابطك المهمة في مجموعات، فتجدها من أي جهاز.',
      en: 'A place to keep your important links in groups, so you find them from any device.',
    },
    keywords: ['مفضلة', 'روابط', 'رابط', 'bookmarks', 'links', 'link'],
    open: { section: 'bookmarks' },
  },
  {
    id: 'notes',
    q: { ar: 'كيف أكتب ملاحظة سريعة؟', en: 'How do I write a quick note?' },
    a: {
      ar: 'زر + الدائري في أسفل الشاشة يضيف ملاحظة أو قائمة بنود، وتبقى في عمود الملاحظات بجانب صفحاتك.',
      en: 'The round + button at the bottom adds a note or a checklist; it stays in the notes column beside your pages.',
    },
    keywords: ['ملاحظة', 'ملاحظات', 'قائمة', 'note', 'notes', 'checklist', 'plus'],
  },
  {
    id: 'analytics',
    q: { ar: 'أين أرى تقدّمي؟', en: 'Where do I see my progress?' },
    a: {
      ar: 'في «التحليلات»: المهام المنجزة، ونسب العادات والورد، ودقائق التركيز، والكلمات، يومًا بيوم وأسبوعًا بأسبوع.',
      en: 'In Analytics: finished tasks, habit and wird rates, focus minutes and words, day by day and week by week.',
    },
    keywords: ['تقدم', 'تحليلات', 'احصائيات', 'إحصائيات', 'progress', 'analytics', 'stats', 'statistics'],
    open: { section: 'analytics' },
  },
  {
    id: 'look',
    q: { ar: 'كيف أغيّر اللغة أو الألوان أو الوضع الداكن؟', en: 'How do I change the language, colors or dark mode?' },
    a: {
      ar: 'زرّا اللغة والفاتح/الداكن في أعلى الصفحة، ومن الإعدادات ← المظهر تختار ألوان خليل من عدة أشكال.',
      en: 'The language and light/dark buttons are at the top of the page; in Settings → Appearance you pick Khalil\'s colors from several looks.',
    },
    keywords: ['لغة', 'عربي', 'الوان', 'ألوان', 'داكن', 'فاتح', 'مظهر', 'language', 'arabic', 'colors', 'dark', 'theme', 'appearance'],
    open: { settings: 'look' },
  },
  {
    id: 'tour',
    q: { ar: 'كيف أعيد جولة خليل؟', en: "How do I take Khalil's tour again?" },
    a: {
      ar: 'من القائمة الجانبية أو قائمة الحساب اختر «جولة مع خليل».',
      en: 'Choose "Take the tour with Khalil" in the sidebar or the account menu.',
    },
    keywords: ['جولة', 'شرح', 'تعريف', 'tour', 'guide', 'walkthrough'],
  },
  {
    id: 'contact',
    q: { ar: 'لديّ اقتراح أو مشكلة', en: 'I have a suggestion or a problem' },
    a: {
      ar: 'يسعدنا ذلك: اضغط «راسلنا على واتساب» أسفل هذه النافذة، واكتب فكرتك أو ما واجهك.',
      en: 'Glad to hear it: press "Message us on WhatsApp" at the bottom of this window and tell us your idea or what went wrong.',
    },
    keywords: ['اقتراح', 'مشكلة', 'خطأ', 'تواصل', 'واتساب', 'suggestion', 'problem', 'bug', 'contact', 'whatsapp'],
  },
];
