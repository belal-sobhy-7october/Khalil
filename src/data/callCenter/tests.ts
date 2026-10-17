/**
 * The diagnostic test, and what the level exams add on top of the questions
 * drawn from the level's lessons (src/lib/callCenter/quiz.ts builds the
 * weekly quizzes and the level exams). The exams copy the real hiring tests:
 * grammar and reading, listening, Versant-style speaking, typing, a chat
 * reply and a mock call.
 */
import type { LevelId, TestDef, TestItem } from './types';

/** Short stories to hear and retell (Versant "Story Retelling"). */
export const RETELL_STORIES: Array<{ id: string; story: string; points: string[] }> = [
  {
    id: 'phone-power',
    story:
      "A woman called a support line because her new phone wouldn't turn on. The agent asked her to hold the power button for ten seconds. The screen lit up, and she laughed: she had only been pressing it for a second. Before ending the call, she thanked the agent for being so patient.",
    points: ["Her new phone wouldn't turn on", 'The agent told her to hold the power button for ten seconds', 'It worked: she had only pressed it for a second', 'She thanked the agent for his patience'],
  },
  {
    id: 'cafe-internet',
    story:
      "Last winter, a small café lost its internet on a busy Saturday morning. The owner couldn't take card payments, so he put up a sign asking for cash. A technician arrived before lunch and found a broken cable under the street. By the afternoon, everything was working again, and the owner gave the technician a free coffee.",
    points: ['A café lost its internet on a busy Saturday', 'No card payments, so the owner asked for cash', 'A technician found a broken cable under the street', 'It was fixed by the afternoon; the technician got a free coffee'],
  },
  {
    id: 'app-bug',
    story:
      'An agent noticed that many customers were calling about the same error after an app update. She wrote down the exact message and told her team leader. The team leader shared it with the developers, and they fixed the bug the next day. The number of calls dropped by half.',
    points: ['Many customers called about the same error after an update', 'The agent wrote down the exact message and told her team leader', 'The developers fixed the bug the next day', 'Calls dropped by half'],
  },
  {
    id: 'hidden-router',
    story:
      'A man called to cancel his internet because it was too slow. Instead of cancelling right away, the agent asked a few questions and found out that the router was hidden behind the TV. They moved it to a better place, and the speed doubled. The man decided to keep his plan.',
    points: ['A man wanted to cancel because the internet was slow', 'The agent asked questions instead of cancelling right away', 'The router was hidden behind the TV; they moved it', 'The speed doubled, and he kept his plan'],
  },
];

/** Chat and email replies to write, checked against a model. */
export const WRITING_TASKS: Array<{ id: string; prompt: string; model: string; checklist: string[] }> = [
  {
    id: 'w-late-package',
    prompt: 'A customer writes in the chat: "My package was supposed to arrive yesterday and it\'s still not here!" Write your reply (3–5 sentences).',
    model:
      "I'm really sorry your package hasn't arrived yet; I know how frustrating that is. Let me check it for you right now. Could you please share your order number? Once I have it, I'll tell you exactly where it is and what we can do next.",
    checklist: ['Empathy or an apology', "Says what you'll do", 'Asks for the information you need', 'A clear next step', 'No grammar or spelling mistakes'],
  },
  {
    id: 'w-locked-account',
    prompt: 'A customer emails: "I can\'t log in to my account. I\'ve tried my password five times." Write a short reply (3–5 sentences).',
    model:
      "Thank you for contacting us, and I'm sorry you're having trouble logging in. After several failed attempts, accounts are locked for security, so I've unlocked yours and sent a password reset link to your email. The link is valid for 15 minutes. If you need any more help, just reply to this message.",
    checklist: ['Thanks the customer and shows empathy', 'Explains why it happened, simply', 'Says what you did', 'A clear next step and a time limit', 'No grammar or spelling mistakes'],
  },
  {
    id: 'w-refund-policy',
    prompt: 'A customer writes: "I want a refund for an order from 45 days ago." Your refund window is 30 days. Reply politely, with options (3–5 sentences).',
    model:
      "Thank you for reaching out, and I'm sorry the item didn't work out for you. I'm afraid our refund window is 30 days, so I can't offer a refund for this order. However, what I can do is give you store credit for the full amount, or exchange it for another item. Just let me know which you prefer, and I'll take care of it today.",
    checklist: ['Empathy first', 'The "no" is short and polite', 'Offers at least one real option', 'Asks the customer to choose', 'No grammar or spelling mistakes'],
  },
  {
    id: 'w-thank-you',
    prompt: 'Write a short thank-you message to a recruiter after your interview (3–4 sentences).',
    model:
      "Dear Sarah, thank you for your time today. I really enjoyed learning about the technical support team, and I'm even more excited about the role now. Please let me know if you need anything else from me. I look forward to hearing from you. Best regards, Belal",
    checklist: ['Thanks them for their time', 'Shows interest in the role', 'Offers more information', 'A polite closing and your name', 'No grammar or spelling mistakes'],
  },
];

/** What a level exam takes from the level's lessons, and what it adds. */
export interface ExamConfig {
  id: string;
  level: LevelId;
  title: string;
  pass: number;
  /** How many questions to draw from the level's lessons. */
  draw: { grammar: number; phrases: number; dictation: number; repeat: number; build: number; listen: number };
  extra: TestItem[];
}

export const LEVEL_EXAMS: ExamConfig[] = [
  {
    id: 'L1-EXAM',
    level: 'L1',
    title: 'Level 1 exam: Foundation',
    pass: 80,
    draw: { grammar: 10, phrases: 6, dictation: 4, repeat: 4, build: 3, listen: 2 },
    extra: [
      { type: 'speak', skill: 'speaking', prompt: 'Record your voice note: introduce yourself and say why you want a technical support job (60–90 seconds).', seconds: 90 },
      { type: 'speak', skill: 'speaking', prompt: 'Answer: What are your strengths? (45 seconds)', seconds: 45 },
      { type: 'typing', skill: 'typing', textId: 't-experience-summary', wpm: 25, accuracy: 90 },
    ],
  },
  {
    id: 'L2-EXAM',
    level: 'L2',
    title: 'Level 2 exam: Customer Service Core',
    pass: 80,
    draw: { grammar: 10, phrases: 8, dictation: 4, repeat: 4, build: 3, listen: 2 },
    extra: [
      { type: 'retell', skill: 'speaking', story: RETELL_STORIES[0].story, points: RETELL_STORIES[0].points },
      { type: 'write', skill: 'writing', prompt: WRITING_TASKS[0].prompt, model: WRITING_TASKS[0].model, checklist: WRITING_TASKS[0].checklist },
      { type: 'call', skill: 'calls', scenarioId: 'r-no-internet-elderly' },
      { type: 'speak', skill: 'speaking', prompt: 'Answer: How would you deal with an angry customer? (60 seconds)', seconds: 60 },
      { type: 'typing', skill: 'typing', textId: 't-troubleshoot-steps', wpm: 30, accuracy: 92 },
    ],
  },
  {
    id: 'L3-EXAM',
    level: 'L3',
    title: 'Level 3 exam: the full hiring simulation',
    pass: 80,
    draw: { grammar: 8, phrases: 6, dictation: 3, repeat: 6, build: 4, listen: 2 },
    extra: [
      { type: 'speak', skill: 'speaking', prompt: 'Stage 1 — the voice note: introduce yourself and say why you want this technical support job (60–120 seconds).', seconds: 120 },
      { type: 'speak', skill: 'speaking', prompt: "Stage 2 — HR: You're a programmer. Aren't you overqualified for this job? (60 seconds)", seconds: 60 },
      { type: 'speak', skill: 'speaking', prompt: 'Stage 2 — HR: What are your salary expectations, and are you comfortable with night shifts? (45 seconds)', seconds: 45 },
      { type: 'retell', skill: 'speaking', story: RETELL_STORIES[3].story, points: RETELL_STORIES[3].points },
      { type: 'speak', skill: 'speaking', prompt: 'Stage 3 — open question: Is it better to work from home or from the office? Give your opinion, a reason and an example. (45 seconds)', seconds: 45 },
      { type: 'typing', skill: 'typing', textId: 't-assessment-2', wpm: 35, accuracy: 95 },
      { type: 'write', skill: 'writing', prompt: WRITING_TASKS[1].prompt, model: WRITING_TASKS[1].model, checklist: WRITING_TASKS[1].checklist },
      { type: 'call', skill: 'calls', scenarioId: 'r-ops-mock-call' },
      { type: 'speak', skill: 'speaking', prompt: 'Stage 4 — operations: Sell me this pen. (60 seconds)', seconds: 60 },
    ],
  },
];

/** Day 0: where you really are, skill by skill. Not pass/fail. */
export const DIAGNOSTIC: TestDef = {
  id: 'L0-DIAG',
  title: 'Diagnostic test',
  kind: 'diagnostic',
  pass: 0,
  items: [
    // Grammar, from B1 to C1
    { type: 'mcq', skill: 'grammar', q: 'She ___ to work by bus every day.', options: ['go', 'goes', 'going', 'is go'], answer: 1 },
    { type: 'mcq', skill: 'grammar', q: 'I ___ the email yesterday.', options: ['send', 'sent', 'have sent', 'sending'], answer: 1 },
    { type: 'mcq', skill: 'grammar', q: 'There ___ a lot of customers in the queue right now.', options: ['is', 'are', 'be', 'has'], answer: 1 },
    { type: 'mcq', skill: 'grammar', q: 'If it rains, we ___ at home.', options: ['stay', 'will stay', 'stayed', 'would stay'], answer: 1 },
    { type: 'mcq', skill: 'grammar', q: "He's the agent ___ helped me last week.", options: ['which', 'who', 'whose', 'where'], answer: 1 },
    { type: 'mcq', skill: 'grammar', q: 'I ___ here since 2021.', options: ['work', 'worked', 'have worked', 'am working'], answer: 2 },
    { type: 'mcq', skill: 'grammar', q: 'By the time I arrived, the meeting ___.', options: ['already started', 'had already started', 'has already started', 'already starts'], answer: 1 },
    { type: 'mcq', skill: 'grammar', q: 'The new system ___ next month.', options: ['installs', 'will be installed', 'is installing', 'installed'], answer: 1 },
    { type: 'mcq', skill: 'grammar', q: 'I wish I ___ more time to practice.', options: ['have', 'had', 'will have', 'would'], answer: 1 },
    { type: 'mcq', skill: 'grammar', q: 'She asked me where ___.', options: ['do I live', 'I lived', 'did I live', 'I live in'], answer: 1 },
    { type: 'mcq', skill: 'grammar', q: 'Had I known about the outage, I ___ the customers earlier.', options: ['would warn', 'would have warned', 'will warn', 'had warned'], answer: 1 },
    { type: 'mcq', skill: 'grammar', q: 'Not only ___ the issue, but he also improved the process.', options: ['he fixed', 'did he fix', 'he did fix', 'fixed he'], answer: 1 },
    { type: 'mcq', skill: 'grammar', q: 'The customer insisted ___ to a manager.', options: ['to speak', 'on speaking', 'speaking', 'for speaking'], answer: 1 },
    { type: 'mcq', skill: 'grammar', q: "It's high time we ___ the old software.", options: ['replace', 'replaced', 'will replace', 'are replacing'], answer: 1 },
    { type: 'mcq', skill: 'grammar', q: '___ the delay, the project was a success.', options: ['Although', 'Despite', 'In spite', 'However'], answer: 1 },
    // Call center vocabulary
    { type: 'mcq', skill: 'vocabulary', q: 'To ___ a call means to pass it to a higher level of support.', options: ['escalate', 'elevate', 'extend', 'explore'], answer: 0 },
    { type: 'mcq', skill: 'vocabulary', q: 'A charge for only part of the month is ___.', options: ['prorated', 'refunded', 'overdue', 'recurring'], answer: 0 },
    { type: 'mcq', skill: 'vocabulary', q: 'When you ___ a problem, you look for the cause step by step.', options: ['troubleshoot', 'overlook', 'override', 'outsource'], answer: 0 },
    { type: 'mcq', skill: 'vocabulary', q: 'Please ___ your identity before I make any changes.', options: ['verify', 'notify', 'qualify', 'testify'], answer: 0 },
    { type: 'mcq', skill: 'vocabulary', q: 'The customer was shouting; he was really ___.', options: ['irate', 'eager', 'relieved', 'polite'], answer: 0 },
    // Listening
    { type: 'listen', skill: 'listening', scriptId: 's-login-capslock' },
    { type: 'listen', skill: 'listening', scriptId: 's-unknown-charge' },
    { type: 'dictation', skill: 'listening', text: 'Please restart the router and wait thirty seconds.' },
    { type: 'dictation', skill: 'listening', text: 'Your refund will arrive in five business days.' },
    { type: 'dictation', skill: 'listening', text: 'Could you spell your last name for me?' },
    { type: 'dictation', skill: 'listening', text: "I've sent a reset link to your email address." },
    // Speaking, Versant style
    { type: 'repeat', skill: 'speaking', text: 'Thank you for calling. How can I help you?' },
    { type: 'repeat', skill: 'speaking', text: 'Let me check that for you right now.' },
    { type: 'repeat', skill: 'speaking', text: 'The technician will arrive between nine and eleven.' },
    { type: 'repeat', skill: 'speaking', text: 'I completely understand how frustrating that must be.' },
    { type: 'build', skill: 'grammar', chunks: ['could you', 'spell your name', 'for me, please'] },
    { type: 'build', skill: 'grammar', chunks: ['the package', 'was delivered', 'yesterday afternoon'] },
    { type: 'build', skill: 'grammar', chunks: ["I'll send you", 'a confirmation email', 'in a few minutes'] },
    { type: 'speak', skill: 'speaking', prompt: "Don't prepare: tell me about yourself, and why you want a technical support job (about 90 seconds). This is your \"before\" recording.", seconds: 90 },
    // Writing and typing
    { type: 'write', skill: 'writing', prompt: WRITING_TASKS[0].prompt, model: WRITING_TASKS[0].model, checklist: WRITING_TASKS[0].checklist },
    { type: 'typing', skill: 'typing', textId: 't-intro-notes', wpm: 25, accuracy: 90 },
  ],
};
