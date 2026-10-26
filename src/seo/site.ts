/**
 * Everything search engines and language models read: the public pages (an
 * HTML file and a Markdown copy each), sitemap.xml, robots.txt, llms.txt and
 * sitemap.md. scripts/seoPlugin.ts writes them into dist/ at build time, so
 * they always match the lessons in the app. Read docs/seo/README.md first.
 */
import { escapeHtml, renderHtml, renderMarkdown, type Page } from './render';
import { homePages } from './pages/home';
import { topicPages } from './pages/topics';
import { callCenterPages } from './pages/callCenter';
import { salesPages } from './pages/sales';
import { ROUTES } from './routes';

/** Khalil's address until it has its own domain. */
export const DEFAULT_ORIGIN = 'https://khalil-34xv.vercel.app';

/**
 * The address the pages call home: KHALIL_SITE_URL if set, else the
 * project's production domain on Vercel (its own domain once it has one).
 */
export function siteOrigin(env: Record<string, string | undefined>): string {
  const explicit = env.KHALIL_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`;
  return DEFAULT_ORIGIN;
}

export function buildPages(origin: string): Page[] {
  return [...homePages(origin), ...topicPages(origin), ...callCenterPages(origin), ...salesPages(origin)];
}

/** Where a page's HTML is written: `/en/x` → `en/x/index.html`, served at `/en/x`. */
export const htmlFile = (path: string) => `${path.replace(/^\//, '')}/index.html`;
export const markdownFile = (path: string) => `${path.replace(/^\//, '')}.md`;

/** Files this build writes that the app doesn't need offline (the service worker skips them). */
export function isSeoFile(file: string): boolean {
  return /^(ar|en)(\/|\.md$)/.test(file) || ['404.html', 'robots.txt', 'sitemap.xml', 'sitemap.md', 'llms.txt', 'og-image.png'].includes(file);
}

/** The home page `/` (the app) and its two language versions. */
const ROOT_ALTERNATES = { ar: ROUTES.home('ar'), en: ROUTES.home('en'), 'x-default': '/' };

function sitemapXml(pages: Page[], origin: string): string {
  const entry = (path: string, alternates?: Page['alternates']) => {
    const links = Object.entries(alternates ?? {})
      .map(([code, href]) => `\n    <xhtml:link rel="alternate" hreflang="${code}" href="${origin}${href}"/>`)
      .join('');
    return `  <url>\n    <loc>${origin}${path === '/' ? '/' : path}</loc>${links}\n  </url>`;
  };
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Khalil's public pages. Each one also has a Markdown copy (add .md to its address); the Markdown map is ${origin}/sitemap.md -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[entry('/', ROOT_ALTERNATES), ...pages.map((p) => entry(p.path, p.alternates))].join('\n')}
</urlset>
`;
}

function robotsTxt(origin: string): string {
  return `# Khalil (خليل): the app is at /, and its free lessons are public pages listed in the sitemap.
# Language models: a Markdown map of every page is at ${origin}/sitemap.md (see also ${origin}/llms.txt).
User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${origin}/sitemap.xml
`;
}

const SECTIONS: Array<{ id: Page['section']; title: string }> = [
  { id: 'home', title: 'Start here' },
  { id: 'topics', title: 'English conversation topics (B1–C1)' },
  { id: 'callcenter', title: 'English call center job prep (Egypt)' },
  { id: 'sales', title: 'Sales, marketing and negotiation (in Arabic)' },
];

function llmsTxt(pages: Page[], origin: string): string {
  const sections = SECTIONS.map(({ id, title }) => {
    const list = pages.filter((p) => p.section === id).map((p) => `- [${p.h1}](${origin}${p.path}.md): ${p.description}`);
    return `## ${title}\n\n${list.join('\n')}`;
  });
  return `# Khalil (خليل)

> Khalil is a free web app in Arabic and English: a daily English path from A1 to C1 with smart flashcards and conversation lessons, preparation for English call center jobs in Egypt, sales lessons in Arabic, and tasks, habits and a daily wird. Its written lessons also open offline. Open ${origin}/ to try it without an account; a Google account keeps the data.

Every public page below has a Markdown copy at the same address plus \`.md\`; the links here go straight to those copies. The full map, with the HTML addresses too, is ${origin}/sitemap.md.

${sections.join('\n\n')}
`;
}

function sitemapMd(pages: Page[], origin: string): string {
  const sections = SECTIONS.map(({ id, title }) => {
    const list = pages.filter((p) => p.section === id).map((p) => `- ${p.h1}: [page](${origin}${p.path}) · [Markdown](${origin}${p.path}.md)`);
    return `## ${title}\n\n${list.join('\n')}`;
  });
  return `# Khalil: map of the public pages\n\nThe app itself is at ${origin}/ (sign-in needed). Everything below is free to read.\n\n${sections.join('\n\n')}\n`;
}

/** Every file to write into dist/, by its path there. */
export function buildSiteFiles(origin: string): Record<string, string> {
  const pages = buildPages(origin);
  const files: Record<string, string> = {
    'robots.txt': robotsTxt(origin),
    'sitemap.xml': sitemapXml(pages, origin),
    'sitemap.md': sitemapMd(pages, origin),
    'llms.txt': llmsTxt(pages, origin),
  };
  for (const page of pages) {
    files[htmlFile(page.path)] = renderHtml(page, origin);
    files[markdownFile(page.path)] = renderMarkdown(page, origin);
  }
  files['404.html'] = renderHtml(notFoundPage(), origin);
  return files;
}

/** What an address under /ar or /en that doesn't exist shows (vercel.json), with a 404 status. */
function notFoundPage(): Page {
  return {
    path: '/404',
    lang: 'ar',
    section: 'home',
    noindex: true,
    title: 'الصفحة غير موجودة | خليل',
    description: 'لم نجد هذه الصفحة.',
    h1: 'لم نجد هذه الصفحة',
    lead: 'ربما تغيّر عنوانها. هذه أهم صفحات خليل:',
    crumbs: [],
    blocks: [
      {
        kind: 'cards',
        items: [
          { href: ROUTES.home('ar'), title: 'الصفحة الرئيسية' },
          { href: ROUTES.topics('ar'), title: 'مواضيع المحادثة بالإنجليزية' },
          { href: ROUTES.callCenter('ar'), title: 'الاستعداد لوظيفة في مركز اتصال' },
          { href: ROUTES.sales, title: 'تعلّم المبيعات' },
        ],
      },
      { kind: 'p', lang: 'en', text: ['Page not found. Try the ', { href: ROUTES.home('en'), label: 'English home page' }, ' or ', { href: ROUTES.topics('en'), label: 'the English topics' }, '.'] },
    ],
  };
}

/**
 * What `/` shows before the app starts, for crawlers that don't run
 * JavaScript: what Khalil is, and links to its free lessons. index.html
 * hides it as soon as JavaScript runs, and the app replaces it.
 */
export function rootLanding(): string {
  const [ar, en] = homePages('');
  const links = [
    { href: ROUTES.home('ar'), label: 'خليل بالعربية', lang: 'ar' },
    { href: ROUTES.topics('ar'), label: 'مواضيع المحادثة بالإنجليزية', lang: 'ar' },
    { href: ROUTES.callCenter('ar'), label: 'الاستعداد لوظيفة في مركز اتصال', lang: 'ar' },
    { href: ROUTES.sales, label: 'تعلّم المبيعات', lang: 'ar' },
    { href: ROUTES.home('en'), label: 'Khalil in English', lang: 'en' },
    { href: ROUTES.topics('en'), label: 'English conversation topics', lang: 'en' },
    { href: ROUTES.callCenter('en'), label: 'Call center job prep', lang: 'en' },
    { href: ROUTES.interview('ar'), label: 'أسئلة مقابلات مراكز الاتصال', lang: 'ar' },
    { href: ROUTES.interview('en'), label: 'Call center interview questions', lang: 'en' },
  ];
  return [
    '<div id="seo-landing">',
    `<h1>${escapeHtml(ar.h1)}</h1>`,
    `<p>${escapeHtml(ar.lead ?? '')}</p>`,
    `<p lang="en" dir="ltr">${escapeHtml(en.lead ?? '')}</p>`,
    `<ul>${links.map((l) => `<li lang="${l.lang}"><a href="${l.href}">${escapeHtml(l.label)}</a></li>`).join('')}</ul>`,
    '</div>',
  ].join('');
}
