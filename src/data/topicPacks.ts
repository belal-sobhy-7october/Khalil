/**
 * Ready-made topic packs: the most common, practical vocabulary for a topic,
 * all in English (learner-dictionary style definitions, B1–C1).
 *
 * Each pack's items are written one per line as
 *   type | word | definition | example
 * where type is w (word), v (verb / phrasal verb), i (idiom) or p (phrase /
 * collocation / useful sentence).
 */
import type { VocabularyItemType } from '../types';

export interface PackItem {
  word: string;
  type: VocabularyItemType;
  definition: string;
  example: string;
}

export interface TopicPack {
  id: string;
  title: string;
  description: string;
  level: 'B1' | 'B2' | 'C1';
  emoji: string;
  featured?: boolean;
  items: PackItem[];
}

const TYPE_CODES: Record<string, VocabularyItemType> = { w: 'word', v: 'verb', i: 'idiom', p: 'phrase' };

function parseItems(raw: string): PackItem[] {
  return raw
    .trim()
    .split('\n')
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter((parts) => parts.length === 4 && TYPE_CODES[parts[0]])
    .map(([code, word, definition, example]) => ({ type: TYPE_CODES[code], word, definition, example }));
}

function pack(meta: Omit<TopicPack, 'items'>, raw: string): TopicPack {
  return { ...meta, items: parseItems(raw) };
}

export const TOPIC_PACKS: TopicPack[] = [
  pack(
    {
      id: 'call-center-interview',
      title: 'Call Center Interview',
      description: 'Answer the questions call center recruiters always ask, in natural English.',
      level: 'B2',
      emoji: '🎧',
      featured: true,
    },
    `
p | Tell me about yourself | The usual opening question; give a short summary of your background, skills and why you fit the job. | I graduated in 2023, I've been working on my English every day, and I really enjoy helping people.
p | Why do you want to work in a call center? | A question about your motivation for this kind of job. | I enjoy talking to people and solving problems, and I want to use my English in a professional environment.
p | What do you know about our company? | A question that checks whether you researched the employer. | I know you provide customer support for international clients, mainly in telecom and tech.
p | Why should we hire you? | A question asking what makes you the best candidate. | I'm patient, a fast learner, and I stay calm under pressure, which is exactly what this role needs.
p | Where do you see yourself in five years? | A question about your long-term goals. | I'd like to grow into a team leader or quality role within the company.
p | What are your strengths? | A question about the qualities that make you good at the job. | My main strength is communication — I listen carefully and explain things clearly.
p | What is your greatest weakness? | A question about something you are improving; show self-awareness and progress. | I used to take on too much myself, but now I prioritise and ask for help when I need it.
p | How would you handle an angry customer? | A situational question about staying calm and solving the problem. | I'd let them explain without interrupting, apologise, show empathy, and focus on a solution.
p | Are you comfortable working night shifts? | A question about your flexibility with working hours. | Yes, I'm flexible and comfortable working night shifts and weekends.
p | Can you work under pressure? | A question about handling stress and a high workload. | Yes — I stay organised and focus on one call at a time, even when the queue is busy.
p | Describe a time you solved a problem | A behavioural question; answer with the situation, what you did, and the result. | A friend's order was lost, so I called the store, tracked it down and had it delivered the next day.
w | customer service | The help and support a company gives to its customers. | Good customer service keeps clients coming back.
w | inbound call | A call that a customer makes to the company. | Most of our work is inbound calls about billing.
w | outbound call | A call that an agent makes to a customer, e.g. for sales or follow-up. | Outbound calls are usually sales or surveys.
w | agent | A person who answers customer calls or chats. | She works as a customer service agent.
w | account | The customer's file or service with the company. | Let me pull up your account.
w | shift | A fixed period of working time. | I'm on the morning shift this week.
w | rotational shifts | Working hours that change from week to week. | The job involves rotational shifts.
w | KPI | Key Performance Indicator; a number used to measure how well you are doing. | Our main KPIs are call quality and handling time.
w | AHT | Average Handling Time; the average length of a call including hold and after-call work. | We try to keep AHT under six minutes.
w | first call resolution | Solving the customer's problem in the first call, with no need to call again. | First call resolution is our top priority.
w | customer satisfaction | How happy customers are with the service, often measured by a survey score. | Customer satisfaction went up this month.
w | escalation | Passing a problem to a supervisor or a more senior team. | If I can't solve it, I'll raise an escalation.
w | empathy | The ability to understand and share someone else's feelings. | Showing empathy calms customers down.
w | patience | The ability to stay calm when things are slow or difficult. | This job requires a lot of patience.
w | multitasking | Doing several things at the same time. | You need to multitask — talk, type and search at once.
w | fluent | Able to speak a language easily and well. | I'm fluent in English and Arabic.
w | team player | Someone who works well with other people. | I'm a team player and I like helping my colleagues.
w | fast learner | Someone who learns new things quickly. | I'm a fast learner, so I'll pick up the systems quickly.
w | probation period | The first months of a job when your performance is checked. | The probation period is three months.
w | training | A period of learning the products, systems and procedures before taking calls. | Training lasts four weeks.
w | night differential | Extra pay for working at night. | Is there a night differential for the night shift?
p | handle a high volume of calls | Deal with a large number of calls. | I can handle a high volume of calls without losing focus.
p | meet targets | Reach the goals you have been set. | I always try to meet my targets.
p | I'm a people person | I enjoy being with and helping people. | I'm a people person, so customer service suits me.
p | Do you have any questions for us? | The question at the end of an interview; always ask something. | Yes — what does a typical day look like for a new agent?
p | What does the training involve? | A good question to ask the interviewer at the end. | Could you tell me what the training involves?
p | I'm available to start immediately | I can start the job right away. | I'm available to start immediately.
`
  ),
  pack(
    {
      id: 'call-center-on-the-call',
      title: 'Call Center: On the Call',
      description: 'The exact phrases agents use from greeting to closing a call.',
      level: 'B2',
      emoji: '☎️',
      featured: true,
    },
    `
p | Thank you for calling, my name is … How may I help you? | A standard professional greeting at the start of a call. | Thank you for calling TechCare, my name is Belal. How may I help you today?
p | May I have your full name, please? | A polite way to ask for the customer's name. | Before we start, may I have your full name, please?
p | Could you please verify your account number? | Asking the customer to confirm details for security. | For security purposes, could you please verify your account number?
p | For security purposes | Used to explain why you need to check personal information. | For security purposes, I need to confirm your date of birth.
p | Could you spell that for me, please? | Asking someone to say the letters of a word one by one. | Sorry, could you spell your surname for me, please?
p | Just to confirm, … | Used to repeat information to make sure it is correct. | Just to confirm, your email is ahmed@mail.com?
p | Let me make sure I understand | Used before summarising the customer's problem. | Let me make sure I understand — you were charged twice this month?
p | I completely understand how frustrating that must be | A phrase showing empathy for the customer's problem. | I completely understand how frustrating that must be, and I'll fix it now.
p | I apologise for the inconvenience | A formal way to say sorry for a problem. | I apologise for the inconvenience this has caused you.
p | I'll be happy to help you with that | A positive way to say you will solve the issue. | No problem, I'll be happy to help you with that.
p | Bear with me for a moment | Please wait a short time while I do something. | Bear with me for a moment while I check your account.
p | May I place you on hold for a minute or two? | Asking permission to put the customer on hold. | May I place you on hold for a minute or two while I check this?
p | Thank you for holding | Said when you come back after a hold. | Thank you for holding, Mr. Ali. I've found the problem.
p | Let me look into that for you | I will check or investigate the problem. | Let me look into that for you.
p | I'm going to transfer you to the right department | Telling the customer you will send the call to another team. | I'm going to transfer you to our billing department, who can help with this.
p | Is there anything else I can help you with today? | A standard question before closing a call. | Is there anything else I can help you with today?
p | Thank you for your patience | Thanking the customer for waiting or staying calm. | Thank you for your patience while I fixed that.
p | Have a great day! | A friendly closing phrase. | Thank you for calling, and have a great day!
p | I'm sorry, the line is breaking up | The call quality is bad and you can't hear well. | I'm sorry, the line is breaking up — could you repeat that?
p | Could you speak up a little, please? | Asking someone to talk louder. | I can barely hear you — could you speak up a little, please?
p | I'll call you back if we get disconnected | A promise to call again if the call drops. | If we get disconnected, I'll call you back on this number.
p | You should receive a confirmation email shortly | The customer will get an email soon. | Your request is done; you should receive a confirmation email shortly.
p | It should take effect within 24 hours | The change will start working within a day. | Your new plan should take effect within 24 hours.
p | I've gone ahead and … | I have already done something for you. | I've gone ahead and refunded the extra charge.
p | Here's what I can do for you | Used to offer a solution or option. | Here's what I can do for you: I can waive the late fee this month.
v | pull up | To find and open information on a computer. | Let me pull up your account details.
v | look into | To investigate or check something. | I'll look into why the payment failed.
v | hold on | To wait for a short time. | Could you hold on a second, please?
v | put through | To connect someone by phone to another person. | I'll put you through to technical support.
v | follow up | To check on something again later. | I'll follow up with you by email tomorrow.
v | sort out | To solve a problem. | Don't worry, we'll sort it out today.
v | go over | To check or explain something carefully. | Let me go over the details of your plan.
v | hang up | To end a phone call. | Please don't hang up — I'm transferring you now.
w | ticket | A record of a customer's problem in the support system. | I've opened a ticket for your issue.
w | reference number | A number that identifies a request or case. | Your reference number is 4-7-2-9.
w | refund | Money returned to a customer. | You'll receive a full refund within five days.
w | billing | Everything related to bills and payments. | That's a billing issue, so I'll check your invoices.
w | troubleshoot | To find and fix the cause of a technical problem. | Let's troubleshoot your router together.
`
  ),
  pack(
    {
      id: 'call-center-difficult-customers',
      title: 'Call Center: Difficult Customers',
      description: 'Stay calm, de-escalate and say no politely.',
      level: 'B2',
      emoji: '🧯',
      featured: true,
    },
    `
p | I hear you, and I want to help | Shows you are listening and on the customer's side. | I hear you, and I want to help fix this today.
p | You have every right to be upset | Accepting that the customer's feelings are reasonable. | You have every right to be upset — this shouldn't have happened.
p | I can see why you'd feel that way | Showing understanding of someone's point of view. | I can see why you'd feel that way after waiting so long.
p | Let's see what we can do | Moving the conversation towards a solution. | Okay, let's see what we can do to make this right.
p | I'm afraid that's not something I can do, but … | A polite way to say no and then offer an alternative. | I'm afraid that's not something I can do, but I can offer you a discount.
p | Unfortunately, … | A polite word to introduce bad news. | Unfortunately, the offer ended last week.
p | What I can do is … | Focusing on what is possible instead of what is not. | What I can do is send a technician tomorrow morning.
p | I'll personally make sure … | Taking ownership of the problem. | I'll personally make sure this gets resolved.
p | I'd like to escalate this to my supervisor | Passing the issue to a manager. | I'd like to escalate this to my supervisor so it gets priority.
p | I understand this isn't the answer you were hoping for | Softening disappointing news. | I understand this isn't the answer you were hoping for.
p | Thank you for bringing this to our attention | Thanking the customer for reporting a problem. | Thank you for bringing this to our attention — we'll fix it.
p | I need you to lower your voice, please | Politely asking an angry customer to stop shouting. | I want to help, but I need you to lower your voice, please.
p | If the language continues, I'll have to end the call | A professional warning about abusive language. | Sir, if the language continues, I'll have to end the call.
p | I'd be frustrated too | Agreeing with the customer's feelings to build rapport. | Honestly, I'd be frustrated too in your situation.
w | de-escalate | To make a tense situation calmer. | Empathy is the fastest way to de-escalate a call.
w | complaint | A statement that something is wrong or not good enough. | I'd like to make a formal complaint.
w | compensation | Something, usually money, given to make up for a problem. | We can offer compensation for the delay.
w | goodwill credit | Money added to an account as an apology. | I've added a goodwill credit to your account.
w | frustrated | Annoyed because you can't achieve or change something. | The customer was frustrated after three calls.
w | irate | Extremely angry. | I had an irate caller this morning.
w | reassure | To make someone feel less worried. | I reassured her that her data was safe.
w | acknowledge | To accept or show that you have noticed something. | Always acknowledge the problem before explaining.
v | calm down | To become less angry or upset (don't say this to the customer directly!). | Once he calmed down, we fixed the problem quickly.
v | make up for | To do something good to repair a bad situation. | We'd like to make up for the trouble with a free month.
i | go the extra mile | To do more than what is expected. | She always goes the extra mile for her customers.
i | bend over backwards | To try very hard to help someone. | We bent over backwards to fix his account.
i | at the end of the day | Finally, when everything is considered. | At the end of the day, the customer just wants a solution.
`
  ),
  pack(
    {
      id: 'job-interview',
      title: 'Job Interview',
      description: 'Talk about your experience, skills and goals with confidence.',
      level: 'B2',
      emoji: '💼',
      featured: true,
    },
    `
w | résumé / CV | A document listing your education, experience and skills. | I've attached my CV to the email.
w | cover letter | A letter sent with a CV explaining why you want the job. | Keep your cover letter to one page.
w | candidate | A person applying for a job. | They interviewed five candidates.
w | position | A job in a company. | I'm applying for the position of support agent.
w | qualifications | Degrees, certificates or skills that make you suitable for a job. | What qualifications do you have?
w | background | Your education and past experience. | My background is in business administration.
w | entry-level | Suitable for someone with little or no experience. | It's an entry-level role with full training.
w | salary expectations | The amount of pay you hope to receive. | What are your salary expectations?
w | benefits | Extra things you get from a job besides salary, e.g. insurance. | The benefits include medical insurance.
w | reliable | Can be trusted to do what is expected. | My last manager described me as very reliable.
w | proactive | Taking action before problems happen. | I'm proactive — I fix small issues before they grow.
w | detail-oriented | Paying close attention to small details. | I'm detail-oriented, so I rarely make data-entry mistakes.
w | adaptable | Able to change to suit new situations. | I'm adaptable and learn new systems quickly.
w | deadline | A time by which something must be finished. | I always meet my deadlines.
w | achievement | Something good you succeeded in doing. | My biggest achievement was leading the graduation project.
w | reference | A person who can describe your character and work to an employer. | I can provide two references.
v | apply for | To formally ask for a job. | I'm applying for the customer support role.
v | take on | To accept work or responsibility. | I'm ready to take on more responsibility.
v | work on | To spend time improving or producing something. | I've been working on my public speaking.
v | carry out | To do a task or plan. | I carried out customer surveys in my last job.
v | stand out | To be noticeably better than others. | What makes you stand out from other candidates?
v | bring to the table | To offer a skill or quality. | I bring strong communication skills to the table.
p | I have hands-on experience in … | I have practical, real experience doing something. | I have hands-on experience in dealing with customers.
p | I'm looking for an opportunity to … | Explaining what you want from the job. | I'm looking for an opportunity to grow in a professional company.
p | In my previous role, I … | Introducing an example from your last job. | In my previous role, I handled around 40 customer requests a day.
p | That's a great question | Buys you a moment to think before answering. | That's a great question — let me think for a second.
p | I'd describe myself as … | Introducing your main qualities. | I'd describe myself as hardworking and calm under pressure.
p | I'm keen to learn | I'm very interested and eager to learn. | I'm keen to learn and develop new skills.
p | When can I expect to hear back? | Asking when they will tell you the result. | Thank you for your time. When can I expect to hear back?
p | Thank you for the opportunity | A polite way to end an interview. | Thank you for the opportunity — I really enjoyed our conversation.
i | think on my feet | To make quick decisions without preparation. | Working in sales taught me to think on my feet.
i | learn the ropes | To learn how to do a particular job. | It took me a couple of weeks to learn the ropes.
i | hit the ground running | To start a new job and work well immediately. | Thanks to my experience, I can hit the ground running.
i | a quick learner | Someone who learns new things easily. | I'm a quick learner, so training won't be a problem.
`
  ),
  pack(
    {
      id: 'phone-and-email',
      title: 'Phone & Email English',
      description: 'Clear, polite English for calls, voicemails and work emails.',
      level: 'B2',
      emoji: '📧',
    },
    `
p | Who's calling, please? | A polite way to ask who is on the phone. | Who's calling, please?
p | Speaking. | Used on the phone to say "I am the person you asked for". | "Can I speak to Sara?" — "Speaking."
p | I'm calling about … | Explaining the reason for your call. | Hi, I'm calling about my order from last week.
p | Could you take a message? | Asking someone to write down information for another person. | She's not here? Could you take a message?
p | I'll get back to you | I will contact you again later with an answer. | Let me check and I'll get back to you this afternoon.
p | Sorry, you've lost me | I don't understand what you are saying. | Sorry, you've lost me — could you explain that again?
p | I hope this email finds you well | A common friendly opening in formal emails. | Dear Mr. Hassan, I hope this email finds you well.
p | I'm writing to … | Explaining the purpose of an email. | I'm writing to follow up on my application.
p | Please find attached … | Telling someone that a file is attached. | Please find attached my updated CV.
p | Please don't hesitate to contact me | Inviting someone to contact you if they need anything. | If you have any questions, please don't hesitate to contact me.
p | I look forward to hearing from you | A standard formal email ending. | I look forward to hearing from you.
p | Just a quick reminder that … | A polite way to remind someone of something. | Just a quick reminder that the meeting starts at 10.
p | Sorry for the late reply | Apologising for answering an email late. | Sorry for the late reply — it's been a busy week.
p | As per our conversation | Referring to something you discussed earlier. | As per our conversation, I've sent the contract.
w | voicemail | A recorded phone message. | I left you a voicemail this morning.
w | missed call | A call you did not answer. | I saw a missed call from you.
w | attachment | A file sent with an email. | The attachment is too large to open.
w | subject line | The title of an email. | Write a clear subject line.
w | cc | To send a copy of an email to another person. | Please cc my manager on your reply.
v | call back | To phone someone again or return their call. | Can I call you back in ten minutes?
v | get through | To succeed in reaching someone by phone. | I tried calling, but I couldn't get through.
v | cut off | To be disconnected during a phone call. | Sorry, we got cut off.
v | reach out | To contact someone, usually to offer or ask for help. | Feel free to reach out if you need anything.
v | loop in | To include someone in an email or discussion. | I'll loop in the team lead.
i | touch base | To make brief contact with someone. | Let's touch base next week about the project.
`
  ),
  pack(
    {
      id: 'work-and-office',
      title: 'Work & Office',
      description: 'Everyday language for working with a team.',
      level: 'B2',
      emoji: '🏢',
    },
    `
w | colleague | A person you work with. | My colleagues are very supportive.
w | supervisor | A person who manages a team and checks their work. | My supervisor gives feedback every Friday.
w | workload | The amount of work a person has to do. | My workload is heavy this month.
w | feedback | Comments about how well someone is doing. | I asked my manager for feedback.
w | promotion | Moving to a higher position at work. | She got a promotion after one year.
w | day off | A day when you don't have to work. | I'm taking a day off on Thursday.
w | overtime | Time worked beyond your normal hours. | We did a lot of overtime before the launch.
w | sick leave | Time off work because you are ill. | He's on sick leave this week.
w | task | A piece of work to be done. | I have three tasks to finish today.
w | priority | Something more important than other things. | Customer calls are our top priority.
w | remote work | Working from home or outside the office. | The company allows remote work twice a week.
w | burnout | Extreme tiredness caused by working too hard for too long. | Take breaks to avoid burnout.
v | catch up on | To do work you didn't have time for earlier. | I need to catch up on my emails.
v | fill in for | To do someone's job while they are away. | Can you fill in for me tomorrow?
v | hand in | To give work to someone in authority. | Please hand in your reports by Friday.
v | run late | To be behind schedule. | Sorry, I'm running late — traffic is terrible.
v | get along with | To have a good relationship with someone. | I get along with everyone on my team.
v | take over | To start doing something someone else was doing. | Who will take over your calls while you're away?
v | keep up with | To stay at the same level or speed as others. | It's hard to keep up with all the changes.
p | on a tight schedule | Having very little time to do things. | We're on a tight schedule this week.
p | ahead of schedule | Earlier than planned. | The project is ahead of schedule.
p | work from home | To do your job at home. | I work from home on Mondays.
p | have a lot on my plate | To be very busy with many things. | I have a lot on my plate right now.
i | call it a day | To stop working for the day. | It's 6 o'clock — let's call it a day.
i | up to speed | Having the latest information. | Let me bring you up to speed on the project.
i | on the same page | Agreeing or understanding things the same way. | Let's make sure we're all on the same page.
i | cut corners | To do something badly or cheaply to save time or money. | Don't cut corners on quality.
i | back to square one | Back to the start after a failure. | The client rejected it, so we're back to square one.
`
  ),
  pack(
    {
      id: 'meetings-and-discussions',
      title: 'Meetings & Discussions',
      description: 'Join in, agree, disagree and keep a meeting moving.',
      level: 'B2',
      emoji: '🗣️',
    },
    `
p | Can I just add something? | A polite way to join the conversation. | Sorry, can I just add something here?
p | If I could just finish my point | Politely asking not to be interrupted. | If I could just finish my point, then you can go ahead.
p | I see what you mean, but … | Partly agreeing before disagreeing. | I see what you mean, but the budget is too small.
p | I couldn't agree more | I completely agree. | I couldn't agree more — we need more training.
p | I'm not sure I agree | A soft way to disagree. | I'm not sure I agree with that approach.
p | That's a fair point | Accepting that someone's idea is reasonable. | That's a fair point; let's think about it.
p | Let's move on to the next item | Changing to the next topic on the agenda. | Let's move on to the next item on the agenda.
p | To sum up, … | Introducing a short summary. | To sum up, we'll launch the campaign next month.
p | Could you clarify what you mean by …? | Asking for a clearer explanation. | Could you clarify what you mean by "soon"?
p | Let's take this offline | Let's discuss this separately, not in the meeting. | That's a big topic — let's take this offline.
w | agenda | A list of things to discuss in a meeting. | What's on the agenda today?
w | minutes | A written record of what was said in a meeting. | Who's taking the minutes?
w | deadline | The latest time something must be done. | The deadline is the end of the month.
w | proposal | A plan or suggestion for others to consider. | She presented a proposal to reduce costs.
w | action item | A task someone must do after a meeting. | Let's list the action items before we finish.
v | bring up | To mention a subject. | I'd like to bring up the issue of shift swaps.
v | point out | To tell someone about a fact they might not know. | He pointed out a mistake in the report.
v | go along with | To agree with an idea or decision. | I'll go along with whatever the team decides.
v | come up with | To think of an idea or plan. | We need to come up with a better solution.
v | put off | To delay something. | Let's put off the decision until Monday.
i | get the ball rolling | To start something. | Let's get the ball rolling with a quick update.
i | the bottom line | The most important fact. | The bottom line is we need more agents.
i | in a nutshell | In a few words. | In a nutshell, the new system is faster.
i | think outside the box | To think in a new, creative way. | We need to think outside the box here.
`
  ),
  pack(
    {
      id: 'small-talk',
      title: 'Small Talk',
      description: 'Start conversations, keep them going and end them politely.',
      level: 'B1',
      emoji: '☕',
    },
    `
p | How's it going? | An informal way to say "How are you?". | Hey Omar, how's it going?
p | Not bad, you? | A common short answer to "How are you?". | "How are you?" — "Not bad, you?"
p | What have you been up to? | What have you been doing recently? | Long time no see! What have you been up to?
p | Long time no see | I haven't seen you for a long time. | Long time no see! You look great.
p | What do you do? | What is your job? | So, what do you do?
p | How was your weekend? | A common Monday conversation starter. | How was your weekend? Did you do anything fun?
p | Any plans for the weekend? | Asking what someone will do at the weekend. | Any plans for the weekend?
p | It's been a long day | I'm tired; the day felt long. | It's been a long day — I need some coffee.
p | It was nice talking to you | A polite way to end a conversation. | Anyway, it was nice talking to you!
p | I'd better get going | I need to leave now. | Oh, look at the time — I'd better get going.
p | Same here | Me too. | "I'm exhausted." — "Same here."
p | Tell me about it! | I completely agree (because I have the same experience). | "Traffic was awful today." — "Tell me about it!"
p | No way! | Used to show surprise. | "I got the job!" — "No way! Congratulations!"
p | That makes sense | I understand; that's logical. | Ah, that makes sense now.
p | Fair enough | I accept that; that's reasonable. | "I can't come, I'm working." — "Fair enough."
w | awkward | Uncomfortable or embarrassing. | There was an awkward silence.
w | catch-up | A conversation to share recent news. | Let's have a proper catch-up over lunch.
v | catch up | To talk to someone you haven't seen for a while. | We should catch up soon.
v | run into | To meet someone by chance. | I ran into my old teacher at the mall.
v | hang out | To spend time relaxing with friends. | We usually hang out at a café downtown.
i | break the ice | To make people feel relaxed at the start of a conversation. | He told a joke to break the ice.
i | small world | Said when you meet someone you know in a surprising place. | You know Ahmed too? Small world!
i | speak of the devil | Said when the person you are talking about arrives. | Speak of the devil — here's Mona!
`
  ),
  pack(
    {
      id: 'opinions-and-arguing',
      title: 'Opinions & Arguing',
      description: 'Give opinions, support them and disagree politely.',
      level: 'B2',
      emoji: '💬',
    },
    `
p | In my opinion, … | Introducing what you think. | In my opinion, remote work is more productive.
p | As far as I'm concerned, … | From my point of view. | As far as I'm concerned, the price is too high.
p | The way I see it, … | Introducing your view of a situation. | The way I see it, we have two options.
p | To be honest, … | Introducing a sincere, sometimes negative, opinion. | To be honest, I didn't like the movie.
p | I'd have to disagree | A polite way to say you disagree. | I'd have to disagree with you there.
p | On the one hand … on the other hand … | Comparing two sides of an argument. | On the one hand it's cheap; on the other hand, it's slow.
p | That's not necessarily true | It isn't always true. | Expensive means better? That's not necessarily true.
p | It depends on … | The answer changes depending on something. | It depends on how much time we have.
p | Having said that, … | Despite what I just said. | It's expensive. Having said that, the quality is great.
p | I see your point | I understand your argument. | I see your point, but I still think we should wait.
w | argue | To give reasons for or against something. | He argued that the plan was too risky.
w | convince | To make someone believe something. | She convinced me to apply for the job.
w | evidence | Facts that show something is true. | There's no evidence to support that idea.
w | biased | Unfairly preferring one side. | The article is very biased.
w | compromise | An agreement where both sides accept less than they wanted. | We reached a compromise.
w | valid | Logical and reasonable. | That's a valid argument.
w | controversial | Causing a lot of disagreement. | It's a controversial topic.
v | back up | To support a claim with evidence. | Can you back that up with data?
v | point out | To mention a fact to make people notice it. | I'd like to point out that prices have risen.
i | agree to disagree | To accept that two people have different opinions. | Let's just agree to disagree.
i | play devil's advocate | To argue the opposite side to test an idea. | Let me play devil's advocate for a second.
i | a bone of contention | A subject people keep arguing about. | Salary was a bone of contention.
i | sit on the fence | To avoid choosing a side. | You can't sit on the fence forever.
`
  ),
  pack(
    {
      id: 'feelings-and-personality',
      title: 'Feelings & Personality',
      description: 'Describe how people feel and what they are like.',
      level: 'B2',
      emoji: '🙂',
    },
    `
w | outgoing | Friendly and enjoys meeting people. | She's very outgoing and makes friends easily.
w | reserved | Quiet and does not show feelings easily. | He's a bit reserved at first.
w | easy-going | Relaxed and not easily upset. | My boss is easy-going.
w | ambitious | Having a strong wish to succeed. | He's ambitious and works hard.
w | stubborn | Refusing to change your opinion. | She's too stubborn to admit she was wrong.
w | arrogant | Thinking you are better than others. | He's arrogant and never listens.
w | considerate | Thinking about other people's feelings. | It was considerate of you to call.
w | reliable | Can be trusted. | She's the most reliable person on the team.
w | moody | Often changing mood, often unhappy. | He's moody in the mornings.
w | clumsy | Often dropping or breaking things. | I'm so clumsy — I broke another glass.
w | anxious | Worried and nervous. | I always feel anxious before interviews.
w | overwhelmed | Having too much to deal with. | I felt overwhelmed in my first week.
w | relieved | Happy because something bad didn't happen or ended. | I was relieved when I passed the exam.
w | thrilled | Extremely happy and excited. | I'm thrilled about the new job.
w | upset | Unhappy or worried because something bad happened. | She was upset about the comments.
w | annoyed | A little angry. | I get annoyed when people are late.
w | confident | Sure about your abilities. | Practice makes me more confident.
w | embarrassed | Feeling ashamed or uncomfortable in front of others. | I was embarrassed when I forgot his name.
v | cheer up | To become or make someone happier. | Cheer up — it's not that bad!
v | freak out | To become very anxious or upset. | Don't freak out, we'll fix it.
v | show off | To try to impress people. | He likes to show off his new car.
v | look up to | To admire and respect someone. | I've always looked up to my father.
i | down in the dumps | Sad and depressed. | She's been down in the dumps since she lost her job.
i | over the moon | Extremely happy. | I was over the moon when I got the offer.
i | on edge | Nervous and unable to relax. | I'm a bit on edge before the interview.
i | lose your temper | To suddenly become very angry. | He lost his temper with the customer.
`
  ),
  pack(
    {
      id: 'shopping-and-money',
      title: 'Shopping & Money',
      description: 'Buying, returning, paying and talking about money.',
      level: 'B1',
      emoji: '🛍️',
    },
    `
w | bargain | Something bought for much less than its usual price. | This phone was a real bargain.
w | receipt | A paper showing what you paid. | Keep the receipt in case you want to return it.
w | refund | Money given back to you. | I asked for a refund.
w | discount | A reduction in price. | Students get a 10% discount.
w | out of stock | Not available in the shop at the moment. | That size is out of stock.
w | budget | The amount of money you plan to spend. | It's over my budget.
w | afford | To have enough money to buy something. | I can't afford a new laptop right now.
w | overpriced | More expensive than it should be. | Food at the airport is overpriced.
w | installment | One of several payments for something. | I'm paying in monthly installments.
w | checkout | The place where you pay in a shop or online. | Go to the checkout to pay.
w | warranty | A promise to repair or replace a product. | It has a two-year warranty.
w | savings | Money you have kept and not spent. | I used my savings to buy a car.
v | try on | To put on clothes to see if they fit. | Can I try this jacket on?
v | shop around | To compare prices in different shops. | Shop around before you buy a phone.
v | pay off | To finish paying a debt. | I finally paid off my loan.
v | splash out | To spend a lot of money on something nice. | We splashed out on a nice dinner.
v | save up | To keep money to buy something later. | I'm saving up for a trip.
v | run out of | To have no more of something. | I've run out of cash.
p | Do you take cards? | Do you accept card payments? | Do you take cards or is it cash only?
p | I'm just looking, thanks | Said to a shop assistant when you don't need help. | I'm just looking, thanks.
p | Can I exchange this? | Asking to swap a product for another one. | It's too small — can I exchange this?
i | cost an arm and a leg | To be very expensive. | That watch costs an arm and a leg.
i | a rip-off | Something that costs far too much. | Ten dollars for water? What a rip-off!
i | tighten your belt | To spend less money. | We need to tighten our belts this month.
i | make ends meet | To have just enough money to live. | It's hard to make ends meet with one salary.
`
  ),
  pack(
    {
      id: 'travel',
      title: 'Travel & Airport',
      description: 'From booking to check-in, hotels and getting around.',
      level: 'B1',
      emoji: '✈️',
    },
    `
w | boarding pass | The document that lets you get on a plane. | Please show your boarding pass at the gate.
w | carry-on | A small bag you take onto the plane. | You're allowed one carry-on bag.
w | layover | A short stop between two flights. | We have a three-hour layover in Dubai.
w | delayed | Later than planned. | Our flight is delayed by two hours.
w | itinerary | A plan of a journey. | I'll email you the itinerary.
w | departure | The act of leaving, especially for a trip. | Departures are on the second floor.
w | customs | The place at a border where bags are checked. | We went through customs quickly.
w | reservation | An arrangement to keep a room, seat, etc. for you. | I have a reservation under the name Belal.
w | sightseeing | Visiting famous places as a tourist. | We spent the day sightseeing.
w | jet lag | Tiredness after a long flight across time zones. | I still have jet lag.
w | round trip | A journey to a place and back again. | A round-trip ticket is cheaper.
v | check in | To arrive and register at a hotel or airport. | We checked in at the hotel at 3 pm.
v | check out | To leave a hotel after paying. | We have to check out by noon.
v | set off | To start a journey. | We set off early in the morning.
v | get on / get off | To enter / leave a bus, train or plane. | Get off at the next stop.
v | pick up | To collect someone in a car. | Can you pick me up from the airport?
v | drop off | To take someone somewhere and leave them there. | I'll drop you off at the station.
p | Is breakfast included? | Asking if the hotel price includes breakfast. | Is breakfast included in the price?
p | Could you recommend a good place to eat? | Asking for a suggestion. | Could you recommend a good place to eat nearby?
p | How do I get to …? | Asking for directions. | Excuse me, how do I get to the museum?
p | window or aisle seat | A seat next to the window or next to the walkway. | Would you like a window or aisle seat?
i | off the beaten track | Far from where most tourists go. | We found a lovely village off the beaten track.
i | travel light | To travel with very little luggage. | I always travel light.
i | hit the road | To start a journey. | It's late — let's hit the road.
`
  ),
  pack(
    {
      id: 'restaurant-and-food',
      title: 'Restaurant & Food',
      description: 'Order, ask about dishes and talk about taste.',
      level: 'B1',
      emoji: '🍽️',
    },
    `
p | Can I get …? | A natural way to order something. | Can I get a chicken burger, please?
p | Could we have the bill, please? | Asking to pay at a restaurant. | Excuse me, could we have the bill, please?
p | Is this dish spicy? | Asking if food has a lot of chili. | Is this dish spicy?
p | I'm allergic to … | Telling staff about a food allergy. | I'm allergic to nuts.
p | for here or to go? | Will you eat in the restaurant or take the food away? | Is that for here or to go?
p | It's on me | I will pay. | Put your wallet away — it's on me.
p | Let's split the bill | Let's each pay part. | Let's split the bill.
w | starter | A small dish eaten before the main course. | We shared a starter.
w | main course | The biggest dish of a meal. | For the main course, I'll have the fish.
w | tip | Extra money given to a waiter for good service. | We left a 10% tip.
w | takeaway | Food bought from a restaurant to eat elsewhere. | Let's just get a takeaway tonight.
w | delicious | Tasting very good. | The soup was delicious.
w | bland | Without much flavour. | The pasta was a bit bland.
w | greasy | Containing too much oil. | I don't like greasy food.
w | portion | The amount of food for one person. | The portions here are huge.
w | leftovers | Food not eaten at a meal. | We had leftovers for lunch.
v | eat out | To eat in a restaurant. | We eat out every Friday.
v | order in | To have food delivered. | Let's order in tonight.
v | cut down on | To eat or use less of something. | I'm trying to cut down on sugar.
v | dig in | To start eating eagerly. | Dinner's ready — dig in!
i | a piece of cake | Very easy. | The test was a piece of cake.
i | have a sweet tooth | To love sweet food. | I have a terrible sweet tooth.
i | eat like a horse | To eat a lot. | My brother eats like a horse.
`
  ),
  pack(
    {
      id: 'health',
      title: 'Health & The Doctor',
      description: 'Describe symptoms and talk to a doctor or pharmacist.',
      level: 'B1',
      emoji: '🩺',
    },
    `
w | symptom | A sign of an illness. | What are your symptoms?
w | sore throat | Pain in the throat. | I've had a sore throat for two days.
w | headache | Pain in the head. | I have a terrible headache.
w | fever | A high body temperature. | She has a fever of 39 degrees.
w | dizzy | Feeling that everything is spinning. | I feel dizzy when I stand up.
w | prescription | A doctor's written order for medicine. | You need a prescription for this medicine.
w | side effect | An unwanted effect of a medicine. | Drowsiness is a common side effect.
w | appointment | An arranged time to see a doctor. | I'd like to make an appointment.
w | exhausted | Extremely tired. | I'm exhausted after the night shift.
w | injury | Physical harm to the body. | He has a knee injury.
w | painkiller | A medicine that reduces pain. | Take a painkiller for the headache.
w | check-up | A general medical examination. | I go for a check-up once a year.
v | come down with | To start to have an illness. | I think I'm coming down with the flu.
v | get over | To recover from an illness. | It took me a week to get over the cold.
v | throw up | To vomit. | He threw up after eating the fish.
v | pass out | To become unconscious. | She passed out in the heat.
v | work out | To exercise. | I work out three times a week.
p | I don't feel well | I feel ill. | I don't feel well — I'm going home.
p | It hurts when I … | Describing when you feel pain. | It hurts when I swallow.
p | How often should I take it? | Asking about medicine frequency. | How often should I take it?
i | under the weather | A little ill. | I'm feeling under the weather today.
i | as fit as a fiddle | Very healthy. | My grandfather is as fit as a fiddle.
i | back on my feet | Healthy again after an illness. | I'm back on my feet after the flu.
`
  ),
  pack(
    {
      id: 'tech-everyday',
      title: 'Tech Support & Everyday Tech',
      description: 'Explain technical problems — useful for tech-support call centers too.',
      level: 'B2',
      emoji: '💻',
    },
    `
w | device | A phone, computer or other electronic machine. | Which device are you using?
w | settings | The options you can change on a device or app. | Go to Settings and tap Wi-Fi.
w | update | A newer version of software. | Install the latest update.
w | password | A secret word used to log in. | I forgot my password.
w | browser | A program for using the internet, e.g. Chrome. | Try clearing your browser cache.
w | connection | A link to the internet or a network. | Your connection seems unstable.
w | router | A device that provides Wi-Fi at home. | Please restart your router.
w | error message | A message that says something went wrong. | What does the error message say?
w | glitch | A small, temporary technical problem. | It was just a glitch.
w | data plan | A mobile package for internet use. | You've used 80% of your data plan.
v | log in / log out | To enter / leave an account. | Please log out and log in again.
v | sign up | To create a new account. | Sign up with your email address.
v | turn off / turn on | To stop / start a device. | Turn it off and turn it on again.
v | plug in | To connect to electricity. | Make sure the cable is plugged in.
v | back up | To make a copy of data. | Always back up your photos.
v | reset | To return a device to its original settings. | Let's reset your password.
v | freeze | To stop working and not respond. | My laptop keeps freezing.
v | crash | To suddenly stop working (software). | The app crashed when I opened it.
p | Have you tried restarting it? | The classic first troubleshooting question. | Have you tried restarting it?
p | Can you see a green light on the router? | Asking the customer to check a status light. | Can you see a green light on the router?
p | Let's try clearing the cache | A common fix for app and browser problems. | Let's try clearing the cache and reloading the page.
p | Is the issue still occurring? | Asking if the problem continues. | After the restart, is the issue still occurring?
p | Walk me through what happened | Explain step by step. | Could you walk me through what happened?
`
  ),
  pack(
    {
      id: 'daily-routine',
      title: 'Daily Routine & Home',
      description: 'Describe your day, chores and life at home.',
      level: 'B1',
      emoji: '🏠',
    },
    `
v | wake up | To stop sleeping. | I wake up at 6 every day.
v | get up | To get out of bed. | I wake up early but I get up late.
v | oversleep | To sleep longer than you planned. | I overslept and missed the bus.
v | get ready | To prepare to go out. | It takes me 20 minutes to get ready.
v | do the dishes | To wash plates, cups, etc. | I'll do the dishes after dinner.
v | do the laundry | To wash clothes. | I do the laundry on Fridays.
v | tidy up | To make a place neat. | Tidy up your room, please.
v | run errands | To go out to do small jobs like shopping or paying bills. | I have some errands to run this afternoon.
v | commute | To travel regularly between home and work. | I commute by metro.
v | unwind | To relax after work. | I unwind by reading.
v | doze off | To fall asleep unintentionally. | I dozed off in front of the TV.
w | routine | The usual order in which you do things. | Exercise is part of my daily routine.
w | chores | Regular jobs at home, like cleaning. | We share the household chores.
w | rush hour | The busy time when people travel to or from work. | Avoid driving in rush hour.
w | nap | A short sleep during the day. | I took a quick nap after lunch.
w | groceries | Food and things for the home bought from a shop. | I picked up some groceries.
p | I'm a morning person | I feel most active in the morning. | I'm a morning person — I study best at 6 am.
p | I'm running late | I'm going to be late. | Sorry, I'm running late.
p | I'm exhausted | I'm very tired. | I'm exhausted after work.
i | burn the midnight oil | To work or study late at night. | I burned the midnight oil before the exam.
i | hit the sack | To go to bed. | I'm tired — I'm going to hit the sack.
i | rise and shine | Wake up and get up (said cheerfully). | Rise and shine! It's a beautiful day.
`
  ),
];

export function getPackById(id: string): TopicPack | undefined {
  return TOPIC_PACKS.find((p) => p.id === id);
}
