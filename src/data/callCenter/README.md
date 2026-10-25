# Call Center Prep (الاستعداد لمراكز الاتصال بالإنجليزية)

> **ملخص بالعربية:** قسم داخل «تعلم المهارات» متاح لكل الحسابات (كُتب أولًا لصاحب التطبيق): خطة من B1 إلى C1 ثم وظيفة في مركز اتصال بالإنجليزية في مصر
> (الدعم الفني أولًا، مع الاستعداد لأي حساب). مقسّمة إلى مستويات ← أسابيع ← أيام ← مهام، ولكل أسبوع اختبار قصير
> ولكل مستوى امتحان. المحتوى كله بالإنجليزية، والعربية في الملاحظات القصيرة فقط (`tipAr` و`noteAr`)، وبالفصحى.
> كل شيء داخل الكود فيعمل دون إنترنت، عدا المقاطع وYouGlish والذكاء الاصطناعي.
> المستويان 4 و5 لم يُبنيا بعد: خطتهما التفصيلية في [`ROADMAP.md`](./ROADMAP.md).

This is the guide for anyone (human or agent) changing the **Call Center Prep** section. Read it
before adding a week, a test or any content. The plan for the levels still to build (4 and 5) is
in [`ROADMAP.md`](./ROADMAP.md).

## 1. What it is

A section of Learn Skills, open to every account and first written for the app's owner: from barely B1 (rejected at the voice-note stage of a
telecom tech-support hiring process) to C1 and "overqualified" for English call center jobs in
Egypt. Tech support first, but ready for any account. Everything is free: AI feedback works by
copying a prompt into ChatGPT or Gemini, and the level check is EF SET.

| Tab | What's there |
|---|---|
| Today | The day to study: its tasks, its progress, and the optional **Power hours** for long study days (the owner plans up to six hours a day; the tasks are about two). |
| Roadmap | The vocabulary track, then levels 0–5 with their progress, exit criteria and days. 4 and 5 show "Coming next". |
| Vocab | The word bank: 384 call center words in 24 units, YouGlish for every word, a text per unit, the daily review and the vocab check. Goal: 90% known in a month. |
| Interview | 47 questions by group (HR, asked in Egypt, behavioral, situational, tech, fluency), model answers, the owner's own answers, a random-question drill. |
| Voice Studio | The recruiter's checklist, 9 voice-note prompts, recording with pace and pause analysis, takes to compare, a Gemini prompt for a recruiter's opinion. |
| Tests | The diagnostic, every weekly quiz and level exam, EF SET scores, typing results, the mistake log. |
| Job Tracker | Applications by hiring stage, what each stage tests, the numbers to beat, salaries, where to apply. |
| Library | YouTube playlists (role-play calls, mock calls, interview questions, Versant, American accent), played in the page. |
| Toolkit | The call flow on one card, the NATO alphabet, every phrase (searchable), typing practice, free tools. |
| Accent (extra) | Ibrahim Adel's phonetics and accent course. Optional: nothing from it is in the plan or the levels. |

The UI is English in both app languages (the owner asked for it), wrapped in `dir="ltr" lang="en"`,
with short, friendly notes in Modern Standard Arabic (`ArabicNote`; no dialect, see CLAUDE.md).

## 2. Who can see it

Every account. It was the owner's alone until it moved into **Learn Skills** (`skills`, see
`src/data/learnCatalog.ts`): the sidebar has no item of its own; the Learn Skills page opens it, and a
crumb above it (`HubCrumb`) leads back. The section is a lazy chunk.

- **The repo is public: never write the owner's email in code, tests, docs or commits.**
- Everyone's data is per-user in `user_kv` (row-level security), and recordings never leave the device.

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
| `ibrahimAdel.ts` | Ibrahim Adel's grammar course (three level playlists, scheduled in the plan) and accent course (the optional tab), from the English hub's catalog. |
| `vocab.ts` | The word bank: 24 units of 16 words in the Topic Library's `pos \| word \| definition \| example` lines, and a short text per unit. |
| `videos.ts` | The YouTube videos the plan's watch tasks use: id → title, length, channel. |
| `plan.ts` | The levels, the week specs and the day template (`buildDays`). |
| `tests.ts` | The diagnostic, the level exams' settings and extra items, retell stories, writing tasks. |
| `resources.ts` | Hiring stages, targets, salaries, companies, where to apply, free tools, rejection debriefs. |
| `catalog.ts` · `episodes.ts` · `library.ts` | The Library tab: playlists (import-free, read by the sync script), their generated episodes, and the section built from them. |
| `index.ts` | Re-exports and `getX(id)` lookups. |
| `src/lib/callCenter/` | Logic: `progress.ts` (saved data, plan progress), `quiz.ts` (building tests), `grading.ts`, `audio.ts` (pauses and pace), `recordings.ts` (IndexedDB), `voice.ts` (speech), `prompts.ts` (AI prompts), `vocab.ts` (word bank progress). |
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

**Ibrahim Adel's grammar course runs alongside too.** His three grammar playlists (Grammar from
Films for Level 1, Grammar for Level 2, Advanced Grammar for Level 3) are `lesson` tasks: one on every
study day of Level 1, every 5th day of Level 2 and every 3rd day of Level 3 (`every` in
`ibrahimAdel.ts`), placed by playlist order so new episodes don't move the scheduled ones. Each
level's exit criteria include its playlist. They play in the page, and their progress is shared with
the English hub's Grammar section. His accent course is the optional Accent tab, kept out of the plan
(a test checks).

**The word bank runs alongside.** A Level 1 week lists six units (`vocab`), and each of its days gets
one as its second task, so the 24 units take the 24 days of Level 1: a month. Weeks without units
(Levels 2–3) get a `vocab:due` task on days 1–5 instead: a review of the bank's words that are due.
The Level 1 exam day adds the vocab check (`VOCAB-CHECK`), and Level 1's exit criteria include 90% on it.

A unit is studied like this (`VocabActivity`): hear each word in real videos on YouGlish (the modal
steps through all 16, and each word heard is saved), read and hear the unit's text (device voice or
NaturalReader), then add the 16 words to the Vocabulary flashcards (category
`Call Center Vocab NN: title`) and practice them with the Vocabulary section's own modes (cards,
listening, gap-fill). From then on the flashcards' spaced repetition brings them back when due.
A word counts as **known** at mastery level 3; the goal is 90% of the bank known by day 30.
Once the words are in, each one can be flagged hard (it comes back every day), and the unit opens
the Vocabulary section's topic challenge (`TopicChallenge`, given the unit's text as its first
practice text): say every word until speech recognition hears it, read the texts aloud and record
them, shadow a video, talk 10 minutes with an AI playing a customer. The daily review runs in rounds
of 30 (`SESSION_SIZE`), hardest first, as the Vocabulary section's does.

**Your own words.** Select a word or short phrase anywhere in the section (double-click it, or drag
over it) and "Add to my words" pops up by it (`SelectionWordMenu`, app-wide; `data-vocab-group` on the
section picks the group): the word is looked up and saved with the sentence it was in as its example.
"New word" (in the section's header, in the Vocab tab and inside every test) opens
the Vocabulary section's quick add with the `Call Center: My words` group picked: a word met in a
lesson, a video or a test is looked up, saved as a flashcard, and reviewed in the daily review
(`vocab:due`) with the bank's words. They don't count toward the 90% goal (`myWordCards`, `reviewDue`
in `src/lib/callCenter/vocab.ts`). My words are shown with the Vocabulary section's cards (hear, flag hard,
edit, delete) and its "Check meanings" (the dictionary sense that fits the group's other words).

**Task ids are where progress is saved** (`<day id>:<kind>:<ref>`, e.g. `L1-W1-D1:sound:p-b`).
Changing a ref in a week the owner has already studied un-ticks that task, so only do it to fix
something broken. Never rename a day or week id.

## 5. Content rules

- **English content, American spelling** (color, center, canceled). Arabic only in `tipAr`
  (sounds, grammar, questions) and `noteAr` (weeks), in short, friendly Modern Standard Arabic (no dialect). The
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
- **Word bank**: the meaning the word has on a call, a learner-dictionary definition ending in `.`,
  a call center example, no word in two units (a test checks), 16 words a unit. Each unit's text
  uses at least 8 of its words. Unlike the Topic Library packs (British spelling), use American spelling.
- **Passages get a read-aloud bar** (`ReadAloud` in `ui.tsx`: the device's voice, or NaturalReader).
  YouGlish is for words; NaturalReader is for texts.
- **Videos: never guess an id.** Check every one on YouTube (title and length) before adding it
  to `videos.ts`. Episodes in `episodes.ts` come from YouTube itself, so they're safe to reuse.
- Every sound, phrase set, grammar point, script and scenario must be used by some week (a test checks).

## 6. Tests

- **Weekly quiz** (`buildWeeklyQuiz`): drawn from the week's content with a seed, so a retake gets a
  new mix: 5 grammar, 5 phrase questions, 2 dictations, 2 repeats, 2 sentence builds, 1 call to
  listen to, 4 word bank questions (the week's units, or the whole bank after Level 1), 1 speaking
  answer and 1 typing test. Pass mark 80%.
- **Level exam** (`LEVEL_EXAMS` in `tests.ts`): `draw` says how many items of each kind to take from
  the whole level (`vocab` from the level's units, or the whole bank), `extra` adds fixed items
  (story retelling, writing, a mock call, typing).
- **Vocab check** (`VOCAB-CHECK`, `buildVocabCheck`): 40 questions from the whole bank, a new sample
  every attempt (the word for a definition, or the word that completes an example). Pass mark 90%.
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
| `callcenter-vocab` | When the word bank month started, and the words heard on YouGlish. |
| `callcenter-progress` | Work left in the middle, by key: a test (`test:<id>`: attempt, question, answers so far), and per task the grammar answers, shadowing rounds, phrase practice position and a half-filled role-play rubric. Use `useSavedProgress(key, initial)` for anything new that takes more than one sitting. |

- **The word bank's progress lives in the flashcards** (`vocabulary_items`), like every other word you study,
  so it shows in Learn English → Vocabulary too; `callcenter-vocab` only adds the start date and YouGlish.
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
