# How to add a topic (topic pack)

> **ملخص بالعربي:** كل توبيك في خليل درس كامل ماشي بنفس طريقة سلايدز الكورس بتاع صاحب التطبيق:
> تسخين ← ١٢ كلمة (بمعناها في الموضوع ده ومثال في نفس السياق) ← قاعدة جرامر واحدة ← أسئلة نقاش ← مهمة كلام دقيقة ← براجراف.
> التوبيكات من A1 لـ C1، وبعضها بيرجع لتوبيك قديم في مستوى أعلى. كل كلمة متراجعة على قاموس Cambridge
> (المستوى والمعنى)، والتعريف مكتوب بأسلوبنا من المعنى ده. التوبيكات جوه الكود نفسه، فبتشتغل من غير نت.

This is the guide for anyone (human or agent) adding a topic to Khalil's **Topic Library**
(`TopicLibraryModal`) and the Learning Path. Follow it exactly: people study these lessons
offline, often with no internet at all, so every meaning and example has to be right on its own.

## 1. What a topic is: the course method

Every topic copies the lesson structure of the owner's English course. Eight lessons
(`fromCourse: true`) took their subject and grammar from the course slides (AI, Identity &
Heritage, Habits, Minimalism and Shop Smart, The Weight of the World, Smart Learning, Crimes);
this is provenance only — Khalil is for everyone, so the UI never labels a lesson as "your course".

| Slides | Pack field | What to write |
|---|---|---|
| Icebreaker | `warmUp` | 2 short, personal questions that open the topic. |
| Vocabulary: 12 words, each with its type and an example | `items` | 12–16 words (see §3). |
| Grammar focus (form → use → example → 🚨 golden rule) | `grammar` | **One** grammar point that serves the topic (see §4). |
| Let's talk / Deep dive | `discussion` | At least 6 questions that make you use the words and the grammar. |
| Record yourself (WhatsApp voice note, 1 minute) | `task` | A prompt plus 4–6 points; the last one is always `Use at least 4 new words`. |
| — (added in Khalil) | `paragraph` | A listen-and-repeat model answer that uses the words and the grammar. |

## 2. Levels, order and revisits

- One file per level: `a1.ts` · `a2.ts` · `b1.ts` · `b2.ts` · `c1.ts`, joined in that order in
  `index.ts`. `TOPIC_PACKS` is in study order, and the Learning Path takes the topics in that
  order (from the level a learner chooses), so **add a new topic in its level's file, in the place
  where it should be studied**.
- A level is the language the learner needs, not the subject: "Housing" is A1 when you describe
  your home, B2 when you discuss rents and tenants' rights, C1 when you judge housing policy.
- So a topic **comes back** at a higher level as its own pack, with new words, a new grammar
  point and a harder task: set `revisits` to the id of the earlier pack (e.g. `housing-costs`
  revisits `housing-rent-or-buy`). In each level, the new topics come first and the revisits after.
- What each level asks of the learner (CEFR):
  - **A1** — introduce yourself, ask and answer simple questions; very common words, short sentences.
  - **A2** — handle everyday situations: explain, ask for things, describe routines and past events.
  - **B1** — tell stories, give opinions with reasons, deal with most situations at work and while traveling.
  - **B2** — discuss and argue about concrete and abstract topics in detail, compare options.
  - **C1** — handle complex issues and opposing views, read between the lines, speak and write precisely.
- `group` (`work` · `talk` · `life` · `society`) is only the library's filter.
- `legacy.ts` keeps the words and titles of earlier versions, so a user's topic made from an old
  pack is matched to the pack that replaced it (`src/lib/topicUpgrade.ts`). When you replace or
  rename a pack, add the old title there.

## 3. The words (`items`): from a reference, checked against Cambridge

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
   "split up" in a marriage lesson = end a relationship, not divide into groups; "fast" in Ramadan =
   eat and drink nothing. The definition and the example must show that same sense.
2. **Check every word against the Cambridge Dictionary** before you use it:
   `python3 scripts/check-word-levels.py` looks every pack word up (politely, one request every
   ~1.2 s, cached) and writes `wordSources.json`: the Cambridge page, the CEFR level when Cambridge
   gives one, and the guidewords of its senses. The test requires an entry for every word. Then
   **read the senses yourself**: the sense you define must be one Cambridge lists (look for its
   guideword, e.g. TRAVEL for "commute"). Don't use the Oxford site: its robots.txt asks AI agents
   not to crawl it.
3. **Level**: a word should be at the pack's level or below (one level above is fine for a key
   word of the topic). The checker prints the words that are two or more levels too hard.
4. **Definition**: write it yourself, in learner-dictionary style and in words simpler than the
   headword, from the Cambridge sense — never copy Cambridge's wording. A full sentence that ends
   with `.` (the test also accepts `)` for a label like `(informal)`).
5. **Example**: one natural sentence (about 8–20 words) that a learner at that level could say, set
   in the topic, using the word in the defined sense. Make it concrete and relatable to an Egyptian
   learner when it fits (Cairo, the metro, Eid, a call center…).
6. **Mix**: mostly nouns, verbs and adjectives that let you *discuss* the topic, plus at least **one
   phrasal verb**, and from B2 on at least **one idiom** (the test checks). 11–16 items.
7. **No word may appear in two packs** (the test checks, case-insensitive).
8. **English only** inside packs (no Arabic letters; the test checks).
9. Write the word in its base form. Spell out `someone` / `something` (`meet someone halfway`),
   don't use `sb` / `sth`. Avoid `/` alternatives.
10. Use **American English**: the spelling (neighbor, color, practice as a verb, organize, traveling,
    center) and the words (apartment, vacation, line, trash, on weekends, in college). The test checks
    the common British spellings and words.
11. Don't put a `|` or a backtick inside a line; it breaks the format.

## 4. Grammar, discussion, task, paragraph

- `grammar.title`: the point, e.g. `Third conditional: imagining a different past`. Choose one that
  **no other pack teaches** and that fits the level (A1: be, present simple, there is; C1: inversion,
  hedging, the subjunctive). List the ones taken:
  ```bash
  grep -h "        title: '" src/data/topicPacks/*.ts | sort
  ```
- `grammar.points`: 2–4 objects `{ form, use, example }`, like the slides' formula boxes.
- `grammar.tip`: the golden rule or the most common mistake, ideally one Arabic speakers make.
- `discussion`: at least 6 open questions that need the new words and the grammar.
- `task`: `{ prompt, points }`, the one-minute voice note. 4–6 points, ending with `Use at least 4 new words`.
- `paragraph`: 6–9 sentences in the first person that use most of the words and the grammar point,
  at the pack's level (short and simple at A1). Topic Challenge uses it as the first text to listen
  to and read aloud, so it must sound natural.
- Strings: use typographic apostrophes `’` inside single-quoted strings, or double quotes when the
  text has a straight `'`.

## 5. The rest of the pack

```ts
pack(
  {
    id: 'kebab-case-id',          // unique
    group: 'life',                // work | talk | life | society
    title: 'Title Case Name',     // unique; shown in the library
    description: 'One line about what you can talk about after this lesson.',
    level: 'B2',                  // A1 | A2 | B1 | B2 | C1
    emoji: '🌱',
    revisits: 'earlier-pack-id',  // only for a topic that comes back at a higher level
    warmUp: [...], grammar: {...}, discussion: [...], task: {...}, paragraph: '...',
  },
  `
n | word | Definition. | Example.
...
`
),
```

If users are likely to have their own topic with a similar name ("Friends", "رمضان"), make sure a
pattern in `SUBJECTS` in `src/lib/topicUpgrade.ts` points to the lesson (add a case to
`topicUpgrade.test.ts`).

## 6. Check before you commit

```bash
python3 scripts/check-word-levels.py      # Cambridge levels and senses → wordSources.json
npx vitest run src/data/topicPacks src/lib/topicUpgrade.test.ts src/lib/learningPath.test.ts src/components/Vocabulary
npm run lint
npx tsc -b --noEmit
```

The pack tests check unique ids, titles and words; a Cambridge source for every word; phrasal verbs
and idioms; definitions ending in `.`; no Arabic letters; American English; enough warm-up,
grammar, discussion and task content; and that **every word line was read** (a mistyped `pos` or a
missing `|` would otherwise drop the word silently).

Then read your pack once more as the learner would, offline, with no dictionary: is every meaning
the one this topic needs, and does every example prove it?
