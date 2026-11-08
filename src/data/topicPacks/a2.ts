/** A2 topics, built with the course method (see ./types.ts and ./README.md). */
import { pack, type TopicPack } from './types';

export const A2_PACKS: TopicPack[] = [
  pack(
    {
      id: 'people-and-feelings',
      group: 'talk',
      title: 'Describing People, Personality & Feelings',
      description: 'Describe what people look like, what they are like and how you feel.',
      level: 'A2',
      emoji: '🙂',
      warmUp: [
        'Who is the funniest person you know?',
        'How do you feel on Monday mornings?',
      ],
      grammar: {
        title: 'look, look like and be like',
        points: [
          { form: 'look + adjective', use: 'How someone seems from their face or body.', example: 'You look tired. She looks happy today.' },
          { form: 'look like + noun', use: 'Saying who or what someone is similar to in appearance.', example: 'He looks like his father.' },
          { form: 'What is he/she like?', use: 'Asking about someone’s personality.', example: '“What’s your boss like?” “She’s kind and calm.”' },
        ],
        tip: '“What does he look like?” asks about appearance; “What is he like?” asks about personality. Don’t mix them up.',
      },
      discussion: [
        'Who do you look like in your family?',
        'What is your best friend like?',
        'Are you shy or friendly with new people?',
        'What makes you angry?',
        'When do you feel bored?',
        'When were you very proud of someone?',
      ],
      task: {
        prompt: 'Describe a person you know well.',
        points: [
          'What they look like (tall, short, curly hair…)',
          'What they are like (kind, funny, honest…)',
          'How you feel when you are with them',
          'One thing that makes them upset',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My cousin Ziad is tall and thin, with curly black hair. He looks like his mother, but he's like his father: funny and very friendly. He's never shy, even with new people. He's also very honest; he always tells the truth. Ziad is a bit lazy at home, and that makes his mother angry! Last month, he passed a difficult exam, and we were all so proud of him. When I'm worried or upset, I call Ziad, and he makes me calm.",
    },
    `
adj | tall | Higher than most people. | My brother is very tall; he plays basketball.
adj | curly | Having many curves, like rings (about hair). | She has long, curly hair.
adj | friendly | Kind and pleasant to other people. | Our new neighbors are very friendly.
adj | shy | Nervous and uncomfortable with people you don't know. | I was shy on my first day at work.
adj | kind | Nice and helpful to other people. | My teacher is kind to everyone.
adj | funny | Making people laugh. | My uncle tells funny stories.
adj | lazy | Not liking work or effort. | I feel lazy on Friday mornings.
adj | honest | Always telling the truth. | He's honest; he never lies.
adj | worried | Unhappy because you think something bad may happen. | I'm worried about my exam.
adj | bored | Tired and unhappy because nothing is interesting. | I'm bored; there's nothing on TV.
adj | upset | Sad, worried or angry about something. | She was upset because she lost her phone.
adj | proud | Pleased about something good that you or someone close to you did. | My parents were proud when I graduated.
adj | calm | Relaxed and not worried, angry or excited. | Stay calm; everything will be OK.
pv | cheer up | To start to feel happier, or to make someone feel happier. | Cheer up! It's not a big problem.
`
  ),
  pack(
    {
      id: 'plans-and-invitations',
      group: 'talk',
      title: 'Plans, Invitations & Social Events',
      description: 'Make plans, invite people, say yes or no politely and talk about parties and celebrations.',
      level: 'A2',
      emoji: '📅',
      warmUp: [
        'What are you doing this weekend?',
        'When did you last go to a wedding?',
      ],
      grammar: {
        title: 'going to and the present continuous for plans',
        points: [
          { form: 'be going to + base verb', use: 'Something you have decided to do.', example: 'I’m going to visit my grandmother on Friday.' },
          { form: 'present continuous (am/is/are + V-ing) + time', use: 'A plan that is fixed, with a time and a place.', example: 'We’re meeting at the café at six.' },
          { form: 'Would you like to …? · How about + V-ing?', use: 'Inviting and suggesting.', example: 'Would you like to come to my party? How about going to the movies?' },
        ],
        tip: 'Answer an invitation politely: “I’d love to!” or “Sorry, I can’t. I’m working that day.” Don’t just say “No.”',
      },
      discussion: [
        'What are you doing this weekend?',
        'How do you invite friends: by phone, by message or in person?',
        'What do you say when you can’t go to a party?',
        'What do Egyptians usually do at a wedding?',
        'What gift do you usually take to a birthday party?',
        'Have you ever canceled a plan at the last minute? Why?',
      ],
      task: {
        prompt: 'Invite a friend to an event.',
        points: [
          'What the event is, and when and where it is',
          'Who is coming',
          'One thing your friend should bring',
          'What you will say if they can’t come',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My best friend's birthday is next Friday, and we're going to have a surprise party for her. I'm inviting ten friends, and we're meeting at my house at eight. I sent the invitations on WhatsApp yesterday. Most people said, 'I'd love to come!' but Hany can't come because he's working. I'm going to buy a cake, and everyone is bringing a small gift. We wanted to have it on Thursday, but we put it off because of an exam. I hope she has a great time!",
    },
    `
v | invite | To ask someone to come to a party, a meal or an event. | I invited all my colleagues to my wedding.
n | invitation | A request, spoken or written, for someone to come to an event. | Did you get the invitation to Sara's party?
n | party | An event where people meet to eat, talk, dance and have fun. | We're having a party for my father's birthday.
n | plan | Something you have decided to do. | What are your plans for the weekend?
adj | free | Not busy; having no plans. | Are you free on Saturday?
v | cancel | To decide that a planned event will not happen. | They canceled the trip because of the weather.
v | celebrate | To do something special because of a happy event or a special day. | We celebrated my sister's graduation at a restaurant.
n | wedding | A ceremony where two people get married, and the party after it. | My cousin's wedding is in July.
n | guest | A person you invite to your home or to an event. | There were 300 guests at the wedding.
n | gift | Something you give to someone, often on a special day. | I bought my mother a gift for Mother's Day.
v | arrange | To plan or organize something. | I arranged a meeting with my friends.
pv | put off | To change an event to a later time. | We put off the party until next week.
pv | turn down | To say no to an invitation or an offer. | She turned down the invitation because she was sick.
pv | get together | To meet as a group, usually for fun. | Let's get together after the exams.
`
  ),
  pack(
    {
      id: 'chores-and-renting',
      group: 'life',
      title: 'Household Chores, Housing & Renting',
      description: 'Talk about housework, problems in your home and renting an apartment.',
      level: 'A2',
      emoji: '🧹',
      warmUp: [
        'Which housework do you hate?',
        'Do you live in a rented apartment?',
      ],
      grammar: {
        title: 'have to and don’t have to',
        points: [
          { form: 'have to / has to + base verb', use: 'Something that is necessary.', example: 'I have to clean my room every Friday.' },
          { form: 'don’t / doesn’t have to + base verb', use: 'Something that is not necessary (you can choose).', example: 'We don’t have to pay for water.' },
          { form: 'Do you have to …?', use: 'Asking if something is necessary.', example: 'Do you have to pay the rent every month?' },
        ],
        tip: '“You don’t have to” means it isn’t necessary; “you mustn’t” means it is not allowed. They are very different!',
      },
      discussion: [
        'Which chores do you have to do at home?',
        'Who washes the dishes in your family?',
        'Is your room usually tidy or messy?',
        'Do you know how much your family pays in rent?',
        'What do you do when something in your home is broken?',
        'Do you get along with your landlord or your neighbors?',
      ],
      task: {
        prompt: 'You’re looking for a roommate. Describe your apartment and the house rules.',
        points: [
          'The rooms and the furniture',
          'How much the rent is',
          'Two chores everyone has to do',
          'One thing people don’t have to do',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last year, I moved to Cairo for work and rented a small apartment with a friend. The rent is 5,000 pounds a month, and we pay half each. Our landlord lives on the first floor; he's nice, but he's slow to repair things. Last month, the heating was broken for two weeks! We have to clean the apartment every Friday. I do the laundry, and my friend washes the dishes. We don't have to buy furniture because the apartment is furnished. My room is tidy, but his room is always messy!",
    },
    `
n | chore | A job you have to do regularly at home, such as cleaning. | Washing the dishes is my least favorite chore.
v | clean | To remove the dirt from something. | I clean my room on Saturdays.
n | dishes | The plates, bowls and glasses that you use for a meal. | It's your turn to wash the dishes.
n | laundry | Clothes and sheets that need washing, or that you have just washed. | I do the laundry on Fridays.
adj | messy | Not tidy; with things in the wrong places. | My little brother's room is always messy.
adj | tidy | With everything in the right place. | Please keep the kitchen tidy.
n | rent | The money you pay every month to live in a home that someone else owns. | The rent here is very high.
n | landlord | A person who owns a home and lets other people live in it for money. | Our landlord fixed the door.
adj | broken | Damaged and not working. | The elevator is broken again.
v | repair | To fix something that is broken or damaged. | A man came to repair the washing machine.
n | furniture | Things such as chairs, tables and beds that you put in a home. | We bought new furniture for the living room.
v | move | To go to live in a different home. | We're moving to a bigger apartment.
pv | take out | To carry something out of a place, such as the trash. | Can you take out the trash, please?
pv | clean up | To make a place clean and tidy. | We cleaned up after the party.
`
  ),
  pack(
    {
      id: 'clothes-and-complaints',
      group: 'life',
      title: 'Clothes, Personal Style & Consumer Complaints',
      description: 'Describe clothes, talk about your style and return something you bought.',
      level: 'A2',
      emoji: '👕',
      warmUp: [
        'What are you wearing today?',
        'Have you ever returned something you bought?',
      ],
      grammar: {
        title: 'Comparatives, too and enough',
        points: [
          { form: 'adjective-er / more + adjective + than', use: 'Comparing two things.', example: 'This jacket is cheaper than that one. The blue dress is more fashionable.' },
          { form: 'too + adjective', use: 'More than you want or need.', example: 'These pants are too tight.' },
          { form: 'adjective + enough', use: 'As much as you need.', example: 'The shoes aren’t big enough.' },
        ],
        tip: 'Don’t use more with short adjectives: say “cheaper”, not “more cheap”, and “better”, not “more good”.',
      },
      discussion: [
        'What clothes do you wear to work or college?',
        'Do you prefer comfortable clothes or fashionable clothes?',
        'What is your personal style?',
        'Do you always try on clothes before you buy them?',
        'Have you ever bought clothes that didn’t fit?',
        'What do you do when a store doesn’t want to give you a refund?',
      ],
      task: {
        prompt: 'Return something you bought.',
        points: [
          'What you bought and when',
          'What the problem is (too small, broken…)',
          'What you want: an exchange or a refund',
          'What the store said',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last week, I bought a new jacket and a pair of sneakers. I didn't try on the sneakers in the store, and that was a mistake. At home, they were too tight, and the jacket wasn't warm enough. I went back to the store and said, 'I'd like to return these sneakers. They don't fit.' The man said I could exchange them, but I wanted a refund. In the end, he gave me my money back. Next time, I'm going to try everything on! My style is simple: comfortable pants, a T-shirt and sneakers.",
    },
    `
n | jacket | A short coat. | Take a jacket; it's cold tonight.
n | dress | A piece of clothing for a woman or a girl that covers the body and the legs. | She wore a long blue dress to the wedding.
n | pants | A piece of clothing that covers each leg separately (American English). | I need new pants for work.
n | sneakers | Soft, comfortable shoes for sports or every day (American English). | I wear sneakers every day.
v | fit | To be the right size and shape for someone. | These shoes don't fit me; they're too small.
pv | try on | To put on clothes in a store to see if they fit or look good. | Can I try on this shirt?
v | return | To take something you bought back to the store. | I returned the phone because it didn't work.
n | refund | Money that a store gives back to you when you return something. | I asked for a refund.
v | complain | To say that you are not happy about something. | We complained about the slow service.
v | exchange | To take something back to a store and get something different. | Can I exchange this shirt for a bigger size?
adj | comfortable | Making you feel relaxed, with no pain. | These sneakers are very comfortable.
adj | tight | Fitting the body very closely, often too closely. | These jeans are too tight.
adj | fashionable | Popular at a particular time; in style. | Wide jeans are fashionable this year.
n | style | A way of dressing that is typical of a person. | I like her style; it's simple but beautiful.
`
  ),
  pack(
    {
      id: 'travel-and-accommodation',
      group: 'life',
      title: 'Travel, Accommodation & Tourism',
      description: 'Talk about trips you took, booking a hotel, flights and the places you visited.',
      level: 'A2',
      emoji: '🧳',
      warmUp: [
        'Where did you go on your last trip?',
        'Do you like traveling by plane?',
      ],
      grammar: {
        title: 'The past simple: regular and irregular verbs',
        points: [
          { form: 'verb + -ed', use: 'Regular verbs, for finished actions in the past.', example: 'We booked a hotel near the beach.' },
          { form: 'irregular past forms', use: 'Many common verbs have their own past form.', example: 'We went to Luxor. I took a lot of photos. We had a great time.' },
          { form: 'last + time · ago · in + year', use: 'Words that show when.', example: 'I traveled to Aswan two years ago.' },
        ],
        tip: 'Use the past simple when you say when: “I visited Siwa last year”, not “I have visited Siwa last year”.',
      },
      discussion: [
        'Where did you go on your last vacation?',
        'How did you book your hotel or flight?',
        'What do you always take in your luggage?',
        'Do you like sightseeing or relaxing on the beach?',
        'Which museum in Egypt do you like most?',
        'Have you ever traveled abroad? Where did you go?',
      ],
      task: {
        prompt: 'Tell a friend about your last trip.',
        points: [
          'Where you went and how you traveled',
          'Where you stayed',
          'Two things you did there',
          'One problem you had',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last summer, I went on a trip to Hurghada with my family. We booked our hotel online two months before. The flight from Cairo was only one hour, but our luggage was very late. We checked in at the hotel at four o'clock. The beach was beautiful, and we swam every day. One day, a tour guide took us to the desert. We didn't do a lot of sightseeing, but we had a great vacation. On the last day, we checked out at noon and flew home.",
    },
    `
n | trip | A journey to a place and back again, often for a short time. | We took a trip to Fayoum last weekend.
n | vacation | A time when you don't work or study and often travel (American English). | We're going on vacation in August.
v | book | To arrange to have something, such as a room or a ticket, at a later time. | I booked two tickets for the train.
n | reservation | An arrangement to have a room, a table or a seat at a later time. | I have a reservation for two nights.
n | passport | An official document you need to travel to other countries. | Don't forget your passport!
n | flight | A journey in a plane. | Our flight leaves at 6 a.m.
n | luggage | The bags and suitcases you take on a trip. | Our luggage was very heavy.
n | sightseeing | Visiting famous or interesting places as a tourist. | We did a lot of sightseeing in Luxor.
n | tourist | A person who visits a place on vacation. | Many tourists visit the pyramids every day.
n | guide | A person whose job is to show a place to tourists. | Our guide spoke excellent English.
n | museum | A building where you can see old, important or interesting things. | The Egyptian Museum is in Tahrir Square.
adv | abroad | In or to another country. | My brother works abroad, in Kuwait.
pv | check in | To arrive at a hotel or an airport and give your details. | We checked in at the hotel at three.
pv | check out | To pay and leave a hotel. | You have to check out before twelve.
`
  ),
  pack(
    {
      id: 'health-and-lifestyle',
      group: 'life',
      title: 'Health, Symptoms & Lifestyle',
      description: 'Say how you feel, describe symptoms to a doctor and talk about a healthy lifestyle.',
      level: 'A2',
      emoji: '🩺',
      warmUp: [
        'When were you last sick?',
        'Do you think you have a healthy lifestyle?',
      ],
      grammar: {
        title: 'should and shouldn’t for advice',
        points: [
          { form: 'should + base verb', use: 'Saying what is a good idea.', example: 'You should drink more water.' },
          { form: 'shouldn’t + base verb', use: 'Saying what is a bad idea.', example: 'You shouldn’t go to work with a fever.' },
          { form: 'Should I …?', use: 'Asking for advice.', example: 'Should I see a doctor?' },
        ],
        tip: 'Don’t put to after should: say “You should rest”, not “You should to rest”.',
      },
      discussion: [
        'What do you do when you have a headache?',
        'When should you see a doctor?',
        'Do you get enough sleep?',
        'Is your diet healthy? What should you change?',
        'How much exercise do you do in a week?',
        'What gives you stress, and what helps you relax?',
      ],
      task: {
        prompt: 'A friend is sick. Give them advice.',
        points: [
          'Ask about their symptoms',
          'Say what they should do',
          'Say what they shouldn’t do',
          'Tell them when to see a doctor',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last week, I felt sick at work. I had a bad headache, a fever and a cough. My manager said, 'You should go home and rest.' The next day, I made an appointment with a doctor. She said it was the flu and gave me a prescription for some medicine. She told me I should drink a lot of water and get more sleep. I also have a lot of stress at work, so she said I shouldn't work late. After four days, I got better. Now I try to have a healthy diet and do some exercise every day.",
    },
    `
n | headache | A pain in your head. | I have a headache because I didn't sleep well.
n | fever | A high body temperature, when you are sick. | My son has a fever, so he's not going to school.
n | cough | When you push air out of your throat with a loud noise, often when you are sick. | I have a bad cough and a sore throat.
adj | sick | Not well; ill (American English). | I was sick last week, so I stayed at home.
n | pain | The feeling you have when part of your body hurts. | I have a pain in my back.
n | medicine | Something that you take when you are sick to make you better. | Take this medicine three times a day.
n | appointment | An arranged time to see someone, such as a doctor. | I have a doctor's appointment at five.
n | prescription | A paper from a doctor that says which medicine you need. | You need a prescription for these pills.
n | symptom | A sign of an illness, such as a fever or a cough. | What are your symptoms?
adj | healthy | Good for your body; or not sick. | Fruit and vegetables are healthy.
n | exercise | Physical activity that you do to stay strong and healthy. | Walking is good exercise.
n | diet | The food that you usually eat. | My diet has too much sugar.
n | stress | A feeling of worry because of problems or too much work. | Exams give me a lot of stress.
p | get better | To become healthy again after being sick. | I hope you get better soon!
pv | come down with | To start to have an illness that is not serious. | I think I'm coming down with a cold.
`
  ),
  pack(
    {
      id: 'university-and-assignments',
      group: 'work',
      title: 'University Life & Academic Tasks',
      description: 'Talk about university life, lectures, assignments, deadlines and exams.',
      level: 'A2',
      emoji: '🎓',
      warmUp: [
        'What do you study, or what did you study?',
        'Did you like exams at school?',
      ],
      grammar: {
        title: 'The past simple: questions, negatives and ago',
        points: [
          { form: 'Did + subject + base verb …?', use: 'Questions about the past.', example: 'Did you pass the exam?' },
          { form: 'didn’t + base verb', use: 'Negative sentences in the past.', example: 'I didn’t finish the project on time.' },
          { form: 'time + ago', use: 'How long before now something happened.', example: 'I graduated three years ago.' },
        ],
        tip: 'After did and didn’t, use the base verb: “Did you go?”, not “Did you went?”.',
      },
      discussion: [
        'What was your favorite subject at university?',
        'Do you prefer exams or projects? Why?',
        'Did you ever miss a deadline? What happened?',
        'How do you prepare for exams?',
        'Is your university campus big? What do you like there?',
        'When did you graduate, or when will you graduate?',
      ],
      task: {
        prompt: 'Tell a friend about a difficult week at university.',
        points: [
          'Which assignments or exams you had',
          'One deadline you nearly missed',
          'What you did to prepare',
          'Your grade, or how you felt at the end',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last semester was very hard. I had three exams and a big group project in the same week. The deadline for the project was Thursday, and we didn't start until Monday! I spent every day in the library on campus. On Wednesday, we gave a presentation in front of the class. It was scary, but it went well. I didn't sleep much, and I nearly failed one exam. In the end, I passed everything, and I got a good grade in the project. I learned to start my assignments early!",
    },
    `
n | lecture | A talk about a subject that a teacher gives to students at a university. | The lecture starts at nine in Hall 3.
n | assignment | A piece of work that a student has to do. | I have a history assignment for Monday.
n | deadline | The last time or day when you can finish something. | The deadline for the report is Friday.
n | grade | A letter or a number that shows how good a student's work is (American English). | I got a good grade in math.
n | semester | One of the two parts of a school or university year. | This semester, I'm taking five courses.
n | campus | The buildings and land of a university. | There's a big library on campus.
n | library | A building or a room with books that you can read or borrow. | I study in the library after my lectures.
n | project | A piece of work that needs a lot of time and planning. | We did a project about the Nile.
n | presentation | A talk that you give to a group of people, often with slides. | I have to give a presentation in English.
v | pass | To succeed in an exam. | Did you pass your driving test?
v | fail | To not succeed in an exam. | He failed the exam, so he has to take it again.
pv | go over | To study or check something carefully, for example before an exam. | I'm going over my notes for tomorrow's exam.
v | graduate | To finish your studies at a university and get a degree. | My sister graduated from Cairo University in 2023.
pv | fall behind | To do less work than you should by a certain time. | I was sick and fell behind with my homework.
`
  ),
  pack(
    {
      id: 'workplace-responsibilities',
      group: 'work',
      title: 'Workplace & Job Responsibilities',
      description: 'Talk about your job, your tasks and the people you work with.',
      level: 'A2',
      emoji: '🏢',
      warmUp: [
        'What does a normal day at work or college look like for you?',
        'Would you like a job in an office or outside?',
      ],
      grammar: {
        title: 'Present simple vs present continuous',
        points: [
          { form: 'present simple', use: 'Things that are usually true or happen regularly.', example: 'I work from nine to five. She answers customer calls.' },
          { form: 'present continuous (am/is/are + V-ing)', use: 'Things happening now or around now.', example: 'I’m working on a new project this month.' },
          { form: 'always · usually vs now · at the moment · this week', use: 'Words that go with each tense.', example: 'I usually work in the office, but this week I’m working from home.' },
        ],
        tip: 'Some verbs aren’t used in the continuous: say “I need help”, not “I’m needing help”, and “I know”, not “I’m knowing”.',
      },
      discussion: [
        'What are your main tasks at work or at college?',
        'Do you work full-time or part-time?',
        'Do you like working shifts? Why or why not?',
        'Who is your manager, and what is he or she like?',
        'Do you sometimes work overtime?',
        'What are you working on at the moment?',
      ],
      task: {
        prompt: 'Describe your job (or a job you want) to a new friend.',
        points: [
          'Where you work and what your schedule is',
          'Your main tasks (present simple)',
          'What you are working on now (present continuous)',
          'The people you work with',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I work full-time in customer service for an internet company. My schedule changes every week because we work in shifts. My main task is to answer calls and help customers with their problems. I'm responsible for ten new agents this month, so I'm training them. My manager is strict, but she's fair. Our department is very busy in the evening, so I sometimes work overtime. I earn a good salary, and I have a one-hour break every day. At the moment, I'm learning English to get a better job.",
    },
    `
n | manager | A person who is in charge of a team or a department at work. | My manager gave me a new task.
n | task | A piece of work that you have to do. | My first task every morning is to read my emails.
adj | responsible | Having the job of looking after someone or something. | I'm responsible for the new staff.
n | customer service | The part of a company that helps customers with questions and problems. | I called customer service about my bill.
n | shift | A period of work, for example in the morning or at night. | I work the night shift this week.
n | schedule | A plan that shows the times of activities or work. | My schedule is very busy today.
adj | full-time | Working all the hours of a normal working week. | She has a full-time job at a bank.
adj | part-time | Working only some of the hours of a working week. | I work part-time while I study.
n | overtime | Extra hours that you work after your normal hours. | I worked two hours of overtime yesterday.
n | break | A short time when you stop working to rest or eat. | Let's take a ten-minute break.
n | staff | All the people who work for a company. | The hotel staff were very helpful.
n | department | One part of a big company, school or organization. | She works in the sales department.
v | earn | To get money for the work that you do. | How much does a nurse earn?
pv | fill in for | To do someone's work for them while they are away. | I filled in for my manager last week.
`
  ),
  pack(
    {
      id: 'digital-life',
      group: 'work',
      title: 'Digital Life & Online Services',
      description: 'Talk about your phone, apps and the internet, and explain how to do simple things online.',
      level: 'A2',
      emoji: '📱',
      warmUp: [
        'How many hours a day do you use your phone?',
        'What app do you use most?',
      ],
      grammar: {
        title: 'Imperatives and sequencing for instructions',
        points: [
          { form: 'base verb', use: 'Giving instructions.', example: 'Open the app. Click “Sign up”.' },
          { form: 'First, … Then, … After that, … Finally, …', use: 'Putting steps in order.', example: 'First, download the app. Then, create an account.' },
          { form: 'Don’t + base verb', use: 'Warnings.', example: 'Don’t share your password.' },
        ],
        tip: 'In instructions, use the base verb with no subject: “Click here”, not “You click here” or “Clicking here”.',
      },
      discussion: [
        'Which apps do you use every day?',
        'Do you pay bills online?',
        'Is the wifi at your home fast?',
        'How often do you charge your phone?',
        'Do you use the same password for everything? Is that a good idea?',
        'What do you search for online most often?',
      ],
      task: {
        prompt: 'Explain to an older relative how to use an app.',
        points: [
          'How to download it',
          'How to make an account and log in',
          'Two things the app can do',
          'One thing they shouldn’t do',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last week, my grandmother wanted to talk to my uncle in Saudi Arabia on video. I helped her with her phone. First, we downloaded a video app. Then, I made an account for her and chose a strong password. After that, I showed her how to log in and how to search for my uncle's name. I told her, 'Don't click on strange messages!' The wifi at her home is slow, so the video stopped a few times. Finally, she saw my uncle on the screen, and she was very happy.",
    },
    `
n | app | A program that you download onto a phone or a computer. | I pay my bills with an app.
v | download | To copy a program, a file or music from the internet to your device. | Download the app from the store.
n | password | A secret word or set of letters and numbers that you use to enter an account. | Never share your password.
n | account | A record of your details that lets you use a website or an app. | I made a new email account.
adj | online | Connected to or available on the internet. | I buy most things online.
n | website | A set of pages on the internet about one subject or company. | Check the train times on the website.
n | screen | The front part of a phone, a computer or a TV that shows pictures and words. | My phone screen is broken.
v | charge | To put electricity into a battery. | I need to charge my phone.
n | battery | The part of a phone or a computer that stores power. | My battery is low.
n | wifi | A way to connect to the internet without wires. | What's the wifi password?
pv | log in | To enter your name and password to start using an account. | I can't log in to my email.
v | upload | To copy a file or a photo from your device to the internet. | I uploaded the photos to Facebook.
v | search | To look for information on the internet. | I searched for a cheap hotel online.
v | click | To press a button on a mouse or touch something on a screen to choose it. | Click on the link to open the page.
`
  ),
  pack(
    {
      id: 'money-and-budgeting',
      group: 'life',
      title: 'Money, Budgeting & Saving',
      description: 'Talk about how you spend and save money, and plan a simple budget.',
      level: 'A2',
      emoji: '💵',
      warmUp: [
        'Do you usually save money or spend it?',
        'What do you spend most of your money on?',
      ],
      grammar: {
        title: 'much, many, a lot of, some and any',
        points: [
          { form: 'much + uncountable · many + countable', use: 'Questions and negatives about amounts.', example: 'I don’t have much money. How many bills do you pay?' },
          { form: 'a lot of + any noun', use: 'A big amount, usually in positive sentences.', example: 'I spend a lot of money on food.' },
          { form: 'some (positive) · any (questions and negatives)', use: 'An amount that isn’t exact.', example: 'I have some savings. Do you have any coins?' },
        ],
        tip: 'Money is uncountable: say “How much money?”, not “How many money?”, and “a lot of money”, not “a lot of moneys”.',
      },
      discussion: [
        'How much money do you spend on transportation in a month?',
        'Do you have a budget? How does it work?',
        'Do you borrow money from friends? Do you lend it?',
        'What is a good way to save money?',
        'Do you look for discounts when you shop?',
        'Did your parents give you an allowance as a child?',
      ],
      task: {
        prompt: 'Explain how you plan your money for one month.',
        points: [
          'How much you earn or get',
          'Your biggest costs (bills, transportation…)',
          'How much you save',
          'One thing you want to stop wasting money on',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I started work last year, and at first I spent all my money. Every month, I had to borrow money from my brother. Then my father helped me make a budget. Now, I pay my bills first: the phone, the internet and transportation. I save 1,000 pounds every month in my bank account. I don't spend much money on clothes, and I always look for a discount. I paid back my brother in March! I can't afford a car yet, but I'm saving for one. I still waste a lot of money on coffee, though.",
    },
    `
v | save | To keep money so that you can use it later. | I'm saving money for a new laptop.
v | spend | To use money to buy or pay for things. | How much do you spend on food?
n | budget | A plan of how much money you will spend on different things. | My budget for food is 3,000 pounds a month.
v | afford | To have enough money to pay for something. | I can't afford a new phone right now.
v | borrow | To take and use something that belongs to someone else, and give it back later. | Can I borrow 100 pounds until Sunday?
v | lend | To give something to someone that they will give back later. | My friend lent me his car.
n | bill | A paper that shows how much you must pay for something, such as electricity. | The electricity bill came today.
v | cost | To have a price. | How much does this bag cost?
n | wallet | A small case that folds, for money and cards. | I lost my wallet on the bus.
n | discount | An amount of money taken off the usual price. | Students get a 20% discount.
n | bank account | An arrangement with a bank where you keep your money. | My salary goes into my bank account.
n | allowance | Money that parents give to a child regularly. | I got an allowance of 20 pounds a week in school.
v | waste | To use more money or time than you need, or to use it badly. | Don't waste your money on things you don't need.
pv | pay back | To give back money that you borrowed. | I'll pay you back next week.
`
  ),
];
