/** B2 topics, built with the course method (see ./types.ts and ./README.md). */
import { pack, type TopicPack } from './types';

export const B2_PACKS: TopicPack[] = [
  pack(
    {
      id: 'professional-communication',
      group: 'work',
      title: 'Professional Communication & Presentations',
      description: 'Run meetings, write clear work emails, give presentations and report what people said.',
      level: 'B2',
      emoji: '📊',
      warmUp: [
        'Do you enjoy giving presentations?',
        'How many work emails do you get a day?',
      ],
      grammar: {
        title: 'Reported speech',
        points: [
          { form: 'say (that) + clause, one tense back', use: 'Reporting a statement.', example: '“We’re late.” → She said (that) we were late.' },
          { form: 'tell + person + (that) + clause', use: 'Reporting to someone; tell needs a person.', example: 'He told us that the client had called.' },
          { form: 'ask + if/whether + clause · ask + question word + clause', use: 'Reporting questions, with normal word order.', example: 'She asked if I had sent the report. He asked when the meeting was.' },
        ],
        tip: 'Say “He told me that…” or “He said that…”, never “He said me that…”.',
      },
      discussion: [
        'What makes a meeting useful or a waste of time?',
        'How do you start a presentation so that the audience listens?',
        'Do you prefer short, informal emails or formal ones?',
        'How do you follow up after a meeting?',
        'What’s the hardest part of presenting in English?',
        'Have you ever had to summarize a long meeting for your boss?',
      ],
      task: {
        prompt: 'Report a meeting to a colleague who missed it.',
        points: [
          'What was on the agenda',
          'Two things people said (reported speech)',
          'What was decided',
          'Who will follow up on what',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Yesterday, I presented our sales results to the regional manager. Before the meeting, I sent the agenda and a short handout as an attachment. I outlined the main points on three slides and kept my talk brief. During the questions, the manager asked whether we had reached our targets. I told her that we had missed one target but pointed out that our customer ratings were the best in the region. She said she was impressed and asked me to address the delivery problems next month. After the meeting, I wrote the minutes and followed up with each team. I'll touch base with her again on Thursday.",
    },
    `
n | agenda | A list of the things to discuss at a meeting. | The first item on the agenda is the budget.
n | minutes | A written record of what was said and decided at a meeting. | Could you take the minutes today?
n | attachment | A file that you send with an email. | Please see the report in the attachment.
pv | follow up | To do something more after a meeting or a first action, such as contacting someone again. | I'll follow up with an email tomorrow.
v | summarize | To give the main points of something in a short form. | Can you summarize the report in two minutes?
n | audience | The people who watch or listen to a talk or a show. | The audience asked a lot of questions.
n | slide | One page of a presentation shown on a screen. | Keep each slide simple.
pv | point out | To tell someone a fact that they didn't know or hadn't noticed. | She pointed out a mistake in my numbers.
v | address | To start dealing with a problem. | We need to address the customers' complaints.
adj | formal | Suitable for official or serious situations. | Use formal English in emails to clients.
adj | brief | Short, using few words. | Keep your answer brief.
v | outline | To give the main facts about something, without details. | In the first part, I'll outline our plan.
n | handout | A printed sheet of information given to people at a talk or a class. | I'll send you the handout after the session.
i | touch base | To make contact with someone for a short time. | Let's touch base next week about the project.
`
  ),
  pack(
    {
      id: 'argumentation-and-debate',
      group: 'talk',
      title: 'Argumentation, Persuasion & Debate',
      description: 'Build an argument, support it with evidence, answer the other side and persuade people.',
      level: 'B2',
      emoji: '⚖️',
      warmUp: [
        'Do you enjoy debating, or do you avoid arguments?',
        'Who is the most persuasive person you know?',
      ],
      grammar: {
        title: 'Contrast and concession: although, despite, whereas, nevertheless',
        points: [
          { form: 'although / even though + clause', use: 'Accepting a point but still disagreeing.', example: 'Although the plan is cheap, it won’t work.' },
          { form: 'despite / in spite of + noun or V-ing', use: 'The same, before a noun or -ing.', example: 'Despite the evidence, he didn’t change his stance.' },
          { form: 'whereas + clause', use: 'Comparing two different facts.', example: 'Cities offer jobs, whereas villages offer peace.' },
          { form: 'Nevertheless, + sentence', use: 'A strong contrast between two sentences, more formal than however.', example: 'The argument is logical. Nevertheless, it isn’t convincing.' },
        ],
        tip: 'Don’t put of after despite: say “despite the rain”, not “despite of the rain” (but “in spite of the rain” is correct).',
      },
      discussion: [
        'What makes an argument convincing?',
        'Is it possible to persuade someone who is very biased?',
        'How do you respond to a counterargument you can’t answer?',
        'Should schools teach debate? Why?',
        'When is it better not to take sides?',
        'Have you ever changed your stance after a debate?',
      ],
      task: {
        prompt: 'Argue for or against: “Social media does more harm than good.”',
        points: [
          'State your stance clearly',
          'Give two reasons with evidence for each',
          'Answer one counterargument (although, despite)',
          'Finish with a strong conclusion',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last week, our English class had a debate about whether homework should be banned. My stance was against banning it. I claimed that homework helps students practice what they learn, and I supported my claim with evidence from a study on exam results. The other team argued that homework causes stress, which is a valid point. Nevertheless, I said that the problem is too much homework, not homework itself. One student said my argument was biased because I'm a teacher's son! I conceded that I might be biased, but I asked him to contradict the evidence, and he couldn't. In the end, we didn't change many minds, but the debate was logical and polite.",
    },
    `
n | debate | A serious discussion in which people give different opinions. | There's a big debate about working from home.
v | persuade | To make someone agree to do or believe something by giving reasons. | She persuaded me to apply for the job.
n | claim | A statement that something is true, without proof. | His claim that the product is the best isn't true.
n | evidence | Facts or information that show something is true. | There's no evidence that the plan works.
n | counterargument | An argument against another argument. | Think of a counterargument before you write your essay.
adj | valid | Based on good reasons, and so worth accepting. | That's a valid point.
v | justify | To give a good reason for something. | How can you justify spending so much money?
adj | biased | Unfairly preferring one side over another. | The article was biased against the government.
adj | logical | Using clear, reasonable thinking. | Her answer was clear and logical.
v | concede | To admit, often unwillingly, that something is true. | He conceded that he had made a mistake.
n | stance | A public opinion about something. | What's your stance on the new law?
pv | pull apart | To criticize something very strongly, finding all its weak points. | The other team pulled apart our argument.
p | take sides | To support one person or group in an argument. | I don't want to take sides in their fight.
v | contradict | To say the opposite of what someone else has said. | The new report contradicts the old one.
i | food for thought | Something that makes you think seriously. | Her speech gave us a lot of food for thought.
`
  ),
  pack(
    {
      id: 'negotiation',
      group: 'work',
      title: 'Negotiation & Conflict Resolution',
      description: 'Negotiate a price, a salary or a deadline, and help people resolve a conflict.',
      level: 'B2',
      emoji: '🤝',
      warmUp: [
        'Do you haggle when you shop?',
        'Have you ever asked for a raise?',
      ],
      grammar: {
        title: 'Conditions for a deal: unless, as long as, provided that',
        points: [
          { form: 'as long as / provided that + clause', use: 'Only if this condition is true.', example: 'We’ll accept the price as long as you deliver by Friday.' },
          { form: 'unless + clause', use: 'Except if; if … not.', example: 'We can’t sign unless you change the terms.' },
          { form: 'on condition that + clause', use: 'A formal way to set a condition.', example: 'I’ll agree on condition that we review it in six months.' },
        ],
        tip: 'Don’t use will after these words: “as long as you pay on time”, not “as long as you will pay”.',
      },
      discussion: [
        'Are you a good negotiator? Why or why not?',
        'Is bargaining common where you shop?',
        'What makes a deal win-win?',
        'Have you ever needed a mediator to solve a dispute?',
        'When is it right to back down in a negotiation?',
        'How do you settle a conflict between two friends?',
      ],
      task: {
        prompt: 'Negotiate your salary with a new employer.',
        points: [
          'Say what you want and why',
          'Respond to their first offer',
          'Make a counteroffer with a condition (as long as, unless)',
          'Reach an agreement',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "When I got my job offer, I decided to negotiate my salary for the first time. The company's offer was lower than I expected, so I made a counteroffer. I said I would accept as long as they paid for my training course. At first, they didn't want to change the terms, and I almost backed down. Then the manager suggested a compromise: a lower salary for three months, then a raise. It wasn't exactly what I wanted, but we met halfway. In the end, we came to an agreement that was win-win. I've learned that in any dispute, both sides need to give a concession.",
    },
    `
v | negotiate | To discuss something to reach an agreement. | We negotiated a better price.
n | offer | An amount of money that someone says they will pay or accept. | They made an offer of two million pounds for the apartment.
n | counteroffer | An offer made in reply to an offer that you don't accept. | We made a counteroffer of 10,000 pounds.
n | terms | The conditions of an agreement or a contract. | Read the terms before you sign.
n | conflict | A serious disagreement. | There's a conflict between the two departments.
n | mediator | A person who helps two sides reach an agreement. | A mediator helped the company and the workers agree.
n | concession | Something that you agree to give up or accept in order to end a disagreement. | Both sides had to make concessions.
adj | win-win | Good for everyone involved. | It was a win-win deal.
n | dispute | A disagreement or an argument, often an official one. | The dispute over the land went to court.
v | haggle | To argue about the price of something before buying it. | Tourists often haggle in Khan El Khalili.
i | meet someone halfway | To accept part of what someone wants so you can agree. | I can't pay all of it, but I'll meet you halfway.
pv | back down | To stop asking for something or stop saying you are right. | He refused to back down.
v | settle | To end an argument by reaching an agreement. | They settled the dispute without going to court.
v | resolve | To find a solution to a problem or a disagreement. | The manager resolved the conflict quickly.
`
  ),
  pack(
    {
      id: 'leadership-and-feedback',
      group: 'work',
      title: 'Leadership, Team Dynamics & Feedback',
      description: 'Talk about good and bad leaders, how teams work together and how to give and receive feedback.',
      level: 'B2',
      emoji: '🧭',
      warmUp: [
        'Who is the best manager you’ve ever had?',
        'Is it easy for you to accept criticism?',
      ],
      grammar: {
        title: 'make, let, allow and get someone to',
        points: [
          { form: 'make + person + base verb', use: 'Forcing someone to do something.', example: 'My old boss made us stay late every day.' },
          { form: 'let + person + base verb', use: 'Giving permission.', example: 'She lets us work from home on Thursdays.' },
          { form: 'allow + person + to + base verb', use: 'Giving permission, more formal.', example: 'The company allows employees to choose their hours.' },
          { form: 'get + person + to + base verb', use: 'Persuading someone to do something.', example: 'I got my colleague to help me with the report.' },
        ],
        tip: 'Don’t put to after make or let: say “He made me wait”, not “He made me to wait”.',
      },
      discussion: [
        'What makes someone a good leader?',
        'Have you ever worked for a manager who micromanaged?',
        'How should a manager give constructive feedback?',
        'What do you do when team morale is low?',
        'Are you a team player, or do you prefer working alone?',
        'When should someone step up and take charge?',
      ],
      task: {
        prompt: 'Give feedback to a team member whose work has gotten worse. (Play the manager.)',
        points: [
          'Start with something positive',
          'Explain the problem clearly',
          'Agree on a plan (let, make, get someone to)',
          'Finish in a supportive way',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My first manager was a nightmare: he micromanaged everything and made us redo our work again and again. Morale was so low that three people left in one year. My current team leader is the opposite. She leads by example: she's the first to arrive and the last to leave. She lets us choose how we work, and she delegates real responsibility. Her criticism is always constructive, so it motivates us instead of hurting us. In my last appraisal, she pointed out that my reports were too long and got me to take a writing course. Last month, when she was sick, I stepped up and took charge of the team, and it went well.",
    },
    `
n | leader | A person who is in charge of a group and guides it. | A good leader listens to the team.
v | delegate | To give part of your work or responsibility to someone else. | Managers should learn to delegate.
v | motivate | To make someone want to do something well. | Good feedback motivates people.
v | inspire | To give someone the wish and the energy to do something. | Her story inspired me to start my own business.
adj | supportive | Giving help and encouragement. | My team is very supportive.
adj | constructive | Helpful, with the aim of improving something. | Thank you for the constructive feedback.
n | criticism | Saying what is wrong with someone or something. | He doesn't take criticism well.
n | performance | How well a person does their job. | Her performance this year was excellent.
n | appraisal | A meeting where a manager judges how well an employee is working. | I have my annual appraisal next week.
n | morale | How confident and positive a group feels. | Team morale is high after the bonus.
v | micromanage | To control every small detail of someone's work. | Nobody likes a boss who micromanages.
n | team player | Someone who works well with others in a team. | We need a team player, not a star.
pv | step up | To take more responsibility or make more effort when it's needed. | When the manager left, Sara stepped up.
i | pull your weight | To do your fair share of the work in a group. | Everyone on the team pulls their weight.
`
  ),
  pack(
    {
      id: 'entrepreneurship',
      group: 'work',
      title: 'Entrepreneurship & Business Strategy',
      description: 'Talk about starting a business: the idea, the market, money, risks and growth.',
      level: 'B2',
      emoji: '🚀',
      warmUp: [
        'Would you like to start your own business one day?',
        'What’s a small business in your area that’s doing well?',
      ],
      grammar: {
        title: 'Future continuous and future perfect',
        points: [
          { form: 'will be + V-ing', use: 'An action in progress at a time in the future.', example: 'This time next year, we’ll be selling online.' },
          { form: 'will have + past participle', use: 'An action finished before a time in the future.', example: 'By 2027, we’ll have opened three branches.' },
          { form: 'by + time', use: 'A deadline that goes with the future perfect.', example: 'By the end of the year, we’ll have broken even.' },
        ],
        tip: 'Use by (not until) with the future perfect: “By June, I’ll have finished”, not “Until June, I’ll have finished”.',
      },
      discussion: [
        'What makes someone a good entrepreneur?',
        'Would you rather start a small business or join a startup?',
        'Where can young people in Egypt find investors?',
        'How do you know if there’s a market for your idea?',
        'What’s the biggest risk of starting a business?',
        'Why do so many startups go bust in the first year?',
      ],
      task: {
        prompt: 'Pitch a business idea to an investor in one minute.',
        points: [
          'The idea and the target market',
          'Your competitors and your brand',
          'Where the business will be in two years (will be + V-ing, will have + past participle)',
          'How much money you need and the risks',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Two years ago, my friend Amr set up a small startup that delivers healthy lunches to offices in Cairo. At first, he made a loss every month, and he almost went bust. Then he changed his marketing: he targeted big companies instead of individuals. An investor saw his growth and gave him money to launch a mobile app. He has a lot of competitors, but his brand is known for fresh food. This year, the business will have broken even, and his revenue keeps growing. By next summer, he'll be delivering in Alexandria too. He says the biggest risk isn't losing money; it's giving up too early.",
    },
    `
n | entrepreneur | A person who starts a business and takes financial risks to make money. | She's a young entrepreneur with three companies.
n | startup | A new small company, especially one based on technology. | He works for a fintech startup.
n | investor | A person or a company that puts money into a business to make a profit. | The investors want to see a business plan.
n | profit | The money a business makes after paying its costs. | The company made a profit of ten million pounds.
n | loss | Money that a business loses. | The restaurant made a loss in its first year.
n | competitor | A company that sells the same things as another company. | Our main competitor lowered its prices.
n | market | The people who want to buy a product or a service. | There's a big market for online courses.
n | brand | The name of a product or a company, and the image people have of it. | They built a strong brand on social media.
n | marketing | The work of telling people about a product and making them want to buy it. | We spend a lot on marketing.
v | launch | To start selling a new product or service. | They launched the app in March.
n | revenue | The money that a business receives from selling goods or services. | Our revenue grew by 20 percent.
n | risk | The possibility that something bad will happen. | Starting a business is always a risk.
pv | set up | To start a company or an organization. | She set up her own design company.
p | break even | To make neither a profit nor a loss. | We expect to break even next year.
i | go bust | (Of a company) to fail and have no money (informal). | Many small shops went bust during the crisis.
`
  ),
  pack(
    {
      id: 'economy-and-future-of-work',
      group: 'society',
      title: 'Economy, Inflation & Future of Work',
      description: 'Talk about prices, the currency, jobs and how automation is changing work.',
      level: 'B2',
      emoji: '📈',
      warmUp: [
        'How have prices changed where you live this year?',
        'Which jobs do you think will disappear?',
      ],
      grammar: {
        title: 'Describing trends: rise by, fall to, a sharp increase in',
        points: [
          { form: 'rise / increase / go up + by + amount', use: 'The size of a change.', example: 'Food prices rose by 30 percent.' },
          { form: 'fall / drop / decrease + to + new level', use: 'The new level after a change.', example: 'Unemployment fell to 7 percent.' },
          { form: 'a sharp / slight / steady + increase / decline + in + noun', use: 'Describing a change with a noun.', example: 'There has been a sharp increase in rents.' },
        ],
        tip: 'rise has no object (“Prices rose”), but raise does (“The company raised its prices”). Don’t say “The prices raised”.',
      },
      discussion: [
        'How does inflation affect young people’s plans?',
        'Why does the exchange rate matter to people who never travel?',
        'Is automation a threat or an opportunity for workers?',
        'Would you prefer a stable job or freelance work in the gig economy?',
        'What happens to an economy during a recession?',
        'Which skills will the job market need in ten years?',
      ],
      task: {
        prompt: 'Explain to a foreign friend how the economy has changed your life.',
        points: [
          'Two prices then and now (rise by, go up to)',
          'The currency and the exchange rate',
          'How jobs are changing',
          'What you’re doing to prepare for the future',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "In the last few years, inflation in Egypt has been very high, and prices have skyrocketed. The currency lost much of its value, and the exchange rate went from about sixteen pounds to the dollar to around fifty. Salaries didn't rise as fast, so people's purchasing power fell sharply. At the same time, the job market is changing. Automation is replacing some jobs, and many companies laid off workers during the recession. A lot of young people now work in the gig economy, delivering food or driving for apps. Wages there are low, but the work is flexible. I'm learning digital skills, because I think that's where the growth will be.",
    },
    `
n | economy | The system of money, trade and industry in a country. | Tourism is important to Egypt's economy.
n | inflation | A general rise in prices, so that money buys less. | Inflation reached 30 percent last year.
n | recession | A period when a country's economy is doing badly. | Many companies closed during the recession.
n | unemployment | The number of people who don't have a job. | Unemployment among graduates is high.
n | currency | The money used in a particular country. | The Egyptian pound is our currency.
n | exchange rate | How much one currency is worth compared with another. | What's the exchange rate for the dollar today?
n | automation | The use of machines to do work that people used to do. | Automation has changed factory work.
n | job market | The jobs that are available and the people looking for them. | The job market for programmers is strong.
n | gig economy | A way of working where people do short jobs, often through apps, instead of having a permanent job. | Delivery drivers are part of the gig economy.
n | workforce | All the people who work in a country or a company. | Women are a growing part of the workforce.
n | wage | Money that you earn, usually every week or every hour. | The minimum wage went up this year.
n | growth | An increase in size, amount or importance. | The economy is showing signs of growth.
pv | lay off | To stop employing someone because there isn't enough work. | The factory laid off 200 workers.
v | skyrocket | To rise extremely quickly. | Rents have skyrocketed in New Cairo.
i | tighten your belt | To spend less money because you have less than before. | With prices rising, we all have to tighten our belts.
`
  ),
  pack(
    {
      id: 'technology-and-innovation',
      group: 'work',
      title: 'Technology, Programming & Innovation',
      description: 'Talk about software, how products are built and improved, and the innovations changing our lives.',
      level: 'B2',
      emoji: '💡',
      warmUp: [
        'What’s the most useful app or tool you use?',
        'What invention would you like to see in your lifetime?',
      ],
      grammar: {
        title: 'Mixed conditionals',
        points: [
          { form: 'If + past perfect, would + base verb', use: 'A past action with a result now.', example: 'If I had studied programming, I would have a better job now.' },
          { form: 'If + past simple, would have + past participle', use: 'A present fact that changed something in the past.', example: 'If I knew how to code, I would have built the app myself.' },
          { form: 'If + past perfect, might/could + base verb', use: 'A less certain result now.', example: 'If they had tested it, it might work better today.' },
        ],
        tip: 'Check the time of each half: the if-clause can be past and the result present, or the reverse.',
      },
      discussion: [
        'What makes an app user-friendly?',
        'What’s the biggest breakthrough in technology in your lifetime?',
        'Would you like to learn to code? Why?',
        'Should companies roll out new features slowly or all at once?',
        'Which devices or apps do you think are becoming obsolete?',
        'How does data help companies improve their products?',
      ],
      task: {
        prompt: 'Describe a product you would build, and how.',
        points: [
          'The problem it solves',
          'Two key features',
          'How you’d test the prototype',
          'One mixed conditional sentence about your past or present',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I'm a junior developer at a small company that makes a banking app. Last year, we rolled out a new feature that let users pay bills, but there was a bug in the code. If we had tested it more carefully, we wouldn't have so many angry reviews today! We built a prototype of a new design and tested it with fifty real users. Their data showed us what was confusing, and the new version is much more user-friendly. Our team is now working on an algorithm that uses artificial intelligence to spot fraud. It's not a breakthrough, but it's real innovation for a small company. Technology changes so fast that last year's tools already feel obsolete.",
    },
    `
n | innovation | A new idea, method or invention. | The company is famous for innovation.
n | software | The programs that a computer uses. | We installed new software on all our computers.
n | developer | A person whose job is to write computer programs. | She works as a web developer.
n | code | Instructions written in a computer language. | He writes code in Python.
n | bug | A mistake in a computer program. | There's a bug that makes the app close.
n | prototype | The first version of a product, used to test the idea. | We tested the prototype with real customers.
n | feature | Something that a product can do. | The new phone has some great features.
adj | user-friendly | Easy for people to use or understand. | The website is very user-friendly.
adj | cutting-edge | The newest and most advanced. | They use cutting-edge technology.
n | breakthrough | An important discovery or development. | Scientists made a breakthrough in cancer research.
n | algorithm | A set of rules that a computer follows to solve a problem. | The algorithm decides which videos you see.
n | data | Information, especially facts or numbers, collected to be used. | We collect data on how people use the app.
pv | roll out | To make a new product or service available to people, often step by step. | The bank rolled out its new app last month.
adj | obsolete | No longer used because something newer exists. | Fax machines are almost obsolete.
i | ahead of the curve | Ahead of others in new ideas or methods. | The company stays ahead of the curve.
`
  ),
  pack(
    {
      id: 'cybersecurity-and-privacy',
      group: 'work',
      title: 'Cybersecurity, Privacy & Digital Rights',
      description: 'Talk about online scams, data protection and our rights to privacy online.',
      level: 'B2',
      emoji: '🔐',
      warmUp: [
        'Have you ever received a phishing message?',
        'How much do apps know about you, do you think?',
      ],
      grammar: {
        title: 'in case and just in case',
        points: [
          { form: 'in case + present simple', use: 'Doing something now because something might happen.', example: 'I back up my files in case my laptop is stolen.' },
          { form: 'just in case', use: 'At the end of a sentence: as a precaution.', example: 'Change your password, just in case.' },
          { form: 'in case of + noun', use: 'Formal, on signs and instructions.', example: 'In case of fraud, call this number.' },
        ],
        tip: 'in case is not the same as if: “I’ll take my card in case I need money” (I take it anyway); “I’ll take my card if I need money” (only then).',
      },
      discussion: [
        'Why do clever people still fall for scams?',
        'Should companies be punished for a data breach?',
        'Do you give consent to apps without reading the terms?',
        'Is government surveillance ever acceptable?',
        'Who is most vulnerable to online fraud?',
        'Do you use two-factor authentication? Why or why not?',
      ],
      task: {
        prompt: 'Warn an older relative about online scams.',
        points: [
          'How a common scam works',
          'What looks suspicious',
          'What to do in case they get one',
          'Two ways to stay safe',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last month, my uncle almost fell for a phishing message that looked like it came from his bank. It asked him to confirm his card details, and it seemed too good to be true because it promised a prize. Luckily, he called me first. I explained that hackers use these messages to hack into accounts and steal money, which is a kind of identity theft. I turned on two-factor authentication on his phone in case someone gets his password. I also showed him how to spot suspicious links. Older people are often more vulnerable to fraud, so I check his phone every month, just in case. Now he's become the family's cybersecurity expert!",
    },
    `
n | cybersecurity | The protection of computers and data from attacks. | Banks spend millions on cybersecurity.
n | phishing | Sending fake emails or messages to get people's passwords or bank details. | Never click links in phishing emails.
n | hacker | A person who gets into other people's computer systems without permission. | Hackers stole thousands of passwords.
n | malware | Software that is made to damage a computer or steal information. | The free game was full of malware.
v | encrypt | To change information into a secret code so others can't read it. | Your messages are encrypted.
n | data breach | When private information is stolen from a company's systems. | The data breach affected a million customers.
n | identity theft | Using another person's personal details to steal money or commit crimes. | Identity theft is growing fast.
n | surveillance | Watching people closely, often secretly. | There are surveillance cameras everywhere in the mall.
n | consent | Permission for something to happen. | Apps should ask for your consent before they use your data.
n | fraud | The crime of getting money by tricking people. | He was arrested for credit card fraud.
adj | suspicious | Making you feel that something is wrong or dishonest. | I got a suspicious email from "my bank".
adj | vulnerable | Easy to hurt or attack. | Old software is vulnerable to hackers.
pv | fall for | To be tricked into believing something. | Don't fall for these fake offers.
i | too good to be true | So good that it is probably false. | A free iPhone? It's too good to be true.
`
  ),
  pack(
    {
      id: 'news-and-media-literacy',
      group: 'society',
      title: 'News, Media Literacy & Misinformation',
      description: 'Talk about where news comes from, how to check it and how false information spreads.',
      level: 'B2',
      emoji: '📰',
      warmUp: [
        'Where do you get your news?',
        'Have you ever shared something that turned out to be false?',
      ],
      grammar: {
        title: 'Reporting verbs: claim, deny, admit, warn',
        points: [
          { form: 'claim / admit + that + clause', use: 'Reporting what someone says is true.', example: 'The minister claimed that prices would fall.' },
          { form: 'deny / admit + V-ing', use: 'Reporting that someone says they did or didn’t do something.', example: 'The company denied hiding the problem.' },
          { form: 'warn + person + (not) to + base verb', use: 'Reporting advice about danger.', example: 'Doctors warned people not to share the video.' },
        ],
        tip: 'Don’t use say for everything: reporting verbs show the speaker’s attitude, and each has its own pattern (“deny doing”, not “deny to do”).',
      },
      discussion: [
        'Which sources of news do you trust most?',
        'Why does fake news spread faster than real news?',
        'How do you fact-check something you see online?',
        'Is all news media biased in some way?',
        'Have you ever clicked on clickbait? What happened?',
        'What makes a journalist credible?',
      ],
      task: {
        prompt: 'Explain to a friend how to check a story before sharing it.',
        points: [
          'Where the story came from',
          'Two questions to ask about the source',
          'How to fact-check it',
          'What happened when someone shared false news (claim, deny, admit)',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last week, a story went viral in my family's WhatsApp group: a headline claimed that a famous medicine was dangerous. My aunt shared it before anyone checked the source. I did a quick fact-check and found that no credible journalist had reported it. The story came from a website known for sensational headlines and clickbait. The next day, the medicine company denied the claims, and a TV channel warned people not to believe it. My aunt admitted she had shared it too quickly. Misinformation spreads fast because it makes people afraid or angry. Now, I take anything I see online with a grain of salt until I find reliable coverage.",
    },
    `
n | headline | The title of a news story, printed in large letters. | The headline said the team had won.
n | journalist | A person whose job is to collect and report news. | She's a journalist for a big newspaper.
n | source | Where information comes from. | Always check the source of a story.
n | misinformation | Wrong information, often spread without meaning to. | There's a lot of misinformation about vaccines.
n | fake news | False stories that look like real news. | Fake news spreads quickly on social media.
n | propaganda | Information, often false or one-sided, used to make people think a certain way. | The ads were pure propaganda.
n | coverage | The way news about something is reported. | The TV coverage of the match was excellent.
adj | sensational | Presenting news in a way that is meant to shock or excite. | That newspaper loves sensational stories.
v | fact-check | To check that the facts in a piece of writing are true. | Journalists should fact-check every story.
n | bias | Unfair support for one side. | The report shows clear bias.
adj | viral | Spreading very quickly on the internet. | His video went viral overnight.
n | clickbait | Online content with a shocking title that makes you click on it. | That article was just clickbait.
adj | credible | Able to be believed or trusted. | We need credible evidence.
i | take something with a grain of salt | To not believe something completely. | Take his advice with a grain of salt.
pv | play down | To make something seem less important than it really is. | The company played down the problem.
`
  ),
  pack(
    {
      id: 'science-and-space',
      group: 'society',
      title: 'Science, Research & Space',
      description: 'Talk about scientific research, discoveries and space exploration.',
      level: 'B2',
      emoji: '🔭',
      warmUp: [
        'What scientific discovery do you think changed the world most?',
        'Would you like to travel to space?',
      ],
      grammar: {
        title: 'The passive in all tenses',
        points: [
          { form: 'is being + past participle', use: 'The present continuous passive.', example: 'A new telescope is being built in Chile.' },
          { form: 'has/have been + past participle', use: 'The present perfect passive.', example: 'Water has been found on the moon.' },
          { form: 'will be / can be + past participle', use: 'The future and modal passives.', example: 'More planets will be discovered.' },
        ],
        tip: 'In science writing, the passive is normal: “The experiment was carried out in a lab” sounds better than “We carried out the experiment”.',
      },
      discussion: [
        'Which scientist do you admire most, and why?',
        'Should governments spend money on space exploration?',
        'Do you think life will be found on another planet?',
        'What experiment do you remember from school?',
        'Is research more important than practical inventions?',
        'How do satellites affect your daily life?',
      ],
      task: {
        prompt: 'Explain a scientific discovery to a younger student.',
        points: [
          'What was discovered, and when',
          'How it was found (passive)',
          'Why it matters',
          'What questions are still being researched',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "When I was a child, I wanted to be an astronaut, and I still follow space research closely. Last year, a new planet was discovered by scientists using a powerful telescope. The planet orbits a star like our sun, and it might have water. Experiments are being carried out to check the theory that it could support life. Many satellites have been launched to study it, and a lot of evidence has been collected. Of course, this hypothesis hasn't been proven yet. For me, the universe is full of questions, and every discovery opens new ones. Science doesn't give quick answers; it's a slow and careful search for the truth.",
    },
    `
n | research | Detailed study of a subject to discover new facts. | She does research on climate change.
n | experiment | A scientific test to discover what happens. | We did an experiment with plants in class.
n | discovery | Finding something for the first time. | The discovery of penicillin saved millions of lives.
n | theory | An idea that explains something, which can be tested. | Einstein's theory changed physics.
n | laboratory | A room or a building where scientists do experiments. | The samples were sent to a laboratory.
n | scientist | A person who studies or works in science. | Scientists are studying the virus.
n | astronaut | A person who travels into space. | Astronauts train for years.
n | planet | A large round object that moves around a star, such as Earth. | Mars is the fourth planet from the sun.
n | orbit | The path that an object takes around a planet or a star. | The satellite is in orbit around Earth.
n | telescope | A tube with lenses that makes faraway objects look closer. | We looked at the moon through a telescope.
n | satellite | A machine sent into space to go around the Earth, for example to send TV signals. | The satellite sends weather pictures.
n | hypothesis | An idea that is suggested as an explanation and still needs to be proved. | The experiment proved his hypothesis wrong.
n | universe | Everything that exists, including all the stars and planets. | The universe is billions of years old.
pv | carry out | To do a task, especially research or a test. | The scientists carried out hundreds of tests.
i | the sky's the limit | There is no limit to what can be achieved. | With hard work, the sky's the limit.
`
  ),
  pack(
    {
      id: 'climate-and-sustainability',
      group: 'society',
      title: 'Climate Change & Sustainability',
      description: 'Talk about climate change, its effects on Egypt and the world, and what people can do.',
      level: 'B2',
      emoji: '🌱',
      warmUp: [
        'Have summers in Egypt become hotter?',
        'What do you do to reduce waste at home?',
      ],
      grammar: {
        title: 'The third conditional',
        points: [
          { form: 'If + past perfect, would have + past participle', use: 'Imagining a different past and its result.', example: 'If we had acted earlier, the damage wouldn’t have been so bad.' },
          { form: 'could have / might have + past participle', use: 'A less certain result.', example: 'If they had protected the forests, the animals might have survived.' },
          { form: 'If + hadn’t + past participle', use: 'Imagining that something didn’t happen.', example: 'If the river hadn’t flooded, the crops would have grown.' },
        ],
        tip: 'Don’t use would in the if-clause: “If we had known”, not “If we would have known”.',
      },
      discussion: [
        'How is climate change affecting Egypt?',
        'What are the most important renewable energy sources for Egypt?',
        'What’s your carbon footprint like? How could you reduce it?',
        'Should companies pay for their emissions?',
        'Is recycling enough to solve the problem?',
        'Which endangered animals in Egypt do you know about?',
      ],
      task: {
        prompt: 'Give a short talk about one environmental problem.',
        points: [
          'What the problem is and its causes',
          'Its effects on people and wildlife',
          'What could have been done differently (third conditional)',
          'Two solutions for the future',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Climate change is no longer a problem for the future; we can feel it in Egypt every summer. Global warming is caused mainly by emissions from fossil fuels like oil and coal. Rising sea levels may flood parts of the Nile Delta, and drought is a danger for farmers. Pollution in our cities is also getting worse. If countries had switched to renewable energy twenty years ago, the situation wouldn't have become so serious. Many species are endangered because their habitats are being destroyed. I try to reduce my carbon footprint: I recycle, I use public transportation and I've cut down on plastic. Sustainable living isn't easy, but every small step counts.",
    },
    `
n | climate change | Changes in the Earth's weather, especially the increase in temperature. | Climate change affects everyone.
n | global warming | The increase in the Earth's temperature caused by gases such as carbon dioxide. | Global warming is melting the ice at the poles.
n | emissions | Gases sent out into the air, for example by cars or factories. | We need to cut carbon emissions.
n | fossil fuel | A fuel such as coal, oil or gas that comes from under the ground. | Most of our electricity still comes from fossil fuels.
adj | renewable | (Of energy) coming from a source that doesn't run out, such as the sun or the wind. | Egypt has a lot of renewable energy from the sun.
adj | sustainable | Able to continue without damaging the environment. | We need sustainable farming.
n | pollution | Harmful substances in the air, water or soil. | Air pollution in Cairo is a serious problem.
v | recycle | To treat things so that they can be used again. | We recycle plastic bottles.
n | carbon footprint | The amount of carbon dioxide that a person or an activity produces. | Flying increases your carbon footprint.
adj | endangered | At risk of disappearing from the world. | Sea turtles are endangered.
n | drought | A long period without rain. | The drought destroyed the crops.
n | flood | A large amount of water covering an area that is usually dry. | The flood damaged hundreds of homes.
n | habitat | The natural home of an animal or a plant. | Building hotels destroys the turtles' habitat.
pv | cut down | To cut a tree so that it falls. | They cut down thousands of trees.
i | out of the woods | Free from danger or difficulty at last. | Some coral reefs are recovering, but they're not out of the woods yet.
`
  ),
  pack(
    {
      id: 'history-and-identity',
      group: 'society',
      title: 'History, Heritage & Cultural Identity',
      description: 'Talk about history, ancient civilizations, your family roots and what makes up your identity.',
      level: 'B2',
      emoji: '🏛️',
      fromCourse: true,
      warmUp: [
        'Which period of history would you like to visit?',
        'What do you know about your great-grandparents?',
      ],
      grammar: {
        title: 'The past perfect continuous',
        points: [
          { form: 'had been + V-ing', use: 'An action that continued up to a moment in the past.', example: 'Archaeologists had been digging for years when they found the tomb.' },
          { form: 'had been + V-ing + for / since', use: 'How long something continued before a past moment.', example: 'The family had been living in Nubia for centuries before the dam.' },
          { form: 'had been + V-ing to explain a past situation', use: 'Giving the reason for something in the past.', example: 'He was tired because he had been working in the sun.' },
        ],
        tip: 'Don’t use it with state verbs like know, own or believe: “They had known each other for years”, not “had been knowing”.',
      },
      discussion: [
        'Which ancient civilization interests you most, apart from Egypt’s?',
        'Should artifacts in foreign museums be returned to Egypt?',
        'What traditions have been passed down in your family?',
        'What does your identity include: your country, your religion, your family, your language?',
        'Why is it important to preserve old buildings?',
        'Do you know where your family’s roots are?',
      ],
      task: {
        prompt: 'Tell the story of an important historical discovery or a family story.',
        points: [
          'What had been happening before (past perfect continuous)',
          'What happened or was found',
          'Why it matters today',
          'What it says about identity',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My grandfather's family had been living in a Nubian village for generations when the High Dam was built and the village was flooded. They had to move north, but they kept their language, songs and food. My grandmother still passes down the old stories to us. For me, these roots are part of my identity, as much as being Egyptian. Last year, I visited the ancient temples of Abu Simbel, which were moved to save them from the water. Archaeologists and engineers had been working for years to preserve them. Standing in front of these monuments, I felt connected to my ancestors and to our civilization. Heritage isn't only in museums; it lives in families too.",
    },
    `
n | heritage | The history, traditions and buildings of a country or a group, passed down over time. | The pyramids are part of the world's heritage.
n | ancestor | A person in your family who lived a long time ago. | My ancestors were farmers.
n | civilization | A society with its own culture and way of life, especially in the past. | Ancient Egypt was a great civilization.
adj | ancient | From a time very long ago. | We visited an ancient temple in Luxor.
n | empire | A group of countries ruled by one leader or government. | The Roman Empire controlled Egypt.
n | dynasty | A series of rulers from the same family. | Ramses II belonged to the 19th dynasty.
n | monument | A building or a statue that is important in history. | Karnak is a huge monument.
n | archaeologist | A person who studies the past by digging up old objects and buildings. | Archaeologists found a new tomb in Saqqara.
n | identity | Who you are, and what makes you different from others. | Language is a big part of our identity.
n | roots | The origins of a person or a family. | She went back to Upper Egypt to find her roots.
n | artifact | An object made by people long ago, with historical interest. | The museum has thousands of artifacts.
pv | pass down | To give knowledge or objects to younger people in a family. | The recipe was passed down from my great-grandmother.
v | preserve | To keep something in its original state. | We must preserve our historic buildings.
n | descendant | A person who comes from a particular ancestor. | They're descendants of a famous family.
i | stand the test of time | To still be good or strong after a long time. | The pyramids have stood the test of time.
`
  ),
  pack(
    {
      id: 'migration-and-globalization',
      group: 'society',
      title: 'Migration, Globalization & Intercultural Communication',
      description: 'Talk about why people move between countries, how cultures meet and how to communicate across them.',
      level: 'B2',
      emoji: '🌐',
      warmUp: [
        'Do you know someone who has emigrated?',
        'What is one global brand that you use every day?',
      ],
      grammar: {
        title: 'Participle clauses',
        points: [
          { form: 'V-ing + …, main clause', use: 'Two actions at the same time, or a reason.', example: 'Living abroad, he learned to cook for himself.' },
          { form: 'Having + past participle, main clause', use: 'One action finished before another.', example: 'Having moved to Canada, she had to start over.' },
          { form: 'past participle + …, main clause', use: 'A passive meaning.', example: 'Born in Cairo, he grew up in London.' },
        ],
        tip: 'The subject of the participle clause must be the same as the main clause: “Arriving in Berlin, I felt lost”, not “Arriving in Berlin, the weather was cold”.',
      },
      discussion: [
        'Why do so many young Egyptians want to emigrate?',
        'Is globalization good or bad for local cultures?',
        'What stereotypes do people have about Egyptians?',
        'How can a country help immigrants integrate?',
        'Is the brain drain a serious problem in Egypt?',
        'Have you ever felt like a fish out of water in another culture?',
      ],
      task: {
        prompt: 'Talk about the life of someone who moved to another country.',
        points: [
          'Why they left (participle clause)',
          'What was hard at first',
          'How they integrated',
          'What they kept from their culture',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Having graduated from medical school, my friend Mona emigrated to Germany to work in a hospital. At first, she felt like a fish out of water: the language, the rules and the cold were all new. Some colleagues had stereotypes about Arab women, but most were open-minded. Working long hours, she learned German quickly and started to integrate. She lives in a very multicultural city, and she loves the diversity. She sends remittances to her family every month. Some people call doctors like her part of the brain drain, but she hopes to come back one day. For now, she has put down roots there, and she calls Berlin her second home.",
    },
    `
n | globalization | The way that countries, economies and cultures around the world are becoming more connected. | Globalization has made the world smaller.
n | migration | The movement of people from one place to another to live. | Migration from villages to cities is increasing.
v | emigrate | To leave your country to live in another one. | Her parents emigrated to Australia in the 1990s.
n | refugee | A person who has had to leave their country because of war or danger. | The camp is home to thousands of refugees.
v | integrate | To become part of a group or a society. | It takes time to integrate into a new country.
adj | multicultural | Including people of many different cultures. | London is a very multicultural city.
n | diversity | The fact of including many different kinds of people or things. | The company values diversity.
n | stereotype | A fixed, often unfair idea about what a group of people are like. | It's a stereotype that all Egyptians live near the pyramids.
n | prejudice | An unfair dislike of a group of people, not based on reason. | She faced prejudice because of her accent.
n | border | The line that divides two countries. | We crossed the border by bus.
n | brain drain | When educated and skilled people leave their country to work in another. | The brain drain is a big problem for hospitals.
n | remittance | Money that someone working abroad sends home. | Remittances help many families in Egypt.
adj | open-minded | Willing to accept ideas and ways of life that are different from your own. | Traveling made me more open-minded.
i | put down roots | To settle in a place where you plan to stay for a long time. | They bought a house and put down roots in Canada.
i | a fish out of water | A person who feels uncomfortable in an unfamiliar situation. | At my first business dinner, I felt like a fish out of water.
pv | start over | To begin again from the beginning, often in a new place. | They had to start over in a new country.
`
  ),
  pack(
    {
      id: 'education-systems',
      group: 'society',
      title: 'Education Systems & Reform',
      description: 'Talk about how schools teach, what exams measure and how education could be better.',
      level: 'B2',
      emoji: '🏫',
      warmUp: [
        'What did you like most and least about your school?',
        'Did you take private lessons in high school?',
      ],
      grammar: {
        title: 'Modal verbs in the passive',
        points: [
          { form: 'modal + be + past participle', use: 'Saying what is possible, necessary or a good idea, without saying who does it.', example: 'Classes should be made smaller.' },
          { form: 'must / have to + be + past participle', use: 'Strong necessity.', example: 'Teachers must be paid better.' },
          { form: 'can’t / couldn’t + be + past participle', use: 'Impossibility.', example: 'Creativity can’t be measured by a test.' },
        ],
        tip: 'Keep be after the modal: “Students should be taught to think”, not “Students should taught to think”.',
      },
      discussion: [
        'Why is private tutoring so common in Egypt?',
        'Does rote learning help or hurt students?',
        'Can a standardized test measure a student’s real ability?',
        'Should vocational training be respected as much as university?',
        'What would you change in the school curriculum?',
        'Why do some students drop out of school?',
      ],
      task: {
        prompt: 'Present one reform for schools in your country.',
        points: [
          'The problem now',
          'What should be changed (modal passive)',
          'Who should be involved',
          'How success could be measured',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My public school in Giza had over sixty students in each class, so it was very overcrowded. The curriculum was based on rote learning: we memorized pages to pass a standardized test. Almost everyone paid for private tutoring, because it was impossible to learn in class. Students who couldn't afford it often fell behind, and some dropped out. I believe the whole system should be reformed, not just changed a little. Exams should be designed to test understanding, and teachers must be paid enough to focus on their classes. Vocational schools should be respected too, because not everyone needs a university degree. A good school should produce well-rounded people, not just good test-takers.",
    },
    `
n | curriculum | All the subjects taught in a school, or the content of one subject. | The new curriculum includes coding.
n | tuition | The money you pay to study at a school or a university. | Tuition at private universities is very high.
n | scholarship | Money given to a student to pay for their studies. | She won a scholarship to study in Germany.
n | private tutoring | Lessons that students pay for outside school. | Families spend a fortune on private tutoring.
n | rote learning | Learning by repeating something until you remember it, without understanding it. | Rote learning doesn't help you think.
n | standardized test | An exam that all students take in the same way, so results can be compared. | The SAT is a standardized test.
n | reform | A change made to improve a system. | The government announced an education reform.
adj | vocational | Teaching the skills for a particular job. | He went to a vocational school to become an electrician.
adj | overcrowded | Having too many people in it. | The classrooms are overcrowded.
n | literacy | The ability to read and write. | Literacy rates have improved in rural areas.
adj | well-rounded | Having a wide range of skills and experiences. | Sports and art help children become well-rounded.
pv | drop out | To leave school or university before finishing. | He dropped out of college to start a business.
n | public school | A free school paid for by the government (in British English, a public school is a private school). | I went to a public school in Shubra.
i | learn the ropes | To learn how to do a job or an activity. | It took me a month to learn the ropes at my new school.
`
  ),
  pack(
    {
      id: 'crime-law-justice',
      group: 'society',
      title: 'Crime, Law & Justice',
      description: 'Talk about crimes, the police and the courts, and guess what happened in a case.',
      level: 'B2',
      emoji: '⚖️',
      fromCourse: true,
      warmUp: [
        'Do you watch crime series or documentaries?',
        'Do you feel safe in your neighborhood at night?',
      ],
      grammar: {
        title: 'Past modals of deduction: must have, might have, can’t have',
        points: [
          { form: 'must have + past participle', use: 'You’re almost sure something happened.', example: 'The thief must have known the code.' },
          { form: 'might / could have + past participle', use: 'It’s possible that something happened.', example: 'He might have escaped through the window.' },
          { form: 'can’t / couldn’t have + past participle', use: 'You’re almost sure something didn’t happen.', example: 'She can’t have done it; she was in Alexandria.' },
        ],
        tip: 'Don’t use mustn’t have for a negative guess: say “He can’t have seen us”, not “He mustn’t have seen us”.',
      },
      discussion: [
        'What crimes are common in big cities?',
        'Should a witness always go to the police?',
        'Is prison the best punishment for every crime?',
        'Do you think a jury is fairer than a judge?',
        'How do criminals get away with crimes?',
        'What would you do if you saw a robbery?',
      ],
      task: {
        prompt: 'Be a detective: explain what happened in a robbery.',
        points: [
          'What was stolen and where',
          'What the witnesses saw',
          'Who the suspect is and why (must have, might have, can’t have)',
          'What should happen at the trial',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last month, there was a robbery at a jewelry store near my office. The thieves must have known the store well, because they turned off the cameras first. A witness saw two men leaving in a white car at 3 a.m. The police arrested a suspect two days later: the store's former guard. He said he was innocent, but he can't have been at home, because his phone was near the store. At the trial, the evidence was strong, and the jury found him guilty. He got a sentence of seven years in prison. The victim, the store owner, said she was glad he didn't get away with it.",
    },
    `
n | crime | An illegal action that can be punished by law. | Crime has fallen in the city this year.
n | criminal | A person who has committed a crime. | The police caught the criminal at the airport.
n | witness | A person who sees a crime or an accident and can describe it. | The witness described the car to the police.
n | suspect | A person who the police think might have committed a crime. | The suspect was questioned for hours.
n | trial | A formal meeting in a court to decide if someone is guilty. | The trial lasted three weeks.
adj | guilty | Having done a crime. | The jury found him guilty of theft.
adj | innocent | Not guilty of a crime. | She says she is innocent.
n | sentence | A punishment given by a judge. | He got a five-year sentence.
n | prison | A building where criminals are kept as a punishment. | He spent ten years in prison.
v | arrest | (Of the police) to take someone to answer questions about a crime. | The police arrested three men.
n | victim | A person who has been hurt or killed by a crime or an accident. | The victims of the fraud lost their savings.
n | jury | A group of people in a court who decide if someone is guilty. | The jury took two days to decide.
pv | get away with | To do something wrong and not be punished for it. | He thought he could get away with it.
p | break the law | To do something illegal. | Driving without a license is breaking the law.
n | robbery | The crime of stealing from a person or a place, often using force. | There was an armed robbery at the bank.
i | catch someone red-handed | To find someone while they are doing something wrong. | The police caught the thief red-handed.
`
  ),
  pack(
    {
      id: 'art-and-architecture',
      group: 'society',
      title: 'Art, Design, Architecture & Cultural Criticism',
      description: 'Describe buildings, paintings and design, and give and explain your opinion about art.',
      level: 'B2',
      emoji: '🎨',
      warmUp: [
        'What’s the most beautiful building you’ve ever seen?',
        'Do you prefer modern art or traditional art?',
      ],
      grammar: {
        title: 'Cleft sentences for emphasis',
        points: [
          { form: 'What + clause + is/was + …', use: 'Putting the focus on one part of the sentence.', example: 'What I love about this building is the light.' },
          { form: 'It is/was + focus + that/who + clause', use: 'Stressing one piece of information.', example: 'It was the architect who chose the colors.' },
          { form: 'The thing / The reason (why) + clause + is …', use: 'Other ways to add emphasis.', example: 'The reason I like abstract art is that it makes me think.' },
        ],
        tip: 'After What … is, use a noun or a clause, not another subject: “What I need is time”, not “What I need it is time”.',
      },
      discussion: [
        'Which building in your city is a masterpiece? Why?',
        'Should old buildings be torn down to build new ones?',
        'Is abstract art real art?',
        'Do you prefer minimalist design or ornate design?',
        'Should cities pay artists to paint murals?',
        'What would you change about your city’s skyline?',
      ],
      task: {
        prompt: 'Review a building or a work of art you know.',
        points: [
          'Where it is and who made it',
          'What it looks like',
          'What you like about it most (cleft sentence)',
          'What a critic might say against it',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My favorite building in Cairo is the Baron Empain Palace in Heliopolis. It was a Belgian businessman who built it, and a French architect who designed it to look like a Hindu temple. What makes it special is the ornate decoration: elephants, dancers and gods cover its walls. For years it was empty, and people were afraid it would be torn down. Now it has been restored and holds exhibitions. Some critics say it doesn't fit the city's architecture, but for me, it's a masterpiece. Compared with the minimalist towers in the new capital, it's much more eye-catching. Beauty is in the eye of the beholder, I guess.",
    },
    `
n | masterpiece | A work of art that is extremely good. | The Mona Lisa is a masterpiece.
n | exhibition | A public show of art or objects. | There's a photo exhibition at the Opera House.
n | gallery | A room or a building where people can see works of art. | The gallery shows young Egyptian artists.
n | sculpture | A work of art made by shaping stone, wood or metal. | There's a huge sculpture in the square.
n | architect | A person whose job is to design buildings. | The architect designed a green building.
n | architecture | The design and style of buildings. | Islamic architecture is full of domes.
adj | abstract | (Of art) using shapes and colors, not showing real people or things. | I don't understand abstract paintings.
n | mural | A large painting on a wall. | Students painted a mural on the school wall.
n | skyline | The shape of a city's buildings against the sky. | Dubai has an amazing skyline.
n | critic | A person whose job is to give opinions about books, movies or art. | The critics loved the movie.
adj | ornate | Covered with a lot of detailed decoration. | The palace has ornate ceilings.
adj | minimalist | Using very few, simple things. | Their apartment is minimalist and white.
pv | tear down | To destroy a building on purpose. | They tore down the old movie theater to build a mall.
adj | eye-catching | Very attractive or easy to notice. | The poster is very eye-catching.
i | beauty is in the eye of the beholder | Different people have different ideas about what is beautiful. | You think it's ugly? Well, beauty is in the eye of the beholder.
`
  ),
  pack(
    {
      id: 'ethics-and-responsibility',
      group: 'society',
      title: 'Ethics, Equality & Social Responsibility',
      description: 'Talk about right and wrong, fairness, equality and what we owe our community.',
      level: 'B2',
      emoji: '🤲',
      fromCourse: true,
      warmUp: [
        'Have you ever volunteered for a good cause?',
        'What’s one unfair thing in society that you’d like to change?',
      ],
      grammar: {
        title: 'be supposed to, be allowed to and had better',
        points: [
          { form: 'be supposed to + base verb', use: 'What the rules or other people expect.', example: 'Companies are supposed to pay their taxes.' },
          { form: 'be (not) allowed to + base verb', use: 'What the rules permit or don’t permit.', example: 'Children aren’t allowed to work.' },
          { form: 'had better (not) + base verb', use: 'Strong advice, often with a warning.', example: 'You’d better not ignore the problem.' },
        ],
        tip: 'had better is followed by the base verb, without to: “You’d better go”, not “You’d better to go”.',
      },
      discussion: [
        'Do big companies have a duty to help the community?',
        'Is it enough to donate money, or should people volunteer their time?',
        'Where do you see inequality or discrimination in daily life?',
        'What does it mean to be a good citizen?',
        'Why is corruption so hard to stop?',
        'When should you stand up for someone, even if it’s risky?',
      ],
      task: {
        prompt: 'Talk about one way people can make a difference in their community.',
        points: [
          'The problem you see',
          'What people are supposed to do, and what they actually do',
          'What you have done or would do',
          'A warning or strong advice (had better)',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "In my neighborhood, many families live in poverty, and the inequality is clear when you walk ten minutes to the rich area. Last Ramadan, I volunteered with a charity that gives food to families in need. Some rich people donate a lot, but others say helping isn't their duty. I believe everyone is supposed to pitch in some way, even with a little time. I've also seen discrimination against people from Upper Egypt, and I try to stand up for them when I hear jokes. Corruption makes things worse, because the money doesn't reach the people who need it. If we want a fair society, we'd better start with ourselves. Small actions really can make a difference.",
    },
    `
n | ethics | The moral principles that guide what is right and wrong. | The company has a strong code of ethics.
n | equality | The same rights and chances for everyone. | Women are still fighting for equality at work.
n | discrimination | Treating someone unfairly because of their race, sex, religion or another reason. | Discrimination at work is against the law.
v | volunteer | To offer to do work without being paid. | I volunteer at a hospital on Saturdays.
v | donate | To give money or goods to help people. | We donated clothes to a charity.
n | community | The people who live in an area, or share interests. | The mosque is the center of our community.
n | poverty | The state of being very poor. | Millions of people live in poverty.
n | inequality | An unfair situation where some people have more rights or chances than others. | Income inequality is growing.
adj | fair | Treating people equally and in a right way. | It's not fair that he gets more money.
n | citizen | A person who belongs to a country and has rights there. | Every citizen has the right to vote.
n | duty | Something you must do because it's right or part of your job. | It's our duty to help our neighbors.
n | corruption | Dishonest behavior by people in power, for example taking money. | The minister was accused of corruption.
pv | pitch in | To join others to help with something. | The whole street pitched in to clean the park.
pv | stand up for | To defend someone or something that is being attacked. | You should stand up for what's right.
i | make a difference | To have a good effect on a situation. | Volunteering can really make a difference.
`
  ),
  pack(
    {
      id: 'housing-costs',
      group: 'society',
      title: 'Housing Costs & Tenants’ Rights',
      description: 'Discuss rising rents, the housing shortage and the rights of people who rent.',
      level: 'B2',
      emoji: '🏢',
      revisits: 'housing-rent-or-buy',
      warmUp: [
        'How much of a salary should go on rent?',
        'Is it harder to find a home now than ten years ago?',
      ],
      grammar: {
        title: 'Quantifiers and proportions: a third of, the majority of, hardly any',
        points: [
          { form: 'a third / half / most / the majority of + the/possessive + noun', use: 'Giving proportions.', example: 'The majority of young people can’t afford to buy.' },
          { form: 'hardly any / very few / very little', use: 'Very small amounts.', example: 'There are hardly any affordable apartments downtown.' },
          { form: 'none / neither / both / all of + them/us', use: 'Talking about all or nothing in a group.', example: 'None of my friends own their homes.' },
        ],
        tip: 'After the majority of and a lot of, the verb agrees with the noun: “The majority of tenants are young”, “The majority of the money is spent on rent”.',
      },
      discussion: [
        'Why are homes so expensive in Egyptian cities?',
        'Should the government control rents?',
        'What rights should tenants have?',
        'Is gentrification good or bad for a neighborhood?',
        'Would you live in a compound outside the city? Why?',
        'What happens to people who are priced out of the city?',
      ],
      task: {
        prompt: 'Explain the housing problem in your city to a foreign journalist.',
        points: [
          'How much homes and rents cost (proportions)',
          'Who is affected most',
          'What tenants worry about',
          'One solution you support',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "In my city, the housing market has changed dramatically in five years. The majority of young couples I know can't afford to buy; even the down payment is too high. Rents have nearly doubled, and hardly any apartments downtown are affordable for a teacher's salary. Many families have been priced out of the areas where they grew up. New compounds outside the city are overpriced, and they're far from work. There's a real housing shortage, but thousands of homeowners keep apartments empty as investments. Some tenants live in fear of eviction when their contract ends. I think rent control for long-term tenants would help, because everyone deserves a roof over their head.",
    },
    `
adj | affordable | Cheap enough for most people to buy. | We need more affordable housing.
n | eviction | Forcing someone, by law, to leave the home they rent. | The family faced eviction after missing the rent.
n | housing shortage | A situation where there aren't enough homes for the people who need them. | The housing shortage has pushed prices up.
n | homeowner | A person who owns their home. | Homeowners pay taxes on their property.
n | rent control | A law that limits how much landlords can raise the rent. | Old rent control laws kept rents very low.
adj | overpriced | Costing more than it is worth. | Apartments in that compound are overpriced.
n | gentrification | When richer people move into a poor area, which changes it and raises prices. | Gentrification is changing the old neighborhood.
n | down payment | The first payment you make when you buy something expensive, with the rest paid later. | We saved for years for the down payment.
n | square meter | A unit of area: a square with sides of one meter. | The price is 40,000 pounds per square meter.
n | compound | A group of buildings with a wall around it, where people live with shared services. | They moved to a gated compound.
v | evict | To force someone, by law, to leave the home they rent. | The landlord can't evict you without a court order.
p | price someone out | To make something too expensive for someone. | Young people are being priced out of the city.
n | housing market | The buying and selling of homes in an area. | The housing market slowed down this year.
i | a roof over your head | A place to live. | At least we have a roof over our heads.
pv | move out | To leave the home where you live. | Young people can't afford to move out of their parents' home.
`
  ),
  pack(
    {
      id: 'ai-at-work',
      group: 'work',
      title: 'Artificial Intelligence at Work & School',
      description: 'Discuss how AI tools are changing jobs, studying and productivity, and what the future may bring.',
      level: 'B2',
      emoji: '🤖',
      fromCourse: true,
      revisits: 'digital-life',
      warmUp: [
        'Do you use AI tools? For what?',
        'Which jobs do you think AI will change most?',
      ],
      grammar: {
        title: 'Predictions: be likely to, be bound to, may well',
        points: [
          { form: 'be likely / unlikely to + base verb', use: 'Saying how probable something is.', example: 'AI is likely to change customer service jobs.' },
          { form: 'be bound to + base verb', use: 'Saying something is almost certain.', example: 'Some jobs are bound to disappear.' },
          { form: 'may well / could well + base verb', use: 'Saying something is quite possible.', example: 'AI may well create new kinds of jobs.' },
        ],
        tip: 'Use will for strong predictions and may or might for weaker ones; be likely to sits in the middle and sounds natural in discussions.',
      },
      discussion: [
        'Is it cheating to use a chatbot for homework?',
        'Which tasks would you happily let AI automate?',
        'Will AI replace teachers, doctors or programmers?',
        'How do you check the accuracy of what an AI tool tells you?',
        'Does relying on AI make people less creative?',
        'What skills do humans need to keep up with AI?',
      ],
      task: {
        prompt: 'Give a short talk: “How AI will change my field in ten years.”',
        points: [
          'What AI can already do in your field',
          'Two predictions (be likely to, be bound to, may well)',
          'One risk',
          'What you’ll do to keep up',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "At the call center where I work, AI is already transforming our jobs. A chatbot now answers simple questions, so we only take the difficult calls. It has made us more productive, but some colleagues worry that machines are bound to replace them. Personally, I think AI is likely to take over routine tasks, not whole jobs. Customers still want the human touch when they're angry or confused. I use an AI assistant to write my reports, but I always check its accuracy, because it sometimes invents facts. The real danger is too much reliance on it. To keep up with these changes, I'm learning how to write good prompts and how machine learning works.",
    },
    `
n | chatbot | A computer program that answers people's questions in a conversation. | The bank's chatbot answered my question in seconds.
n | machine learning | A type of AI in which computers learn from data without being programmed for every task. | Machine learning helps apps recommend videos.
v | automate | To make a process work by machine, without people. | The company automated its billing system.
v | replace | To take the place of someone or something. | Will robots replace factory workers?
v | generate | To produce something. | The app can generate a summary of a long text.
n | accuracy | The quality of being correct. | Check the accuracy of the information.
n | productivity | The amount of work that is done in a period of time. | New tools have increased productivity.
v | cheat | To act dishonestly, for example in an exam. | Using AI to write your essay is cheating.
n | assistant | A person or a program that helps someone. | My phone's voice assistant sets my alarms.
n | prompt | An instruction that you give to an AI program. | Write a clear prompt to get a better answer.
n | reliance | The state of depending on something. | Our reliance on technology is growing.
pv | take over | To start doing a task instead of someone else. | Machines have taken over many factory jobs.
pv | keep up with | To learn about the newest developments in something. | It's hard to keep up with changes in technology.
v | transform | To change something completely. | The internet transformed the way we shop.
n | human touch | Kindness and personal attention that a machine can't give. | Patients still need the human touch.
i | a double-edged sword | Something that has both good and bad effects. | AI is a double-edged sword for workers.
`
  ),
  pack(
    {
      id: 'public-health',
      group: 'society',
      title: 'Public Health & Healthcare',
      description: 'Discuss healthcare, vaccines, diseases and what governments and people should have done differently.',
      level: 'B2',
      emoji: '🏥',
      revisits: 'wellbeing-and-stress',
      warmUp: [
        'How good is healthcare where you live?',
        'Have you ever waited a long time to see a doctor?',
      ],
      grammar: {
        title: 'should have and could have: past criticism',
        points: [
          { form: 'should have + past participle', use: 'Saying something was the right thing to do, but didn’t happen.', example: 'The government should have prepared earlier.' },
          { form: 'shouldn’t have + past participle', use: 'Saying something was a mistake.', example: 'People shouldn’t have ignored the warnings.' },
          { form: 'could have + past participle', use: 'A possibility that wasn’t used.', example: 'Many deaths could have been prevented.' },
        ],
        tip: 'Say “should have done”, never “should of done” (it sounds the same, but it’s wrong).',
      },
      discussion: [
        'Should healthcare be free for everyone?',
        'What did the COVID-19 pandemic teach us about public health?',
        'Are vaccines a personal choice or a public duty?',
        'Why is obesity growing in Egypt?',
        'Is prevention more important than treatment?',
        'What should the health system have done better during the pandemic?',
      ],
      task: {
        prompt: 'Talk about a health problem in your country and what should have been done.',
        points: [
          'The problem and how it spread',
          'What should have been done (should have)',
          'What could have been prevented (could have)',
          'What should be done now',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "The pandemic showed how important public health is. When the virus spread in 2020, hospitals were full, and waiting lists for normal treatment became very long. Looking back, many countries should have prepared for an outbreak much earlier. Some infections could have been prevented if people had followed the rules. The vaccines came fast, and they saved millions of lives. Today, I think we should focus more on prevention: obesity and diabetes are growing epidemics in Egypt. An early diagnosis is cheaper than years of treatment. Health insurance for everyone would help too. As they say, an ounce of prevention is worth a pound of cure.",
    },
    `
n | public health | The health of all the people in a country, and the work done to protect it. | Smoking is a public health problem.
n | healthcare | The services that look after people's health. | Healthcare should be available to everyone.
n | vaccine | A substance given to people to protect them from a disease. | The vaccine protects against the flu.
n | epidemic | A disease that affects many people in a place at the same time. | There's an epidemic of diabetes in the region.
n | pandemic | A disease that spreads across the whole world. | The pandemic changed how we work.
n | outbreak | The sudden start of a disease. | There was an outbreak of cholera in the village.
n | prevention | Stopping something bad from happening. | Prevention is better than cure.
n | insurance | An arrangement where you pay a company and it pays your costs if you get sick or have an accident. | My job includes health insurance.
n | waiting list | A list of people who are waiting for something, such as a treatment. | There's a six-month waiting list for the operation.
n | diagnosis | Identifying what illness someone has. | The doctor gave a diagnosis of asthma.
n | treatment | Medical care for an illness or an injury. | She's getting treatment at a private hospital.
n | infection | A disease caused by bacteria or a virus. | Wash your hands to avoid infection.
n | obesity | Being very fat, in a way that is dangerous for your health. | Childhood obesity is increasing.
pv | wipe out | To destroy something completely. | The disease wiped out half the village.
i | an ounce of prevention is worth a pound of cure | It's better to stop a problem early than to fix it later. | Get a check-up every year; an ounce of prevention is worth a pound of cure.
`
  ),
  pack(
    {
      id: 'food-industry',
      group: 'society',
      title: 'The Food Industry & Food Waste',
      description: 'Discuss how food is produced, processed and sold, and why so much of it is wasted.',
      level: 'B2',
      emoji: '🏭',
      revisits: 'food-culture',
      warmUp: [
        'How much food does your family throw away in a week?',
        'Do you read the labels on food packages?',
      ],
      grammar: {
        title: 'Cause and effect: lead to, result in, due to',
        points: [
          { form: 'lead to / result in + noun', use: 'Saying what something causes.', example: 'Too much sugar can lead to obesity.' },
          { form: 'due to / because of + noun', use: 'Saying what caused something.', example: 'Prices rose due to the shortage.' },
          { form: 'As a result, … · Therefore, …', use: 'Linking a cause and a result between sentences.', example: 'Farmers lost their crops. As a result, prices went up.' },
        ],
        tip: 'due to is followed by a noun, not a clause: “due to the drought”, not “due to it didn’t rain”.',
      },
      discussion: [
        'Why does so much food go to waste?',
        'Is organic food worth the extra money?',
        'Do you check expiration dates? Do you follow them?',
        'What happens to leftovers in your home?',
        'How do food shortages affect prices?',
        'Should supermarkets give unsold food to people in need?',
      ],
      task: {
        prompt: 'Suggest ways to reduce food waste at home or in a restaurant.',
        points: [
          'How much food is wasted and why',
          'What it leads to (lead to, result in)',
          'Two practical solutions',
          'What you will do yourself',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Around a third of the world's food is wasted, and a lot of it happens at home. In my family, we used to throw away bread and leftovers every day. Food waste leads to higher prices and more pollution, because food that spoils in landfills produces gas. The supply chain is also a problem: farmers lose crops due to bad roads and poor storage. In supermarkets, a lot of processed food is thrown away before its expiration date. I've started reading labels, buying less and freezing food before it spoils. Some restaurants in Cairo now give their extra food to charities. Our consumption habits need to change if we want enough food for everyone.",
    },
    `
n | food waste | Food that is thrown away instead of being eaten. | Restaurants produce a lot of food waste.
adj | processed | (Of food) changed in a factory, often with added chemicals. | Try to eat less processed meat.
adj | organic | Grown without artificial chemicals. | Organic vegetables are more expensive.
n | supply chain | The system of producing a product and getting it to customers. | Problems in the supply chain caused shortages.
n | additive | A chemical added to food to make it taste better or last longer. | This juice is free of additives.
n | label | A piece of paper on a product with information about it. | Read the label to check the sugar.
n | expiration date | The date after which food should not be eaten (American English). | The milk is past its expiration date.
n | packaging | The materials used to wrap or protect goods. | There's too much plastic packaging.
n | leftovers | Food that is not eaten at a meal and is kept for later. | We had leftovers for lunch.
n | consumption | The amount of something that is used or eaten. | Meat consumption is falling.
n | shortage | A situation where there is not enough of something. | There's a shortage of sugar in the stores.
pv | throw away | To get rid of something you don't want. | Don't throw away the bread; we can use it tomorrow.
v | spoil | (Of food) to become old and not good to eat. | Milk spoils quickly in the summer heat.
n | crop | A plant grown in large amounts, such as wheat. | Cotton was once Egypt's main crop.
i | waste not, want not | If you don't waste things, you'll have enough. | My grandmother always said, "Waste not, want not."
`
  ),
  pack(
    {
      id: 'relationships-and-norms',
      group: 'talk',
      title: 'Relationships, Marriage & Changing Norms',
      description: 'Discuss engagement, marriage and divorce, and how expectations are changing.',
      level: 'B2',
      emoji: '💍',
      revisits: 'friendship-and-conflict',
      warmUp: [
        'At what age do people usually get married in your family?',
        'What do you think makes a marriage work?',
      ],
      grammar: {
        title: 'wish and if only',
        points: [
          { form: 'wish + past simple', use: 'Wanting the present to be different.', example: 'I wish weddings weren’t so expensive.' },
          { form: 'wish + past perfect', use: 'Regret about the past.', example: 'She wishes she had married later.' },
          { form: 'wish + would + base verb', use: 'Wanting someone else to change their behavior.', example: 'I wish my parents would stop asking when I’ll get married!' },
        ],
        tip: 'Don’t use will after wish: say “I wish you would call”, not “I wish you will call”.',
      },
      discussion: [
        'Is it better to get married young or to wait?',
        'Are arranged marriages still common in Egypt?',
        'What expectations do families have from a new couple?',
        'Why is the divorce rate rising in many countries?',
        'How important is it to get along with your in-laws?',
        'What does commitment mean to you?',
      ],
      task: {
        prompt: 'Talk about how marriage in your family has changed over three generations.',
        points: [
          'How your grandparents got married',
          'How things are different now',
          'One thing you wish were different (wish)',
          'What you think makes a relationship last',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My grandparents had an arranged marriage: they met only twice before the engagement. Today, things are different. My cousin met her husband at university, and they were engaged for two years before they tied the knot. Families still have high expectations, especially about the apartment and the dowry. Many young people wish weddings weren't so expensive, because couples start married life in debt. Divorce is more common than before; some couples split up in the first few years because they weren't compatible. I think commitment and respect matter more than a big wedding. My mother wishes I would settle down soon, but I want to be sure first.",
    },
    `
n | engagement | An agreement to get married, or the period before the wedding. | Their engagement lasted a year.
adj | engaged | Having agreed to get married. | My sister got engaged last month.
n | divorce | The legal ending of a marriage. | The divorce took two years.
n | commitment | A promise to stay with someone and support them. | Marriage is a big commitment.
adj | compatible | Able to have a good relationship because you are similar. | We're very compatible; we like the same things.
n | dowry | Money or property that one family gives the other when a couple marries. | In some families, the dowry is still very important.
n | in-laws | The parents and family of your husband or wife. | I get along well with my in-laws.
pv | split up | To end a marriage or a romantic relationship. | They split up after five years.
pv | break up | To end a romantic relationship. | She broke up with her boyfriend.
v | propose | To ask someone to marry you. | He proposed to her on the beach.
n | spouse | A husband or a wife. | Employees can bring their spouses to the party.
i | tie the knot | To get married. | They're tying the knot in June.
n | arranged marriage | A marriage in which the families choose the husband and the wife. | Arranged marriages are less common in cities.
n | expectations | Beliefs about what someone should do or what will happen. | My parents have high expectations of me.
pv | settle down | To start living a quiet life, often by getting married. | He wants to settle down and have children.
`
  ),
  pack(
    {
      id: 'social-media-and-fame',
      group: 'life',
      title: 'Social Media, Influencers & Celebrity Culture',
      description: 'Discuss influencers, celebrities and fame, and how social media changes the way we see people.',
      level: 'B2',
      emoji: '🌟',
      revisits: 'media-and-reviews',
      warmUp: [
        'Which influencer or celebrity do you follow?',
        'Would you like to be famous? Why or why not?',
      ],
      grammar: {
        title: 'Non-defining relative clauses',
        points: [
          { form: ', who / which + clause,', use: 'Adding extra information with commas.', example: 'Mo Salah, who plays for Liverpool, has millions of followers.' },
          { form: ', whose + noun', use: 'Extra information about possession.', example: 'The singer, whose video went viral, was only 19.' },
          { form: ', most of whom / some of which', use: 'Talking about part of a group.', example: 'She has two million followers, most of whom are teenagers.' },
        ],
        tip: 'Don’t use that in a non-defining clause: “My phone, which is new, is broken”, not “My phone, that is new, is broken”.',
      },
      discussion: [
        'Why do people want to become influencers?',
        'Should influencers say when a post is sponsored?',
        'Do celebrities have a right to privacy?',
        'How can a scandal destroy someone’s reputation?',
        'Is it healthy to follow celebrities’ lives closely?',
        'What makes a trend spread on social media?',
      ],
      task: {
        prompt: 'Talk about a celebrity or influencer, and the price of fame.',
        points: [
          'Who they are (non-defining relative clause)',
          'How they became famous',
          'The good and bad sides of being in the spotlight',
          'Would you want their life?',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My cousin, who is only 22, became an influencer almost by accident. She posted a cooking video that went viral, and within a month she had 300,000 followers. Now, brands sponsor her posts, which pays more than her old job. But fame has a price. When she made a small mistake in a video, there was a scandal, and people attacked her for days. She says her privacy is gone; paparazzi aren't a problem, but strangers film her in the street. Some people think influencers just show off, but she works hard to build her fan base. She knows her reputation can disappear overnight. Life in the spotlight looks easy, but it isn't.",
    },
    `
n | influencer | A person who is paid by companies to show and talk about products on social media. | The influencer promoted a new phone.
n | follower | A person who follows someone on social media. | She has a million followers on Instagram.
n | fame | Being known by a lot of people. | He found fame after one song.
n | celebrity | A famous person, especially in entertainment. | Celebrities often hide from photographers.
n | paparazzi | Photographers who follow famous people to take photos of them. | The paparazzi waited outside the hotel.
v | sponsor | To pay for something, such as a post or an event, in exchange for advertising. | A sports brand sponsors the team.
v | post | To put a message, a photo or a video on social media. | She posts a new video every day.
n | trend | A new fashion or a popular way of doing something. | The dance became a trend on TikTok.
n | reputation | The opinion people have of someone, based on their past behavior. | The company has a good reputation.
n | scandal | Something that shocks people because it is wrong or immoral. | The scandal ended his career.
p | go viral | To spread very quickly on the internet. | Her video went viral overnight.
pv | show off | To try to make people admire you. | He's always showing off his new car.
i | in the spotlight | Getting a lot of public attention. | She's not used to being in the spotlight.
n | fan base | All the fans of a person or a group. | The band has a huge fan base in Asia.
`
  ),
  pack(
    {
      id: 'consumerism-and-minimalism',
      group: 'life',
      title: 'Consumerism, Advertising & Minimalism',
      description: 'Discuss why we buy so much, how advertising works and the idea of living with less.',
      level: 'B2',
      emoji: '🛒',
      fromCourse: true,
      revisits: 'personal-finance',
      warmUp: [
        'What’s the last thing you bought that you didn’t really need?',
        'How many things in your closet do you never use?',
      ],
      grammar: {
        title: 'Advanced comparisons: the more … the more, far, slightly',
        points: [
          { form: 'the + comparative …, the + comparative …', use: 'Two things that change together.', example: 'The more I buy, the less happy I feel.' },
          { form: 'far / much / a lot + comparative', use: 'A big difference.', example: 'Living simply is far cheaper.' },
          { form: 'slightly / a bit + comparative', use: 'A small difference.', example: 'The brand is slightly better, but much more expensive.' },
        ],
        tip: 'Don’t add more to a comparative that already has -er: “far cheaper”, not “far more cheaper”.',
      },
      discussion: [
        'Why do people make impulse buys?',
        'How do advertisements make us want things?',
        'Is brand loyalty smart or a waste of money?',
        'Could you live as a minimalist? What would be hardest?',
        'Are young people today more materialistic than their parents?',
        'What’s something you splurged on and regretted?',
      ],
      task: {
        prompt: 'Talk about your relationship with shopping and things.',
        points: [
          'Something you bought on impulse',
          'How advertising affects you',
          'What you would get rid of',
          'A comparison (the more…, the more…)',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last year, I realized I had a problem with consumerism. My closet was full of clothes I never wore, and most of them were impulse buys after seeing an advertisement on Instagram. Every new phone felt like a must-have. Then I watched a documentary about minimalism and decided to declutter. I got rid of half my possessions and donated them to charity. Now I shop around and think twice before I splurge. I still have some brand loyalty, but I look for value for money. The fewer things I own, the calmer I feel. For me, less is more.",
    },
    `
n | consumerism | The belief that buying more things is good, and the lifestyle that goes with it. | Consumerism is bad for the planet.
n | advertisement | A picture, a video or a text that tries to persuade people to buy something. | I saw an advertisement for a new car.
n | impulse buy | Something that you buy suddenly, without planning. | The chocolate at the checkout is a classic impulse buy.
n | brand loyalty | Always buying products from the same company. | Brand loyalty is strong among phone users.
n | clutter | A lot of things in an untidy state. | Clear the clutter from your desk.
v | declutter | To remove things you don't need from a place. | I decluttered my room this weekend.
n | possessions | The things that you own. | She lost all her possessions in the fire.
n | minimalism | A way of living with only the things you really need. | Minimalism is popular among young people.
adj | materialistic | Caring too much about money and things. | He's very materialistic; he only talks about cars.
n | must-have | Something that many people want to have (informal). | This bag is the must-have of the season.
v | splurge | To spend a lot of money on something you don't need. | I splurged on a new watch.
p | get rid of | To throw away or give away something you don't want. | I got rid of my old shoes.
pv | shop around | To compare prices in different stores before buying. | Shop around before you buy a laptop.
n | rip-off | Something that costs much more than it should (informal). | Fifty pounds for a coffee? What a rip-off!
i | less is more | Simple things are often better. | When it comes to design, less is more.
`
  ),
  pack(
    {
      id: 'tourism-impact',
      group: 'society',
      title: 'Tourism and Its Impact',
      description: 'Discuss how tourism helps and harms places, and what responsible travel looks like.',
      level: 'B2',
      emoji: '🏝️',
      revisits: 'travel-stories',
      warmUp: [
        'Which tourist place in Egypt is too crowded?',
        'Do you prefer famous places or quiet ones?',
      ],
      grammar: {
        title: 'The future in the past: was going to, would',
        points: [
          { form: 'was/were going to + base verb', use: 'A plan in the past, often one that didn’t happen.', example: 'We were going to visit the temple, but it was too crowded.' },
          { form: 'would + base verb (after a past verb)', use: 'What someone expected or said about the future.', example: 'I thought the beach would be quiet.' },
          { form: 'was/were supposed to + base verb', use: 'What was planned or expected.', example: 'The tour was supposed to start at eight.' },
        ],
        tip: 'After a past verb like thought or knew, use would, not will: “I knew it would be expensive”.',
      },
      discussion: [
        'How does tourism help the local economy in Egypt?',
        'What are the problems of overtourism?',
        'Have you ever been in a tourist trap?',
        'What does ecotourism mean to you?',
        'Should famous heritage sites limit the number of visitors?',
        'How can travelers find authentic experiences off the beaten track?',
      ],
      task: {
        prompt: 'Talk about a place that tourism has changed.',
        points: [
          'What it was like before',
          'What you expected and what you found (would, was going to)',
          'The good and bad effects of tourism',
          'What should be done',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last summer, we were going to spend a quiet week in a small village on the Red Sea. I thought it would be peaceful and authentic, like it was ten years ago. Instead, I found big hotels, crowds and tourist traps selling fake souvenirs. In peak season, the beach was so crowded that we left after one day. Tourism has helped the local economy, and many families now work in hospitality. But it has also ruined the coral and commercialized the local culture. We ended up going off the beaten track to a small camp run by a Bedouin family. That was the real attraction. I believe ecotourism is the future if we want to protect places like this.",
    },
    `
n | overtourism | When too many tourists visit a place, causing damage. | Venice suffers from overtourism.
n | tourist trap | A place that attracts many tourists and charges them too much. | The cafés near the pyramids are tourist traps.
adj | authentic | Real, not a copy or made for tourists. | We ate authentic Nubian food.
n | peak season | The busiest time of year for tourism, when prices are highest. | Hotels are full in peak season.
n | ecotourism | Tourism that protects the environment and helps local people. | Ecotourism is growing in Sinai.
n | cruise | A vacation on a large ship that visits different places. | We took a Nile cruise from Luxor to Aswan.
n | hospitality | The business of hotels, restaurants and tourism; also being kind to guests. | He works in the hospitality industry.
n | heritage site | A place of historical or natural importance that is protected. | Abu Simbel is a UNESCO heritage site.
n | crowd | A large number of people together. | There was a huge crowd at the temple.
v | commercialize | To use something mainly to make money. | The festival has become too commercialized.
n | local economy | The money and businesses in a particular area. | Tourism supports the local economy.
n | attraction | A place that people visit for interest or fun. | The Grand Egyptian Museum is the main attraction.
v | ruin | To damage something badly, so that it loses its beauty or value. | Plastic is ruining our beaches.
i | off the beaten track | In a place that few people visit. | We found a quiet beach off the beaten track.
pv | flock to | To go somewhere in large numbers. | Tourists flock to Sharm in winter.
`
  ),
  pack(
    {
      id: 'cities-and-urban-life',
      group: 'society',
      title: 'Cities, Transport & Urban Life',
      description: 'Discuss life in big cities: commuting, traffic, public transportation and city planning.',
      level: 'B2',
      emoji: '🏙️',
      revisits: 'directions-and-transport',
      warmUp: [
        'How long is your daily commute?',
        'Would you rather live in a city or in the countryside?',
      ],
      grammar: {
        title: 'Preferences: would rather, prefer, had better',
        points: [
          { form: 'would rather + base verb (than)', use: 'Saying what you prefer in a situation.', example: 'I’d rather take the metro than drive.' },
          { form: 'prefer + noun/V-ing + to + noun/V-ing', use: 'General preferences.', example: 'I prefer walking to driving.' },
          { form: 'would prefer + to + base verb', use: 'Preferences in a particular situation.', example: 'I’d prefer to live closer to work.' },
        ],
        tip: 'Use the base verb after would rather, without to: “I’d rather stay”, not “I’d rather to stay”.',
      },
      discussion: [
        'What’s the worst part of your commute?',
        'Is public transportation in your city good enough?',
        'Should cars be banned from city centers?',
        'What’s better for young people: urban or rural life?',
        'How could your city reduce congestion?',
        'What would you change about the infrastructure in your area?',
      ],
      task: {
        prompt: 'Give a short talk: “How I would improve my city.”',
        points: [
          'The biggest problems (traffic, pollution, housing…)',
          'Your preferences (would rather, prefer)',
          'Two changes to the infrastructure',
          'Who would benefit',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I live on the outskirts of Cairo, and my commute takes almost two hours a day. During rush hour, the congestion is terrible, and traffic jams can last for an hour on the ring road. I'd rather take public transportation than drive, but there's no metro near my home yet. Pedestrians have it worse: the sidewalks are broken or full of parked cars. Many of my friends prefer living in rural areas to the hustle and bustle of the city. Still, cities have the best jobs and universities. If I could change one thing, I'd improve the infrastructure: more metro lines, safe sidewalks and green spaces in residential areas. Getting around would be easier for everyone.",
    },
    `
adj | urban | Connected with towns and cities. | Urban areas are growing fast.
adj | rural | Connected with the countryside. | Life in rural areas is quieter.
v | commute | To travel regularly between home and work. | I commute to Smart Village every day.
n | congestion | When there are too many cars on the roads. | Congestion in the city center is getting worse.
n | public transportation | Buses, trains and other vehicles that everyone can use (American English). | Public transportation in Cairo is cheap.
n | pedestrian | A person who is walking in a street. | The crossing is dangerous for pedestrians.
n | rush hour | The time of day when roads and trains are busiest. | Avoid the metro at rush hour.
n | infrastructure | The basic systems a city needs, such as roads, water and electricity. | The new capital has modern infrastructure.
n | sidewalk | A path at the side of a road where people walk (American English). | The sidewalk is full of parked cars.
adj | residential | (Of an area) having homes rather than offices or factories. | We live in a quiet residential area.
n | outskirts | The parts of a city that are farthest from the center. | They live on the outskirts of Giza.
i | hustle and bustle | A lot of noise and activity. | I miss the hustle and bustle of Cairo.
n | traffic jam | A long line of cars that can't move. | We were stuck in a traffic jam for an hour.
pv | get around | To travel from place to place. | It's easy to get around the city by metro.
`
  ),
  pack(
    {
      id: 'digital-wellbeing',
      group: 'life',
      title: 'Screen Time & Digital Wellbeing',
      description: 'Discuss how phones and social media affect our attention, sleep and mood, and how to use them better.',
      level: 'B2',
      emoji: '📵',
      fromCourse: true,
      revisits: 'digital-life',
      warmUp: [
        'How many hours a day do you spend on your phone?',
        'What’s the first thing you do when you wake up?',
      ],
      grammar: {
        title: 'Verb patterns that change meaning: stop, remember, try',
        points: [
          { form: 'stop + V-ing · stop + to + base verb', use: 'Stop an activity · stop one thing in order to do another.', example: 'I stopped checking my phone at night. I stopped to answer a message.' },
          { form: 'remember + V-ing · remember + to + base verb', use: 'Remember a past action · not forget to do something.', example: 'I remember deleting the app. Remember to turn off notifications.' },
          { form: 'try + V-ing · try + to + base verb', use: 'Experiment with something · make an effort.', example: 'Try putting your phone in another room. I’m trying to cut my screen time.' },
        ],
        tip: 'The meaning changes with the form: “I stopped smoking” (I don’t smoke now) is very different from “I stopped to smoke” (I paused to have a cigarette).',
      },
      discussion: [
        'Is social media designed to be addictive?',
        'How does your phone affect your sleep?',
        'Has your attention span gotten shorter?',
        'Have you ever tried a digital detox? How did it go?',
        'Do you feel fear of missing out when you’re offline?',
        'What boundaries do you set with your phone?',
      ],
      task: {
        prompt: 'Describe your relationship with your phone, and one change you’ll try.',
        points: [
          'How much time you spend and on what',
          'One effect on your sleep, mood or focus',
          'What you’ve tried (try + V-ing, stop + V-ing)',
          'What you’ll remember to do from now on',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "A year ago, my screen time was over seven hours a day. I used to scroll through my feed for hours before bed, and I suffered from sleep deprivation. Every notification pulled me back to my phone; it was almost compulsive. I realized my attention span was getting shorter: I couldn't read a book for ten minutes. So I tried a digital detox for one weekend. At first, I had a strong fear of missing out, but by Sunday I felt calm and mindful. Now I switch off notifications at nine, and I log off social media on Fridays. I still remember feeling free that weekend.",
    },
    `
n | screen time | The time you spend looking at a phone, a computer or a TV. | Children's screen time has increased.
adj | addictive | Making you want more and more, so it is hard to stop. | Some games are very addictive.
n | notification | A message on your phone that tells you something has happened. | I turned off notifications for most apps.
v | scroll | To move text or images up or down on a screen to see more. | I scrolled through the news for an hour.
n | digital detox | A period when you stop using phones and computers. | I did a digital detox for a week.
n | attention span | How long you can keep your attention on something. | Kids have short attention spans.
n | fear of missing out | Worry that others are having fun or experiences without you (FOMO). | Fear of missing out makes me check my phone.
adj | compulsive | Hard to stop or control. | Compulsive shopping can lead to debt.
v | binge-watch | To watch many episodes of a series, one after another. | I binge-watched the whole season in one weekend.
adj | mindful | Aware of your feelings and of what is happening now. | Being mindful helps me eat more slowly.
pv | switch off | To stop thinking about work or problems and relax. | I find it hard to switch off after work.
pv | log off | To stop using a website, an app or a computer. | I log off social media at nine.
n | news feed | A page on a website or an app that keeps changing to show the newest posts. | My news feed is full of ads.
n | sleep deprivation | Not having enough sleep. | Sleep deprivation affects your memory.
i | be glued to | To be unable to stop watching something. | My brother is always glued to his phone.
`
  ),
  pack(
    {
      id: 'success-and-happiness',
      group: 'talk',
      title: 'Success, Happiness & a Good Life',
      description: 'Discuss what success really means, money and happiness, and what makes a good life.',
      level: 'B2',
      emoji: '😊',
      revisits: 'goals-and-change',
      warmUp: [
        'Who is the most successful person you know? Why?',
        'Are you happier now than five years ago?',
      ],
      grammar: {
        title: 'whatever, however and no matter (what, how)',
        points: [
          { form: 'whatever + clause', use: 'Anything at all; it doesn’t matter what.', example: 'Whatever you choose, do it well.' },
          { form: 'however + adjective/adverb + clause', use: 'It doesn’t matter how.', example: 'However rich you are, you can’t buy time.' },
          { form: 'no matter what / how / who + clause', use: 'The same idea, in everyday English.', example: 'No matter how hard it gets, keep going.' },
        ],
        tip: 'These words start a clause, so you still need a main clause: “Whatever happens, I’ll be there”, not just “Whatever happens.”',
      },
      discussion: [
        'Does money bring happiness?',
        'What does success mean to you: money, family, fame or something else?',
        'Do you feel gratitude for what you have?',
        'Is it possible to have a good work-life balance in Egypt?',
        'Are people in the rat race happy?',
        'How do you live up to your family’s expectations?',
      ],
      task: {
        prompt: 'Give a short talk: “What success means to me.”',
        points: [
          'What society says success is',
          'What you think it is',
          'The role of money, family and well-being',
          'A sentence with whatever, however or no matter',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "When I was younger, I thought success meant wealth and a big title. My uncle was the example: he had money, but he worked fourteen hours a day and rarely saw his children. He was in the rat race, and he wasn't content. Now I think success is a meaningful life with balance, health and good people around you. Money matters, because it gives you peace of mind, but it can't buy well-being. I've learned to feel gratitude for small achievements, like finishing a book or helping a friend. No matter how much I earn, I want time for my family. My parents had big expectations, but I try to live up to my own standards too. Satisfaction, for me, comes from growing, not from owning.",
    },
    `
n | success | Achieving the results you wanted. | Her success comes from hard work.
n | fulfillment | The feeling of being happy because you are doing something important (American English spelling). | She found fulfillment in teaching.
n | wealth | A large amount of money or property. | He inherited his wealth from his father.
n | satisfaction | A pleasant feeling when you get what you want or need. | Helping others gives me great satisfaction.
adj | meaningful | Important, serious or having a purpose. | I want a meaningful job.
n | gratitude | The feeling of being thankful. | I wrote her a letter to show my gratitude.
adj | content | Happy and satisfied. | He's content with a simple life.
n | well-being | The state of being healthy and happy. | Exercise improves your well-being.
n | achievement | Something that you have done successfully, especially with effort. | Graduating was my biggest achievement.
n | peace of mind | A feeling of being calm and not worried. | Insurance gives me peace of mind.
i | the rat race | A way of life in which people compete for money and power. | He left the rat race to open a café in Dahab.
p | make it | To be successful. | She really made it as a singer.
pv | live up to | To be as good as someone expected. | The movie didn't live up to the hype.
n | work-life balance | The amount of time you give to your job compared with your personal life. | My new job has a better work-life balance.
`
  ),
  pack(
    {
      id: 'habit-change',
      group: 'life',
      title: 'The Psychology of Habit Change',
      description: 'Talk about how habits form and how to break bad ones and build new ones.',
      level: 'B2',
      emoji: '🔁',
      fromCourse: true,
      revisits: 'time-and-habits',
      warmUp: [
        'What good habit have you kept for the longest time?',
        'What bad habit have you tried to break?',
      ],
      grammar: {
        title: 'Present perfect continuous vs present perfect simple',
        points: [
          { form: 'have been + V-ing', use: 'An activity that started in the past and is still going on, focusing on the activity or the effort.', example: 'I’ve been going to the gym for three months.' },
          { form: 'have + past participle', use: 'A finished result or a number.', example: 'I’ve lost five kilos. I’ve read four books this month.' },
          { form: 'How long have you been …? · How many … have you …?', use: 'Asking about duration vs results.', example: 'How long have you been learning English? How many words have you learned?' },
        ],
        tip: 'Use the simple form for numbers and results: “I’ve read three books”, not “I’ve been reading three books”.',
      },
      discussion: [
        'How long does it take to form a habit?',
        'What triggers your bad habits?',
        'Is willpower enough to change a habit?',
        'How do you reward yourself for progress?',
        'What do you do after a relapse or a setback?',
        'What’s the longest streak you’ve kept on a habit app?',
      ],
      task: {
        prompt: 'Talk about a habit you’ve been building or breaking.',
        points: [
          'What the habit is and why',
          'How long you’ve been working on it (present perfect continuous)',
          'What results you’ve had (present perfect)',
          'A setback and how you dealt with it',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I've been trying to kick the habit of checking my phone in bed for three months. My trigger was simple: I put my phone next to my pillow, and the craving started as soon as I woke up. Willpower alone didn't work, so I changed my routine: my phone now charges in the kitchen. I've also been reading for twenty minutes every night as a reward. So far, I've finished six books! I had a relapse during exam week, but I didn't let one slip-up stop me. The key is consistency and gradual change, not perfection. My current streak is thirty days, and that's an important milestone for me.",
    },
    `
n | willpower | The ability to control your thoughts and actions to achieve something. | It takes willpower to stop eating sugar.
n | trigger | Something that makes you start doing something. | Stress is a trigger for my bad habits.
n | reward | Something good that you get for doing something. | Chocolate is my reward after a workout.
n | craving | A very strong wish for something, especially food or a habit. | I have a craving for coffee every morning.
n | consistency | Always doing something in the same way, regularly. | Consistency is more important than speed.
n | relapse | Going back to a bad habit or an illness after improving. | He had a relapse and started smoking again.
n | discipline | The ability to make yourself do things that are difficult. | Studying alone needs discipline.
n | setback | Something that stops progress for a while. | Losing my job was a big setback.
n | streak | A series of successes, one after another. | I'm on a 50-day streak on my language app.
i | kick the habit | To stop doing something bad that you have done for a long time. | He finally kicked the habit after twenty years.
pv | stick to | To continue doing something you decided to do. | Stick to your plan, even on hard days.
n | slip-up | A small mistake. | One slip-up doesn't mean you've failed.
adj | gradual | Happening slowly over a long time. | There's been a gradual improvement in my health.
n | milestone | An important stage in a process. | Thirty days without smoking is a milestone.
`
  ),
];
