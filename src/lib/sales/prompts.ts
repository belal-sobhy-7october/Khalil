/** Prompts to paste into an AI partner (ChatGPT / Gemini voice) for the sales role-plays and feedback. */
import type { Lang, SalesRoleplay, SpeakPrompt } from '../../data/sales/types';

export function roleplayPrompt(r: SalesRoleplay, lang: Lang): string {
  if (lang === 'en') {
    return [
      "Let's do a sales role-play. I'm a beginner salesperson practicing in English (I'm an Arabic speaker).",
      `I sell: ${r.youSell}`,
      `You play the customer: ${r.persona}`,
      `Your situation (only share details when I ask good questions): ${r.situation}`,
      r.twist ? `Halfway through: ${r.twist}` : '',
      "Rules: stay in character, keep your answers short and realistic like a real customer, don't help me sell. Don't buy unless I earn it.",
      `When I say "feedback", step out of the role and score me from 1 to 10 on each of these, with one example of what I said and a better way to say it: ${r.steps.join('; ')}. Then correct my three biggest English mistakes.`,
      'Start now: answer the phone or start the meeting as the customer.',
    ].filter(Boolean).join('\n\n');
  }
  return [
    'تعالى نعمل رول بلاي سيلز بالعامية المصرية. أنا بياع مبتدئ وبتمرن.',
    `أنا ببيع: ${r.youSell}`,
    `انت العميل: ${r.persona}`,
    `وضعك (متقولش التفاصيل غير لما أسأل أسئلة كويسة): ${r.situation}`,
    r.twist ? `في النص: ${r.twist}` : '',
    'القواعد: خليك في الدور، ردودك قصيرة وواقعية زي عميل مصري حقيقي، متساعدنيش أبيع، ومتشتريش غير لو أقنعتك فعلًا.',
    `لما أقول «تقييم»، اطلع من الدور وقيّمني من 1 لـ 10 في كل نقطة من دول، مع مثال من كلامي وطريقة أحسن أقوله بيها: ${r.steps.join('؛ ')}.`,
    'ابدأ دلوقتي: رد على التليفون أو ابدأ الكلام كأنك العميل.',
  ].filter(Boolean).join('\n\n');
}

/** Feedback on something you said, pasted as text (from the device's transcript or typed). */
export function speakFeedbackPrompt(s: SpeakPrompt, lang: Lang): string {
  if (lang === 'en') {
    return `I'm learning sales in English (Arabic speaker, beginner). The task was: "${s.prompt}" (about ${s.seconds} seconds; structure: ${s.structure.join(' → ')}).\n\nHere is what I said:\n\n[paste or type what you said]\n\nGive me: 1) a score out of 10 for clarity and for selling, 2) the three most important fixes, 3) a better version in simple, natural English I can practice.`;
  }
  return `بتعلم سيلز (مبتدئ). المهمة كانت: «${s.prompt}» (حوالي ${s.seconds} ثانية، والترتيب: ${s.structure.join(' ← ')}).\n\nده اللي قلته:\n\n[الصق أو اكتب اللي قلته]\n\nقولّي بالعامية المصرية: 1) تقييم من 10 للوضوح وللإقناع، 2) أهم 3 حاجات أصلحها، 3) نسخة أحسن أتمرن عليها.`;
}

/** A free conversation with an AI to practice a week's skill. */
export function lessonPracticePrompt(title: string, summary: string, lang: Lang): string {
  if (lang === 'en') {
    return `I'm a beginner learning sales. Today's lesson: "${title}": ${summary}\n\nQuiz me with five short real-life situations, one at a time. Wait for my answer, then tell me what was good and give me a better line. Keep your English simple.`;
  }
  return `أنا مبتدئ بتعلم سيلز. درس النهارده: «${title}»: ${summary}\n\nاديني 5 مواقف قصيرة من الواقع المصري، واحد واحد. استنى ردي، وبعدين قولّي إيه الكويس فيه واديني جملة أحسن. اتكلم بالعامية المصرية.`;
}
