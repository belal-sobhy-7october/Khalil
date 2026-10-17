# Call Center Prep: roadmap (Levels 4 and 5)

> **بالعربي:** ليفل 0 لـ 3 جاهزين في الأبلكيشن وبيوصّلوك لمستوى "جاهز للشغل" (B2+). الملف ده فيه
> الخطة التفصيلية لليفل 4 (Advanced, C1) و 5 (Overqualified) عشان أي session جاية تكمّل من هنا:
> كل أسبوع بهدفه وأصواته وعباراته والجرامر والمكالمات والـ role-plays والامتحان. قبل ما تبني، اقرا
> [`README.md`](./README.md) (القواعد وطريقة إضافة أسبوع).

## Where things stand

| Level | Name | CEFR | Weeks | Status |
|---|---|---|---|---|
| — | Vocabulary (word bank) | 384 words | alongside Level 1 | ✅ built: a unit a day, then a daily review |
| 0 | Diagnostic | starting point | 1 day | ✅ built |
| 1 | Foundation | B1 → B1+ | 4 | ✅ built |
| 2 | Customer Service Core | B1+ → B2 | 6 | ✅ built |
| 3 | Interview Bootcamp | B2 → B2+ · job-ready | 4 | ✅ built |
| 4 | Advanced | B2+ → C1 | 8 | 📝 planned (below) |
| 5 | Overqualified | C1 → C1+ | 4 | 📝 planned (below) |

Levels 4 and 5 are in `LEVELS` (`plan.ts`) with `status: 'planned'` and an `outline`, so the
Roadmap tab already shows them as "Coming next". Build them one week at a time with the steps in
README §8; a level can go live (`status: 'ready'`) only when all its weeks and its exam exist.

**Why these levels exist.** Level 3 gets the owner hired on most English accounts (B2). The
premium and US accounts, and the better salaries, ask for C1, and the owner's goal is to be
*overqualified*: to pass any interview with room to spare and to move up to Tier 2 or team leader.

**Targets, from the research behind the plan (October 2026):**

- EF SET bands: B1 41–50, B2 51–60, C1 61–70, C2 71+. Level 4 aims at 61+, Level 5 at 65+.
- Versant English Test (used by many BPOs) maps B2 to 58–68 and C1 to 69–78.
- Cambridge estimates about 200 guided hours per CEFR level. At six hours a day, Level 4's eight
  weeks plus the practice in the power hours cover that.
- Typing targets are already in `TYPING_TARGETS` (`quiz.ts`): L4 40 WPM at 96%, L5 45 WPM at 97%.

**Rules to keep while building** (details in README §5): English content with American spelling,
Arabic only in `tipAr`/`noteAr`; exactly 8 phrases per set and 8 exercises per grammar point;
3 questions per script; made-up company names in scripts and role-plays; and **verify every
YouTube id on YouTube before adding it** (ids from `episodes.ts` are already real). Ids marked
**new** below are suggestions for content to write; the others already exist and can be reused.

Each week needs: 4 sounds, 2–3 phrase sets, 1 grammar point, 2 scripts, 2 scenarios,
5 speaking refs, 5 videos and 2 typing texts (see the day template in README §4).

---

## Level 4: Advanced (B2+ → C1)

**Goal:** sound natural and handle complex calls: connected speech, diplomacy, escalations,
retention, deep troubleshooting, any accent, and written support.

**Exit (already in `LEVELS`):** EF SET 61+ (C1) · a premium mock call of 85%+ on the QA rubric ·
two-minute answers to surprise questions with a clear structure. Typing target: 40 WPM at 96%.

**Exam `L4-EXAM`** (add to `LEVEL_EXAMS`): pass 80%,
`draw: { grammar: 10, phrases: 8, dictation: 4, repeat: 6, build: 4, listen: 3 }`, plus extras:
a C1 story retelling (new `RETELL_STORIES` entry, ~90 words, with an opinion at the end), a
written reply to a formal complaint (new `WRITING_TASKS` entry), a premium mock call
(`r-premium-mock-call`), a two-minute speaking answer to a surprise topic, and typing at 40/96.

### Week 1: Connected speech & intonation

- **Goal:** understand fast native speakers and sound smooth yourself: linking, reductions, the flap T, sentence stress.
- **noteAr idea:** الأمريكان مش بيقولوا الكلمات منفصلة. الأسبوع ده هتسمع "wanna" و "gonna" و "didja" وتفهمها، ومش لازم تقولها كلها، بس لازم تفهمها.
- **Sounds:** new `can-cant` (/kən/ vs /kænt/, stress tells them apart) · new `t-glottal` (button, certain, important) · new `yod-coalescence` (did you → "didja", would you → "wouldja", don't you → "don'cha") · new `h-dropping` (tell him → "tell 'im"). Day 5 reviews them; re-shadow with `linking`, `reductions`, `flap-t`.
- **Phrase sets:** new `natural-reactions` (Got it. / Oh no, that's not good. / Absolutely. / No worries at all. / Fair enough. / That makes total sense. / You bet. / Sure thing.) · new `smooth-transitions` (While that's loading… / Now that we've done that… / Moving on to… / One last thing before you go… / Bear with me one second…).
- **Grammar:** new `question-tags-echo` (isn't it? / You did? / Oh, it does? — tags to check and to show interest; rising vs falling tag).
- **Scripts:** new `s-fast-friendly-call` (a fast, friendly customer full of reductions; the agent keeps up) · new `s-small-talk-loading` (small talk while a system is slow).
- **Scenarios:** new `r-fast-native-speaker` (talks fast, uses idioms, gets impatient if asked to repeat twice) · new `r-chatty-customer` (keeps telling stories; steer back politely).
- **Speaking:** `fluency-technology` · `fluency-movie` · `voice:read-aloud-3` (aim 150–160 WPM, no long pauses) · new question `describe-your-job-c1` ("Describe your current job to someone who's never heard of it") · `voice:intro` (re-record: compare with the Level 0 take).
- **Videos:** Rachel's English "Fast English: Words that Reduce" (playlist `PLrqHrGoMJdTRJcd1rrp1qfYBu9VgTIfoX`, episodes in `episodes.ts`), plus Rachel's English videos on the flap T, linking and the glottal stop (find and verify).
- **Typing:** new `t-fast-call-notes` (notes taken during a fast call) · new `t-quick-chat-replies`.

### Week 2: Diplomatic language

- **Goal:** say no, disagree and set limits so politely that the customer still feels helped.
- **noteAr idea:** الـ C1 الحقيقي مش كلمات صعبة. هو إنك تقول "لأ" من غير ما العميل يزعل. هنتعلم الـ softening.
- **Sounds:** new `fall-rise` (the polite "but": "I understand… ↘↗") · new `contrastive-stress` ("I *did* send it" vs "I did send *it*") · `tone-warm` · `confident-voice`.
- **Phrase sets:** new `softening-no` (I'm afraid that's not something I can do, but here's what I can do… / Unfortunately, that's outside our policy; what I can offer is…) · new `setting-boundaries` (I really want to help you, and I need us to keep this respectful. / I'll have to end the call if…) · new `hedging-opinions` (It looks like… / As far as I can see… / It might be worth… / I'd suggest…).
- **Grammar:** new `politeness-distance` (past forms for politeness: "I was wondering if…", "I wanted to check…"; "Would you mind -ing"; "It might be worth -ing"; passive to avoid blame: "the charge was applied" not "you did it wrong").
- **Scripts:** new `s-policy-exception` (a refund outside the policy: no, plus two alternatives) · new `s-abusive-caller` (the warning script, then a calm, professional end).
- **Scenarios:** new `r-exception-demand` (wants an exception "because I've been a customer for ten years") · new `r-abusive-caller` (swears; follow warn → second warning → end politely; scored on staying calm).
- **Speaking:** `say-no` · `feedback` · `teamwork-conflict` · new `disagree-with-policy` ("What would you do if you disagreed with a company policy?") · new `tell-customer-wrong` ("How do you tell a customer they're wrong?").
- **Videos:** BBC "English at Work" (playlist `PLcetZ6gSk969oGvAI0e4_PgVnlGbm64bp`) episodes on disagreeing and saying no; Kwestyon mock calls with angry customers.
- **Typing:** new `t-policy-email` (no + alternatives, in writing) · new `t-boundary-chat`.

### Week 3: Escalations & supervisor calls

- **Goal:** handle "I want your manager", complaints, threats to cancel or to complain to a regulator, and hand a call over cleanly.
- **noteAr idea:** لما العميل يقول "عايز المدير" دي مش هزيمة. فيه طريقة محترمة تحاول فيها الأول، وطريقة احترافية تحوّل بيها.
- **Sounds:** new `legal-words` (stress in liability, compensation, regulatory, formal, complaint, reimbursement) · `pace` · `numbers-teens` · `prices-dates`.
- **Phrase sets:** new `manager-requests` (I can hear you'd like to speak to a supervisor. Before I do that, let me see if I can fix this right now…) · new `formal-complaints` (I'm logging a formal complaint for you; your reference number is… / You'll hear from our complaints team within…) · new `warm-transfer` (I've explained everything to my colleague, so you won't have to repeat yourself.).
- **Grammar:** new `reported-speech` (the customer said he had been charged twice; she asked whether…; for handovers and ticket notes).
- **Scripts:** new `s-supervisor-request` · new `s-warm-transfer` (the agent briefs the supervisor, then introduces the customer).
- **Scenarios:** new `r-wants-manager` (insists on a manager from the first sentence) · new `r-regulator-threat` (threatens to complain to the regulator and post online).
- **Speaking:** `escalate-when` · `angry-customer` · `pressure` · new `escalation-story` (STAR: a time you calmed someone down) · `voice:empathy-lines`.
- **Videos:** Kwestyon "Mock Calls with Explanation" (`PLQS8BRecii9FgChYjjgN6_cv2tA82mffg`) and Rea Ninja mock calls with escalations (pick from `episodes.ts`).
- **Typing:** new `t-handover-note` (reported speech) · new `t-complaint-summary`.

### Week 4: Retention & sales

- **Goal:** save a customer who wants to cancel and offer upgrades naturally, without sounding pushy.
- **noteAr idea:** أكونتات كتير بتدفع commission على الـ sales والـ retention. لو اتقنته، مرتبك بيزيد.
- **Sounds:** new `enthusiasm` (wider pitch range: sounding positive without shouting) · `list-intonation` · `prices-dates` · `stress-shift`.
- **Phrase sets:** new `retention-save` (Before you go, can I ask what's made you want to leave? / I'd hate to lose you as a customer…) · new `objection-handling` (That's a fair point. A lot of customers felt the same until… / I hear you on the price…) · new `natural-upsell` (Since you work from home, you might like… / Most people in your situation…).
- **Grammar:** new `conditionals-for-offers` (first conditional for real offers, second for hypotheticals: "If I could lower your bill, would you stay?"; comparatives for value).
- **Scripts:** new `s-save-cancellation` · new `s-upgrade-after-fix`.
- **Scenarios:** new `r-cancel-competitor` (found a cheaper offer elsewhere) · new `r-upsell-after-fix` (offer the right upgrade after solving the problem; stop at the first clear no).
- **Speaking:** `sell-pen` · `kpis` · new `sell-something-you-like` · new `handle-no` ("A customer says no to your offer: what do you say?") · `describe-color`.
- **Videos:** sales and retention role-plays from the library (Single Step English, Call Center Academy); verify any new ones.
- **Typing:** new `t-retention-note` · new `t-offer-email`.

### Week 5: Complex troubleshooting

- **Goal:** lead multi-step technical calls, use remote tools, and explain the root cause in plain words (the owner's strength as a programmer).
- **noteAr idea:** هنا انت سابق الكل لأنك مبرمج. التحدي إنك تشرح الحاجة المعقدة بكلام بسيط من غير ما تستعرض.
- **Sounds:** new `acronyms` (DNS, VPN, ISP, SSID, IP: letter names, stress on the last letter) · `tech-words` · `spelling-urls` · `silent-letters`.
- **Phrase sets:** new `remote-session` (I'm going to send you a link so I can see your screen… / You'll see a pop-up asking for permission…) · new `root-cause` (The reason this happened is… / What's going on behind the scenes is… / To stop it happening again…) · new `ruling-things-out` (Let's rule out a few things first. / That tells me it's not the cable.).
- **Grammar:** new `cause-and-effect` (because of / due to / as a result / which means / so that; "it's + adjective + to").
- **Scripts:** new `s-dns-issue` (sites don't load but apps work: change the DNS) · new `s-email-sync` (email not syncing: remove and re-add the account).
- **Scenarios:** new `r-intermittent-issue` (only happens sometimes; needs systematic probing) · new `r-remote-session-nervous` (customer is afraid of scams; earn trust before remote access).
- **Speaking:** `troubleshooting-approach` · `tech-problem-solved` · `modem-vs-router` · new `explain-cloud` ("Explain the cloud to your grandmother") · new `explain-vpn`.
- **Videos:** real tech-support role-plays (Rea Ninja, Hipronary) plus short explainers of DNS and VPN for non-technical people (find and verify).
- **Typing:** new `t-root-cause-note` · new `t-kb-article` (a short knowledge-base article).

### Week 6: Accents of the world

- **Goal:** understand customers and colleagues with Southern US, British, Australian and Indian English, and very fast speakers, without asking them to repeat three times.
- **noteAr idea:** مش كل العملاء بيتكلموا زي الفيديوهات. الأسبوع ده ودنك هتتعود على لهجات مختلفة.
- **Sounds:** listening targets written as sounds (`how` explains what you'll hear): new `accent-southern-us` · new `accent-british` (no R after vowels, "bath" vowel, T not flapped) · new `accent-australian` · new `accent-indian` (syllable-timed rhythm, retroflex T and D).
- **Phrase sets:** new `clarifying-politely` (I want to be sure I get this right: could you say the account number one digit at a time? / Just so I don't get it wrong…) · new `phrasal-verbs-calls` used naturally (hang up, hold on, look into, sort out, follow up, back up, run out, set up).
- **Grammar:** new `phrasal-verbs` (separable or not: "turn it off" not "turn off it"; the ones customers use most).
- **Scripts:** new `s-british-customer` ("I've been on hold for ages, it's a bit rubbish") · new `s-indian-tier2-handover` (a handover with an Indian Tier 2 engineer).
- **Scenarios:** new `r-southern-elderly` (slow drawl, idioms like "fixin' to") · new `r-british-sarcastic` (fast, dry humor).
- **Speaking:** `where-from` (C1 version: compare your city with another) · `fluency-goal` · `fluency-weekend` · `didnt-understand` · new `what-annoys-customers`.
- **Videos:** accent comparison and accent listening practice videos (find and verify; mark `arabic: true` only for Egyptian Arabic explanations).
- **Typing:** new `t-accent-call-notes` · new `t-callback-sms`.
- **Idea:** the device's voices include en-GB, en-AU and en-IN on most phones. `speakLines` could take an accent per script so the shadowing uses them.

### Week 7: Chat & email support

- **Goal:** write short, clear, warm chat and email replies, use templates without sounding like a robot, and handle two chats at once.
- **noteAr idea:** أكونتات كتير بقت chat و email. هنا الكتابة والسرعة بيفرقوا، والـ typing لازم يوصل 40.
- **Sounds:** a lighter week: `pace` · `confident-voice` · `tone-warm` · `spelling-urls` (review).
- **Phrase sets:** new `chat-openers-closers` · new `chat-tone` (Thanks for your patience! / I'm checking that for you now. / Is there anything else I can help with today?) · new `email-structure` (subject lines, the opening line, next steps, the sign-off).
- **Grammar:** new `written-errors` (a/an/the, its/it's, your/you're, then/than, run-on sentences, capital letters: the mistakes QA marks in writing).
- **Scripts:** new `s-chat-two-at-once` (a narrated chat transcript) · new `s-email-escalation`.
- **Scenarios:** new `r-chat-refund` (the AI types, you reply in chat) · new `r-chat-angry-caps` (writes in capital letters).
- **Speaking:** keep one a day so the voice doesn't rust: `questions-for-us` · `call-flow` · `good-customer-service` · `voice:explain-restart` · `voice:why-tech-support`.
- **Videos:** written customer service and email tone (BBC English at Work has email episodes); verify each.
- **Typing:** new `t-chat-macro` · new `t-email-reply-c1`. Add writing items to the exam's extras.

### Week 8: C1 review & exam

- **Goal:** C1 structures in speech and the Level 4 exam.
- **noteAr idea:** آخر أسبوع في ليفل 4. راجع، اعمل EF SET تاني، وادخل الامتحان. لو جبت 61+ في EF SET انت C1 رسمي.
- **Sounds:** review: `linking` · `reductions` · `intonation` · `thought-groups`.
- **Phrase sets:** new `c1-discourse-markers` (That said… / Having said that… / On top of that… / In a nutshell… / The thing is…) · `structuring-answers` · `star-answers`.
- **Grammar:** new `c1-structures` (inversion: "Not only did…", "Rarely do…"; clefts: "What I'd suggest is…"; mixed conditionals: "If I had known, I'd be…").
- **Scripts:** new `s-premium-retention` (a long, polished premium call) · `s-premium-call` (exists; shadow it again at full speed).
- **Scenarios:** new `r-premium-mock-call` (also used in the exam) · new `r-c1-interview` (a premium account interview).
- **Speaking:** new `two-minute-surprise` (random topic, two minutes, a clear structure) · `five-years` · `why-hire-you` · `overqualified` · `voice:intro` (the C1 voice note).
- **Videos:** Versant practice (`PLqtNxGjerSpet62OdOMQVVmVMxqIRDx9g`) and full mock calls; verify each.
- **Typing:** `t-final-1` · `t-final-2` (reuse) or new C1 texts.
- **Also:** an EF SET task on the exam day (the `link:efset` task kind already exists).

---

## Level 5: Overqualified (C1 → C1+)

**Goal:** premium accounts and team-leader-level communication: the candidate they'd hire for
the hardest account, and the agent who becomes a team leader.

**Exit (already in `LEVELS`):** EF SET 65+ · calls 90%+ on the QA rubric · typing 45 WPM at 97%.

**Exam `L5-EXAM`:** pass 85%, `draw: { grammar: 8, phrases: 8, dictation: 3, repeat: 6, build: 4, listen: 3 }`,
plus extras: the full premium hiring simulation: a C1 voice note (`speak`), a story retelling, a
premium mock call, a team-leader question, a written reply, typing at 45/97.

### Week 1: Premium account simulations

- **Goal:** big-brand tech support, travel and banking calls, polished from start to finish.
- **Sounds:** `pace` · `tone-warm` · `confident-voice` · new `premium-voice` (lower, slower, smiling: the "premium" sound).
- **Phrase sets:** new `ownership` (I'll take care of this personally. / I'll stay with you until it's working.) · new `travel-changes` (rebooking, cancellations, fees, refunds) · new `banking-security` (fraud alerts, card blocks, verification).
- **Grammar:** new `formal-register` (formal vs neutral: "assist" vs "help", "inform" vs "tell"; when formal sounds cold).
- **Scripts:** new `s-flight-rebook` · new `s-fraud-alert`.
- **Scenarios:** new `r-vip-customer` (expects perfection, notices every pause) · new `r-fraud-panic` (panicking about money taken from the card).
- **Speaking:** new `premium-why-you` ("Why should we put you on our premium account?") · `strengths` · `weakness` (C1 version) · `mistake-at-work` · `voice:read-aloud-4`.

### Week 2: Leadership communication

- **Goal:** talk like a team leader: QA language, coaching a colleague, explaining KPIs, running a huddle.
- **Sounds:** `stress-shift` · `list-intonation` · `confident-voice` · `thought-groups`.
- **Phrase sets:** new `qa-language` (calibration, call drivers, compliance, "this would score…") · new `coaching-feedback` (the SBI model: situation, behavior, impact; "What if you tried…?") · new `kpi-talk` (AHT, FCR, CSAT, NPS, adherence explained in one line each).
- **Grammar:** new `feedback-modals` (should / could / might want to / it'd be worth -ing; softening criticism).
- **Scripts:** new `s-qa-calibration` · new `s-team-huddle`.
- **Scenarios:** new `r-coach-agent` (the AI is a new agent with a long handle time and low CSAT) · new `r-team-leader-interview`.
- **Speaking:** new `lead-a-team` · new `low-performer` ("A teammate keeps missing targets: what do you do?") · `kpis` · `feedback` · `teamwork-conflict`.

### Week 3: Spontaneity

- **Goal:** speak about anything, any time: surprise topics, small talk, humor, interruptions.
- **Sounds:** `linking` · `reductions` · `intonation` · `contractions`.
- **Phrase sets:** new `small-talk-us` (sports, weather, holidays, "How's your day going?") · new `work-idioms` (ballpark, touch base, on the same page, the bottom line, a quick win) · new `handling-interruptions` (Sorry, go ahead. / Let me just finish this one point…).
- **Grammar:** new `idiomatic-language` (idioms and phrasal verbs in context, and when not to use them).
- **Scripts:** new `s-small-talk-us` · new `s-interrupted-call`.
- **Scenarios:** new `r-random-topics` (the AI fires a new topic every minute) · new `r-interrupting-customer`.
- **Speaking:** five new surprise topics, one a day (e.g. "the best advice you've had", "a rule you'd change", "a place everyone should visit").

### Week 4: The Overqualified exam

- **Goal:** the whole premium hiring process, start to finish, and premium applications.
- **Days:** a full simulation every day (voice note → HR call with salary negotiation → Versant-style test → operations interview with a premium mock call → team-leader questions), each scored and fixed the next day; EF SET again; update the CV and LinkedIn with the certificate.
- **Scripts/scenarios:** `r-full-sim-telecom` and `r-full-sim-retail` (exist) plus new `r-full-sim-premium` and `r-salary-negotiation`.
- **Job Tracker:** apply to premium and US accounts; log every stage.

---

## The word bank in Levels 4–5

Level 1 teaches the 384-word call center bank (`vocab.ts`), and Levels 2–3 review it daily. For C1, add
a second bank the same way: 12–16 units of advanced call center language, one a day in Level 4's
first weeks (a `vocab` list on each week spec), with its own check. Topics to cover: diplomatic and
formal words (accommodate, regrettably, at your earliest convenience), escalation and legal words
(liability, regulator, formal complaint), retention and sales (retain, incentive, objection),
advanced tech (latency, firmware, DNS, VPN, sync), idioms customers use (on the fritz, a long shot,
the ball is in your court), and the team-leader words of Level 5 (calibration, attrition, ramp-up).
Keep the same rules: one meaning per word, call center examples, a text per unit, no repeats.

## Ideas parked for later

- Optional cloud backup of recordings (Supabase Storage, owner-only bucket); today they stay on the device by design.
- A spaced-repetition review of the mistake log (the review task could quiz the oldest mistakes first).
- Accent voices for scripts (see Level 4, week 6).
- A "Versant full mock": a timed test with the exact Versant parts and timings.
