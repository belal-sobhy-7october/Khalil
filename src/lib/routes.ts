/**
 * Each page of Khalil has its own address (/tasks, /focus, /languages/english/listening…),
 * so the browser's back button, a bookmark, a shared link and a reload all land
 * on the page they name. App.tsx still holds the open page; this module maps
 * pages to addresses and back, and keeps the address bar and the tab's title in step.
 */

/** The English hub's tabs, in study order (named in English in both languages, as the owner asked). */
export const ENGLISH_TABS = [
  { id: 'path', label: 'Learning Path' },
  { id: 'vocabulary', label: 'Vocabulary' },
  { id: 'pronunciation', label: 'Pronunciation & Accent' },
  { id: 'listening', label: 'Listening' },
  { id: 'reading', label: 'Reading' },
  { id: 'grammar', label: 'Grammar' },
  { id: 'shadowing', label: 'Shadowing' },
] as const;

export type EnglishTab = (typeof ENGLISH_TABS)[number]['id'];

const ENGLISH_TAB_KEY = 'khalil-english-tab';

/** A tab id, its old name, or nothing. */
function englishTab(value: string | null | undefined): EnglishTab | null {
  if (value === 'accent') return 'pronunciation'; // the tab's old name
  return ENGLISH_TABS.some((t) => t.id === value) ? (value as EnglishTab) : null;
}

/** The English hub's open tab, kept on the device (the learning path when none is). */
export function readEnglishTab(): EnglishTab {
  try {
    return englishTab(localStorage.getItem(ENGLISH_TAB_KEY)) ?? 'path';
  } catch {
    return 'path';
  }
}

export function writeEnglishTab(tab: EnglishTab) {
  try {
    localStorage.setItem(ENGLISH_TAB_KEY, tab);
  } catch {
    // storage blocked: the tab just isn't remembered
  }
}

/** Each page's address; the English hub's tab follows its own (/languages/english/<tab>). */
const PATHS: Record<string, string> = {
  todo: '/tasks',
  focus: '/focus',
  languages: '/languages',
  vocabulary: '/languages/english',
  skills: '/skills',
  callcenter: '/skills/call-center',
  sales: '/skills/sales',
  calendar: '/calendar',
  bookmarks: '/bookmarks',
  analytics: '/analytics',
  settings: '/settings',
};

/** The address of a page (the tasks page for one that has none). */
export function pathFor(section: string, tab?: string): string {
  const base = PATHS[section] ?? PATHS.todo;
  const t = section === 'vocabulary' ? englishTab(tab) : null;
  return t ? `${base}/${t}` : base;
}

export interface Route {
  section: string;
  /** The English hub's tab, when the address names one. */
  tab?: EnglishTab;
}

/** The page an address names, or null for the root and for an address that names none. */
export function routeOf(pathname: string): Route | null {
  let path = pathname;
  try {
    path = decodeURIComponent(pathname);
  } catch {
    // a malformed escape: match it as it is
  }
  path = path.toLowerCase().replace(/\/+$/, '');
  if (!path) return null;
  for (const [section, p] of Object.entries(PATHS)) if (p === path) return { section };
  const english = `${PATHS.vocabulary}/`;
  if (path.startsWith(english)) {
    const tab = englishTab(path.slice(english.length));
    // An unknown tab still opens the English hub, on the tab kept on the device.
    return tab ? { section: 'vocabulary', tab } : { section: 'vocabulary' };
  }
  return null;
}

/**
 * Shows a page's address in the address bar: a new history entry (so Back
 * returns to the page before), or, with `replace`, the current one changed in
 * place (the address the app opened on). Replacing keeps the query and the
 * hash (a sign-in's tokens, "?open=review"); a new page starts without them.
 */
export function showPage(section: string, tab?: string, replace = false) {
  if (typeof window === 'undefined' || !window.history) return;
  const path = pathFor(section, tab);
  if (window.location.pathname === path) return;
  try {
    if (replace) window.history.replaceState(window.history.state, '', `${path}${window.location.search}${window.location.hash}`);
    else window.history.pushState(null, '', path);
  } catch {
    // a browser that refuses history changes still opens the page
  }
}

// The tab's title for the open page. A running focus timer shows its countdown
// there instead (PomodoroEngine) and puts this title back when it stops.
const DEFAULT_TITLE = typeof document !== 'undefined' ? document.title : '';
let pageTitle = DEFAULT_TITLE;

export const getPageTitle = () => pageTitle;

/** Sets the open page's title (`null`: the app's own name, as on the sign-in page). */
export function setPageTitle(title: string | null) {
  const next = title ?? DEFAULT_TITLE;
  // Leave a countdown on the tab alone: the timer puts the page's title back itself.
  if (typeof document !== 'undefined' && document.title === pageTitle) document.title = next;
  pageTitle = next;
}
