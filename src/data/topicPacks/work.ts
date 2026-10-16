/** Work & career topics, built with the course method (see ./types.ts). */
import { pack, type TopicPack } from './types';

export const WORK_PACKS: TopicPack[] = [
  pack(
    {
      id: 'call-center-interview',
      group: 'work',
      title: 'Call Center Interview',
      description: 'The qualities and experience call center recruiters ask about — and how to talk about them.',
      level: 'B2',
      emoji: '🎧',
      featured: true,
      warmUp: [
        'Have you ever called a customer service line? What made the agent good or bad?',
        'What do you think is the hardest part of working in a call center?',
      ],
      grammar: {
        title: 'Present perfect vs past simple for your experience',
        points: [
          { form: 'have/has + V3', use: 'Experience up to now, with no exact time.', example: 'I have handled hundreds of complaints.' },
          { form: 'past simple (V2)', use: 'A finished job or event with a time.', example: 'In 2023, I worked at a hotel reception.' },
          { form: 'have/has + V3 + for / since', use: 'Something that started in the past and is still true.', example: 'I have lived in Cairo since 2015.' },
        ],
        tip: 'Never use the present perfect with a finished time: “I worked there last year”, not “I have worked there last year”.',
      },
      discussion: [
        'Why do you want to work in customer service?',
        'What makes you a good fit for a customer-oriented role?',
        'How do you stay patient with a rude caller?',
        'How would you deal with a customer whose problem you can’t solve?',
        'Are you comfortable working rotating shifts and meeting targets?',
        'Tell me about a time you had to think on your feet.',
      ],
      task: {
        prompt: 'Answer “Tell me about yourself” as if you were in a real call center interview.',
        points: [
          'Your background (past simple)',
          'Your experience and skills (present perfect)',
          'Why you want this job',
          'One quality that makes you good with customers',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I graduated in 2023, and since then I have worked in two customer service roles. In my last job, I handled about sixty calls a day, and I always met my targets. I'm very customer-oriented: for me, customer satisfaction matters more than finishing the call quickly. I've learned that active listening and patience solve most problems. I'm comfortable with multitasking, troubleshooting simple technical issues and working rotating shifts. Most of all, I can think on my feet when a caller asks something unexpected.",
    },
    `
n | customer satisfaction | How happy customers are with a company's products or service. | My main goal is always customer satisfaction, not just closing the call.
adj | customer-oriented | Focused on understanding and meeting customers' needs. | I'm very customer-oriented; I always think about how the caller feels.
n | active listening | Listening carefully, showing that you understand and asking questions, instead of just waiting to speak. | Active listening helps me understand the real problem before I offer a solution.
n | patience | The ability to stay calm and not get annoyed when something takes a long time or someone is difficult. | Patience is the most important quality for this job, especially with angry callers.
n | multitasking | Doing several things at the same time. | Multitasking is essential: you talk to the customer while you update the system.
n | rotating shifts | Working hours that change regularly, for example from mornings to nights. | I'm comfortable working rotating shifts, including weekends.
n | target | A result you are expected to reach, such as a number of calls or sales. | In my last job, I always met my monthly targets.
n | KPI | Key performance indicator: a number a company uses to measure how well an employee or team is doing. | Average handling time is one of the main KPIs in a call center.
adj | articulate | Able to express ideas clearly and well in words. | Recruiters look for candidates who are articulate and easy to understand.
n | troubleshooting | Finding and fixing the cause of a problem step by step. | My technical background helps me with troubleshooting customers' internet problems.
pv | deal with | To take action to solve a problem, or to handle a person or situation. | I know how to deal with difficult customers without losing my temper.
i | think on your feet | To react quickly and well without having time to prepare. | In this job, you need to think on your feet when a customer asks something unexpected.
`
  ),
  pack(
    {
      id: 'call-center-on-the-call',
      group: 'work',
      title: 'Call Center: On the Call',
      description: 'What agents do on a call — verify, hold, transfer, escalate, resolve — and how to say it politely.',
      level: 'B2',
      emoji: '☎️',
      warmUp: [
        'When you call a company, what do you expect the agent to do in the first 30 seconds?',
        'What annoys you most when you are on hold?',
      ],
      grammar: {
        title: 'Polite requests and offers on the phone',
        points: [
          { form: 'Could you / Would you + base verb?', use: 'Polite requests.', example: 'Could you spell your last name, please?' },
          { form: 'Would you mind + V-ing?', use: 'Very polite requests (the answer “No” means “OK”).', example: 'Would you mind holding for a moment?' },
          { form: 'May I + base verb?', use: 'Asking for permission or information formally.', example: 'May I have your account number, please?' },
          { form: 'I’ll / Let me + base verb', use: 'Offers and decisions you make now.', example: 'Let me check that for you. · I’ll send you a confirmation.' },
        ],
        tip: 'After “Would you mind” use V-ing: “Would you mind waiting?”, not “Would you mind to wait?”.',
      },
      discussion: [
        'What makes a phone call with a company feel professional?',
        'Is it better to put a customer on hold or to call them back later?',
        'When should an agent escalate a problem?',
        'How do you explain a billing problem clearly to an upset customer?',
        'Why do companies open a ticket for every problem?',
        'Should agents follow up after a problem is resolved?',
      ],
      task: {
        prompt: 'Role-play a call about a billing error — you are the agent.',
        points: [
          'Greet the customer and verify their identity',
          'Ask two polite questions (Could you…? Would you mind…?)',
          'Explain what you will do (I’ll… / Let me…)',
          'Close the call professionally',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Thank you for calling. For security, could you please verify your date of birth? Thank you. Bear with me while I check your account. I can see an outstanding balance of three hundred pounds, but it looks like a billing error. I've opened a ticket for you, and our finance team will resolve it within 48 hours. Would you mind holding for a moment while I add a note? If anything goes wrong, I'll escalate it to my supervisor and follow up with you tomorrow. You'll receive a confirmation email shortly.",
    },
    `
v | verify | To check that information is correct, for example a customer's identity. | For security purposes, I need to verify your date of birth.
p | put someone on hold | To make a caller wait on the line while you do something. | May I put you on hold for a moment while I check your account?
v | transfer | To connect a caller to another person or department. | I'll transfer you to our billing department.
v | escalate | To pass a problem to someone with more authority because you cannot solve it yourself. | If I can't fix it, I'll escalate the issue to my supervisor.
n | ticket | A record a company creates for a customer's problem so that it can be tracked. | I've opened a ticket for you; your reference number is 4512.
v | resolve | To find a solution to a problem. | The technical team will resolve the issue within 24 hours.
n | billing | The process of sending customers bills and collecting payments. | I'm calling about a billing error on my last invoice.
n | inconvenience | Trouble or problems that annoy someone or cause difficulty. | I'm sorry for the inconvenience this has caused you.
n | confirmation | A message or document that proves something has been arranged or done. | You'll receive a confirmation email in a few minutes.
adj | outstanding | Not yet paid or dealt with. | You have an outstanding balance of three hundred pounds.
pv | follow up | To contact someone again to check progress or give more information. | I'll follow up with you tomorrow to make sure everything is working.
i | bear with me | Please be patient and wait while I do something. | Bear with me for a moment while I pull up your account.
`
  ),
  pack(
    {
      id: 'call-center-difficult-customers',
      group: 'work',
      title: 'Call Center: Difficult Customers',
      description: 'Calm angry callers, give bad news softly and move to a solution.',
      level: 'B2',
      emoji: '🧯',
      warmUp: [
        'Have you ever been really angry with a company? What did the agent do?',
        'What words make you feel calmer when you are upset?',
      ],
      grammar: {
        title: 'Softening bad news',
        points: [
          { form: 'I’m afraid + clause', use: 'Introduces bad news politely.', example: 'I’m afraid I can’t cancel the fee.' },
          { form: 'Unfortunately, + clause', use: 'Shows you are sorry about the situation.', example: 'Unfortunately, the item is out of stock.' },
          { form: 'I understand (that) …, but …', use: 'Accepts the customer’s feelings before explaining.', example: 'I understand that you’re upset, but the offer ended last week.' },
          { form: 'What I can do is + base verb', use: 'Moves from “no” to a solution.', example: 'What I can do is send a technician tomorrow morning.' },
        ],
        tip: 'Avoid “calm down” and “you must”: they make angry customers angrier.',
      },
      discussion: [
        'Why do customers become irate?',
        'Should an agent ever say “no” directly?',
        'What is the difference between a refund and compensation?',
        'When is a goodwill gesture a good idea for a company?',
        'Why shouldn’t you tell a customer to “calm down”?',
        'Have you ever bent over backwards to help someone who wasn’t grateful?',
      ],
      task: {
        prompt: 'Handle an irate customer whose order is two weeks late.',
        points: [
          'Acknowledge the problem and empathize',
          'Give the bad news softly (I’m afraid / unfortunately)',
          'Offer a solution (What I can do is…)',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "The customer was irate: his order was two weeks late, and he said our service was unacceptable. First, I acknowledged the problem and told him I really empathized with him. I'm afraid our policy doesn't allow a full refund after thirty days, but I understood he was upset. So I said, 'What I can do is offer you compensation: free delivery on your next three orders.' I also removed the late fee as a goodwill gesture. Little by little, I managed to de-escalate the call. We bent over backwards, and in the end, he thanked us.",
    },
    `
v | empathize | To understand and share someone else's feelings. | I really empathize with you; waiting three days is frustrating.
v | de-escalate | To make a tense situation calmer and less likely to get worse. | A calm voice helps to de-escalate an angry call.
v | acknowledge | To accept or say that something is true or exists. | First, acknowledge the customer's problem before you explain the policy.
n | complaint | A statement that something is wrong or not good enough. | I'm calling to make a complaint about your service.
n | policy | A set of rules that a company follows. | I'm afraid our policy doesn't allow refunds after 30 days.
n | refund | Money that is given back to you, for example when you return something. | We'll process your refund within five working days.
n | compensation | Money or something else given to someone because they have lost something or been treated badly. | As compensation, we'll give you one month free.
adj | irate | Extremely angry. | The irate customer shouted at me for five minutes.
n | goodwill gesture | Something a company gives a customer, although it doesn't have to, to keep a good relationship. | As a goodwill gesture, we've removed the late fee.
adj | unacceptable | Too bad to be allowed or accepted. | The customer said the delay was completely unacceptable.
pv | calm down | To become, or to make someone, less angry or upset. | Never tell an irate customer to calm down; it only makes them angrier.
i | bend over backwards | To try very hard to help someone. | We bent over backwards to fix his problem, but he still wasn't happy.
`
  ),
  pack(
    {
      id: 'job-interview',
      group: 'work',
      title: 'Job Interview',
      description: 'Talk about your strengths, achievements and goals with confidence.',
      level: 'B2',
      emoji: '💼',
      warmUp: [
        'What was your first job interview like?',
        'Which interview question do you find the hardest to answer?',
      ],
      grammar: {
        title: 'Verb + V-ing or verb + to',
        points: [
          { form: 'enjoy / avoid / be good at / be interested in + V-ing', use: 'Likes, skills and interests.', example: 'I enjoy solving problems.' },
          { form: 'want / hope / manage / decide + to + verb', use: 'Plans, wishes and results.', example: 'I managed to finish the project two weeks early.' },
          { form: 'look forward to + V-ing', use: 'Polite ending (here “to” is a preposition).', example: 'I look forward to hearing from you.' },
        ],
        tip: '“I look forward to hear from you” is a very common mistake — it’s “to hearing”.',
      },
      discussion: [
        'What is your greatest strength? Can you give an example?',
        'How can you talk about a weakness honestly but positively?',
        'What achievement are you most proud of?',
        'What transferable skills do you have from school or other jobs?',
        'Where do you see your career in five years?',
        'Is it rude to ask about salary in a first interview?',
      ],
      task: {
        prompt: 'Answer the question “Why should we hire you?”',
        points: [
          'Two strengths, each with an example',
          'One achievement',
          'Your career goal',
          'Use enjoy / manage / look forward to correctly',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Thank you for inviting me. My greatest strength is that I'm proactive: I enjoy finding problems before they happen. In my last job, I managed to reduce customer complaints by twenty percent, which is my biggest achievement. My weakness is that I sometimes take on too much, so I'm learning to prioritise. I'm reliable, and I have transferable skills from teaching, like presenting and organising. I have a one-month notice period, so I could hit the ground running in March. I look forward to hearing from you.",
    },
    `
n | strength | A good quality or ability that makes someone effective. | My greatest strength is that I learn new systems quickly.
n | weakness | A part of your character or skills that is not as good as it should be. | My weakness is that I sometimes take on too much work.
n | achievement | Something difficult that you have succeeded in doing. | My biggest achievement was reducing customer complaints by 20%.
adj | proactive | Taking action early to deal with problems before they happen. | I'm proactive; I don't wait for my manager to tell me what to do.
adj | reliable | Able to be trusted to do what you are expected to do. | My previous manager would tell you I'm reliable and always on time.
n | collaboration | Working together with other people to achieve something. | The project was successful because of good collaboration between teams.
n | transferable skills | Skills from one job or activity that are also useful in another. | Teaching gave me transferable skills like presenting and organizing.
n | career progression | Moving to higher and more responsible jobs over time. | I'm looking for a company that offers clear career progression.
n | salary expectations | The amount of pay you hope to get in a new job. | What are your salary expectations for this role?
n | notice period | The time you must keep working after you tell your employer you are leaving. | I have a one-month notice period at my current job.
pv | step up | To take more responsibility or make more effort when it is needed. | When my team leader was sick, I stepped up and ran the daily meetings.
i | hit the ground running | To start a new job or activity quickly and successfully, without needing time to learn. | With my experience, I can hit the ground running from day one.
`
  ),
  pack(
    {
      id: 'phone-and-email',
      group: 'work',
      title: 'Phone & Email English',
      description: 'Clear, polite English for calls, voicemails and work emails.',
      level: 'B2',
      emoji: '📧',
      warmUp: [
        'Do you prefer phone calls or emails at work? Why?',
        'What is the worst email mistake you have ever made — or seen?',
      ],
      grammar: {
        title: 'Indirect questions',
        points: [
          { form: 'Could you tell me + wh-word + subject + verb?', use: 'A more polite way to ask.', example: 'Could you tell me when the meeting starts?' },
          { form: 'Do you know if / whether + subject + verb?', use: 'Polite yes/no questions.', example: 'Do you know if the file has been sent?' },
          { form: 'I was wondering if + subject + could…', use: 'Very polite requests, common in emails.', example: 'I was wondering if you could send me the report.' },
        ],
        tip: 'No question word order after the opening: “Could you tell me where the office is?”, not “where is the office?”.',
      },
      discussion: [
        'When is a phone call better than an email?',
        'How formal should an email to your manager be?',
        'What makes a good subject line?',
        'How quickly should you get back to an urgent email?',
        'Is it rude not to answer a voicemail?',
        'Do you check your work emails on holiday?',
      ],
      task: {
        prompt: 'Leave a voicemail for a colleague you couldn’t reach.',
        points: [
          'Say who you are and why you are calling',
          'Ask two indirect questions',
          'Say what you will do next (get back to / forward / confirm)',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Hi Mona, it's Ali from customer service. I tried to call you, but I got your voicemail. I'm calling about tomorrow's client meeting. Could you tell me what time it starts? I also wanted to ask if you could confirm your availability on Thursday. It's a bit urgent, so I've forwarded you the client's email with the contract as an attachment. Please check that you're in the list of recipients. Let's touch base later today, and I'll get back to you with the final agenda.",
    },
    `
n | voicemail | A recorded message you leave when someone doesn't answer the phone, or the system that records it. | I left a voicemail, but she hasn't called me back yet.
n | attachment | A file that is sent with an email. | Please find the report in the attachment.
v | forward | To send an email you have received to another person. | I'll forward you the customer's email.
n | subject line | The short title of an email that tells the reader what it is about. | Write a clear subject line so people know what your email is about.
adj | urgent | Needing attention or action immediately. | This is urgent — please reply before 5 p.m.
n | reminder | A message that helps someone remember something. | I'll send a reminder the day before the meeting.
n | availability | The times when you are free to meet or talk. | Could you let me know your availability next week?
v | confirm | To say or write that something is definitely true or will definitely happen. | Could you confirm the time of the meeting?
n | recipient | A person who receives something, such as an email. | Check the recipient's name before you press send.
adj | formal | Suitable for serious or official situations. | Use formal language when you write to a client for the first time.
pv | get back to | To reply to someone later, usually with information they asked for. | I'll get back to you by the end of the day.
i | touch base | To contact someone briefly to talk or check how things are going. | Let's touch base on Thursday to see how the project is going.
`
  ),
  pack(
    {
      id: 'work-and-office',
      group: 'work',
      title: 'Work & Office',
      description: 'Workload, deadlines and balance — and how things change at work.',
      level: 'B2',
      emoji: '🏢',
      warmUp: [
        'Describe your ideal workplace in three words.',
        'Would you rather work from home or in an office? Why?',
      ],
      grammar: {
        title: 'used to · be used to · get used to',
        points: [
          { form: 'used to + base verb', use: 'A past habit or state that is not true now.', example: 'I used to work night shifts.' },
          { form: 'be used to + V-ing / noun', use: 'Something feels normal now.', example: 'I’m used to working under pressure.' },
          { form: 'get used to + V-ing / noun', use: 'Something is becoming normal.', example: 'I’m getting used to my new manager.' },
        ],
        tip: '“I am used to work” is wrong — after “be/get used to” use V-ing: “I am used to working”.',
      },
      discussion: [
        'How do you prioritize when everything is urgent?',
        'Is it hard for you to delegate? Why?',
        'How do you prefer to get feedback?',
        'What are the warning signs of burnout?',
        'Does remote working really improve work-life balance?',
        'What was hard to get used to in your first job?',
      ],
      task: {
        prompt: 'Describe a change in your work or studies.',
        points: [
          'What you used to do',
          'What you are used to now',
          'What you are still getting used to',
          'How you deal with your workload',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I used to work in an office, but last year our company moved to remote working. At first, I felt overwhelmed: my workload was heavy, the deadlines were tight, and I never knew when to stop. I wasn't used to working alone. Now I prioritize my tasks every morning and delegate small jobs to colleagues. My manager gives me useful feedback every Friday. I'm still getting used to switching off at six, but my work-life balance is much better. When I have a lot on my plate, I catch up on emails early in the morning.",
    },
    `
n | workload | The amount of work that a person has to do. | My workload doubles at the end of every month.
n | deadline | A time or date by which something must be finished. | We have a tight deadline, so we can't take a break today.
v | prioritize | To decide which tasks are most important and do them first. | When everything is urgent, I prioritize by deadline.
v | delegate | To give part of your work or responsibility to someone else. | A good manager knows how to delegate tasks.
n | colleague | A person that you work with. | My colleagues helped me a lot in my first week.
n | feedback | Comments about how well someone is doing, given to help them improve. | My supervisor gives me feedback after every project.
n | burnout | Extreme tiredness and loss of motivation caused by working too hard for too long. | After a year without a holiday, she suffered from burnout.
n | work-life balance | The right amount of time for work compared with time for family, friends and rest. | Working from home has improved my work-life balance.
n | remote working | Working from home or another place instead of the office. | Remote working saves me two hours of commuting every day.
adj | overwhelmed | Feeling that you have too much to deal with. | I felt overwhelmed in my first month because everything was new.
pv | catch up on | To do work or tasks that you didn't have time to do earlier. | I stayed late to catch up on my emails.
i | have a lot on your plate | To have a lot of work or problems to deal with. | I can't take on another project; I have a lot on my plate right now.
`
  ),
  pack(
    {
      id: 'meetings-and-discussions',
      group: 'work',
      title: 'Meetings & Discussions',
      description: 'Run a meeting, raise issues, reach a decision — and report what was said.',
      level: 'B2',
      emoji: '🗣️',
      warmUp: [
        'Do you think most meetings are useful or a waste of time?',
        'What is the best way to disagree with your boss?',
      ],
      grammar: {
        title: 'Reported speech',
        points: [
          { form: 'say (that) + one tense back', use: 'Reporting statements.', example: '“We will finish on Monday.” → She said they would finish on Monday.' },
          { form: 'tell + person + (that)', use: '“tell” needs a person.', example: 'He told us (that) the client was unhappy.' },
          { form: 'ask + wh-word / if + subject + verb', use: 'Reporting questions (normal word order).', example: '“When is the deadline?” → He asked when the deadline was.' },
          { form: 'ask + person + to + verb', use: 'Reporting requests.', example: '“Please send the report.” → She asked me to send the report.' },
        ],
        tip: '“He said me” is wrong: say “He told me” or “He said to me”.',
      },
      discussion: [
        'What makes a meeting productive?',
        'Is it better to reach a consensus or for the manager to decide alone?',
        'How do you politely bring up a problem in a meeting?',
        'What would you do if nobody followed the action points?',
        'When is it OK to postpone a meeting?',
        'How do you give constructive criticism without upsetting people?',
      ],
      task: {
        prompt: 'Report the last meeting or discussion you took part in.',
        points: [
          'What was on the agenda',
          'What people said (reported speech)',
          'What was decided',
          'The action points',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "In this morning's meeting, the first item on the agenda was the night shift. Sara brought up the problem of late calls and proposed hiring two new agents. Ahmed had an objection: he said the budget was too small. The manager asked him to clarify his numbers. After a long discussion, we reached a consensus and decided to postpone the final decision until Monday. Sara took the minutes, and the action points were clear. It was a constructive meeting, and now we're all on the same page.",
    },
    `
n | agenda | A list of the things to be discussed at a meeting. | The first item on the agenda is the new schedule.
v | propose | To suggest a plan or idea for people to consider. | I'd like to propose a new way to handle overtime.
n | consensus | Agreement among all or most of the people in a group. | We finally reached a consensus on the budget.
v | clarify | To make something clearer by explaining it in more detail. | Could you clarify what you mean by "as soon as possible"?
n | objection | A reason why you disagree with or don't approve of something. | Does anyone have any objections to moving the meeting to Monday?
n | action point | A task that someone agrees to do after a meeting. | Let's go over the action points before we finish.
v | postpone | To change an event to a later time or date. | We had to postpone the meeting because the manager was ill.
n | minutes | A written record of what was said and decided at a meeting. | Sara will take the minutes today.
adj | constructive | Helpful and intended to improve something. | Thank you for the constructive feedback.
v | chair | To lead a meeting or discussion and control how it runs. | Who's going to chair the meeting today?
pv | bring up | To start talking about a particular subject. | I'd like to bring up the problem of late payments.
i | on the same page | Agreeing about something or understanding it in the same way. | Before we start, let's make sure we're all on the same page.
`
  ),
  pack(
    {
      id: 'tech-everyday',
      group: 'work',
      title: 'Tech Support & Everyday Tech',
      description: 'Describe and fix technical problems — useful for tech-support call centers too.',
      level: 'B2',
      emoji: '💻',
      warmUp: [
        'What do you do first when your phone or laptop stops working?',
        'Have you ever helped an older relative with technology? How did it go?',
      ],
      grammar: {
        title: 'Giving instructions step by step',
        points: [
          { form: 'Imperative: base verb', use: 'Clear, direct steps.', example: 'Unplug the router and wait thirty seconds.' },
          { form: 'First, … Then, … After that, … Finally, …', use: 'Sequence the steps.', example: 'First, restart the app. Then, check for an update.' },
          { form: 'Once / As soon as + present simple', use: 'When one step depends on another.', example: 'Once the light turns green, try to connect again.' },
        ],
        tip: 'Use “please” and “could you” with customers: “Could you please restart your router?”.',
      },
      discussion: [
        'What is the most annoying tech problem you have had?',
        'Should companies explain problems in simple language or technical terms?',
        'Is it OK to give a customer a workaround instead of a real fix?',
        'How often do you install software updates? Why?',
        'Why do some people panic when technology stops working?',
        'Who in your family is the “tech support”?',
      ],
      task: {
        prompt: 'Help a customer whose internet keeps disconnecting.',
        points: [
          'Ask what is happening and since when',
          'Give 3–4 clear steps (first, then, once…)',
          'Offer a workaround if it still doesn’t work',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Thanks for calling technical support. So your connection is intermittent and your laptop keeps freezing? Let's troubleshoot it together. First, please check that the router is plugged in. Then, reboot it and wait two minutes. Once the lights are green, open the app again. If it still crashes, it may be a glitch in the old version, so please install the latest software update. Until the fix comes, here's a workaround: connect with a cable. I've also sent you a link for a password reset. Your router seems to be on the blink, so I'll book a technician.",
    },
    `
v | troubleshoot | To find and fix the cause of a problem in a system or machine. | Let's troubleshoot the problem step by step.
v | reboot | To turn a computer or device off and then on again. | Please reboot your router and wait two minutes.
v | crash | (of a computer or program) To suddenly stop working. | The app crashes every time I open the camera.
v | freeze | (of a computer or screen) To stop moving or responding. | My laptop keeps freezing when I play videos.
n | connectivity | The ability to connect to the internet or to another device. | We're experiencing connectivity issues in your area.
n | glitch | A small problem that stops something from working properly. | It was just a glitch; it's working fine now.
n | software update | A new version of a program that fixes problems or adds features. | Please install the latest software update.
n | password reset | Creating a new password when you have forgotten the old one. | I'll send you a link for a password reset.
adj | intermittent | Stopping and starting again; not continuous. | The customer reported an intermittent connection.
n | workaround | A temporary way of avoiding a problem until it is properly fixed. | Until the update comes, here's a workaround.
pv | plug in | To connect a device to the electricity supply or to another device. | Is the router plugged in?
i | on the blink | (informal, British) Not working properly. | My printer is on the blink again.
`
  ),
];
