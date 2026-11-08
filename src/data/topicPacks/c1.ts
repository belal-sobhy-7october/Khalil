/** C1 topics, built with the course method (see ./types.ts and ./README.md). */
import { pack, type TopicPack } from './types';

export const C1_PACKS: TopicPack[] = [
  pack(
    {
      id: 'critical-thinking',
      group: 'society',
      title: 'Critical Thinking & Evaluating Evidence',
      description: 'Question claims, judge sources and evidence, and spot weak arguments and bias.',
      level: 'C1',
      emoji: '🔍',
      warmUp: [
        'How do you decide whether to believe something you read online?',
        'When did you last change your mind because of evidence?',
      ],
      grammar: {
        title: 'Hedging: seem, appear, tend to, arguably',
        points: [
          { form: 'seem / appear + to + base verb', use: 'Presenting something as likely, not certain.', example: 'The data appears to support the claim.' },
          { form: 'It seems / appears that + clause', use: 'A careful conclusion.', example: 'It seems that the study was too small.' },
          { form: 'tend to + base verb · arguably · to some extent', use: 'Softening a generalization or a claim.', example: 'Younger people tend to trust online sources. This is arguably the best study so far.' },
        ],
        tip: 'Hedging is a sign of careful thinking, not weakness: “The evidence suggests…” sounds more credible than “It’s 100% proven that…”.',
      },
      discussion: [
        'What’s the difference between correlation and causation? Give an example.',
        'Why is anecdotal evidence so persuasive, even when it’s weak?',
        'How can you tell if a study is rigorous?',
        'When is it reasonable to be skeptical of experts?',
        'What assumptions do people tend to make about others too quickly?',
        'Have you ever seen someone cherry-pick data to prove a point?',
      ],
      task: {
        prompt: 'Evaluate a claim you’ve seen recently (for example, a health tip or a news story).',
        points: [
          'State the claim and its source',
          'Look at the evidence: is it rigorous or anecdotal?',
          'Point out any fallacy or hidden assumption',
          'Give a careful conclusion (hedging)',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "A popular video recently claimed that drinking coffee makes people live longer. The claim seemed plausible, but I decided to scrutinize it before sharing it. The video relied on a study that showed a correlation between coffee and long life, not causation. Coffee drinkers also tend to be richer, which could explain the result. The rest of the evidence was anecdotal: an old man who drinks five cups a day. The video also cherry-picked one study and ignored others, so its credibility is dubious. My inference is that coffee is probably harmless, but the stronger claim can't be substantiated yet. Before jumping to conclusions, it's worth weighing up all the evidence.",
    },
    `
n | assumption | Something that you believe is true without proof. | Your argument is based on a false assumption.
n | fallacy | A false idea or a mistake in reasoning. | It's a fallacy that money always brings happiness.
v | scrutinize | To examine something very carefully. | Journalists scrutinized the minister's statement.
adj | plausible | Seeming reasonable or likely to be true. | Her explanation sounded plausible.
n | credibility | The quality of being believed or trusted. | The scandal damaged his credibility.
adj | skeptical | Doubting that something is true or useful. | I'm skeptical about these diet pills.
adj | anecdotal | Based on personal stories, not on careful research. | The evidence is only anecdotal.
n | correlation | A connection between two things in which one changes when the other changes. | There's a correlation between education and income.
n | causation | The process of one thing causing another. | Correlation doesn't prove causation.
v | substantiate | To provide evidence that something is true. | He couldn't substantiate his claims.
n | inference | A conclusion that you reach based on the information you have. | What inference can we draw from these numbers?
adj | rigorous | Very careful and thorough. | The study used rigorous methods.
v | cherry-pick | To choose only the facts that support your argument. | The report cherry-picked the best results.
i | jump to conclusions | To decide something too quickly, before you know all the facts. | Don't jump to conclusions; wait for the results.
pv | weigh up | To consider something carefully before deciding. | We need to weigh up the evidence.
adj | dubious | Probably not true, honest or good. | The source of this story is dubious.
`
  ),
  pack(
    {
      id: 'decision-making-and-risk',
      group: 'work',
      title: 'Decision-Making, Risk & Strategic Trade-offs',
      description: 'Analyze hard choices, weigh risks and trade-offs, and explain the reasoning behind a decision.',
      level: 'C1',
      emoji: '🔀',
      warmUp: [
        'What’s the hardest decision you’ve made?',
        'Do you decide quickly or slowly?',
      ],
      grammar: {
        title: 'whether, otherwise and supposing',
        points: [
          { form: 'whether … or (not)', use: 'Talking about two possibilities, often after decide, consider or depend.', example: 'We need to decide whether to expand or wait.' },
          { form: 'otherwise / or else', use: 'What will happen if something isn’t done.', example: 'We must act now; otherwise, we’ll lose the market.' },
          { form: 'supposing / suppose / what if + clause', use: 'Testing an imaginary situation.', example: 'Supposing the deal fails, what’s our plan B?' },
        ],
        tip: 'Use whether, not if, after a preposition or before to: “It depends on whether they agree”, “I can’t decide whether to go”.',
      },
      discussion: [
        'What trade-offs have you made in your career or studies?',
        'Do the pros and cons always help you decide?',
        'Should leaders take calculated risks or play it safe?',
        'In hindsight, which decision would you make differently?',
        'How do companies prepare a contingency plan?',
        'When is it wise to sit on the fence?',
      ],
      task: {
        prompt: 'Explain a difficult decision a company or a person must make.',
        points: [
          'The two options and the trade-off',
          'The risks and how to mitigate them',
          'What happens otherwise (otherwise, supposing)',
          'Your recommendation',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last year, my manager faced a real dilemma: open a new branch in Alexandria or invest in an online store. Both options had serious pros and cons. The new branch was a gamble, because rents had doubled and the decision would be almost irreversible. The online store was a calculated risk: lower costs, but strong competitors. We deliberated for weeks, and we prepared a contingency plan in case sales fell. Supposing the online store failed, we could still open the branch later; otherwise, we might lose everything. In the end, the benefits of going online outweighed the risks, and we opted for that. In hindsight, it was the right choice, because nobody foresaw how fast online sales would grow.",
    },
    `
n | trade-off | A situation in which you accept something bad in order to get something good. | There's always a trade-off between price and quality.
n | dilemma | A situation in which you have to make a difficult choice. | I faced a dilemma: my career or my family.
n | hindsight | Understanding a situation only after it has happened. | In hindsight, I should have studied engineering.
n | contingency | Something that might happen in the future, which you need to plan for. | We have a contingency plan in case of a strike.
v | mitigate | To make something bad less serious. | Insurance can mitigate the risk.
v | foresee | To know that something will happen before it happens. | Nobody could foresee the crisis.
adj | irreversible | Impossible to change back. | Selling the land is an irreversible decision.
n | calculated risk | A risk taken after carefully thinking about what could happen. | Hiring her was a calculated risk.
v | deliberate | To think carefully about something before deciding. | The board deliberated for hours.
v | outweigh | To be greater or more important than something else. | The benefits outweigh the costs.
n | pros and cons | The advantages and disadvantages of something. | Let's list the pros and cons.
n | gamble | A risky action that may or may not succeed. | Moving abroad was a gamble.
i | err on the side of caution | To be more careful than necessary to avoid risk. | I'd rather err on the side of caution and wait.
i | sit on the fence | To avoid choosing between two sides. | You can't sit on the fence forever.
pv | opt for | To choose something. | We opted for the cheaper plan.
`
  ),
  pack(
    {
      id: 'ethical-dilemmas',
      group: 'society',
      title: 'Ethical Dilemmas & Competing Values',
      description: 'Discuss hard moral choices, values that conflict, and when (if ever) rules can be broken.',
      level: 'C1',
      emoji: '🧭',
      warmUp: [
        'Is it ever OK to lie?',
        'Who taught you most about right and wrong?',
      ],
      grammar: {
        title: 'Hypothetical questions: What if, Suppose, Imagine',
        points: [
          { form: 'What if + past simple …?', use: 'Asking about an imaginary situation.', example: 'What if your best friend asked you to lie for them?' },
          { form: 'Suppose / Supposing + past simple', use: 'Starting a hypothetical discussion.', example: 'Suppose you found a mistake in your favor on your salary.' },
          { form: 'Imagine (that) + past simple / past perfect', use: 'Inviting someone into a situation, present or past.', example: 'Imagine you had seen the accident. Would you have spoken up?' },
        ],
        tip: 'Use the past form after What if and Suppose for unreal situations: “What if you lost your job?” Use the present only for real possibilities.',
      },
      discussion: [
        'Is a white lie sometimes the kind thing to do?',
        'Should a whistleblower be protected or punished?',
        'Does the end ever justify the means?',
        'Where is the gray area between a gift and a bribe?',
        'When does loyalty to a friend become wrong?',
        'Is it ever right to turn a blind eye?',
      ],
      task: {
        prompt: 'Present a moral dilemma and say what you would do.',
        points: [
          'Describe the situation (Imagine…, What if…?)',
          'The values that are in conflict',
          'What your conscience says',
          'Your decision and its cost',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Imagine you work in a pharmacy and discover that your manager is selling expired medicine. That was the dilemma a friend of mine faced last year. Her loyalty to her manager, who had helped her a lot, conflicted with her integrity. What if she reported it and lost her job? What if nobody believed her? Her conscience wouldn't let her turn a blind eye, because patients could be hurt. It wasn't a gray area; it was simply wrong, and she refused to condone it. She became a whistleblower, and some colleagues condemned her for it. Some people argued that the end justifies the means, but she believed that people must be held accountable. Accepting small lies, she said, is a slippery slope.",
    },
    `
n | conscience | The part of your mind that tells you whether what you do is right or wrong. | My conscience wouldn't let me keep the money.
n | integrity | The quality of being honest and having strong moral principles. | She's a person of great integrity.
adj | moral | Connected with the principles of right and wrong. | Doctors have a moral duty to help.
n | principle | A basic belief about what is right, which guides your behavior. | It's against my principles to lie.
n | whistleblower | A person who tells the public or the authorities about wrong or illegal actions inside an organization. | The whistleblower revealed the company's fraud.
n | loyalty | The quality of always supporting someone. | Loyalty to friends is important to me.
n | gray area | A situation where it isn't clear what is right or wrong. | Using AI for homework is a gray area.
v | condone | To accept or allow behavior that is morally wrong. | We cannot condone violence.
adj | accountable | Responsible for your actions and expected to explain them. | Leaders must be held accountable.
i | the end justifies the means | A good result makes any way of getting it acceptable. | Cheating to win? The end doesn't justify the means.
i | a slippery slope | A situation that will lead to worse and worse things. | Accepting one bribe is a slippery slope.
n | white lie | A small lie told to be polite or to avoid hurting someone. | I told a white lie about liking the gift.
i | turn a blind eye | To pretend not to see something wrong. | The police turned a blind eye to the problem.
v | condemn | To say very strongly that you think something is wrong. | Everyone condemned the attack.
pv | speak up | To say what you think clearly, especially to defend someone or something. | If you see something wrong, speak up.
`
  ),
  pack(
    {
      id: 'public-policy',
      group: 'society',
      title: 'Public Policy, Institutions & Civic Debate',
      description: 'Discuss how governments make decisions, how laws are made and how citizens take part in the debate.',
      level: 'C1',
      emoji: '🏛️',
      warmUp: [
        'Which government decision has affected your life most?',
        'Do you follow political debates? Why or why not?',
      ],
      grammar: {
        title: 'Nominalization in formal language',
        points: [
          { form: 'verb → noun (implement → implementation)', use: 'Formal English often uses nouns instead of verbs.', example: 'The implementation of the law was slow.' },
          { form: 'adjective → noun (transparent → transparency)', use: 'The same with adjectives.', example: 'There’s a lack of transparency.' },
          { form: 'the + noun + of + noun', use: 'Building formal noun phrases.', example: 'The introduction of new taxes caused protests.' },
        ],
        tip: 'Nominalization makes writing more formal, but too much makes it hard to read. Mix nouns and verbs in speech.',
      },
      discussion: [
        'Should fuel and bread subsidies continue? Why or why not?',
        'How can institutions become more transparent?',
        'Why is bureaucracy so hard to reform?',
        'Who are the stakeholders when a new road is built through a neighborhood?',
        'Should companies be allowed to lobby the government?',
        'How much should public opinion influence policy?',
      ],
      task: {
        prompt: 'Argue for or against one public policy in your country.',
        points: [
          'What the policy is and its aim',
          'Who the stakeholders are',
          'The arguments for and against (use nominalization)',
          'Your recommendation',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "One policy that affects almost every Egyptian family is the subsidy on bread. Its aim is to protect the poor, but the cost to the budget is enormous. Supporters argue that the removal of the subsidy would push millions into hunger. Critics point to the lack of transparency and the waste caused by bureaucracy and red tape. In my view, the problem isn't the subsidy itself but its implementation. New legislation should target support at the people who really need it. All stakeholders, including farmers, bakers and families, should be consulted before any change. Accountability is essential, so that public money reaches the right people. Civic debate on this issue matters more than ever.",
    },
    `
n | policy | A plan of action agreed by a government or an organization. | The government announced a new housing policy.
n | legislation | A law or a set of laws. | New legislation protects workers' rights.
n | regulation | An official rule made by a government. | There are strict regulations on food safety.
n | subsidy | Money that a government pays to keep prices low or support an activity. | The bread subsidy helps poor families.
n | welfare | Help that a government gives to people who need it, such as money or healthcare. | The welfare system supports the unemployed.
n | institution | A large, important organization, such as a parliament or a university. | People are losing trust in institutions.
n | bureaucracy | A complicated system of rules and official procedures. | The bureaucracy makes it hard to start a business.
n | accountability | The fact of being responsible for your actions and expected to explain them. | We need more accountability in government.
n | transparency | Openness, so that people can see what is being done. | The company promised more transparency.
v | implement | To start using a plan or a system. | The new law will be implemented next year.
n | stakeholder | A person or a group with an interest in something, such as a project. | All stakeholders should have a say.
v | lobby | To try to persuade a government to do something. | Car companies lobbied against the new tax.
i | red tape | Official rules that seem to cause unnecessary delays. | It took months to get through the red tape.
n | public opinion | What most people think about something. | Public opinion turned against the plan.
adj | civic | Connected with a town or a city and the people who live there. | Voting is a civic duty.
pv | roll back | To reduce or remove a law, a policy or a change. | The government rolled back the tax increase after protests.
`
  ),
  pack(
    {
      id: 'geopolitics',
      group: 'society',
      title: 'Geopolitics & Global Challenges',
      description: 'Discuss international relations, conflicts over resources and the challenges no country can solve alone.',
      level: 'C1',
      emoji: '🗺️',
      warmUp: [
        'Which international news story have you followed recently?',
        'Which global challenge worries you most?',
      ],
      grammar: {
        title: 'Inversion after negative adverbials: Not only, Rarely, Never before',
        points: [
          { form: 'Not only + auxiliary + subject …, but (also) …', use: 'Adding a surprising second point, formally.', example: 'Not only did the sanctions fail, but they also hurt ordinary people.' },
          { form: 'Rarely / Seldom / Never before + auxiliary + subject', use: 'Stressing how unusual something is.', example: 'Never before have so many countries faced food shortages.' },
          { form: 'Only when / Only if + clause, auxiliary + subject', use: 'Stressing a condition.', example: 'Only when both sides talk will the tension ease.' },
        ],
        tip: 'After a negative adverb at the start, use question word order: “Rarely do leaders admit mistakes”, not “Rarely leaders admit mistakes”. Keep this for speeches and essays.',
      },
      discussion: [
        'Why is water a geopolitical issue for Egypt?',
        'Do sanctions work, or do they mostly hurt ordinary people?',
        'Can diplomacy solve every conflict?',
        'What role should superpowers play in world problems?',
        'How can countries protect food security?',
        'Why do tensions between countries sometimes escalate quickly?',
      ],
      task: {
        prompt: 'Give a short talk about one global challenge.',
        points: [
          'What the challenge is and which countries are involved',
          'The interests and tensions',
          'What has been tried (sanctions, diplomacy, alliances)',
          'Your view, with one inversion',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Few issues show the importance of geopolitics as clearly as water in the Nile basin. For Egypt, the river is a matter of survival, while upstream countries see it as a resource for development and sovereignty. Tension rises whenever a new dam is built, and some fear the situation could escalate. Not only does the dispute affect farmers, but it also shapes alliances in the region. Diplomacy has been slow, but rarely has a conflict over water been solved by force. Food security, climate change and migration are all linked to it. Only when countries treat the river as a shared resource will a lasting agreement be possible. For me, it's the clearest example that global challenges need cooperation, not just power.",
    },
    `
n | geopolitics | How a country's position, resources and power affect its relations with other countries. | Oil has shaped the geopolitics of the region.
n | sovereignty | A country's power to govern itself. | The country defended its sovereignty.
n | sanctions | Official orders that limit trade with a country to force it to obey rules. | The UN imposed sanctions on the country.
n | alliance | An agreement between countries to work together. | The two countries formed an alliance.
n | diplomacy | Managing relations between countries through discussion. | The crisis was solved through diplomacy.
n | superpower | A country with very great military and economic power. | The US and China are superpowers.
n | ceasefire | An agreement to stop fighting for a period. | Both sides agreed to a ceasefire.
adj | humanitarian | Connected with helping people who are suffering. | They sent humanitarian aid to the region.
n | tension | A situation in which people or countries don't trust each other and may become angry. | There's growing tension at the border.
v | escalate | To become worse or more serious. | The protest escalated into violence.
n | resource | Something valuable that a country has and can use, such as water or oil. | Water is our most precious resource.
n | food security | Having enough affordable, healthy food. | Climate change threatens food security.
n | balance of power | A situation in which countries have similar strength, so no one controls the others. | The war changed the balance of power.
i | add fuel to the fire | To make a bad situation worse. | His speech only added fuel to the fire.
pv | step in | To become involved in a difficult situation in order to help. | The UN stepped in to stop the fighting.
`
  ),
  pack(
    {
      id: 'future-of-society',
      group: 'society',
      title: 'The Future of Society',
      description: 'Imagine life in thirty years: technology, families, cities, work and what we might gain or lose.',
      level: 'C1',
      emoji: '🔭',
      warmUp: [
        'What do you think your city will look like in 2060?',
        'Which invention would you most like to see in your lifetime?',
      ],
      grammar: {
        title: 'Unlikely futures: were to and should in conditionals',
        points: [
          { form: 'If + subject + were to + base verb, would', use: 'A future that is possible but unlikely, or imaginary.', example: 'If robots were to do all our jobs, how would we earn money?' },
          { form: 'If + subject + should + base verb, will / imperative', use: 'A possible but not very likely situation; formal.', example: 'If the power grid should fail, the city will stop.' },
          { form: 'Were + subject + to + base verb, would', use: 'The same, very formal, without if.', example: 'Were governments to ban social media, people would find other ways to connect.' },
        ],
        tip: 'In formal English, use were for every subject: “If the population were to double…”, not “was to double”.',
      },
      discussion: [
        'Will virtual reality bring people closer or make them lonelier?',
        'Is the future more likely to be utopian or dystopian?',
        'How will an aging population change Egypt one day?',
        'If life expectancy were to reach 120, how would families change?',
        'Which jobs or habits will be phased out first?',
        'Is rapid change inevitable, or can societies slow it down?',
      ],
      task: {
        prompt: 'Describe life in Egypt in 2060.',
        points: [
          'One thing that will be better',
          'One thing that may be worse',
          'A sentence with If … were to …',
          'How you will be different',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Nobody can predict the future, but some trends are already clear in the foreseeable future. Life expectancy is rising, so even a young country like Egypt will face an aging population. Urbanization will continue, and cities will become more interconnected through technology. Gasoline cars will probably be phased out, and virtual reality may replace many classrooms and offices. Some films show a dystopian world controlled by machines, while others imagine a utopian one where nobody has to work. If technology were to replace most jobs, we would need a paradigm shift in how we think about work and money. The speed of change is unprecedented, and some disruption is inevitable. Only time will tell which future we choose.",
    },
    `
adj | foreseeable | Able to be known or predicted (in the foreseeable future = soon enough to plan for). | Prices won't fall in the foreseeable future.
adj | dystopian | Describing an imaginary society where everything is extremely bad. | The novel describes a dystopian future.
adj | utopian | Describing an imaginary perfect society, or ideas too perfect to be practical. | A world without crime sounds utopian.
n | aging population | A population in which the number of older people is growing. | Japan has an aging population.
n | life expectancy | The number of years a person is expected to live. | Life expectancy has risen in the last fifty years.
n | virtual reality | Images and sounds made by a computer that seem real, which you experience with a special headset. | Doctors train with virtual reality.
adj | interconnected | Connected with each other, so each part affects the others. | The world's economies are interconnected.
n | urbanization | The process by which more people move to and live in cities. | Urbanization puts pressure on housing.
adj | inevitable | Certain to happen and impossible to avoid. | Some job losses are inevitable.
adj | unprecedented | Never having happened before. | The pandemic caused unprecedented changes.
n | paradigm shift | A very big change in the usual way of thinking about something. | The internet caused a paradigm shift in education.
pv | phase out | To stop using something slowly over a period of time. | Plastic bags are being phased out.
i | only time will tell | We will know the answer only in the future. | Will the plan work? Only time will tell.
n | outlook | The likely future situation. | The economic outlook for young people is uncertain.
n | disruption | A situation in which something can't continue normally. | AI will cause disruption in many industries.
`
  ),
  pack(
    {
      id: 'systems-thinking',
      group: 'work',
      title: 'Systems Thinking & Complex Problem-Solving',
      description: 'Analyze problems with many causes, see how parts of a system affect each other and design solutions that last.',
      level: 'C1',
      emoji: '🧩',
      warmUp: [
        'What is a problem in your city that never seems to get solved?',
        'Have you ever fixed one problem and created another?',
      ],
      grammar: {
        title: 'Formal linking: consequently, thereby, hence, whereby',
        points: [
          { form: 'Consequently, / As a consequence, + clause', use: 'Introducing a result, formally.', example: 'Rents rose sharply. Consequently, workers moved further away.' },
          { form: 'thereby + V-ing', use: 'Showing a result of the action just described.', example: 'The city built more roads, thereby attracting more cars.' },
          { form: 'hence + noun or clause', use: 'Introducing a conclusion, very formally.', example: 'The data was incomplete; hence the wrong decision.' },
          { form: 'whereby + clause', use: 'Describing a system or an arrangement.', example: 'They introduced a scheme whereby companies pay for their pollution.' },
        ],
        tip: 'These words are for formal writing and presentations; in conversation, use so, because of that and that’s why.',
      },
      discussion: [
        'Why do some solutions create new problems (unintended consequences)?',
        'What’s a vicious circle you’ve seen at work or in society?',
        'How do you get to the root cause of a problem?',
        'Is the traffic problem in Cairo the tip of the iceberg? What’s underneath?',
        'What is a small change that had a ripple effect in your life?',
        'When does trial and error work, and when is it too risky?',
      ],
      task: {
        prompt: 'Analyze a complex problem in your city or workplace.',
        points: [
          'The visible problem and the root cause',
          'How parts of the system affect each other (feedback loop, vicious circle)',
          'One unintended consequence of an old solution',
          'A holistic solution (use formal linking words)',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Traffic in Cairo is a classic example of a complex problem. For years, the response was to build more bridges and roads, thereby encouraging more people to drive. Consequently, traffic got worse, which is a vicious circle. The real root cause is that homes, jobs and schools are far apart, and public transportation is weak. Long commutes also have a ripple effect on health, productivity and family life. The bottleneck isn't the roads but the way the city is planned. A holistic solution would tackle housing, transport and work together, rather than one at a time. These problems are interdependent; hence, small fixes rarely work. To get to the bottom of it, we need data, patience and some trial and error.",
    },
    `
n | root cause | The main reason behind a problem. | We need to find the root cause, not just fix the symptoms.
n | ripple effect | A situation in which one event causes others, which then cause more. | The factory closing had a ripple effect on the town.
n | bottleneck | The part of a process that slows down everything else. | The single cashier was the bottleneck.
n | feedback loop | A process in which the result of an action affects the next action. | Likes on social media create a feedback loop.
n | unintended consequences | Results of an action that were not planned or expected. | The new law had unintended consequences.
adj | interdependent | Depending on each other. | The economy and the environment are interdependent.
adj | holistic | Dealing with the whole of something, not just its parts. | We need a holistic approach to health.
n | leverage | The power to influence people or situations. | Big companies have a lot of leverage.
adj | underlying | Real, but not obvious; basic. | Stress was the underlying cause of his illness.
v | tackle | To deal with a difficult problem. | The government must tackle unemployment.
n | trial and error | A way of solving problems by trying different methods until one works. | I learned to cook by trial and error.
i | the tip of the iceberg | A small, visible part of a much bigger problem. | These complaints are just the tip of the iceberg.
i | think outside the box | To think in a new and creative way. | We need to think outside the box.
i | get to the bottom of | To discover the real cause of something. | The police are trying to get to the bottom of it.
n | vicious circle | A bad situation in which one problem causes another, which makes the first worse. | Debt can become a vicious circle.
pv | break down | To divide something into smaller parts so it is easier to understand. | Let's break the problem down into steps.
`
  ),
  pack(
    {
      id: 'future-of-work',
      group: 'work',
      title: 'Automation & the Future of the Labor Market',
      description: 'Analyze how automation will reshape jobs, who gains and loses, and what workers and governments should do.',
      level: 'C1',
      emoji: '🏭',
      revisits: 'economy-and-future-of-work',
      warmUp: [
        'Which jobs in your family could be done by machines in twenty years?',
        'Would you accept a lower salary for more job security?',
      ],
      grammar: {
        title: 'Fronting and emphatic do',
        points: [
          { form: 'do / does / did + base verb', use: 'Adding emphasis, often to contrast with what someone said.', example: 'Automation does create jobs, but not for everyone.' },
          { form: 'object or phrase moved to the front', use: 'Putting the focus on new or contrasting information.', example: 'This kind of job, machines will never do.' },
          { form: 'What … is / Where … is', use: 'Pseudo-cleft sentences to focus on one point.', example: 'What worries me is the speed of the change.' },
        ],
        tip: 'Use emphatic do when you correct or contrast: “I don’t think it’ll help.” “It does help; I’ve seen it.” Don’t use it in every sentence.',
      },
      discussion: [
        'Which groups of workers are most at risk of displacement?',
        'Should governments introduce a universal basic income?',
        'Who should pay to reskill workers: companies, the state or individuals?',
        'Is lifelong learning realistic for people with families and two jobs?',
        'How precarious is work for young people in Egypt?',
        'What makes a career future-proof?',
      ],
      task: {
        prompt: 'Give recommendations on preparing the workforce for automation.',
        points: [
          'Which jobs will change and which will disappear',
          'The risks for workers (displacement, precarious work)',
          'Two recommendations for government or companies',
          'Emphasis: what really matters is… / it does…',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "The labor market is going through its biggest transition since the industrial revolution. Automation does create new jobs, but they're rarely for the workers it displaces. What worries economists most is the speed: millions of roles may become redundant within a decade. Many displaced workers end up in precarious gig work without insurance. Some argue that AI will augment human workers rather than replace them, and in many professions, it already has. Still, without a serious plan to reskill and upskill people, inequality will grow. Some countries are testing a universal basic income, while others invest in lifelong learning. No job is completely future-proof, but adaptability comes close. Job security, in the old sense, is disappearing.",
    },
    `
n | labor market | The supply of workers and the jobs available for them. | Women are entering the labor market in greater numbers.
n | displacement | The loss of jobs when workers are replaced, for example by machines. | Automation has led to the displacement of factory workers.
v | reskill | To learn new skills so you can do a different job. | The company is reskilling its staff for digital roles.
v | upskill | To learn more skills for the job you already do. | Nurses are being upskilled to use new technology.
adj | redundant | No longer needed for a job, and so dismissed. | Two hundred workers were made redundant.
v | augment | To increase or improve something by adding to it. | AI can augment a doctor's work.
n | universal basic income | A regular amount of money that a government gives to every adult. | Finland tested a universal basic income.
adj | precarious | Not safe or certain; likely to change for the worse. | Many young people have precarious jobs.
n | lifelong learning | Continuing to learn throughout your life. | Lifelong learning is essential in a changing economy.
v | displace | To take the place of someone or something. | Robots have displaced many workers.
n | transition | The process of changing from one state to another. | The transition to clean energy will create jobs.
adj | future-proof | Unlikely to become out of date. | Is any career really future-proof?
n | job security | The feeling that your job is safe. | Government jobs offer more job security.
i | the writing is on the wall | There are clear signs that something bad will happen. | For many cashiers, the writing is on the wall.
pv | phase in | To introduce something slowly, in stages. | The new system will be phased in over two years.
`
  ),
  pack(
    {
      id: 'ai-ethics',
      group: 'society',
      title: 'AI Ethics, Bias & Regulation',
      description: 'Evaluate the social and ethical risks of AI, such as bias and misuse, and how it should be regulated.',
      level: 'C1',
      emoji: '⚖️',
      revisits: 'ai-at-work',
      warmUp: [
        'Would you trust an AI to decide who gets a loan?',
        'Have you ever seen a deepfake that fooled people?',
      ],
      grammar: {
        title: 'Modal perfects for speculation: would have, might have, needn’t have',
        points: [
          { form: 'would have + past participle', use: 'Imagining a past result that didn’t happen.', example: 'With proper testing, the bias would have been found earlier.' },
          { form: 'might / may have + past participle', use: 'Speculating about what possibly happened.', example: 'The system may have learned the bias from old data.' },
          { form: 'needn’t have + past participle', use: 'Something happened, but it wasn’t necessary.', example: 'The bank needn’t have rejected so many applicants.' },
        ],
        tip: '“Didn’t need to” (it wasn’t necessary, so it probably didn’t happen) is different from “needn’t have” (it happened, but it wasn’t necessary).',
      },
      discussion: [
        'How does algorithmic bias happen, and who should be responsible for it?',
        'Should AI be regulated by governments or by the companies that build it?',
        'What are the dangers of deepfakes for elections?',
        'Should autonomous weapons be banned?',
        'Who has liability when a self-driving car causes an accident?',
        'How can opaque AI systems be made more transparent?',
      ],
      task: {
        prompt: 'Give a short talk on one ethical risk of AI and how to regulate it.',
        points: [
          'The risk, with a real or imagined example',
          'What may have gone wrong (modal perfects)',
          'Who should be accountable',
          'What safeguards you would propose',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "A few years ago, a large company used an AI system to screen job applications. It turned out to be discriminatory: it rejected women far more often than men. The algorithmic bias may have come from the company's own history, because most past hires were men. Proper oversight would have spotted the problem before it harmed anyone. The case shows why opaque systems are dangerous: even the developers couldn't explain the decisions. Many experts now argue that governments must regulate AI, with clear safeguards and independent watchdogs. The proliferation of deepfakes adds another risk, because it makes misuse easy and cheap. Unchecked, AI could magnify the unfairness that already exists. Companies shouldn't cut corners when people's lives are affected.",
    },
    `
n | algorithmic bias | Unfair results produced by a computer system because of the data or rules it uses. | Algorithmic bias can affect who gets a job.
v | regulate | To control an activity with rules. | The government plans to regulate AI.
n | deepfake | A video or a recording changed by AI to make someone seem to say or do something they didn't. | The deepfake of the president went viral.
n | misuse | The use of something in a wrong or harmful way. | The misuse of personal data is a crime.
n | safeguard | Something that protects people from harm. | We need safeguards against abuse.
n | oversight | The job of watching an activity to make sure it is done correctly. | The project lacked proper oversight.
adj | autonomous | Able to act or make decisions without human control. | Autonomous cars are being tested in many cities.
n | liability | Legal responsibility for something, especially damage or loss. | The company denied liability for the accident.
adj | discriminatory | Treating people unfairly because of their sex, race or other features. | The policy was discriminatory against older workers.
adj | opaque | Difficult to understand or see through. | The way the app chooses prices is opaque.
adj | unchecked | Not controlled or limited. | Unchecked power is dangerous.
n | proliferation | A sudden, fast increase in the number of something. | The proliferation of fake accounts worries experts.
n | watchdog | An organization that makes sure companies or governments act fairly and legally. | The consumer watchdog fined the company.
i | cut corners | To do something cheaply or quickly by not doing it properly. | They cut corners on safety.
pv | crack down on | To start dealing with something wrong in a strict way. | The government is cracking down on online fraud.
`
  ),
  pack(
    {
      id: 'housing-policy',
      group: 'society',
      title: 'Housing Policy & Urban Planning',
      description: 'Evaluate housing policies and city planning, and their social and economic effects.',
      level: 'C1',
      emoji: '🏗️',
      revisits: 'housing-costs',
      warmUp: [
        'If you were mayor of your city, what would you build first?',
        'Should the government build homes or leave it to companies?',
      ],
      grammar: {
        title: 'The subjunctive: It’s essential that…, suggest that…',
        points: [
          { form: 'It is essential / vital / important that + subject + base verb', use: 'Formal statements about what must happen.', example: 'It’s essential that every family have access to safe housing.' },
          { form: 'suggest / recommend / insist / propose that + subject + base verb', use: 'Formal recommendations.', example: 'Experts recommend that the city limit new compounds.' },
          { form: 'subject + be (not) + past participle', use: 'The subjunctive in the passive.', example: 'They insisted that the plan be reviewed.' },
        ],
        tip: 'The subjunctive uses the base form for every subject, even he, she and it: “We suggest that he apply”, not “he applies”. In everyday English, “should apply” is also fine.',
      },
      discussion: [
        'Why do cities sprawl, and what are the costs?',
        'Should empty apartments be taxed to reduce speculation?',
        'What makes social housing succeed or fail?',
        'How can regeneration avoid pushing poor residents out?',
        'Is high density better than sprawl?',
        'What should be done about informal settlements?',
      ],
      task: {
        prompt: 'Propose a housing policy for your city.',
        points: [
          'The problem (affordability, sprawl, empty homes…)',
          'Your proposal (It’s essential that…, I recommend that…)',
          'The incentives or rules you would use',
          'Possible side effects and how to avoid them',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Egyptian cities face a strange paradox: millions of apartments stand empty while young families can't afford a home. Much of the vacancy is caused by speculation, as people buy property to protect their savings from inflation. At the same time, urban sprawl pushes new compounds far into the desert, where the infrastructure is weak. Experts recommend that the government tax empty units and create incentives to rent them out. It is also essential that social housing be built near jobs, not on the edge of the city. Regeneration of old neighborhoods can help, but it must not lead to the displacement of residents. Good urban planning means mixing density with green spaces. Affordability, not just bricks and mortar, should be the measure of success.",
    },
    `
n | urban planning | Designing how a city or a town grows, including its buildings, roads and services. | Good urban planning reduces traffic.
n | zoning | A system that decides how land in each area can be used. | Zoning laws keep factories away from homes.
n | social housing | Homes owned by the government or a charity and rented cheaply to people on low incomes. | The city built 10,000 units of social housing.
n | sprawl | The uncontrolled spread of a city into the land around it. | Urban sprawl destroys farmland.
n | density | The number of people or buildings in an area. | The area has a very high population density.
n | speculation | Buying property or shares hoping to sell them for a profit. | Speculation pushed prices up.
n | vacancy | An empty room, apartment or building. | There's a high vacancy rate in the new city.
n | incentive | Something that encourages people to do something. | Tax incentives encourage people to rent out empty homes.
n | informal settlement | An area where people have built homes without official permission. | Millions live in informal settlements around the city.
n | regeneration | Improving an area that is in bad condition. | The regeneration of downtown created new jobs.
n | affordability | The fact of being cheap enough for people to pay for. | Affordability is the biggest housing issue.
i | bricks and mortar | Buildings, especially as an investment. | Many Egyptians trust bricks and mortar more than banks.
pv | sell off | To sell land or buildings, often quickly or cheaply. | The government sold off public land to developers.
adj | upscale | Expensive and designed for rich customers (American English). | The area is becoming more upscale.
`
  ),
  pack(
    {
      id: 'climate-policy',
      group: 'society',
      title: 'Climate Policy & the Energy Transition',
      description: 'Evaluate climate targets and policies, the move to clean energy and who should pay for it.',
      level: 'C1',
      emoji: '⚡',
      revisits: 'climate-and-sustainability',
      warmUp: [
        'Should rich countries pay more to fight climate change?',
        'Would you pay more for electricity if it came from clean energy?',
      ],
      grammar: {
        title: 'Concessive clauses: much as, while, albeit',
        points: [
          { form: 'Much as + clause, main clause', use: 'Accepting a point strongly, but still disagreeing.', example: 'Much as I support clean energy, the costs are real.' },
          { form: 'While + clause, main clause', use: 'Contrast between two facts.', example: 'While solar power is cheap, storing it is not.' },
          { form: 'albeit + adjective/adverb/noun', use: 'Accepting a limit, very formally.', example: 'Emissions are falling, albeit slowly.' },
        ],
        tip: 'These forms are formal; in speech, “even though” and “but” are more natural. Use albeit with a word or a phrase, not a full clause.',
      },
      discussion: [
        'Are net zero targets realistic for developing countries?',
        'Should a carbon tax be introduced in Egypt?',
        'How can companies be stopped from greenwashing?',
        'Is adaptation more urgent than mitigation for Egypt?',
        'What would a fair energy transition look like?',
        'Have we already passed a tipping point?',
      ],
      task: {
        prompt: 'Present a position on one climate policy.',
        points: [
          'The policy and its target',
          'The main argument for it (much as, while)',
          'The costs and who pays them',
          'Your conclusion, with one formal concession (albeit)',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Egypt has pledged to produce a large share of its electricity from renewable energy, and the energy transition is visible in the huge solar parks near Aswan. Much as I welcome this progress, the challenge remains enormous. While rich countries talk about net zero, developing countries need cheap energy to grow. A carbon tax could reduce emissions, albeit at a cost for poorer families. Some companies try to offset their pollution by planting trees, but critics call this greenwashing. For Egypt, adaptation is just as urgent as mitigation: the Delta needs protection from rising seas. Building resilience into farming and the power grid will be crucial. Scientists warn that some tipping points may already have been passed.",
    },
    `
adj | carbon neutral | Not adding to the total amount of carbon dioxide in the atmosphere. | The company aims to be carbon neutral by 2030.
n | net zero | A balance where the greenhouse gases put into the air are removed or canceled out. | Many countries have net zero targets.
n | energy transition | The change from fossil fuels to clean energy sources. | The energy transition will create new jobs.
n | carbon tax | A tax on fuels or activities that produce carbon dioxide. | A carbon tax makes polluting more expensive.
n | renewable energy | Energy from sources such as the sun or the wind, which don't run out. | Egypt has huge potential for renewable energy.
n | mitigation | Reducing how serious something is, such as climate change. | Mitigation means cutting emissions.
n | adaptation | Changing to deal with new conditions. | Adaptation to rising temperatures is vital for farmers.
n | resilience | The ability to recover quickly from problems. | We must build resilience against floods.
n | greenwashing | Making people believe a company is better for the environment than it really is. | The ad was pure greenwashing.
n | pledge | A serious promise. | The country made a pledge to cut emissions.
v | offset | To balance one thing with another so it has less effect. | Airlines let you offset your flight's emissions.
n | power grid | The network that carries electricity from power stations to homes and businesses. | The power grid can't handle the summer heat.
n | tipping point | The point at which a series of small changes causes a large, sudden change. | Scientists warn we're near a tipping point.
i | a drop in the ocean | A very small amount compared with what is needed. | Our recycling is a drop in the ocean.
pv | scale up | To make something bigger, or produce more. | We need to scale up solar power.
`
  ),
  pack(
    {
      id: 'attention-economy',
      group: 'society',
      title: 'Media Power, Propaganda & the Attention Economy',
      description: 'Analyze how media and platforms compete for attention, shape opinions and spread disinformation.',
      level: 'C1',
      emoji: '📡',
      revisits: 'news-and-media-literacy',
      warmUp: [
        'How much of your news comes from social media?',
        'Do you think your feed shows you the full picture?',
      ],
      grammar: {
        title: 'Ellipsis and substitution: so, not, do so',
        points: [
          { form: 'so / not after think, hope, expect, suppose', use: 'Replacing a whole clause to avoid repetition.', example: '“Is the story true?” “I don’t think so.” “I hope not.”' },
          { form: 'do so / did so', use: 'Replacing an action already mentioned, formally.', example: 'The platform promised to remove the posts, but it never did so.' },
          { form: 'leaving out repeated words', use: 'Ellipsis after auxiliaries and in lists.', example: 'Some sites check facts; most don’t.' },
        ],
        tip: 'Say “I think so” and “I don’t think so”, not “I think yes” or “I think not so”, which are translations.',
      },
      discussion: [
        'How do platforms monetize our attention?',
        'Have you ever been in an echo chamber? How did you notice?',
        'Is polarization caused by social media, or only made visible by it?',
        'Where is the line between moderation and censorship?',
        'How do governments and companies use spin?',
        'Should media literacy be taught at school?',
      ],
      task: {
        prompt: 'Explain how the attention economy shapes what people believe.',
        points: [
          'How platforms make money from attention',
          'How echo chambers and filter bubbles form',
          'One example of disinformation or spin',
          'What users and governments can do (use ellipsis: so, not, do so)',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "In the attention economy, our time is the product. Platforms monetize every minute we spend scrolling, so their algorithms push whatever keeps us watching, and outrage works best. Over time, each of us ends up in a filter bubble, surrounded by people who agree with us. These echo chambers fuel polarization, and they make disinformation easy to spread. Governments, parties and companies use the same tools to manipulate public opinion with spin and carefully chosen narratives. Some people call for censorship, but I don't think so; that power can be abused too. Platforms have promised to act as better gatekeepers, but few have done so. The best defense, in my view, is media literacy: knowing who wants to sway you, and why.",
    },
    `
n | doomscrolling | Spending a long time scrolling through bad or worrying news on a phone or a computer. | Doomscrolling before bed makes me anxious.
n | echo chamber | A situation in which people only hear opinions that are like their own. | Social media can become an echo chamber.
n | polarization | The division of people into two opposite groups. | Political polarization is growing.
v | manipulate | To control or influence someone in a clever and dishonest way. | Advertisers manipulate our emotions.
n | narrative | A way of explaining events that reflects a particular point of view. | The government's narrative was different.
n | disinformation | False information that is spread on purpose to deceive people. | The campaign was full of disinformation.
n | censorship | Stopping people from seeing or reading information that is considered harmful. | Internet censorship is common in some countries.
n | outrage | A strong feeling of anger and shock. | The video caused public outrage.
v | monetize | To earn money from something. | YouTubers monetize their videos with ads.
n | spin | A way of presenting information to make people see it in a positive or a particular way. | The minister put a positive spin on the bad news.
n | filter bubble | A situation in which you only see information that matches your interests and beliefs, because of algorithms. | My feed is a filter bubble.
n | gatekeeper | A person or an organization that controls access to information or opportunities. | Editors used to be the gatekeepers of news.
v | sway | To persuade someone to change their opinion. | The debate swayed many voters.
n | media literacy | The ability to understand and judge the information in the media. | Media literacy helps students spot fake news.
i | take something at face value | To accept something as it seems, without questioning it. | Don't take headlines at face value.
pv | buy into | To believe an idea completely, often without questioning it. | Many people buy into the idea that more followers means more success.
`
  ),
  pack(
    {
      id: 'inequality-and-mobility',
      group: 'society',
      title: 'Inequality, Wealth & Social Mobility',
      description: 'Analyze why inequality grows, what blocks social mobility and which policies help people move up.',
      level: 'C1',
      emoji: '🪜',
      revisits: 'ethics-and-responsibility',
      warmUp: [
        'Did everyone in your school have the same chances in life?',
        'What helps people succeed most: talent, effort, money or connections?',
      ],
      grammar: {
        title: 'Precise comparisons: twice as, nowhere near, considerably',
        points: [
          { form: 'twice / three times + as + adjective + as', use: 'Exact multiples.', example: 'Rents here are twice as high as five years ago.' },
          { form: 'nowhere near / not nearly + as + adjective + as', use: 'A very large difference, negative.', example: 'Public schools are nowhere near as well funded as private ones.' },
          { form: 'considerably / significantly / marginally + comparative', use: 'Formal words for the size of a difference.', example: 'The rich have become considerably richer.' },
        ],
        tip: 'Put the number before as: “three times as expensive as”, not “as three times expensive as”.',
      },
      discussion: [
        'Is there a level playing field for young people in Egypt?',
        'How does nepotism affect a society?',
        'Is meritocracy real, or a comfortable myth?',
        'Should the state redistribute wealth through taxes?',
        'Is there a glass ceiling for women in your field?',
        'What safety net exists for people who lose their jobs?',
      ],
      task: {
        prompt: 'Give a short speech about social mobility.',
        points: [
          'One example of inequality you’ve seen (precise comparisons)',
          'What blocks people from moving up',
          'One policy that could help',
          'A counterargument and your answer',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I grew up in a village where most families lived with real deprivation, and I've seen how hard upward mobility is. The wealth gap is huge: a child from a rich family in Cairo has considerably more chances than a child in my village, and public schools are nowhere near as good as private ones. Many people believe in meritocracy, but privilege, connections and nepotism often matter more than talent. Women face a glass ceiling too: only a few reach senior positions. Without a level playing field, inequality becomes entrenched over generations. Redistribution through fair taxes and free, good education could widen the safety net for marginalized families. Some argue this kills ambition, but I think the opposite: hope is what drives people. Nobody chooses to be born with a silver spoon in their mouth, or without one.",
    },
    `
n | social mobility | The ability to move to a different, usually higher, social and economic position. | Free education increases social mobility.
n | wealth gap | The difference in wealth between rich and poor people. | The wealth gap is growing worldwide.
n | privilege | An advantage that only some people have, often because of wealth. | Private education is a privilege.
adj | disadvantaged | Having fewer chances because of poverty or other problems. | The scholarship is for disadvantaged students.
n | meritocracy | A system in which people succeed because of their ability, not their money or family. | A true meritocracy rewards talent.
n | nepotism | Using your power to give jobs to your relatives or friends. | Nepotism is common in some companies.
adj | marginalized | Treated as unimportant and kept outside the main part of society. | The program helps marginalized communities.
n | redistribution | Sharing money or property more equally, for example through taxes. | Taxes allow the redistribution of wealth.
n | glass ceiling | An unofficial limit that stops women or minorities from reaching top jobs. | She broke the glass ceiling in banking.
i | a level playing field | A situation in which everyone has the same chance of success. | Online learning can create a level playing field.
n | upward mobility | Moving to a higher social or economic position. | Education is the key to upward mobility.
n | safety net | A system that helps people who have serious money problems. | The welfare system is a safety net for the poor.
n | deprivation | Not having enough of the basic things people need, such as food and housing. | Child deprivation is still high in rural areas.
adj | entrenched | Fixed firmly and hard to change. | Poverty is entrenched in some regions.
i | born with a silver spoon in your mouth | Born into a rich family. | He was born with a silver spoon in his mouth.
pv | hold back | To stop someone from making progress or doing as well as they should. | Poverty holds back millions of talented children.
`
  ),
  pack(
    {
      id: 'bioethics',
      group: 'society',
      title: 'Science, Ethics & Biotechnology',
      description: 'Discuss the ethics of genetic engineering, medical research and new biotechnology.',
      level: 'C1',
      emoji: '🧬',
      revisits: 'science-and-space',
      warmUp: [
        'Would you want to know your genetic risk of a disease?',
        'Should there be limits on what science can do?',
      ],
      grammar: {
        title: 'Passive reporting: It is thought that, X is said to have',
        points: [
          { form: 'It is + said / believed / thought + that + clause', use: 'Reporting what people in general say or believe.', example: 'It is believed that the treatment is safe.' },
          { form: 'subject + is said / thought + to + base verb', use: 'The same, starting with the subject.', example: 'The drug is said to work in half of patients.' },
          { form: 'subject + is believed / reported + to have + past participle', use: 'About something in the past.', example: 'The scientist is reported to have edited human embryos.' },
        ],
        tip: 'Use “to have done” for the past: “He is thought to have left”, not “He is thought to leave” (that means now or in general).',
      },
      discussion: [
        'Should parents be allowed to choose their baby’s genes?',
        'Is cloning animals acceptable? What about humans?',
        'Who should give consent for medical research on children?',
        'Are the side effects of new medicines tested enough?',
        'Where is the line between treating disease and “playing God”?',
        'Should controversial research be stopped, or just regulated?',
      ],
      task: {
        prompt: 'Argue a position on one bioethical question.',
        points: [
          'The technology and what it can do',
          'What is said or believed about it (passive reporting)',
          'The main ethical risk',
          'Your position, with one condition',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Genetic engineering is perhaps the most controversial area of modern science. Tools now allow scientists to edit a gene inside a human embryo, and it is believed that hereditary diseases could one day disappear. In 2018, a Chinese scientist was reported to have created the first edited babies, which shocked the world. Critics fear a future of “designer babies,” where rich parents choose their children's intelligence or looks. Others warn that we shouldn't play God or tamper with nature without knowing the long-term side effects. Stem cell research is also said to have huge potential for treating injuries. For me, the key is bioethics: strict rules, proper consent and careful clinical trials. Science should save lives, not create new inequalities.",
    },
    `
n | bioethics | The study of the moral questions raised by biology and medicine. | The university has a center for bioethics.
n | genetic engineering | Changing the genes of a living thing. | Genetic engineering can make crops resist disease.
n | gene | A unit inside a cell that controls a feature passed from parents to children. | Eye color is controlled by genes.
v | clone | To make an exact genetic copy of an animal or a plant. | Scientists cloned a sheep in 1996.
n | embryo | A human or an animal in the very first stage of development. | The embryo was tested for disease.
n | stem cell | A basic cell that can develop into other types of cells. | Stem cell research could treat many illnesses.
adj | controversial | Causing a lot of disagreement. | Cloning is a controversial topic.
n | designer baby | A baby whose genes have been chosen by its parents (informal, usually critical). | Many people oppose designer babies.
n | clinical trial | A test of a new medicine or treatment on people. | The vaccine is in clinical trials.
n | side effect | An unwanted effect of a medicine or a treatment. | The drug has no serious side effects.
i | play God | To act as if you had unlimited power over life or nature. | Some say genetic editing is playing God.
pv | tamper with | To change something without permission, often to damage it. | Someone tampered with the test results.
adj | hereditary | Passed from parents to children through the genes. | It's a hereditary disease.
n | informed consent | Permission that a patient gives after being told about the risks. | Researchers must get informed consent from every patient.
`
  ),
  pack(
    {
      id: 'migration-policy',
      group: 'society',
      title: 'Migration Policy, Belonging & Identity',
      description: 'Discuss how countries manage migration and asylum, and what belonging and identity mean for migrants.',
      level: 'C1',
      emoji: '🛂',
      revisits: 'migration-and-globalization',
      warmUp: [
        'Where do you feel you belong?',
        'Do you know someone who has lived in three or more countries?',
      ],
      grammar: {
        title: 'Noun clauses: what, whether, the fact that',
        points: [
          { form: 'What + clause as subject or object', use: 'Using a whole clause as a noun.', example: 'What migrants need most is legal security.' },
          { form: 'whether + clause', use: 'A noun clause about two possibilities.', example: 'Whether integration succeeds depends on both sides.' },
          { form: 'the fact that + clause', use: 'Treating a fact as a noun.', example: 'The fact that she was born here doesn’t make her feel at home.' },
        ],
        tip: 'A noun clause has normal word order, not question order: “What they want is safety”, not “What do they want is safety”.',
      },
      discussion: [
        'What is the difference between a migrant, a refugee and an asylum seeker?',
        'Should citizenship be easier to get for people born in a country?',
        'Is assimilation or integration the better goal?',
        'Where does xenophobia come from, and how can it be reduced?',
        'Can someone have a hybrid identity and still feel they belong?',
        'What responsibilities does a host country have?',
      ],
      task: {
        prompt: 'Present a fair migration policy for a country.',
        points: [
          'Who the policy is for (migrants, refugees, asylum seekers)',
          'What they need most (noun clauses)',
          'The responsibilities of the host country and of the newcomers',
          'How you would deal with public fear',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My cousin was born in Italy to Egyptian parents, and her story shows how complicated belonging can be. In Italy, she was called a foreigner; in Egypt, she's “the Italian one.” What she has is a hybrid identity, and the fact that she doesn't fit one box used to make her sad. Today, debates about migration often mix very different situations: people uprooted by war who seek asylum, workers looking for jobs and undocumented migrants. Some politicians push for strict quotas and deportation, while others support citizenship for children born in the country. Whether integration works depends on both the host country and the newcomers. Assimilation, meaning giving up your culture, is rarely the answer. The diaspora can be a bridge between countries, not a threat. Xenophobia grows where people don't know each other.",
    },
    `
n | asylum | Protection given by a country to someone who has escaped danger in their own country. | They were granted asylum in Sweden.
n | asylum seeker | A person who asks another country for protection from danger. | The camp houses thousands of asylum seekers.
n | citizenship | The legal right to belong to a country. | She applied for Canadian citizenship.
n | deportation | Forcing someone to leave a country, usually because they have no legal right to be there. | He faced deportation after his visa expired.
n | integration | Becoming an accepted part of a society. | Language classes help integration.
n | assimilation | The process in which people from another culture become like the majority and lose their own culture. | Forced assimilation destroys communities.
n | belonging | The feeling of being accepted as part of a group or a place. | Children need a sense of belonging.
n | xenophobia | Strong fear or dislike of people from other countries. | The campaign tried to fight xenophobia.
adj | undocumented | Without official papers, such as a visa or a work permit. | Undocumented workers often earn very little.
n | quota | A fixed number of something that is allowed. | The country has a quota for work visas.
v | resettle | To help people, or make them, move to a new place to live. | The refugees were resettled in Canada.
n | hybrid identity | A sense of self that mixes two or more cultures. | Many second-generation migrants have a hybrid identity.
n | diaspora | People from one country who live in many other countries. | The Egyptian diaspora sends billions home every year.
v | uproot | To make someone leave the place where they have lived. | The war uprooted millions of people.
i | melting pot | A place where people of many cultures live together and mix. | New York is a melting pot.
pv | take in | To give someone a place to live. | Germany took in a million refugees.
`
  ),
  pack(
    {
      id: 'justice-and-punishment',
      group: 'society',
      title: 'Justice, Punishment & Rehabilitation',
      description: 'Discuss what punishment is for, whether prisons work and how justice systems can fail or improve.',
      level: 'C1',
      emoji: '🔨',
      revisits: 'crime-law-justice',
      warmUp: [
        'What is the purpose of prison, in your opinion?',
        'Should everyone get a second chance?',
      ],
      grammar: {
        title: 'Conditional variations: but for, had it not been for, otherwise',
        points: [
          { form: 'Had + subject + past participle, would have', use: 'A formal third conditional without if.', example: 'Had the police checked the evidence, he wouldn’t have gone to prison.' },
          { form: 'But for / Had it not been for + noun', use: '“If it hadn’t been for…”, formally.', example: 'But for a new witness, the error would never have been discovered.' },
          { form: 'otherwise / or else', use: 'Showing what would happen if not.', example: 'Prisoners need training; otherwise, they’re likely to reoffend.' },
        ],
        tip: 'In “Had it not been for”, don’t use if as well: “Had it not been for her lawyer…”, not “If had it not been for…”.',
      },
      discussion: [
        'Is the death penalty ever justified?',
        'Does a harsh sentence work as a deterrent?',
        'Should prisons focus on rehabilitation or retribution?',
        'How can a justice system prevent a miscarriage of justice?',
        'What is restorative justice, and could it work in Egypt?',
        'Are courts too lenient with rich people?',
      ],
      task: {
        prompt: 'Argue for one reform to the justice system.',
        points: [
          'The problem with the current system',
          'A real or imagined case (Had…, But for…)',
          'Your reform and its aim',
          'The strongest objection and your answer',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Most prisons are designed for retribution, not rehabilitation, and the results are clear: many prisoners reoffend within a few years. Long sentences are supposed to be a deterrent, but research suggests that the chance of being caught matters more. In some countries, people have spent decades in incarceration after a miscarriage of justice. Had it not been for new DNA evidence, they would never have been acquitted. The death penalty makes such mistakes irreversible. Restorative justice, where offenders meet their victims and repair the harm, has shown promising results. Critics say it's too lenient and that judges should throw the book at serious criminals. I believe in punishment, but also in due process and a second chance; otherwise, prisons simply produce more crime.",
    },
    `
n | rehabilitation | Helping someone return to a normal life, for example after prison. | The prison runs rehabilitation programs.
n | deterrent | Something that makes people decide not to do something. | Heavy fines act as a deterrent.
v | reoffend | To commit a crime again. | Many young offenders reoffend within a year.
n | incarceration | The state of being in prison. | Incarceration costs the state a lot of money.
n | parole | Letting a prisoner leave prison early, on the condition that they behave well. | He was released on parole after five years.
n | death penalty | Punishment by death for a crime. | Many countries have abolished the death penalty.
n | miscarriage of justice | A situation in which a court makes a wrong decision, especially when an innocent person is punished. | His conviction was a miscarriage of justice.
n | due process | The fair treatment that the law gives every person. | Everyone has the right to due process.
n | retribution | Punishment for a crime, seen as deserved. | The victim's family wanted retribution.
n | restorative justice | A system in which offenders repair the harm they caused, often by meeting their victims. | Restorative justice helped both sides heal.
v | acquit | To decide officially that someone is not guilty. | The jury acquitted her of all charges.
v | convict | To decide officially that someone is guilty of a crime. | He was convicted of fraud.
adj | lenient | Not as strict as expected when punishing someone. | The judge gave a lenient sentence.
i | throw the book at | To punish someone as strongly as possible. | The judge threw the book at him.
n | second chance | An opportunity to try again after failing. | Everyone deserves a second chance.
pv | lock up | To put someone in prison. | They locked him up for ten years.
`
  ),
  pack(
    {
      id: 'future-of-education',
      group: 'work',
      title: 'Education, Technology & the Future of Learning',
      description: 'Evaluate online and blended learning, new credentials and how education should change for the future.',
      level: 'C1',
      emoji: '🖥️',
      revisits: 'education-systems',
      warmUp: [
        'Have you ever taken an online course? Did you finish it?',
        'What should schools teach that they don’t teach now?',
      ],
      grammar: {
        title: 'Perfect and continuous infinitives: to have done, to be doing',
        points: [
          { form: 'to have + past participle', use: 'An infinitive about the past.', example: 'Online learning seems to have helped motivated students most.' },
          { form: 'to be + V-ing', use: 'An infinitive about something in progress.', example: 'Universities appear to be losing their monopoly on credentials.' },
          { form: 'modal + have + past participle / be + V-ing', use: 'The same ideas after modals.', example: 'Many students must be using AI for their homework.' },
        ],
        tip: 'Use the perfect infinitive when the action is earlier than the main verb: “She claims to have finished the course” (she finished before she claims).',
      },
      discussion: [
        'Is blended learning better than classroom learning?',
        'Are online credentials as valuable as a university degree?',
        'How does the digital divide affect students in rural Egypt?',
        'Should assessment focus on exams or on projects?',
        'Are schools spoon-feeding students instead of teaching them to think?',
        'What would personalized learning look like in your school?',
      ],
      task: {
        prompt: 'Propose how education should change in the next ten years.',
        points: [
          'What’s outdated in the current system',
          'What technology seems to have changed (perfect infinitive)',
          'Your proposal for learning and assessment',
          'How to keep it equitable',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "The pandemic forced schools to try e-learning almost overnight, and it seems to have changed education for good. Blended learning, which mixes online and classroom lessons, appears to work best for most students. Personalized platforms adapt to each learner, and new credentials allow people to prove skills without a full degree. However, the digital divide is real: millions of students in rural areas have no reliable internet, so the system must stay equitable. Many classrooms remain outdated, and teachers still spoon-feed facts for exams. Assessment should reward thinking, projects and hands-on skills, not memory. Teachers also need training in modern pedagogy. In my view, we need to rethink not just how students learn, but why.",
    },
    `
n | e-learning | Learning through courses on the internet. | The company uses e-learning to train staff.
n | blended learning | Learning that combines online study with classes in person. | Our university uses blended learning.
adj | personalized | Designed for one particular person. | The app creates a personalized study plan.
n | credential | A qualification or a record that shows what someone has achieved. | Online certificates are becoming accepted credentials.
n | accreditation | Official approval that a school or a course meets a standard. | The course has international accreditation.
n | pedagogy | The study of the methods and practice of teaching. | Modern pedagogy focuses on the learner.
n | digital divide | The gap between people who have access to computers and the internet and those who don't. | The digital divide hurts poor students.
adj | self-directed | Organized and controlled by yourself, not by a teacher. | Online courses need self-directed learners.
n | assessment | The process of judging how well someone has learned. | Assessment includes projects and exams.
adj | equitable | Fair and reasonable for everyone. | We need an equitable school system.
adj | outdated | Old-fashioned and no longer useful. | The textbooks are outdated.
adj | hands-on | Learning by doing things, not just by reading. | The course offers hands-on training.
v | spoon-feed | To give someone too much help, so that they don't need to think for themselves. | Students are spoon-fed answers for the exam.
v | rethink | To think again about something in order to change it. | It's time to rethink our approach.
pv | catch on | To become popular. | Online degrees have caught on quickly.
i | the jury is still out | People have not decided yet, because there isn't enough information. | Is online school as good as classroom learning? The jury is still out.
`
  ),
  pack(
    {
      id: 'leading-change',
      group: 'work',
      title: 'Leading Organizational Change',
      description: 'Discuss how to lead big changes in an organization, deal with resistance and get people on board.',
      level: 'C1',
      emoji: '🔄',
      revisits: 'leadership-and-feedback',
      warmUp: [
        'Have you ever been part of a big change at work or school?',
        'Why do people often resist change?',
      ],
      grammar: {
        title: 'Diplomatic language: would, might, it may be worth',
        points: [
          { form: 'would / might + verb', use: 'Softening suggestions and opinions.', example: 'I would suggest starting with a pilot. It might be better to wait.' },
          { form: 'It may be worth + V-ing', use: 'A polite, careful suggestion.', example: 'It may be worth asking the team first.' },
          { form: 'Could we perhaps …? · I’m not sure that …', use: 'Polite questions and disagreement.', example: 'I’m not sure that this is the right time.' },
        ],
        tip: 'Direct language can sound rude in English work culture: “I’d suggest a different approach” works better than “Your plan is wrong”.',
      },
      discussion: [
        'Why do restructuring plans so often fail?',
        'How can leaders reduce resistance to change?',
        'What does it take to get buy-in from employees?',
        'When should a leader rock the boat?',
        'Is it better to overhaul a system or change it step by step?',
        'How can a small pilot help a big change?',
      ],
      task: {
        prompt: 'Persuade your team to accept a big change, diplomatically.',
        points: [
          'What will change and why',
          'The concerns people might have',
          'Your plan, using diplomatic language',
          'How you’ll keep them informed',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last year, our company decided to overhaul its customer service system, and I was asked to spearhead the change in our department. At first, there was strong resistance: people were afraid of losing their jobs. I learned that buy-in matters more than a perfect plan. We started with a small pilot in one team, shared a clear roadmap and kept full transparency about what would change. I would often say, “It may be worth trying this for a month before we decide.” Streamlining our processes saved time, and slowly, the culture shift happened. Not everyone got on board, and some people felt I was rocking the boat. Still, by facing problems head-on, we achieved better alignment between teams. Change management, I've learned, is mostly about people, not systems.",
    },
    `
n | restructuring | Changing the way an organization is organized, often to make it more efficient. | The restructuring led to fifty job cuts.
n | resistance | Refusal to accept or support something new. | There was strong resistance to the new rules.
n | buy-in | Agreement and support for a plan from the people involved. | We need buy-in from all the managers.
n | roadmap | A plan showing how something will be achieved, step by step. | The CEO presented a roadmap for the next five years.
v | streamline | To make a system or an organization work more simply and efficiently. | We streamlined the ordering process.
v | overhaul | To change a system completely to improve it. | The company overhauled its IT systems.
n | change management | The planning and handling of changes in an organization. | She's an expert in change management.
n | culture shift | A big change in the way people in an organization think and behave. | Remote work caused a culture shift.
n | pilot | A small test of a new idea before it is used widely. | We ran a pilot in two branches.
n | alignment | Agreement between people or groups about aims and plans. | There's no alignment between sales and marketing.
v | spearhead | To lead an action or a change. | She spearheaded the digital project.
i | rock the boat | To cause problems by trying to change a situation. | He didn't want to rock the boat.
adv | head-on | Directly and with determination. | We tackled the problem head-on.
pv | win over | To persuade someone to support you, especially when they were against you before. | She won over the team with a clear plan.
`
  ),
  pack(
    {
      id: 'global-health',
      group: 'society',
      title: 'Global Health & Pandemic Preparedness',
      description: 'Discuss how diseases spread, how the world prepares for pandemics and how to share vaccines fairly.',
      level: 'C1',
      emoji: '🌍',
      revisits: 'public-health',
      warmUp: [
        'What did you learn from living through the COVID-19 pandemic?',
        'Is the world better prepared for the next pandemic?',
      ],
      grammar: {
        title: 'Relative clauses with quantifiers: many of whom, some of which',
        points: [
          { form: 'noun, + many / most / some / none + of whom', use: 'Extra information about part of a group of people.', example: 'Thousands of nurses, many of whom were exhausted, worked for months.' },
          { form: 'noun, + some / all / both / none + of which', use: 'The same for things.', example: 'Several vaccines were developed, two of which were made in Asia.' },
          { form: 'noun, + the majority / a third + of whom/which', use: 'Proportions inside a relative clause.', example: 'The patients, half of whom were over 70, recovered.' },
        ],
        tip: 'Use whom (not them or who) after of: “many of whom”, not “many of them” inside one sentence.',
      },
      discussion: [
        'Why is preparedness so hard to fund when there’s no crisis?',
        'Was equitable access to vaccines achieved during COVID-19?',
        'Are lockdowns justified, and for how long?',
        'How can poorer countries build strong health systems?',
        'Should countries stockpile medicines and equipment?',
        'What makes a disease so contagious?',
      ],
      task: {
        prompt: 'Recommend how the world should prepare for the next pandemic.',
        points: [
          'What went wrong last time',
          'How diseases spread (transmission, immunity)',
          'Three recommendations (stockpile, surveillance, access)',
          'One sentence with many of whom / some of which',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "The COVID-19 pandemic showed that preparedness saves lives. The virus was highly contagious, and early containment failed in many countries, some of which had underfunded health systems. Lockdowns slowed transmission but also caused huge economic damage. Frontline workers, many of whom worked without proper equipment, paid a heavy price. When vaccines arrived, equitable access was a serious problem: rich countries bought and stockpiled doses, while poor ones waited. Herd immunity came slowly as a result. Experts now recommend better surveillance of new viruses, regional vaccine factories and shared pharmaceutical research. The lesson is to nip outbreaks in the bud, before they become global crises.",
    },
    `
n | preparedness | Being ready for a possible emergency. | Pandemic preparedness needs funding.
n | containment | Keeping something harmful under control so it doesn't spread. | Early containment of the virus failed.
n | transmission | The passing of a disease from one person to another. | Masks reduce transmission.
n | immunity | The body's ability to fight a particular disease. | Vaccines give immunity against measles.
n | herd immunity | When enough people are immune that a disease stops spreading. | Herd immunity protects babies who can't be vaccinated.
n | quarantine | A period when sick or exposed people or animals are kept apart to stop a disease spreading. | Travelers had to stay in quarantine for two weeks.
n | lockdown | An official order to stay at home or close places, to stop a disease spreading. | The city was in lockdown for months.
adj | underfunded | Not having enough money to work properly. | Public hospitals are underfunded.
adj | pharmaceutical | Connected with the production of medicines. | Pharmaceutical companies made huge profits.
n | equitable access | Fair access for everyone, whatever their country or income. | We need equitable access to vaccines.
adj | frontline | Working directly with the people who need help, often in danger. | Frontline workers deserve our thanks.
adj | contagious | (Of a disease) able to pass from one person to another by contact. | The flu is very contagious.
adj | virulent | (Of a disease) very serious and spreading fast. | A virulent strain of the virus appeared.
v | stockpile | To collect a large supply of something to use later. | Countries stockpiled masks.
i | nip something in the bud | To stop something at an early stage, before it grows. | Act early to nip the outbreak in the bud.
pv | ward off | To protect yourself against something dangerous. | Vitamins won't ward off the virus.
`
  ),
];
