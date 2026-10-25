/**
 * Khalil's public pages (the ones search engines see): a small page model,
 * and the two ways it is written out: an HTML page that needs no JavaScript,
 * and the same page in Markdown for language models (see ./site.ts).
 */

export type Lang = 'ar' | 'en';

export interface Link {
  href: string;
  label: string;
}

/** Text, or text with links in it. */
export type Rich = string | Array<string | Link>;

export interface WordEntry {
  word: string;
  pos: string;
  definition: string;
  example: string;
  /** The Arabic meaning, when there is one. */
  meaning?: string;
}

export interface Card {
  href: string;
  title: string;
  text?: string;
  meta?: string;
  /** The language of the title and text, when it isn't the page's. */
  lang?: Lang;
}

export type Block =
  | { kind: 'h2'; text: string; id?: string; lang?: Lang }
  | { kind: 'h3'; text: string; id?: string; lang?: Lang }
  | { kind: 'p'; text: Rich; lang?: Lang; note?: boolean }
  | { kind: 'list'; items: Rich[]; ordered?: boolean; lang?: Lang }
  | { kind: 'quote'; text: string; lang?: Lang }
  | { kind: 'words'; items: WordEntry[]; lang?: Lang }
  | { kind: 'cards'; items: Card[] }
  | { kind: 'table'; head: string[]; rows: string[][]; lang?: Lang }
  | { kind: 'check'; title: string; reveal: string; items: Array<{ q: string; options: string[]; answer: number }> }
  | { kind: 'cta'; title: string; text: string; href: string; label: string };

export interface Page {
  /** The URL path, without a trailing slash: `/en/english-topics/friendship`. */
  path: string;
  lang: Lang;
  /** The <title>: what the search result shows. */
  title: string;
  description: string;
  h1: string;
  /** The page's short name in the breadcrumb (the h1 when there is none). */
  crumb?: string;
  lead?: string;
  /** The pages above this one, from the home page down. */
  crumbs: Link[];
  blocks: Block[];
  /** The same page in the other language (and the page for everyone else). */
  alternates?: Partial<Record<Lang | 'x-default', string>>;
  jsonLd?: object[];
  ogType?: 'website' | 'article';
  /** Where the page belongs, for the menu and llms.txt. */
  section: 'home' | 'topics' | 'callcenter' | 'sales';
  /** A page search engines shouldn't keep (the "not found" page): no canonical, no Markdown copy. */
  noindex?: boolean;
}

export const SITE_NAME = { ar: 'خليل', en: 'Khalil' } as const;

/** The menu at the top of every page. */
const NAV: Record<Lang, Array<Link & { section: Page['section'] }>> = {
  ar: [
    { href: '/ar', label: 'الرئيسية', section: 'home' },
    { href: '/ar/english-topics', label: 'مواضيع الإنجليزية', section: 'topics' },
    { href: '/ar/call-center', label: 'مراكز الاتصال', section: 'callcenter' },
    { href: '/ar/sales', label: 'المبيعات', section: 'sales' },
  ],
  en: [
    { href: '/en', label: 'Home', section: 'home' },
    { href: '/en/english-topics', label: 'English topics', section: 'topics' },
    { href: '/en/call-center', label: 'Call center prep', section: 'callcenter' },
    { href: '/ar/sales', label: 'Sales (Arabic)', section: 'sales' },
  ],
};

const UI = {
  ar: {
    skip: 'انتقل إلى المحتوى',
    open: 'افتح خليل مجانًا',
    other: 'English',
    crumbs: 'مسار الصفحة',
    menu: 'القائمة',
    footer: 'خليل تطبيق مجاني بالعربية والإنجليزية لتعلم الإنجليزية والمهارات وتنظيم اليوم، ويعمل دون إنترنت.',
    footerLinks: 'روابط',
    example: 'مثال',
  },
  en: {
    skip: 'Skip to content',
    open: 'Open Khalil — free',
    other: 'العربية',
    crumbs: 'Breadcrumb',
    menu: 'Menu',
    footer: 'Khalil is a free app in Arabic and English for learning English and new skills and planning your day. It works offline.',
    footerLinks: 'Links',
    example: 'Example',
  },
} as const;

export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Cuts a description to about what a search result shows, at a word. */
export function clip(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 20)).replace(/[\s,،.؛:;—-]+$/, '')}…`;
}

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** `lang` and `dir` for a part written in another language than the page. */
function langAttrs(lang: Lang | undefined, page: Lang): string {
  if (!lang || lang === page) return '';
  return ` lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}"`;
}

function linkHtml(link: Link): string {
  const external = isExternal(link.href) ? ' rel="noopener" target="_blank"' : '';
  return `<a href="${escapeHtml(link.href)}"${external}>${escapeHtml(link.label)}</a>`;
}

function richHtml(text: Rich): string {
  if (typeof text === 'string') return escapeHtml(text);
  return text.map((part) => (typeof part === 'string' ? escapeHtml(part) : linkHtml(part))).join('');
}

function blockHtml(block: Block, page: Page): string {
  const lang = page.lang;
  switch (block.kind) {
    case 'h2':
      return `<h2${block.id ? ` id="${block.id}"` : ''}${langAttrs(block.lang, lang)}>${escapeHtml(block.text)}</h2>`;
    case 'h3':
      return `<h3${block.id ? ` id="${block.id}"` : ''}${langAttrs(block.lang, lang)}>${escapeHtml(block.text)}</h3>`;
    case 'p':
      return `<p${block.note ? ' class="note"' : ''}${langAttrs(block.lang, lang)}>${richHtml(block.text)}</p>`;
    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul';
      return `<${tag}${langAttrs(block.lang, lang)}>${block.items.map((item) => `<li>${richHtml(item)}</li>`).join('')}</${tag}>`;
    }
    case 'quote':
      return `<blockquote${langAttrs(block.lang, lang)}><p>${escapeHtml(block.text)}</p></blockquote>`;
    case 'words': {
      // The word, its definition and example are in the block's language; the
      // part of speech and the labels in the page's; the meaning in Arabic.
      const text = langAttrs(block.lang, lang);
      const rows = block.items
        .map(
          (w) =>
            `<li class="word"><p class="w"><strong${text}>${escapeHtml(w.word)}</strong> <span class="pos">${escapeHtml(w.pos)}</span></p>` +
            (w.meaning ? `<p class="meaning"${langAttrs('ar', lang)}>${escapeHtml(w.meaning)}</p>` : '') +
            `<p${text}>${escapeHtml(w.definition)}</p>` +
            `<p class="ex"><span class="label">${UI[lang].example}:</span> <span${text}>${escapeHtml(w.example)}</span></p></li>`
        )
        .join('');
      return `<ol class="words">${rows}</ol>`;
    }
    case 'cards':
      return `<ul class="cards">${block.items
        .map(
          (c) =>
            `<li${langAttrs(c.lang, lang)}><a href="${escapeHtml(c.href)}"><span class="t">${escapeHtml(c.title)}</span>` +
            (c.meta ? `<span class="m">${escapeHtml(c.meta)}</span>` : '') +
            (c.text ? `<span class="d">${escapeHtml(c.text)}</span>` : '') +
            '</a></li>'
        )
        .join('')}</ul>`;
    case 'table':
      return (
        `<div class="table"${langAttrs(block.lang, lang)}><table><thead><tr>${block.head.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>` +
        `<tbody>${block.rows.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
      );
    case 'check':
      return (
        `<div class="check"><h3>${escapeHtml(block.title)}</h3>` +
        block.items
          .map(
            (item) =>
              `<div class="q"><p><strong>${escapeHtml(item.q)}</strong></p><ul>${item.options.map((o) => `<li>${escapeHtml(o)}</li>`).join('')}</ul>` +
              `<details><summary>${escapeHtml(block.reveal)}</summary><p>${escapeHtml(item.options[item.answer])}</p></details></div>`
          )
          .join('') +
        '</div>'
      );
    case 'cta':
      return `<aside class="cta"><h2>${escapeHtml(block.title)}</h2><p>${escapeHtml(block.text)}</p><a class="btn" href="${escapeHtml(block.href)}">${escapeHtml(block.label)}</a></aside>`;
  }
}

/** JSON inside a <script>: nothing in it may close the tag. */
function jsonScript(data: object): string {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

const HREFLANG: Record<Lang | 'x-default', string> = { ar: 'ar', en: 'en', 'x-default': 'x-default' };
const OG_LOCALE: Record<Lang, string> = { ar: 'ar_EG', en: 'en_US' };

export function renderHtml(page: Page, origin: string): string {
  const { lang } = page;
  const ui = UI[lang];
  const url = `${origin}${page.path}`;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const other: Lang = lang === 'ar' ? 'en' : 'ar';
  const otherHref = page.alternates?.[other] ?? `/${other}`;

  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}">`,
    ...(page.noindex
      ? ['<meta name="robots" content="noindex">']
      : [
          `<link rel="canonical" href="${url}">`,
          ...Object.entries(page.alternates ?? {}).map(
            ([code, path]) => `<link rel="alternate" hreflang="${HREFLANG[code as Lang]}" href="${origin}${path}">`
          ),
          `<link rel="alternate" type="text/markdown" href="${url}.md">`,
        ]),
    `<meta property="og:type" content="${page.ogType ?? 'website'}">`,
    `<meta property="og:site_name" content="${SITE_NAME[lang]}">`,
    `<meta property="og:title" content="${escapeHtml(page.title)}">`,
    `<meta property="og:description" content="${escapeHtml(page.description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:locale" content="${OG_LOCALE[lang]}">`,
    `<meta property="og:image" content="${origin}/og-image.png">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="theme-color" content="#c47860">',
    '<link rel="icon" type="image/svg+xml" href="/favicon.svg">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    `<style>${CSS}</style>`,
    ...(page.jsonLd ?? []).map(jsonScript),
  ];

  const nav = NAV[lang]
    .map((l) => `<a href="${l.href}"${l.section === page.section ? ' aria-current="page"' : ''}>${escapeHtml(l.label)}</a>`)
    .join('');

  const crumbs = page.crumbs.length
    ? `<nav class="crumbs" aria-label="${ui.crumbs}"><ol>${page.crumbs.map((c) => `<li>${linkHtml(c)}</li>`).join('')}<li aria-current="page">${escapeHtml(page.crumb ?? page.h1)}</li></ol></nav>`
    : '';

  const footerLinks = [...NAV.ar, ...NAV.en.slice(0, 3)]
    .map((l) => `<a href="${l.href}" lang="${l.href.startsWith('/ar') ? 'ar' : 'en'}">${escapeHtml(l.label)}</a>`)
    .join('');

  return `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
${head.join('\n')}
</head>
<body>
<a class="skip" href="#main">${ui.skip}</a>
<header class="top"><div class="wrap">
<a class="brand" href="/${lang}"><span class="logo" aria-hidden="true">خ</span>${SITE_NAME[lang]}</a>
<nav class="nav" aria-label="${ui.menu}">${nav}</nav>
<a class="lang" href="${otherHref}" lang="${other}" hreflang="${other}">${ui.other}</a>
<a class="btn" href="/">${ui.open}</a>
</div></header>
<main id="main" class="wrap">
${crumbs}
<h1>${escapeHtml(page.h1)}</h1>
${page.lead ? `<p class="lead">${escapeHtml(page.lead)}</p>` : ''}
${page.blocks.map((b) => blockHtml(b, page)).join('\n')}
</main>
<footer class="foot"><div class="wrap">
<p>${ui.footer}</p>
<nav aria-label="${ui.footerLinks}">${footerLinks}</nav>
</div></footer>
</body>
</html>
`;
}

function richMd(text: Rich, origin: string): string {
  if (typeof text === 'string') return text;
  return text.map((part) => (typeof part === 'string' ? part : `[${part.label}](${absolute(part.href, origin)})`)).join('');
}

function absolute(href: string, origin: string): string {
  return isExternal(href) ? href : `${origin}${href}`;
}

function blockMd(block: Block, origin: string): string {
  switch (block.kind) {
    case 'h2':
      return `## ${block.text}`;
    case 'h3':
      return `### ${block.text}`;
    case 'p':
      return richMd(block.text, origin);
    case 'list':
      return block.items.map((item, i) => `${block.ordered ? `${i + 1}.` : '-'} ${richMd(item, origin)}`).join('\n');
    case 'quote':
      return `> ${block.text}`;
    case 'words':
      return block.items
        .map((w, i) => `${i + 1}. **${w.word}** (${w.pos}): ${w.definition}${w.meaning ? ` — ${w.meaning}` : ''}\n   - ${w.example}`)
        .join('\n');
    case 'cards':
      return block.items.map((c) => `- [${c.title}](${absolute(c.href, origin)})${c.meta ? ` · ${c.meta}` : ''}${c.text ? `: ${c.text}` : ''}`).join('\n');
    case 'table':
      return [`| ${block.head.join(' | ')} |`, `| ${block.head.map(() => '---').join(' | ')} |`, ...block.rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
    case 'check':
      return [`### ${block.title}`, ...block.items.map((item) => `- ${item.q} → ${item.options[item.answer]}`)].join('\n');
    case 'cta':
      return `**${block.title}** ${block.text} [${block.label}](${absolute(block.href, origin)})`;
  }
}

/** The same page in Markdown, for language models (linked from llms.txt). */
export function renderMarkdown(page: Page, origin: string): string {
  const parts = [`# ${page.h1}`, `Source: ${origin}${page.path}`];
  if (page.lead) parts.push(`> ${page.lead}`);
  for (const block of page.blocks) parts.push(blockMd(block, origin));
  return `${parts.join('\n\n')}\n`;
}

/**
 * One small stylesheet in every page, so a page shows at once with no other
 * request. Light and dark follow the device; Arabic pages mirror themselves
 * through logical properties (inline-start/end).
 */
const CSS = `
:root{--bg:#faf7f2;--card:#fff;--ink:#2b2320;--soft:#5e514b;--line:#e8ded4;--clay:#9a4f38;--clay-bg:#c47860;--tint:#f4ebe3}
@media (prefers-color-scheme:dark){:root{--bg:#1a1614;--card:#231e1b;--ink:#efe6dd;--soft:#bfb2a8;--line:#3a312c;--clay:#e3a088;--clay-bg:#c47860;--tint:#2b2420}}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.7 system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans Arabic",Tahoma,sans-serif}
html[lang=ar] body{line-height:1.9}
a{color:var(--clay)}
.wrap{max-width:52rem;margin:0 auto;padding:0 16px}
.skip{position:absolute;inset-inline-start:-999px}
.skip:focus{inset-inline-start:8px;top:8px;background:var(--card);padding:8px;z-index:2}
.top{border-bottom:1px solid var(--line);background:var(--card)}
.top .wrap{display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;padding-block:10px}
.brand{display:flex;align-items:center;gap:8px;font-weight:700;font-size:1.15rem;color:var(--ink);text-decoration:none}
.logo{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:9px;background:var(--tint);color:var(--clay);font-size:1.3rem}
.nav{display:flex;gap:4px 14px;flex-wrap:wrap;flex:1 1 auto;font-size:.95rem}
.nav a{color:var(--soft);text-decoration:none;padding:4px 0}
.lang{color:var(--soft);font-size:.95rem}
.nav a[aria-current]{color:var(--ink);font-weight:600;border-bottom:2px solid var(--clay-bg)}
.btn{display:inline-block;background:var(--clay-bg);color:#fff;text-decoration:none;padding:8px 16px;border-radius:10px;font-weight:600;font-size:.95rem}
.btn:hover{filter:brightness(.95)}
main{padding-block:20px 40px}
h1{font-size:clamp(1.6rem,4.5vw,2.2rem);line-height:1.35;margin:.4em 0 .3em}
h2{font-size:1.35rem;line-height:1.4;margin:1.8em 0 .5em}
h3{font-size:1.1rem;margin:1.3em 0 .3em}
.lead{font-size:1.12rem;color:var(--soft);margin-top:0}
.note{background:var(--tint);border-inline-start:4px solid var(--clay-bg);padding:10px 14px;border-radius:8px}
blockquote{margin:1em 0;padding:12px 16px;background:var(--card);border:1px solid var(--line);border-inline-start:4px solid var(--clay-bg);border-radius:10px}
blockquote p{margin:0}
ul,ol{padding-inline-start:1.4em}
li{margin:.25em 0}
.crumbs ol{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:4px;font-size:.88rem;color:var(--soft)}
.crumbs li+li::before{content:"›";margin-inline-end:4px}
[dir=rtl] .crumbs li+li::before{content:"‹"}
.words{list-style:none;padding:0;display:grid;gap:10px}
.word{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px}
.word p{margin:.15em 0}
.word .w{font-size:1.1rem}
.pos{font-size:.8rem;color:var(--soft);font-style:italic}
.label{color:var(--soft);font-size:.9rem}
.ex{color:var(--soft)}
.meaning{color:var(--ink);font-weight:600}
.cards{list-style:none;padding:0;display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(15rem,1fr))}
.cards a{display:flex;flex-direction:column;gap:2px;height:100%;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;text-decoration:none;color:var(--ink)}
.cards a:hover{border-color:var(--clay-bg)}
.cards .t{font-weight:600;color:var(--clay)}
.cards .m{font-size:.82rem;color:var(--soft)}
.cards .d{font-size:.92rem;color:var(--soft)}
.table{overflow-x:auto}
table{border-collapse:collapse;width:100%;font-size:.95rem}
th,td{border:1px solid var(--line);padding:8px 10px;text-align:start;vertical-align:top}
th{background:var(--tint)}
.check .q{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:8px 14px;margin:10px 0}
details summary{cursor:pointer;color:var(--clay)}
.cta{margin:2em 0;background:var(--tint);border:1px solid var(--line);border-radius:14px;padding:16px 18px}
.cta h2{margin-top:0}
.foot{border-top:1px solid var(--line);color:var(--soft);font-size:.92rem;padding-block:16px 28px}
.foot nav{display:flex;flex-wrap:wrap;gap:6px 16px}
.crumbs{line-height:1.5}
html[dir=rtl] main :is(h2,h3,p,blockquote)[dir=ltr]{text-align:right}
@media (max-width:700px){.top .brand{margin-inline-end:auto}.top .btn{padding:6px 12px}.nav{order:3;flex:1 1 100%;flex-wrap:nowrap;overflow-x:auto;white-space:nowrap;font-size:.9rem;padding-bottom:2px}}
`.trim();
