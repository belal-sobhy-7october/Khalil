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
        "Last week, my uncle sent the family a story with a sensational headline: a famous drink causes cancer. The article claimed that doctors had hidden the truth for years. I decided to fact-check it. I couldn't find a single credible source, and no journalist from a real newspaper had written about it. The company denied the story, and later the website admitted making it up to get clicks. It was pure clickbait. Now I always tell my family to take anything they read online with a grain of salt.",
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
i | take something with a grain of salt | To not completely believe something. | I take everything I read on social media with a grain of salt.
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
        "Last year, I was working full-time and studying at night. I was exhausted, I couldn't sleep, and I had terrible anxiety before every exam. I didn't tell anyone, because I was worried about the stigma. One day, I was at the end of my rope, and I finally opened up to my brother. He listened and helped me see that I couldn't cope alone. I started therapy, and now I practice mindfulness every morning. Looking back, I should have asked for help much earlier. Self-care and a good support network are part of good mental health.",
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
i | at the end of your rope | So tired or worried that you can't deal with a situation anymore. | After three sleepless nights with the baby, I was at the end of my rope.
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
  pack(
    {
      id: 'history-and-civilizations',
      group: 'society',
      title: 'History & Ancient Civilizations',
      description: 'Talk about the past, ancient Egypt and what history can teach us.',
      level: 'B2',
      emoji: '🏛️',
      warmUp: [
        'Which period of history would you like to visit for one day?',
        'When did you last visit a museum?',
      ],
      grammar: {
        title: 'The past perfect continuous',
        points: [
          { form: 'had been + V-ing', use: 'An action that continued up to a moment in the past.', example: 'Archaeologists had been digging for years when they found the tomb.' },
          { form: 'had been + V-ing + for / since', use: 'How long something continued before a past moment.', example: 'The dynasty had been ruling for 200 years when it fell.' },
          { form: 'had been + V-ing to explain a past result', use: 'Explaining a situation in the past.', example: 'His clothes were dusty because he had been working in the ruins.' },
        ],
        tip: 'Don’t use it with state verbs like know, own or believe: “People had known about the city for centuries”, not “had been knowing”.',
      },
      discussion: [
        'Which ancient civilization interests you most, apart from Egypt’s?',
        'Why do powerful empires, like Rome, fall in the end?',
        'Should artifacts in foreign museums be returned to Egypt?',
        'Would you like to be an archaeologist? What would you want to dig up?',
        'Which buildings in Egypt will stand the test of time, and which won’t?',
        'Do you think history repeats itself? Give an example.',
        'Should schools teach more about ancient Egypt, or about recent history?',
      ],
      task: {
        prompt: 'Tell the story of an important discovery or event in history.',
        points: [
          'What had been happening before it (past perfect continuous)',
          'What was found or what happened',
          'Why it’s important today',
          'Your opinion',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last summer, I finally visited the Grand Egyptian Museum and saw Tutankhamun's treasures. Our guide told us that Howard Carter had been searching the Valley of the Kings for years when he found the tomb in 1922. Nobody had entered it for more than 3,000 years, and it was full of artifacts, from gold masks to simple sandals. Tutankhamun was a young pharaoh of the 18th Dynasty, and he wasn't very important in his own time. Seeing the hieroglyphs up close, I felt proud of the civilization my ancestors built. Great empires like Rome turned to ruins, but the pyramids have stood the test of time. Archaeologists are still digging up new things every year, so the story isn't finished. People say history repeats itself, so I think we should learn from it.",
    },
    `
n | civilization | A society with its own culture, government and way of life, especially in the past. | Ancient Egypt was one of the first great civilizations.
n | dynasty | A series of rulers from the same family. | Ramses II belonged to the 19th Dynasty.
n | pharaoh | A king of ancient Egypt. | The pharaoh Khufu built the Great Pyramid.
n | archaeologist | A person who studies the past by digging up and examining old objects and buildings. | Archaeologists found a new tomb in Saqqara last year.
n | tomb | A large stone place where a dead person is buried. | The tomb of Nefertari has beautiful colored walls.
n | empire | A group of countries ruled by one king, queen or government. | The Roman Empire controlled Egypt for centuries.
n | artifact | An object made by people long ago, such as a tool or a piece of jewelry, that has historical interest. | The museum has more than 100,000 artifacts.
n | hieroglyph | A picture or a symbol used in the writing of ancient Egypt. | Champollion was the first to read the hieroglyphs on the Rosetta Stone.
adj | ancient | From a time very long ago. | Luxor is full of ancient temples.
n | ruins | The parts of a building or a city that are left after it has been destroyed or has fallen apart. | We walked through the ruins of the old Roman city.
pv | dig up | To find something by digging in the ground. | They dug up a statue while they were building a new road.
i | stand the test of time | To still be good, strong or popular after a long time. | The pyramids have stood the test of time for 4,500 years.
i | history repeats itself | Things that happened in the past often happen again. | Another war over water? History repeats itself.
`
  ),
  pack(
    {
      id: 'nature-and-wildlife',
      group: 'society',
      title: 'Geography, Nature & Wildlife',
      description: 'Describe landscapes and wildlife, and talk about protecting nature.',
      level: 'B2',
      emoji: '🦁',
      warmUp: [
        'What is the most beautiful natural place you have ever seen?',
        'Which wild animal would you most like to see in real life?',
      ],
      grammar: {
        title: 'Superlatives: one of the most…, the … I’ve ever seen',
        points: [
          { form: 'the + adjective-est · the most + adjective', use: 'Comparing one thing with all the others in a group.', example: 'The Nile is the longest river in Africa.' },
          { form: 'one of the + superlative + plural noun', use: 'Something among the top few.', example: 'Ras Mohammed is one of the most beautiful national parks in the world.' },
          { form: 'the + superlative + noun + I’ve ever + past participle', use: 'The top of your own experience.', example: 'It’s the clearest water I’ve ever seen.' },
          { form: 'the least + adjective', use: 'The opposite of the most.', example: 'The desert is the least crowded place I know.' },
        ],
        tip: 'Use in with places and groups (“the biggest in Egypt”), not of, and keep the plural after one of: “one of the best beaches”, not “one of the best beach”.',
      },
      discussion: [
        'What is the most amazing landscape you have ever seen in Egypt?',
        'Which animals in Egypt are endangered, and why?',
        'Is it right to keep wild animals in zoos?',
        'How does tourism damage the coral reefs of the Red Sea?',
        'What happens to an ecosystem when its top predator disappears?',
        'Would you rather explore an oasis in the Western Desert or a forest abroad?',
        'How can ordinary people help species that are dying out?',
      ],
      task: {
        prompt: 'Describe a natural place for a travel video.',
        points: [
          'Where it is and what the landscape looks like',
          'The wildlife you can see there',
          'Three superlatives',
          'One danger to this place and how to protect it',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Ras Mohammed is one of the most beautiful national parks I've ever visited. On land, the landscape is dry and empty, but under the water there's a completely different world. The coral reef is full of life: it's the clearest water I've ever seen, and I counted over twenty species of fish in ten minutes. Our guide said the reef is a fragile ecosystem, and one broken piece of coral can take years to grow back. Sharks, the top predators, live in the deeper water, and some of the turtles there are endangered. Lions once lived in Egypt thousands of years ago, but they died out here long ago. If we don't protect the animals' habitat, more species will become extinct. For me, the great outdoors is the best classroom there is.",
    },
    `
n | wildlife | Animals, birds and plants that live in nature, not with people. | Wadi El Rayan is full of wildlife, from birds to desert foxes.
adj | endangered | Describing an animal or a plant that may soon disappear from the world. | Sea turtles are endangered because of plastic in the sea.
n | habitat | The natural home of an animal or a plant. | New hotels are destroying the turtles' habitat.
n | oasis | A place in the desert with water and trees. | Siwa is an oasis near the border with Libya.
n | coral reef | A long line of colorful, rock-like coral in warm, shallow sea water. | The Red Sea has some of the best coral reefs in the world.
n | species | A group of animals or plants of the same kind. | Scientists have found hundreds of fish species in the Red Sea.
n | landscape | Everything you can see when you look across a large area of land. | The White Desert has an amazing landscape of white rocks.
n | national park | A large area of natural land that the government protects for people to visit. | Ras Mohammed became Egypt's first national park in 1983.
adj | extinct | Describing an animal or a plant that no longer exists. | The dodo became extinct over 300 years ago.
n | ecosystem | All the living things in an area and the way they depend on each other. | Overfishing damages the whole ecosystem of the lake.
n | predator | An animal that kills and eats other animals. | Sharks are the top predators in the sea.
pv | die out | To become less and less common and then disappear completely. | Some local plants are dying out because of the heat.
i | the great outdoors | Nature, away from towns and buildings. | My father loves the great outdoors; he spends every weekend in the desert.
`
  ),
  pack(
    {
      id: 'living-abroad',
      group: 'society',
      title: 'Migration & Living Abroad',
      description: 'Talk about moving to another country, missing home and starting a new life.',
      level: 'B2',
      emoji: '🌍',
      warmUp: [
        'Do you know anyone who lives abroad? Where?',
        'Would you like to live in another country one day?',
      ],
      grammar: {
        title: 'still, anymore and no longer',
        points: [
          { form: 'still + verb', use: 'Something continues; it hasn’t stopped.', example: 'I still miss my mother’s cooking.' },
          { form: 'not … anymore', use: 'Something has stopped (informal, at the end of the sentence).', example: 'I don’t feel homesick anymore.' },
          { form: 'no longer + verb', use: 'The same meaning, more formal (before the main verb).', example: 'He no longer works in Egypt.' },
          { form: 'still + negative', use: 'Something expected that hasn’t happened, often with surprise or impatience.', example: 'I still haven’t gotten my residence permit.' },
        ],
        tip: 'In American English, anymore is one word, and it goes at the end: “I don’t live there anymore”, not “I don’t anymore live there”.',
      },
      discussion: [
        'Why do so many young Egyptians want to emigrate? Is it a brain drain?',
        'What is the hardest part of being an immigrant in a new country?',
        'How long does it take to adjust to a new culture?',
        'Why do people say expats for Europeans in Egypt but immigrants for Egyptians in Europe?',
        'How important are remittances from Egyptians abroad for families here?',
        'Have you ever felt like a fish out of water somewhere?',
        'If you emigrated, would you put down roots or plan to come back?',
      ],
      task: {
        prompt: 'Imagine you have lived abroad for one year. Send a voice note home.',
        points: [
          'Where you are and why you went',
          'What you still find hard',
          'What you don’t find hard anymore',
          'Whether you’ll come back to your homeland',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My brother emigrated to Canada three years ago, and I call him every Friday. At first, he felt like a fish out of water: the cold, the accent and the long winter nights. He was very homesick, and he still talks about our mother's cooking. Getting his visa took eight months, and his residence permit took another year. He doesn't feel like a stranger anymore; he has adjusted well, and his building is full of immigrants and expats from twenty countries. He sends remittances every month to help our parents. Some people call it a brain drain when engineers like him leave Egypt, but he says he had to start over to have a future. He's planning to put down roots there, but he says Egypt will always be his homeland.",
    },
    `
n | immigrant | A person who has come to live permanently in a country that is not their own. | Many immigrants in Canada work in health care.
v | emigrate | To leave your own country to live permanently in another one. | My uncle emigrated to Australia in the 1990s.
adj | homesick | Sad because you are away from your home and family. | I was so homesick during my first Ramadan abroad.
n | expat | A person who lives in a country that is not their own, often for work (short for expatriate). | There are many European expats living in Hurghada.
n | visa | An official stamp or paper that allows you to enter or stay in a country. | It took three months to get my visa for the US.
n | residence permit | An official document that allows a foreigner to live in a country. | You need a residence permit to open a bank account there.
n | brain drain | The movement of highly skilled and educated people to other countries. | The brain drain of doctors is a big problem for Egyptian hospitals.
v | adjust | To get used to a new situation by changing the way you behave or think. | It took my kids a few months to adjust to their new school.
n | homeland | The country where you were born or where your family comes from. | He lives in London, but Egypt is still his homeland.
n | remittance | Money that someone working abroad sends home to their family. | Remittances from the Gulf are an important part of Egypt's economy.
pv | start over | To begin again from the start, often in a new place. | After the war, they had to start over in a new country.
i | put down roots | To settle in a place where you plan to live for a long time. | They bought a house and put down roots in Germany.
i | a fish out of water | A person who feels uncomfortable in a place or a situation that is not familiar. | At my first job in a big company, I felt like a fish out of water.
`
  ),
  pack(
    {
      id: 'equality-and-opportunity',
      group: 'society',
      title: 'Equality, Opportunities & Social Mobility',
      description: 'Discuss inequality, fair chances and what helps people move up in society.',
      level: 'C1',
      emoji: '⚖️',
      warmUp: [
        'Did everyone in your class at school have the same chances in life?',
        'What helps a person most to succeed: talent, effort, money or connections?',
      ],
      grammar: {
        title: 'Inversion for emphasis: Not only…, Rarely…, Only when…',
        points: [
          { form: 'Not only + auxiliary + subject …, but (also) …', use: 'Adding a surprising second point, formally.', example: 'Not only does nepotism hurt talented people, but it also hurts companies.' },
          { form: 'Rarely / Seldom / Never + auxiliary + subject', use: 'Stressing that something hardly ever happens.', example: 'Rarely do children from poor villages reach the top universities.' },
          { form: 'Only when / Only if + clause, auxiliary + subject', use: 'Stressing a condition.', example: 'Only when schools are good everywhere will we have real equality.' },
          { form: 'Under no circumstances + auxiliary + subject', use: 'A strong negative.', example: 'Under no circumstances should a job depend on your family name.' },
        ],
        tip: 'After a negative word at the start, use question word order: “Rarely do we see…”, not “Rarely we see…”. Use it in speeches and essays; it sounds too formal in a chat.',
      },
      discussion: [
        'Is there a level playing field for young people in Egypt today? Why or why not?',
        'How common is nepotism in the places you know, and what does it do to the people who work there?',
        'Can education alone lift families out of poverty?',
        'Is there a glass ceiling for women in your field?',
        'Should companies hire only on merit, or should they also help disadvantaged groups?',
        'What does an inclusive workplace look like?',
        'Is social mobility easier or harder than it was for your parents’ generation?',
      ],
      task: {
        prompt: 'Give a short speech about equal opportunity.',
        points: [
          'One example of inequality you have seen',
          'Why it matters for everyone',
          'One idea that could empower people',
          'Two sentences with inversion (Not only…, Rarely…)',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I grew up in a village in Minya, where many families live in poverty, and I've seen how unfair life can be. Rarely do children from my village reach the top universities, not because they lack talent, but because they lack good schools. My father always said that education would lift us out of poverty, and for me, it did. Not only did a scholarship pay for my college, but it also gave me the confidence to apply to big companies. Still, I've seen nepotism in my own workplace: a manager's nephew got a job that should have gone to someone on merit. For women, the glass ceiling is real too; only one of our twelve directors is a woman. Only when we create a level playing field will social mobility be possible for everyone. I believe that if we empower disadvantaged young people, the whole country wins.",
    },
    `
n | inequality | An unfair situation in which some people have more money, rights or chances than others. | Income inequality has grown in many countries.
n | equal opportunity | The idea that everyone should have the same chances, especially in education and work. | The company says it's an equal opportunity employer.
n | social mobility | The ability of people to move to a different, usually better, social and economic position. | Free education is the key to social mobility.
n | discrimination | Treating a person or a group worse than others because of their gender, religion, origin or another reason. | Discrimination against women in hiring is against the law.
adj | disadvantaged | Having fewer chances than other people because of poverty or other problems. | The program gives free laptops to disadvantaged students.
n | poverty | The state of being very poor. | Millions of people around the world live in poverty.
adj | inclusive | Including and welcoming all kinds of people. | An inclusive school has ramps for students in wheelchairs.
n | glass ceiling | An unofficial limit that stops women or minorities from reaching the top jobs. | She was the first woman in the bank to break the glass ceiling.
n | merit | The quality of being good and deserving praise or reward. | Promotions should be based on merit, not on who you know.
n | nepotism | Using your power to give jobs or advantages to your relatives or friends. | Nepotism is common in companies where the owner's family is in charge.
v | empower | To give someone the confidence, skills or power to control their own life. | Small loans can empower women to start their own businesses.
pv | lift someone out of | To help someone escape from a bad situation, especially poverty. | A good job can lift a whole family out of poverty.
i | a level playing field | A situation in which everyone has the same chance of success. | Online courses help create a level playing field for students in rural areas.
`
  ),
  pack(
    {
      id: 'inflation-and-cost-of-living',
      group: 'society',
      title: 'Economy, Inflation & Cost of Living',
      description: 'Talk about rising prices, the currency and how people manage when money buys less.',
      level: 'B2',
      emoji: '📈',
      warmUp: [
        'What did a sandwich cost when you were a child? And now?',
        'Which price has gone up the most in your life recently?',
      ],
      grammar: {
        title: 'Describing changes: rise by, fall to, a sharp increase in',
        points: [
          { form: 'rise / increase / go up + by + amount', use: 'The size of the change.', example: 'The price of rice rose by 30 percent.' },
          { form: 'fall / drop / go down + to + new level', use: 'The new level after the change.', example: 'Sales fell to half of last year’s level.' },
          { form: 'a sharp / slight / steady + increase / fall + in + noun', use: 'Describing the change with a noun.', example: 'There was a sharp increase in rent last year.' },
          { form: 'verb + adverb: rise sharply, fall slightly, grow steadily', use: 'Describing how fast or how much.', example: 'Prices have risen sharply since January.' },
        ],
        tip: 'rise has no object: “Prices rose”. raise has one: “The company raised its prices”. Don’t say “The prices raised”.',
      },
      discussion: [
        'How has inflation changed the way your family shops?',
        'Why does the exchange rate matter even to people who never travel?',
        'Should the government keep subsidies on bread and fuel? Why?',
        'What do you consider a necessity, and what is a luxury now?',
        'How do higher interest rates affect young people who want to buy a home or a car?',
        'Do you think a recession is coming? What are the signs?',
        'What have you done to tighten your belt this year?',
      ],
      task: {
        prompt: 'Explain to a foreign friend how prices have changed in Egypt.',
        points: [
          'Two prices then and now (rise by, go up to…)',
          'Why prices are soaring (the currency, imports…)',
          'What families have stopped buying',
          'One thing that could help',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "When I was in college, a bowl of koshary cost ten pounds; now it costs over fifty. Prices have been soaring for the last few years, and the purchasing power of my salary has fallen sharply. The main reason is the currency: the exchange rate went from about 16 pounds to the dollar to around 50, so everything we import costs more. Every price hike hurts families like mine. My parents used to see meat as a necessity, but now it's almost a luxury, and we eat it once a week. The government keeps a subsidy on bread, which helps the poorest families. The central bank raised interest rates to fight inflation, so loans are more expensive too. We've all had to tighten our belts, and I hope things get better before a recession hits.",
    },
    `
n | inflation | A general rise in prices over time, so that money buys less. | Inflation hit 30 percent last year.
n | interest rate | The percentage that a bank charges you for borrowing money, or pays you for saving it. | The bank raised its interest rate on savings to 25 percent.
n | currency | The money used in a particular country. | The Egyptian pound is the currency of Egypt.
n | exchange rate | The value of one currency compared with another. | Check the exchange rate before you change your dollars.
n | purchasing power | How much a sum of money can buy. | Our salaries went up, but our purchasing power went down.
n | recession | A period when a country's economy is doing badly, with less business and more people out of work. | Many companies stopped hiring during the recession.
n | subsidy | Money that the government pays to keep the price of something low. | Bread subsidies help millions of Egyptian families.
n | necessity | Something that you really need. | A phone is a necessity now, not a luxury.
n | luxury | Something expensive that is nice to have but not necessary. | Eating out has become a luxury for many families.
adj | soaring | Rising very quickly to a high level. | Soaring rents are pushing young people out of the city center.
n | price hike | A sudden, large increase in price. | The fuel price hike made taxis more expensive.
pv | go up | To increase in price, number or level. | The price of cooking oil went up again this month.
i | tighten your belt | To spend less money because you have less than before. | With prices this high, everyone has to tighten their belt.
`
  ),
  pack(
    {
      id: 'jobs-and-future-work',
      group: 'society',
      title: 'Employment & Future Jobs',
      description: 'Talk about the job market, automation and the jobs that will and won’t exist in twenty years.',
      level: 'B2',
      emoji: '🏭',
      warmUp: [
        'What jobs did your grandparents do? Do those jobs still exist?',
        'Which job do you think will disappear first?',
      ],
      grammar: {
        title: 'Adjective + to-infinitive: hard to find, easy to replace, the first to go',
        points: [
          { form: 'It’s + adjective + to + base verb', use: 'Giving your opinion about an action.', example: 'It’s hard to find a job without experience.' },
          { form: 'noun + is + adjective + to + base verb', use: 'The same idea, with the thing as the subject.', example: 'Some jobs are easy to automate.' },
          { form: 'the first / the last / the only + to + base verb', use: 'Saying who does something first, last or alone.', example: 'Cashiers may be the first to lose their jobs to machines.' },
        ],
        tip: 'Don’t add it at the end: say “The job is hard to do”, not “The job is hard to do it”.',
      },
      discussion: [
        'Which jobs are in demand in Egypt right now, and which are hard to find?',
        'Is automation a threat to workers or a chance to do better jobs?',
        'Would you prefer job security or a higher income in the gig economy?',
        'Should the minimum wage go up every year with prices?',
        'Why are blue-collar jobs, like plumbing, often better paid than people expect?',
        'What can universities do to close the skills gap?',
        'How can someone escape a dead-end job?',
      ],
      task: {
        prompt: 'Give advice to a high school student who is choosing a career.',
        points: [
          'Two jobs that are in demand and easy to start',
          'One job that may become obsolete',
          'What job security means to you',
          'Skills they should learn now',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My father worked in the same textile factory for thirty years, and he had complete job security. My generation is different: the job market changes every year, and some jobs become obsolete before we even graduate. When the factory brought in automation, it laid off half the workforce, and my father was one of the first to go. Now he drives for a ride-hailing app, which is part of the gig economy; the money is OK, but there's no insurance. Unemployment among graduates is high, and many jobs pay little more than the minimum wage. I don't want a dead-end job, so I'm learning data analysis, which is in demand everywhere. Companies say there's a skills gap: it's easy to find graduates but hard to find people with practical skills. Blue-collar jobs aren't going anywhere, either; a good electrician is still hard to replace.",
    },
    `
n | unemployment | The situation of people not having a job, or the number of people without one. | Unemployment among young graduates is a big problem.
n | job market | The number of jobs available and the people looking for them. | The job market for nurses is strong right now.
n | automation | Using machines and computers to do work that people used to do. | Automation has replaced many factory workers.
p | in demand | Wanted by a lot of people, especially employers. | Software developers are in demand all over the world.
adj | obsolete | No longer used because something newer and better exists. | Fax machines are almost obsolete.
n | gig economy | A way of working in which people do short jobs for different companies, often through apps, instead of having a permanent job. | Delivery drivers are part of the gig economy.
n | job security | The feeling that you will not lose your job. | Government jobs offer more job security than private ones.
pv | lay off | To stop employing someone because there is not enough work or money. | The factory laid off 200 workers last month.
n | workforce | All the people who work in a country, an industry or a company. | Women make up a growing part of Egypt's workforce.
n | minimum wage | The lowest amount of money that an employer is legally allowed to pay a worker. | The government raised the minimum wage this year.
adj | blue-collar | Describing work that needs physical effort, such as building or factory work. | My uncle is proud of his blue-collar job as a mechanic.
n | skills gap | The difference between the skills employers need and the skills workers have. | Short tech courses can help close the skills gap.
i | a dead-end job | A job with no chance of promotion or progress. | He left his dead-end job and started his own business.
`
  ),
  pack(
    {
      id: 'art-and-architecture',
      group: 'society',
      title: 'Art, Design & Architecture',
      description: 'Describe buildings, paintings and design, and say what you find beautiful.',
      level: 'B2',
      emoji: '🎨',
      warmUp: [
        'What is the most beautiful building you have ever seen?',
        'Do you have a favorite artist or painting?',
      ],
      grammar: {
        title: 'Word formation: -ful, -less, -ive, -al',
        points: [
          { form: 'noun + -ful', use: 'Having a lot of the quality.', example: 'beauty → beautiful · color → colorful' },
          { form: 'noun + -less', use: 'Without the quality.', example: 'point → pointless · time → timeless' },
          { form: 'verb + -ive', use: 'Having the quality of the action.', example: 'create → creative · impress → impressive' },
          { form: 'noun + -al', use: 'Connected with the noun.', example: 'architecture → architectural · tradition → traditional' },
        ],
        tip: 'The suffix -ful has only one l: “beautiful”, “colorful”, not “beautifull”. And -less is often the opposite of -ful: careful, careless.',
      },
      discussion: [
        'Which building in Cairo do you think is a masterpiece? Why?',
        'Should old buildings downtown be torn down to make space for new ones?',
        'Do you prefer ornate traditional design or minimalist modern design?',
        'Is abstract art real art, or can anyone do it?',
        'Should cities pay artists to paint murals on public walls?',
        'What would you change about the skyline of your city?',
        'Do you agree that beauty is in the eye of the beholder?',
      ],
      task: {
        prompt: 'Describe a building or a work of art you love.',
        points: [
          'Where it is and who made it',
          'What it looks like (ornate, minimalist…)',
          'Two words with -ful, -less, -ive or -al',
          'Why it matters to you',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My favorite building in Cairo is the Baron Empain Palace in Heliopolis. Its architect, a Frenchman, designed it like a Hindu temple, and it's covered in ornate sculptures of elephants and dancers. For years it was empty, and people were afraid it would be torn down, but now it has been restored, and there are exhibitions inside. I think it's a timeless masterpiece. The skyline of the New Administrative Capital is very different: tall, modern and almost minimalist. My sister prefers abstract paintings and colorful murals, while I love traditional Islamic architecture. Last month, we visited a small gallery in Zamalek, and we couldn't agree on a single painting. I guess beauty is in the eye of the beholder.",
    },
    `
n | architecture | The style and design of buildings, or the art of designing them. | Islamic architecture in Old Cairo is full of domes and minarets.
n | architect | A person whose job is to design buildings. | The architect designed the new library with large windows.
n | masterpiece | A work of art, such as a painting or a building, that is extremely good. | The Mona Lisa is Leonardo da Vinci's most famous masterpiece.
n | exhibition | A public show of paintings, photos or other objects. | There's a photo exhibition about old Alexandria at the Opera House.
n | sculpture | A piece of art made by shaping stone, wood or metal. | Mahmoud Mokhtar's sculpture of Egypt's Renaissance stands near Cairo University.
n | mural | A large painting on a wall. | Artists painted colorful murals on the walls of the old school.
adj | abstract | Describing art that uses shapes and colors instead of showing real people or things. | I don't understand abstract paintings; they look like random lines to me.
n | skyline | The shape of a city's buildings against the sky. | The skyline of Dubai changes every year.
adj | ornate | Covered with a lot of detailed decoration. | The palace has ornate ceilings painted in gold.
adj | minimalist | Using very few, simple things or a very simple style. | Their apartment is minimalist: white walls and very little furniture.
n | gallery | A room or a building where people can see works of art. | The gallery in Zamalek shows young Egyptian artists.
pv | tear down | To destroy a building or a structure on purpose. | They tore down the old villa to build an apartment block.
i | beauty is in the eye of the beholder | Different people have different ideas about what is beautiful. | You think it's ugly, but I love it; beauty is in the eye of the beholder.
`
  ),
  pack(
    {
      id: 'decision-making-and-trade-offs',
      group: 'society',
      title: 'Decision-Making & Trade-offs',
      description: 'Weigh the pros and cons, explain a hard choice and live with the consequences.',
      level: 'C1',
      emoji: '🔀',
      warmUp: [
        'What was the hardest decision you made this year?',
        'Do you decide quickly, or do you take a long time?',
      ],
      grammar: {
        title: 'whether … or not, and it depends on',
        points: [
          { form: 'whether + clause + or not', use: 'Talking about two possibilities, often after decide, know or wonder.', example: 'I can’t decide whether I should accept the offer or not.' },
          { form: 'whether + to + base verb', use: 'The same idea with an infinitive.', example: 'I’m still weighing whether to move to Alexandria.' },
          { form: 'it depends on + noun or wh-clause', use: 'When the answer changes with the situation.', example: 'It depends on the salary. · It depends on how much they pay.' },
          { form: 'Whether … or …, + main clause', use: 'The result is the same in both cases.', example: 'Whether I stay or leave, I’ll learn something.' },
        ],
        tip: 'Say “It depends on the price”, never “It depends the price” or “It’s depend on”. And use whether, not if, after a preposition: “It depends on whether he agrees”.',
      },
      discussion: [
        'What trade-offs did you make when you chose your studies or your job?',
        'Do you trust your gut feeling or a list of pros and cons?',
        'Are you indecisive about small things, like what to eat?',
        'Which irreversible decisions should you never make in a hurry?',
        'In hindsight, which decision would you make differently?',
        'Is it better to be impulsive sometimes than to sit on the fence forever?',
        'When is it smart to sleep on a decision, and when is it a mistake?',
      ],
      task: {
        prompt: 'Talk through a big decision you have to make (a real one or an imagined one).',
        points: [
          'The two options',
          'The pros and cons of each',
          'What it depends on',
          'Your decision and why',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last spring, I got a job offer in Riyadh with twice my salary, and I had to decide whether to take it or not. I'm usually indecisive, so I wrote down the pros and cons and weighed them for days. The money was great, but the trade-off was leaving my family and my fiancée for two years. My gut feeling said no, but my head said yes. My father told me not to be impulsive: the move wasn't irreversible, but it would have real consequences. I slept on it for a week and talked to friends who had worked there. In the end, it depended on one thing: whether my fiancée could join me after the wedding. She could, so I accepted, and as for the rest, we'll cross that bridge when we come to it. In hindsight, it was a deliberate decision, and I'm glad I didn't sit on the fence forever.",
    },
    `
n | trade-off | A situation in which you accept something bad to get something good. | Working from home means more freedom, but the trade-off is feeling lonely.
n | pros and cons | The advantages and disadvantages of something. | We discussed the pros and cons of buying a car.
v | weigh | To think carefully about something before you decide. | I need time to weigh my options.
adj | indecisive | Not able to make decisions quickly. | My brother is so indecisive that it takes him an hour to order food.
n | gut feeling | A strong belief that you can't explain, which comes from your feelings rather than facts. | I had a gut feeling that the deal was a mistake.
n | consequence | Something that happens as a result of an action or a decision. | Think about the consequences before you quit your job.
adj | impulsive | Acting suddenly without thinking about the results. | I made an impulsive decision and bought a car I couldn't afford.
n | hindsight | Understanding a situation only after it has happened. | In hindsight, I should have studied engineering.
adj | deliberate | Done after careful thought, not suddenly. | Moving to a smaller apartment was a deliberate choice to save money.
adj | irreversible | Impossible to change back to how it was before. | Selling the family land is an irreversible decision.
pv | sleep on something | To wait until the next day before you make a decision. | Don't answer them now; sleep on it.
i | sit on the fence | To avoid choosing between two sides. | You can't sit on the fence forever; you need to choose a major.
i | cross that bridge when you come to it | To deal with a problem only when it actually happens, not before. | What if the company closes? We'll cross that bridge when we come to it.
`
  ),
  pack(
    {
      id: 'problem-solving',
      group: 'society',
      title: 'Problem-Solving & Critical Thinking',
      description: 'Find the root cause of a problem, question your assumptions and explain solutions carefully.',
      level: 'C1',
      emoji: '🧩',
      warmUp: [
        'What is a problem you solved recently, at work or at home?',
        'Do you like puzzles and riddles?',
      ],
      grammar: {
        title: 'Hedging: seem, appear, tend to',
        points: [
          { form: 'seem / appear + to + base verb', use: 'Saying what looks true, without being completely sure.', example: 'The problem seems to start when the system is busy.' },
          { form: 'There seems / appears to be + noun', use: 'Introducing a possible problem politely.', example: 'There seems to be a bottleneck in the delivery process.' },
          { form: 'tend to + base verb', use: 'Saying what usually happens.', example: 'Customers tend to complain on Sundays.' },
          { form: 'It seems / appears that + clause', use: 'A careful conclusion.', example: 'It appears that the data is wrong.' },
        ],
        tip: 'Hedging makes you sound careful, not weak. In meetings and reports, “It seems that…” sounds more professional than “It’s 100 percent because…”.',
      },
      discussion: [
        'What is the difference between the symptoms of a problem and its root cause?',
        'What assumptions do people tend to make about others too quickly?',
        'Do you solve problems best alone or by brainstorming with a group?',
        'Why do people jump to conclusions, and how can we avoid it?',
        'Should schools in Egypt teach critical thinking as a subject?',
        'When is trial and error the best method, and when is it too risky?',
        'Tell us about a time you had to think outside the box.',
      ],
      task: {
        prompt: 'Explain how you would solve a problem at work or at school.',
        points: [
          'Describe the problem (use seem or appear)',
          'What the root cause might be',
          'Two possible solutions',
          'How you would test them',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "At the call center where I work, customers tended to wait twenty minutes on Mondays, and our manager assumed we needed more agents. Instead of jumping to conclusions, our team analyzed the call data. There seemed to be a bottleneck: half the calls were about the same billing error. So the root cause wasn't the number of agents but a flaw in the billing system. We brainstormed solutions, and someone thought outside the box: why not send customers a text message before they call? We tested it for two weeks, by trial and error, until we figured out the best wording. The waiting time fell to five minutes. It taught me to question every assumption and to stay objective; critical thinking saved the company a lot of money.",
    },
    `
n | root cause | The main, basic reason why a problem happens. | We fixed the symptoms, but we didn't find the root cause.
n | assumption | Something that you believe is true without proof. | Don't make assumptions about people from their clothes.
adj | logical | Following clear and sensible reasons. | Her plan was simple and logical, so everyone agreed.
v | brainstorm | To think of many ideas quickly in a group, before choosing the best. | Let's brainstorm ways to reduce costs.
n | flaw | A mistake or a weakness that makes something less effective. | There's a serious flaw in your argument.
adj | objective | Based on facts, not on personal feelings. | A manager should give objective feedback to the team.
n | trial and error | A way of solving a problem by trying different methods until one works. | I learned to fix my bike by trial and error.
n | bottleneck | A part of a process that is slower than the others and delays everything. | The single cashier was the bottleneck in the whole store.
v | analyze | To study something in detail to understand it. | We analyzed customer complaints from the last six months.
i | jump to conclusions | To decide something too quickly, before you know all the facts. | Don't jump to conclusions; maybe his phone was dead.
pv | figure out | To find the answer to a problem by thinking about it. | It took me an hour to figure out why the printer wasn't working.
i | think outside the box | To think in a new, creative way. | To win new customers, we need to think outside the box.
n | critical thinking | The ability to examine information and ideas carefully before you accept them. | Critical thinking helps you spot fake news.
`
  ),
  pack(
    {
      id: 'change-and-risk',
      group: 'society',
      title: 'Change, Uncertainty & Risk',
      description: 'Talk about taking risks, facing change and living with not knowing.',
      level: 'C1',
      emoji: '🎲',
      warmUp: [
        'Are you a risk-taker, or do you prefer to play it safe?',
        'What is the biggest change in your life so far?',
      ],
      grammar: {
        title: 'Prepositions + V-ing: instead of, without, by, before',
        points: [
          { form: 'instead of + V-ing', use: 'Choosing one action, not another.', example: 'Instead of complaining, I decided to change jobs.' },
          { form: 'without + V-ing', use: 'Not doing something while you do another thing.', example: 'He quit without telling anyone.' },
          { form: 'by + V-ing', use: 'How you do or achieve something.', example: 'You reduce the risk by saving money first.' },
          { form: 'before / after + V-ing', use: 'The order of actions.', example: 'Think twice before taking the plunge.' },
        ],
        tip: 'After a preposition, the verb takes -ing: “without asking”, not “without ask” or “without to ask”.',
      },
      discussion: [
        'What is a calculated risk you are glad you took?',
        'Why are some people risk-averse, while others love a gamble?',
        'How do you deal with uncertainty, for example when you’re waiting for results?',
        'Is it better to protect the status quo or to embrace change?',
        'What does a leap of faith look like in a career or a relationship?',
        'Would you take the plunge and start your own business? What would stop you?',
        'How did you ride out a difficult period in your life?',
      ],
      task: {
        prompt: 'Talk about a risk you took or one you’re thinking about.',
        points: [
          'What the risk is and why it’s daunting',
          'How you reduced it (by + V-ing)',
          'What you did instead of playing it safe',
          'What happened, or what you hope will happen',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Two years ago, I left a stable job at a bank to start a small online bakery. Everyone said it was a gamble, and my parents, who are very risk-averse, begged me to play it safe. Leaving the status quo was daunting, and the uncertainty kept me awake at night. But it wasn't a blind leap of faith; it was a calculated risk. I reduced the danger by saving a year's salary and by testing my cakes on friends before quitting. Instead of renting a shop, I started in my mother's kitchen. The first months were unpredictable, and I had to ride out a few very slow weeks. Now the business is growing, and I'm glad I embraced the change and took the plunge. Being cautious is good, but never taking a risk is a risk too.",
    },
    `
n | uncertainty | A situation in which you don't know what will happen. | The uncertainty about the exam results made me nervous.
p | take a risk | To do something even though it could have a bad result. | You have to take a risk to achieve something big.
n | gamble | An action that could bring a good result but has a real chance of failure. | Moving to Dubai without a job was a gamble, but it worked.
adj | cautious | Careful to avoid danger or problems. | My father is very cautious with money; he never borrows.
n | leap of faith | Doing something without being sure it will work, because you trust or hope it will. | Marrying after knowing someone for three months is a leap of faith.
adj | unpredictable | Changing so often that you can't know what will happen. | The weather in Alexandria in winter is unpredictable.
n | status quo | The situation as it is now, without changes. | Many managers prefer the status quo to new ideas.
v | embrace | To accept a new idea or a change happily. | Older teachers have started to embrace online learning.
adj | daunting | Making you feel worried because something seems difficult. | Starting a new job in a new city is a daunting experience.
n | calculated risk | A risk that you take after thinking carefully about what could go wrong. | Investing part of my savings was a calculated risk.
adj | risk-averse | Not willing to take risks. | Banks are very risk-averse when they give loans.
pv | ride out | To get through a difficult situation without too much damage. | Small shops struggled to ride out the crisis.
i | take the plunge | To finally decide to do something important or difficult. | After years of renting, we took the plunge and bought an apartment.
i | play it safe | To avoid risks. | I played it safe and booked a refundable ticket.
`
  ),
  pack(
    {
      id: 'ethics-and-dilemmas',
      group: 'society',
      title: 'Ethics & Moral Dilemmas',
      description: 'Discuss right and wrong, hard choices and when (if ever) it’s OK to break the rules.',
      level: 'C1',
      emoji: '🧠',
      warmUp: [
        'Is it ever OK to tell a lie?',
        'Who taught you most about right and wrong?',
      ],
      grammar: {
        title: 'Hypothetical questions: What if…?, Suppose…, Imagine…',
        points: [
          { form: 'What if + past simple …?', use: 'Asking about an imaginary situation.', example: 'What if you found a wallet with 10,000 pounds in it?' },
          { form: 'Suppose / Supposing + past simple', use: 'The same, to start a discussion.', example: 'Suppose your boss asked you to lie to a client. Would you do it?' },
          { form: 'Imagine (that) + past simple', use: 'Inviting someone into a situation.', example: 'Imagine you saw your friend cheating on an exam.' },
          { form: 'What would you do if + past simple?', use: 'The classic second conditional question.', example: 'What would you do if your company were polluting the river?' },
        ],
        tip: 'For unreal situations, use the past simple after What if and Suppose: “What if you lost your job?” Use the present (“What if you lose your job?”) only for a real possibility.',
      },
      discussion: [
        'Is a white lie sometimes the kind thing to do?',
        'What if your best friend asked you to lie for them in court?',
        'Should a whistleblower be protected or punished?',
        'Does the end justify the means in politics or in business?',
        'Where is the gray area between a gift and a bribe?',
        'Would you stand up for a colleague if it put your own job at risk?',
        'Suppose you found a mistake in your favor on your salary slip. What would you do?',
      ],
      task: {
        prompt: 'Present a moral dilemma and say what you would do.',
        points: [
          'Describe the situation (Imagine… / What if…?)',
          'The two choices and why each one is hard',
          'What your conscience tells you',
          'Your decision',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Imagine this: you work in a pharmacy, and you discover that your manager is selling expired medicine. That was my dilemma two years ago. Reporting it felt like the moral thing to do, but what if I lost my job, and what if no one believed me? My conscience wouldn't let me stay quiet, because people's health was at risk. It wasn't a gray area; it was simply dishonest and dangerous. So I decided to stand up for our customers and became a whistleblower, even though some colleagues condemned me for it. A few said that staying quiet was for the greater good, because twenty people would lose their jobs, but I believe in principles and integrity, even when they cost you something. I've learned that small lies are a slippery slope: if you accept one, the next one is easier.",
    },
    `
n | dilemma | A situation in which you must choose between two options that are both difficult. | I faced a dilemma: tell my friend the truth or protect their feelings.
n | conscience | The part of your mind that tells you whether what you are doing is right or wrong. | I couldn't take the money; my conscience wouldn't let me.
n | integrity | The quality of being honest and having strong moral principles. | She's a person of integrity; she never cheats.
adj | moral | Connected with the principles of right and wrong behavior. | Doctors have a moral duty to help everyone.
n | principle | A basic belief about what is right that guides how you behave. | It's against my principles to pay a bribe.
adj | dishonest | Not honest; willing to lie, cheat or steal. | It's dishonest to call in sick when you're not.
n | white lie | A small lie that you tell to be polite or to avoid hurting someone. | I told a white lie and said I loved her cooking.
n | whistleblower | A person who tells the public or the authorities about illegal or wrong actions inside a company or a government. | The whistleblower showed journalists how the factory hid its pollution.
n | greater good | What is best for most people, even if some people lose. | He gave up his land for the greater good: a new hospital.
n | gray area | A situation in which it is not clear what is right or wrong. | Using AI to write your homework is a gray area for some teachers.
v | condemn | To say strongly that you think something is wrong. | Everyone condemned the attack on the journalist.
pv | stand up for | To support or defend someone or something, especially when others are against them. | You should stand up for what you believe in.
i | the end justifies the means | A good result makes any way of getting it acceptable. | Cheating to win isn't OK; the end doesn't justify the means.
i | a slippery slope | Something that will lead to worse and worse things if you allow it. | Accepting one small bribe is a slippery slope.
`
  ),
  pack(
    {
      id: 'education-systems',
      group: 'society',
      title: 'Education Systems & Reform',
      description: 'Discuss how schools teach, what exams measure and how education could change.',
      level: 'C1',
      emoji: '🏫',
      warmUp: [
        'What did you like most and least about your school?',
        'Did you take private lessons in high school?',
      ],
      grammar: {
        title: 'Modal verbs in the passive',
        points: [
          { form: 'modal + be + past participle', use: 'Saying what is possible, necessary or a good idea, without saying who does it.', example: 'The curriculum should be updated every five years.' },
          { form: 'must / have to + be + past participle', use: 'Strong necessity.', example: 'Classes must be made smaller.' },
          { form: 'can’t / couldn’t + be + past participle', use: 'Impossibility.', example: 'Creativity can’t be measured by a multiple-choice test.' },
          { form: 'modal + have been + past participle', use: 'Past possibility or criticism.', example: 'This reform should have been introduced years ago.' },
        ],
        tip: 'Keep be after the modal: “Teachers should be paid more”, not “Teachers should paid more” or “should be pay”.',
      },
      discussion: [
        'Why is private tutoring so common in Egypt, and what does it say about schools?',
        'Is rote learning ever useful, or should it be replaced?',
        'Can a standardized test like Thanaweya Amma really measure a student?',
        'What should be added to the school curriculum, and what should be removed?',
        'Should vocational training be respected as much as a university degree?',
        'How could overcrowded classrooms be fixed?',
        'Do teachers teach to the test because they have no choice?',
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
        "In my public school in Giza, classes were overcrowded, with over sixty students in a room. Our curriculum was based on rote learning, so we memorized pages without understanding them. Teachers taught to the test, because one standardized test decided our future. That's why almost everyone in my class paid for private tutoring, which many families can't afford. I believe the whole system should be overhauled, not just changed a little. Exams should be designed to test understanding, and teachers must be paid enough to focus on their classes. Vocational training should also be respected; in Egypt, people often look down on technical schools, but countries like Germany depend on them. If these reforms were introduced, the dropout rate would fall, and students would be more well-rounded.",
    },
    `
n | curriculum | All the subjects taught in a school, or the content of one subject. | The new curriculum includes more English and computer science.
n | rote learning | Learning by repeating something until you remember it, without understanding it. | Rote learning helped me pass exams, but I forgot everything later.
n | standardized test | An exam that all students take in the same way, so that their results can be compared. | The SAT is a standardized test used by American colleges.
n | private tutoring | Lessons that students pay for outside school, alone or in a small group. | My parents spent more on private tutoring than on school fees.
adj | overcrowded | Having too many people in it. | Overcrowded classrooms make it hard for teachers to help every student.
n | reform | A change that is made to improve a system. | The education reform cut the number of exams.
n | vocational training | Training that teaches the skills for a particular job, such as electrician or nurse. | Vocational training can lead to a well-paid job without a degree.
n | public school | A free school paid for by the government (in British English, a public school is a private school). | I went to a public school with sixty students in each class.
adj | well-rounded | Having a wide range of skills and experiences, not only good grades. | Sports and art help children become well-rounded.
n | dropout rate | The percentage of students who leave school before finishing. | The dropout rate is higher in rural areas.
v | overhaul | To change a system completely in order to improve it. | The ministry plans to overhaul the exam system.
pv | look down on | To think that you are better than someone or something. | Some people look down on technical schools.
i | teach to the test | To teach only what will be on an exam, not the wider subject. | Our teacher taught to the test, so we never discussed anything interesting.
`
  ),
  pack(
    {
      id: 'future-of-society',
      group: 'society',
      title: 'The Future of Society',
      description: 'Imagine life in thirty years: technology, families, cities and what we might lose.',
      level: 'C1',
      emoji: '🔭',
      warmUp: [
        'What do you think your city will look like in thirty years?',
        'Which invention would you most like to see in your lifetime?',
      ],
      grammar: {
        title: 'Unlikely futures: If … were to …, If … should …',
        points: [
          { form: 'If + subject + were to + base verb, would', use: 'A future that is possible but unlikely or imaginary (more formal than if + past simple).', example: 'If robots were to do all our jobs, how would we earn money?' },
          { form: 'If + subject + should + base verb, will or imperative', use: 'A possible but not very likely situation; formal.', example: 'If the internet should go down for a week, life will stop.' },
          { form: 'Were + subject + to + base verb, would', use: 'The same, very formal, without if.', example: 'Were governments to ban social media, people would find another way to connect.' },
          { form: 'Should + subject + base verb, …', use: 'Formal, without if (in letters and instructions).', example: 'Should you need any help, please call us.' },
        ],
        tip: 'In formal English, use were for every subject: “If the population were to double…”, not “was to double”.',
      },
      discussion: [
        'Will virtual reality bring people closer or make them lonelier?',
        'Is the future more likely to be utopian or dystopian? Why?',
        'How will an aging population change countries like Japan, and one day Egypt?',
        'If life expectancy were to reach 120, how would work and family change?',
        'Should everyone do a digital detox once a year?',
        'Which jobs or habits do you think will be phased out first?',
        'Why is loneliness growing in a world that is so interconnected?',
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
        "Nobody can foresee the future, but it's fun to imagine life in 2060. Life expectancy will probably be higher, so we'll have an aging population, even in a young country like Egypt. Gasoline cars will be phased out, and we'll travel in electric buses or even flying taxis. Virtual reality might replace classrooms and offices, so we'll be more interconnected than ever. But I worry about loneliness: if everyone were to live inside a headset, who would visit their grandparents? Some films show a dystopian world controlled by machines, while others show a utopian one where nobody has to work. One trend gives me hope: more young people are taking a digital detox every summer. Only time will tell, but I hope it won't be a brave new world without human warmth.",
    },
    `
n | virtual reality | A computer world that looks real, which you can see and move in by wearing a special headset. | In virtual reality, you can walk around ancient Thebes.
n | life expectancy | The number of years that a person is expected to live. | Life expectancy in Egypt is about 72 years.
adj | dystopian | Describing an imaginary society where everything is very bad, often because of technology or a cruel government. | The novel describes a dystopian future where people can't think for themselves.
adj | utopian | Describing an imaginary perfect society, or ideas that are too perfect to be possible. | A world without war sounds utopian.
n | loneliness | The sad feeling of being alone or having no friends. | Loneliness is a growing problem among older people.
n | digital detox | A period when you stop using phones, computers and social media. | I did a weekend digital detox in Fayoum, and I slept so well.
adj | interconnected | Connected with each other, so that each part affects the others. | In an interconnected world, a crisis in one country affects everyone.
n | aging population | A population in which the number of old people is growing compared with young people. | Japan's aging population means there are fewer workers for each retired person.
n | trend | A general change or development in the way people behave or think. | Working from home became a global trend after 2020.
v | foresee | To know or guess that something will happen in the future. | Nobody foresaw how fast AI would change our jobs.
pv | phase out | To stop using something gradually over a period of time. | Many countries plan to phase out gasoline cars by 2035.
i | only time will tell | We will know the answer to something only in the future. | Will the new city be a success? Only time will tell.
i | brave new world | A new situation or period, often one that people feel uncertain or worried about. | Self-driving cars on our streets? It's a brave new world.
`
  ),
];
