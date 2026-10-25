/// <reference types="node" />
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { TOPIC_PACKS } from '../data/topicPacks';
import { QUESTIONS, VOCAB_UNITS } from '../data/callCenter';
import { ALL_CHAPTERS } from '../data/sales/knowledge';
import { arCount, NOUNS } from './arabicCount';
import { clip } from './render';
import { DEFAULT_ORIGIN, buildPages, buildSiteFiles, htmlFile, isSeoFile, rootLanding, siteOrigin } from './site';
import { AR } from './pages/callCenter';
import { HIRING_STAGES, SALARY_GUIDE, TARGETS } from '../data/callCenter/resources';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ORIGIN = 'https://example.org';
const pages = buildPages(ORIGIN);
const files = buildSiteFiles(ORIGIN);
const paths = new Set(pages.map((p) => p.path));

describe('public pages', () => {
  it('has a page for every lesson, question, unit and chapter', () => {
    for (const p of TOPIC_PACKS) expect(paths).toContain(`/en/english-topics/${p.id}`);
    for (const q of QUESTIONS) expect(paths).toContain(`/en/call-center/interview-questions/${q.id}`);
    expect(pages.filter((p) => p.path.startsWith('/en/call-center/vocabulary/'))).toHaveLength(VOCAB_UNITS.length);
    expect(pages.filter((p) => p.path.startsWith('/ar/sales/'))).toHaveLength(ALL_CHAPTERS.length);
  });

  it('gives every page its own address, title, description and heading', () => {
    expect(paths.size).toBe(pages.length);
    expect(new Set(pages.map((p) => p.title)).size).toBe(pages.length);
    expect(new Set(pages.map((p) => p.description)).size).toBe(pages.length);
    for (const p of pages) {
      expect(p.path, p.path).toMatch(/^\/(ar|en)(\/[a-z0-9-]+)*$/);
      expect(p.title.length, p.path).toBeGreaterThan(10);
      expect(p.description.length, p.path).toBeGreaterThan(50);
      expect(p.description.length, p.path).toBeLessThanOrEqual(200);
      expect(p.h1.trim(), p.path).not.toBe('');
    }
  });

  it('pairs the two languages both ways (hreflang)', () => {
    for (const p of pages) {
      if (!p.alternates) continue;
      expect(p.alternates[p.lang], `${p.path} lists itself`).toBe(p.path);
      for (const target of Object.values(p.alternates)) {
        if (target === '/') continue;
        const other = pages.find((x) => x.path === target);
        expect(other, `${p.path} → ${target}`).toBeDefined();
        expect(other!.alternates, `${target} links back to ${p.path}`).toEqual(p.alternates);
      }
    }
  });

  it('links only to pages and files that exist', () => {
    const publicFiles = new Set(fs.readdirSync(path.join(ROOT, 'public')).map((f) => `/${f}`));
    const known = (href: string) => href === '/' || paths.has(href) || publicFiles.has(href);
    for (const [file, html] of Object.entries(files)) {
      if (!file.endsWith('.html')) continue;
      for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)) {
        expect(known(href), `${file} links to ${href}`).toBe(true);
      }
    }
  });

  it('writes valid structured data', () => {
    for (const [file, html] of Object.entries(files)) {
      for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        const data = JSON.parse(json);
        expect(data['@context'], file).toBe('https://schema.org');
      }
    }
  });

  it('lists every page in sitemap.xml once, with the right address', () => {
    const locs = [...files['sitemap.xml'].matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.sort()).toEqual([`${ORIGIN}/`, ...pages.map((p) => `${ORIGIN}${p.path}`)].sort());
    expect(files['robots.txt']).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
    expect(files['robots.txt']).toContain('Disallow: /api/');
  });

  it('gives every page a Markdown copy, listed in llms.txt', () => {
    for (const p of pages) {
      expect(files[`${p.path.slice(1)}.md`], p.path).toContain(`# ${p.h1}`);
      expect(files['llms.txt']).toContain(`${ORIGIN}${p.path}.md)`);
    }
  });

  it('serves every page through vercel.json the way it is written', () => {
    const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8')) as { rewrites: Array<{ source: string; destination: string }> };
    // Turns `/:p1(ar|en)/:p2` into a pattern, and fills the destination with what it matched.
    const route = (pathname: string) => {
      for (const { source, destination } of config.rewrites) {
        const names: string[] = [];
        const pattern = source.replace(/:(\w+)(\([^)]*\))?/g, (_, name: string, group?: string) => {
          names.push(name);
          return group ?? '([^/]+)';
        });
        const match = new RegExp(`^${pattern}$`).exec(pathname);
        if (match) return names.reduce((dest, name, i) => dest.replace(`:${name}`, match[i + 1]), destination);
      }
      return null;
    };
    for (const p of pages) expect(route(p.path), p.path).toBe(`/${htmlFile(p.path)}`);
    expect(route('/settings')).toBe('/index.html');
  });

  it('keeps the public pages out of what the app saves offline', () => {
    for (const file of Object.keys(files)) expect(isSeoFile(file), file).toBe(true);
    for (const file of ['index.html', 'sw.js', 'assets/index-abc.js', 'manifest.webmanifest', 'icon-192.png']) expect(isSeoFile(file), file).toBe(false);
  });

  it('describes Khalil inside index.html for crawlers without JavaScript', () => {
    const landing = rootLanding();
    expect(landing).toContain('href="/ar/english-topics"');
    expect(landing).toContain('href="/en/call-center/interview-questions"');
    expect(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')).toContain('<div id="root"><!--seo-landing--></div>');
  });

  it('has Arabic for everything the Arabic call center guide shows', () => {
    for (const s of HIRING_STAGES) expect(AR.stages[s.id], s.id).toBeDefined();
    for (const t of TARGETS) expect(AR.targets[t.name], t.name).toBeDefined();
    for (const s of SALARY_GUIDE) expect(AR.salaries[s.level], s.level).toBeDefined();
  });
});

describe('helpers', () => {
  it('picks the site address', () => {
    expect(siteOrigin({})).toBe(DEFAULT_ORIGIN);
    expect(siteOrigin({ VERCEL_PROJECT_PRODUCTION_URL: 'khalil.app' })).toBe('https://khalil.app');
    expect(siteOrigin({ KHALIL_SITE_URL: 'https://www.khalil.app/', VERCEL_PROJECT_PRODUCTION_URL: 'x.vercel.app' })).toBe('https://www.khalil.app');
  });

  it('writes Arabic numbers with the right noun', () => {
    expect(arCount(2, NOUNS.lesson)).toBe('درسان');
    expect(arCount(7, NOUNS.lesson)).toBe('7 دروس');
    expect(arCount(90, NOUNS.lesson)).toBe('90 درسًا');
    expect(arCount(100, NOUNS.lesson)).toBe('100 درس');
    expect(arCount(384, NOUNS.word)).toBe('384 كلمةً');
    expect(arCount(103, NOUNS.word)).toBe('103 كلمات');
  });

  it('cuts long descriptions at a word', () => {
    expect(clip('short text')).toBe('short text');
    const long = clip('word '.repeat(60));
    expect(long.length).toBeLessThanOrEqual(160);
    expect(long.endsWith('word…')).toBe(true);
  });
});
