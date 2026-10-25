/**
 * Structured data (schema.org JSON-LD) for the public pages. Only facts that
 * the page itself shows: no ratings, prices or dates it doesn't have.
 */
import { SITE_NAME, type Lang, type Link } from './render';

const CONTEXT = 'https://schema.org';

export function breadcrumbs(crumbs: Link[], current: string, path: string, origin: string): object {
  const items = [...crumbs, { href: path, label: current }];
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `${origin}${item.href}`,
    })),
  };
}

/** Who publishes the pages: Khalil itself. */
export function publisher(origin: string): object {
  return {
    '@type': 'Organization',
    name: SITE_NAME.en,
    alternateName: SITE_NAME.ar,
    url: `${origin}/`,
    logo: `${origin}/icon-512.png`,
  };
}

export function website(origin: string): object {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    name: SITE_NAME.en,
    alternateName: SITE_NAME.ar,
    url: `${origin}/`,
    inLanguage: ['ar', 'en'],
    publisher: publisher(origin),
  };
}

export function webApplication(origin: string, lang: Lang, description: string, features: string[]): object {
  return {
    '@context': CONTEXT,
    '@type': 'WebApplication',
    name: SITE_NAME[lang],
    alternateName: lang === 'ar' ? SITE_NAME.en : SITE_NAME.ar,
    url: `${origin}/`,
    description,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any (web browser): Android, iOS, Windows, macOS',
    browserRequirements: 'Requires JavaScript.',
    inLanguage: ['ar', 'en'],
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: features,
    image: `${origin}/icon-512.png`,
    publisher: publisher(origin),
  };
}

export function article(opts: { origin: string; path: string; lang: Lang; headline: string; description: string; about?: string[]; citation?: string }): object {
  return {
    '@context': CONTEXT,
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    inLanguage: opts.lang,
    url: `${opts.origin}${opts.path}`,
    mainEntityOfPage: `${opts.origin}${opts.path}`,
    isAccessibleForFree: true,
    image: `${opts.origin}/og-image.png`,
    author: publisher(opts.origin),
    publisher: publisher(opts.origin),
    ...(opts.about ? { about: opts.about } : {}),
    ...(opts.citation ? { citation: opts.citation } : {}),
  };
}

/** A collection page: the list of lessons in a hub. */
export function itemList(origin: string, name: string, items: Link[]): object {
  return {
    '@context': CONTEXT,
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.label, url: `${origin}${item.href}` })),
  };
}
