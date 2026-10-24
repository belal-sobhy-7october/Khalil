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
];
