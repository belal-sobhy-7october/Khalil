import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getPageTitle, pathFor, readEnglishTab, routeOf, setPageTitle, showPage, writeEnglishTab } from './routes';

const SECTIONS = ['todo', 'focus', 'languages', 'vocabulary', 'skills', 'callcenter', 'sales', 'calendar', 'bookmarks', 'analytics', 'settings'];

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
});

describe('routeOf and pathFor', () => {
  it('gives every page its own address, and reads it back', () => {
    const paths = SECTIONS.map((s) => pathFor(s));
    expect(new Set(paths).size).toBe(SECTIONS.length);
    for (const section of SECTIONS) expect(routeOf(pathFor(section))).toEqual({ section });
  });

  it('puts the English hub tab in the address', () => {
    expect(pathFor('vocabulary', 'listening')).toBe('/languages/english/listening');
    expect(routeOf('/languages/english/listening')).toEqual({ section: 'vocabulary', tab: 'listening' });
    expect(routeOf('/languages/english/path')).toEqual({ section: 'vocabulary', tab: 'path' });
    // The tab's old name, and a tab that doesn't exist (the hub then opens on the tab kept on the device).
    expect(routeOf('/languages/english/accent')).toEqual({ section: 'vocabulary', tab: 'pronunciation' });
    expect(routeOf('/languages/english/nope')).toEqual({ section: 'vocabulary' });
    // Only the English hub has tabs in its address.
    expect(pathFor('focus', 'listening')).toBe('/focus');
    expect(pathFor('vocabulary', 'nope')).toBe('/languages/english');
  });

  it('reads an address loosely: case, a trailing slash, escapes', () => {
    expect(routeOf('/Focus/')).toEqual({ section: 'focus' });
    expect(routeOf('/skills/call-center//')).toEqual({ section: 'callcenter' });
    expect(routeOf('/%66ocus')).toEqual({ section: 'focus' });
    expect(routeOf('/%E0%A4%A')).toBeNull();
  });

  it('names no page for the root or an unknown address', () => {
    expect(routeOf('/')).toBeNull();
    expect(routeOf('')).toBeNull();
    expect(routeOf('/wird')).toBeNull();
    expect(routeOf('/index.html')).toBeNull();
    expect(routeOf('/focus/extra')).toBeNull();
    expect(pathFor('wird')).toBe('/tasks');
  });
});

describe('showPage', () => {
  it('adds a history entry for a new page, and none for the page already shown', () => {
    const before = window.history.length;
    showPage('focus');
    expect(window.location.pathname).toBe('/focus');
    expect(window.history.length).toBe(before + 1);
    showPage('focus');
    expect(window.history.length).toBe(before + 1);
  });

  it('replaces the address it opened on, keeping its query and hash (a sign-in, ?open=review)', () => {
    window.history.replaceState(null, '', '/?open=review#access_token=abc');
    const before = window.history.length;
    showPage('todo', undefined, true);
    expect(window.location.pathname + window.location.search + window.location.hash).toBe('/tasks?open=review#access_token=abc');
    expect(window.history.length).toBe(before);
  });

  it('starts a new page without the old one\'s query', () => {
    window.history.replaceState(null, '', '/tasks?open=review');
    showPage('vocabulary', 'grammar');
    expect(window.location.pathname + window.location.search).toBe('/languages/english/grammar');
  });
});

describe('the English hub tab on the device', () => {
  it('defaults to the learning path and reads the old tab name', () => {
    expect(readEnglishTab()).toBe('path');
    localStorage.setItem('khalil-english-tab', 'accent');
    expect(readEnglishTab()).toBe('pronunciation');
    writeEnglishTab('reading');
    expect(readEnglishTab()).toBe('reading');
    localStorage.setItem('khalil-english-tab', 'gone');
    expect(readEnglishTab()).toBe('path');
  });
});

describe('setPageTitle', () => {
  const original = document.title;
  afterEach(() => {
    setPageTitle(null);
    document.title = original;
  });

  it('names the open page, and leaves a running timer\'s countdown on the tab', () => {
    setPageTitle(null);
    document.title = getPageTitle();
    setPageTitle('Focus — Khalil');
    expect(document.title).toBe('Focus — Khalil');
    // The focus timer shows its countdown; a page change doesn't wipe it, and the timer puts the new title back.
    document.title = '🍅 24:59 · Focus';
    setPageTitle('Settings — Khalil');
    expect(document.title).toBe('🍅 24:59 · Focus');
    expect(getPageTitle()).toBe('Settings — Khalil');
  });
});
