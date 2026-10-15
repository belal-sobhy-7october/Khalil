import type { VocabularyItemType } from '../types';

export interface ParsedRow {
  word: string;
  type: VocabularyItemType;
  definition: string;
  exampleSentence?: string;
  pronunciation?: string;
  categoryName?: string;
  level?: string;
  warnings: string[];
}

export interface ParseIssue {
  line?: number;
  message: string;
  severity: 'warning' | 'error';
}

export interface ParseResult {
  rows: ParsedRow[];
  errors: ParseIssue[];
}

type SectionType = 'word' | 'verb' | 'idiom' | 'phrase';

const PHRASAL_VERBS = [
  'come across', 'come up with', 'come down with', 'come in', 'come out',
  'come back', 'come over', 'come around', 'come by', 'come to',
  'go on', 'go back', 'go out', 'go up', 'go down', 'go in', 'go off',
  'go through', 'go over', 'go ahead', 'go after', 'go along', 'go away',
  'get up', 'get on', 'get off', 'get out', 'get in', 'get along', 'get by',
  'get away', 'get back', 'get down', 'get over', 'get through', 'get together',
  'put on', 'put off', 'put up', 'put down', 'put out', 'put away', 'put back',
  'put through', 'put together', 'put up with', 'put up with',
  'take on', 'take off', 'take up', 'take down', 'take out', 'take back',
  'take over', 'take after', 'take apart', 'take away',
  'make up', 'make out', 'make over', 'make up for', 'make do',
  'look up', 'look for', 'look at', 'look after', 'look into', 'look forward to',
  'look over', 'look through', 'look down on', 'look up to',
  'turn on', 'turn off', 'turn up', 'turn down', 'turn around', 'turn out',
  'turn over', 'turn into', 'turn away', 'turn back',
  'bring up', 'bring back', 'bring out', 'bring about', 'bring forward',
  'call off', 'call up', 'call on', 'call back', 'call out', 'call for',
  'carry on', 'carry out', 'carry over', 'carry through',
  'break down', 'break up', 'break out', 'break in', 'break through',
  'run out', 'run up', 'run down', 'run over', 'run into', 'run away',
  'set up', 'set out', 'set off', 'set up', 'set back',
  'give up', 'give in', 'give out', 'give away', 'give back',
  'find out', 'find out', 'find out',
  'work out', 'work up', 'work on', 'work through',
  'pick up', 'pick out', 'pick up',
  'pay off', 'pay back', 'pay for',
  'hold on', 'hold up', 'hold back', 'hold out',
  'keep on', 'keep up', 'keep out', 'keep off',
  'let down', 'let out', 'let in', 'let go',
  'stand up', 'stand out', 'stand for', 'stand by',
  'sit down', 'sit up', 'sit out',
  'write down', 'write up', 'write out', 'write off',
  'read out', 'read over', 'read through',
  'speak up', 'speak out', 'speak to',
  'listen up', 'listen to', 'listen for',
  'wait for', 'wait on', 'wait up',
  'watch out', 'watch over', 'watch out for',
  'walk in', 'walk out', 'walk up', 'walk down', 'walk away',
  'run into', 'run across', 'run after',
  'come up', 'come down', 'come in', 'come out', 'come over', 'come by',
  'go on', 'go back', 'go out', 'go up', 'go down', 'go in', 'go off',
  'get up', 'get on', 'get off', 'get out', 'get in', 'get along',
  'put on', 'put off', 'put up', 'put down', 'put out', 'put away',
  'take on', 'take off', 'take up', 'take down', 'take out', 'take back',
  'make up', 'make out', 'make over',
  'look up', 'look for', 'look at', 'look after', 'look into',
  'turn on', 'turn off', 'turn up', 'turn down', 'turn around',
  'bring up', 'bring back', 'bring out', 'bring about',
  'call off', 'call up', 'call on', 'call back',
  'carry on', 'carry out', 'carry over',
  'break down', 'break up', 'break out',
  'run out', 'run up', 'run down',
  'set up', 'set out', 'set off',
  'give up', 'give in', 'give out',
  'find out', 'figure out',
  'work out', 'work up',
  'pick up', 'pick out',
  'pay off', 'pay back',
  'hold on', 'hold up',
  'keep on', 'keep up',
  'let down', 'let out',
  'stand up', 'stand out',
  'sit down', 'sit up',
  'write down', 'write up',
  'read out', 'read over',
  'speak up', 'speak out',
  'listen up', 'listen to',
  'wait for', 'wait on',
  'watch out', 'watch over',
  'walk in', 'walk out',
];

function stripRtlMarks(text: string): string {
  return text.replace(/[\u200E\u200F\u202A-\u202E]/g, '');
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}


function isMostlyArabic(text: string): boolean {
  const letters = text.replace(/[^a-zA-Z\u0600-\u06FF]/g, '');
  if (!letters) return false;
  const arabicCount = (letters.match(/[\u0600-\u06FF]/g) || []).length;
  return arabicCount / letters.length > 0.5;
}

function isMostlyLatin(text: string): boolean {
  const letters = text.replace(/[^a-zA-Z\u0600-\u06FF]/g, '');
  if (!letters) return false;
  const latinCount = (letters.match(/[a-zA-Z]/g) || []).length;
  return latinCount / letters.length > 0.5;
}

function detectSectionType(line: string): SectionType | null {
  const lower = line.toLowerCase();
  if (lower.includes('idiom')) return 'idiom';
  if (lower.includes('phrasal') || lower.includes('verb')) return 'verb';
  return null;
}

function inferType(word: string, sectionType: SectionType | null, defaultType: VocabularyItemType): VocabularyItemType {
  if (sectionType) return sectionType;
  if (defaultType !== 'word') return defaultType;
  
  const lower = word.toLowerCase();
  for (const pv of PHRASAL_VERBS) {
    if (lower.startsWith(pv + ' ') || lower === pv) return 'verb';
  }
  if (word.includes(' ') && !/^[a-z]+ [a-z]+$/.test(lower)) return 'phrase';
  if (word.includes(' ')) return 'phrase';
  return 'word';
}

function parseCSV(text: string): { headers: string[]; rows: string[][] } | null {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return null;
  
  const firstLine = lines[0].trim();
  if (!firstLine.includes(',') && !firstLine.includes('\t')) return null;
  
  const delimiter = firstLine.includes('\t') && !firstLine.includes(',') ? '\t' : ',';
  
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };
  
  const headers = parseLine(firstLine).map(h => h.trim().toLowerCase());
  const rows = lines.slice(1).map(l => parseLine(l));
  return { headers, rows };
}

function parseJSON(text: string): unknown[] | null {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
}

function parseNumberedList(text: string, defaultType: VocabularyItemType): ParseResult {
  const lines = text.split('\n');
  const rows: ParsedRow[] = [];
  const errors: ParseIssue[] = [];
  let currentSection: SectionType | null = null;
  let pendingEntry: Partial<ParsedRow> | null = null;
  let pendingExampleEn: string | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = stripRtlMarks(rawLine);
    const trimmed = line.trim();
    
    if (!trimmed) continue;
    
    const sectionType = detectSectionType(trimmed);
    if (sectionType && !/^\d+[.)]/.test(trimmed)) {
      currentSection = sectionType;
      continue;
    }
    
    const numberedMatch = trimmed.match(/^\d+[.)]\s*(.+)$/);
    if (numberedMatch) {
      if (pendingEntry) {
        const warnings: string[] = [];
        if (!pendingEntry.definition) warnings.push('Missing definition');
        if (!pendingEntry.word) warnings.push('Missing word');
        rows.push({ ...pendingEntry, warnings } as ParsedRow);
      }
      
      const content = numberedMatch[1].trim();
      const parts = content.split(/\s*[—–\-:]\s*/);
      let word = parts[0]?.trim() || '';
      let definition = parts.slice(1).join(' — ').trim() || '';
      
      word = normalizeWhitespace(stripRtlMarks(word));
      definition = normalizeWhitespace(stripRtlMarks(definition));
      
      pendingEntry = {
        word,
        definition,
        type: inferType(word, currentSection, defaultType),
        warnings: [],
      };
      pendingExampleEn = null;
      continue;
    }
    
    if (pendingEntry) {
      if (/^[A12BC][12](?:[-–][A12BC][12])?$/.test(trimmed)) {
        pendingEntry.level = trimmed;
        continue;
      }
      
      if (isMostlyLatin(trimmed) && !pendingExampleEn) {
        pendingExampleEn = normalizeWhitespace(stripRtlMarks(trimmed));
        continue;
      }
      
      if (isMostlyArabic(trimmed) && pendingExampleEn) {
        const ar = normalizeWhitespace(stripRtlMarks(trimmed));
        pendingEntry.exampleSentence = `${pendingExampleEn}\n${ar}`;
        pendingExampleEn = null;
        continue;
      }
      
      if (isMostlyArabic(trimmed) && !pendingEntry.definition) {
        pendingEntry.definition = normalizeWhitespace(stripRtlMarks(trimmed));
        continue;
      }
    }
  }
  
  if (pendingEntry) {
    const warnings: string[] = [];
    if (!pendingEntry.definition) warnings.push('Missing definition');
    if (!pendingEntry.word) warnings.push('Missing word');
    rows.push({ ...pendingEntry, warnings } as ParsedRow);
  }
  
  return { rows, errors };
}

function parseTabTable(text: string, defaultType: VocabularyItemType): ParseResult {
  const lines = text.split('\n');
  const rows: ParsedRow[] = [];
  const errors: ParseIssue[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = stripRtlMarks(lines[i]).trim();
    if (!line) continue;
    
    const parts = line.split('\t').map(p => normalizeWhitespace(stripRtlMarks(p)));
    if (parts.length < 2) continue;
    
    const [word, definition, ...rest] = parts;
    const exampleSentence = rest.length > 0 ? rest.join('\n') : undefined;
    
    const warnings: string[] = [];
    if (!word) warnings.push('Missing word');
    if (!definition) warnings.push('Missing definition');
    
    rows.push({
      word,
      type: inferType(word, null, defaultType),
      definition,
      exampleSentence,
      warnings,
    });
  }
  
  return { rows, errors };
}

function parseCSVFormat(text: string, defaultType: VocabularyItemType): ParseResult {
  const parsed = parseCSV(text);
  if (!parsed) return { rows: [], errors: [{ message: 'Not a valid CSV format', severity: 'error' }] };
  
  const { headers, rows: csvRows } = parsed;
  const rows: ParsedRow[] = [];
  const errors: ParseIssue[] = [];
  
  const colMap: Record<string, number> = {};
  headers.forEach((h, i) => {
    const clean = h.replace(/[^\w]/g, '');
    if (['word', 'term', 'vocab', 'vocabulary'].includes(clean)) colMap.word = i;
    else if (['type', 'kind', 'pos', 'partofspeech'].includes(clean)) colMap.type = i;
    else if (['definition', 'meaning', 'translation', 'def'].includes(clean)) colMap.definition = i;
    else if (['example', 'sentence', 'ex', 'examplesentence'].includes(clean)) colMap.example = i;
    else if (['pronunciation', 'pron', 'ipa'].includes(clean)) colMap.pronunciation = i;
    else if (['category', 'cat', 'group', 'topic'].includes(clean)) colMap.category = i;
    else if (['level', 'cefr', 'grade'].includes(clean)) colMap.level = i;
  });
  
  if (colMap.word === undefined && colMap.definition === undefined) {
    return { rows: [], errors: [{ message: 'CSV missing required columns (word, definition)', severity: 'error' }] };
  }
  
  for (let i = 0; i < csvRows.length; i++) {
    const row = csvRows[i];
    const word = colMap.word !== undefined ? row[colMap.word]?.trim() : '';
    const definition = colMap.definition !== undefined ? row[colMap.definition]?.trim() : '';
    const typeStr = colMap.type !== undefined ? row[colMap.type]?.trim().toLowerCase() : '';
    const example = colMap.example !== undefined ? row[colMap.example]?.trim() : undefined;
    const pronunciation = colMap.pronunciation !== undefined ? row[colMap.pronunciation]?.trim() : undefined;
    const category = colMap.category !== undefined ? row[colMap.category]?.trim() : undefined;
    const level = colMap.level !== undefined ? row[colMap.level]?.trim().toUpperCase() : undefined;
    
    const warnings: string[] = [];
    if (!word) warnings.push('Missing word');
    if (!definition) warnings.push('Missing definition');
    
    let type: VocabularyItemType = defaultType;
    if (typeStr) {
      if (['verb', 'v', 'v.'].includes(typeStr)) type = 'verb';
      else if (['noun', 'n', 'n.'].includes(typeStr)) type = 'word';
      else if (['idiom', 'id', 'idioms'].includes(typeStr)) type = 'idiom';
      else if (['phrase', 'phr', 'phrasal'].includes(typeStr)) type = 'phrase';
    } else {
      type = inferType(word, null, defaultType);
    }
    
    rows.push({
      word: normalizeWhitespace(stripRtlMarks(word)),
      type,
      definition: normalizeWhitespace(stripRtlMarks(definition)),
      exampleSentence: example ? normalizeWhitespace(stripRtlMarks(example)) : undefined,
      pronunciation: pronunciation ? normalizeWhitespace(stripRtlMarks(pronunciation)) : undefined,
      categoryName: category ? normalizeWhitespace(stripRtlMarks(category)) : undefined,
      level: level && /^[A12BC][12](?:[-–][A12BC][12])?$/.test(level) ? level : undefined,
      warnings,
    });
  }
  
  return { rows, errors };
}

function parseJSONFormat(text: string, defaultType: VocabularyItemType): ParseResult {
  const parsed = parseJSON(text);
  if (!parsed) return { rows: [], errors: [{ message: 'Not valid JSON array', severity: 'error' }] };
  
  const rows: ParsedRow[] = [];
  const errors: ParseIssue[] = [];
  
  for (let i = 0; i < parsed.length; i++) {
    const item = parsed[i] as Record<string, unknown>;
    const word = String(item.word || item.term || item.vocab || item.vocabulary || '').trim();
    const definition = String(item.definition || item.meaning || item.translation || item.def || '').trim();
    const typeStr = String(item.type || item.kind || item.pos || item.partofspeech || '').trim().toLowerCase();
    const example = item.example || item.sentence || item.ex || item.examplesentence;
    const pronunciation = item.pronunciation || item.pron || item.ipa;
    const category = item.category || item.cat || item.group || item.topic;
    const level = item.level || item.cefr || item.grade;
    
    const warnings: string[] = [];
    if (!word) warnings.push('Missing word');
    if (!definition) warnings.push('Missing definition');
    
    let type: VocabularyItemType = defaultType;
    if (typeStr) {
      if (['verb', 'v', 'v.'].includes(typeStr)) type = 'verb';
      else if (['noun', 'n', 'n.'].includes(typeStr)) type = 'word';
      else if (['idiom', 'id', 'idioms'].includes(typeStr)) type = 'idiom';
      else if (['phrase', 'phr', 'phrasal'].includes(typeStr)) type = 'phrase';
    } else {
      type = inferType(word, null, defaultType);
    }
    
    rows.push({
      word: normalizeWhitespace(stripRtlMarks(word)),
      type,
      definition: normalizeWhitespace(stripRtlMarks(definition)),
      exampleSentence: example ? normalizeWhitespace(stripRtlMarks(String(example))) : undefined,
      pronunciation: pronunciation ? normalizeWhitespace(stripRtlMarks(String(pronunciation))) : undefined,
      categoryName: category ? normalizeWhitespace(stripRtlMarks(String(category))) : undefined,
      level: level ? String(level).toUpperCase() : undefined,
      warnings,
    });
  }
  
  return { rows, errors };
}

export function parseVocabularyText(
  text: string,
  options: { defaultType?: VocabularyItemType } = {}
): ParseResult {
  const defaultType = options.defaultType || 'word';
  const trimmed = text.trim();
  
  if (!trimmed) {
    return { rows: [], errors: [{ message: 'Empty input', severity: 'error' }] };
  }
  
  const jsonResult = parseJSONFormat(trimmed, defaultType);
  if (jsonResult.rows.length > 0) return jsonResult;
  
  const csvResult = parseCSVFormat(trimmed, defaultType);
  if (csvResult.rows.length > 0) return csvResult;
  
  if (trimmed.includes('\t') && trimmed.split('\n').some(l => l.includes('\t'))) {
    const tabResult = parseTabTable(trimmed, defaultType);
    if (tabResult.rows.length > 0) return tabResult;
  }
  
  const numberedResult = parseNumberedList(trimmed, defaultType);
  if (numberedResult.rows.length > 0) return numberedResult;
  
  return { rows: [], errors: [{ message: 'Could not parse input. Supported formats: JSON, CSV/TSV, numbered list, tab-separated.', severity: 'error' }] };
}

export function detectDuplicates(rows: ParsedRow[], existingWords: Set<string>): void {
  const seenInPaste = new Set<string>();
  for (const row of rows) {
    const lower = row.word.toLowerCase();
    if (existingWords.has(lower)) {
      row.warnings.push('Duplicate: word already exists in your vocabulary');
    }
    if (seenInPaste.has(lower)) {
      row.warnings.push('Duplicate within this import');
    }
    seenInPaste.add(lower);
  }
}