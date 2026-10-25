import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import { DEFAULT_ORIGIN, buildSiteFiles, rootLanding, siteOrigin } from '../src/seo/site';

/**
 * Writes Khalil's public pages after a production build: the free lessons as
 * plain HTML pages (and Markdown copies), sitemap.xml, robots.txt, llms.txt.
 * It also puts a short description with links inside index.html's #root, for
 * crawlers that don't run JavaScript. See src/seo/site.ts.
 */
export function seoPlugin(): Plugin {
  let config: ResolvedConfig;
  const origin = siteOrigin(process.env);
  return {
    name: 'khalil-seo',
    configResolved(resolved) {
      config = resolved;
    },
    // `vite preview` serves the public pages the way vercel.json does: /ar/x
    // from ar/x/index.html, and an address under /ar or /en that doesn't exist
    // with 404.html (everything else still opens the app).
    configurePreviewServer(server) {
      const outDir = path.resolve(config.root, config.build.outDir);
      server.middlewares.use((req, res, next) => {
        const pathname = decodeURIComponent((req.url ?? '/').split('?')[0]);
        if (req.method !== 'GET' || !/^\/(ar|en)(\/[^.]*)?$/.test(pathname)) return next();
        const file = path.join(outDir, pathname, 'index.html');
        const found = file.startsWith(outDir) && fs.existsSync(file);
        res.statusCode = found ? 200 : 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(fs.readFileSync(found ? file : path.join(outDir, '404.html')));
      });
    },
    transformIndexHtml(html) {
      return html.replace('<!--seo-landing-->', rootLanding()).replaceAll(DEFAULT_ORIGIN, origin);
    },
    writeBundle: {
      // Before khalil-offline, which lists the files it saves on the device.
      order: 'pre',
      sequential: true,
      handler(options) {
        if (config.command !== 'build') return;
        const outDir = options.dir ?? config.build.outDir;
        for (const [file, content] of Object.entries(buildSiteFiles(origin))) {
          const full = path.join(outDir, file);
          fs.mkdirSync(path.dirname(full), { recursive: true });
          fs.writeFileSync(full, content);
        }
      },
    },
  };
}
