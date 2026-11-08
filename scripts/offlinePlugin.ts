import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import type { Plugin, ResolvedConfig } from 'vite';
import { isSeoFile } from '../src/seo/site';

const TEMPLATE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'sw.template.js');

function listFiles(dir: string, base = dir): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full, base) : [path.relative(base, full).split(path.sep).join('/')];
  });
}

/**
 * Writes dist/sw.js after a production build: the service worker from
 * scripts/sw.template.js with the list of every built file to save on the
 * device, so Khalil opens with no internet (see src/lib/offline.ts).
 */
export function offlinePlugin(): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'khalil-offline',
    apply: 'build',
    configResolved(resolved) {
      config = resolved;
    },
    writeBundle(options) {
      const outDir = options.dir ?? config.build.outDir;
      // The public pages for search engines (scripts/seoPlugin.ts) aren't part of the app.
      const files = listFiles(outDir).filter((f) => f !== 'sw.js' && f !== 'index.html' && !f.endsWith('.map') && !isSeoFile(f));
      const precache = ['/', ...files.map((f) => `/${f}`)].sort();

      const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
      const fontCss = html.match(/https:\/\/fonts\.googleapis\.com\/css2\?[^"']+/)?.[0]?.replace(/&amp;/g, '&') ?? null;

      // Built files carry a content hash in their name; the page and the
      // public files don't, so their content goes into the version too.
      const hash = createHash('sha256').update(precache.join('\n')).update(html);
      for (const f of files.filter((f) => !f.startsWith('assets/'))) hash.update(fs.readFileSync(path.join(outDir, f)));
      const version = hash.digest('hex').slice(0, 12);

      const source = fs
        .readFileSync(TEMPLATE, 'utf8')
        .replace('__VERSION__', JSON.stringify(version))
        .replace('__PRECACHE__', JSON.stringify(precache))
        .replace('__FONT_CSS__', JSON.stringify(fontCss));
      fs.writeFileSync(path.join(outDir, 'sw.js'), source);
    },
  };
}
