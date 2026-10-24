# Sales Prep (تعلّم السيلز)

> **ملخص بالعربي:** قسم جوه «تعلم المهارات» ومتاح لكل الأكونتات (اتعمل الأول لصاحب التطبيق): يتعلم سيلز وماركتينج وتفاوض من الصفر، معرفة تنفعه في أي شغل.
> الأساس 4 كتب معرفة (السيلز، علم نفس القرار، الماركتينج، التفاوض) متوزعة كمهام يومية على المستوى 1 و 2
> بالعربي، وبعدهم المستوى 3 نفس المهارات بالإنجليزي. بيع الأجهزة الإلكترونية (شغله الحالي، اللي هيتعلمه جوه
> الشركة) في تبويب «إضافي» برا الخطة. مقسوم مستويات ← أسابيع ← أيام ← مهام، وتبويب «النهارده»
> بيعرض يوم واحد بس (حوالي ساعة). كل المحتوى جوه الكود فبيشتغل من غير نت، ما عدا الفيديوهات والبودكاست والـ AI.

Read this before adding a week, a level or any content.

## 1. What it is

A section of Learn Skills (`skills`, see `src/data/learnCatalog.ts`), open to every account. It was written for
the app's owner, a beginner in sales. The owner asked for a daily plan where they
only think about today, with the whole roadmap, data and progress kept for them.

| Tab | What's there |
|---|---|
| النهارده (Today) | The day to study, only its tasks (about an hour), and tomorrow's title. |
| المعرفة (Knowledge) | Four short books (`knowledge.ts`): sales, negotiation, marketing, the psychology of decisions. Each chapter is also a task in Levels 1–2; any chapter can be read here any time. |
| الخريطة (Roadmap) | Levels 0–4 with progress, exit criteria, weeks and days. |
| الدفتر والتقدم (Notebook) | Minutes over the last two weeks, quiz and role-play results, and everything written in the plan. |
| المكتبة (Library) | Free podcasts, channels, courses and books, Arabic first (`sources.ts`). |
| إضافي: الأجهزة (Extra) | Selling electronics (`electronics.ts`), outside the plan: lessons, drills and role-plays to open before the first days in the job. Nothing here counts toward a level. |

The chrome is Egyptian Arabic (`dir="rtl"`); English weeks render in `LangBlock lang="en"` (left to right).
Every account sees it, from the Learn Skills page (never write the owner's email anywhere: the repo is public).

## 2. Where things are

| Path | What |
|---|---|
| `types.ts` | Content and plan types. |
| `level1.ts` · `level2.ts` · `level3.ts` | The weeks of each level (`SalesWeekSpec`: lessons, listening, drills, role-plays, a mission, speaking, `knowledge` chapters, and words in English weeks): 1 basics, 2 the market, marketing and negotiation, 3 English. |
| `electronics.ts` | The Extra tab's four electronics topics, in the same shape (`EXTRA_WEEKS` in `plan.ts`). |
| `knowledge.ts` | The Knowledge books, `getChapter` and `READING_ORDER` (the books in turn). |
| `start.ts` | The first day's lesson and recording, the exam role-plays and speaking tasks (`compareWith` plays the day-one recording beside the new one), the notebook prompts. |
| `plan.ts` | `LEVELS`, the day template (`buildDays`), `PLAN_DAYS` and the `getX(id)` lookups. |
| `sources.ts` · `links.ts` | The Library, and link helpers. |
| `src/lib/sales/` | `progress.ts` (saved data, plan progress), `recordings.ts` (takes on the device), `quiz.ts` (quizzes from the lessons), `prompts.ts` (AI prompts), `tasks.ts` (task titles), `text.ts`. |
| `src/components/Sales/` | `SalesPrep.tsx` (shell and tabs), one view per tab, `TaskCard.tsx` and `activities/` (one per task kind). |

## 3. The plan

Levels → weeks → days → tasks. Days are study days, not dates: Today shows the first unfinished day.

- **Level 0**: one day: the "start here" lesson, a "before" recording (sell me this pen), the first-day check, a notebook line.
- **Levels 1–3**: four weeks each, then an exam day (`S1-EXAM`…): review, a full role-play, a speaking task, the exam, a notebook line.
- **Knowledge is the foundation.** Each Level 1–2 week lists `knowledge` chapter ids, one a study day from
  day 1: Level 1 takes "السيلز بجد" and "علم نفس القرار", Level 2 "الماركتينج" and "التفاوض". Every
  chapter is in the plan exactly once (a test checks), their checks join the weekly quiz and the level
  exam, and reading them is an exit criterion of the level. **Level 3** is the same skills in English.
- **Selling electronics is an extra**, not a level: the owner's current job, learned properly inside the
  company. Its progress is saved in the task log as `extra:<kind>:<id>` and never counts in the plan.
- Each week has its own `lang`, so a level could mix languages (none does for now).
- A level with `status: 'planned'` and an `outline` shows as "later" in the roadmap (none for now).

Every week has the same six days (`buildDays`), so a week needs exactly **5 lessons, 3 listens, 2 drills,
2 role-plays, 1 mission, 3 speaking prompts** (and **12 words** in English weeks):

| Day | Tasks |
|---|---|
| 1 | lesson 1 · (words) · listen 1 · drill 1 · speak 1 · notebook |
| 2 | lesson 2 · role-play 1 · notebook |
| 3 | lesson 3 · listen 2 · drill 2 · speak 2 · notebook |
| 4 | lesson 4 · mission · notebook |
| 5 | lesson 5 · listen 3 · role-play 2 · speak 3 · notebook |
| 6 | review · weekly quiz |

Weeks with `knowledge` add one chapter task (10 min) to each study day, in order.

A day's title is its lesson's title. Keep days between 35 and 100 minutes (a test checks).

**Task ids are where progress is saved** (`<day id>:<kind>:<ref>`). Changing a lesson id or a week's
order un-ticks tasks the owner already did, so only do it to fix something broken.

## 4. Content rules

- **Levels 1–2 (and the Extra) are Egyptian Arabic**, simple and friendly, for a beginner. **Level 3 is simple English**
  (American spelling), with Arabic only in `noteAr` (weeks and lessons), the words' `ar`, and drills that
  give Arabic lines to translate (a test checks).
- **Lessons**: one idea; a one-line `summary`, 3–5 `points`, an optional short `example`, beginner
  `mistakes`, and 2–3 `check` questions (they also make the weekly quiz and the exams).
- **Role-plays**: made-up companies; `steps` (4+) are the self-score checklist and what the AI scores.
- **Missions** are small, safe things to do in real life, with `reflect` questions for the notebook.
- **Listening: never guess a video id.** Use `videoId` only for a video you've confirmed exists (title
  known); otherwise link a YouTube or Spotify search for the topic (`ytSearch`, `spotifySearch`), so a
  removed video never breaks a day. Each listen has 2+ questions answered in the notebook.
- **Ethics**: sell by helping; no fake scarcity or lies, in lessons, models and role-plays.
- **Electronics facts** (the Extra) stay general and safe: rules of thumb are labeled approximate (TV size, AC
  horsepower), no prices or offers that go stale, and no real store names in role-plays.
- **Knowledge chapters**: one real idea, 3–5 sections, an example, `inLife` (life and any job), `tryIt`, a
  `source` (book, author or study: never invent one), and 2 checks. Keep them Egyptian Arabic with the
  English term in the text where it helps. A new chapter must also go into a week's `knowledge` (a test
  checks that every chapter is in the plan once).

## 5. Tests and quizzes

- **Weekly quiz** (`S1-W1-QUIZ`): every check of the week's lessons and knowledge chapters (and a question
  per word in English weeks), in a new order every attempt. Pass 80%; the task ticks itself when passed.
- **Level exam** (`S1-EXAM`): 25 questions sampled from the whole level, new each attempt. Pass 80%.
- **First-day check** (`S0-DIAG`): ten fixed questions from Levels 1–2, only to measure (no pass mark).
- Missed questions are saved with the attempt and shown on the review days.

## 6. Saved data and offline

Per-user `user_kv` values (through `useKv`, with a copy on the device):

| Key | Holds |
|---|---|
| `sales-tasks` | Task id → the date it was done (progress, minutes, streak). |
| `sales-tests` | Quiz id → attempts (percent, passed, missed questions), the last 20. |
| `sales-notes` | Everything written: the notebook (`<task id>`), and answers (`<task id>#<n>`) to listening questions, drills and missions. |
| `sales-calls` | Role-plays scored with their checklist. |
| `sales-knowledge` | Knowledge chapters read (from the plan or the tab): chapter id → date. Notes on a chapter's "try it" are in `sales-notes` as `knowledge:<chapter id>`. |

English weeks' words go into the Vocabulary flashcards (`Sales English N: <week title>`). Recordings stay on
the device, in Call Center Prep's IndexedDB store with a `sales:` prompt prefix (the first take and the latest five). The tab is in `localStorage` (`khalil-sales-tab`). Videos, podcasts, searches
and the AI partners need the internet; everything else is bundled.

## 7. Checks

```bash
npm run lint
npx tsc -b --noEmit
VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=fake npx vitest run src/data/sales src/lib/sales src/components/Sales
npm run build
# with the dev server running:
node scripts/e2e/sales.mjs http://localhost:5173 ./e2e-shots
```
