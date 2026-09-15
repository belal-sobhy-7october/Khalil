/// <reference types="node" />
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { translations } from './translations';

const SRC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Matches t('some.key') / t("some.key") — a literal single-argument call.
// Deliberately does NOT match template-literal calls like t(`todo.${p}`),
// since those resolve to a key only at runtime and can't be checked statically.
const T_CALL_REGEX = /\bt\(\s*(['"])((?:(?!\1).)+)\1\s*\)/g;

function walkTsxFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkTsxFiles(fullPath);
    if (entry.isFile() && entry.name.endsWith('.tsx')) return [fullPath];
    return [];
  });
}

function findLiteralKeysInFile(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const keys: string[] = [];
  for (const match of content.matchAll(T_CALL_REGEX)) {
    keys.push(match[2]);
  }
  return keys;
}

function resolvePath(obj: unknown, keyPath: string): unknown {
  return keyPath.split('.').reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in acc) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, obj);
}

// Recursively collects every dot-path in a translations object that resolves
// to a leaf string value (i.e. an actual translatable key, not a namespace).
function collectLeafKeyPaths(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [];
  return Object.entries(obj).flatMap(([key, value]) => {
    const keyPath = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? [keyPath] : collectLeafKeyPaths(value, keyPath);
  });
}

describe('translation keys used in the app', () => {
  const tsxFiles = walkTsxFiles(SRC_DIR);
  const usedKeysByFile = new Map<string, string[]>();
  for (const file of tsxFiles) {
    const keys = findLiteralKeysInFile(file);
    if (keys.length > 0) usedKeysByFile.set(file, keys);
  }

  // Sanity check on the scan itself: if this ever finds zero t('...') calls,
  // the regex or file walk is broken, not that the app stopped using i18n.
  it('finds t(\'...\') calls across the codebase (scan sanity check)', () => {
    const totalUsedKeys = [...usedKeysByFile.values()].flat();
    expect(totalUsedKeys.length).toBeGreaterThan(50);
  });

  it('every literal t(\'...\') key used in a .tsx file exists in both en and ar', () => {
    const missing: string[] = [];
    for (const [file, keys] of usedKeysByFile) {
      const relativeFile = path.relative(SRC_DIR, file);
      for (const key of keys) {
        const inEn = typeof resolvePath(translations.en, key) === 'string';
        const inAr = typeof resolvePath(translations.ar, key) === 'string';
        if (!inEn) missing.push(`${relativeFile}: '${key}' missing in en`);
        if (!inAr) missing.push(`${relativeFile}: '${key}' missing in ar`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('en and ar define exactly the same set of translation keys', () => {
    const enKeys = new Set(collectLeafKeyPaths(translations.en));
    const arKeys = new Set(collectLeafKeyPaths(translations.ar));

    const missingInAr = [...enKeys].filter((k) => !arKeys.has(k)).sort();
    const missingInEn = [...arKeys].filter((k) => !enKeys.has(k)).sort();

    expect({ missingInAr, missingInEn }).toEqual({ missingInAr: [], missingInEn: [] });
  });
});
