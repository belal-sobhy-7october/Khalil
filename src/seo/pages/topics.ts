/**
 * The Topic Library in public: an index in each language, and a page for each
 * lesson in each language. The lesson is in English on both; the Arabic page
 * adds each word's Arabic meaning (src/data/topicPacks/arabic.ts). Every
 * lesson follows the course method: warm-up → words → grammar → discussion →
 * speaking task → paragraph.
 */
import { TOPIC_PACKS, type PackGroup, type TopicPack } from '../../data/topicPacks';
import { MEANINGS_AR, TOPIC_TITLES_AR } from '../../data/topicPacks/arabic';
import { arCount, NOUNS } from '../arabicCount';
import { clip, type Block, type Card, type Lang, type Page } from '../render';
import { ROUTES } from '../routes';
import { breadcrumbs, itemList } from '../schema';

const GROUPS: PackGroup[] = ['work', 'talk', 'life', 'society'];

const GROUP_NAME: Record<Lang, Record<PackGroup, string>> = {
  en: { work: 'Work & career', talk: 'Conversation', life: 'Daily life', society: 'Society & ideas' },
  ar: { work: 'العمل', talk: 'المحادثة', life: 'الحياة اليومية', society: 'المجتمع والأفكار' },
};

const LEVEL_NAME: Record<Lang, Record<TopicPack['level'], string>> = {
  en: { B1: 'B1 (intermediate)', B2: 'B2 (upper intermediate)', C1: 'C1 (advanced)' },
  ar: { B1: 'B1 (متوسط)', B2: 'B2 (فوق المتوسط)', C1: 'C1 (متقدم)' },
};

const POS_AR: Record<string, string> = {
  noun: 'اسم',
  verb: 'فعل',
  adjective: 'صفة',
  adverb: 'ظرف',
  'phrasal verb': 'فعل مركّب',
  idiom: 'تعبير اصطلاحي',
  phrase: 'عبارة',
};

const topicAlternates = (pack: TopicPack) => ({
  ar: ROUTES.topic('ar', pack.id),
  en: ROUTES.topic('en', pack.id),
  'x-default': ROUTES.topic('en', pack.id),
});

/** Other lessons to read next: the same group, the same level first. */
function related(pack: TopicPack): TopicPack[] {
  const sameGroup = TOPIC_PACKS.filter((p) => p.group === pack.group && p.id !== pack.id);
  return [...sameGroup.filter((p) => p.level === pack.level), ...sameGroup.filter((p) => p.level !== pack.level)].slice(0, 6);
}

function card(pack: TopicPack, lang: Lang): Card {
  if (lang === 'ar') {
    return {
      href: ROUTES.topic('ar', pack.id),
      title: TOPIC_TITLES_AR[pack.id],
      meta: `${pack.level} · ${pack.title}`,
      text: pack.items.slice(0, 4).map((w) => w.word).join(' · '),
    };
  }
  return { href: ROUTES.topic('en', pack.id), title: pack.title, meta: `${pack.level} · ${pack.items.length} words`, text: pack.description };
}

function topicPage(pack: TopicPack, origin: string): Page {
  const path = ROUTES.topic('en', pack.id);
  const crumbs = [
    { href: ROUTES.home('en'), label: 'Home' },
    { href: ROUTES.topics('en'), label: 'English topics' },
  ];
  const h1 = `${pack.title}: English vocabulary and conversation questions`;
  const description = clip(
    `Free ${pack.level} English lesson on ${pack.title}: ${pack.items.length} key words with examples, ${pack.discussion.length} conversation questions, a speaking task and grammar: ${pack.grammar.title}.`
  );
  const blocks: Block[] = [
    { kind: 'p', text: `Level ${LEVEL_NAME.en[pack.level]} · ${GROUP_NAME.en[pack.group]} · ${pack.items.length} words · ${pack.discussion.length} questions`, note: true },
    { kind: 'h2', text: 'Warm-up', id: 'warm-up' },
    { kind: 'list', items: pack.warmUp },
    { kind: 'h2', text: `Key words (${pack.items.length})`, id: 'words' },
    { kind: 'p', text: 'Each word comes with the meaning it has in this topic, and an example in that sense.' },
    { kind: 'words', items: pack.items.map((w) => ({ word: w.word, pos: w.pos, definition: w.definition, example: w.example })) },
    { kind: 'h2', text: `Grammar: ${pack.grammar.title}`, id: 'grammar' },
    ...pack.grammar.points.flatMap((point): Block[] => [
      { kind: 'h3', text: point.form },
      { kind: 'p', text: point.use },
      { kind: 'quote', text: point.example },
    ]),
    ...(pack.grammar.tip ? [{ kind: 'p', text: `Golden rule: ${pack.grammar.tip}`, note: true } as Block] : []),
    { kind: 'h2', text: 'Conversation questions', id: 'discussion' },
    { kind: 'list', items: pack.discussion, ordered: true },
    { kind: 'h2', text: 'One-minute speaking task', id: 'speaking' },
    { kind: 'p', text: pack.task.prompt },
    { kind: 'list', items: pack.task.points },
    { kind: 'h2', text: 'Model paragraph', id: 'paragraph' },
    { kind: 'p', text: 'Listen to it, read it aloud, then say it again in your own words.' },
    { kind: 'quote', text: pack.paragraph },
    {
      kind: 'cta',
      title: 'Study this topic in Khalil',
      text: 'Add the words to smart flashcards, get reminded when it’s time to review, record your one-minute answer and study offline. Free.',
      href: '/',
      label: 'Open Khalil',
    },
    { kind: 'h2', text: `More ${GROUP_NAME.en[pack.group].toLowerCase()} topics` },
    { kind: 'cards', items: related(pack).map((p) => card(p, 'en')) },
  ];
  return {
    path,
    lang: 'en',
    section: 'topics',
    title: `${pack.title} Vocabulary & Conversation Questions (${pack.level}) | Khalil`,
    description,
    h1,
    crumb: pack.title,
    lead: pack.description,
    crumbs,
    alternates: topicAlternates(pack),
    blocks,
    ogType: 'article',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: `${pack.title}: English vocabulary and conversation questions`,
        description,
        url: `${origin}${path}`,
        inLanguage: 'en',
        learningResourceType: 'Lesson',
        isAccessibleForFree: true,
        educationalLevel: pack.level,
        educationalAlignment: {
          '@type': 'AlignmentObject',
          alignmentType: 'educationalLevel',
          educationalFramework: 'CEFR',
          targetName: pack.level,
        },
        teaches: [`${pack.title} vocabulary`, pack.grammar.title],
        keywords: pack.items.map((w) => w.word).join(', '),
        hasPart: {
          '@type': 'DefinedTermSet',
          name: `${pack.title} vocabulary`,
          hasDefinedTerm: pack.items.map((w) => ({ '@type': 'DefinedTerm', name: w.word, description: w.definition })),
        },
        isPartOf: { '@type': 'WebSite', name: 'Khalil', url: `${origin}/` },
      },
      breadcrumbs(crumbs, pack.title, path, origin),
    ],
  };
}

function indexPage(lang: Lang, origin: string): Page {
  const count = TOPIC_PACKS.length;
  const byLevel = (level: TopicPack['level']) => TOPIC_PACKS.filter((p) => p.level === level).length;
  const groups: Block[] = GROUPS.flatMap((group): Block[] => {
    const packs = TOPIC_PACKS.filter((p) => p.group === group);
    return [
      { kind: 'h2', text: `${GROUP_NAME[lang][group]} (${packs.length})`, id: group },
      { kind: 'cards', items: packs.map((p) => card(p, lang)) },
    ];
  });
  const lessons = TOPIC_PACKS.map((p) => ({ href: ROUTES.topic(lang, p.id), label: lang === 'ar' ? TOPIC_TITLES_AR[p.id] : p.title }));
  const path = ROUTES.topics(lang);
  const alternates = { ar: ROUTES.topics('ar'), en: ROUTES.topics('en'), 'x-default': ROUTES.topics('en') };

  if (lang === 'ar') {
    const crumbs = [{ href: ROUTES.home('ar'), label: 'الرئيسية' }];
    const h1 = 'مواضيع المحادثة بالإنجليزية: دروس مجانية بالكلمات والقواعد والأسئلة';
    return {
      path,
      lang,
      section: 'topics',
      title: `مواضيع محادثة بالإنجليزية مجانًا: ${arCount(count, NOUNS.lesson)} بالكلمات والأسئلة | خليل`,
      description: clip(
        `${arCount(count, NOUNS.topic)} للمحادثة بالإنجليزية من B1 إلى C1: في كل موضوع نحو 12 كلمة بمعناها ومثال، وقاعدة نحوية، وأسئلة نقاش، ومهمة كلام مدتها دقيقة، وفقرة نموذجية. مجانًا.`
      ),
      h1,
      crumb: 'مواضيع المحادثة',
      lead: 'كل موضوع درس كامل يسير على طريقة واحدة: أسئلة تمهيدية، ثم نحو 12 كلمة بالمعنى الذي تحمله في هذا الموضوع مع مثال، ثم قاعدة نحوية واحدة تخدمه، ثم أسئلة نقاش، ثم مهمة كلام مدتها دقيقة، ثم فقرة نموذجية تقرؤها بصوت مرتفع.',
      crumbs,
      alternates,
      blocks: [
        { kind: 'p', text: `المستويات: ${byLevel('B1')} في B1 (متوسط)، و${byLevel('B2')} في B2 (فوق المتوسط)، و${byLevel('C1')} في C1 (متقدم). الدروس مكتوبة بالإنجليزية الأمريكية، ومع كل كلمة معناها بالعربية.`, note: true },
        { kind: 'h2', text: 'كيف تذاكر الموضوع؟' },
        {
          kind: 'list',
          ordered: true,
          items: [
            'أجب عن أسئلة التمهيد بجملتين، ولو بكلمات بسيطة.',
            'اقرأ الكلمات وأمثلتها بصوت مرتفع، واكتب جملة لك بكل كلمة.',
            'افهم القاعدة النحوية ثم كوّن ثلاث جمل عنك بها.',
            'أجب عن أسئلة النقاش مستعملًا الكلمات الجديدة.',
            'سجّل صوتك دقيقة واحدة في مهمة الكلام، واستمع إليه.',
          ],
        },
        ...groups,
        {
          kind: 'cta',
          title: 'ذاكر هذه المواضيع في خليل',
          text: 'أضف الكلمات إلى بطاقات المراجعة الذكية، وسجّل إجاباتك، وذاكر دون إنترنت. مجانًا.',
          href: '/',
          label: 'افتح خليل',
        },
      ],
      jsonLd: [itemList(origin, 'مواضيع المحادثة بالإنجليزية', lessons), breadcrumbs(crumbs, h1, path, origin)],
    };
  }

  const crumbs = [{ href: ROUTES.home('en'), label: 'Home' }];
  const h1 = 'English conversation topics: free lessons with vocabulary, grammar and questions';
  return {
    path,
    lang,
    section: 'topics',
    title: `English Conversation Topics: ${count} Free Lessons (B1–C1) | Khalil`,
    description: clip(
      `${count} free English conversation lessons from B1 to C1. Each topic: about 12 key words with meanings and examples, a grammar point, discussion questions, a one-minute speaking task and a model paragraph.`
    ),
    h1,
    crumb: 'English topics',
    lead: 'Every topic is a full lesson with the same steps: warm-up questions, about 12 words in the meaning they have in the topic with an example, one grammar point that serves it, discussion questions, a one-minute speaking task and a model paragraph to read aloud.',
    crumbs,
    alternates,
    blocks: [
      { kind: 'p', text: `Levels: ${byLevel('B1')} at B1 (intermediate), ${byLevel('B2')} at B2 (upper intermediate) and ${byLevel('C1')} at C1 (advanced). Written in American English.`, note: true },
      { kind: 'h2', text: 'How to study a topic' },
      {
        kind: 'list',
        ordered: true,
        items: [
          'Answer the warm-up questions in two sentences each, even with simple words.',
          'Read the words and their examples aloud, and write one sentence of your own with each.',
          'Learn the grammar point, then make three true sentences about yourself with it.',
          'Answer the discussion questions using the new words.',
          'Record yourself for one minute on the speaking task, then listen back.',
        ],
      },
      ...groups,
      {
        kind: 'cta',
        title: 'Study these topics in Khalil',
        text: 'Add the words to smart flashcards, record your answers and study offline. Free.',
        href: '/',
        label: 'Open Khalil',
      },
    ],
    jsonLd: [itemList(origin, 'English conversation topics', lessons), breadcrumbs(crumbs, h1, path, origin)],
  };
}

function topicPageAr(pack: TopicPack, origin: string): Page {
  const path = ROUTES.topic('ar', pack.id);
  const name = TOPIC_TITLES_AR[pack.id];
  const crumbs = [
    { href: ROUTES.home('ar'), label: 'الرئيسية' },
    { href: ROUTES.topics('ar'), label: 'مواضيع المحادثة' },
  ];
  const h1 = `كلمات إنجليزية عن ${name}، بمعانيها وأسئلة للمحادثة`;
  const first = pack.items.slice(0, 5).map((w) => w.word);
  const description = clip(
    `${arCount(pack.items.length, NOUNS.word)} بالإنجليزية عن ${name} بمعانيها بالعربية وأمثلتها: ${first.join('، ')}… مع قاعدة نحوية، وأسئلة للمحادثة، ومهمة كلام. درس مجاني بمستوى ${pack.level}.`,
    200
  );
  const blocks: Block[] = [
    {
      kind: 'p',
      text: `المستوى ${LEVEL_NAME.ar[pack.level]} · ${GROUP_NAME.ar[pack.group]} · ${arCount(pack.items.length, NOUNS.word)} · ${arCount(pack.discussion.length, NOUNS.question)} للمحادثة`,
      note: true,
    },
    { kind: 'h2', text: 'أسئلة تمهيدية', id: 'warm-up' },
    { kind: 'list', items: pack.warmUp, lang: 'en' },
    { kind: 'h2', text: `الكلمات (${pack.items.length})`, id: 'words' },
    { kind: 'p', text: 'لكل كلمة معناها في هذا الموضوع بالعربية، وتعريفها بالإنجليزية، ومثال بالمعنى نفسه.' },
    {
      kind: 'words',
      lang: 'en',
      items: pack.items.map((w) => ({ word: w.word, pos: POS_AR[w.pos], meaning: MEANINGS_AR[w.word], definition: w.definition, example: w.example })),
    },
    { kind: 'h2', text: 'القاعدة النحوية', id: 'grammar' },
    { kind: 'p', text: pack.grammar.title, lang: 'en' },
    ...pack.grammar.points.flatMap((point): Block[] => [
      { kind: 'h3', text: point.form, lang: 'en' },
      { kind: 'p', text: point.use, lang: 'en' },
      { kind: 'quote', text: point.example, lang: 'en' },
    ]),
    ...(pack.grammar.tip ? ([{ kind: 'h3', text: 'القاعدة الذهبية' }, { kind: 'p', text: pack.grammar.tip, lang: 'en', note: true }] as Block[]) : []),
    { kind: 'h2', text: 'أسئلة للمحادثة', id: 'discussion' },
    { kind: 'list', items: pack.discussion, ordered: true, lang: 'en' },
    { kind: 'h2', text: 'مهمة كلام مدتها دقيقة', id: 'speaking' },
    { kind: 'p', text: pack.task.prompt, lang: 'en' },
    { kind: 'list', items: pack.task.points, lang: 'en' },
    { kind: 'h2', text: 'فقرة نموذجية', id: 'paragraph' },
    { kind: 'p', text: 'استمع إليها، واقرأها بصوت مرتفع، ثم قلها بكلماتك.' },
    { kind: 'quote', text: pack.paragraph, lang: 'en' },
    {
      kind: 'cta',
      title: 'ذاكر هذا الموضوع في خليل',
      text: 'أضف الكلمات إلى بطاقات المراجعة الذكية، ويذكّرك خليل بموعد مراجعتها، وسجّل إجابتك في دقيقة، وذاكر دون إنترنت. مجانًا.',
      href: '/',
      label: 'افتح خليل',
    },
    { kind: 'h2', text: `مواضيع أخرى في ${GROUP_NAME.ar[pack.group]}` },
    { kind: 'cards', items: related(pack).map((p) => card(p, 'ar')) },
  ];
  return {
    path,
    lang: 'ar',
    section: 'topics',
    title: `كلمات إنجليزية عن ${name} بمعانيها وأسئلة محادثة (${pack.level}) | خليل`,
    description,
    h1,
    crumb: name,
    lead: `درس «${pack.title}» بالإنجليزية، بمستوى ${pack.level}: الكلمات التي تحتاج إليها لتتكلم عن ${name}، بمعانيها بالعربية وأمثلتها، ثم قاعدة نحوية، وأسئلة نقاش، ومهمة كلام مدتها دقيقة.`,
    crumbs,
    alternates: topicAlternates(pack),
    blocks,
    ogType: 'article',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: h1,
        description,
        url: `${origin}${path}`,
        inLanguage: 'ar',
        learningResourceType: 'Lesson',
        isAccessibleForFree: true,
        educationalLevel: pack.level,
        educationalAlignment: {
          '@type': 'AlignmentObject',
          alignmentType: 'educationalLevel',
          educationalFramework: 'CEFR',
          targetName: pack.level,
        },
        teaches: [`${pack.title} vocabulary`, pack.grammar.title],
        keywords: pack.items.map((w) => w.word).join(', '),
        hasPart: {
          '@type': 'DefinedTermSet',
          name: `كلمات إنجليزية عن ${name}`,
          hasDefinedTerm: pack.items.map((w) => ({ '@type': 'DefinedTerm', name: w.word, description: `${MEANINGS_AR[w.word]}: ${w.definition}`, inLanguage: 'en' })),
        },
        isPartOf: { '@type': 'WebSite', name: 'خليل', url: `${origin}/` },
      },
      breadcrumbs(crumbs, name, path, origin),
    ],
  };
}

export function topicPages(origin: string): Page[] {
  return [
    indexPage('ar', origin),
    indexPage('en', origin),
    ...TOPIC_PACKS.flatMap((p) => [topicPageAr(p, origin), topicPage(p, origin)]),
  ];
}
