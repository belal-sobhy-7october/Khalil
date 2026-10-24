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
n | accommodation | A place to stay, such as a hotel or an apartment. | Accommodation in the city center is very expensive.
n | destination | The place someone is traveling to. | Sharm El Sheikh is a popular vacation destination.
n | sightseeing | Visiting interesting places as a tourist. | We spent the whole day sightseeing in Istanbul.
n | jet lag | Feeling tired and confused after a long flight to a different time zone. | I couldn't sleep for two days because of jet lag.
adj | breathtaking | Extremely beautiful or impressive. | The view from the mountain was breathtaking.
n | souvenir | Something you buy or keep to remember a place you visited. | I brought back a small souvenir from Paris.
n | budget travel | Traveling in a cheap way, spending as little money as possible. | Hostels and buses make budget travel easy.
n | local cuisine | The typical food of a place. | Trying the local cuisine is my favorite part of traveling.
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
        prompt: 'Describe your favorite dish.',
        points: [
          'Its main ingredients (a few / a little / plenty of)',
          'How it tastes',
          'Where you usually have it — at home or eating out',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "On Fridays, we usually eat out. Last week, I made a reservation at a small Lebanese restaurant. Their cuisine is simple, but the ingredients are always fresh. We ordered a few savory starters and a little hummus to share. The grilled chicken looked mouth-watering, and the portions were huge. My friend is vegetarian, and luckily there were plenty of options for her. The soup was a bit bland, but everything else was perfect. We couldn't finish, so we took the leftovers home. Next time, we'll just grab a bite before the movie.",
    },
    `
n | cuisine | A style of cooking, especially of a particular country or region. | Egyptian cuisine uses a lot of beans and spices.
adj | bland | Having very little flavor. | The soup was bland, so I added some salt.
adj | savory | Salty or spicy rather than sweet. | I prefer savory snacks to sweet ones.
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
  pack(
    {
      id: 'city-vs-countryside',
      group: 'life',
      title: 'City Life vs Countryside',
      description: 'Compare a big city with a quiet village, and say where you would rather live.',
      level: 'B2',
      emoji: '🏙️',
      warmUp: [
        'Would you rather live in the middle of Cairo or in a quiet village?',
        'What do you like most and least about your neighborhood?',
      ],
      grammar: {
        title: 'Preferences: would rather, prefer, would prefer',
        points: [
          { form: 'would rather + base verb (+ than …)', use: 'What you want in a particular situation.', example: 'I’d rather live in a village than in a crowded city.' },
          { form: 'prefer + V-ing / noun + to …', use: 'General preferences.', example: 'I prefer walking to driving.' },
          { form: 'would prefer + to + verb', use: 'A specific preference, like “would rather”.', example: 'I’d prefer to stay in tonight.' },
          { form: 'would rather + someone + past simple', use: 'What you want someone else to do.', example: 'I’d rather you didn’t smoke in the car.' },
        ],
        tip: 'No “to” after “would rather”: “I’d rather stay”, not “I’d rather to stay”.',
      },
      discussion: [
        'Would you rather raise children in a city or in the countryside? Why?',
        'How does rush hour affect your daily life?',
        'Which amenities matter most to you when you choose where to live?',
        'Are the opportunities in a big city worth the high cost of living?',
        'Will more people move to rural areas because of remote work?',
        'Where do you go to get away from the hustle and bustle?',
      ],
      task: {
        prompt: 'City or countryside: where would you rather live, and why?',
        points: [
          'Two advantages of city life',
          'Two advantages of the countryside',
          'Your preference, with “would rather” or “prefer”',
          'Where you would like to live in ten years',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I've lived in Cairo all my life, and I love the hustle and bustle. The city is vibrant, the nightlife is great, and all the amenities are close to my home. But it's crowded, the pollution is bad, and in rush hour a short trip can take two hours. The cost of living is also rising every year. My grandparents live in a rural village where there's real peace and quiet. When I need to get away from the noise, I visit them. Still, I'd rather live in the city now and move somewhere quieter when I'm older.",
    },
    `
adj | crowded | Full of people. | The metro is so crowded in the morning that you can't move.
n | rush hour | The time of day when roads and trains are busiest because people are traveling to or from work. | I try not to drive during rush hour.
n | pollution | Dirty air, water or land, caused by people. | Air pollution in big cities causes breathing problems.
n | cost of living | The amount of money you need for basic things such as food, rent and transport. | The cost of living in the capital keeps rising.
adj | rural | Connected with the countryside, not with towns. | Many rural areas still don't have good internet.
adj | urban | Connected with towns and cities. | Urban life is fast and noisy.
n | peace and quiet | A calm situation without noise or worry. | I go to my grandfather's farm for some peace and quiet.
n | amenities | Useful places and services in an area, such as shops, hospitals and parks. | The new area has good amenities, including a hospital and a mall.
adj | vibrant | Full of energy and activity. | Downtown Cairo is vibrant at night.
n | nightlife | Places to go and things to do in the evening, such as restaurants and cafés. | Alexandria has great nightlife in the summer.
adj | remote | Far away from towns and other people. | They live in a remote village with one small shop.
pv | get away from | To escape from a place or a situation for a while. | We go to the Red Sea to get away from the noise of the city.
i | the hustle and bustle | The noise and busy activity of a crowded place. | I love the hustle and bustle of Khan el-Khalili.
`
  ),
  pack(
    {
      id: 'home-and-neighbours',
      group: 'life',
      title: 'Home & Neighbors',
      description: 'Rent or buy, describe your apartment, get things fixed and deal with noisy neighbors.',
      level: 'B1',
      emoji: '🏠',
      warmUp: [
        'Describe the home you live in now in three words.',
        'Do you know your neighbors well?',
      ],
      grammar: {
        title: 'have / get something done',
        points: [
          { form: 'have + object + V3', use: 'Someone else does a job for you (you arrange it or pay for it).', example: 'We had the kitchen painted last month.' },
          { form: 'get + object + V3', use: 'The same idea, more informal.', example: 'I need to get the air conditioner fixed before the summer.' },
          { form: 'have + object + V3 (a bad experience)', use: 'Something bad that someone did to you.', example: 'We had our car stolen outside the building.' },
        ],
        tip: '“I fixed the sink” means you did it yourself; “I had the sink fixed” means someone did it for you.',
      },
      discussion: [
        'Is it better to rent or to buy an apartment today? Why?',
        'What makes a good landlord, and what makes a good tenant?',
        'What would you have done to your home if you had the money?',
        'Have you ever had a problem with noisy neighbors? What did you do?',
        'Which is more important: a spacious apartment or a good neighborhood?',
        'What do you do to make guests feel at home?',
      ],
      task: {
        prompt: 'Describe your dream home.',
        points: [
          'Where it is and what the neighborhood is like',
          'The rooms, and how spacious it is',
          'Two things you would have done to it (have something done)',
          'What your neighbors would be like',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last month, we moved into a new apartment in a quiet neighborhood. It's spacious and bright, but it isn't furnished, so we've spent a lot on furniture. Our landlord is very kind. When we found a leak in the bathroom, he had it fixed the next day. We paid a deposit of two months' rent, and the maintenance fees are reasonable. Next year, we're going to have the kitchen renovated. Our neighbors aren't noisy at all. On our first day, they brought us dinner and told us to make ourselves at home.",
    },
    `
n | landlord | A person who owns an apartment or a house and rents it to other people. | My landlord wants to raise the rent again.
n | tenant | A person who pays rent to live in an apartment or a house. | The tenants upstairs are always moving furniture at night.
n | rent | The money you pay regularly to live in a place that you don't own. | Rent is cheaper outside the city center.
n | deposit | Money you pay when you start renting, which you get back if you don't damage anything. | We paid two months' rent as a deposit.
adj | furnished | (Of an apartment or house) already having furniture in it. | We rented a furnished apartment, so we didn't need to buy anything.
adj | spacious | Large, with a lot of space inside. | The living room is bright and spacious.
n | neighborhood | An area of a town and the people who live there. | It's a quiet neighborhood with lots of trees.
n | maintenance | The work of keeping a building in good condition. | The building's maintenance fees went up this year.
n | leak | A hole or crack that lets water or gas escape. | There's a leak under the kitchen sink.
v | renovate | To repair and improve an old building or room. | They renovated the old apartment and doubled its price.
adj | noisy | Making a lot of loud or annoying sound. | Our neighbors are noisy, especially on weekends.
pv | move in | To start living in a new home. | We moved in last week, and we're still unpacking.
i | make yourself at home | Used to tell a guest to relax and feel comfortable. | Come in, sit down and make yourself at home!
`
  ),
  pack(
    {
      id: 'transport-and-traffic',
      group: 'life',
      title: 'Transport & Traffic',
      description: 'Getting around, traffic jams, public transportation and guessing what happened on the road.',
      level: 'B1',
      emoji: '🚗',
      warmUp: [
        'How do you usually get to work or to university?',
        'What is the worst traffic jam you have ever been in?',
      ],
      grammar: {
        title: 'Guessing: must, might, can’t (present and past)',
        points: [
          { form: 'must + base verb / must be + V-ing', use: 'You are almost sure something is true now.', example: 'The road is closed. There must be an accident.' },
          { form: 'might / could + base verb', use: 'It is possible.', example: 'Take an umbrella; it might rain later.' },
          { form: 'can’t + base verb', use: 'You are sure something isn’t true.', example: 'He can’t be stuck in traffic; he left two hours ago.' },
          { form: 'must have / might have / can’t have + V3', use: 'Guessing about the past.', example: 'She must have missed the bus; she isn’t here yet.' },
        ],
        tip: 'The opposite of “must” (sure it is true) is “can’t” (sure it isn’t), not “mustn’t”.',
      },
      discussion: [
        'What is the best way to get around your city?',
        'Should public transportation be free? Who would pay for it?',
        'Are ride-hailing apps better than normal taxis? Why?',
        'What makes driving in your city stressful?',
        'Have you ever had a breakdown on the road? What happened?',
        'How could the government reduce traffic jams?',
      ],
      task: {
        prompt: 'Tell the story of a difficult journey.',
        points: [
          'Where you were going, and how',
          'What went wrong',
          'One guess about what had happened (must have / might have)',
          'How it ended',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last Thursday, I was going to the airport to catch an early flight. I ordered a car on a ride-hailing app, but we got stuck in a terrible traffic jam on the ring road. Nothing was moving. There must have been an accident ahead. Then a police officer told us to pull over, because a truck had broken down in the middle of the road. My driver said we might miss the flight, so he took a different road and drove right at the speed limit. We reached the airport in the nick of time.",
    },
    `
n | traffic jam | A long line of vehicles that can't move or are moving very slowly. | We were stuck in a traffic jam for two hours on the ring road.
n | public transportation | Buses, trains and the metro that everyone can use. | Cairo's public transportation is cheap but very crowded.
n | commuter | A person who travels regularly between home and work. | Thousands of commuters use the metro every morning.
n | fare | The money you pay for a journey by bus, train or taxi. | The metro fare went up last year.
n | pedestrian | A person who is walking, not driving or riding. | Drivers must stop for pedestrians at crossings.
n | speed limit | The fastest speed you are allowed to drive on a road. | The speed limit on this road is 80 kilometers an hour.
n | driver's license | An official document that shows you are allowed to drive. | I got my driver's license when I was eighteen.
n | ride-hailing app | A phone app you use to order a car and a driver. | I use a ride-hailing app when I'm late.
adj | stuck | Unable to move. | Sorry, I'm stuck in traffic. I'll be twenty minutes late.
n | breakdown | An occasion when a vehicle stops working. | We had a breakdown on the desert road at midnight.
v | overtake | To go past a slower vehicle on the road. | Never overtake on a bend.
pv | pull over | To move a vehicle to the side of the road and stop. | The police officer asked me to pull over.
i | in the nick of time | Just in time; at the last possible moment. | We reached the airport in the nick of time.
`
  ),
  pack(
    {
      id: 'sports-and-fitness',
      group: 'life',
      title: 'Sports & Fitness',
      description: 'Exercise, the sports you play or watch and how you stay motivated.',
      level: 'B1',
      emoji: '⚽',
      warmUp: [
        'Do you play any sports, or do you prefer to watch them?',
        'What do you do to stay fit?',
      ],
      grammar: {
        title: 'Ability: can, could, be able to, manage to',
        points: [
          { form: 'can / can’t + base verb', use: 'Ability now.', example: 'I can swim, but I can’t dive.' },
          { form: 'could / couldn’t + base verb', use: 'General ability in the past.', example: 'When I was ten, I could run for hours.' },
          { form: 'was able to / managed to + verb', use: 'Success in one particular situation in the past.', example: 'It was hard, but I managed to finish the race.' },
          { form: 'will be able to + verb', use: 'Ability in the future (there is no “will can”).', example: 'If I train every day, I’ll be able to run 10 km by June.' },
        ],
        tip: 'For one specific success, use “managed to” or “was able to”, not “could”: “I managed to win the match.”',
      },
      discussion: [
        'Which sport is the most popular in your country, and why?',
        'Do you prefer working out alone or playing a team sport?',
        'Are you competitive? In what situations?',
        'Have you ever had a sports injury? What happened?',
        'Should children have to do sport at school?',
        'Do you agree with “no pain, no gain”? Can exercise be fun without pain?',
      ],
      task: {
        prompt: 'Talk about sport and exercise in your life.',
        points: [
          'What you could do as a child',
          'What you can do now',
          'Something you managed to do that you are proud of',
          'What you will be able to do if you keep training',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "When I was a child, I could play football for hours, but in college I stopped exercising and lost my stamina. Last year I decided to get fit again. Now I work out three times a week. I always start with a warm-up and stretch for ten minutes, because I don't want another knee injury. At first I couldn't run more than one kilometer, but last month I managed to run five without stopping, a new personal best! I'm quite competitive, so now I'm training for a race. No pain, no gain.",
    },
    `
n | workout | A period of physical exercise. | I do a 30-minute workout every morning.
adj | fit | Healthy and strong, especially because of regular exercise. | Swimming keeps my father fit at seventy.
n | stamina | The physical strength to keep doing something for a long time. | Running every day improved my stamina.
n | injury | Damage to the body, for example in an accident or while playing sport. | He missed the whole season because of a knee injury.
v | stretch | To make your muscles longer by reaching out your arms or legs. | Always stretch before you run.
n | warm-up | Gentle exercise to prepare your body for harder exercise. | Never skip the warm-up before a match.
n | opponent | A person or team that you play against. | Our opponents were much stronger than us.
v | compete | To take part in a competition and try to win. | She competes in national swimming championships.
n | referee | The official who controls a match and makes sure the players follow the rules. | The referee gave him a red card.
adj | competitive | Wanting very much to win or to be better than others. | My brother is so competitive that he hates losing at cards.
n | personal best | The best result someone has ever achieved in a sport. | I ran 5 km in 24 minutes: a new personal best!
pv | work out | To do physical exercise, especially at a gym. | I work out three times a week after work.
i | no pain, no gain | You have to work hard or suffer a little to achieve something. | My legs hurt after training, but no pain, no gain.
`
  ),
  pack(
    {
      id: 'hobbies-and-free-time',
      group: 'life',
      title: 'Hobbies & Free Time',
      description: 'How you relax, what you are into and how often you do it.',
      level: 'B1',
      emoji: '🎨',
      warmUp: [
        'What do you do to relax after a long day?',
        'Is there a hobby you have always wanted to try?',
      ],
      grammar: {
        title: 'How often: frequency adverbs and expressions',
        points: [
          { form: 'always / usually / often / sometimes / rarely / never', use: 'Before the main verb, but after “be”.', example: 'I usually read before bed. I am rarely bored.' },
          { form: 'every day / once a week / twice a month', use: 'Usually at the end of the sentence.', example: 'I go to the gym twice a week.' },
          { form: 'every other day / once in a while / now and then', use: 'Less regular frequency.', example: 'I play chess with my uncle once in a while.' },
        ],
        tip: 'Frequency adverbs go before the main verb but after “be”: “I often play”, “I am often tired”.',
      },
      discussion: [
        'What did you use to do in your spare time as a child?',
        'Is it important for adults to have a hobby? Why?',
        'Which hobbies are expensive, and which are free?',
        'Have you ever taken up a hobby and then given it up? Why?',
        'How do you usually kill time when you are waiting?',
        'Can a hobby become a job? Is that a good idea?',
      ],
      task: {
        prompt: 'Talk about a hobby you love or want to take up.',
        points: [
          'What it is and when you started',
          'How often you do it (frequency expressions)',
          'Why it is relaxing or creative for you',
          'Something you would like to try in the future',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "In my spare time, I'm really into photography. I took it up three years ago, when my uncle gave me his old camera. Now I go out to take photos every other weekend, usually early in the morning when the streets are empty. It's relaxing, and it lets me be creative. I'm also keen on board games, so once in a while I play with my cousins. I used to collect stamps, but I gave it up because it got boring. When I'm waiting at the doctor's, I kill time by editing my photos on my phone.",
    },
    `
n | hobby | An activity you do for pleasure in your free time. | Photography started as a hobby and became my job.
n | pastime | Something you do regularly for fun. | Fishing is a popular pastime along the Nile.
adj | relaxing | Making you feel calm and less worried. | Gardening is very relaxing after a busy week.
adj | creative | Using your imagination to make new things or ideas. | Painting lets me be creative.
n | craft | An activity in which you make things with your hands. | My sister sells her crafts online.
n | board game | A game played on a board, such as chess. | We play board games with the family on Friday nights.
n | spare time | Time when you are not working or studying. | What do you do in your spare time?
p | be keen on | To be very interested in something, or to like it a lot. | I'm keen on photography, especially street photography.
p | be into | To be very interested in an activity. | My son is really into video games these days.
n | collection | A group of objects of the same type that someone has collected. | He has a huge collection of old coins.
pv | take up | To start doing a new activity regularly. | I took up drawing during the lockdown.
pv | give up | To stop doing something you used to do. | I gave up the guitar because I didn't have time.
i | kill time | To do something while you are waiting so that the time passes more quickly. | I play games on my phone to kill time at the airport.
`
  ),
  pack(
    {
      id: 'ramadan-and-celebrations',
      group: 'life',
      title: 'Ramadan, Eid & Celebrations',
      description: 'Describe Ramadan, Eid, weddings and other celebrations: what people do, and when.',
      level: 'B1',
      emoji: '🌙',
      warmUp: [
        'What is your favorite time of the year, and why?',
        'How do you usually celebrate Eid?',
      ],
      grammar: {
        title: 'Time clauses: as soon as, until, while, before, after',
        points: [
          { form: 'as soon as + present', use: 'Immediately after something happens.', example: 'As soon as we hear the call to prayer, we break our fast.' },
          { form: 'until + present', use: 'Up to the moment something happens.', example: 'We stay up until it is time for suhoor.' },
          { form: 'while + clause / during + noun', use: 'At the same time as / in the period of.', example: 'While we are eating, my uncle tells stories. During Ramadan, the streets are full of lights.' },
          { form: 'before / after + V-ing or clause', use: 'The order of two actions.', example: 'After eating, we go out to see the lanterns.' },
        ],
        tip: 'After time words, use the present for the future, not “will”: “as soon as the sun sets”, not “as soon as the sun will set”.',
      },
      discussion: [
        'What do you love most about Ramadan?',
        'How has the way people celebrate Eid changed since you were a child?',
        'Is it better to celebrate with a big family or with a few close friends?',
        'Do people spend too much money on celebrations and weddings?',
        'Which celebration from another culture would you like to see?',
        'What do you look forward to most every year?',
      ],
      task: {
        prompt: 'Describe a typical day in Ramadan (or Eid) to a friend from another country.',
        points: [
          'What people do from suhoor until iftar',
          'Two time clauses (as soon as / until / while)',
          'The food and the decorations',
          'Your favorite tradition',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Ramadan is my favorite time of the year. The streets are full of lanterns and decorations, and there's a festive atmosphere every night. We fast from dawn until sunset, so we wake up early for suhoor. As soon as we hear the call to prayer at sunset, we break our fast with dates and water, and then we have a big iftar with the family. Many people donate food to those who need it. At the end of the month, we celebrate Eid with a feast. Everyone is welcome at my grandmother's table: the more the merrier.",
    },
    `
n | celebration | A special event or party for an important day or a success. | The wedding celebration lasted until 2 a.m.
v | fast | To eat and drink nothing for a period, especially for religious reasons. | Muslims fast from dawn until sunset during Ramadan.
n | iftar | The meal eaten after sunset to end the day's fast in Ramadan. | My grandmother invites the whole family for iftar on the first day.
n | suhoor | The meal eaten before dawn during Ramadan. | We have yogurt and beans for suhoor.
n | decorations | Things that make a place look attractive for a special occasion. | The streets are full of lanterns and colorful decorations.
n | lantern | A lamp with a cover, often used as a decoration in Ramadan. | My kids chose a new Ramadan lantern at the market.
v | celebrate | To do something enjoyable for a special day or event. | We celebrate Eid with a big family breakfast.
n | feast | A large special meal for many people. | On Eid al-Adha, families prepare a feast with meat.
v | donate | To give money or things to help people. | Many people donate food to poor families during Ramadan.
adj | festive | Happy and full of celebration. | The city has a festive atmosphere every night in Ramadan.
n | occasion | A special event or ceremony. | My mother wears her gold bracelet only on special occasions.
pv | look forward to | To feel happy and excited about something that is going to happen. | The kids look forward to Eid because relatives give them money.
i | the more the merrier | The more people there are, the more fun it is. | Can I bring my cousins to the iftar? Of course, the more the merrier!
`
  ),
  pack(
    {
      id: 'daily-routines',
      group: 'life',
      title: 'Daily Routines',
      description: 'Describe your day from the alarm clock to bedtime, on busy days and lazy ones.',
      level: 'B1',
      emoji: '⏰',
      warmUp: [
        'What time do you usually wake up on a workday?',
        'What is your favorite part of the day?',
      ],
      grammar: {
        title: 'Prepositions of time: at, on, in',
        points: [
          { form: 'at + a clock time, noon, night', use: 'Exact times and a few fixed expressions.', example: 'I wake up at 6:30 and go to bed at midnight.' },
          { form: 'on + a day or a date', use: 'Days, dates and (in American English) weekends.', example: 'I have English class on Mondays. · I sleep in on weekends.' },
          { form: 'in + a part of the day, a month, a year or a season', use: 'Longer periods.', example: 'I study in the morning. · My birthday is in July.' },
          { form: 'no preposition', use: 'Before every, this, next, last, today and tomorrow.', example: 'I go to the gym every day. · See you next Friday.' },
        ],
        tip: 'Say “in the morning” but “at night”, and “on Friday morning” (a specific day wins). Don’t say “in next week”.',
      },
      discussion: [
        'Are you a morning person or a night owl?',
        'What does your morning routine look like on a workday? And on Friday?',
        'How do you wind down in the evening?',
        'Do you oversleep often? What happens when you do?',
        'Is your day hectic or quiet? Which part is the busiest?',
        'When did you last burn the midnight oil, and why?',
        'Do you eat a proper lunch at work, or do you skip your lunch break?',
      ],
      task: {
        prompt: 'Describe a typical weekday and a typical Friday.',
        points: [
          'When you get up and go to bed (at, on, in)',
          'What you do in the morning, the afternoon and the evening',
          'The most hectic part of your day',
          'How your Friday is different',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I'm not a morning person, so my alarm clock is my worst enemy. On weekdays, it rings at 6:15, and I'm groggy for the first half hour. I've overslept twice this month, but I'm usually punctual because I hate being late. My mornings are hectic: I'm at my desk at eight, and I have meetings until my lunch break at one. The rest of my week runs like clockwork: the gym on Sundays and Wednesdays, English in the evening. At night, I wind down with tea and a short episode of a show. My bedtime is eleven, but during exams I burn the midnight oil. On Fridays, I sleep in until ten, and nobody is allowed to wake me up.",
    },
    `
n | alarm clock | A clock that makes a noise to wake you up at a set time. | I put my alarm clock across the room, so I have to get up to turn it off.
v | oversleep | To sleep longer than you planned and wake up late. | I overslept and missed the first bus.
adj | punctual | Arriving or doing something at the agreed time, not late. | Our manager is very punctual; meetings start at exactly nine.
n | lunch break | The time in the middle of a workday when you stop to eat. | I take a 30-minute lunch break at one o'clock.
adj | hectic | Very busy, with a lot of things happening quickly. | Mondays are always hectic at the call center.
n | bedtime | The time when you usually go to bed. | My kids' bedtime is nine, but they're never asleep before ten.
pv | sleep in | To sleep later than usual in the morning, on purpose. | I always sleep in on Fridays.
pv | wind down | To relax after a busy or stressful time. | I wind down by reading for half an hour before bed.
n | morning person | Someone who feels most awake and active early in the day. | I'm a morning person; I do my best work before ten.
n | night owl | Someone who enjoys staying awake late at night. | My brother is a night owl; he plays video games until three in the morning.
i | like clockwork | Regularly and exactly as planned, without problems. | My father leaves for work at 7:10 every day, like clockwork.
i | burn the midnight oil | To work or study until very late at night. | I burned the midnight oil to finish the report.
adj | groggy | Weak and unable to think clearly, especially after waking up. | I feel groggy until I've had my coffee.
`
  ),
  pack(
    {
      id: 'video-games',
      group: 'life',
      title: 'Video Games & Digital Entertainment',
      description: 'Talk about the games you play, gaming online and how much screen time is too much.',
      level: 'B1',
      emoji: '🎮',
      warmUp: [
        'What was the first video game you ever played?',
        'Do you play games on a phone, a console or a computer?',
      ],
      grammar: {
        title: 'Adjective + preposition: good at, addicted to, bored with',
        points: [
          { form: 'good at · bad at + noun or V-ing', use: 'Talking about skills.', example: 'I’m good at strategy games but bad at racing.' },
          { form: 'addicted to · obsessed with + noun or V-ing', use: 'Talking about something you can’t stop doing.', example: 'My brother is addicted to soccer games.' },
          { form: 'interested in · excited about · bored with', use: 'Talking about feelings.', example: 'I got bored with the game after a week.' },
          { form: 'afraid of · proud of · tired of', use: 'More feelings, all with of.', example: 'I’m tired of losing to my little cousin.' },
        ],
        tip: 'After a preposition, use the -ing form: “I’m good at building”, not “good at build”, and not “good in”.',
      },
      discussion: [
        'What kind of games are you good at, and which ones are you bad at?',
        'Are in-game purchases fair, or do they take advantage of young players?',
        'Is esports a real sport? Why or why not?',
        'Do you prefer multiplayer games or playing alone?',
        'How do you know when someone is addicted to gaming?',
        'Should parents limit children’s game time? How much is enough?',
        'Have you ever lost track of time while playing? What happened?',
      ],
      task: {
        prompt: 'Recommend a game (or an app) to a friend.',
        points: [
          'What kind of game it is',
          'What you’re good at in it, or bad at',
          'What makes it immersive (or boring)',
          'Whether it has in-game purchases',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I've been a gamer since I was eight, when my uncle gave me an old console. These days, I mostly play multiplayer games online with my friends from college. Last month, I got hooked on a new soccer game. The graphics are amazing, and it's so immersive that I lose track of time. My mother isn't interested in games at all, and she gets angry when I play until two in the morning. I'm good at the game now, and I've leveled up quickly without spending money on in-game purchases. One of my friends streams his games every night and wants to go pro in esports. For me, gaming is just a fun way to relax, not a job.",
    },
    `
n | gamer | A person who plays video games, especially often. | My sister is a serious gamer; she has three consoles.
n | console | A machine connected to a TV that you use to play video games. | We bought a new console for my son's birthday.
adj | multiplayer | Describing a game that several people play together, often online. | I prefer multiplayer games because I can play with friends.
pv | level up | To reach the next level in a game, with more skills or power. | I played all weekend to level up my character.
n | in-game purchase | Something you pay real money for inside a game. | My nephew spent 500 Egyptian pounds on in-game purchases without asking.
adj | immersive | Making you feel that you are really inside a world, a game or a story. | Virtual reality games are very immersive.
n | esports | Video games played as a professional competition, often with an audience. | There's a big esports tournament in Riyadh this year.
n | graphics | The pictures and images in a video game or on a screen. | The graphics in new games look almost real.
v | stream | To show yourself playing a game live on the internet so that others can watch. | He streams on YouTube every night, and 2,000 people watch him.
adj | hooked | Unable to stop doing or wanting something because you enjoy it so much. | I downloaded the game on Monday and was hooked by Wednesday.
i | game over | Said when something has ended, especially in a bad way. | When my father saw my grades, I knew it was game over for my PlayStation.
i | lose track of time | To forget what time it is because you are busy or enjoying yourself. | I lost track of time playing and missed my bus.
n | controller | The device you hold in your hands to play games on a console. | My controller broke, so I can't play tonight.
`
  ),
  pack(
    {
      id: 'football',
      group: 'life',
      title: 'Soccer & Supporting a Team',
      description: 'Talk about soccer (football outside the US), your team and the games you’ll never forget.',
      level: 'B1',
      emoji: '⚽',
      warmUp: [
        'Which team do you support, and why?',
        'Do you prefer watching games at home, in a café or at the stadium?',
      ],
      grammar: {
        title: 'almost, nearly and hardly',
        points: [
          { form: 'almost / nearly + verb or number', use: 'Very close to something, but not quite.', example: 'We almost won the cup. · The stadium was nearly full.' },
          { form: 'hardly + verb', use: 'Very little; almost not.', example: 'I could hardly breathe in the last minute. · I hardly watch the league these days.' },
          { form: 'hardly any · hardly ever', use: 'Almost no; almost never.', example: 'There were hardly any fans at the game. · He hardly ever scores.' },
          { form: 'almost never · almost no one', use: 'With negative words, use almost (not nearly).', example: 'Almost no one expected us to win.' },
        ],
        tip: 'hardly is already negative: say “I could hardly see”, not “I couldn’t hardly see”. And it isn’t the adverb of hard: “He worked hard” (a lot) is the opposite of “He hardly worked” (very little).',
      },
      discussion: [
        'Who is the best striker in the history of your league?',
        'Is the rivalry between Al Ahly and Zamalek good or bad for Egyptian soccer?',
        'Is it better to watch a big game at the stadium or at home? Why?',
        'Do you remember a penalty or a foul that changed a big game?',
        'Why do Americans say soccer, and what do you call the game?',
        'When your team ties an important game, are you disappointed or relieved?',
        'Is VAR making the game fairer, or does it feel like moving the goalposts?',
      ],
      task: {
        prompt: 'Describe a game you will never forget.',
        points: [
          'Who played and where you watched it',
          'What happened in the first and the second half',
          'A penalty, a foul or an equalizer',
          'How you felt at the end (almost, nearly, hardly)',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I've supported Al Ahly since I was a kid, and the rivalry with Zamalek is the biggest thing in my soccer life. Last season, I watched the big game with friends in a café, because getting into the stadium is almost impossible. We were losing 1–0, and I could hardly watch. Then our striker was fouled in the box, and the referee gave a penalty. Their goalkeeper nearly saved it, but the ball went in: an equalizer in the 89th minute! The game ended in a tie, but it felt like a win. A month later, a small team knocked us out of the cup, and I hardly slept that night. Watching the league is a whole new ball game now; even the small teams play well.",
    },
    `
n | soccer | The game in which two teams of eleven players kick a ball into a goal; it is called football outside the US. | Americans call our game soccer, because their football is a different sport.
n | league | A group of teams that play against each other to see which one is the best. | Al Ahly has won the Egyptian league more times than any other team.
n | striker | A player whose main job is to score goals. | Our team needs a new striker who can score goals.
n | goalkeeper | The player who stands in the goal and tries to stop the ball from going in. | The goalkeeper saved three shots in the first half.
n | penalty | A free kick at the goal from a spot close to it, given because of a foul. | He scored the penalty in the last minute.
n | foul | An action that is against the rules, such as kicking or pushing another player. | The referee didn't see the foul, and the fans were furious.
n | stadium | A large place with seats all around, where people watch sports. | Cairo International Stadium holds about 75,000 people.
n | rivalry | A long competition between two teams or people who both want to win. | The rivalry between Al Ahly and Zamalek is more than a hundred years old.
n | equalizer | A goal that makes the score the same for both teams. | Our team scored the equalizer two minutes before the end.
n | tie | A result in which both teams have the same score (in British English, a draw). | The game ended in a 2–2 tie.
pv | knock out | To beat a team so that it must leave a competition. | Egypt was knocked out of the World Cup in the first round.
i | move the goalposts | To change the rules or the goals in an unfair way after something has started. | The company moved the goalposts: they raised our targets in the middle of the month.
i | a whole new ball game | A situation that is completely different from what you knew before. | Coaching a team is a whole new ball game compared to playing.
`
  ),
  pack(
    {
      id: 'adventure-and-outdoors',
      group: 'life',
      title: 'Adventure & Outdoor Activities',
      description: 'Talk about hiking, camping, snorkeling and doing things that scare you a little.',
      level: 'B1',
      emoji: '🏕️',
      warmUp: [
        'Have you ever slept in a tent?',
        'What is the most exciting thing you have ever done?',
      ],
      grammar: {
        title: 'be about to and was about to',
        points: [
          { form: 'am / is / are about to + base verb', use: 'Something that will happen very soon.', example: 'Hurry up, the bus is about to leave!' },
          { form: 'was / were about to + base verb + when', use: 'Something that was going to happen when something else stopped it.', example: 'We were about to start the hike when it started to rain.' },
          { form: 'be just about to + base verb', use: 'Even sooner.', example: 'I was just about to call you!' },
        ],
        tip: 'about to is followed by the base verb: “I’m about to leave”, not “I’m about to leaving”.',
      },
      discussion: [
        'Would you rather go hiking in Sinai or snorkeling in the Red Sea? Why?',
        'What gear do you need for a night at a campsite in the desert?',
        'Are you a daredevil, or are you more careful?',
        'What is the most thrilling thing you have ever done?',
        'Have you ever gotten cold feet just before doing something exciting?',
        'Is it important to step out of your comfort zone? Why?',
        'Why do some people love adrenaline while others hate it?',
      ],
      task: {
        prompt: 'Tell a friend about an outdoor trip you took or want to take.',
        points: [
          'Where you went and what gear you took',
          'One thrilling moment',
          'A moment when you were about to give up',
          'Whether you would do it again',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last spring, my friends and I headed out to Saint Catherine to climb Mount Sinai. We had all our gear: warm jackets, plenty of water and a sleeping bag each. We left the campsite at two in the morning to see the sunrise from the top. The path was rugged and dark, and at one point I was about to turn back because my legs hurt. My friend, who is a real daredevil, said it was good for me to get out of my comfort zone. When the sun finally came up over the mountains, it was the most thrilling moment of my life. A week later, we went snorkeling in Dahab, and the adrenaline was different but just as good. Now I'm about to book my next trip.",
    },
    `
v | hike | To go for a long walk in the mountains or the countryside. | We hiked for six hours in the Colored Canyon.
n | campsite | A place where people stay in tents, often with water and toilets. | The campsite near Nuweiba was right on the beach.
v | snorkel | To swim just under the surface of the water, breathing through a tube. | We snorkeled over the coral in Dahab.
n | adrenaline | A chemical your body makes when you are excited or afraid, which gives you energy. | I felt the adrenaline when the boat went over the big wave.
adj | thrilling | Very exciting. | Riding a quad bike in the desert was thrilling.
n | daredevil | A person who enjoys doing dangerous things. | My cousin is a daredevil; he jumped from the highest rock.
n | gear | The equipment and clothes you need for an activity. | Don't forget your hiking gear: boots, a hat and plenty of water.
n | sunrise | The time in the morning when the sun first appears. | We climbed Mount Sinai at night to watch the sunrise.
adj | rugged | Rough, rocky and difficult to travel over. | The rugged mountains of South Sinai are great for hiking.
pv | head out | To leave a place to go somewhere. | We headed out at dawn to avoid the heat.
i | out of your comfort zone | In a situation that is new and a little difficult or scary for you. | Camping in the desert took me out of my comfort zone.
i | get cold feet | To suddenly feel too nervous to do something you planned. | I got cold feet just before the bungee jump.
n | sleeping bag | A warm, padded bag that you sleep in, especially when camping. | Bring a sleeping bag; the desert gets cold at night.
`
  ),
  pack(
    {
      id: 'photography-and-content',
      group: 'life',
      title: 'Photography & Content Creation',
      description: 'Talk about taking photos, making videos and growing an audience online.',
      level: 'B2',
      emoji: '📸',
      warmUp: [
        'How many photos are on your phone right now?',
        'Do you follow any content creators? What do they make?',
      ],
      grammar: {
        title: 'Verbs of the senses: see someone do, see someone doing',
        points: [
          { form: 'see / watch / hear + object + base verb', use: 'You saw or heard the whole action, from start to end.', example: 'I watched him edit the whole video in ten minutes.' },
          { form: 'see / watch / hear + object + V-ing', use: 'You saw or heard part of an action that was in progress.', example: 'I saw a woman taking photos of the sunset.' },
          { form: 'notice / spot + object + V-ing', use: 'Seeing something you weren’t looking for.', example: 'I noticed someone filming us.' },
        ],
        tip: 'Don’t put to after see, watch or hear: say “I saw him leave”, not “I saw him to leave”.',
      },
      discussion: [
        'What makes a good thumbnail or a good caption?',
        'Do you use filters on your photos? Is it a kind of lying?',
        'Do you prefer candid photos or posed ones? Why?',
        'Why do creators who find a niche often grow faster?',
        'Would your followers like to see what happens behind the scenes in your job?',
        'Can a phone camera replace a professional camera with a good lens?',
        'Do you agree that a picture is worth a thousand words?',
      ],
      task: {
        prompt: 'Describe a photo or a video you’re proud of.',
        points: [
          'What you saw happening when you took it (see someone doing)',
          'The lighting and how you edited it',
          'The caption you would write',
          'What it means to you',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I started taking photos with my phone three years ago, and now I have a small Instagram page about old Cairo. My niche is the doors and windows of old buildings downtown. Last week, I saw an old man painting his shop door, and I asked if I could take his photo. The lighting was perfect, so I didn't need a filter at all. It was a candid shot: he was laughing at something his neighbor said. I edited it on my laptop and wrote a short caption about his family's shop. I gained two hundred followers in one day! I also post behind-the-scenes videos that I film on a tripod, so people can watch me work. A picture really is worth a thousand words.",
    },
    `
n | lens | The curved glass part of a camera that focuses the light. | You need a wide lens to photograph the whole mosque.
n | caption | The words written under a photo or a post that explain it. | Her captions are funny, so people read every one.
n | filter | An effect that changes the colors or the look of a photo. | This filter makes my skin look too perfect.
v | edit | To change a photo, a video or a text to make it better. | I spent two hours editing a one-minute video.
n | thumbnail | A small picture that shows what a video is about before you click on it. | A good thumbnail can double the number of views.
n | niche | A small, specific subject or market that you focus on. | Her niche is cheap street food in Alexandria.
n | follower | A person who chooses to see someone's posts on social media. | He has 50,000 followers on TikTok.
n | lighting | The kind and amount of light in a place, especially for a photo or a video. | The lighting is softer just before sunset.
adj | candid | Describing a photo taken when people don't know or aren't posing. | I prefer candid wedding photos to posed ones.
n | tripod | A stand with three legs that holds a camera or a phone still. | I use a tripod to film my cooking videos.
pv | zoom in | To make the image in a camera or on a screen bigger and closer. | Zoom in on the bride's face.
i | a picture is worth a thousand words | A picture can show something better than a long description. | I'll just send you a photo of the room; a picture is worth a thousand words.
i | behind the scenes | In the hidden part of something, where the real work is done. | Our followers love seeing what happens behind the scenes in our kitchen.
`
  ),
  pack(
    {
      id: 'cooking-and-recipes',
      group: 'life',
      title: 'Food, Cooking & Recipes',
      description: 'Explain how to cook a dish, describe how it tastes and talk about cooking at home.',
      level: 'B1',
      emoji: '🍳',
      warmUp: [
        'Can you cook? What is your best dish?',
        'Who is the best cook in your family?',
      ],
      grammar: {
        title: 'Partitives: a slice of, a cup of, a pinch of',
        points: [
          { form: 'a piece / a slice of + uncountable noun', use: 'Counting things you can’t count by themselves.', example: 'a slice of bread · a piece of cake · a piece of advice' },
          { form: 'a cup / a glass / a bottle of + liquid or food', use: 'Containers and measures.', example: 'two cups of rice · a glass of milk' },
          { form: 'a pinch / a spoonful / a handful of + noun', use: 'Small amounts in recipes.', example: 'a pinch of salt · a handful of nuts' },
          { form: 'a bunch / a clove / a head of + noun', use: 'Vegetables and herbs.', example: 'a bunch of parsley · two cloves of garlic' },
        ],
        tip: 'Uncountable nouns have no plural: say “two pieces of bread” or “some bread”, not “two breads”, and “some advice”, not “advices”.',
      },
      discussion: [
        'What is a homemade dish that no restaurant can make as well as your family?',
        'Can you whip up a meal in fifteen minutes? What would you make?',
        'Is cooking a piece of cake for you, or a nightmare?',
        'Should men and women share the cooking at home equally?',
        'What is your mother’s secret ingredient?',
        'Have you ever followed a recipe from YouTube? How did it go?',
        'Do too many cooks spoil the broth in your family’s kitchen?',
      ],
      task: {
        prompt: 'Explain how to make your favorite dish.',
        points: [
          'The ingredients, with at least three partitives (a cup of, a pinch of…)',
          'Three steps (chop, stir, simmer…)',
          'How it should taste',
          'A tip from your family',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My favorite homemade dish is my mother's molokhia, and last month I finally asked her for the recipe. First, you need a whole chicken, two cups of chopped molokhia and a whole head of garlic. You simmer the chicken until it's tender, and then you use the broth. While the broth is boiling, you add the molokhia and stir it gently. My mother adds a pinch of salt and a spoonful of ground coriander, but she never measures anything. The last step is the garlic, fried in ghee, and someone has to gasp loudly when you pour it in; that's the family tradition! For my mother, cooking is a piece of cake, but my first try was a disaster. Now I can whip up a quick version in half an hour.",
    },
    `
n | recipe | A set of instructions that tells you how to cook a dish. | My grandmother never wrote down her recipes.
v | simmer | To cook something slowly in liquid that is just below boiling. | Let the soup simmer for twenty minutes.
v | chop | To cut food into small pieces with a knife. | Chop the onions and the tomatoes into small cubes.
v | stir | To move a spoon around in food or a drink to mix it. | Keep stirring the rice so it doesn't stick to the pot.
v | marinate | To leave meat or fish in a mixture of oil, spices and juice before cooking it. | Marinate the chicken in yogurt and spices overnight.
v | season | To add salt, pepper or spices to food to give it more flavor. | Season the fish with cumin and lemon before you grill it.
adj | homemade | Made at home, not bought in a store. | Nothing beats homemade bread.
n | utensil | A tool you use in the kitchen, such as a spoon, a knife or a pan. | Our kitchen is tiny, so we keep only the utensils we use every day.
adj | tender | Soft and easy to cut and eat (about meat). | Cook the meat slowly until it's tender.
pv | whip up | To make a meal quickly. | My dad can whip up a great omelet in five minutes.
i | a piece of cake | Something that is very easy to do. | Making tea is a piece of cake, but making koshary isn't!
i | too many cooks spoil the broth | When too many people try to do the same job, the result is bad. | Everyone added salt to the soup; too many cooks spoil the broth.
n | oven | The part of a stove, like a box with a door, where you bake or roast food. | Bake the fish in the oven for twenty minutes.
`
  ),
  pack(
    {
      id: 'clothes-and-style',
      group: 'life',
      title: 'Clothes, Appearance & Personal Style',
      description: 'Describe what people wear, talk about your own style and shop for clothes that fit.',
      level: 'B1',
      emoji: '👕',
      warmUp: [
        'What are you wearing right now?',
        'Do you care about fashion, or do you just wear what is comfortable?',
      ],
      grammar: {
        title: 'Compound adjectives: well-dressed, short-sleeved, eye-catching',
        points: [
          { form: 'well / badly + past participle', use: 'Describing people and things.', example: 'He’s always well-dressed at work.' },
          { form: 'adjective + noun + -ed', use: 'Describing a part of something.', example: 'a short-sleeved shirt · high-heeled shoes · a long-haired girl' },
          { form: 'adjective or noun + V-ing', use: 'Describing the effect something has.', example: 'an eye-catching dress · a good-looking man · a long-lasting color' },
          { form: 'number + singular noun', use: 'Prices and measurements before a noun.', example: 'a ten-dollar T-shirt · a two-hour shopping trip' },
        ],
        tip: 'Use a hyphen before a noun and keep the noun singular: “a five-minute walk”, not “a five-minutes walk”.',
      },
      discussion: [
        'How would you describe your personal style: casual, stylish or something else?',
        'Is there a dress code at your work or your college? Do you agree with it?',
        'Do you always try on clothes before you buy them?',
        'Which clothes from ten years ago look old-fashioned now?',
        'Is it worth paying more for clothes that fit like a glove?',
        'When were you last dressed to the nines? What was the occasion?',
        'What colors go with your favorite jeans?',
      ],
      task: {
        prompt: 'Describe what you would wear to three different places.',
        points: [
          'A job interview',
          'A friend’s wedding',
          'A Friday with friends',
          'Use two compound adjectives',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My style is mostly casual: jeans, sneakers and a short-sleeved shirt. At work, though, there's a dress code, so I wear pants and a long-sleeved shirt every day. My closet is small, so I only buy clothes I really like. Last week, I tried on a baggy jacket that looked trendy on the model, but on me it looked like a tent. The salesman found me a well-cut one instead, and it fit like a glove. My father thinks my clothes are too tight; for him, anything without a collar is old-fashioned. For my cousin's wedding, I was dressed to the nines in a dark blue suit. Everyone said I looked stylish, and my new shoes went with the suit perfectly.",
    },
    `
adj | casual | Comfortable and not formal (about clothes). | On Fridays, we can wear casual clothes to the office.
adj | trendy | Modern and fashionable at the moment. | Wide-leg jeans are trendy again.
adj | old-fashioned | No longer modern or fashionable. | My dad's ties are a bit old-fashioned.
n | outfit | A set of clothes that you wear together. | I need a new outfit for my sister's engagement party.
pv | go with | To look good together (about colors or clothes). | Does this blue scarf go with my gray coat?
adj | baggy | Loose and too big, hanging in folds. | Baggy T-shirts are comfortable in the summer.
adj | tight | Fitting the body very closely, sometimes too closely. | These jeans are too tight; I need a bigger size.
n | dress code | Rules about what clothes people can wear in a place. | The dress code at the bank is a suit and tie.
n | closet | A tall cupboard or a small room where you keep your clothes (in British English, a wardrobe). | My closet is full, but I have nothing to wear!
adj | stylish | Fashionable and attractive. | My aunt is always stylish, even in simple clothes.
pv | try on | To put on clothes in a store to see if they fit and look good. | Can I try on these shoes in a size 42?
i | dressed to the nines | Wearing your best, most elegant clothes. | Everyone at the wedding was dressed to the nines.
i | fit like a glove | To fit someone perfectly. | This suit fits like a glove; I'll take it.
`
  ),
  pack(
    {
      id: 'directions-and-help',
      group: 'life',
      title: 'Directions & Asking for Help',
      description: 'Ask for and give directions, describe a route and ask strangers for help.',
      level: 'B1',
      emoji: '🧭',
      warmUp: [
        'Do you use a map app, or do you ask people for directions?',
        'Have you ever been really lost in a city?',
      ],
      grammar: {
        title: 'Prepositions of movement: across, along, past, through',
        points: [
          { form: 'go across / over + place', use: 'From one side to the other.', example: 'Walk across the bridge and turn left.' },
          { form: 'go along + road or river', use: 'Following a line.', example: 'Go along the Corniche for five minutes.' },
          { form: 'go past + place', use: 'Going beyond something without stopping.', example: 'Go past the pharmacy; it’s the second building.' },
          { form: 'go through / into / out of + place', use: 'In one side and out of the other; entering; leaving.', example: 'Go through the tunnel and come out of the station on the right.' },
        ],
        tip: 'Say “It’s on the left” and “on the corner of Tahrir Street”, not “in the left” or “in the corner of the street” (in the corner is inside a room).',
      },
      discussion: [
        'What landmarks would you use to give directions to your home?',
        'Is your neighborhood easy for a visitor to navigate?',
        'What do you do when you get lost in a new city?',
        'Why do drivers in Cairo often take a detour?',
        'In your area, do people walk on the sidewalk or in the street? Why?',
        'Do you feel comfortable asking strangers for help? Why or why not?',
        'Have you ever gone around in circles looking for a place?',
      ],
      task: {
        prompt: 'Give directions from the nearest metro station or bus stop to your home.',
        points: [
          'Start at a landmark',
          'Use across, along, past and through',
          'Say how far it is (is it within walking distance?)',
          'Add a warning about something confusing',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last month, a tourist stopped me near Tahrir Square and asked for help. She was lost and had been going around in circles for half an hour. She wanted to go to the Egyptian Museum, which is within walking distance, so I pointed out the big pink building and explained the route. 'Go along this street, past the bank, and turn left at the intersection. Then walk across the square; the crosswalk is near the bus stop. Stay on the sidewalk, because there's a lot of traffic. You can't miss it!' After two blocks, she turned around and came back, because the road was closed. So I walked with her, and we took a short detour through a side street.",
    },
    `
n | landmark | A famous or easy-to-see building or place that helps you know where you are. | Cairo Tower is a good landmark if you get lost in Zamalek.
n | intersection | A place where two or more roads meet and cross. | Turn right at the next intersection.
n | block | The distance along a street from one cross street to the next. | The pharmacy is two blocks from my building.
p | within walking distance | Close enough to walk to. | The metro station is within walking distance of my office.
n | crosswalk | A marked place where people can cross the road (in British English, a zebra crossing). | Always cross at the crosswalk, even if it takes longer.
n | sidewalk | The path at the side of a road where people walk (in British English, a pavement). | The sidewalk was full of parked cars, so we walked in the street.
adj | lost | Not knowing where you are or how to get where you want to go. | We got lost in the old streets of Islamic Cairo.
v | navigate | To find your way from one place to another. | I navigate with a map app when I visit a new city.
n | detour | A longer route that you take to avoid a problem, such as a closed road. | The bridge was closed, so we took a detour through Dokki.
pv | turn around | To go back the way you came. | We were going the wrong way, so the driver turned around.
pv | point out | To show someone something by pointing at it or telling them about it. | The guard pointed out the entrance to the station.
i | you can't miss it | Said when giving directions to mean that a place is very easy to see. | It's the big yellow building on the corner; you can't miss it.
i | go around in circles | To keep going back to the same places without getting where you want. | Without a map, we went around in circles for an hour.
`
  ),
  pack(
    {
      id: 'household-chores',
      group: 'life',
      title: 'Household Chores & Errands',
      description: 'Talk about the housework and errands that keep a home running, and who does what.',
      level: 'B1',
      emoji: '🧹',
      warmUp: [
        'Which household chore do you hate the most?',
        'Who does most of the housework in your home?',
      ],
      grammar: {
        title: 'Things to be done: needs to be done, needs doing',
        points: [
          { form: 'needs + to be + past participle', use: 'Saying that a job must be done, without saying who does it.', example: 'The carpet needs to be vacuumed.' },
          { form: 'needs + V-ing', use: 'The same meaning, more informal.', example: 'The windows need cleaning.' },
          { form: 'someone needs to + base verb', use: 'When you want to say who should do it.', example: 'Somebody needs to wash these dishes!' },
        ],
        tip: 'Say “The car needs washing” or “The car needs to be washed”, not “The car needs to wash” (the car can’t wash anything!).',
      },
      discussion: [
        'Which chores did you have to do as a child?',
        'Should chores be shared equally between men and women at home?',
        'Do you prefer to do the laundry or the dishes? Why?',
        'What errands do you usually run on the weekend?',
        'Is your room spotless or messy right now? Be honest!',
        'Would you pay someone to clean your home if you could? Why or why not?',
        'Do you agree that many hands make light work?',
      ],
      task: {
        prompt: 'Plan a cleaning day with your family or your roommates.',
        points: [
          'Three things that need to be done (needs to be…)',
          'Who will do each chore',
          'One errand outside the house',
          'Something at home that is a labor of love for you',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "In our house, Friday morning is cleaning day, and everyone has a chore. My mother always says, 'This apartment needs to be spotless before your grandmother comes!' My job is to vacuum the carpets and dust the shelves. My sister does the laundry and irons the shirts, which she hates. My father runs the errands: he goes to the supermarket and pays the electricity bill. My little brother's room is always messy, so he has to put away his toys and take out the trash. It takes three hours, but many hands make light work. For my mother, cooking the big Friday lunch afterward is a labor of love.",
    },
    `
n | chore | A small job that you have to do regularly at home, such as cleaning or washing. | Washing the dishes is my least favorite chore.
n | errand | A short trip to buy or do something, such as going to the bank or the store. | I have a few errands to run: the bank, the pharmacy and the bakery.
n | laundry | Clothes and sheets that need to be washed, or the job of washing them. | I do the laundry every Thursday night.
v | vacuum | To clean a floor or a carpet with a machine that sucks up dirt. | Can you vacuum the living room before the guests arrive?
v | mop | To wash a floor with a wet cloth or sponge on a long handle. | My grandmother mops the floor every single day.
v | iron | To make clothes smooth with a hot electric tool. | I iron my shirts on Sunday for the whole week.
v | dust | To clean the dust from furniture with a cloth. | Don't forget to dust the TV and the shelves.
adj | spotless | Perfectly clean. | Her kitchen is always spotless.
adj | messy | Untidy and dirty. | My son's room is so messy that I can't see the floor.
pv | put away | To put something back in the place where it is usually kept. | Put away your clothes before you go out.
p | take out the trash | To carry the garbage out of the house to be collected. | Whose turn is it to take out the trash?
i | many hands make light work | A job is easier when a lot of people help. | Let's all clean the kitchen together; many hands make light work.
i | a labor of love | Hard work that you do because you enjoy it, not for money. | Fixing up this old house was a labor of love.
`
  ),
  pack(
    {
      id: 'returns-and-complaints',
      group: 'life',
      title: 'Shopping, Returns & Complaints',
      description: 'Return something you bought, ask for a refund or an exchange and complain politely.',
      level: 'B1',
      emoji: '🧾',
      warmUp: [
        'Have you ever returned something you bought? What was wrong with it?',
        'Do you keep your receipts?',
      ],
      grammar: {
        title: 'Polite requests: Would you mind…?, I was wondering if…',
        points: [
          { form: 'Could you / Would you + base verb …?', use: 'A polite request.', example: 'Could you check if you have it in a larger size?' },
          { form: 'Would you mind + V-ing …?', use: 'A very polite request.', example: 'Would you mind giving me a refund instead?' },
          { form: 'I was wondering if + I could / you could …', use: 'An extra polite, careful request.', example: 'I was wondering if I could exchange this for a different color.' },
          { form: 'I’d like to + base verb', use: 'Saying what you want, politely and clearly.', example: 'I’d like to make a complaint about my order.' },
        ],
        tip: 'Answer “Would you mind…?” with “No, not at all” when you agree: “Yes” means you DO mind!',
      },
      discussion: [
        'What should you do if you buy something faulty online?',
        'Do you prefer a refund, an exchange or store credit? Why?',
        'Is it rude to complain in a restaurant or a store in Egypt?',
        'What was your best or worst experience with customer service?',
        'How long should the warranty on a phone or a fridge last?',
        'Do you agree that the customer is always right?',
        'What was the biggest rip-off you have ever paid for?',
      ],
      task: {
        prompt: 'Call a store to return a product.',
        points: [
          'Say what you bought and when',
          'Explain what is wrong with it',
          'Ask politely for a refund or an exchange (Would you mind…?)',
          'Answer when they offer store credit',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Two weeks ago, I bought headphones online, but the left side was faulty. I called customer service and said, 'I'd like to return them, please.' The agent asked for my receipt and the order number. Then I asked, 'Would you mind giving me a refund instead of an exchange?' She said the store only offered store credit, which felt like a rip-off. So I said politely, 'I was wondering if I could speak to a manager.' The manager agreed to take the headphones back and refund my money, because they were still under warranty. The model I wanted was out of stock anyway, so I found a bargain at another store. Now I keep every receipt.",
    },
    `
n | refund | Money that is given back to you when you return something. | I returned the shoes and got a full refund.
n | receipt | A piece of paper that shows you have paid for something. | Keep the receipt in case you need to return it.
n | exchange | Giving back something you bought and getting a different one instead. | They don't give refunds, only exchanges.
adj | faulty | Not working correctly because of a problem in how it was made. | The charger was faulty, so I took it back.
n | warranty | A written promise from a company to repair or replace a product if it breaks within a certain time. | My laptop has a two-year warranty.
n | complaint | A statement that you are unhappy or not satisfied with something. | I made a complaint about the late delivery.
n | customer service | The department of a company that helps customers with questions and problems. | I called customer service three times before they fixed it.
n | store credit | Money that you can only spend in the store that gives it to you, instead of a refund. | They gave me store credit, so I had to buy something else there.
p | out of stock | Not available in a store because it has all been sold. | The phone I wanted was out of stock everywhere.
n | bargain | Something you buy for much less than its usual price. | These jeans were a bargain at half price.
pv | take back | To return something to the store where you bought it. | If the shirt doesn't fit, you can take it back within 14 days.
i | the customer is always right | The idea that a business should always try to please its customers. | The manager believes the customer is always right, even when they're rude.
n | rip-off | Something that costs much more than it should (informal). | A hundred and fifty pounds for a cup of coffee? What a rip-off!
`
  ),
  pack(
    {
      id: 'money-and-saving',
      group: 'life',
      title: 'Money, Budgeting & Saving',
      description: 'Talk about spending, saving and borrowing, and making your salary last the whole month.',
      level: 'B1',
      emoji: '💰',
      warmUp: [
        'Do you know exactly how much you spent last week?',
        'Are you a spender or a saver?',
      ],
      grammar: {
        title: 'Verbs with prepositions: spend on, pay for, save for, borrow from, lend to',
        points: [
          { form: 'spend + money or time + on + noun', use: 'What the money goes to.', example: 'I spend too much on delivery apps.' },
          { form: 'pay for + a thing · pay + a person', use: 'Paying (no for before the price or the person).', example: 'I paid for the tickets. · I paid the driver 50 pounds.' },
          { form: 'save (up) for + noun', use: 'Keeping money for a goal.', example: 'We’re saving for a car.' },
          { form: 'borrow (something) from someone · lend (something) to someone', use: 'Borrow means take; lend means give.', example: 'I borrowed 500 pounds from my brother. · He lent it to me.' },
        ],
        tip: 'Arabic uses one verb for both, but English doesn’t: say “Can you lend me 100 pounds?” or “Can I borrow 100 pounds?”, never “Can you borrow me…?”.',
      },
      discussion: [
        'What do you spend most of your money on each month?',
        'Do you have a monthly budget? How do you stick to it?',
        'Is it better to buy something in installments or to save for it?',
        'Have you ever been broke at the end of the month? What did you do?',
        'Did your parents give you an allowance when you were a child?',
        'Is it OK to borrow money from friends? Would you lend money to a friend?',
        'How have families in Egypt cut back on spending in the last few years?',
      ],
      task: {
        prompt: 'Give a younger friend advice about managing their first salary.',
        points: [
          'How to make a simple budget',
          'What they should spend less on',
          'What they should save for',
          'What to do about debt or installments',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "When I got my first salary, I spent most of it on clothes and food delivery, and by the 20th I was broke. I had to borrow 500 pounds from my brother just to pay for transportation. That's when I decided to make a budget. Now, on payday, I write down my fixed expenses: rent, internet and my phone installment. Then I put 20 percent into savings before I spend anything. I've cut back on eating out, and I bring my lunch to work. It isn't always easy to make ends meet, but I've paid off my debt to my brother. Now I'm saving for a laptop, and I keep a little extra for a rainy day.",
    },
    `
n | budget | A plan for how much money you will spend on different things. | My monthly budget for food is 3,000 pounds.
n | savings | Money that you have kept and not spent, often in a bank. | I used all my savings to pay for the wedding.
n | expense | Something you spend money on, or the money you spend on it. | Rent is my biggest monthly expense.
n | debt | Money that you owe to someone. | It took me a year to get out of debt.
adj | broke | Having no money (informal). | I can't go out this weekend; I'm broke until payday.
v | afford | To have enough money to buy or pay for something. | We can't afford a new car right now.
n | allowance | Money that parents give to a child regularly. | My parents gave me a weekly allowance of 50 pounds in high school.
adj | frugal | Careful to spend only as much money as you need. | My grandfather was very frugal; he never wasted anything.
n | installment | One of a number of regular payments for something you have bought. | I'm paying for my phone in twelve monthly installments.
pv | pay off | To finish paying all the money you owe. | I finally paid off my credit card.
pv | cut back on | To spend less on something, or to use less of it. | We're cutting back on takeout to save money.
i | make ends meet | To have just enough money to pay for the things you need. | With prices rising, many families struggle to make ends meet.
i | save for a rainy day | To keep money for a time when you might need it unexpectedly. | My mother always told me to save for a rainy day.
`
  ),
  pack(
    {
      id: 'nutrition',
      group: 'life',
      title: 'Nutrition & Meal Planning',
      description: 'Talk about what you eat, healthy choices and planning your meals for the week.',
      level: 'B1',
      emoji: '🥗',
      warmUp: [
        'What did you eat yesterday?',
        'Do you think your diet is healthy?',
      ],
      grammar: {
        title: 'The zero conditional: facts and general truths',
        points: [
          { form: 'If / When + present simple, present simple', use: 'Facts and things that are always true.', example: 'If you skip breakfast, you get hungry by eleven.' },
          { form: 'present simple + if / when + present simple', use: 'The same, with the if-clause second (no comma).', example: 'I feel sleepy when I eat too much rice.' },
          { form: 'If + present simple, imperative', use: 'Advice and instructions.', example: 'If you feel hungry at night, eat some fruit.' },
        ],
        tip: 'Use the present in both parts for facts: “If you heat water to 100 degrees, it boils”, not “it will boil”. Use will (the first conditional) for one specific future situation.',
      },
      discussion: [
        'What happens to your energy if you skip breakfast?',
        'Is Egyptian food a balanced diet? What is missing, and what is great?',
        'Do you count calories? Is it useful or obsessive?',
        'How much processed food do you eat in a normal week?',
        'Have you ever tried meal prep? Did it save you time or money?',
        'What is your favorite healthy snack, and your favorite unhealthy one?',
        'Do you agree that you are what you eat?',
      ],
      task: {
        prompt: 'Plan a healthy day of meals for someone who works long hours.',
        points: [
          'Breakfast, lunch, dinner and two snacks',
          'Where the protein, fiber and carbohydrates come from',
          'One rule in the zero conditional (If you…, you…)',
          'How to prepare it in advance',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I used to skip breakfast and fill up on bread and sweets at work. If I eat like that, I feel tired by three o'clock. Last year, my doctor told me I needed more protein and fiber and fewer processed carbohydrates. Now I do meal prep on Fridays: I cook chicken, rice and vegetables for four days. Every morning, I eat eggs and ful, which is cheap and very nutritious. For a snack, I have fruit or a handful of nuts instead of chips. I don't count every calorie, but I try to have a balanced diet. My sister eats like a bird, and I eat a lot, but now I eat better. It's true: you are what you eat.",
    },
    `
n | protein | A substance in foods such as meat, eggs and beans that helps your body grow and stay strong. | Lentils are a cheap source of protein.
n | carbohydrate | A substance in foods such as bread, rice and potatoes that gives your body energy. | Koshary is full of carbohydrates: rice, pasta and lentils.
n | calorie | A unit for measuring how much energy food gives you. | A can of soda has about 140 calories.
n | meal prep | Cooking the food for several days in advance. | Meal prep on Friday saves me time during the week.
n | balanced diet | Eating the right amounts of different kinds of food to stay healthy. | A balanced diet includes vegetables, protein and whole grains.
adj | processed | Describing food that has been changed in a factory, often with added salt, sugar or chemicals. | Try to eat less processed meat, like sausages and luncheon meat.
n | snack | A small amount of food that you eat between meals. | I always keep a healthy snack in my bag.
adj | nutritious | Full of the things your body needs to be healthy. | Ful medames is cheap and very nutritious.
n | fiber | The part of fruit, vegetables and grains that helps your stomach work well. | Brown bread has more fiber than white bread.
v | skip | To not eat a meal. | I often skip breakfast when I'm late for work.
pv | fill up on | To eat a lot of one kind of food so that you feel full. | Don't fill up on bread before the main dish arrives.
i | you are what you eat | Your health depends on the food you eat. | If you eat junk food every day, you'll feel like junk; you are what you eat.
i | eat like a bird | To eat very little. | My grandmother eats like a bird, but she's still very active.
`
  ),
  pack(
    {
      id: 'sleep-and-energy',
      group: 'life',
      title: 'Sleep, Energy & Tiredness',
      description: 'Talk about how well you sleep, why you feel tired and what gives you energy.',
      level: 'B1',
      emoji: '😴',
      warmUp: [
        'How many hours did you sleep last night?',
        'What do you do when you feel tired in the afternoon?',
      ],
      grammar: {
        title: 'Gradable and extreme adjectives',
        points: [
          { form: 'very / a bit / extremely + gradable adjective', use: 'Normal adjectives can be made stronger or weaker.', example: 'I was very tired after the night shift.' },
          { form: 'absolutely / completely / totally + extreme adjective', use: 'Extreme adjectives already mean very.', example: 'I was absolutely exhausted. · The room was absolutely freezing.' },
          { form: 'really / pretty + both kinds', use: 'Really works with both.', example: 'I was really tired. · I was really exhausted.' },
          { form: 'gradable → extreme', use: 'Common pairs.', example: 'tired → exhausted · hungry → starving · good → amazing · bad → awful · cold → freezing' },
        ],
        tip: 'Don’t say “very exhausted” or “absolutely tired”: use very with normal adjectives and absolutely with extreme ones.',
      },
      discussion: [
        'Do you have a regular sleep schedule? What breaks it?',
        'Have you ever had insomnia? What did you do about it?',
        'Is a short nap in the afternoon a good idea or a waste of time?',
        'How much caffeine do you have in a day? Is it too much?',
        'Why do people drink energy drinks, and are they dangerous?',
        'Do you sleep like a log, or do you toss and turn?',
        'What do you do when you’re running on empty at work?',
      ],
      task: {
        prompt: 'Describe a week when you didn’t sleep well.',
        points: [
          'Why you couldn’t sleep',
          'How you felt (use extreme adjectives)',
          'What you did to get through the day',
          'What you changed afterward',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "During Ramadan last year, my sleep schedule was a disaster. I stayed up for suhoor, and then I tossed and turned until the morning. At work, I was absolutely exhausted and kept yawning in meetings. I felt drowsy on the metro and dozed off twice; once, I missed my stop. I tried energy drinks, but they made me restless, and I still couldn't sleep at night. By the end of the week, I was running on empty. So I made a plan: no caffeine after four, a twenty-minute nap after work and my phone outside the bedroom. Now I sleep like a log, and I wake up feeling well-rested.",
    },
    `
n | insomnia | A condition in which you can't sleep, or can't sleep well, for a long time. | Stress at work gave me insomnia for months.
n | nap | A short sleep during the day. | I take a short nap after lunch on Fridays.
adj | drowsy | Tired and almost asleep. | This medicine can make you drowsy, so don't drive.
adj | well-rested | Having had enough sleep, so that you feel fresh. | I feel well-rested after eight hours of sleep.
n | sleep schedule | The times when you usually go to sleep and wake up. | Night shifts ruined my sleep schedule.
v | yawn | To open your mouth wide and breathe in deeply because you are tired or bored. | He yawned three times during the lecture.
n | caffeine | A substance in coffee, tea and some soft drinks that keeps you awake. | I stopped drinking tea at night because of the caffeine.
adj | restless | Unable to stay still or relax, often because you are nervous or bored. | I felt restless and couldn't sleep before the exam.
n | energy drink | A drink with a lot of caffeine and sugar that people drink to stay awake. | Students drink energy drinks to study all night.
pv | doze off | To fall asleep, especially when you don't mean to. | I dozed off in front of the TV.
p | toss and turn | To move around a lot in bed because you can't sleep. | I tossed and turned all night, thinking about the interview.
i | sleep like a log | To sleep very deeply. | After the long hike, I slept like a log.
i | running on empty | Having no energy left but continuing anyway. | I've worked six days in a row; I'm running on empty.
`
  ),
  pack(
    {
      id: 'emergencies-and-safety',
      group: 'life',
      title: 'Accidents, Emergencies & Safety',
      description: 'Describe an accident, call for help and talk about staying safe at home and on the road.',
      level: 'B1',
      emoji: '🚑',
      warmUp: [
        'Do you know the number to call for an ambulance in Egypt?',
        'Have you ever taken a first aid course?',
      ],
      grammar: {
        title: 'someone, anyone, no one, everyone',
        points: [
          { form: 'someone · somebody · something', use: 'In positive sentences, offers and requests.', example: 'Someone call an ambulance!' },
          { form: 'anyone · anybody · anything', use: 'In questions and negative sentences.', example: 'Is anyone hurt? · I didn’t see anything.' },
          { form: 'no one · nobody · nothing', use: 'A negative meaning with a positive verb.', example: 'Thankfully, no one was injured.' },
          { form: 'everyone · everybody · everything + singular verb', use: 'All the people or things.', example: 'Everyone was safe. · Everything is under control.' },
        ],
        tip: 'Don’t use two negatives: say “Nobody saw it” or “I didn’t see anybody”, not “I didn’t see nobody”. And everyone takes a singular verb: “Everyone is OK”.',
      },
      discussion: [
        'What would you do if someone passed out in front of you?',
        'Should everyone learn first aid at school?',
        'Does your building have a fire extinguisher and an emergency exit? Do you know where they are?',
        'Why is it sometimes hard for an ambulance to get through traffic in Cairo?',
        'Have you ever had a close call on the road?',
        'What safety rules do you follow at home or at work?',
        'Do you agree with the saying ’better safe than sorry’? When is it too much?',
      ],
      task: {
        prompt: 'Describe an accident or an emergency you saw or heard about.',
        points: [
          'What happened and where',
          'Who was injured, and how badly',
          'What people did (someone, anyone, no one…)',
          'What you learned about safety',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last winter, there was a small fire in the kitchen of the restaurant where I work. Someone shouted, and everyone ran to the emergency exit. The chef grabbed the fire extinguisher and put out the fire in less than a minute. Nobody was badly injured, but one waiter passed out from the smoke and was unconscious for a few seconds. A colleague who knew first aid checked his breathing until the ambulance came. The paramedics said he would be fine; he only had a bruise from the fall. It was a close call, and it scared all of us. Now the manager checks the gas every night: better safe than sorry.",
    },
    `
n | first aid | Simple medical help that you give to someone who is hurt before a doctor arrives. | Every office should have someone trained in first aid.
n | ambulance | A vehicle that takes sick or injured people to the hospital. | The ambulance arrived fifteen minutes after we called.
n | emergency exit | A door you use to leave a building quickly when there is a fire or another danger. | Don't block the emergency exit with boxes.
n | fire extinguisher | A metal container with water or chemicals inside that you use to stop a small fire. | There's a fire extinguisher in the kitchen of every apartment in our building.
adj | injured | Hurt in an accident. | Two people were injured in the car crash on the Ring Road.
v | bleed | To lose blood from a cut or an injury. | His hand was bleeding, so I pressed a clean cloth on it.
n | bruise | A dark mark that appears on your skin after you hit something. | I fell off my bike and got a big bruise on my leg.
adj | unconscious | Not awake and not able to see, hear or feel, usually because of an injury. | She was unconscious for a few seconds after she fell.
n | paramedic | A person trained to give emergency medical help, especially in an ambulance. | The paramedics took him to the hospital.
pv | put out | To make a fire stop burning. | My neighbor put out the fire with a wet blanket.
pv | pass out | To suddenly become unconscious for a short time. | It was so hot that a man passed out in the line at the bank.
i | better safe than sorry | It's better to be careful now than to have a problem later. | I always wear a helmet on my bike; better safe than sorry.
i | a close call | A situation in which something bad almost happened. | A car nearly hit me on the crosswalk; it was a close call.
`
  ),
  pack(
    {
      id: 'tourism-and-culture',
      group: 'life',
      title: 'Tourism & Cultural Experiences',
      description: 'Talk about places you’ve been, what to see in Egypt and how to travel like a local.',
      level: 'B1',
      emoji: '🗺️',
      warmUp: [
        'Which place in Egypt would you show a foreign visitor first?',
        'Have you ever been a tourist in your own city?',
      ],
      grammar: {
        title: 'been or gone; ever and never',
        points: [
          { form: 'have been to + place', use: 'You went there and came back.', example: 'I’ve been to Luxor three times.' },
          { form: 'has gone to + place', use: 'The person went there and is still there.', example: 'My brother has gone to Hurghada; he’s back on Sunday.' },
          { form: 'Have you ever + past participle …?', use: 'Asking about experiences at any time in your life.', example: 'Have you ever ridden a camel?' },
          { form: 'I’ve never + past participle', use: 'Saying an experience hasn’t happened.', example: 'I’ve never seen the White Desert.' },
        ],
        tip: 'When you say when it happened, use the past simple: “I’ve been to Aswan”, but “I went to Aswan last year”, not “I’ve been to Aswan last year”.',
      },
      discussion: [
        'Which places in Egypt are must-sees, and which are tourist traps?',
        'Have you ever stayed in a homestay or with a local family?',
        'What makes an experience feel authentic when you travel?',
        'Is it worth paying for a tour guide, or is it better to explore alone?',
        'Should Egypt limit the number of tourists in peak season?',
        'If a friend visited your city, where would you show them around?',
        'Do you have the travel bug, or do you prefer to stay home?',
      ],
      task: {
        prompt: 'Recommend a place in Egypt to a foreign friend.',
        points: [
          'Where it is and why it’s a must-see',
          'Whether you’ve been there (and when you went)',
          'How to avoid tourist traps',
          'The best time to visit',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I've been to Luxor twice, but my best trip was to Siwa last year. I had never stayed in a homestay before, and it felt so authentic. Our host showed us around the town on bikes and took us to the old mud-brick fortress. We went on an excursion to the salt lakes and swam in water so salty that you float. We avoided the tourist traps and ate where the locals eat. We went in October, before the peak season, so it wasn't crowded. It was the trip of a lifetime, and since then, I've had the travel bug. My cousin has gone to Dahab this week, and I'm already checking out places for my next trip.",
    },
    `
n | tourist trap | A place that attracts a lot of tourists and charges them too much. | The cafés right next to the pyramids are tourist traps.
n | tour guide | A person whose job is to show visitors a place and explain its history. | Our tour guide in Luxor knew every king's name.
adj | authentic | Real and typical of a place or a culture, not changed for tourists. | We ate authentic Nubian food in a family's home in Aswan.
n | excursion | A short trip that you take for pleasure, often as part of a vacation. | The hotel offers an excursion to the Valley of the Kings.
n | monument | A large, old building or statue that is important in history. | Abu Simbel is one of the most famous monuments in the world.
n | must-see | Something so good or interesting that you should see it (informal). | The Grand Egyptian Museum is a must-see.
n | homestay | A visit in which you live with a local family in their home. | I learned more about Siwa from my homestay than from any book.
n | peak season | The busiest time of year for tourism, when prices are highest. | Hotels in Sharm double their prices in peak season.
p | immerse yourself in | To get completely involved in something, such as a culture or a language. | The best way to learn about Nubia is to immerse yourself in daily life there.
pv | check out | To go to a place to see what it is like (informal). | We checked out the new market in Old Cairo.
pv | show someone around | To take someone around a place and show them the interesting parts. | My friend showed me around Alexandria for a whole day.
i | the trip of a lifetime | A very special trip that you may only take once. | Seeing the sunrise at Abu Simbel was the trip of a lifetime.
i | get the travel bug | To start to love traveling and want to do it a lot. | I got the travel bug after my first trip to Sinai.
`
  ),
  pack(
    {
      id: 'housing-and-rent',
      group: 'life',
      title: 'Housing, Rent & Property',
      description: 'Talk about renting or buying a home, contracts, prices and moving out.',
      level: 'B1',
      emoji: '🏢',
      warmUp: [
        'Do you live in a rented apartment or in one your family owns?',
        'What is more important to you: a big home or a good location?',
      ],
      grammar: {
        title: 'both, either and neither',
        points: [
          { form: 'both + plural noun · both … and …', use: 'Two things together (positive).', example: 'Both apartments have a balcony. · It’s both cheap and close to work.' },
          { form: 'either + singular noun · either … or …', use: 'One or the other of two.', example: 'You can pay either monthly or every three months.' },
          { form: 'neither + singular noun · neither … nor …', use: 'Not one and not the other.', example: 'Neither apartment has an elevator. · It’s neither cheap nor quiet.' },
          { form: 'either of / neither of + the, my, these + plural noun', use: 'Before the, my, these and so on.', example: 'Neither of the brokers called back.' },
        ],
        tip: 'After neither, use a positive verb: “Neither apartment has parking”, not “Neither apartment doesn’t have parking”.',
      },
      discussion: [
        'Is it better to rent or to buy in Egypt today? Why?',
        'Why are so many apartments in new compounds overpriced?',
        'What should you check before you sign a lease?',
        'Do you trust real estate brokers? What has your experience been?',
        'Would you take a mortgage to buy a home, or save and pay cash?',
        'At what age should young people move out of their parents’ home?',
        'What makes a place feel like home sweet home for you?',
      ],
      task: {
        prompt: 'You’re looking for an apartment. Describe two that you saw.',
        points: [
          'The location, size and price of each',
          'What both have and what neither has',
          'The lease or the down payment',
          'Which one you chose, and why',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last year, I decided to move out of my parents' home and rent an apartment near work. A broker showed me two places, and both were small but bright. The first was in a new compound in 6th of October; it was quiet but overpriced, and the utilities weren't included. The second was in Dokki, ninety square meters, with a one-year lease. Neither had an elevator, but the Dokki apartment was close to the metro, so I chose it. My landlord can't evict me as long as I pay on time, which gives me peace of mind. My dream is to buy my own home one day, but even the down payment is too much for me now. For now, I'm happy to have a roof over my head, and every evening I walk in and think: home sweet home.",
    },
    `
n | real estate | Property such as land and buildings, or the business of selling it. | Real estate prices in New Cairo have doubled in three years.
n | mortgage | A loan from a bank to buy a home, which you pay back over many years. | They took a twenty-year mortgage to buy their first apartment.
n | lease | A legal agreement to rent a home for a period of time. | I signed a two-year lease on the apartment.
n | broker | A person whose job is to help people buy, sell or rent property (also called a real estate agent). | The broker took a month's rent as his fee.
v | evict | To legally force someone to leave the home they rent. | The landlord can't evict you without a court order.
n | utilities | Services such as electricity, water and gas that a building uses. | The rent is 6,000 pounds a month, plus utilities.
n | down payment | The first part of the price that you pay when you buy something expensive, with the rest paid later. | We need a 20 percent down payment to buy the apartment.
adj | overpriced | Costing more than it is worth. | Apartments by the sea are overpriced in the summer.
n | compound | A group of buildings behind a wall and gates, where people live with shared gardens and services. | They moved to a gated compound with a pool and security.
n | square meter | A unit for measuring area: a square that is one meter long on each side. | The apartment is 120 square meters.
pv | move out | To leave the home where you live and go to live somewhere else. | I moved out of my parents' home when I got married.
i | a roof over your head | A place to live. | It isn't a palace, but at least I have a roof over my head.
i | home sweet home | Said when you return to your home and feel happy and comfortable. | After two weeks of traveling, home sweet home!
`
  ),
];
