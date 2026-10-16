/**
 * Picks the dictionary sense that fits a topic. Dictionaries list a word's
 * most common sense first, which is often the wrong one for the topic
 * ("split up" in a Marriage topic means ending a relationship, not dividing
 * into groups). Senses are scored by how many of their words relate to the
 * topic: its name, a few hint words for common topics, and the definitions
 * of the words already in it.
 */

export interface Sense {
  definition: string;
  example?: string;
  pos?: string;
}

const STOP = new Set(
  `a an the of to in on at for from by with without into onto over under about as and or but if then than so that this these those
   it its is are was were be been being have has had do does did can could will would should may might must shall
   not no nor very more most less least such some any each every all both either neither one ones someone something somebody
   who whom whose which what when where why how you your yours he him his she her hers they them their theirs we us our
   i me my mine up down out off again also just only own same other another used use using make made way thing things person people
   very much many often especially usually particular particularly etc kind type sort part`.split(/\s+/)
);

// Related words for common topic names (English and Arabic).
const HINTS: Record<string, string[]> = {
  marriage: ['marriage', 'married', 'marry', 'relationship', 'partner', 'husband', 'wife', 'spouse', 'couple', 'wedding', 'divorce', 'romantic', 'love', 'family'],
  love: ['love', 'romantic', 'relationship', 'partner', 'couple', 'attract', 'feeling', 'heart', 'date', 'boyfriend', 'girlfriend'],
  relationship: ['relationship', 'partner', 'couple', 'romantic', 'friend', 'family', 'love', 'trust'],
  family: ['family', 'parent', 'child', 'relative', 'mother', 'father', 'home', 'marriage'],
  work: ['work', 'job', 'employee', 'employer', 'office', 'company', 'business', 'career', 'colleague', 'manager', 'task', 'salary'],
  job: ['job', 'work', 'employer', 'employee', 'career', 'company', 'position', 'salary', 'hire'],
  career: ['career', 'job', 'work', 'profession', 'promotion', 'skill'],
  interview: ['interview', 'job', 'candidate', 'employer', 'experience', 'skill', 'hire', 'position', 'career', 'question'],
  business: ['business', 'company', 'customer', 'market', 'money', 'profit', 'deal', 'trade'],
  customer: ['customer', 'service', 'complaint', 'call', 'help', 'product', 'order', 'refund'],
  call: ['call', 'phone', 'telephone', 'customer', 'caller', 'line', 'hold', 'speak'],
  phone: ['phone', 'call', 'telephone', 'message', 'line'],
  email: ['email', 'message', 'letter', 'write', 'reply', 'send'],
  meeting: ['meeting', 'discuss', 'discussion', 'agenda', 'team', 'decision', 'opinion'],
  shopping: ['shop', 'shopping', 'buy', 'purchase', 'price', 'pay', 'money', 'store', 'sale', 'cheap', 'expensive', 'cost'],
  money: ['money', 'pay', 'price', 'cost', 'bank', 'spend', 'save', 'cash', 'debt'],
  education: ['education', 'school', 'study', 'learn', 'student', 'teacher', 'university', 'course', 'exam', 'class', 'knowledge'],
  school: ['school', 'student', 'teacher', 'class', 'lesson', 'study', 'exam'],
  study: ['study', 'learn', 'student', 'exam', 'course', 'knowledge', 'research'],
  personality: ['personality', 'character', 'behaviour', 'behavior', 'attitude', 'feeling', 'emotion', 'trait', 'temper', 'tend'],
  feeling: ['feeling', 'emotion', 'happy', 'sad', 'angry', 'afraid', 'mood', 'upset'],
  health: ['health', 'ill', 'illness', 'disease', 'doctor', 'body', 'pain', 'medical', 'hospital', 'treatment'],
  travel: ['travel', 'trip', 'journey', 'flight', 'hotel', 'airport', 'passenger', 'ticket', 'holiday', 'visit'],
  food: ['food', 'eat', 'cook', 'meal', 'restaurant', 'dish', 'taste', 'drink'],
  restaurant: ['restaurant', 'food', 'meal', 'order', 'waiter', 'menu', 'bill', 'dish'],
  technology: ['technology', 'computer', 'software', 'device', 'internet', 'digital', 'online', 'app', 'data'],
  tech: ['technology', 'computer', 'software', 'device', 'internet', 'online', 'app'],
  sport: ['sport', 'game', 'team', 'player', 'match', 'win', 'exercise', 'train'],
  زواج: ['marriage', 'married', 'relationship', 'partner', 'husband', 'wife', 'couple', 'wedding', 'divorce'],
  حب: ['love', 'romantic', 'relationship', 'partner', 'feeling'],
  شغل: ['work', 'job', 'employee', 'office', 'company', 'career'],
  عمل: ['work', 'job', 'employee', 'office', 'company', 'career'],
  مقابلة: ['interview', 'job', 'candidate', 'employer', 'experience'],
  تعليم: ['education', 'school', 'study', 'learn', 'student', 'teacher'],
  دراسة: ['study', 'learn', 'student', 'exam', 'course'],
  تسوق: ['shop', 'buy', 'price', 'pay', 'money', 'store'],
  شخصية: ['personality', 'character', 'behaviour', 'behavior', 'attitude'],
  سفر: ['travel', 'trip', 'flight', 'hotel', 'airport'],
  صحة: ['health', 'illness', 'doctor', 'body', 'medical'],
};

/** Lower-cased content words, crudely stemmed so "relationships" meets "relationship". */
export function contentWords(text: string): string[] {
  return (text.toLowerCase().match(/[\p{L}']+/gu) ?? [])
    .map((w) => w.replace(/'s$/, ''))
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map(stem);
}

function stem(w: string): string {
  if (!/^[a-z']+$/.test(w)) return w;
  if (w.length > 5 && w.endsWith('ies')) return `${w.slice(0, -3)}y`;
  if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith('ed')) return w.slice(0, -2);
  if (w.length > 4 && w.endsWith('es')) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

/**
 * Weighted words describing a topic: its name and hint words count most, the
 * definitions of the words already in it count a little each.
 */
export function topicContext(topicName: string, relatedTexts: string[] = []): Map<string, number> {
  const weights = new Map<string, number>();
  const add = (w: string, n: number) => weights.set(w, Math.max(weights.get(w) ?? 0, n));
  const nameWords = topicName.toLowerCase().match(/[\p{L}]+/gu) ?? [];
  for (const raw of nameWords) {
    add(stem(raw), 3);
    for (const hint of HINTS[raw] ?? HINTS[stem(raw)] ?? []) add(stem(hint), 3);
  }
  const counts = new Map<string, number>();
  for (const text of relatedTexts) for (const w of new Set(contentWords(text))) counts.set(w, (counts.get(w) ?? 0) + 1);
  for (const [w, n] of counts) add(w, Math.min(2, n * 0.5));
  return weights;
}

export function senseScore(sense: Sense, context: Map<string, number>): number {
  let score = 0;
  for (const w of new Set(contentWords(`${sense.definition} ${sense.example ?? ''}`))) score += context.get(w) ?? 0;
  return score;
}

/** Senses best-first for the topic; ties keep the dictionary's order (most common first). */
export function rankSenses<T extends Sense>(senses: T[], context: Map<string, number>): T[] {
  if (context.size === 0) return senses;
  return senses
    .map((s, i) => ({ s, i, score: senseScore(s, context) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((x) => x.s);
}

/** Same text, ignoring case, spacing and punctuation. */
export function sameDefinition(a: string, b: string): boolean {
  const norm = (x: string) => x.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  return norm(a) === norm(b);
}
