/**
 * Know the game: how English call centers in Egypt hire, what each stage
 * checks, the numbers to beat, and the free tools the plan uses. Researched
 * in October 2026; salaries and cut-offs change, so treat them as a guide.
 */

export interface HiringStage {
  id: StageId;
  name: string;
  what: string;
  /** What gets people rejected here. */
  traps: string[];
  /** Where to train for it in this section. */
  train: string[];
}

export type StageId = 'voice-note' | 'hr-call' | 'assessment' | 'ops-interview' | 'offer';

export const HIRING_STAGES: HiringStage[] = [
  {
    id: 'voice-note',
    name: 'Voice note / recording',
    what: 'Many recruiters (on WhatsApp, Telegram or X) ask for a one- to two-minute voice note before anything else. They listen to how you sound, not to your CV.',
    traps: ['Rushing, or long silences', 'Strong Arabic sounds (P/B, V/F, flat vowels)', 'A memorized, robotic tone', 'Noise, or a phone held too far away'],
    train: ['Voice Studio: record, check pace and pauses, compare takes', 'Sounds of the day', 'The model voice note to shadow'],
  },
  {
    id: 'hr-call',
    name: 'HR screening call',
    what: 'A 5–10 minute phone call: tell me about yourself, why this job, shifts, salary, military status. They check fluency, accent, listening and attitude.',
    traps: ['One-word answers', 'Not understanding fast questions', 'Hesitating about shifts or salary', 'Sounding unsure'],
    train: ['Interview bank (HR + Asked in Egypt)', 'Random question drill', 'The HR role-plays with an AI recruiter'],
  },
  {
    id: 'assessment',
    name: 'Online assessment',
    what: 'An English test (grammar, vocabulary, reading, listening, recorded speaking — often Versant-style), a typing test (around 35 words per minute was reported at Concentrix), and sometimes an IQ or aptitude test.',
    traps: ['Silence on the speaking parts', 'Basic errors: articles, -s, tenses', 'Slow typing', 'Panicking with the timer'],
    train: ['Weekly quizzes and level exams (same item types)', 'Typing tests', 'Level 3, week 2: The Assessment'],
  },
  {
    id: 'ops-interview',
    name: 'Operations interview',
    what: 'The final round with a team leader or an operations manager: a mock call, situational and behavioral questions, "sell me this pen", "describe a color to a blind person".',
    traps: ['Losing control of an angry mock customer', 'Stories with no result', 'Blaming the customer', 'Not asking any questions at the end'],
    train: ['Role-plays with the QA rubric', 'STAR answers', 'Level 3, week 3: The Operations Interview'],
  },
  {
    id: 'offer',
    name: 'Offer & account',
    what: 'Your assessed level decides the account and the salary. B2 opens most English accounts; C1 opens premium and US accounts.',
    traps: ['Accepting the first offer without knowing the account', 'Not asking about training and shift allowances'],
    train: ['Reach C1 in levels 4–5 for premium accounts'],
  },
];

/** The numbers to beat, set above what employers usually ask for. */
export const TARGETS: Array<{ name: string; hired: string; overqualified: string; note: string }> = [
  { name: 'Typing', hired: '35 words/min · 95%', overqualified: '45+ words/min · 97%', note: 'Concentrix Alexandria reportedly asks for 35 words per minute.' },
  { name: 'EF SET (free)', hired: '51–60 = B2', overqualified: '61–70 = C1, 71+ = C2', note: 'Reading and listening; free certificate for your CV and LinkedIn.' },
  { name: 'Versant (if they use it)', hired: '58–68 = B2', overqualified: '69–78 = C1', note: 'Score 20–80. Each company sets its own cut-off.' },
  { name: 'Mock call (QA rubric)', hired: '75%+', overqualified: '90%+', note: 'Scored with the same rubric as your role-plays.' },
];

/** Rough monthly salaries from Egyptian job ads in 2026 (EGP). */
export const SALARY_GUIDE: Array<{ level: string; range: string; note: string }> = [
  { level: 'B1', range: '≈ 9,000–11,000', note: 'Basic English accounts.' },
  { level: 'B2 / B2+', range: '≈ 15,000–21,000', note: 'Most English accounts; one 2026 ad offered 20,839 net for B2/B2+.' },
  { level: 'C1 · premium · US accounts', range: '≈ 20,000–25,000+', note: 'Some add commission or bonuses.' },
];

/** English call centers hiring in Egypt (check each one's careers page and LinkedIn). */
export const COMPANIES: string[] = [
  'Teleperformance (TP), including Majorel',
  'Concentrix',
  'Sutherland',
  'Foundever',
  'TTEC',
  '_VOIS (Vodafone)',
  'eClerx (Cairo center: telecom tech support)',
  'Raya CX',
  'Xceed',
  'Intelcia',
  'Transcom',
  'ECCO Outsourcing',
];

export const WHERE_TO_APPLY: string[] = [
  "The companies' careers pages and LinkedIn pages",
  'Wuzzuf and Forasna',
  'Referrals: ask agents who already work there (most hiring goes faster with a referral)',
  'Recruiter channels on Telegram, Facebook and X: answer with a short message, your CV and your best voice note',
];

export interface FreeTool {
  id: string;
  name: string;
  url: string;
  what: string;
}

export const FREE_TOOLS: FreeTool[] = [
  { id: 'youglish', name: 'YouGlish', url: 'https://youglish.com/', what: 'Hear any word or phrase in thousands of real American videos. Built into the sound tasks.' },
  { id: 'naturalreader', name: 'NaturalReader', url: 'https://www.naturalreaders.com/online/', what: 'Natural voices for the scripts and model answers (the basic voices are free; the premium ones have a daily limit).' },
  { id: 'chatgpt', name: 'ChatGPT (voice)', url: 'https://chatgpt.com/', what: 'Your free AI caller and interviewer: paste a role-play prompt and talk.' },
  { id: 'gemini', name: 'Gemini (voice)', url: 'https://gemini.google.com/', what: 'Another free AI partner; it can also listen to a recording you upload and give feedback.' },
  { id: 'efset', name: 'EF SET', url: 'https://www.efset.org/ef-set-50/', what: 'Free 50-minute English test with a CEFR certificate for your CV.' },
  { id: 'monkeytype', name: 'Monkeytype', url: 'https://monkeytype.com/', what: 'Extra typing practice when you have time left.' },
];

/** What to do after a rejection, by the stage where it happened. */
export const DEBRIEF: Record<StageId, string[]> = {
  'voice-note': [
    'Record the same voice note three times in Voice Studio, and keep the best take.',
    'Check the numbers: 130–160 words per minute and no pause longer than 2 seconds.',
    'Shadow the model voice note five times, then record your own again.',
  ],
  'hr-call': [
    'Run the random question drill for the HR and "Asked in Egypt" questions.',
    'Do the HR screening role-play with an AI recruiter, twice.',
    'Write down the question that surprised you, and add your answer to the bank.',
  ],
  assessment: [
    'Retake the last weekly quiz of Level 3, week 2, and look at every mistake.',
    'Do three typing tests in a row.',
    'Practice repeating and retelling: never leave a silence.',
  ],
  'ops-interview': [
    'Do two mock calls with the QA rubric, with an angry customer.',
    'Rewrite your STAR stories with a clear result.',
    'Prepare two questions to ask the interviewer.',
  ],
  offer: ['Ask about the account, the training and the shifts before accepting.', 'Keep going with levels 4–5: C1 opens the premium accounts.'],
};
