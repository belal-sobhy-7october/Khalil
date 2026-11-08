#!/usr/bin/env python3
"""
Check every Topic Library word against the Cambridge Dictionary.

For each word in src/data/topicPacks/{a1,a2,b1,b2,c1}.ts, look up its Cambridge
page and record its senses (part of speech, guideword, CEFR level) in
src/data/topicPacks/wordSources.json — the test needs an entry for every word.
Definitions are not copied: write your own from the sense (see the README).

Then it prints what needs a look:
  - words Cambridge doesn't have (replace them or find another reference),
  - words two or more levels above their lesson.

Pages are cached in node_modules/.cache/cambridge (or $CAMBRIDGE_CACHE), one
request every ~1.2 s, with an honest user agent.

usage: python3 scripts/check-word-levels.py
"""
import html
import json
import os
import re
import subprocess
import time
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PACKS = ROOT / 'src/data/topicPacks'
OUT = PACKS / 'wordSources.json'
CACHE = Path(os.environ.get('CAMBRIDGE_CACHE', ROOT / 'node_modules/.cache/cambridge'))
UA = 'Khalil-word-check/1.0 (checks vocabulary levels for a learning app)'
LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']


def fetch(word: str) -> tuple[str, str]:
    CACHE.mkdir(parents=True, exist_ok=True)
    key = re.sub(r'[^a-z0-9]+', '_', word.lower()).strip('_')
    page, url = CACHE / f'{key}.html', CACHE / f'{key}.url'
    if page.exists():
        return page.read_text(), url.read_text()
    q = urllib.parse.quote(word)
    r = subprocess.run(
        ['curl', '-sS', '-L', '-A', UA, '--max-time', '25', '-w', '\n%{url_effective}',
         f'https://dictionary.cambridge.org/search/direct/?datasetsearch=english&q={q}'],
        capture_output=True, text=True,
    )
    body, _, final = r.stdout.rpartition('\n')
    time.sleep(1.2)
    page.write_text(body)
    url.write_text(final)
    return body, final


def text(s: str) -> str:
    return html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', s))).strip()


STOP = set("""a an the of to in on for with and or but by at as from that this which who whom whose
what when where how is are was were be been being it its your you someone something somebody their them they
he she his her we our us not no do does did has have had can could will would may might should must very more
most than so such into out up down over about off often usually especially particular kind type way thing things
person people""".split())


def tokens(s: str) -> set[str]:
    out = set()
    for w in re.findall(r"[a-z]+", s.lower()):
        if w in STOP or len(w) < 3:
            continue
        for suf in ('ing', 'ed', 'es', 's', 'ly'):
            if w.endswith(suf) and len(w) - len(suf) >= 4:
                w = w[: -len(suf)]
                break
        out.add(w)
    return out


def senses(page: str) -> list[dict]:
    """Every definition on the page (English and American dictionaries) with its guideword and CEFR level."""
    out = []
    prev_end = 0
    for m in re.finditer(r'class="def ddef_d db">(.*?)</div>', page, re.S):
        before = page[prev_end:m.start()]
        prev_end = m.end()
        lv = re.findall(r'class="epp-xref[^"]*"[^>]*>(\w+)<', before)
        gw = re.findall(r'class="guideword dsense_gw"[^>]*>.*?\((.*?)\)', before, re.S)
        out.append({'gw': text(gw[-1]) if gw else '', 'level': lv[-1] if lv else '', 'def': text(m.group(1))})
    return out


def best_sense(definition: str, ss: list[dict]) -> tuple[dict | None, float]:
    """The Cambridge definition that shares the most meaning words with ours."""
    mine = tokens(definition)
    best, score = None, 0.0
    for s in ss:
        theirs = tokens(s['def'])
        if not theirs or not mine:
            continue
        overlap = len(mine & theirs) / min(len(mine), len(theirs))
        if overlap > score or (overlap == score and best and not best['level'] and s['level']):
            best, score = s, overlap
    return best, score


def pack_words() -> list[tuple[str, str, str, str]]:
    """(pack id, pack level, word, our definition) for every word line."""
    out = []
    for level in ['a1', 'a2', 'b1', 'b2', 'c1']:
        src = (PACKS / f'{level}.ts').read_text()
        for chunk in src.split('\n  pack(')[1:]:
            pid = re.search(r"id: '([a-z0-9-]+)'", chunk).group(1)
            lv = re.search(r"level: '(\w+)'", chunk).group(1)
            for line in chunk.split('\n'):
                if re.match(r'^(n|v|adj|adv|pv|i|p) \|', line):
                    parts = [x.strip() for x in line.split('|')]
                    out.append((pid, lv, parts[1], parts[2]))
    return out


# Words whose Cambridge entry is under another form: a phrase made of a headword we
# check by that word (food waste → waste), or a search that lands on the wrong entry.
URLS: dict[str, str] = {
    'nice to meet you': 'meet',
    'fill in for': 'fill in',
    'make a complaint': 'complaint',
    'cut back on': 'cut back',
    'cut down on': 'cut down',
    'stay in shape': 'shape',
    'waste of time': 'waste',
    'run late': 'late',
    'break the fast': 'fast',
    'counterargument': 'counter-argument',
    'private tutoring': 'tutor',
    'standardized test': 'standardize',
    'housing shortage': 'shortage',
    'a double-edged sword': 'double-edged sword',
    'food waste': 'waste',
    'fear of missing out': 'FOMO',
    'a slippery slope': 'slippery slope',
    'aging population': 'aging',
    'root cause': 'root',
    'unintended consequences': 'unintended',
    'algorithmic bias': 'algorithmic',
    'informal settlement': 'settlement',
    'energy transition': 'transition',
    'media literacy': 'literacy',
    'wealth gap': 'gap',
    'tamper with': 'tamper',
    'hybrid identity': 'hybrid',
    'culture shift': 'shift',
    'equitable access': 'equitable',
    'stick to': 'stick to something',
    'catch someone red-handed': 'red-handed',
}


def main():
    words = pack_words()
    result = {}
    missing, too_hard, unsure = [], [], []
    for i, (pid, lv, word, definition) in enumerate(words):
        page, url = fetch(URLS.get(word.lower(), word))
        found = '/dictionary/english/' in url and 'spellcheck' not in url
        ss = senses(page) if found else []
        best, score = best_sense(definition, ss)
        level = best['level'] if best and best['level'] in LEVELS else ''
        result[word.lower()] = {'url': url if found else '', 'level': level, 'sense': best['gw'] if best else ''}
        if not found:
            missing.append(f'{pid}: {word}')
        elif score < 0.34:
            unsure.append(f'{pid}: {word} — ours: {definition} | closest: {best["def"] if best else "-"}')
        elif level and LEVELS.index(level) - LEVELS.index(lv) >= 2:
            too_hard.append(f'{pid} ({lv}): {word} — Cambridge {level} ({best["gw"] or best["def"][:50]})')
        if i % 100 == 0:
            print(f'{i}/{len(words)}', flush=True)
    OUT.write_text(json.dumps(dict(sorted(result.items())), ensure_ascii=False, indent=1) + '\n')
    print(f'{len(result)} words → {OUT.relative_to(ROOT)}')
    print(f'\nNot in Cambridge ({len(missing)}):', *missing, sep='\n  ')
    print(f'\nNo Cambridge sense close to our definition — read them ({len(unsure)}):', *unsure, sep='\n  ')
    print(f'\nTwo or more levels above their lesson ({len(too_hard)}):', *too_hard, sep='\n  ')


if __name__ == '__main__':
    main()
