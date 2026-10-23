# How to add a topic (topic pack)

> **ملخص بالعربي:** كل توبيك في خليل درس كامل ماشي بنفس طريقة سلايدز الكورس بتاع صاحب التطبيق:
> تسخين ← ١٢ كلمة (بمعناها في الموضوع ده ومثال في نفس السياق) ← قاعدة جرامر واحدة ← أسئلة نقاش ← مهمة كلام دقيقة ← براجراف.
> التوبيكات مكتوبة جوه الكود نفسه، فبتشتغل من غير نت أوتوماتيك. اتبع الخطوات اللي تحت بالظبط.

This is the guide for anyone (human or agent) adding a topic to Khalil's **Topic Library**
(`TopicLibraryModal`). Follow it exactly: the owner studies these lessons offline, often with
no internet at all, so every meaning and example has to be right on its own.

## 1. What a topic is: the course method

Every topic copies the lesson structure of the owner's English course (Level 8, about B2).
The slides of the course are the source of the eight `fromCourse` lessons in `course.ts`
(AI, Identity & Heritage, Habits, Minimalism, The Weight of the World, Smart Learning,
Crimes, Shop Smart). Each slide deck goes:

| Slides | Pack field | What to write |
|---|---|---|
| Icebreaker | `warmUp` | 2 short, personal questions that open the topic. |
| Vocabulary: 12 words, each with its type and an example | `items` | 12–14 words (see §3). |
| Grammar focus (form → use → example → 🚨 golden rule) | `grammar` | **One** grammar point that serves the topic (see §4). |
| Let's talk / Deep dive | `discussion` | At least 6 questions that make you use the words and the grammar. |
| Record yourself (WhatsApp voice note, 1 minute) | `task` | A prompt plus 4–6 points; the last one is always `Use at least 4 new words`. |
| — (added in Khalil) | `paragraph` | A listen-and-repeat model answer that uses the words and the grammar. |

Look at any pack in `course.ts` next to this guide before you write a new one.

## 2. Where it goes

- `work.ts` · `talk.ts` · `life.ts` · `society.ts`: one file per group (`group: 'work' | 'talk' | 'life' | 'society'`).
  Add the new pack at the end of the right file's array.
- `course.ts` is **only** for lessons taken from the owner's own course slides
  (`fromCourse: true`, kept as provenance only — Khalil is for everyone, so the UI never
  labels a lesson as "your course"). The test expects exactly 8 of them; if the owner sends a new course
  lesson, add it there and update that number in `topicPacks.test.ts`.
- `index.ts` already joins every file into `TOPIC_PACKS`. A new file needs to be added there.
- `legacy.ts` is history (old pack word lists). Don't touch it.

Nothing else is needed for the topic to show up: the library lists `TOPIC_PACKS`, the group
filter and search work on it, and it works **offline** automatically because the packs are
part of the app bundle (the service worker in `scripts/sw.template.js` saves the whole build).
Never load topics from Supabase or another server: that would break offline study.

## 3. The words (`items`)

Items are written one per line inside the template string:

```
pos | word | definition | example
```

| `pos` | Shown as | Use for |
|---|---|---|
| `n` | noun | nouns and noun phrases (`carbon footprint`) |
| `v` | verb | verbs, including verb + preposition (`confide in`) |
| `adj` | adjective | |
| `adv` | adverb | |
| `pv` | phrasal verb | `take on`, `cut down on` |
| `i` | idiom | `pull your weight`, `the tip of the iceberg` |
| `p` | phrase | fixed phrases that aren't idioms (`of medium height`) |

Rules, all of them important:

1. **The meaning is the one the word has in this topic**, not the dictionary's first sense.
   "set up" in *Starting a Business* = start a company; "fast" in *Ramadan* = eat and drink
   nothing. The definition and the example must show that same sense.
2. **Definition**: learner-dictionary style (Oxford Learner's / Cambridge), in words simpler
   than the headword, a full sentence that ends with `.` (the test also accepts `)` for a
   label like `(informal)`).
3. **Example**: one natural sentence (about 8–20 words) that a B2 learner could say, set in
   the topic, using the word in the defined sense. Make it concrete and relatable to an
   Egyptian learner when it fits (Cairo, the metro, Eid, a call center…). No examples
   borrowed from another sense.
4. **Mix**: mostly nouns, verbs and adjectives that let you *discuss* the topic, plus at least
   **one phrasal verb** and **one idiom** (the test checks). 11–16 items; aim for 12–13.
5. **No word may appear in two packs** (the test checks, case-insensitive). Before you choose
   words, list the ones already used:
   ```bash
   grep -hE '^(n|v|adj|adv|pv|i|p) \|' src/data/topicPacks/*.ts | cut -d'|' -f2 | sort
   ```
6. **English only** inside packs (no Arabic letters; the test checks).
7. Write the word in its base form. Spell out `someone` / `something` (`meet someone halfway`),
   don't use `sb` / `sth`. Avoid `/` alternatives.
8. Use **British spelling**, like the rest of the packs (neighbour, colour, practise as a
   verb, organise).
9. Don't put a `|` or a backtick inside a line; it breaks the format. Straight apostrophes are
   fine inside the template string.

## 4. Grammar, discussion, task, paragraph

- `grammar.title`: the point, e.g. `Third conditional: imagining a different past`.
- `grammar.points`: 2–4 objects `{ form, use, example }`, like the slides' formula boxes
  (`have/has + been + V-ing`, "Use this to…", one example).
- `grammar.tip`: the golden rule or the most common mistake, ideally one Arabic speakers make.
- Choose a grammar point that **no other pack teaches yet**, unless the owner's slides use it.
  List the ones already taken:
  ```bash
  grep -h "        title: '" src/data/topicPacks/*.ts | sort
  ```
- `discussion`: at least 6 open questions that need the new words and the grammar.
- `task`: `{ prompt, points }`, the one-minute voice note. 4–6 points, ending with
  `Use at least 4 new words`.
- `paragraph`: 6–9 sentences in the first person that use most of the words and the grammar
  point (the test needs at least 4 sentences). Topic Challenge uses it as the first text to
  listen to and read aloud, so it must sound natural.
- Strings: use typographic apostrophes `’` inside single-quoted strings (as the other packs do)
  or double quotes when the text has a straight `'`.

## 5. The rest of the pack

```ts
pack(
  {
    id: 'kebab-case-id',          // unique
    group: 'life',                // work | talk | life | society
    title: 'Title Case Name',     // unique; shown in the library
    description: 'One line about what you can talk about after this lesson.',
    level: 'B2',                  // B1 | B2 | C1
    emoji: '🌱',
    warmUp: [...], grammar: {...}, discussion: [...], task: {...}, paragraph: '...',
  },
  `
n | word | Definition. | Example.
...
`
),
```

Optional: if users are likely to have their own topic with a similar name ("Friends",
"رمضان"), add a pattern to `SUBJECTS` in `src/lib/topicUpgrade.ts` so the library can offer the
lesson to them (add a case to `topicUpgrade.test.ts`).

## 6. Check before you commit

```bash
npx vitest run src/data/topicPacks src/lib/topicUpgrade.test.ts src/components/Vocabulary
npm run lint
npx tsc -b --noEmit
```

The pack tests check unique ids, titles and words; at least one phrasal verb and one idiom;
definitions ending in `.`; no Arabic letters; enough warm-up, grammar, discussion and task
content; and that **every word line was read** (a mistyped `pos` or a missing `|` would
otherwise drop the word silently).

Then read your pack once more as the learner would, offline, with no dictionary: is every
meaning the one this topic needs, and does every example prove it?
