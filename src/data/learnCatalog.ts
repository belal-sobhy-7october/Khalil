/**
 * What the two learning sections hold: Learn Languages (English, then the
 * languages still to come) and Learn Skills (Call Center English and Sales,
 * then skills that can earn a living — nothing haram, no trading).
 *
 * An item with a `section` opens that section of Khalil; the rest show as
 * "Soon". Names are in translations.ts: `learn.language.<id>.name`, and
 * `learn.skill.<id>.name` and `.blurb` (a line on what it earns from).
 */

export type LearnHubId = 'languages' | 'skills';

export interface LanguageItem {
  id: string;
  /** The Khalil section it opens; none means "Soon". */
  section?: string;
  /** BCP 47 code, for the `lang` of the native text. */
  code: string;
  /** The language's name in itself. */
  native: string;
  /** "Hello" in the language. */
  hello: string;
}

export const LANGUAGES: LanguageItem[] = [
  { id: 'english', section: 'vocabulary', code: 'en', native: 'English', hello: 'Hello' },
  { id: 'german', code: 'de', native: 'Deutsch', hello: 'Hallo' },
  { id: 'french', code: 'fr', native: 'Français', hello: 'Bonjour' },
  { id: 'spanish', code: 'es', native: 'Español', hello: '¡Hola!' },
  { id: 'italian', code: 'it', native: 'Italiano', hello: 'Ciao' },
  { id: 'portuguese', code: 'pt', native: 'Português', hello: 'Olá' },
  { id: 'turkish', code: 'tr', native: 'Türkçe', hello: 'Merhaba' },
  { id: 'russian', code: 'ru', native: 'Русский', hello: 'Привет' },
  { id: 'chinese', code: 'zh', native: '中文', hello: '你好' },
  { id: 'japanese', code: 'ja', native: '日本語', hello: 'こんにちは' },
  { id: 'korean', code: 'ko', native: '한국어', hello: '안녕하세요' },
];

export type SkillGroup = 'tech' | 'design' | 'marketing' | 'business' | 'handsOn';
export const SKILL_GROUPS: SkillGroup[] = ['tech', 'design', 'marketing', 'business', 'handsOn'];

export interface SkillItem {
  id: string;
  /** The Khalil section it opens; none means "Soon". */
  section?: string;
  group: SkillGroup;
}

export const SKILLS: SkillItem[] = [
  { id: 'callCenter', section: 'callcenter', group: 'business' },
  { id: 'sales', section: 'sales', group: 'marketing' },
  { id: 'programming', group: 'tech' },
  { id: 'automation', group: 'tech' },
  { id: 'aiTools', group: 'tech' },
  { id: 'dataAnalysis', group: 'tech' },
  { id: 'cybersecurity', group: 'tech' },
  { id: 'design', group: 'design' },
  { id: 'visualIdentity', group: 'design' },
  { id: 'uiux', group: 'design' },
  { id: 'videoEditing', group: 'design' },
  { id: 'motionGraphics', group: 'design' },
  { id: 'productPhotography', group: 'design' },
  { id: 'voiceOver', group: 'design' },
  { id: 'copywriting', group: 'marketing' },
  { id: 'socialMedia', group: 'marketing' },
  { id: 'seo', group: 'marketing' },
  { id: 'ecommerce', group: 'marketing' },
  { id: 'freelancing', group: 'business' },
  { id: 'projectManagement', group: 'business' },
  { id: 'accounting', group: 'business' },
  { id: 'virtualAssistant', group: 'business' },
  { id: 'translation', group: 'business' },
  { id: 'onlineTeaching', group: 'business' },
  { id: 'phoneRepair', group: 'handsOn' },
  { id: 'computerNetworks', group: 'handsOn' },
];

/** The hub a section lives in, for the sidebar and the way back. */
export function hubOf(section: string): LearnHubId | null {
  if (section === 'languages' || LANGUAGES.some((l) => l.section === section)) return 'languages';
  if (section === 'skills' || SKILLS.some((s) => s.section === section)) return 'skills';
  return null;
}
