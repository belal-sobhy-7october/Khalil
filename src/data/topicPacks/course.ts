/**
 * The eight lessons from the user's course slides (Level 8 / B2). Words,
 * types and examples come from the slides; definitions give the meaning the
 * word has in each example. Where a slide had a mistake (a wrong word type,
 * an unnatural example) it is corrected here.
 */
import { pack, type TopicPack } from './types';

export const COURSE_PACKS: TopicPack[] = [
  pack(
    {
      id: 'artificial-intelligence',
      group: 'society',
      title: 'Artificial Intelligence',
      description: 'Talk about how AI is changing our lives — its advantages, its risks and the future of work.',
      level: 'B2',
      emoji: '🤖',
      fromCourse: true,
      warmUp: [
        'How do you use AI in your daily life?',
        'Do you think AI will take your job in the future? Why or why not?',
      ],
      grammar: {
        title: 'Talking about the future: predictions',
        points: [
          { form: 'will / won’t + base verb', use: 'A prediction you feel sure about.', example: 'AI will change the way we work.' },
          { form: 'might / may / could + base verb', use: 'Something that is possible but not certain.', example: 'AI might take over some jobs in customer service.' },
          { form: 'be (un)likely to + base verb', use: 'How probable you think something is.', example: 'Robots are unlikely to replace nurses any time soon.' },
          { form: 'will have + past participle (V3)', use: 'Something that will be finished before a time in the future.', example: 'By 2035, AI will have changed education completely.' },
        ],
        tip: 'Use “might” or “be likely to” to sound balanced when you are not 100% sure.',
      },
      discussion: [
        'Which AI tools do you use, and how much time do they really save you?',
        'Is the convenience of AI worth the loss of privacy?',
        'Should apps always ask for your consent before collecting your data?',
        'How can we protect ourselves from deepfakes and fake news?',
        'Do you think AI will take over your job one day? What will humans still do better?',
        'Is AI a double-edged sword for students? Why?',
      ],
      task: {
        prompt: 'How is AI changing our lives?',
        points: [
          'How you personally use AI',
          'Two advantages of AI',
          'Two disadvantages or risks',
          'Whether people are becoming too dependent on AI',
          'How AI might change jobs and education in the future',
          'Use at least 4 new words and 2 predictions (will / might / be likely to)',
        ],
      },
      paragraph:
        "I use AI every day, and honestly, it's very time-saving. My phone uses facial recognition, and I ask a chatbot to check my emails for accuracy. Companies love AI because it improves efficiency and leads to cost reduction. But it's a double-edged sword. Many apps collect our data without real consent, and deepfakes make it hard to know what's true. AI is likely to take over some jobs, so we will all need to adapt. By 2035, I think AI will have changed the way we learn and work.",
    },
    `
n | facial recognition | Technology that identifies a person by analyzing their face. | Many smartphones use facial recognition to unlock the device.
n | efficiency | Doing a job well while wasting as little time, money or effort as possible. | Automation can save time and improve efficiency.
v | adapt | To change your behavior or methods so that you can deal successfully with a new situation. | Businesses need to adapt to new technology.
n | convenience | The quality of being easy and useful because it saves you time or effort. | One of the main advantages of AI is its convenience.
n | accuracy | The quality of being correct and exact, without mistakes. | AI doesn't always guarantee accuracy.
n | innovation | A new idea, method or product, or the process of creating new ones. | AI is driving innovation in many industries.
adj | time-saving | Helping you do something more quickly. | AI tools can be very time-saving.
n | cost reduction | Lowering the amount of money that a business or person has to spend. | One benefit of the new system is cost reduction.
n | surveillance | The careful watching of people or places, especially by the police, the government or cameras. | The city implemented an AI-driven surveillance system that automatically detects traffic accidents and alerts emergency services in real time.
n | consent | Permission that someone gives for something to happen or be done. | The app asks for your consent before accessing your camera.
n | deepfake | A video, picture or voice recording made with AI that looks real but is fake. | People need to be careful when sharing deepfake content.
n | AI-generated content | Text, pictures, music or video created by artificial intelligence instead of a person. | Social media is full of AI-generated content that looks completely real.
pv | take over | To take control of something, or to start doing work that someone else used to do. | Many people worry that AI will take over some jobs.
i | a double-edged sword | Something that has both good and bad effects. | AI is a double-edged sword: it can save time but also create new risks.
`
  ),
  pack(
    {
      id: 'identity-and-heritage',
      group: 'talk',
      title: 'Identity & Heritage',
      description: 'Explore your roots, family stories and the objects that matter to you — and tell them with narrative tenses.',
      level: 'B2',
      emoji: '🌍',
      fromCourse: true,
      warmUp: [
        'Do you know any interesting stories about your ancestors or your origins? Where did your family come from?',
        'What is the most sentimental object you have at home right now — and why does it matter to you?',
      ],
      grammar: {
        title: 'Narrative tenses',
        points: [
          { form: 'Past continuous: was/were + V-ing', use: 'The scene — the background action.', example: 'I was looking through old boxes…' },
          { form: 'Past simple: V2 / -ed', use: 'The action — the main events of the story.', example: '…I found an old watch…' },
          { form: 'Past perfect: had + V3', use: 'The “before” — what happened before the story.', example: '…my grandfather had bought it in 1960.' },
        ],
        tip: 'The master sentence: “While I was looking through old boxes, I found a watch my grandfather had bought in 1960.”',
      },
      discussion: [
        'What is your most treasured heirloom or family belonging?',
        'If you could go back in time and meet one ancestor, who would it be?',
        'Who do you take after most in your family — in looks or personality?',
        'Is there a skill or talent that is “in your blood”?',
        'Do you feel a strong connection to your cultural heritage? Why or why not?',
        'Is there a piece of music, food or smell that instantly connects you to your roots?',
        'What family tradition will you definitely pass down to the next generation?',
      ],
      task: {
        prompt: 'Tell a short, true story about you or your family in the past.',
        points: [
          'Set the scene with the past continuous',
          'Tell the main events with the past simple',
          'Say what had happened before with the past perfect',
          'Explain why this memory or object matters to you',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last summer, I was cleaning my grandmother's house when I found a small wooden box. Inside, there was a silver ring that my great-grandfather had bought before he got married. It isn't expensive, but it has great sentimental value, so it's now a family heirloom. My grandmother says I take after him: I'm stubborn and I love old things. Holding the ring made me feel nostalgic about a time I never saw. I realized that our heritage is part of our identity, and I want to keep this legacy alive for my descendants.",
    },
    `
n | ancestor | A person in your family who lived a long time before you, such as your great-great-grandfather. | My ancestors were simple farmers.
n | descendant | A person who is related to someone who lived a long time ago. | I am a descendant of a famous writer, but my ancestors were simple farmers.
n | roots | The place, culture or family that a person originally comes from. | Even though he lives in London, he never forgets his Egyptian roots.
n | heritage | The traditions, history, buildings and culture of a country or group that are passed from one generation to the next. | The Pyramids are an important part of our cultural heritage.
adj | nostalgic | Feeling happy and a little sad when you think about good times in the past. | Listening to this old song always makes me feel nostalgic.
v | inherit | To receive money or things from someone who has died, or to be born with a quality that a parent also has. | I didn't inherit money, but I inherited my father's green eyes.
n | identity | Who a person or group is: the qualities, beliefs and background that make them different from others. | Language is a huge part of our national identity.
n | belongings | The things that you own, especially ones you can carry with you. | I collected my belongings and left.
n | heirloom | A valuable object that a family has owned for many years and passes from older to younger members. | This vintage watch is a family heirloom from my great-grandfather.
n | legacy | Something that someone leaves behind after they die or stop working, for which people remember them. | The kind teacher left a great legacy of love and hard work.
adj | sentimental | Connected with feelings and memories rather than with how much something is worth. | This cheap ring has great sentimental value to me.
pv | take after | To look or behave like an older member of your family, especially a parent. | Ali takes after his father; they are both very ambitious.
i | be in your blood | To be a natural part of you, often because others in your family have the same skill or interest. | Music is in her blood; all her family members are singers.
`
  ),
  pack(
    {
      id: 'habitual-change',
      group: 'life',
      title: 'The Psychology of Habitual Change',
      description: 'Break bad habits, build new ones and talk about your progress and effort.',
      level: 'B2',
      emoji: '🔄',
      fromCourse: true,
      warmUp: [
        'What is one habit you do every single morning without even thinking? Why do you think it stuck?',
        'If you could instantly stop one bad habit today, what would it be — and what has been holding you back?',
      ],
      grammar: {
        title: 'Present perfect continuous vs present perfect simple',
        points: [
          { form: 'have/has been + V-ing', use: 'Effort and duration: how long something has been happening (still in progress).', example: 'I have been trying to wake up early for three weeks.' },
          { form: 'have/has + V3', use: 'Result and quantity: what you have completed or how many.', example: 'I have read three books this month.' },
          { form: 'for / since / lately / recently', use: 'Common time words with these tenses.', example: 'Have you been sleeping well lately?' },
        ],
        tip: 'Never use the continuous with state verbs (know, like, believe, understand, own, need): “I have known him for five years”, not “I have been knowing him”.',
      },
      discussion: [
        'How long have you been learning English? What milestones have you reached?',
        'What is a deeply-ingrained habit you want to get rid of?',
        'Do you struggle with procrastination? Which tasks do you keep delaying — and why?',
        'What positive routine have you been trying to cultivate? What progress have you made?',
        'What matters more for changing a habit — willpower or consistency?',
        'Why do people often fall back into old habits even after months of effort?',
        'If you could turn over a new leaf tomorrow, what is the first thing you would change?',
      ],
      task: {
        prompt: 'Talk about a habit you are changing.',
        points: [
          'A habit you have been trying to change',
          'How long you have been working on it (present perfect continuous)',
          'One milestone you have reached (present perfect simple)',
          'What triggers the old habit',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "For years, checking my phone in bed was a deeply-ingrained habit. Stress was always the trigger. I have been trying to change it for two months now. At first, procrastination and a lack of willpower made it hard, and I fell back into my old routine twice. But resilience matters more than a perfect start. I have read four books since I stopped, and that's a real milestone for me. Consistency and dedication are slowly helping me cultivate a better habit. I've finally turned over a new leaf.",
    },
    `
v | cultivate | To work to develop a skill, habit or attitude over time. | I want to cultivate a good habit of reading every day.
n | willpower | The ability to control your thoughts and actions so that you can do something difficult. | Waking up at 5 AM to exercise takes a lot of willpower.
n | procrastination | Delaying something you should do, usually because it is boring or unpleasant. | Procrastination makes me finish my work at the last minute.
p | deeply-ingrained habit | A habit you have had for so long that it is very hard to change. | Checking my phone before sleeping is a deeply-ingrained habit.
n | consistency | Doing something in the same way, regularly, over a long time. | Consistency is the secret to learning a new language successfully.
v | eradicate | To get rid of something bad completely. | We must work hard to eradicate poverty in our society.
n | dedication | The time and hard work you give to something because it is important to you. | Her dedication helped her become fluent in English.
n | resilience | The ability to recover quickly and keep going after something difficult happens. | Resilience helps people overcome setbacks.
n | milestone | An important event or stage in someone's life or progress. | Buying my first car was a huge milestone in my life.
n | trigger | Something that makes a habit, feeling or reaction start. | Stress is my biggest trigger for eating junk food.
pv | fall back into | To start doing something again, especially a bad habit that you had stopped. | When you feel stressed, it is very easy to fall back into your old bad habits.
i | turn over a new leaf | To change your behavior and start living or working in a better way. | He decided to turn over a new leaf and start studying hard.
`
  ),
  pack(
    {
      id: 'minimalism',
      group: 'life',
      title: 'The Magic of Minimalism',
      description: 'Possessions, clutter and simple living — with verb patterns that change meaning.',
      level: 'B2',
      emoji: '🛋️',
      fromCourse: true,
      warmUp: [
        'Look around: is your room clean and calm, or packed with clutter right now?',
        'You must move tomorrow with one suitcase only. What three things would you take?',
      ],
      grammar: {
        title: 'Verb patterns that change meaning: stop, remember, try',
        points: [
          { form: 'stop + V-ing / stop + to + verb', use: 'Quit a habit / pause one action to do another.', example: 'I stopped buying useless things. · I stopped to look at the shop window.' },
          { form: 'remember + V-ing / remember + to + verb', use: 'A memory of the past / a task you must not forget.', example: 'I remember buying this jacket five years ago. · Please remember to buy milk.' },
          { form: 'try + V-ing / try + to + verb', use: 'An experiment to see if it works / a real effort at something difficult.', example: 'Try cleaning your room if you feel stressed. · I’m trying to lift this heavy box.' },
        ],
        tip: 'If you can say “I recall doing…”, use V-ing. If it means “don’t forget to…”, use to + verb.',
      },
      discussion: [
        'Are you a minimalist or a hoarder? What does your home say about you?',
        'What is one possession you could never part with? Why is it so special?',
        'Can you remember buying something you never used?',
        'Try imagining your life with only 50 objects. Would you feel happier or anxious?',
        'Does online shopping make us accumulate things we don’t need?',
        'Do you agree that less is more? When is it not true?',
      ],
      task: {
        prompt: 'Talk about a time you decided to declutter.',
        points: [
          'What made you start',
          'What you gave away and what you couldn’t part with',
          'How your space and your mind felt afterwards',
          'Use stop + V-ing and try + V-ing',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My apartment used to be small and cramped, and clutter accumulated everywhere. I was almost a hoarder: I kept every box and every receipt. Last year, I tried living with fewer possessions. I stopped buying things I didn't need and gave away two bags of clothes. Some things were hard to part with, so I kept one keepsake from each trip. Now my room has a calm, simple aesthetic, and my consumption is much lower. Minimalism taught me that less is more.",
    },
    `
n | clutter | A lot of objects in an untidy state, filling a space. | I need to clean my room because there is too much clutter.
n | possessions | The things that you own. | We packed all our possessions into two boxes.
n | consumption | The amount of goods, energy or food that people buy and use. | Online shopping increases our daily consumption.
n | hoarder | A person who keeps a lot of things, often things they don't need, and finds it hard to throw them away. | He never throws anything away; he is a real hoarder.
n | minimalism | A way of living with only the things you really need. | Minimalism teaches us to live a simple and happy life.
n | keepsake | A small object you keep to remind you of a person, place or time. | I kept this old photo as a keepsake of my childhood.
n | aesthetic | The style and appearance of something, especially when it looks attractive. | She loves a clean, white aesthetic in her house.
adj | cramped | Too small for the people or things in it, so that it is uncomfortable. | The hotel room was very small and cramped.
v | accumulate | To slowly increase in number or amount over time. | If you don't clean your desk, papers will accumulate quickly.
pv | give away | To give something to someone without asking for money. | I always give away my old jackets to charity.
pv | part with | To give away or sell something, especially when you don't want to. | I can't part with my old books; they mean too much to me.
i | less is more | Something simple is often better than something with too many things in it. | Keep your bedroom simple and clean, because less is more.
`
  ),
  pack(
    {
      id: 'social-responsibility',
      group: 'society',
      title: 'The Weight of the World',
      description: 'Social responsibility, ethics and civic duty — with be supposed to, be allowed to and had better.',
      level: 'B2',
      emoji: '⚖️',
      fromCourse: true,
      warmUp: [
        'You just won $10 million. Do you have a moral obligation to give some to charity — or is every dollar 100% yours?',
        'You see a stranger drop trash in the street. Do you speak up or walk past? What does your answer say about your values?',
      ],
      grammar: {
        title: 'Rules, expectations and warnings',
        points: [
          { form: 'be (not) allowed to + base verb', use: 'Official rules and permission (by law, society or an authority).', example: 'Factories are not allowed to dump chemical waste in the sea.' },
          { form: 'be supposed to + base verb', use: 'What is expected of someone — social norms or duties, often not done.', example: 'She was supposed to report the problem, but she didn’t.' },
          { form: 'had better (not) + base verb', use: 'A strong warning: do this, or something bad will happen.', example: 'We had better stop using so much plastic.' },
        ],
        tip: '“had better” has no “to”: “You had better leave”, not “You had better to leave”.',
      },
      discussion: [
        'Should rich people do more philanthropy?',
        'Is free education a privilege or a right?',
        'Why do some people turn a blind eye to the problems around them?',
        'Agree or disagree: people should be allowed to say anything online.',
        'Should voting be mandatory?',
        'A factory is polluting a river. What are citizens supposed to do?',
      ],
      task: {
        prompt: 'Pick a real social issue (traffic, pollution, inequality…) and warn people about it.',
        points: [
          'What the problem is',
          'What people are supposed to do',
          'What is not allowed — and what should be',
          'What we had better do now',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Trash in our streets is a problem we can't turn a blind eye to. Throwing litter is not allowed, and every citizen is supposed to keep the city clean. It's our civic duty. Some people say it isn't their job, but being a bystander is also a choice. Last month, our local council launched a new initiative to implement recycling in every school, and a businessman paid for it as an act of philanthropy. Leaders need to accept accountability and lead by example. If we want clean streets, we had better speak up now.",
    },
    `
n | accountability | Being responsible for your decisions and actions and ready to explain them. | A good leader must accept accountability for their team's mistakes.
n | philanthropy | Giving money and help to people in need, especially by rich people or organizations. | The billionaire is famous for his philanthropy and building schools in poor countries.
n | privilege | A special advantage that only some people or groups have. | Having access to free education is a great privilege that we should not ignore.
n | initiative | A new plan or action to solve a problem or improve a situation. | The government launched a new initiative to clean the city streets.
n | bystander | A person who sees something happening, such as an accident or a crime, but does not take part. | Don't just be a bystander when you see someone asking for help.
adj | ethical | Morally right and acceptable. | Is it ethical to buy cheap clothes made by young children?
adj | mandatory | Required by a law or rule. | Wearing a seatbelt is mandatory when you drive a car.
v | implement | To start using a plan, system or law and make it work. | The school will implement a new system for online exams next week.
n | civic duty | Something that every citizen should do for their community or country. | Voting in the national elections is your civic duty.
pv | speak up | To say clearly what you think, especially to complain about something that is wrong. | When you see someone being treated unfairly, you should speak up.
i | lead by example | To show others how to behave by doing it well yourself. | A successful manager does not just give orders; they lead by example.
i | turn a blind eye | To pretend not to notice something wrong so that you don't have to deal with it. | We cannot turn a blind eye to the problem of homeless people in our city.
`
  ),
  pack(
    {
      id: 'smart-learning',
      group: 'society',
      title: 'Smart Learning',
      description: 'The future of education: courses, exams and how we learn — with purpose clauses.',
      level: 'B2',
      emoji: '🎓',
      fromCourse: true,
      warmUp: [
        'If you had to learn a very difficult new skill in exactly six months, would you rather join a strict, traditional university course or teach yourself online? Why?',
        'Why are you learning English, and how will you know you have succeeded?',
      ],
      grammar: {
        title: 'Purpose clauses: to, in order to, so that',
        points: [
          { form: 'to / in order to + base verb', use: 'Why you do something (“in order to” is more formal).', example: 'I drink coffee to stay awake. · We launched a campaign in order to attract new students.' },
          { form: 'so that + subject + can / could / will', use: 'The result you want, especially when the subject changes.', example: 'I study every day so that I can travel the world. · Turn on your camera so that we can see you.' },
        ],
        tip: 'Don’t say “for to study” or “for study”: say “to study” or “in order to study”.',
      },
      discussion: [
        'Should English be compulsory from the first year of school?',
        'Is a final exam a fair assessment of what students know?',
        'Which teaching methodology has worked best for you?',
        'Is it useful to learn things by heart, or should we focus on understanding?',
        'What skill do you need to brush up on this year, and why?',
        'How can older people improve their digital literacy?',
      ],
      task: {
        prompt: 'Describe a strict rule you have for yourself when you study.',
        points: [
          'What the rule is',
          'Why you follow it (to / in order to / so that)',
          'One thing you want to brush up on',
          'How you check your progress',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "This year, I joined an intensive English course in order to improve my speaking. The syllabus is clear, and the methodology is very practical: we don't learn grammar rules by heart; we use them in real conversations. Every month, the teacher evaluates our progress, and the final assessment is a speaking test. I read the news every morning to improve my comprehension, and I review my notes at night so that I can absorb the new words. Before the exam, I'll brush up on my pronunciation.",
    },
    `
n | literacy | The ability to read and write, or basic knowledge and skill in a particular area. | The new educational program aims to improve computer literacy among older adults.
v | evaluate | To judge how good, useful or successful something or someone is. | The teacher will carefully evaluate your speaking skills during tomorrow's presentation.
n | comprehension | The ability to understand something, especially spoken or written language. | Reading English news articles every day will greatly improve your reading comprehension.
v | absorb | To take in information and understand it fully. | It is hard to absorb so much information in just one lecture.
n | assessment | A test or judgment of someone's knowledge or ability. | Your final assessment for this level will be a speaking test, not a written exam.
n | syllabus | A list of the topics that a course will cover. | Please read the course syllabus carefully to know exactly what topics we will cover this month.
n | alumni | The former students of a school, college or university. | The university invited its successful alumni to speak to the new students.
n | methodology | The set of methods used in a particular activity, such as teaching or research. | Smart learning requires a completely different teaching methodology.
adj | compulsory | Required by a rule or law; that you must do. | Math and science are compulsory subjects in high school.
adj | intensive | Involving a lot of work or activity in a short time. | She took an intensive three-month course to learn German.
pv | brush up on | To practice and improve a skill that you had before but have partly forgotten. | She needs to brush up on her grammar before the final exam.
i | learn by heart | To learn something so well that you can say it from memory. | We had to learn a long poem by heart for the literature class.
`
  ),
  pack(
    {
      id: 'crime',
      group: 'society',
      title: 'Crimes',
      description: 'Crime, investigation and the courts — and the passive voice that news reports use.',
      level: 'B2',
      emoji: '🚔',
      fromCourse: true,
      warmUp: [
        'What is the worst crime you have heard about recently?',
        'Is there an urban legend or scary story in your town? Do you believe it?',
      ],
      grammar: {
        title: 'The passive voice: the language of police reports',
        points: [
          { form: 'object + be + V3', use: 'Focus on the action or the victim, not on who did it (often unknown).', example: 'Someone stole the car. → The car was stolen.' },
          { form: 'am/is/are + V3 · was/were + V3', use: 'Present simple / past simple passive.', example: 'A car is stolen every day. · The car was stolen yesterday.' },
          { form: 'is being + V3 · was being + V3', use: 'Present / past continuous passive.', example: 'The scene is being investigated. · The house was being watched.' },
          { form: 'has been + V3 · had been + V3', use: 'Present perfect / past perfect passive.', example: 'The suspect has been arrested. · The money had been taken.' },
          { form: 'will be + V3 · modal + be + V3', use: 'Future / modal passive.', example: 'The case will be closed. · Evidence must be protected.' },
        ],
        tip: 'Add the doer with “by” only when it matters: “The suspect was arrested by a young police officer.”',
      },
      discussion: [
        'Why do people commit crimes like shoplifting — need or thrill?',
        'Should vandalism be punished with prison or with community work?',
        'Is bribery a big problem where you live? How could it be stopped?',
        'Would you be brave enough to be a witness in court?',
        'How realistic are the forensics we see on TV?',
        'Can a criminal really get away with a crime today, with cameras everywhere?',
      ],
      task: {
        prompt: 'You are a news reporter covering a funny invented crime (e.g. “All the coffee was stolen from the office”).',
        points: [
          'What was stolen or damaged (past simple passive)',
          'What has been done so far (present perfect passive)',
          'What will happen next (future passive)',
          'Use at least 3 new words',
        ],
      },
      paragraph:
        "Good evening. Last night, a jewelry shop downtown was robbed. The windows were smashed, and a witness saw two men leaving the building at midnight. The scene is being examined by forensics experts, and a warrant has been issued to search a house nearby. One suspect has already been arrested and accused of the robbery. His attorney says he is innocent, but the prosecutor believes he won't get away with it. If he is found guilty, he could spend years behind bars.",
    },
    `
n | forensics | Scientific methods used to find out facts about a crime, such as fingerprints or DNA. | The police used forensics to find the criminal's fingerprints.
n | vandalism | The crime of deliberately damaging public or private property. | The park is closed because of vandalism.
n | shoplifting | The crime of stealing things from a shop while pretending to be a customer. | Shoplifting is a big problem in the mall.
n | lawyer | A person whose job is to give legal advice and to represent people in court. | She hired a lawyer to help her in court.
p | brutal murder | A very violent and cruel killing of a person. | The city was shocked by a brutal murder that happened downtown.
n | attorney | (mainly American English) A lawyer, especially one who represents someone in court. | His attorney advised him not to answer any questions.
n | warrant | An official document from a judge that allows the police to arrest someone or search a place. | The police obtained a warrant to search the suspect's house.
n | prosecutor | The lawyer who tries to prove in court that someone is guilty of a crime. | The prosecutor presented strong evidence against the defendant.
n | witness | A person who saw a crime or accident happen and can describe it. | A witness saw the suspect leaving the building.
v | accuse | To say that someone has done something wrong or illegal (accuse someone of doing something). | They accused him of stealing the money.
n | bribery | The crime of giving someone money or a gift so that they do something dishonest for you. | Bribery is a serious crime.
v | investigate | To try to find out all the facts about a crime or a problem. | The detective will investigate the crime.
v | smuggle | To take things or people into or out of a country illegally and secretly. | The criminals tried to smuggle drugs across the border.
n | ransom | Money that kidnappers demand before they free the person they are holding. | The kidnappers demanded a large ransom for his release.
i | behind bars | In prison. | The robber spent ten years behind bars.
pv | get away with | To do something wrong and not be caught or punished for it. | He thought he could get away with the crime, but the police caught him.
`
  ),
  pack(
    {
      id: 'shop-smart',
      group: 'life',
      title: 'Shop Smart: The Psychology of Spending',
      description: 'Brands, bargains and why we buy — with advanced comparisons (the… the…, far, slightly).',
      level: 'B2',
      emoji: '🛒',
      fromCourse: true,
      warmUp: [
        'Have you ever bought something you didn’t need just because it had a big discount or a red “Sale” tag? Do you still use it?',
        'Are you a smart shopper or an impulsive shopper? Why?',
      ],
      grammar: {
        title: 'Advanced comparisons',
        points: [
          { form: 'The + comparative (+ subject + verb), the + comparative (+ subject + verb)', use: 'Cause and effect: one change causes another.', example: 'The bigger the discount is, the faster the item sells out.' },
          { form: 'much / far / way + comparative', use: 'A big difference (“way” is informal and spoken).', example: 'Online shopping is far easier than going to a crowded mall.' },
          { form: 'a bit / a little / slightly + comparative', use: 'A small difference (“slightly” is more formal).', example: 'The blue jacket is slightly cheaper than the black one.' },
        ],
        tip: 'Don’t use “very” with comparatives: “much cheaper”, not “very cheaper”.',
      },
      discussion: [
        'What do you usually spend most of your money on?',
        'Do you think you are brand-conscious?',
        'What is something you would never spend a lot of money on?',
        'Have you ever paid through the nose for something? Was it worth it?',
        'Is online shopping way more dangerous than shopping in stores for impulse buys?',
        'Are famous brands really better quality — or just slightly better and far more expensive?',
        'Is buying second-hand becoming more popular? Why or why not?',
      ],
      task: {
        prompt: 'Compare two recent purchases or two shops you like.',
        points: [
          'Which one is better value, and why',
          'At least one “The… the…” sentence',
          'At least two modifiers: way, far, slightly',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I used to be really brand-conscious. Whenever I felt stressed, I did some retail therapy and splurged on high-end sneakers. One day I realized I had paid through the nose for things I never used. Now I compare prices before I buy. Local shops are slightly smaller, but their prices are way more affordable than big retailers. The more I shop around, the more money I save. I also avoid extravagant sales events, where popular items sell out in minutes and people buy counterfeit products by mistake.",
    },
    `
adj | brand-conscious | Caring a lot about which brand you buy and preferring famous ones. | Many teenagers are highly brand-conscious and refuse to wear unbranded sneakers.
n | shopaholic | A person who enjoys shopping very much and does it too often. | My friend is such a shopaholic that she goes to the mall every single day after work.
n | consumerism | The belief that buying more and more things is good, or a society's focus on buying things. | Modern consumerism often encourages people to buy things they don't actually need just to keep up with trends.
n | retail therapy | Shopping to make yourself feel happier when you are sad or stressed. | After a stressful week at the office, she decided to do some retail therapy and bought a new dress.
adj | counterfeit | Made to look exactly like the real thing in order to trick people; fake. | The police confiscated thousands of counterfeit designer bags that were being sold illegally on the street.
adj | affordable | Cheap enough for ordinary people to buy. | We are looking for an affordable apartment that is close to the city center but doesn't cost too much.
adj | extravagant | Spending much more money than is necessary or sensible. | Spending $1,000 on a single dinner is a very extravagant way to celebrate a birthday.
v | splurge | To spend a lot of money on something you enjoy, usually something you don't need. | Since it was her graduation, she decided to splurge on a luxurious vacation to the Maldives.
adj | high-end | Expensive and of very high quality. | That street is famous for its high-end boutiques and luxury jewelry stores.
n | retailer | A person or company that sells goods to the public. | Amazon has grown to become the largest online retailer in the world.
i | pay through the nose | To pay much more for something than it is really worth. | If you wait until the day before the flight to book your ticket, you will definitely pay through the nose.
pv | sell out | To be all sold, so that there are none left. | The concert tickets were so popular that they sold out in just five minutes.
`
  ),
];
