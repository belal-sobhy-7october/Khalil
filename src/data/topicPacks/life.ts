/** Daily-life topics, built with the course method (see ./types.ts). */
import { pack, type TopicPack } from './types';

export const LIFE_PACKS: TopicPack[] = [
  pack(
    {
      id: 'travel',
      group: 'life',
      title: 'Travel & Airport',
      description: 'Plan trips, talk about places and dream about where you would go.',
      level: 'B1',
      emoji: '✈️',
      warmUp: [
        'What is the best trip you have ever taken?',
        'Do you prefer planning every detail of a trip or being spontaneous?',
      ],
      grammar: {
        title: 'First and second conditionals',
        points: [
          { form: 'If + present simple, will + base verb', use: 'A real possibility in the future.', example: 'If we book early, we’ll pay less.' },
          { form: 'If + past simple, would + base verb', use: 'An imaginary or unlikely situation.', example: 'If I had more money, I would travel around the world.' },
          { form: 'If I were you, I’d + base verb', use: 'Giving advice.', example: 'If I were you, I’d avoid the summer crowds.' },
        ],
        tip: 'Never put “will” or “would” in the “if” part: “If I have time”, not “If I will have time”.',
      },
      discussion: [
        'If you could travel anywhere tomorrow, where would you go?',
        'Do you prefer luxury hotels or budget travel?',
        'Is it better to plan an itinerary or explore without a plan?',
        'Why do people buy souvenirs? Do you?',
        'Should tourists always try the local cuisine?',
        'How do you deal with jet lag?',
      ],
      task: {
        prompt: 'Describe your dream trip.',
        points: [
          'The destination and your itinerary',
          'Where you would stay and your budget',
          'What you would do there (second conditional)',
          'One real plan for next year (first conditional)',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "If I had two free weeks, I would travel to Japan. I'd plan a simple itinerary: Tokyo, Kyoto and a small village off the beaten track. I'd look for budget travel options and cheap accommodation near the stations. The flight has a long layover in Dubai, and I'm sure the jet lag would be terrible. But the views must be breathtaking, and I'd spend every day sightseeing and trying the local cuisine. Next year, if I save enough, I'll set off for my first trip to Asia — and I'll bring back a souvenir for everyone.",
    },
    `
n | itinerary | A plan of a journey, including the places you will visit and when. | Our itinerary includes three days in Luxor and two in Aswan.
n | layover | A short stop between two flights on a long journey. | We had a six-hour layover in Dubai.
n | accommodation | A place to stay, such as a hotel or an apartment. | Accommodation in the city centre is very expensive.
n | destination | The place someone is travelling to. | Sharm El Sheikh is a popular holiday destination.
n | sightseeing | Visiting interesting places as a tourist. | We spent the whole day sightseeing in Istanbul.
n | jet lag | Feeling tired and confused after a long flight to a different time zone. | I couldn't sleep for two days because of jet lag.
adj | breathtaking | Extremely beautiful or impressive. | The view from the mountain was breathtaking.
n | souvenir | Something you buy or keep to remember a place you visited. | I brought back a small souvenir from Paris.
n | budget travel | Travelling in a cheap way, spending as little money as possible. | Hostels and buses make budget travel easy.
n | local cuisine | The typical food of a place. | Trying the local cuisine is my favourite part of travelling.
pv | set off | To start a journey. | We set off at 5 a.m. to avoid the traffic.
i | off the beaten track | Far away from the places most tourists visit. | We found a lovely village off the beaten track.
`
  ),
  pack(
    {
      id: 'restaurant-and-food',
      group: 'life',
      title: 'Restaurant & Food',
      description: 'Talk about dishes, taste and eating out.',
      level: 'B1',
      emoji: '🍽️',
      warmUp: [
        'Which dish reminds you of home?',
        'Would you rather cook at home or eat out? Why?',
      ],
      grammar: {
        title: 'Quantifiers with countable and uncountable nouns',
        points: [
          { form: 'a few / many + plural countable', use: 'Things you can count.', example: 'We ordered a few dishes to share.' },
          { form: 'a little / much + uncountable', use: 'Things you can’t count.', example: 'Add a little salt.' },
          { form: 'a lot of / plenty of + both', use: 'A large amount of anything.', example: 'There were plenty of vegetarian options.' },
          { form: 'too much / too many / not enough', use: 'More or less than you want.', example: 'There was too much oil and not enough spice.' },
        ],
        tip: '“Much” is unusual in positive sentences: say “a lot of food”, not “much food”.',
      },
      discussion: [
        'What is the most mouth-watering dish in your country’s cuisine?',
        'Is it rude to leave food on your plate?',
        'Should restaurants serve smaller portions to reduce waste?',
        'Would you ever become vegetarian? Why or why not?',
        'What do you do with leftovers?',
        'Do you prefer trying new dishes or ordering what you know?',
      ],
      task: {
        prompt: 'Describe your favourite dish.',
        points: [
          'Its main ingredients (a few / a little / plenty of)',
          'How it tastes',
          'Where you usually have it — at home or eating out',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "On Fridays, we usually eat out. Last week, I made a reservation at a small Lebanese restaurant. Their cuisine is simple, but the ingredients are always fresh. We ordered a few savoury starters and a little hummus to share. The grilled chicken looked mouth-watering, and the portions were huge. My friend is vegetarian, and luckily there were plenty of options for her. The soup was a bit bland, but everything else was perfect. We couldn't finish, so we took the leftovers home. Next time, we'll just grab a bite before the cinema.",
    },
    `
n | cuisine | A style of cooking, especially of a particular country or region. | Egyptian cuisine uses a lot of beans and spices.
adj | bland | Having very little flavour. | The soup was bland, so I added some salt.
adj | savoury | Salty or spicy rather than sweet. | I prefer savoury snacks to sweet ones.
n | portion | The amount of food served to one person. | The portions here are huge.
n | ingredient | One of the foods that are used to make a dish. | Fresh ingredients make all the difference.
n | appetite | The feeling that you want to eat. | Stress makes me lose my appetite.
adj | vegetarian | Not eating meat or fish. | Do you have any vegetarian dishes?
n | leftovers | Food that remains after a meal. | We took the leftovers home.
n | reservation | An arrangement to keep a table for you at a restaurant. | I'd like to make a reservation for four at 8 p.m.
adj | mouth-watering | Looking or smelling so good that you want to eat it immediately. | The bakery was full of mouth-watering cakes.
pv | eat out | To eat at a restaurant instead of at home. | We eat out every Friday.
i | grab a bite | To eat something quickly. | Let's grab a bite before the movie.
`
  ),
  pack(
    {
      id: 'health',
      group: 'life',
      title: 'Health & The Doctor',
      description: 'Describe symptoms, understand the doctor and talk about a healthy lifestyle.',
      level: 'B1',
      emoji: '🩺',
      warmUp: [
        'What do you do to stay healthy during a busy week?',
        'Do you go to the doctor quickly, or do you wait until it is serious?',
      ],
      grammar: {
        title: 'Advice and obligation',
        points: [
          { form: 'should / ought to + base verb', use: 'Advice.', example: 'You should drink more water.' },
          { form: 'have to / must + base verb', use: 'Necessity or a rule.', example: 'You have to take this medicine twice a day.' },
          { form: 'don’t have to + base verb', use: 'Not necessary (you can if you want).', example: 'You don’t have to see a doctor for a small cold.' },
          { form: 'mustn’t + base verb', use: 'Not allowed — very important not to do it.', example: 'You mustn’t take more than two tablets.' },
        ],
        tip: '“Don’t have to” and “mustn’t” are very different: “don’t have to” = no need; “mustn’t” = don’t do it!',
      },
      discussion: [
        'Is a sedentary lifestyle the biggest health problem today?',
        'Should people take medicine for every small symptom?',
        'How does stress affect your immune system?',
        'Is mental well-being as important as physical health?',
        'How often should people have a check-up?',
        'Which healthy habit do you need to work on?',
      ],
      task: {
        prompt: 'Give advice to a friend who sits at a desk all day.',
        points: [
          'Describe the problem and the symptoms',
          'Advice with should / have to / don’t have to',
          'Something about nutrition and exercise',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last month, I came down with a bad cold. The symptoms were a sore throat and a high fever, and I felt under the weather for a week. The doctor said my immune system was weak because of stress and poor nutrition. She gave me a prescription and told me one side effect was feeling sleepy. She also said my sedentary lifestyle could cause chronic back pain, so I should walk every day. It took me ten days to recover. Now I go for a check-up every year, because well-being is more important than work.",
    },
    `
n | symptom | A sign of an illness that you feel or notice. | Fever and a sore throat are common symptoms of the flu.
n | prescription | A doctor's written order for medicine. | You need a prescription to buy this medicine.
n | side effect | An unwanted effect of a medicine, in addition to the one intended. | One side effect of this medicine is feeling sleepy.
adj | sedentary | Involving a lot of sitting and very little exercise. | Office workers often have a sedentary lifestyle.
n | nutrition | The food you eat and the way it affects your health. | Good nutrition is important for students.
n | immune system | The parts of the body that fight infection and disease. | Sleep helps your immune system stay strong.
adj | chronic | (of an illness or pain) Lasting a long time or coming back again and again. | She has chronic back pain from sitting all day.
v | recover | To become healthy again after an illness or injury. | It took me two weeks to recover from the flu.
n | check-up | A general medical examination to check that you are healthy. | I go for a check-up once a year.
n | well-being | The state of feeling healthy, comfortable and happy. | Exercise is good for your mental well-being.
pv | come down with | To start to have an illness, usually not a serious one. | I think I'm coming down with a cold.
i | under the weather | Feeling a little ill. | I'm feeling a bit under the weather today.
`
  ),
  pack(
    {
      id: 'social-media',
      group: 'life',
      title: 'Social Media & Technology',
      description: 'Apps, screen time and life online — and how to describe things with relative clauses.',
      level: 'B2',
      emoji: '📱',
      warmUp: [
        'Which app do you open first in the morning?',
        'Could you live without social media for a month?',
      ],
      grammar: {
        title: 'Relative clauses',
        points: [
          { form: 'who / that', use: 'For people.', example: 'An influencer is a person who promotes products online.' },
          { form: 'which / that', use: 'For things.', example: 'It’s an app that shows short videos.' },
          { form: 'whose + noun', use: 'Possession.', example: 'She’s the creator whose video went viral.' },
          { form: ', which … ,', use: 'Extra information (with commas; never “that”).', example: 'TikTok, which is very addictive, is popular with teenagers.' },
        ],
        tip: 'Don’t repeat the subject: “the app that I use”, not “the app that I use it”.',
      },
      discussion: [
        'How much screen time is too much?',
        'Should influencers be responsible for the products they promote?',
        'How can we stop misinformation from going viral?',
        'Who should protect children from cyberbullying — parents, schools or the apps?',
        'Do algorithms control what we think?',
        'What would happen if you logged off social media for a week?',
      ],
      task: {
        prompt: 'Describe an app you use every day.',
        points: [
          'What it is and what it does (relative clauses)',
          'Why it is useful — or addictive',
          'Your screen time',
          'One change you want to make',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I'm quite tech-savvy, but I have to admit that social media is addictive. My screen time is almost six hours a day. The algorithm knows exactly which videos I like, so I stay glued to the screen for hours. I follow an influencer whose videos are funny, but I've also seen a lot of misinformation that went viral. Last month, I changed my privacy settings, turned off most notifications and started to log off at ten p.m. I also talked to my little brother about cyberbullying, which is a real problem at his school.",
    },
    `
n | notification | A message on your phone or computer that tells you something has happened. | I turned off notifications so that I can focus.
adj | addictive | Making you want to do or use it more and more, so that it is hard to stop. | Social media apps are designed to be addictive.
n | screen time | The amount of time you spend looking at a phone, computer or TV screen. | My screen time is over six hours a day.
n | privacy settings | The options that control who can see your information online. | Check your privacy settings before you post photos.
n | influencer | A person who is paid by companies to show products to their many followers on social media. | The influencer promoted a new phone to her followers.
adj | viral | Spreading very quickly to a lot of people on the internet. | His video went viral overnight.
n | misinformation | Wrong information, especially when people spread it without knowing it is wrong. | Misinformation spreads faster than the truth online.
n | cyberbullying | Using the internet to hurt, frighten or embarrass someone, especially a young person. | Schools should teach children how to report cyberbullying.
n | algorithm | A set of rules a computer uses to decide things, for example what you see on social media. | The algorithm shows me videos similar to the ones I like.
adj | tech-savvy | Knowing a lot about modern technology and how to use it. | My grandfather is surprisingly tech-savvy.
pv | log off | To stop using a computer system, website or app. | I log off social media at 10 p.m.
i | glued to the screen | Watching or using a screen with all your attention for a long time. | The kids were glued to the screen all afternoon.
`
  ),
];
