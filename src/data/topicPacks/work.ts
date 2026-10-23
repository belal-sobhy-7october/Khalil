/** Work & career topics, built with the course method (see ./types.ts). */
import { pack, type TopicPack } from './types';

export const WORK_PACKS: TopicPack[] = [
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
      description: 'Describe and fix technical problems, at home and at work.',
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
  pack(
    {
      id: 'starting-a-business',
      group: 'work',
      title: 'Starting a Business',
      description: 'Turn an idea into a small business: funding, customers, competitors and risks.',
      level: 'B2',
      emoji: '🚀',
      warmUp: [
        'Would you rather work for a company or run your own business? Why?',
        'Do you know someone who started a business? How did it go?',
      ],
      grammar: {
        title: 'Future forms: plans, arrangements and decisions',
        points: [
          { form: 'be going to + base verb', use: 'A plan you have already decided on.', example: 'I’m going to open an online bakery next year.' },
          { form: 'present continuous', use: 'A fixed arrangement with a time, a place or other people.', example: 'We’re meeting an investor on Thursday.' },
          { form: 'will + base verb', use: 'A decision you make at the moment of speaking, or a promise.', example: 'Good idea — I’ll ask my cousin to design the logo.' },
          { form: 'present simple', use: 'Timetables and schedules.', example: 'The training course starts on the 1st of March.' },
        ],
        tip: 'Use “going to”, not “will”, for a plan you made earlier: “I’m going to open a shop in June.”',
      },
      discussion: [
        'Would you prefer to set up your own business or join a start-up? Why?',
        'What makes a successful entrepreneur: talent, hard work or luck?',
        'If you launched a product tomorrow, who would your target market be?',
        'Is it better to get funding from an investor or from your family? What are the risks?',
        'Why do so many new businesses fail in their first year?',
        'How can a small shop compete with a big competitor?',
      ],
      task: {
        prompt: 'Pitch your business idea in one minute.',
        points: [
          'What you are going to sell and why',
          'Your target market',
          'How you are going to get the funding',
          'One risk and how you will deal with it',
          'Your next step (present continuous for an arrangement)',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Next year, I'm going to set up a small business that delivers healthy lunches to offices. My target market is young employees who don't have time to cook. I've already written a business plan, and I'm meeting a possible investor on Sunday. It's risky, of course: there are a lot of competitors, and the profit margin on food is small. But I think we can launch with very little funding if we start in my mother's kitchen. If the first three months go well, I'll hire two drivers. I really believe we can get it off the ground.",
    },
    `
n | entrepreneur | A person who starts their own business, often taking financial risks. | My uncle became an entrepreneur after twenty years of working for other people.
n | start-up | A new, small company, often built around a new idea or technology. | She left her bank job to join a tech start-up in Cairo.
n | business plan | A document that explains what a business will do, how it will make money and what it needs to start. | The bank asked to see our business plan before it gave us a loan.
n | funding | Money that is given or lent to a business for a particular purpose. | We're looking for funding to open a second branch.
n | investor | A person or company that puts money into a business to make a profit later. | An investor offered us money in exchange for 20% of the company.
n | target market | The particular group of people that a business wants to sell to. | Our target market is university students who want cheap, healthy food.
n | profit margin | The difference between what something costs to make and the price it sells for. | Coffee shops have a high profit margin on drinks but a low one on food.
n | competitor | A company that sells similar products or services to the same customers. | Our main competitor is opening a shop on the same street.
v | launch | To start selling a new product or service, or to start a new business. | We plan to launch the app in September.
adj | risky | Involving the possibility that something bad will happen, such as losing money. | Quitting your job to start a business is risky, but it can pay off.
pv | set up | To start a company or an organisation. | It took us three months to set up the company legally.
i | get off the ground | (Of a plan or business) to start successfully. | With a small loan from my father, the business finally got off the ground.
`
  ),
  pack(
    {
      id: 'negotiation',
      group: 'work',
      title: 'Negotiating & Making Deals',
      description: 'Ask for a better price, a raise or more time — and reach a deal that works for both sides.',
      level: 'B2',
      emoji: '🤝',
      warmUp: [
        'When did you last negotiate something: a price, a salary or a deadline?',
        'Do you enjoy bargaining at the market, or do you hate it?',
      ],
      grammar: {
        title: 'Conditions for a deal: if, unless, as long as, provided that',
        points: [
          { form: 'if + present, will + base verb', use: 'A normal offer that depends on a condition.', example: 'If you order 500 units, we will give you a 10% discount.' },
          { form: 'unless + present (= if … not)', use: 'What happens if the condition is not met.', example: 'We can’t lower the price unless you pay in advance.' },
          { form: 'as long as / provided that + present', use: 'A strong condition: only if this happens.', example: 'I’ll accept the offer as long as I can work from home on Fridays.' },
          { form: 'If you could …, we would …', use: 'A softer, more polite offer.', example: 'If you could deliver by the 10th, we would sign today.' },
        ],
        tip: 'After “unless”, the verb is positive: “unless you pay”, not “unless you don’t pay”.',
      },
      discussion: [
        'Have you ever negotiated your salary? What happened?',
        'Is bargaining polite or rude in your culture? Where do people do it?',
        'What is non-negotiable for you in a job?',
        'When is it smart to back down, and when should you stand firm?',
        'How can you make a counteroffer without sounding rude?',
        'Describe a win-win situation you have seen at work or at home.',
      ],
      task: {
        prompt: 'Role-play: ask your manager for a raise.',
        points: [
          'What you want and why you deserve it',
          'One condition with “as long as” or “provided that”',
          'A concession you are willing to make',
          'How you would answer a counteroffer',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last month, I had to negotiate a new contract with a supplier. Their first offer was too expensive, so I made a counteroffer: we would sign for two years as long as they gave us a 10% discount. At first, they said the price was non-negotiable, and the talks almost reached a deadlock. Then we each made a concession. They agreed to better payment terms, and we agreed to a longer contract. Neither of us had to back down completely; we met each other halfway. In the end, it was a win-win situation, and we made the deal.",
    },
    `
v | negotiate | To discuss something formally in order to reach an agreement. | I negotiated a higher salary before I accepted the job.
n | deal | An agreement between two people or companies, especially in business. | After two hours of talks, we finally made a deal.
n | offer | An amount of money or the conditions that someone says they are willing to give. | They made us an offer, but it was too low.
n | counteroffer | A new offer that you make in reply to an offer you don't accept. | When they offered 10,000, we made a counteroffer of 12,000.
n | discount | An amount of money taken off the usual price. | The supplier gave us a 15% discount for paying in cash.
n | terms | The conditions of an agreement, such as the price, payment and dates. | We agreed on the price, but not on the payment terms.
n | concession | Something you agree to give or allow so that you can reach an agreement. | Both sides had to make concessions to close the deal.
n | deadlock | A situation in which neither side will change its position, so no agreement is possible. | The talks reached a deadlock over the delivery date.
adj | non-negotiable | Not open to discussion or change. | For me, working from home two days a week is non-negotiable.
n | win-win situation | A result that is good for everyone involved. | A longer contract at a lower price was a win-win situation.
pv | back down | To stop asking for something because the other side is too strong. | They refused to pay more, so in the end we had to back down.
i | meet someone halfway | To accept some of what someone wants so that you can agree. | You want 20 and I want 30, so let's meet halfway at 25.
`
  ),
  pack(
    {
      id: 'presentations',
      group: 'work',
      title: 'Presentations & Public Speaking',
      description: 'Open, organise and close a talk, answer questions and control your nerves.',
      level: 'B2',
      emoji: '🎤',
      warmUp: [
        'How do you feel when you have to speak in front of a group?',
        'Think of a great speaker you have watched. What made them good?',
      ],
      grammar: {
        title: 'Emphasis with “What …” and “It is … that …”',
        points: [
          { form: 'What + subject + verb + is / was …', use: 'Put your most important idea at the end, where people notice it.', example: 'What I want to show you today is how we cut costs by 20%.' },
          { form: 'What surprised me / happened + was …', use: 'Build up to a key fact or result.', example: 'What surprised us was how quickly customers changed.' },
          { form: 'The reason (why) … is that …', use: 'Give a reason with emphasis.', example: 'The reason we changed the plan is that the old one was too slow.' },
          { form: 'It is / was + … + that / who …', use: 'Stress one part of the sentence.', example: 'It was the sales team that made the difference.' },
        ],
        tip: 'Use them at key moments only: one or two sound powerful, ten sound strange.',
      },
      discussion: [
        'Do you suffer from stage fright? What helps you calm down?',
        'How much rehearsal do you need before an important talk?',
        'What makes a visual aid helpful, and what makes it boring?',
        'How can a speaker engage an audience in the first thirty seconds?',
        'Is it better to read from notes or to speak without them?',
        'How do you answer a question in a Q&A session when you don’t know the answer?',
      ],
      task: {
        prompt: 'Give the opening and the ending of a short presentation about your job or your studies.',
        points: [
          'A strong first sentence that engages the audience',
          'Your three key points',
          'One “What …” sentence for emphasis',
          'An ending that sums up',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I used to have terrible stage fright. Before every presentation, my hands shook and my mind went blank. What changed everything was rehearsal. Now I practise my talk three times, out loud, in front of a mirror. I keep my slides simple and use one visual aid for each key point. I start with a question to engage the audience, and I speak slowly and confidently. At the end, I sum up the main ideas in one sentence. The Q&A session still makes me a little nervous, but I know I can get my point across.",
    },
    `
n | audience | The group of people who watch or listen to a talk or a performance. | Know your audience before you prepare your slides.
n | public speaking | The activity of speaking to a group of people. | Public speaking used to terrify me, but practice helped.
n | stage fright | Nervousness before or during a talk or performance in front of people. | My hands were shaking from stage fright before the presentation.
n | visual aid | A picture, chart or video that helps people understand a talk. | A simple chart is a better visual aid than a slide full of text.
n | key point | One of the most important ideas in a talk or an argument. | Repeat your key points at the end so the audience remembers them.
n | rehearsal | A practice of a talk or performance before the real event. | We did a full rehearsal the night before the meeting.
v | engage | To attract someone's interest and keep their attention. | Starting with a question is a great way to engage the audience.
adj | concise | Short and clear, using no more words than necessary. | Keep your introduction concise: no more than one minute.
n | Q&A session | The part of a talk when the audience can ask questions. | I was more nervous about the Q&A session than the presentation itself.
adv | confidently | In a way that shows you are sure of yourself and your abilities. | She walked onto the stage and spoke confidently, without notes.
pv | sum up | To repeat the most important ideas briefly at the end. | To sum up, we need more staff, a bigger budget and more time.
i | get your point across | To make people understand what you mean. | Use simple examples to get your point across.
`
  ),
  pack(
    {
      id: 'leadership-and-teamwork',
      group: 'work',
      title: 'Leadership & Teamwork',
      description: 'Good and bad managers, working in a team and solving problems together.',
      level: 'B2',
      emoji: '🧭',
      warmUp: [
        'Think of the best manager or teacher you have had. What made them special?',
        'Do you prefer working alone or in a team? Why?',
      ],
      grammar: {
        title: 'make, let, allow and encourage',
        points: [
          { form: 'make + someone + base verb', use: 'Force someone to do something.', example: 'My old boss made us stay late every Thursday.' },
          { form: 'let + someone + base verb', use: 'Give someone permission (informal).', example: 'Our manager lets us choose our own projects.' },
          { form: 'allow / encourage / expect + someone + to + verb', use: 'Permission, support or expectations (more formal).', example: 'A good leader encourages people to share their ideas.' },
          { form: 'be made / be allowed + to + verb', use: 'The same ideas in the passive, from the worker’s point of view.', example: 'We were made to work at weekends, and we weren’t allowed to work from home.' },
        ],
        tip: 'No “to” after “make” and “let” in the active: “She made me laugh”, not “She made me to laugh”.',
      },
      discussion: [
        'Are leaders born or made?',
        'What does a manager do that destroys team morale?',
        'Why do some managers micromanage? How would you deal with one?',
        'What would you do if a colleague didn’t pull their weight?',
        'Should a leader take the credit when the team succeeds? Why or why not?',
        'Who is your role model at work or in life, and why?',
      ],
      task: {
        prompt: 'Describe the best (or the worst) manager you have had.',
        points: [
          'What they made you do and what they let you do',
          'How they motivated the team (or didn’t)',
          'A time they stepped in to solve a problem',
          'What you learned about leadership from them',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "The best manager I ever had was a real role model. She didn't micromanage; she let us decide how to do our work, but she expected everyone to pull their weight. She was very hands-on: when we were busy, she answered calls with us. She always gave the team credit for every success, so morale was high. When two of us had an argument, she stepped in calmly and made us listen to each other. Her leadership was inspiring, and she motivated me to become a team leader myself.",
    },
    `
n | leadership | The ability to guide and inspire a group of people. | Good leadership means listening as much as giving orders.
n | team player | A person who works well with others to reach a shared goal. | We need a team player, not someone who wants all the credit.
v | motivate | To make someone want to do something, especially to work hard. | She motivates her team with clear goals and honest praise.
v | micromanage | To control every small detail of other people's work. | I hate it when managers micromanage; it shows they don't trust you.
n | morale | The level of confidence and enthusiasm in a group of people. | Team morale dropped after the salary cuts.
n | credit | Praise or recognition for something good that you have done. | A good leader gives the team the credit for its success.
adj | inspiring | Making people feel excited and want to do something. | Our CEO gave an inspiring speech about the company's future.
n | decision-making | The process of thinking about a problem and choosing what to do. | Fast decision-making is important in a crisis.
n | role model | A person whose behaviour other people want to copy. | My first manager was my role model: calm, fair and always prepared.
adj | hands-on | Taking an active part in the work, not just giving instructions. | He's a hands-on manager who helps us when we're busy.
pv | step in | To get involved in a difficult situation to help or to stop a problem. | When two colleagues started arguing, our team leader stepped in.
i | pull your weight | To do your fair share of the work. | Everyone has to pull their weight, or the project will fail.
`
  ),
  pack(
    {
      id: 'remote-work-and-freelancing',
      group: 'work',
      title: 'Remote Work & Freelancing',
      description: 'Working from home, finding clients online and managing your own time and money.',
      level: 'B2',
      emoji: '💻',
      warmUp: [
        'Could you do your job from home? Would you want to?',
        'What do you think freelancers love and hate about their work?',
      ],
      grammar: {
        title: 'Present simple vs present continuous: routines and temporary situations',
        points: [
          { form: 'present simple', use: 'Routines, habits and permanent facts.', example: 'I usually start work at nine and finish at five.' },
          { form: 'present continuous', use: 'Actions happening now or around now, and temporary situations.', example: 'This month I’m working on a website for a client in Dubai.' },
          { form: 'always + present continuous', use: 'A habit that annoys you.', example: 'My neighbour is always drilling when I have a video call!' },
          { form: 'state verbs: know, need, prefer, belong', use: 'Verbs for states, not actions, are not used with -ing.', example: 'I prefer working alone. (not: I am preferring)' },
        ],
        tip: '“I work from home” is your normal routine; “I’m working from home this week” is temporary.',
      },
      discussion: [
        'Do you think remote work will replace offices completely?',
        'Would you prefer a stable salary or the freedom of being your own boss?',
        'How do freelancers find their first clients?',
        'What do people miss when they work from home?',
        'How can you avoid feeling isolated when you work alone?',
        'Is it a good idea to take on every project you are offered? Why or why not?',
      ],
      task: {
        prompt: 'Describe your ideal working week as a freelancer or a remote worker.',
        points: [
          'Your routine (present simple)',
          'What you are working on these days (present continuous)',
          'Two advantages and one disadvantage',
          'How you would find clients',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I've been self-employed for two years now. I work as a freelance translator, and I usually start at eight, before my clients in Europe wake up. Working with people in another time zone isn't always easy, but I love having flexible hours and no commute. This month, I'm working on a big project for a client in Germany, so I'm not taking on anything new. Every Friday, I send my invoices and update my portfolio. My income isn't always stable, and sometimes I feel isolated. Still, being my own boss is worth it.",
    },
    `
n | freelancer | A person who works for different clients and is not a permanent employee of any company. | As a freelancer, I choose my own projects and hours.
n | client | A person or company that pays for a professional service. | I have three regular clients, and one of them is in Germany.
adj | self-employed | Working for yourself rather than for an employer. | Being self-employed means nobody pays you when you're sick.
n | flexible hours | Working hours that you can choose or change. | Flexible hours let me take my kids to school.
n | commute | The journey between your home and your workplace. | Working from home saved me a two-hour commute every day.
n | time zone | One of the areas of the world that has its own time. | My client is in a different time zone, so our meetings are at 7 p.m.
n | portfolio | A collection of examples of your work that you show to clients or employers. | Put your best designs in your portfolio.
n | invoice | A document that lists the work done and how much the client must pay. | I send each client an invoice at the end of the month.
n | income | The money you receive regularly, for example for your work. | My income changes a lot from month to month.
adj | isolated | Alone and without much contact with other people. | Working from home all week can make you feel isolated.
pv | take on | To accept some work or a responsibility. | I took on too many projects last month and hardly slept.
i | be your own boss | To work for yourself and make your own decisions. | I love being my own boss, but I miss having colleagues.
`
  ),
  pack(
    {
      id: 'time-management',
      group: 'work',
      title: 'Time Management & Productivity',
      description: 'Plan your day, stop wasting time and say what you will have done by when.',
      level: 'B2',
      emoji: '⏰',
      warmUp: [
        'Are you an early bird or a night owl? When do you work best?',
        'What wastes most of your time every day?',
      ],
      grammar: {
        title: 'Future continuous and future perfect',
        points: [
          { form: 'will be + V-ing', use: 'An action in progress at a time in the future.', example: 'This time tomorrow, I’ll be sitting my exam.' },
          { form: 'will have + V3', use: 'An action that will be finished before a time in the future.', example: 'By Friday, I’ll have finished the report.' },
          { form: 'by + time / by the time + present simple', use: 'The deadline for the future perfect.', example: 'By the time you get home, I’ll have cooked dinner.' },
        ],
        tip: 'After “by the time”, use the present simple, not “will”: “by the time you arrive”.',
      },
      discussion: [
        'Do you write a to-do list? Does it help you?',
        'What is your biggest distraction, and how could you remove it?',
        'What do you usually put off, and why?',
        'What will you have achieved by this time next year?',
        'Is it possible to be too productive? When does it become unhealthy?',
        'Which time-waster would you remove from your life first?',
      ],
      task: {
        prompt: 'Talk about your plan for next week.',
        points: [
          'Your top priority',
          'What you will be doing at a certain time (future continuous)',
          'What you will have finished by Friday (future perfect)',
          'A task you usually put off and how you will stop',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I used to put off everything until the last minute, so my productivity was terrible. Now I have a simple routine. Every evening, I write a to-do list and choose one top priority for the next day. I schedule the hardest task for the morning, when I'm most productive, and I leave my phone in another room because it's my biggest distraction. I also listen to podcasts on the metro, so I kill two birds with one stone. This time next month, I'll be studying for my exam, and by June, I'll have finished the whole course.",
    },
    `
n | productivity | How much useful work someone does in a period of time. | Turning off my phone doubled my productivity.
n | to-do list | A list of the tasks you need to do. | I write a to-do list every night for the next day.
n | time management | The ability to plan your time and use it well. | Good time management is the secret to studying while you work.
n | distraction | Something that takes your attention away from what you are doing. | Social media is my biggest distraction when I study.
n | routine | The usual order in which you do things every day. | My morning routine starts with a glass of water and a short walk.
n | priority | Something important that you deal with before other things. | My top priority this week is finishing the project.
adj | productive | Achieving a lot in a period of time. | I'm most productive early in the morning.
v | schedule | To plan that something will happen at a particular time. | I schedule my hardest tasks for the morning.
n | time-waster | An activity that uses time without achieving anything useful. | Long meetings with no agenda are a real time-waster.
adv | efficiently | In a way that gets good results without wasting time or effort. | If you work efficiently, you can finish by four.
pv | put off | To delay doing something until later. | I always put off boring tasks until the last minute.
i | kill two birds with one stone | To achieve two things with one action. | I practise English on the bus, so I kill two birds with one stone.
`
  ),
];
