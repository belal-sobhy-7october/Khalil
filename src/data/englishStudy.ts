/**
 * Study sources and reference content for the English hub (accent,
 * shadowing, reading & listening tabs).
 */

export type StudySection = 'accent' | 'shadowing' | 'reading';

export interface StudySource {
  id: string;
  name: string;
  url: string;
  description: string;
  section: StudySection;
  /** Optional embeddable URL (e.g. a Drive PDF preview). */
  embedUrl?: string;
}

export const Z_AMERICAN_ENGLISH = 'https://www.youtube.com/@ZAmericanEnglish';
export const LISTENING_TIME = 'https://www.youtube.com/@listeningtimepodcast';
const READING_PDF_ID = '100Y_ZLHJMrSkamc1Cp66LlUUfVJgEBci';

export const STUDY_SOURCES: StudySource[] = [
  {
    id: 'z-american-english',
    name: 'Z American English',
    url: `${Z_AMERICAN_ENGLISH}/playlists`,
    description: 'American accent, pronunciation, phonetics, grammar and reading lessons.',
    section: 'accent',
  },
  {
    id: 'listening-time-podcast',
    name: 'Listening Time Podcast',
    url: `${LISTENING_TIME}/playlists`,
    description: 'Podcast episodes for listening practice — great material for shadowing.',
    section: 'shadowing',
  },
  {
    id: 'reading-listening-book',
    name: 'Reading & Listening book (PDF)',
    url: `https://drive.google.com/file/d/${READING_PDF_ID}/view`,
    embedUrl: `https://drive.google.com/file/d/${READING_PDF_ID}/preview`,
    description: 'Your reading and listening practice book.',
    section: 'reading',
  },
];

/** The four accent tracks, each searchable on the Z American English channel. */
export const ACCENT_TRACKS = [
  { id: 'accent', query: 'accent', icon: '🗣️' },
  { id: 'phonetics', query: 'pronunciation', icon: '🔤' },
  { id: 'grammar', query: 'grammar', icon: '📘' },
  { id: 'reading', query: 'reading', icon: '📖' },
] as const;
export type AccentTrack = (typeof ACCENT_TRACKS)[number]['id'];

export const channelSearchUrl = (channel: string, query: string) =>
  `${channel}/search?query=${encodeURIComponent(query)}`;

/** American English sounds (General American), with example words to hear. */
export interface SoundEntry {
  ipa: string;
  examples: string[];
  tip?: string;
}

export const VOWELS: SoundEntry[] = [
  { ipa: 'iː', examples: ['see', 'team', 'people'], tip: 'Long, smile slightly.' },
  { ipa: 'ɪ', examples: ['sit', 'busy', 'women'], tip: 'Short and relaxed — not "ee".' },
  { ipa: 'eɪ', examples: ['day', 'make', 'great'] },
  { ipa: 'ɛ', examples: ['bed', 'said', 'friend'] },
  { ipa: 'æ', examples: ['cat', 'happy', 'laugh'], tip: 'Jaw low and wide — very American.' },
  { ipa: 'ɑː', examples: ['hot', 'father', 'job'], tip: 'Open "ah" — "hot" is "haht".' },
  { ipa: 'ɔː', examples: ['law', 'thought', 'call'] },
  { ipa: 'oʊ', examples: ['go', 'phone', 'though'] },
  { ipa: 'ʊ', examples: ['book', 'put', 'could'] },
  { ipa: 'uː', examples: ['food', 'blue', 'through'] },
  { ipa: 'ʌ', examples: ['cup', 'love', 'money'], tip: 'Short, relaxed "uh".' },
  { ipa: 'ə', examples: ['about', 'banana', 'problem'], tip: 'Schwa: the most common sound — unstressed and quick.' },
  { ipa: 'ɝ', examples: ['bird', 'work', 'early'], tip: 'Stressed R-vowel.' },
  { ipa: 'ɚ', examples: ['teacher', 'doctor', 'better'], tip: 'Unstressed R-vowel.' },
  { ipa: 'aɪ', examples: ['my', 'time', 'buy'] },
  { ipa: 'aʊ', examples: ['now', 'house', 'out'] },
  { ipa: 'ɔɪ', examples: ['boy', 'choice', 'enjoy'] },
];

export const CONSONANTS: SoundEntry[] = [
  { ipa: 'θ', examples: ['think', 'three', 'month'], tip: 'Tongue between the teeth, no voice — not "s" or "t".' },
  { ipa: 'ð', examples: ['this', 'mother', 'breathe'], tip: 'Tongue between the teeth, with voice — not "z" or "d".' },
  { ipa: 'r', examples: ['red', 'car', 'very'], tip: 'Tongue pulled back, never tapped; always pronounced.' },
  { ipa: 'l', examples: ['light', 'feel', 'call'], tip: 'Dark L at the end of words: back of the tongue raised.' },
  { ipa: 'v', examples: ['very', 'over', 'have'], tip: 'Top teeth on the lower lip — not "f" or "b".' },
  { ipa: 'p', examples: ['pen', 'happy', 'stop'], tip: 'Puff of air — keep it different from "b".' },
  { ipa: 'ʃ', examples: ['she', 'nation', 'wish'] },
  { ipa: 'ʒ', examples: ['measure', 'usually', 'vision'] },
  { ipa: 'tʃ', examples: ['chair', 'watch', 'nature'] },
  { ipa: 'dʒ', examples: ['job', 'age', 'major'] },
  { ipa: 'ŋ', examples: ['sing', 'thinking', 'long'], tip: 'No hard "g" at the end.' },
  { ipa: 'w', examples: ['we', 'quick', 'one'] },
  { ipa: 'j', examples: ['yes', 'use', 'onion'] },
  { ipa: 'h', examples: ['hello', 'behind', 'who'] },
  { ipa: 'z', examples: ['zoo', 'easy', 'goes'], tip: 'Plural/verb -s is often "z": dogs, plays.' },
];

/** Features that make English sound American, each with phrases to imitate. */
export interface AccentFeature {
  id: string;
  title: string;
  explanation: string;
  examples: string[];
}

export const ACCENT_FEATURES: AccentFeature[] = [
  {
    id: 'flap-t',
    title: 'Flap T',
    explanation: 'A T between vowels becomes a quick, soft D-like tap.',
    examples: ['water', 'better', 'a lot of', 'get it', 'city'],
  },
  {
    id: 'stop-t',
    title: 'Stop T',
    explanation: 'A T before N or at the end of a word is often held, not released.',
    examples: ['button', 'certain', "don't know", 'that guy', 'sit down'],
  },
  {
    id: 'schwa',
    title: 'Schwa & reduced words',
    explanation: 'Unstressed syllables and small words (to, for, and, of) shrink to a short "uh".',
    examples: ['I want to go', 'a cup of tea', 'for you', 'bread and butter', 'what are you doing'],
  },
  {
    id: 'linking',
    title: 'Linking',
    explanation: 'Words flow together: a final consonant links to the next vowel.',
    examples: ['turn it off', 'pick it up', 'not at all', 'check it out', 'an apple'],
  },
  {
    id: 'reductions',
    title: 'Common reductions',
    explanation: 'In fast, natural speech: going to → gonna, want to → wanna, got to → gotta, let me → lemme.',
    examples: ["I'm going to call you", 'I want to see it', "I've got to go", 'let me check', "what do you want"],
  },
  {
    id: 'stress',
    title: 'Word & sentence stress',
    explanation: 'Stressed syllables are longer, louder and higher; content words carry the stress.',
    examples: ['PHOtograph', 'phoTOgraphy', 'photoGRAPHic', 'I NEED to FINISH this TODAY'],
  },
  {
    id: 'can-cant',
    title: "Can vs. can't",
    explanation: '"Can" is reduced (kn) and the verb is stressed; "can\'t" is stressed with a held T.',
    examples: ['I can HELP you', "I CAN'T help you", 'You can GO now', "You CAN'T go now"],
  },
  {
    id: 'intonation',
    title: 'Intonation',
    explanation: 'Statements and wh-questions fall at the end; yes/no questions rise.',
    examples: ['Where do you work?', 'Do you work here?', "I'll call you tomorrow.", 'Is that okay?'],
  },
];
