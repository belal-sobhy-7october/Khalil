/**
 * Brings the user's topics in line with the rebuilt, course-style lessons:
 *  - Topics added from an old pack: words that are in the new lesson get its
 *    definition and example, the lesson's new words are added, and old-pack
 *    filler that isn't in the lesson is offered for removal. Words the user
 *    added themselves are never touched.
 *  - The user's own topics: a matching lesson (e.g. "Marriage" →
 *    "Relationships & Marriage") is suggested, to add its key words.
 */
import { TOPIC_PACKS, type PackItem, type TopicPack } from '../data/topicPacks';
import { LEGACY_PACK_WORDS, LEGACY_REPLACED_BY } from '../data/topicPacks/legacy';
import type { VocabularyCategory, VocabularyItem } from '../types';

export interface WordUpdate {
  item: VocabularyItem;
  next: PackItem;
}

export interface LessonUpgrade {
  category: VocabularyCategory;
  pack: TopicPack;
  /** New name when the old pack was merged into a differently named lesson. */
  rename?: string;
  update: WordUpdate[];
  add: PackItem[];
  /** Old-pack words that are not part of the new lesson. */
  remove: VocabularyItem[];
}

export interface OwnTopic {
  category: VocabularyCategory;
  /** A lesson on the same subject, if there is one. */
  pack?: TopicPack;
  /** Lesson words not yet in the user's list. */
  add: PackItem[];
}

export interface UpgradePlan {
  lessons: LessonUpgrade[];
  own: OwnTopic[];
}

const key = (w: string) => w.trim().toLowerCase();

// The user's own topic names that clearly mean one of the lessons.
const SUBJECTS: Array<[RegExp, string]> = [
  [/marriage|married|relationship|love|wedding|زواج|حب/i, 'relationships-and-marriage'],
  [/personalit|feeling|emotion|character|شخصي|مشاعر/i, 'feelings-and-personality'],
  [/shop|spend|money|buy|تسوق|فلوس/i, 'shop-smart'],
  [/educat|learn|study|school|university|تعليم|دراس|مذاكر/i, 'smart-learning'],
  [/interview|مقابل|انترفيو/i, 'job-interview'],
  [/call ?cent|customer|كول ?سنتر/i, 'call-center-on-the-call'],
  [/\bwork\b|office|job|career|شغل|عمل/i, 'work-and-office'],
  [/habit|routine|عادات|روتين/i, 'habitual-change'],
  [/\bai\b|artificial|technolog|ذكاء/i, 'artificial-intelligence'],
  [/social media|internet|phone|app/i, 'social-media'],
  [/crime|police|law|جريم/i, 'crime'],
  [/travel|trip|airport|سفر/i, 'travel'],
  [/food|restaurant|cook|eat|أكل|مطعم/i, 'restaurant-and-food'],
  [/health|doctor|medical|صح|دكتور/i, 'health'],
  [/opinion|debate|argu|رأي|نقاش/i, 'opinions-and-arguing'],
  [/small talk|chat|conversation/i, 'small-talk'],
  [/heritage|identity|family|roots|عيل|أصل/i, 'identity-and-heritage'],
  [/minimal|clutter|possession/i, 'minimalism'],
  [/society|ethic|responsib|مجتمع/i, 'social-responsibility'],
  [/business|start-?up|entrepreneur|مشروع|بيزنس/i, 'starting-a-business'],
  [/negotiat|\bdeals?\b|bargain|تفاوض/i, 'negotiation'],
  [/presentation|public speaking|عرض تقديمي/i, 'presentations'],
  [/leader|teamwork|قياد/i, 'leadership-and-teamwork'],
  [/freelanc|remote|فريلانس/i, 'remote-work-and-freelancing'],
  [/time management|productiv|إدارة الوقت/i, 'time-management'],
  [/friend|صداق|صحاب/i, 'friendship'],
  [/childhood|memor|طفول|ذكريات/i, 'childhood-and-memories'],
  [/film|movie|series|book|novel|فيلم|أفلام|مسلسل|كتب/i, 'films-series-and-books'],
  [/invitation|making plans|عزوم/i, 'making-plans'],
  [/describ|appearance|وصف/i, 'describing-people'],
  [/cultur|etiquette|custom|manners|ثقاف/i, 'cultural-differences'],
  [/\bcity\b|village|countryside|مدين|ريف/i, 'city-vs-countryside'],
  [/\bhome\b|house|\bflat\b|neighbo|\brent\b|سكن|بيت|جيران/i, 'home-and-neighbours'],
  [/transport|traffic|driving|مواصلات|زحم/i, 'transport-and-traffic'],
  [/sport|fitness|\bgym\b|football|رياض/i, 'sports-and-fitness'],
  [/hobb|free time|هواي/i, 'hobbies-and-free-time'],
  [/ramadan|\beid\b|celebrat|festival|رمضان|عيد|احتفال/i, 'ramadan-and-celebrations'],
  [/environment|climate|pollution|بيئ|مناخ/i, 'climate-and-environment'],
  [/\bnews\b|media|journalis|أخبار|إعلام/i, 'news-and-media'],
  [/\bfame\b|famous|celebrit|مشاهير|شهرة/i, 'fame-and-celebrity'],
  [/stress|mental|anxiety|توتر|نفسي/i, 'mental-health'],
  [/science|space|invent|علوم|فضاء/i, 'science-and-space'],
  [/happi|success|سعاد|نجاح/i, 'happiness-and-success'],
];

export function lessonForTopicName(name: string): TopicPack | undefined {
  const exact = TOPIC_PACKS.find((p) => key(p.title) === key(name));
  if (exact) return exact;
  const replaced = LEGACY_REPLACED_BY[name];
  if (replaced) return TOPIC_PACKS.find((p) => p.id === replaced);
  const subject = SUBJECTS.find(([re]) => re.test(name));
  return subject ? TOPIC_PACKS.find((p) => p.id === subject[1]) : undefined;
}

export function planTopicUpgrade(categories: VocabularyCategory[], items: VocabularyItem[]): UpgradePlan {
  const owned = new Set(items.map((i) => key(i.word)));
  const lessons: LessonUpgrade[] = [];
  const own: OwnTopic[] = [];
  // A lesson's words are offered to one topic only ("Love" and "Marriage"
  // both match Relationships & Marriage; the words shouldn't be added twice).
  const offered = new Set<string>();

  for (const category of categories) {
    const inTopic = items.filter((i) => i.categoryId === category.id);
    const legacy = LEGACY_PACK_WORDS[category.name];
    const fromOldPack = !!legacy || TOPIC_PACKS.some((p) => key(p.title) === key(category.name));
    const pack = lessonForTopicName(category.name);

    if (fromOldPack && pack) {
      const lessonWords = new Map(pack.items.map((p) => [key(p.word), p]));
      const oldWords = new Set(legacy ?? []);
      const update: WordUpdate[] = [];
      const remove: VocabularyItem[] = [];
      for (const item of inTopic) {
        const next = lessonWords.get(key(item.word));
        if (next) {
          if (item.definition.trim() !== next.definition || (item.exampleSentence ?? '').trim() !== next.example) update.push({ item, next });
        } else if (oldWords.has(key(item.word))) {
          remove.push(item);
        }
      }
      const add = offered.has(pack.id) ? [] : pack.items.filter((p) => !owned.has(key(p.word)));
      offered.add(pack.id);
      const rename = key(category.name) !== key(pack.title) ? pack.title : undefined;
      if (update.length || add.length || remove.length || rename) lessons.push({ category, pack, rename, update, add, remove });
    } else {
      own.push({ category, pack, add: [] });
    }
  }
  // Own topics come second, so a lesson already being upgraded keeps its words;
  // a topic named in the lesson's title ("Marriage") goes before a looser match ("Love").
  const named = (o: OwnTopic) => (o.pack && key(o.pack.title).includes(key(o.category.name)) ? 0 : 1);
  for (const o of [...own].sort((a, b) => named(a) - named(b))) {
    if (o.pack && !offered.has(o.pack.id)) {
      o.add = o.pack.items.filter((p) => !owned.has(key(p.word)));
      offered.add(o.pack.id);
    }
  }
  return { lessons, own };
}

/** Whether there is anything to offer (used for the banner). */
export function hasUpgrade(plan: UpgradePlan): boolean {
  return plan.lessons.length > 0 || plan.own.some((o) => o.add.length > 0);
}
