/**
 * Sales Prep's Knowledge books in public: four short books in Arabic (sales,
 * negotiation, marketing, the psychology of decisions), a page per chapter.
 */
import { KNOWLEDGE, ALL_CHAPTERS } from '../../data/sales/knowledge';
import type { KnowledgeBook, KnowledgeChapter } from '../../data/sales/types';
import { arCount, NOUNS } from '../arabicCount';
import { clip, type Block, type Page } from '../render';
import { ROUTES } from '../routes';
import { article, breadcrumbs, itemList } from '../schema';

const HUB_CRUMBS = [{ href: ROUTES.home('ar'), label: 'الرئيسية' }];

function hubPage(origin: string): Page {
  const path = ROUTES.sales;
  const h1 = 'تعلّم المبيعات والتسويق والتفاوض من الصفر';
  return {
    path,
    lang: 'ar',
    section: 'sales',
    title: 'تعلّم المبيعات والتسويق والتفاوض من الصفر مجانًا | خليل',
    description: clip(
      `${arCount(KNOWLEDGE.length, NOUNS.book)} قصيرة بالعربية في المبيعات والتفاوض والتسويق وعلم نفس القرار: ${arCount(ALL_CHAPTERS.length, NOUNS.chapter)}، في كل فصل فكرة واضحة، ومثال من الحياة، وكيف تستعملها في أي وظيفة، ومصدرها.`
    ),
    h1,
    crumb: 'تعلّم المبيعات',
    lead: 'المبيعات ليست خداعًا للناس، بل فهمٌ لما يحتاجون إليه. هذه الكتب القصيرة تشرح الأفكار الحقيقية وراء البيع والتفاوض والتسويق وقرارات الناس، بأمثلة من السوق المصري، وتنفعك في أي وظيفة وفي حياتك.',
    crumbs: HUB_CRUMBS,
    blocks: [
      ...KNOWLEDGE.flatMap((book): Block[] => [
        { kind: 'h2', text: book.title, id: book.id },
        { kind: 'p', text: book.intro },
        { kind: 'cards', items: book.chapters.map((c) => ({ href: ROUTES.chapter(c.id), title: c.title, text: c.idea })) },
      ]),
      {
        kind: 'cta',
        title: 'ادرسها يومًا بيوم في خليل',
        text: 'خطة يومية من الصفر: فصل من هذه الكتب، وتدريب على الكلام، وتمثيل أدوار، واختبارات قصيرة، ثم المهارات نفسها بالإنجليزية. مجانًا.',
        href: '/',
        label: 'افتح خليل',
      },
    ],
    jsonLd: [
      itemList(origin, h1, ALL_CHAPTERS.map((c) => ({ href: ROUTES.chapter(c.id), label: c.title }))),
      breadcrumbs(HUB_CRUMBS, h1, path, origin),
    ],
  };
}

function chapterPage(chapter: KnowledgeChapter, book: KnowledgeBook, origin: string): Page {
  const path = ROUTES.chapter(chapter.id);
  const crumbs = [...HUB_CRUMBS, { href: ROUTES.sales, label: 'تعلّم المبيعات' }];
  const index = book.chapters.indexOf(chapter);
  const prev = book.chapters[index - 1];
  const next = book.chapters[index + 1];
  const others = book.chapters.filter((c) => c !== chapter && c !== prev && c !== next).slice(0, 4);
  const description = clip(chapter.idea);
  const blocks: Block[] = [
    { kind: 'p', text: `من كتاب «${book.title}» · الفصل ${index + 1} من ${book.chapters.length}`, note: true },
    ...chapter.sections.flatMap((s): Block[] => [
      { kind: 'h2', text: s.title },
      { kind: 'p', text: s.text },
    ]),
    ...(chapter.example ? ([{ kind: 'h2', text: 'مثال' }, { kind: 'quote', text: chapter.example }] as Block[]) : []),
    { kind: 'h2', text: 'في حياتك وفي أي وظيفة' },
    { kind: 'p', text: chapter.inLife },
    { kind: 'h2', text: 'جرّب اليوم' },
    { kind: 'p', text: chapter.tryIt },
    { kind: 'h2', text: 'من أين جاءت الفكرة؟' },
    { kind: 'p', text: chapter.source },
    ...(chapter.check.length ? [{ kind: 'check', title: 'اختبر فهمك', reveal: 'الإجابة', items: chapter.check } as Block] : []),
    {
      kind: 'cta',
      title: 'تعلّم المبيعات من الصفر في خليل',
      text: 'خطة يومية: فصل من هذه الكتب، وتدريب على الكلام، وتمثيل أدوار، واختبارات قصيرة. مجانًا.',
      href: '/',
      label: 'افتح خليل',
    },
    {
      kind: 'cards',
      items: [
        ...(prev ? [{ href: ROUTES.chapter(prev.id), title: prev.title, meta: 'الفصل السابق', text: prev.idea }] : []),
        ...(next ? [{ href: ROUTES.chapter(next.id), title: next.title, meta: 'الفصل التالي', text: next.idea }] : []),
        ...others.map((c) => ({ href: ROUTES.chapter(c.id), title: c.title, meta: book.title, text: c.idea })),
      ],
    },
  ];
  return {
    path,
    lang: 'ar',
    section: 'sales',
    title: `${chapter.title}: ${book.title} | تعلّم المبيعات مع خليل`,
    description,
    h1: chapter.title,
    lead: chapter.idea,
    crumbs,
    blocks,
    ogType: 'article',
    jsonLd: [
      article({ origin, path, lang: 'ar', headline: chapter.title, description, about: [book.title], citation: chapter.source }),
      breadcrumbs(crumbs, chapter.title, path, origin),
    ],
  };
}

export function salesPages(origin: string): Page[] {
  return [hubPage(origin), ...KNOWLEDGE.flatMap((book) => book.chapters.map((c) => chapterPage(c, book, origin)))];
}
