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
import { LEGACY_PACK_WORDS, LEGACY_REPLACED_BY, LEGACY_V2_PACK_WORDS, LEGACY_V2_REPLACED_BY } from '../data/topicPacks/legacy';
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
  [/marriage|married|relationship|love|wedding|زواج|حب/i, 'relationships-and-norms'],
  [/personalit|feeling|emotion|character|شخصي|مشاعر/i, 'people-and-feelings'],
  [/shop|spend|money|buy|تسوق|فلوس/i, 'money-and-budgeting'],
  [/educat|learn|study|school|university|تعليم|دراس|مذاكر/i, 'learning-strategies'],
  [/interview|مقابل|انترفيو/i, 'career-and-interviews'],
  [/\bwork\b|office|job|career|شغل|عمل/i, 'workplace-responsibilities'],
  [/habit|routine|عادات|روتين/i, 'habit-change'],
  [/\bai\b|artificial|technolog|ذكاء/i, 'ai-at-work'],
  [/social media|internet|phone|app/i, 'social-media-and-fame'],
  [/crime|police|law|جريم/i, 'crime-law-justice'],
  [/travel|trip|airport|سفر/i, 'travel-and-accommodation'],
  [/food|restaurant|cook|eat|أكل|مطعم/i, 'food-and-ordering'],
  [/health|doctor|medical|صح|دكتور/i, 'health-and-lifestyle'],
  [/opinion|debate|argu|رأي|نقاش/i, 'argumentation-and-debate'],
  [/small talk|chat|conversation/i, 'meeting-people'],
  [/heritage|identity|roots|أصل/i, 'history-and-identity'],
  [/family|عيل|أسر/i, 'family-and-friends'],
  [/minimal|clutter|possession/i, 'consumerism-and-minimalism'],
  [/society|ethic|responsib|مجتمع/i, 'ethics-and-responsibility'],
  [/business|start-?up|entrepreneur|مشروع|بيزنس/i, 'entrepreneurship'],
  [/negotiat|\bdeals?\b|bargain|تفاوض/i, 'negotiation'],
  [/presentation|public speaking|meeting|email|عرض تقديمي/i, 'professional-communication'],
  [/leader|teamwork|قياد/i, 'leadership-and-feedback'],
  [/freelanc|remote|فريلانس/i, 'teamwork-and-freelancing'],
  [/time management|productiv|إدارة الوقت/i, 'time-and-habits'],
  [/friend|صداق|صحاب/i, 'friendship-and-conflict'],
  [/childhood|memor|طفول|ذكريات/i, 'life-experiences'],
  [/film|movie|series|book|novel|فيلم|أفلام|مسلسل|كتب/i, 'media-and-reviews'],
  [/invitation|making plans|عزوم/i, 'plans-and-invitations'],
  [/describ|appearance|وصف/i, 'people-and-feelings'],
  [/cultur|etiquette|custom|manners|ثقاف/i, 'cultures-and-living-abroad'],
  [/\bcity\b|village|countryside|مدين|ريف/i, 'cities-and-urban-life'],
  [/\bhome\b|house|\bflat\b|apartment|neighbo|\brent\b|سكن|بيت|جيران/i, 'home-and-neighborhood'],
  [/transport|traffic|driving|direction|مواصلات|زحم/i, 'directions-and-transport'],
  [/sport|fitness|\bgym\b|football|soccer|رياض/i, 'sports-and-fitness'],
  [/hobb|free time|هواي/i, 'hobbies-and-sports'],
  [/ramadan|\beid\b|celebrat|festival|رمضان|عيد|احتفال/i, 'celebrations-and-traditions'],
  [/environment|climate|pollution|بيئ|مناخ/i, 'climate-and-sustainability'],
  [/\bnews\b|media|journalis|أخبار|إعلام/i, 'news-and-media-literacy'],
  [/\bfame\b|famous|celebrit|مشاهير|شهرة/i, 'social-media-and-fame'],
  [/stress|mental|anxiety|توتر|نفسي/i, 'wellbeing-and-stress'],
  [/science|space|invent|علوم|فضاء/i, 'science-and-space'],
  [/happi|success|سعاد|نجاح/i, 'success-and-happiness'],
];

// Call center topics (from Call Center Prep) have no lesson in the general
// library — "Call Center Interview" must not turn into "Job Interview".
const CALL_CENTER = /call ?cent|كول ?سنتر/i;

export function lessonForTopicName(name: string): TopicPack | undefined {
  if (CALL_CENTER.test(name)) return undefined;
  const exact = TOPIC_PACKS.find((p) => key(p.title) === key(name));
  if (exact) return exact;
  const replaced = LEGACY_V2_REPLACED_BY[name] ?? LEGACY_REPLACED_BY[name];
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
    const legacy =
      LEGACY_PACK_WORDS[category.name] || LEGACY_V2_PACK_WORDS[category.name]
        ? [...(LEGACY_PACK_WORDS[category.name] ?? []), ...(LEGACY_V2_PACK_WORDS[category.name] ?? [])]
        : undefined;
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
