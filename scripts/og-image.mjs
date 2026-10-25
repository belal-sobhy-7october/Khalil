// Draws public/og-image.png: the 1200×630 picture that WhatsApp, Facebook, X
// and LinkedIn show when someone shares a link to Khalil (og:image in
// index.html and every public page). Run it again after changing the text:
//   node scripts/og-image.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = createRequire(import.meta.url)('playwright');
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'og-image.png');

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Inter:wght@500;700&family=Tajawal:wght@500;700;900&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #1a1614; color: #efe6dd; font-family: Tajawal, sans-serif; position: relative; overflow: hidden; }
  .glow { position: absolute; inset: auto -120px -220px auto; width: 640px; height: 640px; border-radius: 50%; background: radial-gradient(circle, rgba(196,120,96,.35), rgba(196,120,96,0) 70%); }
  .mark { position: absolute; top: 70px; right: 80px; width: 150px; height: 150px; border-radius: 34px; background: #2b2420; display: grid; place-items: center; font: 700 110px/1 Amiri, serif; color: #e3a088; padding-bottom: 18px; }
  .name { position: absolute; top: 78px; right: 260px; text-align: right; }
  .name h1 { font: 900 96px/1.1 Tajawal, sans-serif; }
  .name p { font: 700 40px/1.2 Inter, sans-serif; color: #c9b8ab; margin-top: 4px; direction: ltr; text-align: right; }
  .ar { position: absolute; right: 80px; top: 300px; direction: rtl; font: 700 50px/1.45 Tajawal, sans-serif; text-align: right; width: 1040px; }
  .en { position: absolute; left: 80px; right: 80px; bottom: 70px; font: 500 26px/1.4 Inter, sans-serif; color: #c9b8ab; }
  .en b { color: #e3a088; font-weight: 700; }
  .bar { position: absolute; right: 80px; top: 270px; width: 120px; height: 6px; border-radius: 3px; background: #c47860; }
</style></head>
<body>
  <div class="glow"></div>
  <div class="mark">خ</div>
  <div class="name"><h1>خليل</h1><p>Khalil</p></div>
  <div class="bar"></div>
  <div class="ar">تعلّم الإنجليزية مجانًا، واستعد لوظيفتك،<br>ونظّم يومك وعاداتك. ويعمل دون إنترنت.</div>
  <div class="en"><b>Free</b> · Learn English · Call center &amp; sales prep · Tasks &amp; habits · Works offline</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: OUT });
await browser.close();
console.log(`wrote ${OUT}`);
