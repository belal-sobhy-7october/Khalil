/** A1 topics, built with the course method (see ./types.ts and ./README.md). */
import { pack, type TopicPack } from './types';

export const A1_PACKS: TopicPack[] = [
  pack(
    {
      id: 'personal-profile',
      group: 'talk',
      title: 'Personal Profile & Background',
      description: 'Say who you are: your name, age, where you are from, what you do and what you like.',
      level: 'A1',
      emoji: '🙋',
      warmUp: [
        'What is your name, and where are you from?',
        'Do you study or work?',
      ],
      grammar: {
        title: 'be: am, is, are',
        points: [
          { form: 'I am · you are · he/she/it is · we/they are', use: 'Saying who someone is, their age, job or nationality.', example: 'I am Omar. I am 22. I am a student.' },
          { form: 'I’m not · he isn’t · they aren’t', use: 'Negative sentences.', example: 'I’m not married. My sister isn’t a student.' },
          { form: 'Am I…? · Is he…? · Are you…?', use: 'Questions: be comes first.', example: 'Are you from Cairo? Yes, I am.' },
        ],
        tip: 'In English, a sentence always needs a verb: say “I am a student”, not “I student”, and “She is 20”, not “She 20”.',
      },
      discussion: [
        'What is your full name?',
        'How old are you?',
        'Where are you from, and where do you live now?',
        'Are you a student, or do you have a job?',
        'What languages do you speak?',
        'What is your favorite food, color or place?',
      ],
      task: {
        prompt: 'Introduce yourself to a new class.',
        points: [
          'Your name and age',
          'Where you are from and where you live',
          'What you study or what your job is',
          'Your favorite thing',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Hi! My name is Mariam, and my last name is Hassan. I am 21 years old. I was born in Assiut, but I live in Cairo now. I am a student at Cairo University. I speak Arabic and a little English. I am single, and I live with my family. My favorite city is Alexandria, and my favorite food is koshary.",
    },
    `
n | name | The word that people call you. | My name is Ahmed, but my friends call me Hamo.
n | last name | Your family name, which comes after your first name. | My last name is Mahmoud, like my father's.
n | age | How old someone is. | What is your age? I'm 23.
adj | born | Starting your life at a place or a time (be born). | I was born in Tanta in 2004.
n | country | An area of land with its own government, such as Egypt or France. | Egypt is a big country in Africa.
n | city | A big and important town. | Cairo is the biggest city in Egypt.
v | live | To have your home in a place. | I live in Nasr City with my parents.
v | speak | To be able to use a language. | I speak Arabic and English.
n | student | A person who studies at a school or a university. | I'm a student at Ain Shams University.
n | job | The work that you do to get money. | My brother has a job in a bank.
adj | married | Having a husband or a wife. | My sister is married and has two children.
adj | single | Not married. | I'm 24 and single.
adj | favorite | Liked more than all the others. | Blue is my favorite color.
pv | grow up | To change from a child into an adult in a place. | I grew up in a small village near Mansoura.
`
  ),
  pack(
    {
      id: 'meeting-people',
      group: 'talk',
      title: 'Meeting People & Small Talk',
      description: 'Say hello, ask simple questions about people and have a short, friendly chat.',
      level: 'A1',
      emoji: '👋',
      warmUp: [
        'How do you say hello to a new person?',
        'What do you talk about with a new classmate?',
      ],
      grammar: {
        title: 'Wh- questions with be',
        points: [
          { form: 'What + is/are …?', use: 'Asking about things, names and jobs.', example: 'What is your name? What’s your job?' },
          { form: 'Where / How old / How + is/are …?', use: 'Asking about places, age and how someone is.', example: 'Where are you from? How old is your brother? How are you?' },
          { form: 'Who + is/are …?', use: 'Asking about people.', example: 'Who is your teacher?' },
        ],
        tip: 'Put be after the question word: say “Where are you from?”, not “Where you are from?”.',
      },
      discussion: [
        'How do people in Egypt usually say hello?',
        'What do you say when you meet someone for the first time?',
        'What is a good question to ask a new classmate?',
        'Do you like to talk about the weather? Why or why not?',
        'Where do you usually meet new friends?',
        'How do you say goodbye to a friend?',
      ],
      task: {
        prompt: 'Meet a new person at a party and chat for one minute.',
        points: [
          'Say hello and say your name',
          'Ask three questions with What, Where and How',
          'Say something about the weekend or the weather',
          'Say goodbye politely',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "At my cousin's party, I met a new person. I said, 'Hello! I'm Karim. Nice to meet you.' She said, 'Hi, I'm Laila. Pleased to meet you too.' I asked, 'Where are you from?' She is from Alexandria, and she is a nurse. We chatted about the weather and our plans for the weekend. She is very nice and friendly. At the end, I said, 'Thanks for the chat. See you later!'",
    },
    `
p | nice to meet you | A polite thing you say when you meet someone for the first time. | Hi, I'm Salma. Nice to meet you!
adj | pleased | Happy (often in "pleased to meet you"). | I'm pleased to meet you, Mr. Adel.
v | meet | To see and talk to someone for the first time. | I met my best friend at school.
n | friend | A person you know well and like. | Hassan is my friend from college.
adj | nice | Pleasant and kind. | Your new neighbor is very nice.
p | how are you | A question you ask to know if someone is well. | "How are you?" "I'm fine, thanks."
adj | fine | Well and healthy; OK. | I'm fine, thank you. And you?
n | weather | How hot, cold, sunny or rainy it is outside. | The weather is very hot today.
n | weekend | Saturday and Sunday, or Friday and Saturday in Egypt; the days when you don't work. | What are you doing this weekend?
v | chat | To talk in a friendly and informal way. | We chatted for an hour at the café.
p | see you later | A friendly way to say goodbye. | OK, I have to go. See you later!
pv | get to know | To start to know a person better. | I want to get to know my new colleagues.
`
  ),
  pack(
    {
      id: 'family-and-friends',
      group: 'talk',
      title: 'Family, Friends & Close Relationships',
      description: 'Talk about the people in your family and your close friends.',
      level: 'A1',
      emoji: '👨‍👩‍👧',
      warmUp: [
        'How many people are in your family?',
        'Who is your best friend?',
      ],
      grammar: {
        title: 'Possessives: my, your, his, her and ’s',
        points: [
          { form: 'my · your · his · her · our · their + noun', use: 'Saying who something or someone belongs to.', example: 'This is my brother. Her name is Nada.' },
          { form: 'name + ’s + noun', use: 'The same with a person’s name.', example: 'Ali’s wife is a doctor. My mother’s sister is my aunt.' },
          { form: 'Whose + noun …?', use: 'Asking who something belongs to.', example: 'Whose phone is this? It’s Omar’s.' },
        ],
        tip: 'Use his for a man and her for a woman: “Mona and her husband”, not “Mona and his husband”.',
      },
      discussion: [
        'How many brothers and sisters do you have?',
        'Where do your parents live?',
        'Do you have a big family? How often do you meet?',
        'Who is your favorite cousin, and why?',
        'Who is your best friend? How did you meet?',
        'Where did you grow up?',
      ],
      task: {
        prompt: 'Show a family photo to a new friend and talk about it.',
        points: [
          'Who is in the photo',
          'Their names and jobs (his, her, their)',
          'One person you are very close to',
          'Your best friend',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "This is a photo of my family. My parents are in the middle. My father's name is Mostafa, and my mother's name is Hoda. I have one brother and two sisters. My brother is married, and his wife is a teacher. Their son is three, and he's a very funny kid. My grandparents live with us, and I'm very close to my grandmother. My best friend is my cousin, Youssef; we grew up together.",
    },
    `
n | parent | A mother or a father. | My parents live in Giza.
n | brother | A boy or a man who has the same parents as you. | My brother is older than me.
n | sister | A girl or a woman who has the same parents as you. | I have two sisters.
n | son | Someone's male child. | Their son is ten years old.
n | daughter | Someone's female child. | My aunt has three daughters.
n | husband | The man that a woman is married to. | Her husband works in Dubai.
n | wife | The woman that a man is married to. | My uncle's wife is from Alexandria.
n | grandparent | The mother or the father of your mother or father. | I visit my grandparents every Friday.
n | uncle | The brother of your mother or father, or your aunt's husband. | My uncle has a shop in Tanta.
n | aunt | The sister of your mother or father, or your uncle's wife. | My aunt makes great cakes.
n | cousin | The child of your aunt or uncle. | I have more than twenty cousins.
n | best friend | The friend you like most. | Nour is my best friend; we talk every day.
adj | close | Knowing and liking someone very much. | I'm very close to my sister.
pv | look after | To take care of someone. | My grandmother looks after my little brother.
`
  ),
  pack(
    {
      id: 'daily-routines',
      group: 'life',
      title: 'Daily Routines & Time',
      description: 'Talk about what you do every day, and when you do it.',
      level: 'A1',
      emoji: '⏰',
      warmUp: [
        'What time do you get up?',
        'What do you do on Fridays?',
      ],
      grammar: {
        title: 'The present simple and how often',
        points: [
          { form: 'I/you/we/they + verb · he/she/it + verb-s', use: 'Things you do every day or usually.', example: 'I get up at seven. My father leaves at eight.' },
          { form: 'always · usually · often · sometimes · never', use: 'How often; they go before the main verb.', example: 'I usually have breakfast at home. I never drink coffee.' },
          { form: 'be + always/never', use: 'After be, they come after the verb.', example: 'I’m always tired on Mondays.' },
        ],
        tip: 'Don’t forget -s with he, she and it: say “She works”, not “She work”.',
      },
      discussion: [
        'What time do you usually wake up?',
        'What do you have for breakfast?',
        'When do you have lunch and dinner?',
        'Are you busy on weekdays?',
        'What do you always do before bed?',
        'Is your Friday different from your weekdays? How?',
      ],
      task: {
        prompt: 'Describe a normal day for you.',
        points: [
          'When you wake up and get up',
          'Your meals and when you have them',
          'What you do in the afternoon and evening',
          'When you go to bed',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I usually wake up at 6:30, but I get up at seven. I take a shower and have breakfast with my family. My weekdays are very busy: I'm at work from eight to four. I have lunch at work at one o'clock. In the evening, I often go to the gym. We always have dinner together at nine. I go to bed at eleven, and I'm never late for work.",
    },
    `
pv | wake up | To stop sleeping. | I wake up at six every day.
pv | get up | To get out of bed. | I get up early on weekdays.
n | breakfast | The first meal of the day, in the morning. | I have eggs and bread for breakfast.
n | lunch | The meal you eat in the middle of the day. | We have lunch at two o'clock.
n | dinner | The main meal of the evening. | Dinner is ready at nine.
n | shower | Washing your body under water that comes from above. | I take a shower every morning.
adv | usually | In most cases; most of the time. | I usually go to work by metro.
adv | always | Every time; all the time. | My mother always gets up first.
adv | never | Not at any time. | I never eat breakfast; I'm not hungry in the morning.
adv | early | Before the usual time, or near the start of the day. | I go to bed early on Sundays.
adj | late | After the right or usual time. | Sorry, I'm late! The bus was slow.
adv | o'clock | Used with a number to say the hour. | The class starts at nine o'clock.
n | weekday | Any day except the weekend. | On weekdays, I study in the evening.
adj | busy | Having a lot of things to do. | Mondays are very busy for me.
`
  ),
  pack(
    {
      id: 'home-and-neighborhood',
      group: 'life',
      title: 'Home & Neighborhood',
      description: 'Describe your home, its rooms and the area where you live.',
      level: 'A1',
      emoji: '🏠',
      warmUp: [
        'Do you live in a house or an apartment?',
        'What is your favorite room?',
      ],
      grammar: {
        title: 'there is, there are and places',
        points: [
          { form: 'There is + a/an + noun', use: 'Saying that one thing is in a place.', example: 'There is a big window in my bedroom.' },
          { form: 'There are + plural noun', use: 'Saying that more than one thing is in a place.', example: 'There are three bedrooms.' },
          { form: 'in · on · under · next to · near', use: 'Saying where things are.', example: 'The bank is next to my building. My keys are on the table.' },
        ],
        tip: 'Use there is with one thing and there are with more than one: “There are two bathrooms”, not “There is two bathrooms”.',
      },
      discussion: [
        'How many rooms are there in your home?',
        'What is there in your kitchen?',
        'Is your street quiet or noisy?',
        'What is near your home: a pharmacy, a mosque, a park?',
        'Do you know your neighbors?',
        'What do you like about your neighborhood?',
      ],
      task: {
        prompt: 'Describe your home to a new friend.',
        points: [
          'The rooms in your home (there is / there are)',
          'Your favorite room',
          'What is near your home',
          'Your neighbors',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I live in an apartment on the fourth floor. There are three bedrooms, a living room, a kitchen and two bathrooms. My bedroom is small, but there is a big window. There isn't an elevator in our building, so I walk up the stairs. Our street is quiet at night but noisy in the morning. There is a pharmacy next to our building, and the metro is near. My neighbors are very nice; they always say hello.",
    },
    `
n | apartment | A set of rooms for living in, on one floor of a building. | We live in a small apartment in Shubra.
n | bedroom | A room for sleeping in. | My bedroom has a desk and a bed.
n | kitchen | A room where you cook food. | My mother is in the kitchen.
n | bathroom | A room with a toilet and a shower or a bath. | There are two bathrooms in our apartment.
n | living room | The main room in a home, where people sit and relax. | We watch TV in the living room.
n | floor | One level of a building. | I live on the third floor.
n | window | An opening in a wall with glass in it. | Please open the window; it's hot.
n | neighbor | A person who lives near you. | Our neighbors are very friendly.
n | street | A road in a town or a city with buildings on its sides. | My street is very long.
adj | quiet | Making very little noise. | My neighborhood is quiet at night.
adj | noisy | Making a lot of noise. | The street is noisy because of the cars.
p | next to | Very close to; at the side of. | The supermarket is next to the bank.
n | elevator | A machine that carries people up and down in a building. | The elevator is broken, so we use the stairs.
pv | move in | To start living in a new home. | We moved in last summer.
`
  ),
  pack(
    {
      id: 'food-and-ordering',
      group: 'life',
      title: 'Food, Preferences & Ordering',
      description: 'Talk about the food you like and order a meal in a restaurant or a café.',
      level: 'A1',
      emoji: '🍽️',
      warmUp: [
        'What is your favorite food?',
        'Do you like spicy food?',
      ],
      grammar: {
        title: 'like, love, hate and would like',
        points: [
          { form: 'like / love / hate + noun or V-ing', use: 'Saying what you enjoy or don’t enjoy, in general.', example: 'I love chicken. I don’t like cooking.' },
          { form: 'would like (I’d like) + noun', use: 'Asking for something politely, now.', example: 'I’d like a cup of tea, please.' },
          { form: 'Would you like …?', use: 'Offering something politely.', example: 'Would you like some dessert?' },
        ],
        tip: 'Say “I’d like a coffee” when you order, not “I want a coffee” or “I like a coffee” (that means you like coffee in general).',
      },
      discussion: [
        'What do you usually eat for lunch?',
        'Do you prefer chicken or fish?',
        'What fruit do you like?',
        'Do you like sweet or spicy food more?',
        'Do you order takeout? What do you order?',
        'What do you say to a waiter when you want the check?',
      ],
      task: {
        prompt: 'Order a meal in a café.',
        points: [
          'Say hello to the waiter',
          'Ask for the menu',
          'Order food and a drink (I’d like…)',
          'Ask for the check',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I love Egyptian food, but I don't like very spicy dishes. Yesterday, I went to a small restaurant with my friend. I was very hungry. The waiter gave us the menu, and I said, 'I'd like chicken with rice and vegetables, please.' My friend ordered fish. The food was delicious! For dessert, we had fruit. At the end, I asked, 'Can we have the check, please?'",
    },
    `
n | menu | A list of the food in a restaurant, with the prices. | Can I see the menu, please?
v | order | To ask for food or drinks in a restaurant or a café. | I ordered a pizza and a juice.
adj | hungry | Wanting or needing food. | I'm hungry; let's have lunch.
adj | thirsty | Wanting or needing a drink. | It's hot, and I'm thirsty.
adj | delicious | Having a very good taste. | Your mother's food is delicious!
n | chicken | The meat of a chicken. | We have chicken and rice every Friday.
n | vegetable | A plant that you eat, such as a carrot or a potato. | Eat more vegetables; they're good for you.
n | fruit | The sweet part of a plant that you eat, such as an apple or a mango. | Mangoes are my favorite fruit.
n | dessert | Sweet food that you eat at the end of a meal. | We had cake for dessert.
adj | spicy | Having a strong, hot taste from spices. | This food is too spicy for me.
n | waiter | A person who brings food to people in a restaurant. | The waiter brought our drinks.
n | check | A piece of paper that shows how much you must pay in a restaurant (American English). | Can we have the check, please?
n | takeout | Food that you buy in a restaurant and eat at home (American English). | Let's get takeout tonight.
pv | eat out | To eat in a restaurant, not at home. | We eat out once a month.
`
  ),
  pack(
    {
      id: 'shopping-and-prices',
      group: 'life',
      title: 'Shopping, Prices & Payments',
      description: 'Ask about prices and sizes, pay and buy things in a store.',
      level: 'A1',
      emoji: '🛍️',
      warmUp: [
        'Where do you usually go shopping?',
        'Do you pay with cash or a card?',
      ],
      grammar: {
        title: 'this, that, these, those and How much / How many',
        points: [
          { form: 'this / that + singular noun', use: 'One thing near you (this) or far from you (that).', example: 'This shirt is nice. How much is that bag?' },
          { form: 'these / those + plural noun', use: 'More than one thing, near or far.', example: 'These shoes are cheap. Those jeans are expensive.' },
          { form: 'How much …? · How many …?', use: 'Asking about a price or an uncountable amount, and about a number of things.', example: 'How much is this? How many bags do you want?' },
        ],
        tip: 'Ask “How much is it?” or “How much does it cost?”, not “How much it costs?”.',
      },
      discussion: [
        'Where do you buy clothes?',
        'Do you like shopping in a mall or in small stores?',
        'Do you pay with cash or a card?',
        'What is something expensive that you want to buy?',
        'Do you keep your receipts?',
        'Do you buy things when they are on sale?',
      ],
      task: {
        prompt: 'Buy a T-shirt in a store.',
        points: [
          'Ask about the price',
          'Ask for a different size or color',
          'Say how you want to pay',
          'Ask for a receipt',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last Friday, I went to the mall with my sister. I wanted a new T-shirt for the summer. I said, 'How much is this T-shirt?' It was 600 pounds, so it was a bit expensive. Then I saw some cheap T-shirts on sale. I asked, 'Do you have this in a bigger size?' I paid with my card, and the man gave me a receipt. My sister bought two bags, so she didn't have any money left!",
    },
    `
n | price | The amount of money you pay for something. | The price of this phone is very high.
adj | cheap | Not costing a lot of money. | This store has cheap clothes.
adj | expensive | Costing a lot of money. | Cars are very expensive in Egypt.
v | pay | To give money for something you buy. | I paid 200 pounds for these shoes.
n | cash | Money in notes and coins. | Do you pay with cash or a card?
n | size | How big or small something is, for example clothes or shoes. | What size are you? Medium.
n | store | A building or a room where you can buy things (American English). | There's a small store at the end of my street.
n | mall | A large building with many stores inside. | City Stars is a big mall in Cairo.
v | buy | To get something by paying money for it. | I want to buy a new phone.
v | sell | To give something to a person who pays you for it. | This shop sells shoes and bags.
n | customer | A person who buys things in a store. | The store is full of customers on Friday.
n | receipt | A piece of paper that shows you paid for something. | Keep the receipt in case you want to return it.
p | on sale | Sold at a lower price than usual. | These jackets are on sale this week.
pv | pay for | To give money for something. | Who is paying for dinner?
`
  ),
  pack(
    {
      id: 'directions-and-transport',
      group: 'life',
      title: 'Directions, Local Places & Transport',
      description: 'Ask the way, give simple directions and talk about how you travel around your city.',
      level: 'A1',
      emoji: '🚇',
      warmUp: [
        'How do you go to work or to college?',
        'Is there a metro station near your home?',
      ],
      grammar: {
        title: 'Imperatives for directions',
        points: [
          { form: 'verb (base form)', use: 'Telling someone what to do, for example how to get somewhere.', example: 'Go straight. Turn left at the bank.' },
          { form: 'Don’t + verb', use: 'Telling someone not to do something.', example: 'Don’t take the bus; it’s slow.' },
          { form: 'at · on · past + place', use: 'Where to turn or what you see.', example: 'Turn right at the corner. It’s on the left.' },
        ],
        tip: 'For directions, don’t use “you must”: just say “Turn left”, “Go straight”. It’s polite and normal in English.',
      },
      discussion: [
        'How do you get to work or college every day?',
        'Is the metro better than a taxi? Why?',
        'Is there a lot of traffic in your city?',
        'Do you use a map on your phone?',
        'Where is the nearest pharmacy to your home?',
        'Can you give a tourist directions to a famous place near you?',
      ],
      task: {
        prompt: 'Tell a visitor how to get from the metro station to your home.',
        points: [
          'Which way to go (go straight, turn left…)',
          'Two places on the way',
          'How far it is',
          'How long it takes',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "A tourist stopped me on the street and asked, 'Where is the station, please?' It isn't far. I said, 'Go straight down this street. Turn left at the corner, next to the bank. The station is on the right.' She also asked about the bus stop. I said, 'Don't take the bus now; there's a lot of traffic. Take the metro. You can buy a ticket at the station.' She looked at her map and said, 'Thank you!'",
    },
    `
adv | left | On or toward the side of your body where your heart is. | Turn left at the traffic lights.
adv | right | On or toward the side opposite to left. | The bank is on the right.
adv | straight | In a direct line, without turning. | Go straight for two minutes.
n | corner | The place where two streets meet. | There's a café on the corner.
n | bus stop | A place on a road where a bus stops for people to get on and off. | I wait at the bus stop every morning.
n | station | A place where trains or metro trains stop. | The metro station is near my house.
n | ticket | A piece of paper or a card that lets you travel on a bus or a train. | A metro ticket costs a few pounds.
n | map | A drawing that shows roads and places. | I use the map on my phone.
adj | far | A long way from here. | Is the hospital far from here?
v | turn | To change the direction you are going in. | Turn right after the mosque.
n | traffic | The cars and buses on a road at the same time. | There's a lot of traffic in Cairo in the morning.
n | pharmacy | A store where you can buy medicine. | Is there a pharmacy near here?
n | taxi | A car with a driver that you pay to take you somewhere. | We took a taxi to the airport.
pv | get off | To leave a bus, a train or the metro. | Get off at the third station.
`
  ),
  pack(
    {
      id: 'hobbies-and-sports',
      group: 'life',
      title: 'Hobbies, Leisure & Sports',
      description: 'Talk about what you do in your free time and the sports you can play.',
      level: 'A1',
      emoji: '⚽',
      warmUp: [
        'What do you do in your free time?',
        'Can you swim?',
      ],
      grammar: {
        title: 'can and can’t for ability',
        points: [
          { form: 'can + base verb', use: 'Saying what you are able to do.', example: 'I can swim. She can play the guitar.' },
          { form: 'can’t (cannot) + base verb', use: 'Saying what you are not able to do.', example: 'I can’t draw.' },
          { form: 'Can you …?', use: 'Asking about ability.', example: 'Can you play chess? Yes, I can.' },
        ],
        tip: 'After can, use the base verb without to or -s: “He can swim”, not “He can to swim” or “He can swims”.',
      },
      discussion: [
        'What do you like to do in your free time?',
        'What sports can you play?',
        'Do you go to a gym?',
        'What kind of music do you like?',
        'Do you watch movies at home or at the movie theater?',
        'Who is your favorite team?',
      ],
      task: {
        prompt: 'Talk about your free time.',
        points: [
          'Two hobbies you have',
          'Something you can do well and something you can’t do',
          'A sport you play or watch',
          'When you go out with friends',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "In my free time, I like to read and listen to music. I can swim, but I can't draw at all! On Fridays, I play soccer with my friends. Our team isn't very good, but it's fun. I also go to the gym two times a week. In the evening, I sometimes watch a movie at home. My favorite hobby is walking by the Nile with my friends. We go out every Thursday night.",
    },
    `
n | hobby | An activity that you do for fun in your free time. | My hobby is taking photos.
n | free time | The time when you are not working or studying. | What do you do in your free time?
v | swim | To move through water using your arms and legs. | I learned to swim at the club.
v | play | To take part in a game or a sport. | We play soccer every Friday.
n | team | A group of people who play a sport together. | Our team won the game.
v | watch | To look at something, such as TV or a game, for some time. | I watch soccer games with my father.
n | music | Sounds that people sing or play on instruments. | I listen to music on the metro.
n | movie | A story that you watch on a screen (American English). | Let's watch a movie tonight.
n | gym | A place with machines where you exercise. | I go to the gym after work.
v | draw | To make a picture with a pencil or a pen. | My little sister draws very well.
adj | fun | Enjoyable. | The party was really fun.
pv | go out | To leave your home to do something for fun. | We go out on Thursday nights.
v | read | To look at words and understand them, for fun or to learn. | I read before I sleep.
`
  ),
  pack(
    {
      id: 'study-and-work-basics',
      group: 'work',
      title: 'Study & Work Basics',
      description: 'Say what you study or what your job is, and talk about your classes and simple work tasks.',
      level: 'A1',
      emoji: '💼',
      warmUp: [
        'Do you study or work?',
        'What is your favorite subject?',
      ],
      grammar: {
        title: 'The present simple: questions and negatives',
        points: [
          { form: 'Do you / Does she + verb …?', use: 'Asking questions in the present simple.', example: 'Do you work? Does your brother study?' },
          { form: 'don’t / doesn’t + verb', use: 'Negative sentences.', example: 'I don’t have a job. She doesn’t like math.' },
          { form: 'Wh- + do/does + subject + verb?', use: 'Questions with What, Where, When.', example: 'What do you study? Where does he work?' },
        ],
        tip: 'After does or doesn’t, use the base verb: “Does she work?”, not “Does she works?”.',
      },
      discussion: [
        'What do you study, or what is your job?',
        'What is your favorite subject? Why?',
        'Do you have a lot of homework?',
        'Is your job easy or difficult?',
        'Do you like your colleagues?',
        'What do you want to learn this year?',
      ],
      task: {
        prompt: 'Talk about your studies or your job.',
        points: [
          'What you study or what you do',
          'Where you study or work',
          'Something easy and something difficult',
          'The people you study or work with',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I'm 24, and I work for a big company in New Cairo. I work in an office with ten colleagues. My boss is kind, but she is very busy. I don't have a lot of meetings, so I have time for my tasks. My job isn't difficult, but my salary isn't very high. In the evening, I study English. My class is on Monday and Wednesday, and my teacher gives us a lot of homework. I want to learn and get a better job.",
    },
    `
n | class | A group of students who learn together, or the time when they learn. | My English class starts at seven.
n | teacher | A person whose job is to teach. | Our teacher is very patient.
n | homework | Work that a teacher gives you to do at home. | I do my homework after dinner.
n | exam | An important test of what you know. | I have a math exam tomorrow.
n | subject | Something you study at school or university, such as math or history. | My favorite subject is English.
n | office | A room or a building where people work at desks. | My office is on the fifth floor.
v | work | To do a job, usually for money. | My father works in a hospital.
n | boss | The person who is in charge of you at work. | My boss is very friendly.
n | colleague | A person you work with. | My colleagues and I have lunch together.
n | meeting | A time when people come together to talk about work. | We have a meeting every Sunday morning.
n | salary | The money you get every month for your job. | Her salary is good.
n | company | A business that makes or sells things or gives a service. | He works for a phone company.
adj | difficult | Not easy; needing a lot of effort. | Math is difficult for me.
pv | hand in | To give your work to a teacher. | Please hand in your homework on Monday.
`
  ),
];
