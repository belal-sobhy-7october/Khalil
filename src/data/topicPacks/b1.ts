/** B1 topics, built with the course method (see ./types.ts and ./README.md). */
import { pack, type TopicPack } from './types';

export const B1_PACKS: TopicPack[] = [
  pack(
    {
      id: 'life-experiences',
      group: 'talk',
      title: 'Life Experiences, Memories & Storytelling',
      description: 'Tell a story about something that happened to you, and talk about your memories.',
      level: 'B1',
      emoji: '📖',
      warmUp: [
        'What is one of your best childhood memories?',
        'Do you like telling stories, or listening to them?',
      ],
      grammar: {
        title: 'Narrative tenses: past simple and past continuous',
        points: [
          { form: 'past continuous (was/were + V-ing)', use: 'The background: what was happening at a moment in the past.', example: 'It was raining, and we were walking home.' },
          { form: 'past simple', use: 'The main events, one after another.', example: 'Suddenly, a car stopped next to us.' },
          { form: 'when / while', use: 'Joining a longer action and a short one.', example: 'I was cooking when the lights went out. While I was waiting, I met an old friend.' },
        ],
        tip: 'Use the past continuous for the longer background action, not for every past verb: “I was reading when he called”, not “I was reading when he was calling”.',
      },
      discussion: [
        'What is your earliest memory?',
        'Tell us about an embarrassing moment you can laugh about now.',
        'What was the most amazing day of your life?',
        'When did you last feel really scared?',
        'What smell or song reminds you of your childhood?',
        'When you look back on your school days, how do you feel?',
      ],
      task: {
        prompt: 'Tell a short story about something unforgettable that happened to you.',
        points: [
          'Where you were and what was happening (past continuous)',
          'What happened suddenly (past simple)',
          'How you felt',
          'How the story turned out in the end',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "One of my most unforgettable memories happened when I was twelve. My family and I were driving to Alexandria, and it was raining heavily. Suddenly, the car stopped in the middle of the road. My father was trying to fix it, and my little sister was crying because she was scared. Then a truck driver stopped and helped us. He even gave us tea from his flask! In the end, we arrived late, but we had an amazing story to tell. Whenever it rains, it reminds me of that day, and when I look back, I always smile.",
    },
    `
n | memory | Something that you remember from the past. | I have happy memories of my grandmother's house.
v | remember | To have a picture of something from the past in your mind. | I remember my first day at school very clearly.
n | experience | Something that happens to you and affects how you feel. | Living abroad was a great experience.
v | happen | To take place, usually without being planned. | What happened at the party last night?
n | childhood | The time when you were a child. | I spent my childhood in a small village.
adj | unforgettable | So good or so strong that you will always remember it. | Our trip to Aswan was unforgettable.
n | moment | A very short period of time, or a particular point in time. | It was the happiest moment of my life.
adv | suddenly | Quickly and when you don't expect it. | Suddenly, the lights went out.
adj | embarrassing | Making you feel nervous, stupid or ashamed in front of other people. | I fell over in front of the whole class; it was so embarrassing.
adj | scared | Frightened or worried. | I was scared of the dark when I was a kid.
v | remind | To make someone think of something they have seen or done before. | This song reminds me of my summer in Dahab.
p | in the end | Finally, after a lot of things have happened. | We got lost twice, but in the end, we found the hotel.
pv | look back | To think about something that happened in the past. | When I look back, I'm glad I studied abroad.
pv | turn out | To happen in a particular way, or to be found to be true at the end. | The trip was a disaster, but it turned out to be really fun.
`
  ),
  pack(
    {
      id: 'goals-and-change',
      group: 'talk',
      title: 'Goals, Ambitions & Personal Change',
      description: 'Talk about your goals and ambitions, the changes you want to make and how you will get there.',
      level: 'B1',
      emoji: '🎯',
      warmUp: [
        'What is one goal you have for this year?',
        'Who in your life is very ambitious?',
      ],
      grammar: {
        title: 'will, might and going to for plans and predictions',
        points: [
          { form: 'be going to + base verb', use: 'A plan you have already decided on.', example: 'I’m going to take an English course in September.' },
          { form: 'will + base verb', use: 'A prediction you’re sure about, or a decision you make now.', example: 'I think I’ll get a promotion next year.' },
          { form: 'might + base verb', use: 'Something that is possible but not certain.', example: 'I might study abroad one day.' },
        ],
        tip: 'Use going to, not will, for plans you made before: “I’m going to start a course”, not “I will start a course tomorrow, I booked it”.',
      },
      discussion: [
        'What is your biggest ambition?',
        'What will you have achieved in five years, do you think?',
        'What decision changed your life?',
        'What do you do when you want to give up?',
        'How confident are you that you can reach your goals?',
        'What motivates you more: money, family or something else?',
      ],
      task: {
        prompt: 'Talk about one goal you want to achieve.',
        points: [
          'What the goal is and why it matters to you',
          'What you’re going to do first',
          'A challenge that might stop you',
          'How you’ll stay motivated',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My biggest ambition is to work for an international company. Last year, I made a decision: I set a goal to improve my English in twelve months. I'm going to take a speaking course in September, and I might take the IELTS next summer. It's a big challenge because I work full-time. Some days I feel like giving up, but my family is my motivation. I'm more confident now than a year ago, and I can see my progress. I'm determined to succeed, and I think I'll achieve my dream in the end.",
    },
    `
n | goal | Something that you hope to achieve. | My goal is to speak English fluently.
n | ambition | A strong wish to achieve something. | Her ambition is to become a doctor.
v | achieve | To succeed in doing something after a lot of effort. | She achieved her dream of working abroad.
n | dream | Something that you want very much. | It's my dream to visit Japan.
v | improve | To get better, or to make something better. | I want to improve my pronunciation.
n | decision | A choice that you make after thinking. | Leaving my job was a difficult decision.
n | challenge | Something difficult that tests your ability. | Learning to drive was a big challenge for me.
v | succeed | To achieve what you were trying to do. | If you work hard, you'll succeed.
n | progress | Movement toward getting better or reaching a goal. | I'm making good progress with my English.
adj | confident | Feeling sure about yourself and your abilities. | I feel more confident when I speak English now.
adj | determined | Wanting to do something very much, so that you don't let anything stop you. | He's determined to pass the exam this time.
n | motivation | The feeling of wanting to do something, or the reason for doing it. | My children are my motivation.
pv | give up | To stop trying to do something. | Don't give up; you're almost there!
pv | work out | To find the answer to a problem or the best way to do something. | I need to work out how to save more money.
`
  ),
  pack(
    {
      id: 'friendship-and-conflict',
      group: 'talk',
      title: 'Friendship, Relationships & Social Conflict',
      description: 'Talk about friends, trust and arguments, and how to make up after a fight.',
      level: 'B1',
      emoji: '🤝',
      warmUp: [
        'How long have you known your oldest friend?',
        'What makes someone a good friend?',
      ],
      grammar: {
        title: 'The present perfect with for and since',
        points: [
          { form: 'have/has + past participle + for + a period', use: 'Something that started in the past and is still true.', example: 'We’ve been friends for ten years.' },
          { form: 'have/has + past participle + since + a point in time', use: 'The same, with the starting point.', example: 'I’ve known her since school.' },
          { form: 'How long have you …?', use: 'Asking about the length of a situation that is still true.', example: 'How long have you lived here?' },
        ],
        tip: 'Arabic speakers often use the present simple here. Say “I’ve known him for five years”, not “I know him from five years”.',
      },
      discussion: [
        'How long have you known your best friend?',
        'What do you do when a friend lets you down?',
        'Is it OK to be a little jealous of a friend’s success?',
        'Have you ever fallen out with a close friend? Did you make up?',
        'Is it easy for you to apologize?',
        'How do you keep in touch with friends who live far away?',
      ],
      task: {
        prompt: 'Talk about a friendship that is important to you.',
        points: [
          'How long you have known each other (for / since)',
          'What you like about this person',
          'An argument you had and how you made up',
          'How you keep in touch',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I've known my friend Hany since we were six, so we've been friends for almost twenty years. He's very loyal, and I can trust him with anything. Two years ago, we had a big argument about money, and we fell out for three months. I was angry because I felt he had let me down. In the end, he called me and apologized, and I forgave him. Now we get on with each other better than ever. He lives in Dubai now, but we keep in touch every week. I've learned that respect is more important than being right.",
    },
    `
n | relationship | The way two people or groups feel about and behave toward each other. | I have a good relationship with my brother.
v | trust | To believe that someone is honest and will not hurt you. | I trust my sister with all my secrets.
v | argue | To speak angrily to someone because you disagree. | My parents never argue in front of us.
n | argument | An angry discussion between people who disagree. | We had an argument about where to go on vacation.
v | apologize | To say that you are sorry for something you did. | He apologized for being late.
v | forgive | To stop being angry with someone for something they did. | Can you ever forgive me?
adj | loyal | Always supporting your friends, even in difficult times. | She's a loyal friend; she's always there for me.
adj | jealous | Unhappy because someone has something you want. | He was jealous of his brother's new car.
v | support | To help someone emotionally, especially in a difficult time. | My friends supported me when I lost my job.
n | respect | A feeling that someone is good or important and should be treated well. | I have a lot of respect for my teacher.
pv | fall out | To argue with someone and stop being friendly with them. | They fell out over a girl.
pv | make up | To become friends again after an argument. | We had a fight, but we made up the next day.
pv | let down | To disappoint someone by not doing what they expected. | He promised to come, but he let me down.
p | keep in touch | To continue to talk to or write to someone. | Let's keep in touch after you move.
`
  ),
  pack(
    {
      id: 'wellbeing-and-stress',
      group: 'society',
      title: 'Emotional Wellbeing, Stress & Support',
      description: 'Talk about stress and feelings, how you cope, and how to give support and advice.',
      level: 'B1',
      emoji: '🧘',
      warmUp: [
        'What makes you stressed?',
        'What do you do to relax after a long day?',
      ],
      grammar: {
        title: 'The second conditional for advice: If I were you…',
        points: [
          { form: 'If + past simple, would + base verb', use: 'An imaginary situation now or in the future.', example: 'If I had more time, I would exercise every day.' },
          { form: 'If I were you, I would/I’d + base verb', use: 'Giving advice.', example: 'If I were you, I’d talk to your manager.' },
          { form: 'What would you do if …?', use: 'Asking about an imaginary situation.', example: 'What would you do if you felt lonely?' },
        ],
        tip: 'Use were for all people in “If I were you”: “If I were you”, not “If I was you” in careful English, and never “If I would be you”.',
      },
      discussion: [
        'What puts you under pressure: work, studies or family?',
        'How do you cope when you feel anxious?',
        'Who do you talk to when you’re in a bad mood?',
        'Is it easy to talk about mental health in Egypt?',
        'Have you ever felt exhausted or burned out? What helped?',
        'What would you say to a friend who feels lonely?',
      ],
      task: {
        prompt: 'A friend feels very stressed. Give them advice.',
        points: [
          'Ask how they feel and listen',
          'Give two pieces of advice (If I were you…)',
          'Suggest a way to relax',
          'Say who else could help',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last year, I was under a lot of pressure at work, and I felt stressed all the time. I couldn't relax, I slept badly, and I was always in a bad mood. I didn't want to talk to anyone, so I felt lonely too. One day, my sister said, 'If I were you, I'd talk to someone about it.' I went to a therapist for a few months, and it really helped me cope. I learned to calm down by walking and writing down my thoughts. Now, when I feel overwhelmed, I deal with one problem at a time. Mental health is as important as physical health.",
    },
    `
adj | stressed | Worried and nervous because of problems or too much work. | I always feel stressed before exams.
adj | anxious | Worried and nervous about something that might happen. | She's anxious about the job interview.
v | relax | To rest and become calm, without worries. | I relax by listening to music.
n | pressure | A feeling of stress because you have to deal with too much. | Doctors work under a lot of pressure.
n | mood | The way you feel at a particular time. | My boss is in a bad mood today.
adj | lonely | Unhappy because you are alone or have no friends. | I felt lonely when I moved to a new city.
v | cope | To deal successfully with a difficult situation. | How do you cope with all this work?
n | advice | An opinion that you give someone about what they should do. | My father gave me some good advice.
n | therapist | A person whose job is to help people with their feelings and mental problems by talking. | Talking to a therapist helped me a lot.
n | mental health | The health of your mind and feelings. | Exercise is good for your mental health.
adj | exhausted | Extremely tired. | After a twelve-hour shift, I'm exhausted.
adj | overwhelmed | Feeling that you have too much to deal with. | I felt overwhelmed in my first week at work.
pv | calm down | To become less angry, upset or excited. | Calm down and tell me what happened.
pv | deal with | To take action to solve a problem or handle a situation. | She deals with stress by going for a run.
`
  ),
  pack(
    {
      id: 'conversation-and-misunderstandings',
      group: 'talk',
      title: 'Conversation Management & Misunderstandings',
      description: 'Keep a conversation going, check what people mean and fix a misunderstanding politely.',
      level: 'B1',
      emoji: '💬',
      warmUp: [
        'Do you find it easy to start a conversation in English?',
        'What do you do when you don’t understand someone?',
      ],
      grammar: {
        title: 'Question tags and short answers',
        points: [
          { form: 'positive sentence, negative tag', use: 'Checking or inviting agreement.', example: 'It’s hot today, isn’t it? You work here, don’t you?' },
          { form: 'negative sentence, positive tag', use: 'The same, after a negative.', example: 'You didn’t see my message, did you?' },
          { form: 'So do I · Neither do I · I do · I don’t', use: 'Short replies to agree or disagree.', example: '“I love coffee.” “So do I.” “I can’t swim.” “Neither can I.”' },
        ],
        tip: 'The tag uses the same auxiliary as the sentence (or do/does/did): “She lives near you, doesn’t she?”, not “isn’t it?” for everything.',
      },
      discussion: [
        'How do you keep a conversation going with someone new?',
        'Is it rude to interrupt someone? When is it OK?',
        'What do you say when you’re confused in a conversation?',
        'Tell us about a mix-up that happened because of a misunderstanding.',
        'What topics are good for a first conversation?',
        'How do you change the topic politely?',
      ],
      task: {
        prompt: 'Record a short conversation (you play both people) where there’s a misunderstanding.',
        points: [
          'Start a conversation with a question tag',
          'Show the misunderstanding',
          'Ask the other person to explain or repeat',
          'Fix the mix-up politely',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last week, I had a funny mix-up with my new colleague, Sam. He said, 'We're meeting at the coffee place at four, aren't we?' I thought he meant the café downstairs, so I waited there for half an hour. He was waiting at a different café! When I called him, I was a bit confused, so I asked him to explain. 'I meant the one on the corner,' he said. 'Sorry, I misunderstood!' I said. We both laughed, and by the way, the coffee there was much better. Now, when I'm not sure, I ask people to repeat or clarify before I go.",
    },
    `
v | misunderstand | To understand something wrongly. | I misunderstood the question and gave the wrong answer.
v | mean | To intend to say something. | What do you mean by "later"? Today or tomorrow?
v | explain | To make something clear by giving details. | Can you explain the rules again?
v | repeat | To say something again. | Could you repeat that, please?
adj | confused | Not able to understand or think clearly. | I'm confused; which bus should I take?
v | interrupt | To start talking while someone else is talking. | Sorry to interrupt, but there's a call for you.
v | clarify | To make something clearer by explaining it. | Could you clarify what you need from me?
adj | polite | Behaving in a way that shows respect and good manners. | It's polite to say thank you.
adj | rude | Not polite. | It's rude to look at your phone when someone is talking.
n | topic | A subject that people talk or write about. | Football is a safe topic with my uncle.
n | mix-up | A mistake that causes confusion about times, places or names. | There was a mix-up with our tickets.
p | by the way | Used to start talking about something new. | By the way, did you call your mother?
pv | go on | To continue talking or doing something. | Sorry I interrupted. Please go on.
`
  ),
  pack(
    {
      id: 'opinions-and-reasons',
      group: 'talk',
      title: 'Opinions, Comparisons & Giving Reasons',
      description: 'Give your opinion, compare choices and explain your reasons clearly.',
      level: 'B1',
      emoji: '🗣️',
      warmUp: [
        'Do you prefer cats or dogs? Why?',
        'Do you often change your mind?',
      ],
      grammar: {
        title: 'Linking reasons and contrast: because, so, although, however',
        points: [
          { form: 'because + reason · so + result', use: 'Giving a reason and a result.', example: 'I prefer the metro because it’s faster. It was raining, so we stayed home.' },
          { form: 'although + clause', use: 'Contrast inside one sentence.', example: 'Although it’s expensive, I like it.' },
          { form: 'However, + new sentence', use: 'Contrast between two sentences.', example: 'Cities are exciting. However, they are noisy.' },
        ],
        tip: 'Don’t use but and although together: say “Although it was late, I called her”, not “Although it was late, but I called her”.',
      },
      discussion: [
        'Is it better to live in a city or a village? Why?',
        'Do you prefer studying alone or in a group?',
        'What are the advantages and disadvantages of working from home?',
        'Is it easy to convince you to change your opinion?',
        'When do you agree with your parents, and when do you disagree?',
        'What is something that doesn’t make sense to you?',
      ],
      task: {
        prompt: 'Give your opinion on a simple question: Is it better to have a car in Cairo?',
        points: [
          'Say your opinion clearly',
          'Give two reasons (because, so)',
          'Show the other side (although, however)',
          'Finish with a short conclusion',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "In my opinion, it's better to use the metro than a car in Cairo. The main reason is the traffic: a car can take two hours, but the metro takes thirty minutes. It's also cheaper, so you can save money. On the other hand, the metro is very crowded in the morning. My friend disagrees with me because she has two children, and a car is easier for her. Although I see her point, I still prefer the metro. Her point of view makes sense for a family, but for me, the advantages of the metro are bigger. Compare the costs, and you'll agree!",
    },
    `
n | opinion | What you think about something. | In your opinion, what's the best phone?
v | agree | To have the same opinion as someone. | I agree with you; it's a great idea.
v | disagree | To have a different opinion from someone. | I disagree; I think it's too expensive.
n | point of view | A way of thinking about something; an opinion. | From my point of view, the plan won't work.
n | reason | Why something happens or why you do something. | What's the reason for your decision?
n | advantage | Something good that helps you. | One advantage of living here is the quiet.
n | disadvantage | Something that makes a situation worse. | The main disadvantage is the price.
v | compare | To look at how two things are similar or different. | Compare the prices before you buy.
v | prefer | To like one thing more than another. | I prefer tea to coffee.
p | in my opinion | Used to say what you think. | In my opinion, he's the best player.
p | on the other hand | Used to give a different, opposite point. | The job pays well. On the other hand, the hours are long.
v | convince | To make someone believe that something is true. | She convinced me to join the gym.
n | point | An idea or a fact in a discussion. | That's a good point.
p | make sense | To be easy to understand, or to be a sensible thing to do. | His plan makes sense.
pv | come up with | To think of an idea or a plan. | We came up with a good solution.
`
  ),
  pack(
    {
      id: 'problems-complaints-advice',
      group: 'life',
      title: 'Problem-Solving, Complaints & Advice',
      description: 'Explain a problem, make a polite complaint and suggest a solution.',
      level: 'B1',
      emoji: '🛠️',
      warmUp: [
        'When did you last complain about something?',
        'Who do you ask for advice when you have a problem?',
      ],
      grammar: {
        title: 'Polite requests and indirect questions',
        points: [
          { form: 'Could you / Would you + base verb …?', use: 'Polite requests.', example: 'Could you look into it, please?' },
          { form: 'Could you tell me + question word + subject + verb?', use: 'Indirect questions: more polite, and no do/does/did.', example: 'Could you tell me when the technician will come?' },
          { form: 'I was wondering if + clause', use: 'A very polite request.', example: 'I was wondering if you could give me a refund.' },
        ],
        tip: 'In indirect questions, use normal word order: say “Can you tell me where the office is?”, not “Can you tell me where is the office?”.',
      },
      discussion: [
        'What’s the best way to make a complaint: by phone, by email or in person?',
        'Do you think complaining is rude in Egypt?',
        'What problem at home or at work did you solve recently?',
        'Who gives the best advice in your family?',
        'What would you recommend to someone who has a problem with their internet company?',
        'When is a compromise the best solution?',
      ],
      task: {
        prompt: 'Call a company to complain about a problem.',
        points: [
          'Explain the problem clearly',
          'Ask a polite indirect question',
          'Suggest a solution',
          'Agree on what happens next',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last month, my internet stopped working for three days, so I decided to make a complaint. I called customer service and explained the problem politely. I said, 'Could you tell me when a technician can come?' The agent said she would look into it and get back to me. Nothing happened, so I called again the next day. This time, I suggested a solution: a technician that afternoon and a discount on my bill for the inconvenience. We reached a compromise: a technician the same day and one free week. He sorted out the problem in twenty minutes!",
    },
    `
n | problem | A situation that causes difficulties. | We have a problem with the washing machine.
n | solution | A way to solve a problem. | The best solution is to buy a new one.
n | complaint | A statement that you are not happy about something. | I made a complaint about the noise.
v | solve | To find an answer to a problem. | The technician solved the problem quickly.
v | fix | To repair something. | Can you fix my laptop?
v | suggest | To give someone an idea about what to do. | I suggest we leave early to avoid traffic.
v | recommend | To say that something is good and that someone should try it or do it. | I recommend this doctor; she's excellent.
n | compromise | An agreement in which each side gives up some of what it wanted. | We reached a compromise: half the money now, half later.
n | inconvenience | Trouble or problems that something causes. | We're sorry for any inconvenience.
v | manage | To succeed in doing something difficult. | I managed to fix it myself.
pv | sort out | To deal with a problem successfully. | Don't worry; I'll sort it out.
pv | look into | To try to find out about a problem. | The manager promised to look into my complaint.
pv | get back to | To speak or write to someone again later, often to give an answer. | I'll get back to you tomorrow.
p | make a complaint | To tell someone officially that you are not happy about something. | I want to make a complaint about the service.
`
  ),
  pack(
    {
      id: 'learning-strategies',
      group: 'work',
      title: 'Language Learning & Learning Strategies',
      description: 'Talk about how you learn English and other skills, and which methods work for you.',
      level: 'B1',
      emoji: '🧠',
      fromCourse: true,
      warmUp: [
        'How did you learn English at school?',
        'What’s the best way to learn new words?',
      ],
      grammar: {
        title: 'Purpose clauses: to, in order to, so that',
        points: [
          { form: 'to + base verb', use: 'Saying why you do something.', example: 'I watch American shows to improve my listening.' },
          { form: 'in order to / in order not to + base verb', use: 'The same, more formal.', example: 'I take notes in order not to forget.' },
          { form: 'so that + subject + can/could/will', use: 'Saying why, with a new subject or a modal.', example: 'I speak slowly so that people can understand me.' },
        ],
        tip: 'Don’t use for + verb for a reason: say “I came here to learn English”, not “I came here for learn English”.',
      },
      discussion: [
        'What’s the hardest part of learning English for you?',
        'Do you memorize vocabulary lists, or learn words in sentences?',
        'How do you practice speaking when there’s no native speaker around?',
        'Have you picked up any English from songs or series?',
        'Are mistakes a good or a bad thing when you’re learning?',
        'What skill would you like to brush up on this year?',
      ],
      task: {
        prompt: 'Tell a new learner how to improve their English.',
        points: [
          'Two methods that work for you (to, so that)',
          'How to learn vocabulary',
          'How to practice speaking and pronunciation',
          'A mistake to avoid',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I've been learning English for years, but I only became fluent when I changed my methods. At school, we memorized grammar rules in order to pass exams, but we never practiced speaking. Now I listen to a podcast every day to improve my pronunciation. I write new vocabulary in sentences so that I can remember how to use it. I picked up a lot of everyday English from American series, too. I'm not afraid of mistakes anymore; they're part of learning. When I find a word I don't know, I look it up and say it out loud. My next goal is to brush up on my writing skills.",
    },
    `
adj | fluent | Able to speak a language easily and well. | She's fluent in English and French.
n | vocabulary | All the words that a person knows or uses. | Reading helps you build your vocabulary.
n | pronunciation | The way a word is said. | Her pronunciation is very clear.
v | practice | To do something again and again to get better at it (American English spelling). | I practice speaking with my friends.
n | mistake | Something that is not correct. | Everyone makes mistakes when they learn.
v | memorize | To learn something so well that you can remember it exactly. | I memorized twenty new words this week.
n | native speaker | Someone who has spoken a language since they were a baby. | I practice with a native speaker online.
n | grammar | The rules about how words change and go together in a language. | English grammar isn't as hard as people think.
n | skill | The ability to do something well, usually after practice. | Listening is a skill you can improve.
n | course | A set of lessons about a subject. | I'm taking an online course in business English.
n | podcast | A program that you can listen to online, often in episodes. | I listen to a podcast on my way to work.
pv | pick up | To learn something without trying, by hearing or seeing it often. | I picked up some Spanish when I lived in Madrid.
pv | brush up on | To practice something you learned before so that you are good at it again. | I need to brush up on my French before the trip.
pv | look up | To find information in a dictionary or online. | I looked up the word on my phone.
`
  ),
  pack(
    {
      id: 'career-and-interviews',
      group: 'work',
      title: 'Career Planning, Job Search & Interviews',
      description: 'Talk about your career plans, apply for a job and answer questions in an interview.',
      level: 'B1',
      emoji: '💼',
      warmUp: [
        'What job did you want when you were a child?',
        'Have you ever had a job interview?',
      ],
      grammar: {
        title: 'Present perfect vs past simple for experience',
        points: [
          { form: 'have/has + past participle', use: 'Your experience up to now, without saying when.', example: 'I’ve worked in customer service for three years.' },
          { form: 'past simple + time', use: 'A finished job or event, with a time.', example: 'In 2022, I worked at a hotel in Sharm.' },
          { form: 'Have you ever …?', use: 'Asking about experience at any time.', example: 'Have you ever managed a team?' },
        ],
        tip: 'Don’t use the present perfect with a finished time: say “I graduated in 2021”, not “I have graduated in 2021”.',
      },
      discussion: [
        'What kind of career would you like?',
        'How do you look for jobs: online, through friends or other ways?',
        'What is your biggest strength, and what is a weakness you’re working on?',
        'What qualifications do you need for your dream job?',
        'Have you ever filled in a long application form?',
        'What questions do interviewers usually ask?',
      ],
      task: {
        prompt: 'Answer three common interview questions.',
        points: [
          'Tell me about yourself (present perfect and past simple)',
          'What are your strengths?',
          'What is one weakness?',
          'Why do you want this job?',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last month, I applied for a job as a team leader at a call center. I updated my résumé and filled in the online application. A week later, they invited me to an interview. The manager asked, 'Have you ever trained new staff?' I said, 'Yes, I've trained more than twenty agents. In 2023, I also led a small team at my last company.' When she asked about my weakness, I said I sometimes take on too much work. There were five candidates, and I was very nervous. Two days later, I got a job offer! I think my experience and my references helped me a lot.",
    },
    `
n | career | The jobs you do during your working life, often in one area. | She wants a career in marketing.
v | apply | To ask for something, such as a job, by sending a letter or filling in a form. | I applied for three jobs this week.
n | application | A formal request for something, such as a job. | I sent my application by email.
n | interview | A meeting where someone asks you questions to see if you are right for a job. | My interview is on Monday at ten.
n | candidate | A person who is trying to get a job. | There were fifty candidates for the job.
n | qualification | An official record, such as a degree, that shows you have trained or studied something. | What qualifications do you need to be a nurse?
n | strength | A good quality or ability that someone has. | My biggest strength is communication.
n | weakness | A part of your character or ability that is not good. | My weakness is that I talk too fast.
n | résumé | A document that lists your education and work experience (British English: CV). | Send your résumé to the HR department.
v | hire | To give someone a job. | The company hired ten new people this year.
n | reference | A letter or a person who says that you are good for a job. | My old manager gave me a good reference.
n | job offer | When a company offers you a job. | I got two job offers in one week!
pv | fill in | To write the information that is needed on a form. | Please fill in this form.
pv | take on | To accept work or a responsibility. | I took on extra work to learn new skills.
`
  ),
  pack(
    {
      id: 'teamwork-and-freelancing',
      group: 'work',
      title: 'Teamwork, Work Communication & Freelancing',
      description: 'Talk about working with a team, staying in touch at work, and freelancing for clients.',
      level: 'B1',
      emoji: '👥',
      warmUp: [
        'Do you prefer working alone or in a team?',
        'Would you like to be your own boss?',
      ],
      grammar: {
        title: 'First conditional and time clauses',
        points: [
          { form: 'If + present simple, will + base verb', use: 'A real possibility in the future and its result.', example: 'If the client agrees, we’ll start on Monday.' },
          { form: 'when / as soon as / until + present simple', use: 'Future time clauses: no will after them.', example: 'I’ll send the file as soon as I finish it.' },
          { form: 'unless + present simple', use: 'If … not.', example: 'We won’t finish unless everyone helps.' },
        ],
        tip: 'Don’t use will after if or when: say “When I finish, I’ll call you”, not “When I will finish”.',
      },
      discussion: [
        'What makes a good team member?',
        'How does your team communicate: meetings, emails or messages?',
        'Would you like to work remotely? Why or why not?',
        'What are the risks of freelancing?',
        'How do you deal with a colleague who isn’t reliable?',
        'How do you give feedback to someone without hurting them?',
      ],
      task: {
        prompt: 'You’re a freelancer. Leave a voice message for a new client.',
        points: [
          'Introduce yourself and your service',
          'Explain what will happen if they agree (if, when)',
          'Say when you’ll send updates',
          'Mention the contract and the payment',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I work in a team of six at a marketing company, and I also do freelance design for clients in the evening. Teamwork is easy when everyone communicates well. We have a short meeting every morning to catch up, and we update each other on WhatsApp. Our manager always gives us honest feedback, and that helps us improve. My freelance work is different: I have to be very reliable because there's no team to help me. When a client agrees to my price, I send them a contract. As soon as I finish a project, I send the invoice. If a client doesn't pay on time, I get in touch politely.",
    },
    `
n | teamwork | Working well together with other people. | Good teamwork helped us finish early.
v | cooperate | To work together with someone to achieve something. | The two departments need to cooperate.
adj | freelance | Working for different companies, not employed by one. | He's a freelance translator.
n | client | A person or a company that pays for a service. | I have three clients in Saudi Arabia.
adj | remote | Done from home or another place, not in the office. | I have a remote job with a German company.
v | communicate | To share information with others by speaking or writing. | We communicate by email and video calls.
adj | reliable | Able to be trusted to do what is expected. | She's very reliable; she's never late.
n | feedback | Comments about how well someone is doing, to help them improve. | My manager gave me useful feedback.
v | update | To give someone the latest information. | Please update me when you hear from the client.
n | invoice | A document that lists work done or goods sold and the money to pay. | I sent the invoice at the end of the month.
n | contract | A legal written agreement between people or companies. | Read the contract carefully before you sign.
p | get in touch | To contact someone by phone, email or message. | I'll get in touch with you next week.
pv | catch up | To talk to someone to learn their news. | Let's meet for coffee and catch up.
pv | follow through | To finish something that you started or promised to do. | She always follows through on her promises.
`
  ),
  pack(
    {
      id: 'personal-finance',
      group: 'life',
      title: 'Personal Finance & Cost of Living',
      description: 'Talk about income, expenses, loans and how rising prices change the way you live.',
      level: 'B1',
      emoji: '💳',
      warmUp: [
        'What is the biggest expense in your family?',
        'Have prices in your area gone up a lot this year?',
      ],
      grammar: {
        title: 'Verbs with prepositions: spend on, pay for, save for',
        points: [
          { form: 'spend + money/time + on', use: 'Saying what money goes to.', example: 'We spend too much on food.' },
          { form: 'pay for · save for · ask for', use: 'Common verb + preposition pairs.', example: 'I’m saving for a car. Who paid for dinner?' },
          { form: 'borrow from · lend to · depend on', use: 'More pairs with fixed prepositions.', example: 'I borrowed money from the bank.' },
        ],
        tip: 'Say “pay for something”, but “pay someone” and “pay a bill” (no for): “I paid the driver”, “I paid the bill”.',
      },
      discussion: [
        'How has the cost of living changed in Egypt recently?',
        'What do you spend most of your income on?',
        'Do you have any savings? What are you saving for?',
        'Would you take a loan to buy a car or a home?',
        'How do people make ends meet when prices rise?',
        'What expenses have you cut back on this year?',
      ],
      task: {
        prompt: 'Explain how rising prices have changed your monthly budget.',
        points: [
          'Your income and your main expenses (spend on, pay for)',
          'What has risen the most',
          'What you’ve cut back on',
          'What you’re saving for',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "The cost of living in Cairo has risen a lot in the last two years. My income is the same, but my expenses are much higher. I spend almost half my salary on rent and food. Last year, I bought a phone in installments, and I'm still paying for it. I've cut back on eating out, and I look for bargains at the market. Some months, it's hard to make ends meet, but we get by. I'm saving for a wedding, so I try not to touch my savings. I never use a credit card, because the interest is very high.",
    },
    `
n | cost of living | The amount of money you need to pay for food, rent and other basic things. | The cost of living in big cities is high.
n | expense | Money that you spend on something. | Rent is our biggest expense.
n | income | Money that you get regularly from your job or other places. | Her income isn't enough for a family of five.
n | savings | Money that you have kept, often in a bank. | I used my savings to pay for the course.
n | loan | Money that you borrow from a bank and pay back. | He took a loan to start a small business.
n | interest | Extra money that you pay when you borrow money. | The interest on this loan is 20 percent.
n | installment | One of a number of payments that you make over time. | I'm paying for my laptop in twelve installments.
n | credit card | A plastic card that lets you buy things now and pay later. | I paid for the flight with my credit card.
v | rise | To increase. | Food prices rose by 30 percent this year.
n | bargain | Something you buy for less than its usual price. | This jacket was a real bargain.
pv | cut back on | To spend less money on something. | We're cutting back on eating out.
i | make ends meet | To have just enough money to pay for what you need. | It's hard to make ends meet with one salary.
pv | get by | To have just enough money to live. | We don't have much, but we get by.
pv | run out of | To use all of something so that nothing is left. | I ran out of money before the end of the month.
`
  ),
  pack(
    {
      id: 'tech-troubleshooting',
      group: 'work',
      title: 'Technology Troubleshooting & Online Safety',
      description: 'Describe a problem with a phone or a computer, explain how it was fixed and keep your accounts safe.',
      level: 'B1',
      emoji: '🔧',
      warmUp: [
        'What do you do when your phone stops working?',
        'Has anyone ever tried to steal your password?',
      ],
      grammar: {
        title: 'The passive: present and past',
        points: [
          { form: 'am/is/are + past participle', use: 'When the action matters more than who does it (present).', example: 'Your data is saved in the cloud.' },
          { form: 'was/were + past participle', use: 'The same in the past.', example: 'My account was hacked last week.' },
          { form: 'by + person or thing', use: 'Saying who did it, when it’s important.', example: 'The virus was found by the antivirus app.' },
        ],
        tip: 'Use the passive when you don’t know or don’t care who did it: “My bag was stolen”, not “Someone stole my bag” every time.',
      },
      discussion: [
        'What problems do you often have with your phone or laptop?',
        'Have you ever lost all your files? What happened?',
        'Do you back up your photos?',
        'Have you or a friend ever been hacked?',
        'What do you do when you get a suspicious message?',
        'Do you check the privacy settings on your apps?',
      ],
      task: {
        prompt: 'Explain to a friend how you fixed a problem with your phone or computer.',
        points: [
          'What the problem was',
          'What you tried first',
          'How it was fixed (passive)',
          'What you do now to stay safe',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last month, my laptop crashed in the middle of an important project. Then it froze every time I turned it on. I restarted it many times, but nothing worked. A technician told me it was infected by a virus from a free program I had installed. Luckily, my files were saved because I had a backup on an external drive. The laptop was fixed in two days, and he installed a new antivirus for me. A week later, I got a scam message asking for my bank details, so I changed all my passwords. Now I back up my files every Friday and check my privacy settings.",
    },
    `
n | device | A machine or a tool, such as a phone or a laptop. | Turn off all your devices before you sleep.
v | crash | To suddenly stop working (about a computer or a program). | My computer crashed and I lost my work.
v | freeze | To stop moving or working (about a screen or a computer). | The screen froze, so I restarted the phone.
v | restart | To turn a computer or a phone off and then on again. | Try restarting your laptop.
v | install | To put a program onto a computer or a phone so that it can be used. | I installed a new app for my bank.
v | hack | To get into someone's computer or account without permission. | My Facebook account was hacked.
n | virus | A program that damages a computer or the information on it. | Don't open that file; it might have a virus.
n | scam | A dishonest plan to get money from people. | That message about a free iPhone is a scam.
adj | secure | Safe from attack or danger. | Make sure the website is secure before you pay.
n | privacy | The right to keep your personal information to yourself. | I care about my privacy online.
n | backup | A copy of information that you keep in case the original is lost. | Always keep a backup of your photos.
n | settings | The options on a device or an app that you can change. | Check your privacy settings.
pv | turn off | To stop a device or a machine working by pressing a button. | Turn off your laptop before you update it.
pv | back up | To make a copy of information on a computer. | Back up your files before the update.
`
  ),
  pack(
    {
      id: 'media-and-reviews',
      group: 'life',
      title: 'Media, Entertainment & Content Reviews',
      description: 'Talk about movies, series, books and online content, recommend them and review them.',
      level: 'B1',
      emoji: '🎬',
      warmUp: [
        'What’s the last series you watched?',
        'Do you read reviews before you watch a movie?',
      ],
      grammar: {
        title: 'Relative clauses: who, which, that, where',
        points: [
          { form: 'who / that for people', use: 'Giving information about a person.', example: 'She’s the actor who played the doctor.' },
          { form: 'which / that for things', use: 'Giving information about a thing.', example: 'It’s a series that I watched twice.' },
          { form: 'where for places', use: 'Giving information about a place.', example: 'It’s set in a village where everyone has a secret.' },
        ],
        tip: 'Don’t repeat the subject after who or which: say “The movie that I saw was great”, not “The movie that I saw it was great”.',
      },
      discussion: [
        'What kind of series do you enjoy: comedy, drama or crime?',
        'Who is your favorite actor or director, and why?',
        'Do you watch movies at home on streaming apps or at the movie theater?',
        'Do you get angry when someone tells you a spoiler?',
        'What content do you watch on YouTube or TikTok?',
        'What’s a documentary that taught you something?',
      ],
      task: {
        prompt: 'Review a series or a movie you watched recently.',
        points: [
          'What it is and where you watched it',
          'The plot, without spoilers (who, which, where)',
          'The characters and the actors',
          'Your opinion and who you would recommend it to',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "The last series I watched was a crime drama that came out last year on a streaming app. It's set in a small town where a teacher disappears. Each episode is about one character who knows a secret. The plot is clever, and the actor who plays the police officer is excellent. The director made every episode exciting, so I watched all ten in one weekend. Some people say the ending is boring, but I don't agree. I won't give you any spoilers! I'd recommend it to anyone who likes mysteries, and I even subscribed to the app to watch season two.",
    },
    `
n | series | A set of TV programs about the same characters or subject. | I'm watching a Korean series on Netflix.
n | episode | One part of a TV series. | The last episode was amazing.
n | plot | The main events of a story, a movie or a book. | The plot is a bit confusing.
n | character | A person in a book, a play or a movie. | The main character is a young doctor.
n | review | A report that gives an opinion about a movie, a book or a product. | The movie got great reviews.
n | director | The person who tells the actors what to do in a movie. | Who's the director of this movie?
n | actor | A person whose job is to perform in movies, plays or TV shows. | He's my favorite Egyptian actor.
n | documentary | A movie or a TV program that gives facts about a real subject. | We watched a documentary about the Red Sea.
n | streaming | Watching or listening to video or music over the internet. | Streaming has changed how we watch TV.
adj | exciting | Making you feel very interested and happy. | The final game was really exciting.
adj | boring | Not interesting. | The second half of the movie was boring.
n | spoiler | Information about a story that tells you what happens before you see it. | No spoilers, please! I haven't seen it yet.
v | subscribe | To pay money regularly to get a service, or to follow a channel. | I subscribed to her YouTube channel.
pv | come out | To become available to buy or to watch. | Her new book comes out next month.
`
  ),
  pack(
    {
      id: 'cultures-and-living-abroad',
      group: 'society',
      title: 'Travel, Cultural Differences & Living Abroad',
      description: 'Talk about customs in different countries, culture shock and starting a new life abroad.',
      level: 'B1',
      emoji: '🌍',
      warmUp: [
        'Which country would you like to live in?',
        'What is one Egyptian custom that surprises foreigners?',
      ],
      grammar: {
        title: 'be used to and get used to',
        points: [
          { form: 'be used to + noun/V-ing', use: 'Something that is normal for you now.', example: 'I’m used to the cold weather.' },
          { form: 'get used to + noun/V-ing', use: 'The process of something becoming normal.', example: 'It took me months to get used to driving on the left.' },
          { form: 'didn’t use to + base verb', use: '(Compare) a past habit that is not true now.', example: 'I didn’t use to like spicy food.' },
        ],
        tip: 'After be used to and get used to, use V-ing, not the base verb: “I’m used to waking up early”, not “I’m used to wake up early”.',
      },
      discussion: [
        'What would be the hardest thing to get used to in another country?',
        'Have you ever experienced culture shock?',
        'What Egyptian traditions would you miss if you lived abroad?',
        'What manners are important in Egypt but not in other places?',
        'How can an immigrant fit in in a new country?',
        'Is it better to keep your own customs or to adapt to local ones?',
      ],
      task: {
        prompt: 'Imagine you have lived abroad for six months. Send a voice note home.',
        points: [
          'Where you live and what’s different there',
          'Something you’re used to now',
          'Something you can’t get used to',
          'What you miss from home',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My cousin moved to Germany two years ago, and at first, he had real culture shock. The local people were polite but quiet, and he felt very homesick. He missed his family and the noise of Cairo. Getting a visa and a place to live took months. Little by little, he started to adapt. He's used to the cold now, and he's even used to being on time for everything! But he can't get used to the food; he says it has no flavor. He still keeps some Egyptian traditions, like inviting his neighbors for tea. Now he feels he really fits in, but he stands out at parties because he dances like an Egyptian.",
    },
    `
n | culture | The customs, beliefs and way of life of a group of people. | I love learning about Japanese culture.
n | custom | Something that people in a society usually do. | It's a custom to visit relatives on Eid.
n | tradition | A custom or belief that has existed for a long time. | Eating fish on Sham El Nessim is an old tradition.
adj | foreign | From or in a country that is not your own. | She speaks three foreign languages.
adj | local | From or in the area where you are. | We ate at a local restaurant.
n | manners | Polite ways of behaving. | It's bad manners to eat with your mouth open.
n | culture shock | A feeling of confusion when you live in or visit a very different culture. | I had culture shock in my first week in London.
adj | homesick | Sad because you are away from home. | I was homesick during my first Ramadan abroad.
n | immigrant | A person who comes to live in a new country. | Many immigrants work in hospitals in the UK.
n | visa | An official stamp in your passport that lets you enter or stay in a country. | I'm waiting for my visa.
v | adapt | To change your ideas or behavior to fit a new situation. | Children adapt quickly to a new school.
v | miss | To feel sad because someone or something is not with you. | I miss my mother's cooking.
pv | fit in | To feel happy and accepted in a group. | It took me a year to fit in at my new job.
pv | stand out | To be very easy to see or notice. | With her red hair, she really stands out.
`
  ),
  pack(
    {
      id: 'housing-rent-or-buy',
      group: 'life',
      title: 'Housing: Renting vs Buying',
      description: 'Compare renting and buying a home, talk about locations and explain your choice.',
      level: 'B1',
      emoji: '🏘️',
      revisits: 'home-and-neighborhood',
      warmUp: [
        'Would you rather rent an apartment or buy one?',
        'What makes a good location for a home?',
      ],
      grammar: {
        title: 'Comparisons: as … as, not as … as, much more',
        points: [
          { form: 'as + adjective + as', use: 'Two things that are the same.', example: 'The new apartment is as big as the old one.' },
          { form: 'not as + adjective + as', use: 'The first thing is less than the second.', example: 'Renting isn’t as safe as owning.' },
          { form: 'much / a lot / a bit + comparative', use: 'How big the difference is.', example: 'Living in the suburbs is much cheaper.' },
        ],
        tip: 'Use as … as, not “as … than”: say “It’s as expensive as Zamalek”, not “as expensive than Zamalek”.',
      },
      discussion: [
        'Is it better to rent or to buy in your city? Why?',
        'What’s more important to you: location or space?',
        'Would you live in a suburb to pay less?',
        'Have you ever moved home? What was the hardest part?',
        'Is buying property a good investment in Egypt?',
        'What should you check before you sign a lease?',
      ],
      task: {
        prompt: 'Help a friend decide: rent or buy?',
        points: [
          'Compare the costs (not as … as, much more)',
          'Compare two locations',
          'Talk about the deposit or the lease',
          'Give your advice',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My brother and his wife are deciding whether to rent or buy. Right now, they're tenants in a small apartment downtown. The location is great, but it's crowded and noisy, and it isn't as spacious as they need. A real estate agent showed them a bigger apartment in a suburb. It's much cheaper than downtown, but the commute is much longer. If they buy, they'll need a large deposit, and the monthly payments will be higher than their rent. On the other hand, they'll own the property, and it's a good investment. They're planning to buy next year, settle in and rent out their old place.",
    },
    `
n | property | A building, or land, that belongs to someone. | Property prices in New Cairo are very high.
n | owner | A person who owns something. | The owner of the building lives abroad.
n | tenant | A person who pays rent to live in a home. | The tenants complained about the water.
n | deposit | Money that you pay when you rent or buy something, as the first part or to show you are serious. | We paid a deposit of two months' rent.
n | location | The place where something is. | The location is perfect, near the metro.
adj | spacious | Having a lot of space. | The new apartment is bright and spacious.
adj | crowded | Full of people. | Downtown is very crowded in the evening.
n | suburb | An area where people live outside the center of a city. | We live in a quiet suburb.
n | real estate agent | A person whose job is to help people buy, sell or rent homes (American English). | The real estate agent showed us five apartments.
n | lease | A legal agreement to rent a home for a period of time. | We signed a two-year lease.
v | own | To have something that belongs to you. | They own a house in the village.
n | investment | Something you buy, such as property, because you hope it will make money. | Gold is a popular investment.
pv | settle in | To start to feel comfortable in a new home or a new place. | It took us a month to settle in.
pv | rent out | To let someone use your property in exchange for money. | They rent out their old apartment to students.
`
  ),
  pack(
    {
      id: 'food-culture',
      group: 'life',
      title: 'Food Culture & Healthy Eating',
      description: 'Explain how a dish is made, talk about food traditions and eating well.',
      level: 'B1',
      emoji: '🥘',
      revisits: 'food-and-ordering',
      warmUp: [
        'What dish is your family famous for?',
        'Is your diet healthier now than five years ago?',
      ],
      grammar: {
        title: 'The zero conditional for facts and habits',
        points: [
          { form: 'If / When + present simple, present simple', use: 'Things that are always true, or always happen.', example: 'If you fry onions slowly, they turn sweet.' },
          { form: 'present simple + if/when + present simple', use: 'The same, with the condition second.', example: 'I feel tired when I eat too much bread.' },
          { form: 'If + present simple, imperative', use: 'Instructions in recipes.', example: 'If the sauce is too thick, add some water.' },
        ],
        tip: 'In the zero conditional, both parts are in the present: “If you heat oil too much, it burns”, not “it will burn”.',
      },
      discussion: [
        'What is a traditional dish from your region? How is it made?',
        'Is Egyptian food healthy? Why or why not?',
        'Do you prefer homemade food or fast food?',
        'Would you like to be vegetarian? Why or why not?',
        'Do you know the ingredients of your favorite dish?',
        'What food do you want to cut down on?',
      ],
      task: {
        prompt: 'Explain how to make a dish from your family.',
        points: [
          'The ingredients',
          'Two or three steps (boil, fry, bake…)',
          'A tip in the zero conditional (If you…)',
          'Is it healthy? Why or why not?',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My mother's lentil soup is the best homemade dish I know. The ingredients are simple: lentils, onions, carrots, cumin and a little oil. First, you boil the lentils with the vegetables for about forty minutes. Then you fry some onions until they're brown. If you add a little lemon at the end, the flavor is much stronger. The soup is cheap, and it's full of nutrition. In winter, we eat it almost every week. I'm trying to cut down on fast food, so I make a big portion and heat it up for lunch.",
    },
    `
n | recipe | A set of instructions that tells you how to cook something. | Can you give me the recipe for this cake?
n | ingredient | One of the foods that you use to make a dish. | The main ingredient is rice.
n | dish | Food that is prepared in a particular way as part of a meal. | Koshary is a famous Egyptian dish.
v | boil | To cook something in very hot water. | Boil the eggs for ten minutes.
v | fry | To cook something in hot oil. | She fried the fish in a little oil.
v | bake | To cook something, such as bread or a cake, in an oven. | We bake cookies for Eid.
n | flavor | How food or drink tastes. | This sauce has a lot of flavor.
adj | vegetarian | Not eating or not containing meat. | My sister is vegetarian, so we cooked pasta.
adj | homemade | Made at home, not in a store or a factory. | Nothing is better than homemade bread.
n | fast food | Hot food, such as burgers, that is made quickly in a restaurant. | I eat too much fast food when I'm busy.
n | nutrition | The food you eat and how it affects your health. | Good nutrition is important for children.
n | portion | The amount of food that one person eats. | The portions in this restaurant are huge.
pv | cut down on | To eat, drink or use less of something. | I'm trying to cut down on sugar.
pv | heat up | To make food hot again. | I heated up the rice in the microwave.
`
  ),
  pack(
    {
      id: 'travel-stories',
      group: 'life',
      title: 'Travel Stories & Problems on Trips',
      description: 'Tell the story of a trip and the things that went wrong, and how you dealt with them.',
      level: 'B1',
      emoji: '✈️',
      revisits: 'travel-and-accommodation',
      warmUp: [
        'What’s the worst thing that has happened to you on a trip?',
        'Do you plan everything before you travel?',
      ],
      grammar: {
        title: 'The past perfect',
        points: [
          { form: 'had + past participle', use: 'An action that happened before another past action.', example: 'When we got to the airport, the plane had already left.' },
          { form: 'past simple … because + past perfect', use: 'Explaining the reason for a past situation.', example: 'I was tired because I hadn’t slept on the bus.' },
          { form: 'by the time + past simple, past perfect', use: 'Something was finished before a moment in the past.', example: 'By the time we arrived, the museum had closed.' },
        ],
        tip: 'You don’t need the past perfect when the order is clear with before or after: “I ate before I left” is fine.',
      },
      discussion: [
        'Have you ever missed a flight or a train? What happened?',
        'What’s the most breathtaking place you have visited?',
        'Do you buy souvenirs? What’s your favorite one?',
        'Have you ever gotten lost in a new city?',
        'What would you do if your luggage didn’t arrive?',
        'What’s your dream destination?',
      ],
      task: {
        prompt: 'Tell the story of a trip where something went wrong.',
        points: [
          'Where you were going and when you set off',
          'What went wrong (past perfect)',
          'How you dealt with it',
          'How the trip ended up',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last summer, my friends and I set off for Dahab with our backpacks. We were excited, but everything went wrong from the start. Our bus had a three-hour delay, so we missed our connection in Sharm. By the time we arrived, our hotel had given our room to someone else! We were stuck in the street at midnight, and we felt completely lost. Then a local man helped us find a small camp by the sea. It turned out to be the best part of the journey: the view at sunrise was breathtaking. We ended up staying there for the whole week. I still have the souvenir he gave us, a small painted stone.",
    },
    `
n | delay | A period of time when something is late. | There's a two-hour delay on all flights.
n | journey | Traveling from one place to another, often a long way. | The journey from Cairo to Aswan takes twelve hours by train.
n | destination | The place where someone is going. | Sharm El Sheikh is a popular destination.
n | connection | A bus, a train or a plane that you take after another one to continue a journey. | I missed my connection in Istanbul.
adj | stuck | Not able to move or to get away from a place. | We were stuck in traffic for two hours.
adj | lost | Not knowing where you are. | We got lost in the old city.
n | adventure | An exciting and unusual experience. | Climbing Mount Sinai was a real adventure.
n | backpack | A bag that you carry on your back. | I only took a backpack for the weekend.
n | souvenir | Something that you buy to remember a place you visited. | I bought a small pyramid as a souvenir.
adj | breathtaking | Very beautiful or surprising. | The view from the top was breathtaking.
p | go wrong | To stop happening or working in the way you planned. | Everything went wrong on our first day.
pv | set off | To start a journey. | We set off at 5 a.m. to avoid the heat.
pv | end up | To finally be in a place or a situation that you didn't plan. | We ended up sleeping in the car.
pv | run into | To meet someone by chance. | I ran into my old teacher at the airport.
`
  ),
  pack(
    {
      id: 'healthy-habits',
      group: 'life',
      title: 'Health Choices & Healthy Habits',
      description: 'Talk about the habits that keep you healthy, the ones you want to change, and how to change them.',
      level: 'B1',
      emoji: '🥗',
      revisits: 'health-and-lifestyle',
      warmUp: [
        'What is one healthy habit you have?',
        'What is one bad habit you want to quit?',
      ],
      grammar: {
        title: 'Verb + -ing or verb + to-infinitive',
        points: [
          { form: 'enjoy · avoid · keep · quit · finish + V-ing', use: 'Verbs followed by -ing.', example: 'I quit drinking soda last year. I avoid eating late.' },
          { form: 'want · decide · plan · try · need + to + base verb', use: 'Verbs followed by to.', example: 'I decided to walk to work.' },
          { form: 'start · begin · like · love + V-ing or to', use: 'Verbs that take both, with little difference.', example: 'I started running / to run in January.' },
        ],
        tip: 'Say “I enjoy swimming”, not “I enjoy to swim”, and “I decided to stop”, not “I decided stopping”.',
      },
      discussion: [
        'What does a healthy lifestyle mean to you?',
        'Is it easy to avoid sugar in Egypt? Why or why not?',
        'Have you ever quit a bad habit? How did you do it?',
        'How do you stay in shape when you’re busy?',
        'When did you last have a check-up?',
        'What sport or activity would you like to take up?',
      ],
      task: {
        prompt: 'Tell a friend about one habit you changed, or want to change.',
        points: [
          'The old habit',
          'Why you decided to change it (decide to, want to)',
          'What you started doing (start, keep + V-ing)',
          'How you feel now',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "A year ago, my lifestyle wasn't healthy at all. I drank three sodas a day, and I was addicted to sugar. After a check-up, my doctor told me to change my habits. I decided to quit soda, and I started drinking water and tea without sugar. I also avoid eating fast food more than once a week. In March, I took up running, and now I really enjoy it. My new routine is simple: a balanced breakfast, a walk at lunch and a run three times a week. My fitness is much better, and I've stayed in shape for six months.",
    },
    `
n | habit | Something that you do often, sometimes without thinking. | Biting your nails is a bad habit.
n | lifestyle | The way that you live, including what you eat and do. | Doctors say a healthy lifestyle protects your heart.
n | fitness | Being physically strong and healthy. | Swimming is great for your fitness.
adj | balanced | Having the right amounts of different things. | A balanced diet includes fruit, vegetables and protein.
n | calorie | A unit that measures how much energy food gives you. | This drink has 300 calories.
n | vitamin | A natural substance in food that your body needs to stay healthy. | Oranges are full of vitamin C.
v | avoid | To stay away from something, or to try not to do something. | I avoid eating after ten at night.
n | routine | The things you usually do, in the same order. | Exercise is part of my daily routine.
v | quit | To stop doing something. | My father quit smoking ten years ago.
adj | addicted | Unable to stop doing or using something. | I think I'm addicted to my phone.
n | check-up | A general medical examination to see if you are healthy. | I go for a check-up once a year.
pv | take up | To start doing a new activity. | I took up yoga during the summer.
pv | get into | To start being interested in an activity. | I got into cycling last year.
p | stay in shape | To keep your body healthy and strong. | I walk every day to stay in shape.
`
  ),
  pack(
    {
      id: 'sports-and-fitness',
      group: 'life',
      title: 'Sports, Fitness & Big Events',
      description: 'Talk about games, teams, competitions and the big sports events you follow.',
      level: 'B1',
      emoji: '🏆',
      revisits: 'hobbies-and-sports',
      warmUp: [
        'Which team do you support?',
        'What big sports event do you watch every year?',
      ],
      grammar: {
        title: 'The present perfect with just, already and yet',
        points: [
          { form: 'have just + past participle', use: 'Something that happened a very short time ago.', example: 'Egypt has just scored!' },
          { form: 'have already + past participle', use: 'Something that happened, maybe sooner than expected.', example: 'We’ve already won two games this season.' },
          { form: 'haven’t + past participle + yet · Have you … yet?', use: 'Something expected that hasn’t happened.', example: 'Have you bought the tickets yet?' },
        ],
        tip: 'Put just and already between have and the past participle, and yet at the end: “I haven’t watched it yet”.',
      },
      discussion: [
        'Who is the best player in the league right now?',
        'Have you ever been to a match at a stadium?',
        'What makes a good coach?',
        'Do you think the referee is always fair?',
        'Which tournament do you look forward to most?',
        'Do you warm up before you exercise?',
      ],
      task: {
        prompt: 'Describe the last big match you watched.',
        points: [
          'Which teams played and where you watched it',
          'What happened (score, win, lose, tie)',
          'The best moment, and the referee',
          'What has happened in the tournament since then (just, already, yet)',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I've just watched the final of the African championship with my friends at a café. The stadium was full of fans, and we could hear them cheering on TV. Our team had already won the league this year, so we were very excited. The first half ended in a tie, and the referee gave two yellow cards. In the eighty-fifth minute, our best player scored, and we won 1–0! The coach said the team warmed up badly but played with heart. We haven't celebrated yet, because the players haven't come home yet. Next month, we're playing in a big tournament in Saudi Arabia.",
    },
    `
n | match | A game in which two people or teams play against each other. | Did you watch the match last night?
n | championship | A competition to find the best player or team. | Al Ahly won the African championship.
v | score | To get a goal or a point in a game. | Salah scored two goals.
v | win | To be the best or the first in a game or a competition. | We won the game 3–1.
v | lose | To not win a game or a competition. | They lost the final on penalties.
n | tie | A result in which both teams have the same score (American English). | The game ended in a 1–1 tie.
n | coach | A person who trains a team or a player. | The new coach is from Portugal.
n | fan | A person who likes a team or a famous person very much. | Millions of fans watched the final.
n | stadium | A large place with seats around it where people watch sports. | The stadium holds 70,000 people.
n | league | A group of teams that play against each other. | They're top of the league.
n | tournament | A competition with many games, where the winners play the winners. | Egypt is playing in a tennis tournament.
n | referee | The person who makes sure that players follow the rules. | The referee gave a penalty.
pv | warm up | To do gentle exercise before a sport. | Always warm up before you run.
v | cheer | To shout loudly to support a team. | The fans cheered when the team came out.
`
  ),
  pack(
    {
      id: 'time-and-habits',
      group: 'work',
      title: 'Habits & Time Management',
      description: 'Talk about how you use your time, what distracts you and how to get more done.',
      level: 'B1',
      emoji: '⏳',
      revisits: 'daily-routines',
      warmUp: [
        'Are you usually early, on time or late?',
        'What wastes most of your time?',
      ],
      grammar: {
        title: 'too, enough, so and such',
        points: [
          { form: 'too + adjective/adverb', use: 'More than is good.', example: 'I’m too tired to study tonight.' },
          { form: '(not) + adjective + enough · enough + noun', use: 'As much as you need.', example: 'I don’t have enough time.' },
          { form: 'so + adjective · such (a/an) + adjective + noun', use: 'Making something stronger.', example: 'I was so busy. It was such a productive day.' },
        ],
        tip: 'Put enough after an adjective but before a noun: “fast enough”, “enough time”.',
      },
      discussion: [
        'Are you a productive person in the morning or at night?',
        'What distracts you most when you study or work?',
        'Do you use a to-do list? Does it help?',
        'Do you procrastinate? What do you put off most?',
        'What are your top three priorities this month?',
        'What do you do when you’re running late?',
      ],
      task: {
        prompt: 'Explain how you plan a busy day.',
        points: [
          'Your priorities',
          'How you deal with distractions',
          'A tool that helps you (to-do list, reminder…)',
          'Something you always put off (too, enough, so, such)',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I used to be such a disorganized person. I procrastinated all the time, and I never had enough time for important things. My phone was my biggest distraction; I checked it every five minutes. Last year, I started making a to-do list every morning with my three priorities. I put my phone in another room so I can focus for an hour. I also set reminders for bills and meetings. Now I'm much more productive and efficient, and I'm usually on time. There's one thing I still keep putting off: cleaning my closet! I'll get around to it one day.",
    },
    `
adj | productive | Doing or achieving a lot. | I'm most productive early in the morning.
v | procrastinate | To keep delaying something that you should do. | Stop procrastinating and start your essay!
n | priority | Something that is more important than other things. | My family is my first priority.
n | distraction | Something that takes your attention away from what you are doing. | Social media is a big distraction.
adj | efficient | Working well, without wasting time or energy. | She has an efficient way of answering emails.
adj | organized | Planning things carefully and keeping things in order. | He's very organized; his desk is always neat.
n | to-do list | A list of things that you need to do. | Writing a to-do list helps me focus.
p | waste of time | Something that is not worth the time you spend on it. | That meeting was a waste of time.
v | focus | To give all your attention to something. | I can't focus with the TV on.
n | reminder | Something that helps you remember to do something. | I set a reminder on my phone.
p | on time | At the right time; not late. | The train left on time.
n | time management | The skill of using your time well. | Good time management reduces stress.
pv | get around to | To finally do something you have wanted to do for a long time. | I finally got around to fixing the door.
p | run late | To be later than planned. | Sorry, I'm running late; I'll be there in ten minutes.
`
  ),
  pack(
    {
      id: 'family-and-generations',
      group: 'society',
      title: 'Family Life & Generations',
      description: 'Talk about how families have changed, how children are raised and the gap between generations.',
      level: 'B1',
      emoji: '👪',
      revisits: 'family-and-friends',
      warmUp: [
        'How is your life different from your grandparents’ lives at your age?',
        'Who raised you most: your parents or your grandparents?',
      ],
      grammar: {
        title: 'used to and would for past habits',
        points: [
          { form: 'used to + base verb', use: 'Past habits and past states that aren’t true now.', example: 'We used to live with my grandparents.' },
          { form: 'would + base verb', use: 'Repeated actions in the past (not states).', example: 'Every Friday, my grandfather would take us to the Nile.' },
          { form: 'didn’t use to · Did you use to …?', use: 'Negatives and questions.', example: 'Did you use to have a TV in your room?' },
        ],
        tip: 'Don’t use would for states: say “We used to have a big house”, not “We would have a big house”.',
      },
      discussion: [
        'How strict were your parents when you were a teenager?',
        'What values did your family teach you?',
        'Is the extended family as important in Egypt as it used to be?',
        'Who do you take after in your family?',
        'Who looks after the elderly in your family?',
        'Is there a generation gap between you and your parents? About what?',
      ],
      task: {
        prompt: 'Compare family life in your grandparents’ time and now.',
        points: [
          'How families used to live',
          'What children would do every day',
          'What has changed',
          'What you want to keep from the old days',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My grandparents raised nine children in a small house in Menoufia. Back then, the whole extended family used to live in the same household. My grandmother would cook for twenty people every Friday, and the children would play in the street until dark. Their parents were very strict, but the family values were strong. Today, my generation is more independent; most of my cousins live alone or abroad. There's a real generation gap: my grandmother doesn't understand why I work at night. Still, I take after her in many ways, and now I help look after her. I want my children to know where they come from.",
    },
    `
n | generation | All the people born at about the same time. | My generation grew up with the internet.
v | raise | To take care of a child until it is an adult. | She raised four children on her own.
pv | bring up | To take care of a child and teach it how to behave. | I was brought up by my aunt.
pv | take after | To look or behave like an older family member. | She takes after her father; they're both very calm.
adj | elderly | Old (a polite word). | Many elderly people live alone in big cities.
n | teenager | A young person between 13 and 19 years old. | Teenagers spend a lot of time online.
n | household | All the people who live together in one home. | There are seven people in our household.
n | extended family | A family that includes grandparents, aunts, uncles and cousins. | My extended family meets every Eid.
adj | strict | Making people follow rules and behave well. | My father was strict about homework.
n | values | Your beliefs about what is right and important. | My parents taught me good values.
n | grandchild | The child of your son or daughter. | My grandmother has fifteen grandchildren.
n | generation gap | The differences in ideas and behavior between young and older people. | The generation gap is clear when we talk about marriage.
adj | independent | Not needing other people's help or money. | My sister became independent at twenty.
n | relative | A member of your family. | We have relatives in Upper Egypt.
`
  ),
  pack(
    {
      id: 'celebrations-and-traditions',
      group: 'society',
      title: 'Celebrations, Traditions & Ramadan',
      description: 'Describe celebrations and traditions such as Ramadan, Eid and weddings, and what people usually do.',
      level: 'B1',
      emoji: '🌙',
      revisits: 'plans-and-invitations',
      warmUp: [
        'What is your favorite time of the year, and why?',
        'What do you usually do on the first day of Eid?',
      ],
      grammar: {
        title: 'Talking about customs: It’s customary to, people tend to, be supposed to',
        points: [
          { form: 'It’s customary to + base verb', use: 'Saying what people usually do in a culture.', example: 'It’s customary to visit relatives on Eid.' },
          { form: 'People tend to + base verb', use: 'Saying what usually happens, but not always.', example: 'People tend to stay up late in Ramadan.' },
          { form: 'be supposed to + base verb', use: 'What the rules or traditions expect.', example: 'You’re supposed to dress up for a wedding.' },
        ],
        tip: 'Use the present simple for traditions, not the present continuous: “We decorate the street”, not “We are decorating the street every year”.',
      },
      discussion: [
        'What do people in your family do during Ramadan?',
        'How do you break the fast: with dates, juice or soup?',
        'Which festival in Egypt would you show a foreign friend?',
        'Do you think weddings in Egypt are too expensive?',
        'Is it customary to give money or gifts on Eid?',
        'How do people in your area help charity in Ramadan?',
      ],
      task: {
        prompt: 'Explain Ramadan or Eid to a foreign colleague.',
        points: [
          'When it is and what it means',
          'What people tend to do every day',
          'What people are supposed to do or not do',
          'Your favorite tradition',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Ramadan is my favorite time of the year. During the month, Muslims fast from sunrise to sunset, and people tend to be calmer and kinder. Families gather every evening to break the fast together, usually with dates and juice. In my street, the children decorate the buildings with lights and lanterns. It's customary to give food to charity, and many people make feasts for the poor. At the end of the month, we celebrate Eid: we dress up in new clothes, go to the prayer and visit our relatives. Children are supposed to greet the older people first. For me, Ramadan is a religious and a family occasion at the same time.",
    },
    `
n | festival | A special day or period when people celebrate something. | Sham El Nessim is a spring festival.
v | fast | To eat and drink nothing for a period of time, especially for religious reasons. | Muslims fast during the month of Ramadan.
n | feast | A large special meal for many people. | We had a big feast on the first day of Eid.
n | ceremony | A formal event, such as a wedding or a graduation. | The wedding ceremony was in a mosque.
v | decorate | To make something look more beautiful by adding things to it. | We decorated the house with lights.
v | gather | To come together in a group. | The whole family gathers at my grandmother's.
adj | religious | Connected with religion. | Eid is a religious celebration for Muslims.
n | charity | Money or help given to people who need it. | Many people give to charity in Ramadan.
v | greet | To say hello to someone when you meet them. | He greeted the guests at the door.
n | occasion | A special event or celebration. | A wedding is a happy occasion.
n | lantern | A light inside a container with windows, carried or hung up. | Children carry colorful lanterns in Ramadan.
pv | dress up | To put on special or formal clothes. | Everyone dresses up for Eid.
p | break the fast | To eat after a time of fasting. | We break the fast at sunset with dates.
`
  ),
];
