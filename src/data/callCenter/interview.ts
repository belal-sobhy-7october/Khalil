/**
 * The interview question bank: what call centers in Egypt ask, what they're
 * really checking, and a model answer to learn from (adapt it, don't memorize
 * it word for word — recruiters can hear a memorized answer).
 */
import type { InterviewQuestion, QuestionGroup, VoicePrompt } from './types';

export const QUESTION_GROUPS: Array<{ id: QuestionGroup; name: string }> = [
  { id: 'hr', name: 'HR screening' },
  { id: 'egypt', name: 'Asked in Egypt' },
  { id: 'behavioral', name: 'Behavioral (STAR)' },
  { id: 'situational', name: 'Situational' },
  { id: 'tech', name: 'Tech support' },
  { id: 'fluency', name: 'Fluency topics' },
];

export const QUESTIONS: InterviewQuestion[] = [
  // ── HR screening ───────────────────────────────────────────────────────
  {
    id: 'tell-me-about-yourself',
    group: 'hr',
    q: 'Tell me about yourself.',
    why: "Your fluency, your structure, and whether your story leads to this job. It's the first impression, and often the whole voice note.",
    tips: [
      'Go present → past → future: who you are now, what you have done, why this job.',
      'Keep it to 60–90 seconds. No age, family or school details.',
      'End with why you want this role.',
    ],
    answer:
      "I'm a software developer from Cairo. For the last three years, I've worked mostly as a freelancer, building websites and apps for clients in different countries, so I use English every day. A big part of my work has always been support: when something breaks, I'm the one clients call, and I've learned to explain technical problems in simple words. I really enjoy that moment when a frustrated user says, \"It works!\" That's why I'm applying for a technical support role. I'm patient, I learn new tools quickly, and I'm flexible with shifts.",
    phrases: ["For the last three years, I've…", 'A big part of my work has been…', "That's why I'm applying for…", "I'm patient, and I learn new tools quickly."],
    mistakes: ['Reading your CV out loud (every date, course and job).', 'Starting with "My name is…, I am 25 years old, I live with my family…"', 'Talking for three minutes with no clear ending.'],
    tipAr: 'ابدأ بإنت مين دلوقتي، وبعدين عملت إيه، وخلّص بليه عاوز الشغلانة دي. دقيقة ونص بالكتير.',
  },
  {
    id: 'why-call-center',
    group: 'hr',
    q: 'Why do you want to work in a call center?',
    why: 'Whether you understand the job (many calls, targets, shifts) and will stay.',
    tips: ['Talk about helping people and solving problems, not only money.', 'Show you know the reality: lots of calls, targets, shifts.', 'Connect it to your skills.'],
    answer:
      "I want a job where I'm talking to people and solving real problems every day, and a call center gives me exactly that. I know it's a fast-paced job with targets and different shifts, and that actually suits me, because I like clear goals. As a developer, I'm used to troubleshooting, so technical support is the perfect mix of my technical skills and my communication skills. It's also a great place to grow, from Tier 1 to Tier 2 and later team leader.",
    phrases: ['…gives me exactly that.', "It's a fast-paced job, and that suits me.", "It's the perfect mix of…", "It's a great place to grow."],
    mistakes: ['"Because I need money" or "because my friend works there".', 'Saying the job is "easy" or "just talking".', 'Not mentioning a single skill.'],
  },
  {
    id: 'free-time',
    group: 'hr',
    q: 'What do you do in your free time?',
    why: 'Fluency on an easy topic, and whether you sound like a real person.',
    tips: ['Pick two hobbies and say why you like them.', 'Use the present simple for habits.', 'If you can, link one hobby to a work skill.'],
    answer:
      "In my free time, I usually play football with my friends on Fridays; it keeps me active, and it's great for team spirit. I also love reading about new technology. At the moment, I'm following a few channels about AI tools, and I often try them out myself. And to be honest, practicing English has become a hobby too: I watch American series and shadow the dialogues.",
    phrases: ['In my free time, I usually…', 'It keeps me…', "At the moment, I'm…", 'To be honest, …'],
    mistakes: ['One-word answers like "Football."', '"I don\'t have free time."', 'Listing ten hobbies with no details.'],
  },
  {
    id: 'describe-yourself',
    group: 'hr',
    q: 'How would you describe yourself in three words?',
    why: 'Self-awareness, and whether your words match the job.',
    tips: ['Choose three qualities the job needs.', 'Give a tiny example for each.', 'Avoid clichés like "perfectionist".'],
    answer:
      "I'd say patient, organized and curious. Patient, because I can explain the same thing three times without getting frustrated; my clients can tell you that. Organized, because I keep notes on every task and follow up on time. And curious, because I always want to know why something broke, not just how to fix it, which is really useful in tech support.",
    phrases: ["I'd say…", '…because I can…', '…which is really useful in…'],
    mistakes: ['Three words with no examples.', '"Hardworking, honest, friendly" with nothing to prove them.'],
  },
  {
    id: 'strengths',
    group: 'hr',
    q: 'What are your strengths?',
    why: 'Whether your strengths fit customer service and tech support.',
    tips: ['Pick two strengths that fit the job.', 'Prove each one with a short example.', 'Use a number if you can.'],
    answer:
      "My biggest strength is explaining technical things simply. For example, I once walked a client who had never used a computer through setting up her online store, step by step, over the phone. My second strength is staying calm under pressure: when a client's website went down during a sale, I stayed calm, found the problem and had it back online in twenty minutes.",
    phrases: ['My biggest strength is…', 'For example, I once…', 'My second strength is…'],
    mistakes: ['Listing strengths with no examples.', 'Strengths that have nothing to do with the job.'],
  },
  {
    id: 'weakness',
    group: 'hr',
    q: "What's your biggest weakness?",
    why: 'Honesty and self-improvement, not perfection.',
    tips: ["Pick a real but small weakness that isn't a core skill.", "Say what you're doing to fix it.", 'Never say "I have no weaknesses".'],
    answer:
      "Sometimes I speak too fast when I'm excited about a topic, especially in English. I noticed it when I recorded myself, so now I practice every day: I record short answers, check my speed and pause after each idea. It's already much better, and on calls I make a point of slowing down for names, numbers and steps.",
    phrases: ['Sometimes I…', 'I noticed it when…', 'So now I…', "It's already much better."],
    mistakes: ['"I\'m a perfectionist" or "I work too hard".', 'A weakness that kills the job: "I get angry quickly".', 'No plan to improve.'],
    tipAr: 'اختار عيب حقيقي بس صغير، وقول بتعمل إيه عشان تحسنه.',
  },
  {
    id: 'why-our-company',
    group: 'hr',
    q: 'Why do you want to work for our company?',
    why: 'Whether you researched them and really want this job.',
    tips: ['Mention one real fact: their clients, their size, their training, a new site in Cairo.', 'Connect it to what you want: growth, tech accounts, training.'],
    answer:
      "I read that you opened a new center in Cairo for a big telecom client's technical support, and that's exactly the kind of work I want to do. You're known for strong training, and I like that you promote people from inside to Tier 2 and team leader roles. I want a company where I can learn fast and grow, not just a job for a few months.",
    phrases: ['I read that you…', "That's exactly the kind of work I want to do.", "You're known for…"],
    mistakes: ['"Because you\'re a big company."', 'Knowing nothing about the company or its clients.'],
    tipAr: 'قبل أي انترفيو دوّر على الشركة: عندها أكونتات إيه؟ فتحت فرع جديد؟ جملة واحدة حقيقية بتفرق جداً.',
  },
  {
    id: 'why-hire-you',
    group: 'hr',
    q: 'Why should we hire you?',
    why: 'Your best summary: skills, proof and fit.',
    tips: ['Give three reasons, and number them.', 'Each reason needs a short proof.', 'Finish with commitment.'],
    answer:
      "Three reasons. First, I understand technology, so I'll learn your tools quickly and troubleshoot well. Second, I've spent three years explaining technical problems to non-technical clients, so I know how to keep it simple and friendly. Third, I'm reliable: I'm flexible with shifts, I take targets seriously, and I'm committed to growing here.",
    phrases: ['Three reasons. First, … Second, … Third, …', "I'm committed to…"],
    mistakes: ['"Because I need this job."', 'Talking badly about other candidates.'],
  },
  {
    id: 'five-years',
    group: 'hr',
    q: 'Where do you see yourself in five years?',
    why: "Ambition, and whether you'll stay.",
    tips: ['Show growth inside the company.', 'Be ambitious but realistic.'],
    answer:
      "In five years, I'd like to be an expert on the account, the agent others come to with difficult cases, and then move into a Tier 2 or a team leader role here. I'd also like to keep improving my English to the point where I could handle any premium account.",
    phrases: ["I'd like to…", '…move into a Tier 2 or a team leader role.'],
    mistakes: ['"In another company" or "abroad".', '"I don\'t know."'],
  },
  {
    id: 'questions-for-us',
    group: 'hr',
    q: 'Do you have any questions for us?',
    why: 'Interest and maturity. "No" is a weak ending.',
    tips: ['Always ask one or two questions.', 'Ask about the job, the training or performance, not only salary.'],
    answer: 'Yes, two quick ones. First, how is performance measured on this account? And second, what do your best agents do differently from the rest?',
    phrases: ['Yes, two quick ones.', 'How is performance measured…?', 'What do your best agents do differently?'],
    mistakes: ['"No, thank you."', 'Asking about vacations and salary first.'],
  },
  {
    id: 'salary-expectation',
    group: 'hr',
    q: 'What are your salary expectations?',
    why: "Whether you're realistic and fit their budget.",
    tips: ["Stay flexible, and don't give a number first if you can avoid it.", 'If they insist, give a researched range for the account level.', 'Show that growth matters to you.'],
    answer:
      "I'm flexible. I know salaries depend on the account and the English level, so I'd be happy to hear the range for this position. What matters most to me is the training and the chance to grow. If you need a number, based on my research, I'd expect something within the standard range for a B2 tech support account.",
    phrases: ["I'm flexible.", "I'd be happy to hear the range…", 'What matters most to me is…'],
    mistakes: ['A very high number with no reason.', '"Anything is fine" (it sounds desperate).'],
    tipAr: 'متقولش رقم الأول. ولو أصرّوا، قول range واقعي للمستوى والأكونت.',
  },
  {
    id: 'shifts',
    group: 'hr',
    q: 'Are you comfortable with rotating shifts, nights and weekends?',
    why: 'Availability, which is a deal-breaker on many accounts.',
    tips: ['Answer yes clearly if you can.', 'If you have a limit, say it honestly and briefly.'],
    answer: "Yes, I'm completely flexible with shifts, including nights and weekends. I understand that customers need help at any hour, especially on US accounts, and I've already planned my routine around that.",
    phrases: ["I'm completely flexible with shifts.", '…customers need help at any hour.'],
    mistakes: ['Hesitating: "Hmm… maybe…"', 'Saying yes, then listing conditions.'],
  },
  {
    id: 'experience',
    group: 'hr',
    q: 'Tell me about your work experience.',
    why: 'Your grammar (past simple vs present perfect) and relevant experience.',
    tips: ['Past simple for finished jobs, present perfect for experience up to now.', 'Focus on what matters for customers and tech.'],
    answer:
      "I graduated in 2022 with a degree in computer science. After that, I worked at a small software company for a year, where I fixed bugs and answered client emails. Since then, I've worked as a freelance developer. I've handled clients from the US and Europe, and I've helped many of them with technical issues over the phone and on video calls.",
    phrases: ['After that, I worked at…', "Since then, I've worked as…", "I've handled clients from…"],
    mistakes: ['"I have worked there in 2023."', 'Listing tasks with no results.'],
  },
  {
    id: 'why-leave-last-job',
    group: 'hr',
    q: 'Why are you looking for a change?',
    why: 'Whether you are moving for a positive reason; no complaining.',
    tips: ['Be positive about your past work.', "Talk about what you're moving toward, not away from."],
    answer:
      "I learned a lot in my last role, especially about working with clients. But I realized that the part I enjoy most is the support side, talking to users and solving their problems. I'm looking for a role where that's the main job, with a clear path to grow, and that's why I'm here.",
    phrases: ['I learned a lot in…', 'I realized that…', "I'm looking for a role where…"],
    mistakes: ['Complaining about a manager or the salary.', '"I was bored."'],
  },
  {
    id: 'what-studied',
    group: 'hr',
    q: 'What did you study?',
    why: 'Your background, and fluency on an easy topic.',
    tips: ['Say your degree in one sentence.', 'Add one thing you learned that helps in this job.'],
    answer:
      'I studied computer science. Besides programming, my degree taught me how to break a big problem into small steps, which is exactly what you do in troubleshooting. I also did a few projects in English, so I got used to writing documentation and presenting in English.',
    phrases: ['I studied…', 'My degree taught me how to…', '…which is exactly what you do in…'],
    mistakes: ['Only naming the university.', 'Apologizing for your degree.'],
  },
  {
    id: 'good-customer-service',
    group: 'hr',
    q: 'What does good customer service mean to you?',
    why: 'Your values, and whether they match the job.',
    tips: ['Give a short definition and an example.', 'Mention solving it the first time, or owning the problem.'],
    answer:
      "To me, good customer service means the customer leaves the call with their problem solved and feeling respected. It's listening carefully, explaining clearly and owning the problem until it's fixed, so they don't have to call back. Being friendly is important, but solving the problem is what really matters.",
    phrases: ['To me, good customer service means…', "…owning the problem until it's fixed…"],
    mistakes: ['"Being nice to customers", and nothing else.', 'No example.'],
  },
  {
    id: 'call-flow',
    group: 'hr',
    q: 'What are the main steps of a customer service call?',
    why: 'Whether you know the basic call flow.',
    tips: ['Name the steps in order, one sentence each.'],
    answer:
      "There are five main steps. First, the opening: greet the customer with your name and the company. Second, verification, to protect the account. Third, understanding the problem with good questions. Fourth, the solution, explained clearly and confirmed. And finally, the closing: a short recap, asking if there's anything else, and thanking the customer.",
    phrases: ['There are five main steps.', 'First, the opening…', 'And finally, the closing…'],
    mistakes: ['Forgetting verification or the recap.'],
  },
  {
    id: 'active-listening',
    group: 'hr',
    q: 'What is active listening?',
    why: 'Whether you understand a core call center skill.',
    tips: ['Define it, then give two ways you show it.'],
    answer:
      "Active listening means fully focusing on the customer, not just waiting for your turn to speak. On a call, I show it with short signals like \"I see\" or \"Got it\", by asking questions to clarify, and by paraphrasing: \"So, if I understand correctly, your internet stops every evening.\" It makes the customer feel heard and helps me solve the right problem.",
    phrases: ['Active listening means…', '…by paraphrasing…', 'It makes the customer feel heard.'],
    mistakes: ['"It means listening carefully", and nothing more.'],
  },
  {
    id: 'empathy-meaning',
    group: 'hr',
    q: 'What does empathy mean in customer service?',
    why: 'Whether you know the difference between empathy and saying sorry.',
    tips: ['Show that empathy is more than an apology.', 'Give an example phrase.'],
    answer:
      "Empathy means understanding how the customer feels and showing it, so they know you're on their side. It isn't just saying sorry; it's naming their situation, like \"You've been without internet for two days; that's really frustrating,\" and then showing what you'll do about it.",
    phrases: ['Empathy means…', "It isn't just saying sorry…"],
    mistakes: ['Confusing empathy with apologizing ten times.'],
  },
  {
    id: 'kpis',
    group: 'hr',
    q: 'Do you know what KPIs are in a call center? How do you feel about targets?',
    why: 'Whether you know how agents are measured.',
    tips: ['Name three KPIs.', "Show you're comfortable with targets."],
    answer:
      "KPIs are the numbers that show how well an agent is doing. In a call center, the common ones are customer satisfaction, first-call resolution and average handling time, plus quality scores. I'm comfortable with targets; I like knowing exactly what success looks like, and I'd focus on solving the problem the first time, because that improves all the other numbers too.",
    phrases: ['KPIs are the numbers that…', '…customer satisfaction, first-call resolution and average handling time…'],
    mistakes: ['Not knowing a single KPI.', 'Saying targets stress you out.'],
  },
  // ── Asked in Egypt ─────────────────────────────────────────────────────
  {
    id: 'military-status',
    group: 'egypt',
    q: "What's your military status?",
    why: 'A standard HR question in Egypt for male candidates: they need to know you are available.',
    tips: ['Answer in one clear sentence.', 'Know the English for your status.'],
    answer: "I've completed my military service. (Or: I'm exempted from military service. Or: My military service is postponed until 2027, and I have the official papers.)",
    phrases: ["I've completed my military service.", "I'm exempted from military service.", 'My military service is postponed until…'],
    mistakes: ['A long, nervous explanation.', 'Not knowing the English words.'],
    tipAr: 'جاوب في جملة واحدة: completed أو exempted أو postponed.',
  },
  {
    id: 'overqualified',
    group: 'egypt',
    q: "You're a programmer. Aren't you overqualified for this job?",
    why: "Whether you'll get bored and leave in three months.",
    tips: ['Agree that your background helps, then show commitment.', 'Give a real reason for choosing support.', 'Mention growing inside the company.'],
    answer:
      "My programming background definitely helps: I'll understand technical issues faster and learn your systems quickly. But I'm not applying by accident. I've found that what I enjoy most is helping people directly, and support gives me that every day. I'm looking for a long-term career here: starting with this role, getting really good at it, and growing into Tier 2 or a team leader position.",
    phrases: ['My background definitely helps…', "I'm not applying by accident.", "I'm looking for a long-term career here."],
    mistakes: ['Saying "it\'s just for now".', 'Talking down the job: "it\'s easy for me".'],
    tipAr: 'متقولش «هي فترة وهمشي». قول إن خلفيتك ميزة وإنك ناوي تكبر جوه الشركة.',
  },
  {
    id: 'programmer-why-support',
    group: 'egypt',
    q: 'Why do you want to move from programming to technical support?',
    why: "Whether your motivation is real and won't change next month.",
    tips: ['Give a real moment that showed you love support.', "Show it's a choice, not a fallback."],
    answer:
      "When I look back at my freelance work, the moments I remember best aren't the lines of code; they're the calls where a client was stressed and I helped them fix the problem. I'm good at that, and I enjoy it. In tech support, that's the whole job, and my coding background makes me faster at understanding what's wrong.",
    phrases: ['When I look back at…', "…that's the whole job.", '…makes me faster at…'],
    mistakes: ['"I couldn\'t find a developer job."', 'Criticizing programming.'],
  },
  {
    id: 'start-date',
    group: 'egypt',
    q: 'When can you start? Are you studying now?',
    why: 'Whether you can join the next training class.',
    tips: ['Give a clear date.', "If you're studying, say how you'll manage it."],
    answer: "I can start right away, with the next training class. I'm not studying at the moment, so I'm fully available for the training schedule.",
    phrases: ['I can start right away.', "I'm fully available for…"],
    mistakes: ['"Maybe next month, I\'m not sure."'],
  },
  // ── Behavioral (STAR) ──────────────────────────────────────────────────
  {
    id: 'solved-problem',
    group: 'behavioral',
    q: 'Tell me about a time you solved a difficult problem.',
    why: 'Problem-solving, and whether you can tell a story with the STAR structure.',
    tips: ['Use STAR: Situation, Task, Action, Result.', 'Make the action part the longest.', 'End with a result and a lesson.'],
    answer:
      "Last year, a client's online store stopped taking payments on the first day of a big sale. My task was to fix it fast, because every minute meant lost sales. First, I checked the payment logs and saw that the payment company had changed its security settings. Then I updated our settings, tested a small payment and kept the client updated every ten minutes. The store was taking payments again in forty minutes, and the client still works with me today. It taught me to stay calm and keep communicating while I fix things.",
    phrases: ['My task was to…', 'First, I… Then I…', '…and kept the client updated…', 'It taught me to…'],
    mistakes: ['A story with no clear result.', 'Saying "we" for everything (what did YOU do?).'],
  },
  {
    id: 'mistake-at-work',
    group: 'behavioral',
    q: 'Tell me about a mistake you made at work.',
    why: 'Honesty and ownership.',
    tips: ['Choose a real mistake that is not a disaster.', 'Focus on how you fixed it and what you changed.'],
    answer:
      "Once, I gave a client a deadline without checking my other projects, and two days later I realized I couldn't meet it. I called him right away, apologized, explained the situation and offered a new date with a small discount. He appreciated the honesty. Since then, I always check my schedule before I promise anything, and on calls I'll never promise something I can't confirm.",
    phrases: ['I called him right away…', 'He appreciated the honesty.', 'Since then, I always…'],
    mistakes: ['"I don\'t make mistakes."', 'Blaming someone else.'],
  },
  {
    id: 'upset-customer-story',
    group: 'behavioral',
    q: 'Tell me about a time you dealt with an upset customer or client.',
    why: 'Empathy and calming people down, in real life.',
    tips: ['Show what you said to calm them.', 'Give the result.'],
    answer:
      "A client once called me very angry because his website was down before an important meeting. I let him explain without interrupting, then said, \"I completely understand; let's get this fixed before your meeting.\" I found that his hosting payment had failed, helped him pay it, and the site was back in ten minutes. He calmed down and even apologized for shouting. I learned that people calm down when they feel heard and see action.",
    phrases: ['I let him explain without interrupting.', "I completely understand; let's get this fixed…", 'People calm down when they feel heard.'],
    mistakes: ['Saying you got angry too.', 'No clear action.'],
  },
  {
    id: 'pressure',
    group: 'behavioral',
    q: 'How do you handle stress and pressure?',
    why: 'Call centers are high-pressure. Can you stay calm?',
    tips: ['Give a method, not just "I\'m calm".', 'Add a real example.'],
    answer:
      'I break the pressure into small steps. When I have many tasks, I write them down, start with the most urgent one and focus on one thing at a time. On a busy day, a short breath between calls helps me reset. For example, during a product launch I had twelve client requests in one afternoon, and that system helped me finish them all without mistakes.',
    phrases: ['I break it into small steps.', '…focus on one thing at a time.', '…helps me reset.'],
    mistakes: ['"I don\'t get stressed."', '"I just work harder."'],
  },
  {
    id: 'teamwork-conflict',
    group: 'behavioral',
    q: 'Tell me about a time you disagreed with a teammate.',
    why: 'Teamwork and professional communication.',
    tips: ['Show respect for the other person.', 'Focus on the solution and the result.'],
    answer:
      'On one project, a teammate and I disagreed about how to fix a bug. Instead of arguing in the group chat, I suggested a quick call. We each explained our idea, tested both on a copy of the site, and used the one that worked better, which was actually his. The bug was fixed that day, and we worked even better together after that.',
    phrases: ['Instead of arguing, I suggested…', 'We tested both…', '…which was actually his.'],
    mistakes: ['Proving you were right and they were wrong.', 'No result.'],
  },
  {
    id: 'feedback',
    group: 'behavioral',
    q: 'How do you handle criticism or feedback from a manager?',
    why: 'Whether you can be coached: QA feedback happens every week.',
    tips: ['Show you welcome feedback.', 'Give an example of improving after feedback.'],
    answer:
      "I see feedback as free training. When a client told me my updates were too technical, I didn't take it personally; I asked for an example and started writing my updates in simpler words. In a call center, I'd listen to my QA feedback, ask questions and focus on improving one point each week.",
    phrases: ['I see feedback as free training.', "I didn't take it personally.", '…focus on improving one point each week.'],
    mistakes: ['Getting defensive.', '"I don\'t get much criticism."'],
  },
  // ── Situational ────────────────────────────────────────────────────────
  {
    id: 'angry-customer',
    group: 'situational',
    q: 'How would you deal with an angry customer?',
    why: 'Your method for calming a customer down.',
    tips: ['Give clear steps: listen, empathize, apologize, solve, follow up.', 'Mention your tone of voice.'],
    answer:
      "First, I'd let the customer speak without interrupting, because people need to feel heard. Then I'd show empathy, for example, \"I completely understand how frustrating this is.\" Next, I'd apologize for the inconvenience, without blaming anyone, and focus on what I can do. I'd keep my voice calm and slow, explain the solution clearly and make sure the customer is happy before closing. If I couldn't solve it, I'd escalate it the right way.",
    phrases: ["First, I'd let the customer speak…", "Then I'd show empathy…", "I'd keep my voice calm…"],
    mistakes: ['"I\'d tell him to calm down."', '"I\'d transfer him to my manager" as the first step.'],
  },
  {
    id: 'say-no',
    group: 'situational',
    q: "How would you tell a customer you can't do what they're asking?",
    why: 'Positive scripting.',
    tips: ['Keep the "no" short.', 'Focus on what you CAN do.'],
    answer:
      "I'd be honest but positive. I'd say something like, \"I'm afraid I can't refund an order after thirty days. However, what I can do is offer you store credit or an exchange.\" The customer hears the options more than the \"no\", and they still leave the call with a solution.",
    phrases: ["I'm afraid I can't…", 'However, what I can do is…'],
    mistakes: ['"That\'s the policy."', "Saying yes to something you can't do."],
  },
  {
    id: 'didnt-understand',
    group: 'situational',
    q: "What would you do if you didn't understand a customer?",
    why: 'Your listening strategies, and honesty.',
    tips: ['Never guess; ask politely.', 'Paraphrase to confirm.'],
    answer:
      "I'd never guess, because a wrong guess wastes the customer's time. I'd politely ask them to repeat or slow down, for example, \"Sorry, I didn't catch the last part. Could you say that again?\" If it's a name or a number, I'd ask them to spell it, and then I'd paraphrase what I understood to make sure I've got it right.",
    phrases: ["I'd never guess.", "Sorry, I didn't catch the last part.", "I'd paraphrase what I understood."],
    mistakes: ['Pretending you understood.', 'Saying "What?"'],
  },
  {
    id: 'dont-know-answer',
    group: 'situational',
    q: "What would you do if you didn't know the answer to a customer's question?",
    why: 'Honesty, and whether you know how to find answers.',
    tips: ['Be honest and find out.', 'Use the knowledge base, a colleague or a hold.'],
    answer:
      "I'd be honest and say, \"That's a great question; let me find out for you.\" I'd put the customer on a short hold, check the knowledge base or ask a senior colleague, and come back with the right answer. If it took longer, I'd offer a callback instead of guessing.",
    phrases: ['Let me find out for you.', "I'd check the knowledge base…", "I'd offer a callback instead of guessing."],
    mistakes: ['Making up an answer.', '"I don\'t know", with no next step.'],
  },
  {
    id: 'escalate-when',
    group: 'situational',
    q: 'When would you escalate a call?',
    why: 'Your judgment: not too early, not too late.',
    tips: ['Name clear cases: outside your access, after troubleshooting, safety or legal issues.', 'Show you try first.'],
    answer:
      "I'd escalate when I've done everything I can at my level and the issue still isn't solved, or when it needs access or tools I don't have, like a line problem for Tier 2. I'd also escalate quickly if there was a safety or legal issue. Before transferring, I'd explain it to the customer, write clear notes and do a warm transfer, so they don't repeat themselves.",
    phrases: ["…when I've done everything I can at my level…", '…do a warm transfer…'],
    mistakes: ['Escalating every hard call.', 'Never escalating.'],
  },
  {
    id: 'sell-pen',
    group: 'situational',
    q: 'Sell me this pen.',
    why: 'Communication, confidence and sales thinking: needs before features.',
    tips: ['Ask about their needs first.', 'Match one benefit to their need.', 'Close with a question.'],
    answer:
      "Before I tell you about it, can I ask when you last needed a pen? … And did it work well? This one writes smoothly for months, so it won't let you down in the middle of an important signature. It's light, it looks professional, and it costs less than a coffee. Should I put two in your bag, one for the office and one for home?",
    phrases: ['Before I tell you about it, can I ask…?', "…so it won't let you down…", 'Should I put two in your bag?'],
    mistakes: ['Listing features: "It\'s blue, it\'s plastic…"', 'Forgetting to ask for the sale.'],
  },
  {
    id: 'describe-color',
    group: 'situational',
    q: 'Describe the color blue to someone who has never seen.',
    why: 'Creativity, and explaining something abstract simply.',
    tips: ['Use the other senses: touch, sound, temperature, feelings.', 'Use two or three comparisons.'],
    answer:
      "Blue is the feeling of cool water on your hands on a hot day. It's the calm you feel when you take a deep breath of fresh air by the sea. It's quiet and peaceful, like a soft song at night. If red is the heat of a fire, blue is the cool breeze after it.",
    phrases: ["It's the feeling of…", "It's like…", 'If red is…, blue is…'],
    mistakes: ['"Blue is the color of the sky." (they can\'t see the sky)', 'Freezing and saying nothing.'],
  },
  // ── Tech support ───────────────────────────────────────────────────────
  {
    id: 'explain-tech-simply',
    group: 'tech',
    q: "Explain what a router does to someone who isn't technical.",
    why: 'Whether you can explain tech without jargon, which is the whole job.',
    tips: ['Use a simple comparison.', 'One or two sentences, with no technical words.'],
    answer:
      'A router is like a post office for your home internet. The internet comes into your home through one cable, and the router sends it to all your devices, your phone, your laptop and your TV, so everyone can use it at the same time.',
    phrases: ["It's like…", '…so everyone can use it at the same time.'],
    mistakes: ['Using words like "packets", "IP" or "NAT".', 'A long technical lecture.'],
    tipAr: 'ده أهم سؤال ليك كمبرمج: اشرح من غير ولا مصطلح، كأنك بتكلم مامتك.',
  },
  {
    id: 'troubleshooting-approach',
    group: 'tech',
    q: "How do you troubleshoot a problem you've never seen before?",
    why: 'Whether you have a logical method.',
    tips: ['Give a method: understand, check the basics, isolate, fix, test.', 'Mention the knowledge base and escalation.'],
    answer:
      "I start by understanding exactly what's happening and when it started. Then I check the simple things first, like power, cables and restarts. Next, I isolate the problem: is it one device or all of them, one app or everything? I use the knowledge base for known issues, try one fix at a time and test after each change. If I can't solve it at my level, I escalate it with clear notes.",
    phrases: ['I check the simple things first.', 'Is it one device or all of them?', '…one fix at a time…'],
    mistakes: ['Trying random fixes.', 'Not testing after the fix.'],
  },
  {
    id: 'modem-vs-router',
    group: 'tech',
    q: "What's the difference between a modem and a router?",
    why: 'Basic tech knowledge for telecom accounts.',
    tips: ['One simple sentence for each.'],
    answer:
      'The modem connects your home to your internet provider; it brings the internet in. The router shares that connection with all your devices, usually over Wi-Fi. Many homes now have one box that does both.',
    phrases: ['The modem brings the internet in.', 'The router shares it with your devices.'],
    mistakes: ["Saying they're the same thing.", 'Being too technical.'],
  },
  {
    id: 'computer-skills',
    group: 'tech',
    q: 'Tell me about your computer skills.',
    why: "Whether you'll handle several systems at once (CRM, tickets, knowledge base).",
    tips: ['Mention operating systems, typing speed and multitasking.', "Don't list programming languages; connect it to support."],
    answer:
      "I'm very comfortable with computers. I use Windows, macOS and Linux, I know my way around Android and iPhone settings, and I can type at about forty words per minute. As a developer, I'm used to working with several tools at once, which helps when you're talking to a customer while using a CRM, a ticketing system and a knowledge base.",
    phrases: ["I'm very comfortable with…", 'I can type at about…', "I'm used to working with several tools at once."],
    mistakes: ["A list of programming languages the interviewer doesn't need."],
  },
  {
    id: 'tech-problem-solved',
    group: 'tech',
    q: "Tell me about a technical problem you solved for someone who wasn't technical.",
    why: 'Proof that you can do tech support.',
    tips: ['Use STAR, in simple language.', 'Show how you explained it.'],
    answer:
      "My neighbor couldn't connect her new laptop to her Wi-Fi, and she was sure the laptop was broken. I asked a few questions and found that she was typing the password of her old router. We found the right password on the sticker under the router, and it connected in a minute. I explained it simply: \"Every router has its own key, and this is the new one.\" She was so relieved.",
    phrases: ['I asked a few questions and found…', 'I explained it simply: …'],
    mistakes: ["A story that's only about code."],
  },
  // ── Fluency topics ─────────────────────────────────────────────────────
  {
    id: 'where-from',
    group: 'fluency',
    q: 'Where are you from? Tell me about your city.',
    why: 'Pure fluency: can you talk for 30–45 seconds on an easy topic?',
    tips: ['Describe two or three things: the place, what you like, a detail.', 'Use adjectives: busy, historic, crowded, lively.'],
    answer:
      "I'm from Cairo, the capital of Egypt. It's a huge, lively city; it never really sleeps, and the traffic can be crazy. What I love most is the mix of old and new: you can visit the pyramids in the morning and have coffee by the Nile in the evening. The people are very friendly, and there's always something to do.",
    phrases: ["It's a huge, lively city.", 'What I love most is…', "There's always something to do."],
    mistakes: ['"Cairo. It\'s good."', 'Memorized tourist-guide sentences.'],
  },
  {
    id: 'fluency-weekend',
    group: 'fluency',
    q: 'What did you do last weekend?',
    why: 'Fluency in the past simple.',
    tips: ['Tell two or three events in order.', 'Add one feeling or detail.'],
    answer:
      'Last weekend was pretty relaxing. On Friday, I played football with my friends, and on Saturday I visited my family and we had a big lunch together. In the evening, I watched a movie and practiced some English, so it was a good mix of rest and progress.',
    phrases: ['Last weekend was pretty…', 'On Friday, I…', '…a good mix of…'],
    mistakes: ['Using the present: "I go to my family."'],
  },
  {
    id: 'fluency-movie',
    group: 'fluency',
    q: 'Tell me about a movie or a series you like.',
    why: 'Fluency and vocabulary on a free topic.',
    tips: ["Say what it's about, why you like it and one detail."],
    answer:
      "One series I really like is The Office. It's a comedy about the people who work at a small paper company, and it shows office life in a really funny way. I like it because the characters feel real, and it's great for English, because they speak naturally and fast.",
    phrases: ['One series I really like is…', "It's about…", 'I like it because…'],
    mistakes: ['Retelling the whole story.'],
  },
  {
    id: 'fluency-technology',
    group: 'fluency',
    q: 'How has technology changed the way we live?',
    why: 'An opinion with reasons, like the open questions in assessments.',
    tips: ['Opinion, two reasons, an example, a conclusion.'],
    answer:
      "I think technology has changed almost everything, mostly for the better. First, it's made communication instant: I can talk to a client in the US as easily as to a friend in Cairo. Second, it's changed how we learn; I improve my English every day with videos and apps. On the other hand, we spend too much time on our phones. Overall, it's a great tool if we use it wisely.",
    phrases: ['I think…, mostly for the better.', 'First, … Second, …', 'On the other hand, …', 'Overall, …'],
    mistakes: ['A one-sentence answer.', 'No structure.'],
  },
  {
    id: 'fluency-goal',
    group: 'fluency',
    q: "What's a goal you're working on right now?",
    why: 'Motivation, and the present perfect continuous.',
    tips: ["Say the goal, why it matters and what you've been doing."],
    answer:
      "Right now, my main goal is to reach C1 English and start my career in technical support. I've been studying for several hours a day: I shadow real calls, record myself and practice interview questions. It's hard work, but I can already hear the difference in my recordings.",
    phrases: ['My main goal is…', "I've been studying…", 'I can already hear the difference.'],
    mistakes: ['A goal with no plan.'],
  },
];

/** Recorded tasks like the voice notes and recordings recruiters ask for. */
export const VOICE_PROMPTS: VoicePrompt[] = [
  {
    id: 'intro',
    title: 'Voice note: introduce yourself',
    prompt: 'Record the voice note a recruiter asks for: introduce yourself and say why you want a technical support job.',
    seconds: [60, 120],
    structure: [
      'Hello, your name and a thank-you',
      'Who you are now (one line)',
      "What you've done (2–3 sentences)",
      'Why this job: link your story to support',
      'Two strengths, each with a tiny proof',
      'Your availability, and thank you',
    ],
    sample:
      "Hi, I'm Belal, and thank you for taking the time to listen. I'm a software developer from Cairo, and for the last three years I've been working with clients from different countries, mostly in English. A big part of my job has been technical support: when a client's website or app stops working, I'm the person they call. What I've learned is that people don't need technical words; they need someone calm who explains things simply and gets the problem solved. That's exactly why I'm applying for this technical support role. I'm patient, I learn new tools quickly, and I type at around forty words per minute. I'm also completely flexible with shifts, including nights and weekends. I'd love the chance to show you what I can do in the next step. Thank you, and have a great day.",
  },
  {
    id: 'details',
    title: 'Spell your details',
    prompt: 'Say your full name and spell it with the NATO alphabet, then say your email and your phone number the way you would on a call.',
    seconds: [30, 60],
    structure: ['Your full name', 'Spell it: B as in Bravo…', 'Your email: … at … dot com', 'Your phone number, in groups'],
    sample:
      "My first name is Belal: B as in Bravo, E as in Echo, L as in Lima, A as in Alpha, L as in Lima. My email is belal dot example at mailbox dot com, all lowercase, and my phone number is 010, 2345, 6789.",
  },
  {
    id: 'why-tech-support',
    title: 'Why technical support?',
    prompt: 'In one minute, explain why you want to work in technical support, with one real example.',
    seconds: [45, 75],
    structure: ['Your reason in one sentence', 'A real example (a problem you solved for someone)', 'What it shows about you', 'Link it to the job'],
    sample:
      "I want to work in technical support because the best part of my work has always been helping people when technology lets them down. Last month, a client's online store stopped working an hour before a big sale. I stayed calm, found that a payment setting had changed and fixed it in twenty minutes, while I kept him updated the whole time. That's what I want to do every day: listen, find the problem, explain it simply and fix it.",
  },
  {
    id: 'read-aloud-1',
    title: 'Read aloud: a support message',
    prompt: 'Read this text aloud, as clearly and naturally as you can. Recruiters often ask for this.',
    seconds: [30, 60],
    structure: ['Pause at every comma and full stop', 'Stress the important words', 'Smile, and keep the same energy until the end'],
    sample:
      "Thank you for calling customer support. We understand that your time is valuable, so we'll do our best to solve your problem on the first call. Before we begin, please have your account number ready. If you're calling about a technical issue, it helps to restart your device first. Many problems are solved in less than a minute this way. If the problem continues, one of our specialists will guide you step by step until everything is working again.",
  },
  {
    id: 'read-aloud-2',
    title: 'Read aloud: working from home',
    prompt: 'Read this text aloud, clearly and naturally.',
    seconds: [30, 60],
    structure: ['Pause at every comma and full stop', 'Watch your -s and -ed endings', 'Keep a steady pace'],
    sample:
      'More and more companies now allow their employees to work from home. For many people, this means less time in traffic and more time with their families. However, working from home also has its challenges. It can be hard to separate work from personal life, and some people feel lonely without their colleagues. The key is to create a routine: start at the same time every day, take short breaks, and keep a quiet space just for work.',
  },
  {
    id: 'read-aloud-3',
    title: 'Read aloud: the technician',
    prompt: 'Read this story aloud, clearly and naturally.',
    seconds: [30, 60],
    structure: ['Past tense endings: -ed', 'Numbers and times clearly', 'A small pause between sentences'],
    sample:
      'Last Thursday, a technician visited an old building in the city center to fix a problem with the internet. The residents had been without service for three days, and many of them were frustrated. After checking the main cable, the technician discovered that construction workers had damaged it by accident. He replaced the cable in less than two hours, and by the afternoon, every apartment was back online.',
  },
  {
    id: 'read-aloud-4',
    title: 'Read aloud: what customers want',
    prompt: 'Read this text aloud, clearly and naturally.',
    seconds: [30, 60],
    structure: ['Numbers: "seventy percent"', 'Word stress: cus-to-mer, com-pa-nies', 'Finish strongly'],
    sample:
      'According to a recent survey, most customers care more about having their problem solved quickly than about the price of a service. Nearly seventy percent said they would pay a little more for better support. Customers also said that the most annoying thing is repeating their story to different agents. Companies that train their staff to listen carefully and solve problems on the first call usually keep their customers for much longer.',
  },
  {
    id: 'explain-restart',
    title: 'Explain a router restart',
    prompt: "Explain how to restart a router to someone who's never done it, as if they were on the phone with you.",
    seconds: [45, 75],
    structure: ['Reassure them', 'Help them find the box', 'Unplug, wait 30 seconds, plug back in', 'Wait for the lights', 'Check it works'],
    sample:
      "Don't worry, this is easy, and I'll stay with you. First, find the box from your internet company; it usually has small lights on the front. Now, follow the black power cable to the back of the box and unplug it. Let's wait thirty seconds together… Okay, plug it back in. The lights will blink for a minute or two, and that's normal. Once the Internet light is steady, try opening a website. Did it work?",
  },
  {
    id: 'empathy-lines',
    title: 'Empathy in three situations',
    prompt: "Record your best empathy response to three customers: one without internet for two days, one charged twice, and one who has called three times.",
    seconds: [45, 90],
    structure: ['Name their situation', 'Show you understand the feeling', 'Say what you will do now'],
    sample:
      "Two days without internet is really frustrating, especially if you work from home, and I'm going to get it fixed for you today. … I'm so sorry about the double charge; I know how worrying it is to see your money taken twice. Let me look at it right now. … You've called three times about this, and you shouldn't have had to. I'll take care of it personally, and I'll stay with you until it's solved.",
  },
];
