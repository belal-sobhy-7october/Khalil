/** Society & ideas topics, built with the course method (see ./types.ts). */
import { pack, type TopicPack } from './types';

export const SOCIETY_PACKS: TopicPack[] = [
  pack(
    {
      id: 'climate-and-environment',
      group: 'society',
      title: 'Climate Change & the Environment',
      description: 'Global warming, waste and what governments and people can do about it.',
      level: 'B2',
      emoji: '🌱',
      warmUp: [
        'Have you noticed the weather changing in your country?',
        'What do you do, if anything, to protect the environment?',
      ],
      grammar: {
        title: 'Cause and effect',
        points: [
          { form: 'cause / lead to / result in + noun', use: 'Say what something produces.', example: 'Burning fuel leads to higher temperatures.' },
          { form: 'because of / due to + noun', use: 'Give the reason (before a noun, not a clause).', example: 'Many crops failed due to the drought.' },
          { form: 'As a result, … / Therefore, …', use: 'Start a new sentence with the effect.', example: 'Sea levels are rising. As a result, coastal cities are in danger.' },
        ],
        tip: 'Use “because” before a clause and “because of / due to” before a noun: “because it rained”, but “because of the rain”.',
      },
      discussion: [
        'Who should do more to fight climate change: governments, companies or individuals?',
        'What could you do to reduce your carbon footprint?',
        'Should single-use plastic be banned completely?',
        'Is renewable energy the answer for Egypt? Why or why not?',
        'How could global warming affect the Nile and the Delta?',
        'Is it fair to ask poorer countries to stop using fossil fuels?',
      ],
      task: {
        prompt: 'What can we do about climate change?',
        points: [
          'Two causes of climate change (cause / lead to)',
          'Two effects on your country',
          'What governments should do',
          'What you personally will cut down on',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Climate change is not a problem for the future; it's happening now. Burning fossil fuels leads to more emissions, and as a result, the earth is getting hotter. In Egypt, summers are longer, and many farmers suffer because of drought. Rising sea levels could flood parts of the Delta, and these problems are only the tip of the iceberg. Governments need to invest in renewable energy, but we can all help too. I've started to recycle, I've cut down on single-use plastic, and I try to choose eco-friendly products. Small, sustainable changes can reduce our carbon footprint.",
    },
    `
n | climate change | Long-term changes in the earth's weather, especially the rise in temperature caused by human activity. | Climate change is making summers in Egypt hotter every year.
n | global warming | The slow rise in the earth's temperature caused by gases such as carbon dioxide. | Global warming is melting the ice at the North and South Poles.
n | carbon footprint | The amount of carbon dioxide that your activities produce. | Flying less is one way to reduce your carbon footprint.
n | renewable energy | Energy from sources that don't run out, such as the sun and the wind. | Egypt is building huge solar farms to produce renewable energy.
n | fossil fuels | Fuels such as oil, coal and gas, which formed under the ground over millions of years. | Most of the world's electricity still comes from fossil fuels.
n | emissions | Gases sent into the air, especially by cars and factories. | The new law aims to cut car emissions by 30%.
n | drought | A long period with little or no rain. | The drought destroyed the farmers' crops.
adj | eco-friendly | Not harmful to the environment. | We switched to eco-friendly bags for our shopping.
adj | sustainable | Able to continue for a long time without damaging the environment. | We need sustainable ways to grow food.
n | single-use plastic | Plastic things, such as bags and straws, that are thrown away after one use. | The café stopped using single-use plastic last year.
v | recycle | To treat used things so that they can be used again. | We recycle all our bottles and cans.
pv | cut down on | To do or use less of something. | I'm trying to cut down on plastic bottles.
i | the tip of the iceberg | A small sign of a much bigger problem. | The floods we've seen are just the tip of the iceberg.
`
  ),
  pack(
    {
      id: 'news-and-media',
      group: 'society',
      title: 'News & the Media',
      description: 'Where you get your news, fake news and how to tell what is true.',
      level: 'B2',
      emoji: '📰',
      warmUp: [
        'Where do you usually get your news: TV, websites or social media?',
        'Do you trust the news you read online? Why or why not?',
      ],
      grammar: {
        title: 'Reporting verbs',
        points: [
          { form: 'claim + to + verb / claim that …', use: 'Report something someone says is true (it may not be).', example: 'The website claimed to have secret documents.' },
          { form: 'deny / admit + V-ing (or that …)', use: 'Report that someone says something is or isn’t true.', example: 'The minister denied knowing about the deal.' },
          { form: 'warn / advise / urge + someone + to + verb', use: 'Report advice or warnings.', example: 'Doctors warned people not to share the fake cure.' },
          { form: 'It is reported / believed that …', use: 'Impersonal reports, common in the news.', example: 'It is reported that the storm will hit the coast tonight.' },
        ],
        tip: 'After “deny” and “admit”, use V-ing (or “that …”), not “to” + verb: “He denied lying”, not “He denied to lie”.',
      },
      discussion: [
        'Which news sources do you think are the most credible?',
        'Why do people share fake news, even when it might be untrue?',
        'Have you ever believed a story that turned out to be made up?',
        'Is censorship ever necessary? When?',
        'Why do sensational headlines get more clicks than serious ones?',
        'How do you fact-check a story before you share it?',
      ],
      task: {
        prompt: 'Explain how you decide whether a news story is true.',
        points: [
          'Where you get your news',
          'An example of fake news or clickbait you have seen',
          'Two reporting verbs (claim, deny, warn …)',
          'Your advice to relatives who share everything',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last week, my uncle sent the family a story with a sensational headline: a famous drink causes cancer. The article claimed that doctors had hidden the truth for years. I decided to fact-check it. I couldn't find a single credible source, and no journalist from a real newspaper had written about it. The company denied the story, and later the website admitted making it up to get clicks. It was pure clickbait. Now I always tell my family to take anything they read online with a pinch of salt.",
    },
    `
n | headline | The title of a news story, printed in large letters. | The headline said “Prices to double”, but the story said something different.
n | journalist | A person who collects and writes news for newspapers, TV or websites. | The journalist spent months investigating the story.
n | source | A person, book or document that gives information. | Always check the source before you share a story.
adj | credible | Able to be believed or trusted. | Is this website a credible source of news?
n | fake news | False stories that look like real news, often spread online. | Fake news spreads faster than the truth.
n | clickbait | Online content with a shocking title that is designed to make you click on it. | “You won't believe what happened next” is classic clickbait.
n | censorship | Stopping people from seeing or publishing certain information. | Many journalists are worried about censorship.
n | coverage | The reporting of a particular event in the news. | The TV coverage of the elections was excellent.
v | fact-check | To check that the facts in a story are correct. | Before you share that video, fact-check it.
adj | sensational | Presenting news in a shocking way to get attention. | Some newspapers print sensational stories to sell more copies.
n | press | Newspapers and magazines, and the journalists who work for them. | The minister refused to talk to the press.
pv | make up | To invent a story, often to trick people. | The whole story was made up to get more clicks.
i | take something with a pinch of salt | To not completely believe something. | I take everything I read on social media with a pinch of salt.
`
  ),
  pack(
    {
      id: 'fame-and-celebrity',
      group: 'society',
      title: 'Fame & Celebrity',
      description: 'Celebrities, fans and the price of fame — and what would have happened if …',
      level: 'B2',
      emoji: '🌟',
      warmUp: [
        'Would you like to be famous? Why or why not?',
        'Which celebrity would you most like to meet?',
      ],
      grammar: {
        title: 'Third conditional: imagining a different past',
        points: [
          { form: 'If + had + V3, would have + V3', use: 'An imaginary past situation and its result.', example: 'If she hadn’t posted that video, she wouldn’t have become famous.' },
          { form: 'could have / might have + V3', use: 'A possible result in the imaginary past.', example: 'If he had trained harder, he might have played for Real Madrid.' },
          { form: 'If + had + V3, would + base verb (mixed)', use: 'A past situation with a result now.', example: 'If I had studied acting, I would be on TV now.' },
        ],
        tip: 'No “would” in the “if” part: “If I had known”, not “If I would have known”.',
      },
      discussion: [
        'What are the advantages and disadvantages of fame?',
        'Do celebrities have a right to a private life?',
        'Should famous people be role models for their young fans?',
        'Why do people idolize celebrities?',
        'Is any publicity good publicity?',
        'If you had become famous at sixteen, how would your life have been different?',
      ],
      task: {
        prompt: 'Imagine you had become famous five years ago.',
        points: [
          'What you would have become famous for',
          'How your life would have changed',
          'Something you would be doing now (mixed conditional)',
          'Whether you would have enjoyed being in the public eye',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Some people dream of fame, but I'm not sure I would enjoy it. A few years ago, a girl from my university posted a funny video and became an overnight success. Within a month, she was a well-known face, and fans stopped her in the street. But the paparazzi followed her, and a small scandal about her family was everywhere. She lost her private life. She told me, “If I had known how hard it was, I wouldn't have posted that video.” Being in the public eye looks fun on the red carpet, but it has a price.",
    },
    `
n | celebrity | A famous person, especially in entertainment or sport. | Celebrities can't go shopping without being recognized.
n | fame | The state of being known by a lot of people. | Fame came suddenly after her first song.
n | fan | A person who admires and supports a famous person or a team. | Thousands of fans waited at the airport.
n | paparazzi | Photographers who follow famous people to take pictures of them. | The paparazzi followed the actor everywhere.
n | publicity | Attention from the media and the public. | The scandal gave the film a lot of free publicity.
n | scandal | Something shocking that makes people angry and is talked about publicly. | The singer's career ended after a big scandal.
adj | well-known | Known by a lot of people. | He's a well-known TV presenter in the Arab world.
n | red carpet | The carpet that celebrities walk on at an important event. | Everyone was talking about her dress on the red carpet.
n | private life | The part of your life connected with your family and relationships, not your work. | Famous people deserve to keep their private life private.
v | idolize | To admire someone so much that you think they are perfect. | Many teenagers idolize footballers.
n | overnight success | Someone or something that becomes famous or successful very suddenly. | She looked like an overnight success, but she had worked for ten years.
pv | show off | To try to make people admire you, often in an annoying way. | Some celebrities just show off their cars and money online.
i | in the public eye | Well known and often seen in the media. | Being in the public eye means people judge everything you do.
`
  ),
  pack(
    {
      id: 'mental-health',
      group: 'society',
      title: 'Mental Health & Stress',
      description: 'Stress, anxiety and asking for help — and talking about what you should have done.',
      level: 'B2',
      emoji: '🧠',
      warmUp: [
        'What stresses you out the most these days?',
        'What do you do when you have too much to deal with?',
      ],
      grammar: {
        title: 'Past regrets and criticism: should have, could have',
        points: [
          { form: 'should have + V3', use: 'The right thing to do in the past, which you didn’t do.', example: 'I should have asked for help earlier.' },
          { form: 'shouldn’t have + V3', use: 'A past action that was a mistake.', example: 'I shouldn’t have stayed up all night before the exam.' },
          { form: 'could have + V3', use: 'A possibility in the past that didn’t happen.', example: 'You could have told me you were struggling.' },
        ],
        tip: 'Write “should have” (should’ve), never “should of”; it only sounds like “of”.',
      },
      discussion: [
        'Why is there still a stigma around mental health in many places?',
        'How do you cope with stress during exams or busy periods at work?',
        'Is it easy for men in your culture to open up about their feelings?',
        'Should companies help employees with their mental health? How?',
        'What does self-care mean to you?',
        'Think of a stressful time in your life. What should you have done differently?',
      ],
      task: {
        prompt: 'Give advice to a friend who is stressed and exhausted.',
        points: [
          'The signs of too much stress',
          'Something you should have done in a similar situation',
          'Two ways to cope',
          'Why it is important to open up and ask for help',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last year, I was working full-time and studying at night. I was exhausted, I couldn't sleep, and I had terrible anxiety before every exam. I didn't tell anyone, because I was worried about the stigma. One day, I was at the end of my tether, and I finally opened up to my brother. He listened and helped me see that I couldn't cope alone. I started therapy, and now I practice mindfulness every morning. Looking back, I should have asked for help much earlier. Self-care and a good support network are part of good mental health.",
    },
    `
n | mental health | The condition of your mind and emotions. | Young people talk about mental health more openly than their parents did.
n | stress | Worry and pressure caused by problems or too much work. | Exams cause a lot of stress for students.
n | anxiety | A feeling of worry and fear, often about what might happen. | She suffers from anxiety before job interviews.
n | depression | A medical condition in which you feel very sad and without hope for a long time. | Depression is an illness, not a weakness.
n | therapy | Treatment that helps people deal with mental or emotional problems, often by talking. | Therapy helped me understand why I was always angry.
n | stigma | Strong disapproval of something, which makes people feel ashamed. | There's still a stigma around seeing a psychiatrist.
v | cope | To deal successfully with a difficult situation. | I couldn't cope with my job and my studies at the same time.
adj | exhausted | Extremely tired. | After a month of night shifts, I was completely exhausted.
n | self-care | The things you do to look after your own health and happiness. | Self-care isn't selfish; it keeps you healthy.
n | support network | The people you can rely on for help. | Friends and family are an important support network.
n | mindfulness | Paying full attention to the present moment, often as a way to reduce stress. | Ten minutes of mindfulness every morning helps me stay calm.
pv | open up | To talk honestly about your feelings. | It took him months to open up to his family.
i | at the end of your tether | So tired or worried that you can't deal with a situation any more. | After three sleepless nights with the baby, I was at the end of my tether.
`
  ),
  pack(
    {
      id: 'science-and-space',
      group: 'society',
      title: 'Science & Space',
      description: 'Discoveries, inventions, space travel and whether science always makes life better.',
      level: 'B2',
      emoji: '🔭',
      warmUp: [
        'Would you go to Mars if you had the chance?',
        'Which invention could you not live without?',
      ],
      grammar: {
        title: 'Articles: a / an, the and no article',
        points: [
          { form: 'a / an + singular noun', use: 'One thing that is new or not specific.', example: 'Scientists have found a new planet.' },
          { form: 'the + noun', use: 'Something already mentioned, or the only one.', example: 'The planet is twice the size of the Earth.' },
          { form: 'no article + plural or uncountable noun', use: 'Things in general.', example: 'Science helps us understand nature.' },
          { form: 'the + unique things and superlatives', use: 'The sun, the moon, the internet, the best …', example: 'The first person on the moon was Neil Armstrong.' },
        ],
        tip: 'Arabic uses “al-” for general ideas, but English doesn’t: “Life is short”, not “The life is short”.',
      },
      discussion: [
        'What is the most important scientific discovery in history, in your opinion?',
        'Is space exploration a good use of money when many people on Earth are poor?',
        'Would you like to be an astronaut? Why or why not?',
        'Do you think there is life in outer space?',
        'Which invention has changed your daily life the most?',
        'Should there be limits on what scientists are allowed to research?',
      ],
      task: {
        prompt: 'Should countries spend money on space exploration?',
        points: [
          'One invention that came from space research',
          'Two arguments for',
          'Two arguments against',
          'Your opinion',
          'Check your articles: a / an / the / no article',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Some people think space exploration is a waste of money, but I disagree. Many things we use every day came from space research, like GPS. Satellites help us predict the weather and connect to the internet. Scientists carry out experiments on the International Space Station that lead to breakthroughs in medicine. And there's still so much to explore in outer space. Of course, we need research on Earth too, but groundbreaking discoveries need big dreams. It's not rocket science: if we stop exploring, we stop learning.",
    },
    `
n | discovery | Finding something that nobody knew about before. | The discovery of penicillin saved millions of lives.
n | invention | Something new that someone has designed or created. | The printing press was one of the most important inventions in history.
n | experiment | A scientific test that is done to discover or prove something. | We did a simple experiment with water and salt.
n | research | Careful study to find out new facts. | She's doing research on new treatments for diabetes.
n | breakthrough | An important new discovery or development. | Scientists have made a breakthrough in cancer treatment.
n | astronaut | A person who is trained to travel in space. | The astronaut spent six months on the International Space Station.
n | satellite | A machine sent into space to travel around the earth, used for communication or for taking pictures. | The new satellite will bring fast internet to remote areas.
n | spacecraft | A vehicle that travels in space. | The spacecraft landed safely on Mars.
v | explore | To travel around a place to learn about it. | Robots are exploring the surface of Mars.
n | outer space | The area beyond the earth's atmosphere. | Do you think there is life in outer space?
adj | groundbreaking | Very new and important, changing the way people think about something. | Her groundbreaking research changed how we treat heart disease.
pv | carry out | To do a task, such as research or a test. | The team carried out hundreds of tests before the launch.
i | it's not rocket science | It is not difficult to understand or to do. | Saving money isn't rocket science: spend less than you earn.
`
  ),
  pack(
    {
      id: 'happiness-and-success',
      group: 'society',
      title: 'Happiness & Success',
      description: 'What success really means, money and happiness, and what makes a good life.',
      level: 'B2',
      emoji: '🏆',
      warmUp: [
        'What does success mean to you, in one sentence?',
        'Who is the happiest person you know? Why are they happy?',
      ],
      grammar: {
        title: 'so, such, too and enough',
        points: [
          { form: 'so + adjective / such (a) + adjective + noun', use: 'Make something stronger, often with a result.', example: 'He was so tired that he fell asleep. It was such a good day.' },
          { form: 'too + adjective (+ to + verb)', use: 'More than is good or possible.', example: 'I was too busy to see my friends.' },
          { form: 'adjective + enough / enough + noun', use: 'The right amount, or not the right amount.', example: 'Is money enough to make you happy? I don’t have enough time.' },
        ],
        tip: '“Enough” goes after an adjective but before a noun: “old enough”, “enough money”.',
      },
      discussion: [
        'Is it possible to be successful but unhappy?',
        'How much money is enough to be happy?',
        'Is our society becoming too materialistic?',
        'What gives you a sense of purpose?',
        'Do you agree that every failure teaches you something?',
        'Do you feel you have to live up to other people’s expectations?',
      ],
      task: {
        prompt: 'What does a successful life mean to you?',
        points: [
          'Your idea of success',
          'The role of money',
          'A failure that taught you something',
          'One sentence with so / such and one with too / enough',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "When I was younger, I thought success meant wealth: a big car, an expensive apartment and a high salary. I worked so hard that I had no time for my family, and I still wasn't content. Then I lost my job. It felt like a failure, but it was such an important lesson. Now I have a job that pays less but is much more fulfilling, and it gives me a real sense of purpose. I try to feel gratitude for small things every day, and I don't need to live up to anyone's expectations. Money is important, but money can't buy happiness.",
    },
    `
n | success | Achieving the results that you wanted or hoped for. | For me, success means doing work I'm proud of.
adj | fulfilling | Making you feel happy and satisfied because you are using your abilities. | Teaching is hard, but it's a very fulfilling job.
adj | content | Happy and satisfied with what you have. | My grandfather wasn't rich, but he was content with his life.
n | gratitude | The feeling of being thankful. | Writing down three good things every night helps me feel gratitude.
n | wealth | A large amount of money or possessions. | Wealth doesn't always bring happiness.
adj | materialistic | Caring too much about money and possessions. | Our society is becoming more materialistic.
n | goal | Something that you hope to achieve. | My goal this year is to pass the IELTS exam.
n | sense of purpose | The feeling that your life has meaning and direction. | Volunteering gave me a real sense of purpose.
n | failure | A lack of success; something that didn't work. | Every failure teaches you something.
n | satisfaction | The pleasant feeling you get when you achieve something. | I get a lot of satisfaction from helping my students.
adj | self-made | Successful or rich because of your own hard work, not your family's money. | He's a self-made businessman who started with nothing.
pv | live up to | To be as good as people expected. | I always felt I had to live up to my parents' expectations.
i | money can't buy happiness | Being rich doesn't make you happy. | They have a big house and three cars, but money can't buy happiness.
`
  ),
];
