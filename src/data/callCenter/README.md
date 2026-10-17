# Call Center Prep (التحضير لكول سنتر انجلش)

> **ملخص بالعربي:** ده قسم خاص بصاحب التطبيق بس: خطة من B1 لـ C1 وشغلانة كول سنتر انجلش في مصر
> (تيكنكال سبورت الأول، وجاهز لأي أكونت). مقسومة ليفلات ← أسابيع ← أيام ← مهام، ولكل أسبوع quiz
> ولكل ليفل امتحان. المحتوى كله انجليزي، والعربي بس في الملاحظات الصغيرة (`tipAr` و `noteAr`).
> كل حاجة جوه الكود فبتشتغل من غير نت، ما عدا الفيديوهات و YouGlish والـ AI.
> ليفل 4 و 5 لسه متبنوش: الخطة التفصيلية بتاعتهم في [`ROADMAP.md`](./ROADMAP.md).

This is the guide for anyone (human or agent) changing the **Call Center Prep** section. Read it
before adding a week, a test or any content. The plan for the levels still to build (4 and 5) is
in [`ROADMAP.md`](./ROADMAP.md).

## 1. What it is

A private section for the app's owner: from barely B1 (rejected at the voice-note stage of a
telecom tech-support hiring process) to C1 and "overqualified" for English call center jobs in
Egypt. Tech support first, but ready for any account. Everything is free: AI feedback works by
copying a prompt into ChatGPT or Gemini, and the level check is EF SET.

| Tab | What's there |
|---|---|
| Today | The day to study: its tasks, its progress, and the optional **Power hours** for long study days (the owner plans up to six hours a day; the tasks are about two). |
| Roadmap | Levels 0–5 with their progress, exit criteria and days. 4 and 5 show "Coming next". |
| Interview | 47 questions by group (HR, asked in Egypt, behavioral, situational, tech, fluency), model answers, the owner's own answers, a random-question drill. |
| Voice Studio | The recruiter's checklist, 9 voice-note prompts, recording with pace and pause analysis, takes to compare, a Gemini prompt for a recruiter's opinion. |
| Tests | The diagnostic, every weekly quiz and level exam, EF SET scores, typing results, the mistake log. |
| Job Tracker | Applications by hiring stage, what each stage tests, the numbers to beat, salaries, where to apply. |
| Library | YouTube playlists (role-play calls, mock calls, interview questions, Versant, American accent), played in the page. |
| Toolkit | The call flow on one card, the NATO alphabet, every phrase (searchable), typing practice, free tools. |

The UI is English in both app languages (the owner asked for it), wrapped in `dir="ltr" lang="en"`,
with short friendly Egyptian Arabic notes (`ArabicNote`).

## 2. Who can see it

`src/lib/callCenter/access.ts` hashes the signed-in email (SHA-256 of a salt plus the trimmed,
lower-cased email) and compares it with `OWNER_HASHES`. The sidebar item and the route in
`App.tsx` both use `useCallCenterAccess()`, and the section is a lazy chunk.

- **The repo is public: never write the owner's email in code, tests, docs or commits.** To let
  another account in, compute its hash (`emailHash()` in the browser console or a Node one-liner)
  and add the hash.
- `VITE_CALL_CENTER_PREVIEW=1` shows the section to any account, for screenshots and E2E runs.
  Never set it on the deployed site.
- It's a visibility gate, not a secret: the content is in the repo and the built bundle. The
  owner's data is per-user in `user_kv` (row-level security), and recordings never leave the device.

## 3. Where things are

| Path | What |
|---|---|
| `types.ts` | Every content and plan type. |
| `sounds.ts` | 38 sounds and speaking habits Arabic speakers find hard (how-to, Arabic tip, minimal pairs, YouGlish words, drills). |
| `phrases.ts` | 36 phrase sets of exactly 8 phrases, each with its use (and the weaker phrase it replaces). |
| `grammar.ts` | 14 grammar points, each with 8 exercises. |
| `scripts.ts` | 28 model calls and interviews to listen to and shadow, each with 3 questions. |
| `scenarios.ts` | 28 role-plays for an AI partner (the AI is the customer or the interviewer). |
| `interview.ts` | The interview bank (`QUESTIONS`) and the voice-note prompts (`VOICE_PROMPTS`). |
| `typing.ts` | Typing texts (ticket notes, emails, chats). ASCII only. |
| `videos.ts` | The YouTube videos the plan's watch tasks use: id → title, length, channel. |
| `plan.ts` | The levels, the week specs and the day template (`buildDays`). |
| `tests.ts` | The diagnostic, the level exams' settings and extra items, retell stories, writing tasks. |
| `resources.ts` | Hiring stages, targets, salaries, companies, where to apply, free tools, rejection debriefs. |
| `catalog.ts` · `episodes.ts` · `library.ts` | The Library tab: playlists (import-free, read by the sync script), their generated episodes, and the section built from them. |
| `index.ts` | Re-exports and `getX(id)` lookups. |
| `src/lib/callCenter/` | Logic: `progress.ts` (saved data, plan progress), `quiz.ts` (building tests), `grading.ts`, `audio.ts` (pauses and pace), `recordings.ts` (IndexedDB), `voice.ts` (speech), `prompts.ts` (AI prompts), `access.ts`. |
| `src/components/CallCenter/` | The UI: `CallCenterPrep.tsx` (shell and tabs), one view per tab, `TaskCard.tsx` and `activities/` (one per task kind), `TestRunner.tsx` and `testItems.tsx`. |

## 4. The plan

Levels → weeks → days → tasks. Days are study days, not dates: Today shows the first unfinished
day (`currentDayIndex`) and you move on whenever it's done.

- **Level 0** is one diagnostic day: a baseline voice note, the diagnostic test and EF SET.
- **Levels 1–3** (4, 6 and 4 weeks) end with an exam day (`L1-EXAM`…): the mistake log, then the exam.
- **Levels 4–5** have `status: 'planned'` and an `outline`; see `ROADMAP.md`.

A week lists what it teaches (`WeekContent`) and `buildDays()` turns it into six days, so every
week has the same rhythm:

| Day | Tasks |
|---|---|
| 1 Learn the week | sound 1 · video 1 · phrase set 1 · grammar · speaking 1 · typing 1 |
| 2 Shadow a real call | sound 2 · video 2 · phrase set 2 · shadow script 1 · speaking 2 · typing 2 |
| 3 Your first role-play | sound 3 · video 3 · grammar again · role-play 1 · speaking 3 · typing 1 |
| 4 More phrases, another call | sound 4 · video 4 · phrase set 3 (or set 1 again) · shadow script 2 · speaking 4 · typing 2 |
| 5 Put it all together | the 4 sounds again · video 5 · role-play 2 · speaking 5 · typing 1 |
| 6 Review & weekly quiz | review · `Lx-Wy-QUIZ` |

So a week needs exactly: 4 sounds, 2–3 phrase sets, 1 grammar point, 2 scripts, 2 scenarios,
5 speaking refs (interview question ids, or `voice:<id>` for a voice note), 5 videos and 2 typing texts.

**Task ids are where progress is saved** (`<day id>:<kind>:<ref>`, e.g. `L1-W1-D1:sound:p-b`).
Changing a ref in a week the owner has already studied un-ticks that task, so only do it to fix
something broken. Never rename a day or week id.

## 5. Content rules

- **English content, American spelling** (color, center, canceled). Arabic only in `tipAr`
  (sounds, grammar, questions) and `noteAr` (weeks), in short, friendly Egyptian Arabic. The
  content test fails on Arabic anywhere else.
- **The owner is the agent and the candidate**: the agent is called Belal; the candidate is a
  software developer from Cairo moving into tech support. Customers and companies in scripts and
  role-plays are made up (NetLink, TechCare…); real companies only appear in `resources.ts`.
- **Phrases** sound like a real US-account agent: positive scripting, no "Kindly", no "Dear
  customer". Exactly 8 per set, all different, each with a `use`.
- **Grammar**: at least 3 points (form, use, example), a golden-rule `tip`, exactly 8 exercises
  with different options; the mistake Arabic speakers make goes in the tip.
- **Scripts**: at least 6 lines and exactly 3 comprehension questions; keep the speaker roles
  (`agent`, `customer`, `recruiter`, `you`…) right, as the two voices follow them.
- **Interview answers**: model answers of 20+ words that fit the owner's story, plus tips,
  phrases and mistakes.
- **Typing texts**: plain ASCII (no smart quotes or dashes), the kind of thing an agent types.
- **Videos: never guess an id.** Check every one on YouTube (title and length) before adding it
  to `videos.ts`. Episodes in `episodes.ts` come from YouTube itself, so they're safe to reuse.
- Every sound, phrase set, grammar point, script and scenario must be used by some week (a test checks).

## 6. Tests

- **Weekly quiz** (`buildWeeklyQuiz`): drawn from the week's content with a seed, so a retake gets a
  new mix: 5 grammar, 5 phrase questions, 2 dictations, 2 repeats, 2 sentence builds, 1 call to
  listen to, 1 speaking answer and 1 typing test. Pass mark 80%.
- **Level exam** (`LEVEL_EXAMS` in `tests.ts`): `draw` says how many items of each kind to take from
  the whole level, `extra` adds fixed items (story retelling, writing, a mock call, typing).
- **Diagnostic** (`DIAGNOSTIC`): fixed items. The first 15 are grammar questions, five each at B1,
  B2 and C1; `estimateGrammarLevel()` reads them, so keep that order.
- Item types copy the real hiring tests (Versant-style repeat, sentence builds, story retelling,
  typing, a mock call). Speaking, writing and calls are self-scored with the rubrics in
  `grading.ts`; repeats are checked with speech recognition when the browser supports it and is online.
- Wrong answers go to the mistake log (`callcenter-mistakes`), read before every exam.

## 7. Saved data and offline

Per-user `user_kv` values (through `useKv`, with a copy on the device, so they work offline):

| Key | Holds |
|---|---|
| `callcenter-tasks` | Task id → the date it was done (progress, minutes, streak). |
| `callcenter-tests` | Test id → attempts (percent, passed, per-skill scores), the last 20. |
| `callcenter-typing` | Typing results. |
| `callcenter-answers` | The owner's own interview answers. |
| `callcenter-applications` | The job tracker. |
| `callcenter-mistakes` | The mistake log. |
| `callcenter-calls` | Role-plays scored with the QA rubric. |
| `callcenter-voice` | What's known about each recording (length, pauses, pace, rating); not the audio. |
| `callcenter-settings` | EF SET scores. |

- **Recordings stay on the device**: IndexedDB `khalil-callcenter`, store `takes`. For each prompt it
  keeps the first take (the "before") and the latest five. Downloading a take is how it goes to Gemini.
- The Library tab shares `english-course-progress` and `english-course-positions` with the English hub.
- The last tab is in `localStorage` (`khalil-cc-tab`).

Everything above is bundled, and the service worker saves the section's chunk with the rest of the
build, so the plan, lessons, tests, recording and the device's voices work offline. Videos,
YouGlish, NaturalReader, the AI partners, EF SET and the live transcript (speech recognition) need
the internet, and their buttons say so.

## 8. Adding a week or a level

1. Write the new content in the banks, following §5.
2. Add the week spec (title, goal, `noteAr`, content) to `WEEKS` in `plan.ts`. For a new level, widen
   `WEEKS` and `buildWeeks()` to it, and in `LEVELS` set `status: 'ready'`,
   `weeks: buildWeeks('L4')`, `extraDays: [examDay('L4', '…')]` and `examId: 'L4-EXAM'`, and remove
   its `outline`.
3. Add the level exam to `LEVEL_EXAMS` in `tests.ts` (`TYPING_TARGETS` in `quiz.ts` already has L4 and L5).
4. Update the plan test in `callCenter.test.ts` (ready levels and week counts) and `ROADMAP.md`.
5. Library playlists: add them to `catalog.ts`, then run `node scripts/sync-courses.mjs callcenter`.
6. Run the checks:

```bash
npm run lint
npx tsc -b --noEmit
VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=fake npx vitest run src/data/callCenter src/lib/callCenter src/components/CallCenter
npm run build
```
