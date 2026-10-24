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
        "Thank you for inviting me. My greatest strength is that I'm proactive: I enjoy finding problems before they happen. In my last job, I managed to reduce customer complaints by twenty percent, which is my biggest achievement. My weakness is that I sometimes take on too much, so I'm learning to prioritize. I'm reliable, and I have transferable skills from teaching, like presenting and organizing. I have a one-month notice period, so I could hit the ground running in March. I look forward to hearing from you.",
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
        'Do you check your work emails on vacation?',
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
n | burnout | Extreme tiredness and loss of motivation caused by working too hard for too long. | After a year without a vacation, she suffered from burnout.
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
        "Thanks for calling technical support. So your connection is intermittent and your laptop keeps freezing? Let's troubleshoot it together. First, please check that the router is plugged in. Then, reboot it and wait two minutes. Once the lights are green, open the app again. If it still crashes, it may be a glitch in the old version, so please install the latest software update. Until the fix comes, here's a workaround: connect with a cable. I've also sent you a link for a password reset. Your router seems to be on the fritz, so I'll book a technician.",
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
i | on the fritz | (informal) Not working properly. | My printer is on the fritz again.
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
pv | set up | To start a company or an organization. | It took us three months to set up the company legally.
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
      description: 'Open, organize and close a talk, answer questions and control your nerves.',
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
        "I used to have terrible stage fright. Before every presentation, my hands shook and my mind went blank. What changed everything was rehearsal. Now I practice my talk three times, out loud, in front of a mirror. I keep my slides simple and use one visual aid for each key point. I start with a question to engage the audience, and I speak slowly and confidently. At the end, I sum up the main ideas in one sentence. The Q&A session still makes me a little nervous, but I know I can get my point across.",
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
          { form: 'be made / be allowed + to + verb', use: 'The same ideas in the passive, from the worker’s point of view.', example: 'We were made to work on weekends, and we weren’t allowed to work from home.' },
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
n | role model | A person whose behavior other people want to copy. | My first manager was my role model: calm, fair and always prepared.
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
          { form: 'always + present continuous', use: 'A habit that annoys you.', example: 'My neighbor is always drilling when I have a video call!' },
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
i | kill two birds with one stone | To achieve two things with one action. | I practice English on the bus, so I kill two birds with one stone.
`
  ),
  pack(
    {
      id: 'university-life',
      group: 'work',
      title: 'School, College & University Life',
      description: 'Talk about campus life, classes and professors, and what you do outside the classroom.',
      level: 'B1',
      emoji: '🎓',
      warmUp: [
        'What do you miss most about school or college?',
        'Did you live at home or in a dorm while you studied?',
      ],
      grammar: {
        title: 'just, already and yet',
        points: [
          { form: 'have just + past participle', use: 'Something that happened a very short time ago.', example: 'I’ve just finished my last exam!' },
          { form: 'have already + past participle', use: 'Something that happened before now, maybe sooner than expected.', example: 'I’ve already paid the tuition for this semester.' },
          { form: 'haven’t + past participle + yet · Have you … yet?', use: 'Something expected that hasn’t happened (in negatives and questions).', example: 'I haven’t chosen my major yet. · Have you registered yet?' },
        ],
        tip: 'Put yet at the end of the sentence, and just and already between have and the past participle. In American English you’ll also hear the past simple (“Did you register yet?”), but the present perfect is always correct.',
      },
      discussion: [
        'What was your first week on campus like?',
        'What makes a professor great, and what makes a lecture boring?',
        'Is the tuition at private universities in Egypt worth the money?',
        'How did you choose your major? Would you choose it again?',
        'Have you ever applied for a scholarship? What happened?',
        'Which extracurricular activities help students most in their careers?',
        'Is it ever a good idea to drop out of college? Think of famous examples.',
      ],
      task: {
        prompt: 'Describe your college or school days to a new student.',
        points: [
          'Your campus and your daily schedule',
          'A professor or a lecture you remember',
          'Something you have already done, and something you haven’t done yet',
          'Advice about extracurricular activities',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I'm a junior at Cairo University, and I've just started my second semester this year. The campus is huge, and as a freshman, I got lost every day. My first lecture is at eight, and the professor is so strict that he locks the door at 8:05. My tuition is low because it's a public university, but I've already applied for a scholarship to study abroad for a semester. I haven't heard back yet, so I'm hitting the books to keep my GPA high. I don't live in a dorm; I take the metro from Helwan every day. I've also signed up for the debate club, which is my favorite extracurricular activity. A friend of mine dropped out last year to start a business, but I want to finish my degree first.",
    },
    `
n | campus | The land and buildings of a college or university. | Our campus has a huge library and three cafeterias.
n | freshman | A student in their first year of high school or college (American English). | As a freshman, I didn't know where any of the buildings were.
n | semester | One of the two main periods that the school year is divided into. | I'm taking five courses this semester.
n | lecture | A talk that a professor gives to a large group of students. | The lecture was in a hall with 500 students.
n | professor | A teacher at a college or university (in American English, any college teacher). | My professor answers emails within an hour.
n | tuition | The money you pay to study at a school, a college or a university. | Tuition at private universities can be over 100,000 pounds a year.
n | scholarship | Money given to a student, often for good grades, to pay for their studies. | She won a scholarship to study in Germany.
n | dorm | A building where college students live (short for dormitory). | I shared a dorm room with two students from Upper Egypt.
n | GPA | Grade point average: a number that shows a student's average grade (American English). | You need a GPA of 3.5 to get this scholarship.
adj | extracurricular | Done at school or college but not part of the classes, such as sports or clubs. | Extracurricular activities look great on a résumé.
pv | drop out | To leave school or college before you finish your studies. | He dropped out of college to start his own company.
pv | sign up for | To put your name on a list to join a course or an activity. | I signed up for the drama club.
i | hit the books | To study hard (informal). | Finals start next week, so I need to hit the books.
`
  ),
  pack(
    {
      id: 'exams-and-projects',
      group: 'work',
      title: 'Exams, Assignments & Projects',
      description: 'Talk about deadlines, studying for exams, group projects and grades.',
      level: 'B1',
      emoji: '📝',
      warmUp: [
        'Do you study better a little every day or all at the last minute?',
        'What is the hardest exam you have ever taken?',
      ],
      grammar: {
        title: 'Past obligation: had to, didn’t have to, needed to',
        points: [
          { form: 'had to + base verb', use: 'Something that was necessary in the past (the past of must and have to).', example: 'I had to submit the project by midnight.' },
          { form: 'didn’t have to + base verb', use: 'Something that wasn’t necessary.', example: 'We didn’t have to take the final because our grades were high.' },
          { form: 'needed to · didn’t need to + base verb', use: 'The same meanings, a little softer.', example: 'I needed to proofread the essay twice.' },
          { form: 'Did you have to + base verb …?', use: 'Questions.', example: 'Did you have to retake the exam?' },
        ],
        tip: 'must has no past form: say “I had to study”, not “I must studied”.',
      },
      discussion: [
        'Have you ever crammed the night before an exam? Did it work?',
        'Are multiple-choice exams fair, or do they reward guessing?',
        'Why do some students fall behind, and how can teachers help?',
        'Is plagiarism a bigger problem now that AI can write essays?',
        'Do you enjoy group projects, or do you end up doing all the work?',
        'Should students be allowed to retake an exam to get a better grade?',
        'What did you have to do to pass your hardest exam?',
      ],
      task: {
        prompt: 'Tell the story of a difficult assignment or exam.',
        points: [
          'What you had to do, and by when',
          'A problem you faced (falling behind, a lazy group member…)',
          'What you did to finish',
          'The grade you got and what you learned',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last semester, I had a group project worth forty percent of my grade. We had to submit a twenty-page report and give a presentation. One member didn't do anything, so the rest of us fell behind. Two days before the deadline, we asked the professor for an extension, but she said no. So I had to cram all the research into one weekend. I proofread every page and checked that nothing looked like plagiarism. We handed it in at 11:58 at night, two minutes before the deadline! In the end, we passed with flying colors, and I didn't have to retake the course.",
    },
    `
n | assignment | A piece of work that a student is given to do, such as an essay or a report. | Our English assignment is a 500-word essay about a hero.
v | submit | To give your work to a teacher or a person in authority, often online. | You must submit the report through the website by Friday.
n | plagiarism | Copying someone else's work or ideas and pretending they are yours. | The professor uses software to check for plagiarism.
v | cram | To study a lot in a very short time just before an exam. | I crammed all night and forgot everything the next week.
n | grade | A letter or a number that shows how good a student's work is (in British English, a mark). | I got the highest grade in the class.
n | group project | A piece of schoolwork that several students do together. | In every group project, one person does most of the work.
v | proofread | To read a text carefully to find and correct mistakes. | Always proofread your essay before you submit it.
adj | multiple-choice | Describing a question or a test where you choose the answer from several options. | The final exam has fifty multiple-choice questions.
v | retake | To take an exam or a course again because you failed it or want a better grade. | I had to retake statistics in the summer.
n | extension | Extra time that you are given to finish your work. | The teacher gave me a one-week extension because I was sick.
pv | hand in | To give a piece of work to a teacher. | Hand in your homework at the start of the class.
pv | fall behind | To fail to do as much work as you should by a certain time. | I was sick for two weeks and fell behind in math.
i | pass with flying colors | To pass a test or an exam easily and with a high grade. | She passed her driving test with flying colors.
`
  ),
  pack(
    {
      id: 'learning-languages',
      group: 'work',
      title: 'Learning Languages & Pronunciation',
      description: 'Talk about how you learn a language, your accent and the problems every learner has.',
      level: 'B2',
      emoji: '🗣️',
      warmUp: [
        'Why are you learning English?',
        'Which English word do you always find hard to pronounce?',
      ],
      grammar: {
        title: 'Separable and inseparable phrasal verbs',
        points: [
          { form: 'verb + particle + object · verb + object + particle', use: 'Separable: the object can go in the middle or at the end.', example: 'I looked up the word. · I looked the word up.' },
          { form: 'verb + it / them / him + particle', use: 'With a pronoun, the pronoun MUST go in the middle.', example: 'I looked it up. (not: I looked up it.)' },
          { form: 'verb + particle + object (never separated)', use: 'Inseparable: the object always comes after the particle.', example: 'I came across a great podcast. · She takes after her mother.' },
        ],
        tip: 'A dictionary shows separable verbs with something in the middle (pick something up) and inseparable ones with it at the end (come across something).',
      },
      discussion: [
        'How did you pick up most of your English: at school, from movies or at work?',
        'Is it important to sound like a native speaker, or is a clear accent enough?',
        'What English slang have you come across that confused you?',
        'Which is harder for Arabic speakers: word stress or intonation?',
        'Do you memorize lists of words, or learn them in context?',
        'Have you ever been at a loss for words in English? What happened?',
        'Does your English get rusty when you stop using it? How fast?',
      ],
      task: {
        prompt: 'Describe how you learn English and what you want to improve.',
        points: [
          'How you picked up English so far',
          'What is hardest for you (accent, word stress, slang…)',
          'Two phrasal verbs, one with a pronoun in the middle',
          'Your plan for the next month',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Arabic is my mother tongue, and I picked up most of my English from American TV shows. At school, we had to memorize grammar rules, but nobody taught us intonation or word stress. When I started working in a call center, I was at a loss for words on my first calls, and my English felt rusty. A colleague told me to listen to podcasts and copy native speakers. When I come across a new word, I look it up and repeat it out loud ten times. I'm not trying to lose my accent completely; I just want people to understand me easily. I'm not fluent yet, but I'm getting better every week. Practice makes perfect.",
    },
    `
adj | fluent | Able to speak a language easily and well. | After a year in London, my cousin became fluent in English.
n | accent | The way a person pronounces words, which shows where they come from. | She has a slight Egyptian accent, but she's very clear.
n | native speaker | A person who has spoken a language since they were a baby. | Practicing with native speakers helped my listening.
n | mother tongue | The first language that you learned as a child. | My mother tongue is Arabic, but sometimes I dream in English.
n | slang | Very informal words that are used by a particular group of people, especially young people. | American teenagers use a lot of slang that isn't in textbooks.
v | memorize | To learn something so that you can remember it exactly. | I memorize ten new words every morning on the metro.
n | intonation | The way your voice goes up and down when you speak. | Rising intonation at the end can turn a sentence into a question.
n | word stress | The part of a word that you say more strongly than the others. | The word stress in "photography" is on the second syllable.
adj | rusty | Not as good as before because you haven't practiced for a long time. | My French is rusty; I haven't spoken it since school.
pv | pick up | To learn a language or a skill by being around it, without formal lessons. | Kids pick up languages much faster than adults.
pv | come across | To find or meet something by chance. | I came across a great pronunciation channel on YouTube.
i | practice makes perfect | If you do something regularly, you become very good at it. | My pronunciation is getting better; practice makes perfect.
i | at a loss for words | So surprised or upset that you don't know what to say. | When she asked me a question in front of everyone, I was at a loss for words.
`
  ),
  pack(
    {
      id: 'career-plans',
      group: 'work',
      title: 'Career Plans & Professional Goals',
      description: 'Talk about where you want your career to go and the steps to get there.',
      level: 'B2',
      emoji: '🧑‍💼',
      warmUp: [
        'Where do you see yourself in five years?',
        'Who has helped you most in your career or your studies?',
      ],
      grammar: {
        title: 'Intentions: aim to, intend to, plan on, hope to',
        points: [
          { form: 'plan to + base verb · plan on + V-ing', use: 'Saying what you have decided to do.', example: 'I’m planning on applying for a promotion next year.' },
          { form: 'intend to · aim to + base verb', use: 'More formal; good for interviews and LinkedIn.', example: 'I aim to become a team leader within two years.' },
          { form: 'hope to · would like to + base verb', use: 'Something you want but aren’t sure about.', example: 'I hope to work abroad one day.' },
          { form: 'be thinking of / about + V-ing', use: 'A plan that isn’t decided yet.', example: 'I’m thinking of changing careers.' },
        ],
        tip: 'Use to + base verb after aim, intend, hope and plan, but V-ing after plan on and thinking of: “I plan on studying”, not “I plan on study”.',
      },
      discussion: [
        'What does a clear career path look like in your field?',
        'Is it better to specialize early or to try many different jobs?',
        'How important is a mentor? Have you had one?',
        'Would you take an entry-level job in a field you love or a better-paid job you don’t like?',
        'Is job satisfaction more important than salary? Why?',
        'Which skills do you need to upskill in for your next job?',
        'When is the right time for a career change?',
      ],
      task: {
        prompt: 'Present your five-year career plan.',
        points: [
          'Where you are now',
          'Two steps you plan on taking (aim to, intend to…)',
          'A skill you want to upskill in',
          'Who could mentor you',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I started in an entry-level job at a call center three years ago, but I don't want to stay there forever. My career path is clear in my head: I aim to become a quality analyst and then a training manager. To get a promotion, I need more qualifications, so I'm planning on taking a training course online. I also want to upskill in data analysis, because every company needs it now. My team leader has become my mentor, and she says I should specialize instead of trying everything. Still, I'm thinking of branching out into HR one day. Job satisfaction matters to me more than money, but I hope to climb the career ladder too. An internship got my foot in the door, and now I want to walk all the way in.",
    },
    `
n | promotion | A move to a higher position in a company, usually with more money. | She got a promotion to team leader after one year.
n | career path | The series of jobs you do as you move forward in your working life. | My career path started in sales and moved to marketing.
n | mentor | An experienced person who advises and helps someone with less experience. | My mentor helped me prepare for my first big presentation.
v | specialize | To become an expert in one particular area of work or study. | He decided to specialize in children's dentistry.
n | career change | A move to a completely different kind of work. | At thirty-five, he made a career change from banking to teaching.
n | job satisfaction | The feeling of enjoying your work and being happy with it. | Teachers often have high job satisfaction but low pay.
adj | entry-level | Describing a job for people with little or no experience. | Most graduates start in entry-level positions.
n | qualification | An official certificate or degree that shows you have the training for a job. | You need a nursing qualification to work in a hospital.
v | upskill | To learn new skills, especially for your work. | Many companies pay for their staff to upskill online.
i | climb the career ladder | To move up to better jobs, one step at a time. | He climbed the career ladder from waiter to hotel manager.
pv | branch out | To start doing something new, in addition to what you already do. | The company started with phones and then branched out into laptops.
i | get your foot in the door | To get a first job or a first chance in a company or a field that could lead to more. | I took an unpaid job to get my foot in the door at the TV channel.
n | internship | A period of work, often short and low-paid, that gives a student or a graduate experience. | I did a summer internship at a bank.
`
  ),
  pack(
    {
      id: 'job-hunting',
      group: 'work',
      title: 'Job Hunting, Résumés & LinkedIn',
      description: 'Look for a job, write a résumé and a cover letter, and follow up with recruiters.',
      level: 'B2',
      emoji: '📄',
      warmUp: [
        'How did you find your first job?',
        'Is LinkedIn popular among the people you know?',
      ],
      grammar: {
        title: 'Past simple vs present perfect: talking about your experience',
        points: [
          { form: 'past simple + a finished time', use: 'Jobs and achievements in a finished period (a job you left, a year).', example: 'In 2022, I trained twenty new agents.' },
          { form: 'have/has + past participle', use: 'Experience up to now, without a finished time.', example: 'I’ve worked with international clients for three years.' },
          { form: 'past simple for an old job · present perfect for your current one', use: 'Your old job compared with your job now.', example: 'At my last company, I handled complaints. · At my current company, I’ve increased sales by 15 percent.' },
        ],
        tip: 'On a résumé, describe past jobs with past simple action verbs: “Managed a team of five”, “Increased sales by 20%”, not “Responsible for…”.',
      },
      discussion: [
        'What makes a résumé stand out from the crowd?',
        'Is a cover letter still useful, or does nobody read it?',
        'How do you choose the right keywords for a job posting?',
        'Have you ever been contacted by a headhunter or a recruiter? What happened?',
        'How long should you wait before you follow up after applying?',
        'Why do so many companies never let applicants hear back?',
        'Is it harder for job seekers in Egypt today than ten years ago?',
      ],
      task: {
        prompt: 'Tell a recruiter about your experience in one minute.',
        points: [
          'Your current job and what you’ve done there (present perfect)',
          'A past job and one achievement (past simple)',
          'Why you’re applying',
          'What makes you stand out',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I've been a job seeker for two months now, and it's a full-time job in itself. Every morning, I check LinkedIn for new job postings and apply for two or three. I rewrote my résumé last week: I added keywords from the postings and described my old job with strong verbs, like 'trained twelve new agents'. I also write a short cover letter for each company. Last Tuesday, a recruiter called me and said I had been shortlisted out of three hundred applicants. I followed up with a thank-you email the same day. Most companies never get back to me, but I'm still waiting to hear back from two of them. My cousin, who is a headhunter, says the trick is to stand out from the crowd with real numbers.",
    },
    `
n | résumé | A short document that lists your education, skills and work experience (in British English, a CV). | Keep your résumé to one page if you have less than five years of experience.
n | cover letter | A letter you send with a job application to explain why you are right for the job. | In my cover letter, I explained why I want to work in tourism.
n | job posting | An advertisement for a job, especially online. | The job posting asked for three years of experience.
n | applicant | A person who formally asks for a job or a place at a college. | There were over 300 applicants for one position at the bank.
v | apply | To formally ask for a job, usually by sending a form or a résumé. | I applied for five jobs this week.
n | headhunter | A person whose job is to find people with the right skills and offer them jobs at other companies. | A headhunter contacted me about a job in Dubai.
n | job seeker | A person who is looking for a job. | The website has free courses for job seekers.
v | shortlist | To choose a small number of people from a larger group for the final part of a selection. | I was shortlisted for the final interview.
n | keyword | An important word that a computer system or a recruiter searches for. | Use keywords from the job posting in your résumé.
n | recruiter | A person whose job is to find new people to work for a company. | The recruiter asked about my salary expectations.
pv | follow up | To contact someone again to find out more or to remind them. | I followed up with an email a week after the interview.
pv | hear back | To get an answer from someone you have contacted. | I'm still waiting to hear back from the company.
i | stand out from the crowd | To be much better or more noticeable than others. | A portfolio of your work will help you stand out from the crowd.
`
  ),
  pack(
    {
      id: 'internet-and-online-services',
      group: 'work',
      title: 'The Internet & Online Services',
      description: 'Talk about your internet connection, online payments, subscriptions and the apps you use every day.',
      level: 'B2',
      emoji: '🌐',
      warmUp: [
        'How many hours a day are you online?',
        'Which online service could you not live without?',
      ],
      grammar: {
        title: 'Questions that end with a preposition',
        points: [
          { form: 'What / Who + … + preposition?', use: 'In normal English, the preposition goes at the end of the question.', example: 'What are you looking for? · Who did you send it to?' },
          { form: 'Which + noun + … + preposition?', use: 'The same with a noun.', example: 'Which app do you pay with?' },
          { form: 'What … for?', use: 'Asking about the reason or the purpose.', example: 'What do you need a new router for?' },
          { form: 'preposition + whom …?', use: 'Very formal; you’ll see it in writing but rarely hear it.', example: 'To whom should I send the complaint?' },
        ],
        tip: 'Keep the preposition: say “What are you talking about?”, not “What are you talking?”.',
      },
      discussion: [
        'What do you use the internet for most?',
        'Is the broadband in your area fast enough? What do you do when it’s slow?',
        'Which subscriptions do you pay for, and which would you cancel first?',
        'Do you trust e-wallets for paying bills and sending money?',
        'Is it safe to keep your photos and documents in cloud storage?',
        'Which apps are really user-friendly, in your opinion, and which aren’t?',
        'Can you imagine a week offline? What would you miss?',
      ],
      task: {
        prompt: 'Help an older relative start using an online service.',
        points: [
          'Which service and what it’s for',
          'How to log in, and what to check first',
          'One problem they might have and how to fix it',
          'Three questions that end with a preposition',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My father used to pay every bill in person, waiting in long lines. Last month, I set up an e-wallet on his phone and showed him how to log in. 'What do I need a password for?' he asked, and I explained that it keeps his money safe. Now he pays the electricity bill and his phone subscription in two minutes. Our home broadband is slow in the evening, when everyone is online, so sometimes he uses my phone as a hotspot. He also saves his photos in cloud storage, so he won't lose them if his phone breaks. The app isn't very user-friendly, but he's learning fast. Last night, I found him scrolling through recipes; he has the world at his fingertips now.",
    },
    `
n | broadband | A fast internet connection, usually at home. | We upgraded our home broadband, and videos don't freeze anymore.
n | hotspot | A place or a device, such as a phone, that gives other devices a wireless internet connection. | When the Wi-Fi went down, I used my phone as a hotspot.
n | bandwidth | The amount of data that an internet connection can send in a certain time. | Video calls use a lot of bandwidth.
v | download | To copy files, apps or music from the internet to your device. | Download the episodes before you get on the plane.
n | e-wallet | An app on your phone that you use to keep money and make payments. | I pay my internet bill with my e-wallet.
n | subscription | Money you pay regularly to use a service, such as a streaming app. | I canceled my subscription because I never watched anything.
n | cloud storage | A service that keeps your files on the internet, not on your device. | All my photos are backed up in cloud storage.
adj | user-friendly | Easy for people to use or understand. | The new banking app is very user-friendly.
n | browser | A program you use to look at websites, such as Chrome or Safari. | Clear your browser history if the website is slow.
adj | offline | Not connected to the internet. | You can watch downloaded videos offline.
pv | log in | To enter your name and password to start using a website or an app. | I can't log in; I forgot my password.
pv | scroll through | To move up or down a list or a page on a screen to look at it. | I scrolled through my feed for an hour before bed.
i | the world at your fingertips | The ability to find almost anything and do almost anything easily. | With a smartphone, you have the world at your fingertips.
`
  ),
  pack(
    {
      id: 'programming',
      group: 'work',
      title: 'Programming & Product Development',
      description: 'Talk about how apps and websites are built, tested, fixed and launched.',
      level: 'B2',
      emoji: '💻',
      warmUp: [
        'Have you ever tried to write code?',
        'What is your favorite app, and what would you change in it?',
      ],
      grammar: {
        title: 'Mixed conditionals',
        points: [
          { form: 'If + past perfect, would + base verb', use: 'A past action with a result now.', example: 'If we had tested the app, it wouldn’t be crashing now.' },
          { form: 'If + past simple, would have + past participle', use: 'A present fact that changed something in the past.', example: 'If I knew Python, I would have applied for that job last month.' },
          { form: 'If + past perfect, might / could + base verb', use: 'A less certain result now.', example: 'If I had studied computer science, I might be a developer today.' },
        ],
        tip: 'Each half has its own time: “If I had learned to code (past), I would have a better job now (present).” Don’t put would in the if-clause.',
      },
      discussion: [
        'Which programming language would you learn first, and why?',
        'If you had learned to code as a child, how would your life be different now?',
        'Why do apps launch with bugs instead of waiting until they’re perfect?',
        'What makes a good user experience?',
        'Should companies roll out new features slowly or all at once?',
        'Is open-source software a good idea for businesses?',
        'Do you agree with ’if it ain’t broke, don’t fix it’ when it comes to apps?',
      ],
      task: {
        prompt: 'Describe an app idea and how you would build it.',
        points: [
          'The problem it solves',
          'Two main features',
          'How you would test the prototype',
          'One mixed conditional sentence',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I'm a junior developer at a small startup in Maadi, and we're building a delivery app. Last month, we rolled out a new payment feature, and it crashed on older phones. If we had tested it on more devices, our users wouldn't be angry now. I spent three nights trying to debug it, and the bug was one missing line in the source code. Our team leader said it was back to the drawing board for the checkout screen, because the user experience was confusing. We built a quick prototype, tested it with ten real customers and fixed it. Now we deploy updates every Thursday, and we use a lot of open-source tools. My manager always says, 'If it ain't broke, don't fix it,' but our app was broken!",
    },
    `
n | bug | A mistake in a computer program that stops it from working correctly. | There's a bug in the app: it closes when you open the camera.
v | debug | To find and remove the mistakes in a computer program. | It took me all day to debug the login page.
n | source code | The instructions, written in a programming language, that make up a computer program. | The developers keep the source code on GitHub.
n | programming language | A language such as Python or Java that people use to write computer programs. | Python is a good first programming language.
n | feature | Something that a program or a device can do. | The new version has a dark mode feature.
n | user experience | How easy and pleasant a product, such as an app or a website, is to use. | A slow app gives a bad user experience.
n | prototype | The first simple version of a product, made to test the idea. | We built a prototype of the app in two weeks.
v | deploy | To make a new version of software available for people to use. | We deploy updates every Thursday night.
adj | open-source | Describing software whose code anyone can see, use and change for free. | Android is based on open-source software.
n | developer | A person whose job is to write computer programs, apps or websites. | My brother is a web developer at a bank.
pv | roll out | To make a new product or service available to people, often step by step. | The bank rolled out its new app in Cairo first.
i | back to the drawing board | Said when an idea has failed and you must start planning again. | The customers hated the design, so it's back to the drawing board.
i | if it ain't broke, don't fix it | Don't try to change something that already works well (informal). | The old system works fine. If it ain't broke, don't fix it.
`
  ),
  pack(
    {
      id: 'cybersecurity-and-scams',
      group: 'work',
      title: 'Cybersecurity, Privacy & Online Scams',
      description: 'Spot online scams, protect your accounts and talk about privacy.',
      level: 'B2',
      emoji: '🔐',
      warmUp: [
        'Have you ever received a strange message asking for money or a code?',
        'How many different passwords do you use?',
      ],
      grammar: {
        title: 'in case vs if',
        points: [
          { form: 'in case + present simple', use: 'Doing something now to be ready for a possible problem.', example: 'I back up my photos in case my phone gets stolen.' },
          { form: 'if + present simple, will + base verb', use: 'Doing something only when the situation happens.', example: 'If my phone gets stolen, I’ll call the bank.' },
          { form: 'in case of + noun', use: 'Formal, on signs and in instructions.', example: 'In case of fraud, call this number.' },
          { form: 'just in case', use: 'At the end of a sentence: as a precaution.', example: 'Change your password, just in case.' },
        ],
        tip: 'Don’t use will after in case: “Take an umbrella in case it rains”, not “in case it will rain”. And in case isn’t if: “I’ll take my card in case I need money” (I take it anyway) is different from “if I need money” (only then).',
      },
      discussion: [
        'What phishing messages have you or your family received?',
        'Why do smart people still fall for scams?',
        'Do you use two-factor authentication on your accounts? Why or why not?',
        'What would you do first if someone hacked into your email?',
        'Should companies be punished when there’s a data breach?',
        'What looks suspicious to you in an email or a text message?',
        'How can you protect older relatives from fraud?',
      ],
      task: {
        prompt: 'Warn a family member about a common scam.',
        points: [
          'How the scam works',
          'What looks suspicious about it',
          'What they should do in case they get one',
          'Two things to do now to stay safe',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last month, my aunt got a text saying she had won a car from a phone company. All she had to do was send a code that arrived on her phone. It sounded too good to be true, and it was: it was a scam. Thankfully, she called me first, because the message looked suspicious to me. If she had sent the code, the hackers could have taken over her bank account. I showed her how phishing works and turned on two-factor authentication for all her accounts. I also wrote down the bank's emergency number for her, in case someone hacks into her phone. Many people fall for these tricks, and identity theft is growing in Egypt. Now my aunt checks everything twice, just in case.",
    },
    `
n | scam | A dishonest plan to get money from people by tricking them. | The "free iPhone" message was a scam.
n | phishing | Sending fake emails or messages to trick people into giving their passwords or bank details. | Banks never ask for your PIN by email; that's phishing.
n | hacker | A person who uses computers to get into other people's systems without permission. | Hackers stole thousands of passwords from the website.
n | malware | Software made to damage a computer or steal information. | Don't download apps from unknown websites; they may contain malware.
n | two-factor authentication | A way of logging in that needs your password and a second thing, such as a code sent to your phone. | Turn on two-factor authentication for WhatsApp.
adj | suspicious | Making you feel that something is wrong or dishonest. | I got a suspicious email from "my bank" with a strange link.
v | encrypt | To change information into a secret code so that other people can't read it. | WhatsApp messages are encrypted from end to end.
n | data breach | An event in which private information is stolen from a company's systems. | After the data breach, everyone had to change their passwords.
n | identity theft | Using another person's personal information, such as their name or ID number, to steal money or commit crimes. | He discovered the identity theft when a bank asked him to repay a loan he never took.
n | fraud | The crime of tricking people to get money. | The police arrested the gang for credit card fraud.
pv | fall for | To be tricked into believing something that is not true. | My uncle fell for a fake investment and lost his savings.
pv | hack into | To get into someone else's computer system or account without permission. | Someone hacked into my Facebook account and posted ads.
i | too good to be true | So good that it is probably false. | A brand-new iPhone for 2,000 pounds? It's too good to be true.
`
  ),
];
