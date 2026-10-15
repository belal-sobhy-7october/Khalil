/**
 * Curated websites and apps for improving English. Ratings and suggestions
 * from users live in Supabase (english_resource_ratings /
 * english_resource_suggestions); this list is the catalogue. A resource's
 * `id` is its stable key in the ratings table — never change it.
 */
export type ResourceCategory = 'speaking' | 'listening' | 'pronunciation' | 'vocabulary' | 'writing' | 'reading';

export interface EnglishResource {
  id: string;
  name: string;
  url: string;
  description: string;
  category: ResourceCategory;
  free: boolean | 'freemium';
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = ['speaking', 'listening', 'pronunciation', 'vocabulary', 'writing', 'reading'];

export const ENGLISH_RESOURCES: EnglishResource[] = [
  {
    id: 'talkpal',
    name: 'Talkpal',
    url: 'https://app.talkpal.ai/',
    description: 'AI conversation partner: talk by voice or text about any topic, with role-plays and instant corrections.',
    category: 'speaking',
    free: 'freemium',
  },
  {
    id: 'speakozy',
    name: 'Speakozy',
    url: 'https://speakozy.com/',
    description: 'Speaking practice platform — practise speaking English out loud and build confidence.',
    category: 'speaking',
    free: 'freemium',
  },
  {
    id: 'tandem',
    name: 'Tandem',
    url: 'https://www.tandem.net/',
    description: 'Language exchange with real native speakers by text, voice and video.',
    category: 'speaking',
    free: 'freemium',
  },
  {
    id: 'naturalreaders',
    name: 'NaturalReaders',
    url: 'https://www.naturalreaders.com/online/',
    description: 'Paste any text and hear it read in natural voices — great for shadowing scripts and answers.',
    category: 'listening',
    free: 'freemium',
  },
  {
    id: 'bbc-learning-english',
    name: 'BBC Learning English',
    url: 'https://www.bbc.co.uk/learningenglish',
    description: 'Free lessons, podcasts and "6 Minute English" episodes with transcripts.',
    category: 'listening',
    free: true,
  },
  {
    id: 'elllo',
    name: 'ELLLO',
    url: 'https://www.elllo.org/',
    description: 'Thousands of short real conversations in many accents, with transcripts and quizzes.',
    category: 'listening',
    free: true,
  },
  {
    id: 'playphrase',
    name: 'PlayPhrase.me',
    url: 'https://www.playphrase.me/',
    description: 'Type a phrase and hear it in dozens of movie and TV clips.',
    category: 'listening',
    free: 'freemium',
  },
  {
    id: 'youglish',
    name: 'YouGlish',
    url: 'https://youglish.com/',
    description: 'Hear any word or phrase in real YouTube videos, filtered by US, UK or Australian accent.',
    category: 'pronunciation',
    free: true,
  },
  {
    id: 'rachels-english',
    name: "Rachel's English",
    url: 'https://rachelsenglish.com/',
    description: 'Detailed American accent lessons: sounds, linking, reductions and intonation.',
    category: 'pronunciation',
    free: 'freemium',
  },
  {
    id: 'forvo',
    name: 'Forvo',
    url: 'https://forvo.com/languages/en/',
    description: 'Words and names pronounced by native speakers from different countries.',
    category: 'pronunciation',
    free: true,
  },
  {
    id: 'cambridge-dictionary',
    name: 'Cambridge Dictionary',
    url: 'https://dictionary.cambridge.org/',
    description: 'Clear learner definitions, CEFR levels, US/UK audio and many example sentences.',
    category: 'vocabulary',
    free: true,
  },
  {
    id: 'reverso-context',
    name: 'Reverso Context',
    url: 'https://context.reverso.net/',
    description: 'See how a word or expression is used in thousands of real sentences.',
    category: 'vocabulary',
    free: 'freemium',
  },
  {
    id: 'ludwig',
    name: 'Ludwig',
    url: 'https://ludwig.guru/',
    description: 'Check whether your sentence sounds natural by comparing it with reliable published texts.',
    category: 'writing',
    free: 'freemium',
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    url: 'https://www.grammarly.com/',
    description: 'Grammar, spelling and tone suggestions while you write emails and messages.',
    category: 'writing',
    free: 'freemium',
  },
  {
    id: 'news-in-levels',
    name: 'News in Levels',
    url: 'https://www.newsinlevels.com/',
    description: 'The same news story written at three levels, with audio.',
    category: 'reading',
    free: true,
  },
];
