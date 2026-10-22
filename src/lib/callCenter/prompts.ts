/**
 * Prompts for a free AI partner (ChatGPT or Gemini, in voice mode): it plays
 * the customer or the interviewer, then scores you with the same rubric the
 * app uses. Copy, paste, talk.
 */
import type { InterviewQuestion, Scenario, VoicePrompt } from '../../data/callCenter/types';
import { CALL_RUBRIC, INTERVIEW_RUBRIC, type RubricCriterion } from './grading';

const rubricLines = (rubric: RubricCriterion[]) => rubric.map((c, i) => `${i + 1}. ${c.name}: ${c.great}`).join('\n');

const FEEDBACK = `Then give me:
- the score for each point (0 = missed, 1 = partly, 2 = great) and the total as a percentage,
- my 3 biggest English mistakes: what I said → a better way to say it,
- 3 natural phrases I could have used,
- one thing to do better next time.
Keep the feedback short, in simple English.`;

export function roleplayPrompt(s: Scenario): string {
  if (s.role === 'candidate') {
    return `Let's do an English job interview role-play for a call center in Egypt (technical support, American accounts). You are the interviewer; I am the candidate.

Who you are: ${s.persona}
What happens: ${s.situation}
${s.twist ? `Somewhere in the middle: ${s.twist}\n` : ''}
Rules:
- Ask one question at a time and wait for my full answer.
- Speak like a real recruiter: natural, friendly but professional.
- Ask a follow-up question when my answer is vague.
- Stay in the role until I say "end interview".

When I say "end interview", step out of the role and score me with this rubric:
${rubricLines(INTERVIEW_RUBRIC)}
${FEEDBACK}

Start now with your first question.`;
  }
  return `Let's do a call center role-play to practice English for a technical support / customer service job. You are the customer; I am the agent.

Who you are: ${s.persona}
Your situation: ${s.situation}
${s.twist ? `Halfway through the call: ${s.twist}\n` : ''}
Rules:
- Talk like a real American customer: natural, with contractions, sometimes a bit fast. Keep your turns short (1–3 sentences).
- Don't solve the problem for me: give details only when I ask the right questions.
- React to how I treat you: calm down if I show empathy, get more upset if I'm rude or unclear.
- Stay in character until I say "end call".

When I say "end call", step out of character and score me with this call center QA rubric:
${rubricLines(CALL_RUBRIC)}
${FEEDBACK}

Start now: you're calling me. Say your first line.`;
}

export function interviewQuestionPrompt(q: InterviewQuestion): string {
  return `I'm preparing for an English call center interview in Egypt (technical support). Ask me this question, then wait for my answer:

"${q.q}"

After I answer:
1. Tell me if a recruiter would be happy with it, and why.
2. Correct my grammar mistakes (what I said → better).
3. Give me a stronger version of my own answer, in natural American English, 80–120 words.
4. Ask me one follow-up question a real interviewer might ask.
Keep it short and simple.`;
}

/** For Gemini: upload the recording together with this prompt. */
export function voiceNoteFeedbackPrompt(v: VoicePrompt): string {
  return `I'm uploading a voice note I recorded for an English call center job (technical support) in Egypt. The task was: "${v.prompt}"

Listen to it like a recruiter and be honest:
1. Would you call me for an interview? Yes or no, and why.
2. Pronunciation: list the words I said wrong and how to say them.
3. Pace, pauses and fillers (um, uh): what to fix.
4. Grammar mistakes: what I said → better.
5. A better version of my script (same ideas, natural American English).
6. A score out of 10.
Use simple English.`;
}

export function writingFeedbackPrompt(task: string, text: string): string {
  return `I'm practicing written English for a customer support job (chat and email). The task was:
"${task}"

My reply:
"${text}"

Please: 1) correct every mistake (what I wrote → better), 2) say if the tone is right for a customer, 3) give a better version in natural American English, 4) score it out of 10.`;
}

export function freeTalkPrompt(topic: string): string {
  return `Let's have a relaxed English conversation to build my fluency. I'm preparing for a call center job. Topic: ${topic}.
Ask me open questions one at a time, react naturally, and keep your turns short. Don't correct me while we talk; when I say "stop", give me my 5 most important mistakes (what I said → better) and 5 useful phrases from our chat.`;
}

export const FREE_TALK_TOPICS = [
  'your city and how it has changed',
  'technology you use every day',
  'a time you helped someone',
  'working from home vs the office',
  'your favorite series and why',
  'what makes great customer service',
  'your plans for the next year',
  'a problem you solved recently',
];

export const AI_PARTNERS = [
  { name: 'ChatGPT', url: 'https://chatgpt.com/' },
  { name: 'Gemini', url: 'https://gemini.google.com/' },
];

export const NATURAL_READERS_URL = 'https://www.naturalreaders.com/online/';

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
