/** Conversation topics, built with the course method (see ./types.ts). */
import { pack, type TopicPack } from './types';

export const TALK_PACKS: TopicPack[] = [
  pack(
    {
      id: 'small-talk',
      group: 'talk',
      title: 'Small Talk',
      description: 'Start conversations with new people, keep them going and end them politely.',
      level: 'B1',
      emoji: '☕',
      warmUp: [
        'Do you enjoy talking to strangers, or do you find it hard?',
        'What is a safe topic to talk about with someone you have just met?',
      ],
      grammar: {
        title: 'Question tags',
        points: [
          { form: 'positive sentence, negative tag', use: 'Checking that someone agrees.', example: 'It’s hot today, isn’t it?' },
          { form: 'negative sentence, positive tag', use: 'Checking something you think is true.', example: 'You don’t work here, do you?' },
          { form: 'same auxiliary as the sentence', use: 'The tag uses the sentence’s auxiliary (or do/does/did).', example: 'You’ve been here before, haven’t you? · She lives nearby, doesn’t she?' },
        ],
        tip: 'Falling intonation = you expect agreement; rising intonation = a real question.',
      },
      discussion: [
        'Which topics should you avoid in small talk?',
        'How do you break the ice at a party where you know nobody?',
        'Is small talk a waste of time or an important skill?',
        'What is the best compliment you have ever received?',
        'How do you get out of an awkward conversation politely?',
        'Is it easy for you to find common ground with people older than you?',
      ],
      task: {
        prompt: 'You meet a new colleague at the coffee machine.',
        points: [
          'Break the ice',
          'Ask two questions with question tags',
          'Find some common ground',
          'End the chat politely',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I used to hate small talk; it always felt awkward. Now I see it as a skill. At work events, I try to mingle instead of staying with my friends. I break the ice with an easy question, like 'It's busy today, isn't it?' Then I ask a follow-up question to show I'm listening. Last week, I ran into an acquaintance from university, and we quickly found common ground: we both love old films. A sincere compliment also helps, and being approachable and chatty makes the rest easy.",
    },
    `
n | small talk | Polite conversation about unimportant things, especially between people who don't know each other well. | I'm not good at small talk with new colleagues.
n | icebreaker | Something you say or do to help people feel relaxed when they first meet. | Asking about the weather is a classic icebreaker.
adj | awkward | Making you feel embarrassed or uncomfortable. | There was an awkward silence after he asked her age.
n | acquaintance | A person you know a little, but who is not a close friend. | He's not a friend, just an acquaintance from work.
v | mingle | To move around and talk to different people at a social event. | At the party, try to mingle instead of staying with your friends.
adj | approachable | Friendly and easy to talk to. | She smiles a lot, so people find her approachable.
n | common ground | Interests, experiences or opinions that two people share. | We found some common ground: we both love football.
n | follow-up question | A question that continues the topic and shows interest in the other person's answer. | Ask a follow-up question to keep the conversation going.
adj | chatty | Liking to talk a lot in a friendly, informal way. | My new neighbor is very chatty.
n | compliment | Something nice you say to praise or admire someone. | She paid me a compliment on my English.
pv | run into | To meet someone by chance. | I ran into my old teacher at the mall.
i | break the ice | To make people feel more relaxed in a new situation, especially by starting a conversation. | He told a joke to break the ice.
`
  ),
  pack(
    {
      id: 'opinions-and-arguing',
      group: 'talk',
      title: 'Opinions & Arguing',
      description: 'Give opinions, support them with reasons and disagree politely.',
      level: 'B2',
      emoji: '💬',
      warmUp: [
        'Do you enjoy debating, or do you avoid arguments?',
        'What is an opinion you have changed in the last few years?',
      ],
      grammar: {
        title: 'Linking contrast',
        points: [
          { form: 'although / even though + clause', use: 'Contrast inside one sentence.', example: 'Although it’s expensive, it’s worth it.' },
          { form: 'despite / in spite of + noun or V-ing', use: 'Contrast with a noun or -ing form (no clause).', example: 'Despite the price, many people buy it. · Despite being expensive, it sells well.' },
          { form: 'However, + new sentence', use: 'Contrast between two sentences.', example: 'It’s expensive. However, it lasts for years.' },
          { form: 'whereas + clause', use: 'Comparing two different facts.', example: 'I prefer cities, whereas my brother prefers villages.' },
        ],
        tip: '“Despite it is expensive” is wrong: say “Although it is expensive” or “Despite being expensive”.',
      },
      discussion: [
        'Should university be free for everyone?',
        'Is it ever right to lie?',
        'Are most news websites biased?',
        'Should children have smartphones before the age of twelve?',
        'Is social media more harmful than helpful?',
        'When is it better to agree to disagree?',
      ],
      task: {
        prompt: 'Give your opinion: “Working from home is better than working in an office.”',
        points: [
          'State your point of view',
          'Two reasons, backed up with evidence or examples',
          'One counterargument and your answer to it',
          'Use although / despite / however',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "From my point of view, working from home is better for most people. Many studies argue that people focus better at home, and there's evidence that they're happier, too. However, some people think it's lonely. That's a valid point, although it depends on the person. Despite this counterargument, I believe the benefits are bigger. Of course, this is a controversial topic, and many articles about it are biased. You need to back up your opinion with facts. If we can't find a compromise, we can always agree to disagree.",
    },
    `
n | point of view | A particular way of thinking about a subject. | From my point of view, working from home is better.
v | argue | To give reasons why you think something is true. | Some people argue that social media makes us lonely.
n | evidence | Facts or information that show something is true. | Is there any evidence that this diet really works?
adj | convincing | Making you believe that something is true or right. | Her argument was very convincing.
n | counterargument | A reason against an argument or idea. | A good essay answers the main counterargument.
adj | biased | Unfairly supporting one side because of personal opinions. | The article was biased; it only showed one side.
adj | controversial | Causing a lot of disagreement and strong feelings. | The death penalty is a controversial topic.
v | justify | To give a good reason for something that others think is wrong or unnecessary. | How can you justify spending so much money on a phone?
n | compromise | An agreement in which both sides accept less than they wanted. | After a long discussion, we reached a compromise.
adj | valid | Based on good reasons and therefore worth accepting. | You make a valid point, but I still disagree.
pv | back up | To support an opinion or claim with facts or reasons. | Can you back up your opinion with an example?
i | agree to disagree | To accept that two people have different opinions and stop arguing about it. | We'll never agree on politics, so let's agree to disagree.
`
  ),
  pack(
    {
      id: 'feelings-and-personality',
      group: 'talk',
      title: 'Feelings & Personality',
      description: 'Describe what people are like and how situations make you feel.',
      level: 'B2',
      emoji: '🙂',
      warmUp: [
        'How would your best friend describe you in three words?',
        'Do you think our personality changes as we get older?',
      ],
      grammar: {
        title: '-ed and -ing adjectives',
        points: [
          { form: '-ed adjective', use: 'How a person feels.', example: 'I’m frustrated. · She was bored.' },
          { form: '-ing adjective', use: 'What causes the feeling.', example: 'The traffic is frustrating. · The film was boring.' },
          { form: 'make + someone + feel + adjective', use: 'Saying what causes a feeling.', example: 'Long lines make me feel frustrated.' },
        ],
        tip: '“I’m boring” means other people find you boring! You probably mean “I’m bored”.',
      },
      discussion: [
        'Are you more outgoing or reserved? Has that changed?',
        'Is being stubborn always a bad thing?',
        'Who do you look up to, and why?',
        'Which situations make you feel anxious, and what helps?',
        'Is it a good idea to wear your heart on your sleeve at work?',
        'Which personality traits make a good friend?',
      ],
      task: {
        prompt: 'Describe someone you look up to.',
        points: [
          'Their personality (three adjectives)',
          'A situation that shows what they are like',
          'How they make you feel',
          'Use -ed and -ing adjectives correctly',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I've always looked up to my older sister. She's outgoing and easy-going, while I'm more reserved. When I'm anxious before an exam, she never gets annoyed; she's very considerate and patient. She's also ambitious: she wants to run her own company one day. She can be a bit stubborn, and she wears her heart on her sleeve, so you always know when she's upset. Sometimes I feel frustrated because she's always right! But talking to her makes me feel calm, and her stories are never boring.",
    },
    `
adj | outgoing | Friendly and enjoying meeting and talking to new people. | My sister is outgoing and makes friends everywhere.
adj | reserved | Not showing your feelings or opinions easily; quiet. | He seems cold, but he's just reserved.
adj | easy-going | Relaxed and not easily worried or annoyed. | My boss is easy-going, so the office is calm.
adj | stubborn | Refusing to change your opinion or behavior, even when there are good reasons to. | He's so stubborn — he never admits he's wrong.
adj | considerate | Thinking about other people's feelings and needs. | It was considerate of you to call when you were late.
adj | ambitious | Having a strong wish to be successful, powerful or rich. | She's ambitious and wants to run her own company.
adj | sensitive | Easily hurt or upset by what other people say or do. | Don't joke about his weight; he's sensitive about it.
adj | moody | Often changing mood suddenly, especially becoming unhappy or angry. | Teenagers can be moody.
adj | frustrated | Annoyed because you cannot do or get what you want. | I get frustrated when my laptop is slow.
adj | anxious | Worried and nervous about something that might happen. | I always feel anxious before exams.
pv | look up to | To admire and respect someone. | I've always looked up to my mother.
i | wear your heart on your sleeve | To show your feelings openly. | She wears her heart on her sleeve; you always know when she's sad.
`
  ),
  pack(
    {
      id: 'relationships-and-marriage',
      group: 'talk',
      title: 'Relationships & Marriage',
      description: 'Engagement, marriage, conflict and break-ups — and how to talk about wishes and regrets.',
      level: 'B2',
      emoji: '💍',
      warmUp: [
        'What makes a relationship last for a long time?',
        'At what age do you think people should get married? Why?',
      ],
      grammar: {
        title: 'wish / if only',
        points: [
          { form: 'wish + past simple', use: 'You want the present to be different.', example: 'I wish my husband had more free time.' },
          { form: 'wish + past perfect', use: 'Regret about the past.', example: 'I wish we hadn’t argued last night.' },
          { form: 'wish + someone + would + base verb', use: 'Annoyance: you want someone to change their behavior.', example: 'I wish you would listen to me.' },
        ],
        tip: 'With “I”, use “were” in careful English: “I wish I were more patient.”',
      },
      discussion: [
        'Is being compatible more important than being in love?',
        'How should couples deal with conflict?',
        'Can a long-distance relationship really work?',
        'What role should in-laws play in a marriage?',
        'Why do you think divorce is becoming more common?',
        'Is jealousy a sign of love or a problem?',
      ],
      task: {
        prompt: 'What makes a good marriage?',
        points: [
          'Three qualities a couple needs',
          'One common conflict and how to solve it',
          'One thing you wish people knew before tying the knot',
          'Use wish + past simple or past perfect',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My cousin and her fiancé had a long-distance relationship for two years before their engagement. People said it wouldn't work, but they were very compatible and completely supportive of each other. Of course, they had conflicts, especially about where to live and how often to visit the in-laws. At one point they almost split up, and she says she wishes they had talked more openly back then. Their commitment won in the end, and they tied the knot last spring. She isn't a jealous person, and she says she has found her soulmate.",
    },
    `
n | engagement | An agreement to get married, or the period before the wedding. | They announced their engagement last month.
adj | compatible | Able to have a good relationship because you have similar ideas and interests. | We're very compatible; we want the same things in life.
n | commitment | A promise to stay loyal to someone or to a relationship. | Marriage is a lifelong commitment.
adj | supportive | Giving help and encouragement, especially when someone has problems. | My husband is very supportive of my career.
n | conflict | A serious disagreement or argument. | Every couple has conflicts; what matters is how they solve them.
n | in-laws | The parents and other relatives of your husband or wife. | We visit my in-laws every Friday.
n | divorce | The legal ending of a marriage. | Divorce has become more common in many countries.
adj | jealous | Unhappy and angry because you think someone you love is interested in another person. | He gets jealous when she talks to other men.
n | soulmate | The person who is perfect for you, especially as a romantic partner. | She believes she has found her soulmate.
n | long-distance relationship | A romantic relationship between two people who live far from each other. | A long-distance relationship needs a lot of trust.
pv | split up | To end a marriage or romantic relationship. | They split up after ten years together.
i | tie the knot | To get married. | They're finally tying the knot next summer.
`
  ),
  pack(
    {
      id: 'friendship',
      group: 'talk',
      title: 'Friendship',
      description: 'Making friends, staying close and dealing with friends who let you down.',
      level: 'B2',
      emoji: '🫂',
      warmUp: [
        'How did you meet your best friend?',
        'Is it easy to make new friends as an adult? Why or why not?',
      ],
      grammar: {
        title: 'each other, one another and reflexive pronouns',
        points: [
          { form: 'each other / one another', use: 'Two or more people do the action to the other person.', example: 'We have known each other since primary school.' },
          { form: 'myself / yourself / themselves …', use: 'The subject does the action to itself.', example: 'She blamed herself for the argument.' },
          { form: 'by myself / on my own', use: 'Alone, without help or company.', example: 'I moved to Cairo by myself and had no friends at first.' },
        ],
        tip: '“They looked at themselves” (each one in the mirror) is not the same as “They looked at each other”.',
      },
      discussion: [
        'What makes someone a loyal friend?',
        'Have you ever drifted apart from a close friend? What happened?',
        'Who do you confide in when you have a problem?',
        'Can you forgive a betrayal by a friend?',
        'Is it possible to stay friends with someone you fell out with?',
        'Can online friends be as close as friends in real life?',
      ],
      task: {
        prompt: 'Talk about your best friend.',
        points: [
          'How you met and how long you have known each other',
          'Why they are trustworthy',
          'A time you helped each other',
          'Whether you have ever fallen out',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My best friend and I have known each other since we were seven. We grew up on the same street, and that created a strong bond between us. He's the most loyal and trustworthy person I know, so I confide in him about everything. Of course, we've fallen out a few times, usually over silly things, but we always make up. When I lost my job, many fair-weather friends disappeared, but he called me every day. A friend in need is a friend indeed. Even when we drift apart for a while, we always reconnect.",
    },
    `
n | close friend | A friend you know very well and like a lot. | I only have three close friends, but I trust them completely.
n | companionship | The pleasure of being with someone so that you are not alone. | Older people often need companionship more than money.
adj | loyal | Always supporting your friends, even in difficult times. | A loyal friend defends you when you aren't there.
adj | trustworthy | Able to be trusted to be honest and to keep secrets. | I only tell my secrets to people who are trustworthy.
n | betrayal | Hurting someone who trusts you, for example by telling their secrets. | Sharing my private message with others felt like a betrayal.
n | bond | A strong feeling of friendship or love that connects people. | Living together in college created a strong bond between us.
v | confide in | To tell someone your secrets or private feelings because you trust them. | I confide in my sister more than anyone else.
p | fair-weather friend | A friend who is only there when things are going well. | When I lost my job, I found out who my fair-weather friends were.
n | peer pressure | The influence that people of your age have on what you do. | Many teenagers start smoking because of peer pressure.
v | reconnect | To meet or talk to someone again after a long time. | Facebook helped me reconnect with old school friends.
pv | drift apart | To slowly become less close to someone. | We drifted apart after she moved abroad.
pv | fall out with | To have an argument with someone and stop being friendly. | I fell out with my best friend over something silly.
i | a friend in need is a friend indeed | A real friend is someone who helps you when you need help. | He lent me money without asking a single question: a friend in need is a friend indeed.
`
  ),
  pack(
    {
      id: 'childhood-and-memories',
      group: 'talk',
      title: 'Childhood & Memories',
      description: 'Where you grew up, the games you played, your school days and how you have changed.',
      level: 'B2',
      emoji: '🧸',
      warmUp: [
        'What is your earliest memory?',
        'Were you a quiet child or a naughty one?',
      ],
      grammar: {
        title: 'Past habits: would and used to',
        points: [
          { form: 'used to + base verb', use: 'Past habits and past states that are not true now.', example: 'I used to live in Alexandria.' },
          { form: 'would + base verb', use: 'Repeated actions in the past, often in stories (not for states).', example: 'Every summer, we would go to the beach with our cousins.' },
          { form: 'didn’t use to / never used to', use: 'Negative past habits.', example: 'I didn’t use to like vegetables.' },
        ],
        tip: 'Use “used to”, not “would”, for states: “I used to have long hair”, not “I would have long hair”.',
      },
      discussion: [
        'Where did you grow up, and how has it changed since then?',
        'Were your parents strict? What did they use to tell you off for?',
        'What games would you play with your friends after school?',
        'Do you think children today have a carefree childhood?',
        'Did your grandparents spoil you? How?',
        'Were the good old days really better? Why or why not?',
      ],
      task: {
        prompt: 'Describe your childhood.',
        points: [
          'Where you grew up and what it was like',
          'Two things you used to do',
          'A typical day, using “would”',
          'One vivid childhood memory',
          'How you have changed since then',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I grew up in a small town in the Delta, and my childhood was carefree. My parents were strict about school, but my grandmother used to spoil us with candy. After school, my friends and I would play football in the street until it got dark. I was a mischievous kid, so my mother often told me off. I have a vivid memory of the day we got our first computer. Last week my cousins visited, and we spent hours reminiscing about the good old days.",
    },
    `
n | upbringing | The way a child is raised and taught by their parents. | My grandparents had a big influence on my upbringing.
adj | carefree | Without worries or responsibilities. | My childhood summers were carefree and full of games.
adj | mischievous | Enjoying causing small trouble in a playful way. | I was a mischievous child who hid my brother's shoes.
adj | strict | Making people follow rules and behave in a certain way. | My father was strict about homework, but kind about everything else.
v | spoil | To give a child everything they want, so that they behave badly. | My grandmother spoiled us with candy every Friday.
n | childhood memory | Something you remember from when you were a child. | My favorite childhood memory is flying kites on the roof.
adj | vivid | (Of a memory) very clear and detailed in your mind. | I have a vivid memory of my first day at school.
v | reminisce | To talk or think with pleasure about things that happened in the past. | When my cousins visit, we reminisce about our summer vacations in the village.
n | innocence | The state of not knowing about the bad things in life. | Children lose their innocence too early these days.
n | phase | A short period in someone's life when they behave in a particular way. | I went through a phase of wanting to be a footballer.
pv | grow up | To change from a child into an adult; to spend your childhood somewhere. | I grew up in a small town near Tanta.
pv | tell off | To speak angrily to someone because they did something wrong. | My teacher told me off for talking in class.
i | the good old days | A time in the past that seems better than now. | My dad always talks about the good old days, when life was simpler.
`
  ),
  pack(
    {
      id: 'films-series-and-books',
      group: 'talk',
      title: 'Films, Series & Books',
      description: 'Recommend a film or a book, tell the plot without spoilers and say what you thought.',
      level: 'B2',
      emoji: '🎬',
      warmUp: [
        'What was the last film or series you really enjoyed?',
        'Do you prefer reading the book or watching the film?',
      ],
      grammar: {
        title: 'Telling a plot: present tenses and participle clauses',
        points: [
          { form: 'present simple / present continuous', use: 'Plots are usually told in the present.', example: 'A young doctor moves to a small village, where strange things are happening.' },
          { form: 'V-ing clause (Walking home, …)', use: 'Two actions by the same person at the same time.', example: 'Walking home one night, she finds a mysterious letter.' },
          { form: 'Having + V3 clause', use: 'One action finished before the next one.', example: 'Having lost everything, he decides to start again.' },
        ],
        tip: 'The clause and the main sentence need the same subject: “Walking home, she saw a dog”, not “Walking home, a dog appeared”.',
      },
      discussion: [
        'What genre do you never watch or read? Why?',
        'Do you get angry when someone tells you a spoiler?',
        'Is binge-watching a good way to relax or a waste of time?',
        'Name a film you think is overrated, and explain why.',
        'Are sequels usually better or worse than the original? Give an example.',
        'Which book or series would you recommend to an English learner, and why?',
      ],
      task: {
        prompt: 'Recommend a film, a series or a book — without spoilers!',
        points: [
          'The genre and the main character',
          'The plot, in the present tense',
          'One participle clause (Having … / -ing …)',
          'What you liked, and what was overrated',
          'Who you would recommend it to',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last weekend I binge-watched a thriller series, and I can't stop thinking about it. The main character is a quiet bank worker. Having lost his job, he decides to plan the perfect robbery. The plot is clever, the cast is excellent, and every episode keeps you on the edge of your seat. Halfway through, there's a huge twist: his best friend turns out to be working for the police. I won't give you any more spoilers! Some critics say it's overrated, but I loved it, and I can't wait for the sequel.",
    },
    `
n | plot | The series of events that make up a story. | The plot was so complicated that I got lost halfway through.
n | main character | The most important person in a story. | The main character is a teacher who becomes a criminal.
n | spoiler | Information that tells you what happens in a story before you see or read it. | Don't tell me the ending: no spoilers!
n | twist | An unexpected change in a story. | I didn't see the twist at the end coming at all.
n | cast | All the actors in a film, a play or a series. | The cast is amazing; every actor is perfect for their role.
n | genre | A type of film, book or music, such as comedy or horror. | Thrillers are my favorite genre.
v | binge-watch | To watch many episodes of a series one after another. | I binge-watched the whole season in one weekend.
adj | gripping | So exciting that it holds your attention completely. | It's a gripping novel; I read it in two days.
adj | overrated | Thought to be better or more important than it really is. | Everyone loved that film, but I found it overrated.
v | recommend | To tell someone that they would enjoy something or find it useful. | Can you recommend a good series to improve my English?
n | sequel | A film or book that continues the story of an earlier one. | The sequel was even better than the first film.
pv | turn out | To be discovered to be something, often in a surprising way. | The quiet neighbor turns out to be a spy.
i | on the edge of your seat | Very excited and nervous because you want to know what happens next. | The last episode kept me on the edge of my seat.
`
  ),
  pack(
    {
      id: 'making-plans',
      group: 'talk',
      title: 'Making Plans & Invitations',
      description: 'Invite people, suggest plans, accept or say no politely and change arrangements.',
      level: 'B1',
      emoji: '📅',
      warmUp: [
        'What do you usually do with your friends on the weekend?',
        'Is it hard for you to say no to an invitation?',
      ],
      grammar: {
        title: 'Making suggestions and answering them',
        points: [
          { form: 'Let’s + base verb', use: 'A direct suggestion that includes you.', example: 'Let’s go to the movies on Friday.' },
          { form: 'Why don’t we / Shall we + base verb?', use: 'A friendly suggestion as a question.', example: 'Why don’t we meet at the café instead?' },
          { form: 'How about / What about + V-ing?', use: 'Suggesting an idea or another option.', example: 'How about having dinner at my place?' },
          { form: 'I’d love to, but …', use: 'Saying no politely to an invitation.', example: 'I’d love to, but I’m working late that day.' },
        ],
        tip: 'After “How about”, use V-ing: “How about going out?”, not “How about go out?”.',
      },
      discussion: [
        'How do you usually invite friends: by message, by phone or in person?',
        'What is a polite way to decline an invitation in your culture?',
        'Do you like last-minute plans, or do you prefer to plan everything?',
        'How do you feel when a friend calls off plans at the last minute?',
        'What is your favorite kind of get-together?',
        'When is it better to play it by ear?',
      ],
      task: {
        prompt: 'Leave a voice message inviting a friend to an event.',
        points: [
          'What the event is, when and where',
          'One suggestion with “Why don’t you” or “How about”',
          'What happens if the plan changes',
          'Ask them to reply',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Hi Omar! We're having a small get-together on the roof on Thursday evening, and I'd love you to come. Are you free? Why don't you come over around eight? We're going to have a barbecue and watch the match. If you're working late, how about joining us for dessert instead? Sorry it's a last-minute invitation. If it rains, we'll probably call it off, so let's play it by ear. And if you can't make it, no problem: you can take a rain check.",
    },
    `
n | invitation | A request to come to a party, a meal or an event. | Thanks for the invitation; I'd love to come.
v | invite | To ask someone to come to an event or to your home. | We invited all our neighbors to the iftar.
v | suggest | To give someone an idea or a plan to think about. | She suggested meeting earlier to avoid the traffic.
v | accept | To say yes to an offer or an invitation. | I accepted the invitation even though I was tired.
v | decline | To say no politely to an invitation or an offer. | I had to decline because I had an exam the next day.
adj | free | Not busy; having no plans. | Are you free on Saturday evening?
n | arrangement | A plan for a particular time, made with other people. | We have an arrangement to meet at the station at six.
adj | last-minute | Done or decided just before something happens. | It was a last-minute plan, but it was the best night of the summer.
n | get-together | An informal meeting or party with friends or family. | We're having a small get-together for my mom's birthday.
pv | call off | To cancel an event or a plan. | They called off the trip because of the storm.
pv | come over | To visit someone at their home. | Why don't you come over and watch the match with us?
i | take a rain check | To say no to an invitation now but suggest doing it another time. | Can I take a rain check on dinner? I'm really tired tonight.
i | play it by ear | To decide what to do as things happen, without a fixed plan. | We don't know when the match ends, so let's play it by ear.
`
  ),
  pack(
    {
      id: 'describing-people',
      group: 'talk',
      title: 'Describing People',
      description: 'Say what people look like and what they are like — politely.',
      level: 'B1',
      emoji: '🧑‍🤝‍🧑',
      warmUp: [
        'Who do you look like in your family?',
        'How would your best friend describe you?',
      ],
      grammar: {
        title: 'look, look like and be like',
        points: [
          { form: 'look + adjective', use: 'How someone seems from their appearance.', example: 'You look tired. Did you sleep well?' },
          { form: 'look like + noun', use: 'Physical similarity to someone or something.', example: 'He looks like his father.' },
          { form: 'What is he / she like?', use: 'Asking about someone’s personality (and sometimes appearance).', example: 'What’s your new manager like? — She’s friendly but strict.' },
          { form: 'opinion → size → age → color', use: 'The usual order when you use several adjectives.', example: 'She has beautiful long black hair.' },
        ],
        tip: '“What does he like?” asks about his hobbies; “What is he like?” asks about his personality.',
      },
      discussion: [
        'Who do you resemble most in your family?',
        'Is it rude to comment on someone’s weight in your culture?',
        'How would you describe yourself to someone who has never met you?',
        'Do you think good-looking people have an easier life?',
        'Describe someone famous without saying their name. Can your partner guess who it is?',
        'Do you dress up for work, or do you prefer casual clothes?',
      ],
      task: {
        prompt: 'Describe someone you admire: what they look like and what they are like.',
        points: [
          'Their age and appearance',
          'Who they look like',
          'What they are like (personality)',
          'Why you admire them',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "My aunt Mona is in her early fifties, but she looks much younger. She's slim and of medium height, with curly gray hair that she never dyes. She's always elegant, even when she isn't dressed up. People say I'm the spitting image of her, and I can see the resemblance in old photos. But what is she like? She's warm, funny and very honest. She never judges people by their appearance, and that's why everyone in the family loves her.",
    },
    `
n | appearance | The way someone looks. | Don't judge people by their appearance.
adj | good-looking | Attractive (used for both men and women). | Her brother is tall and good-looking.
adj | slim | Thin in an attractive way. | She's slim because she walks everywhere.
adj | overweight | Heavier than is healthy. | My doctor told me I'm a little overweight.
p | of medium height | Neither tall nor short. | He's of medium height, with short dark hair.
adj | curly | (Of hair) having lots of curls. | My daughter has curly hair like her mother.
adj | well-built | Having a large, strong body with a lot of muscle. | The new security guard is very well-built.
n | beard | Hair that grows on a man's chin and cheeks. | He grew a beard during the winter.
p | in your early twenties | Aged between about 20 and 23. | My new colleague is in her early twenties, but she's already a team leader.
adj | elegant | Stylish and attractive in the way you dress or move. | My grandmother was always elegant, even at home.
n | resemblance | The fact of looking similar to someone. | There's a strong resemblance between you and your sister.
pv | dress up | To put on formal or special clothes. | Everyone dressed up for the wedding.
i | the spitting image of | Looking exactly like someone else. | Ahmed is the spitting image of his grandfather.
`
  ),
  pack(
    {
      id: 'cultural-differences',
      group: 'talk',
      title: 'Cultural Differences & Etiquette',
      description: 'Customs, manners and culture shock: what is polite here and rude somewhere else.',
      level: 'B2',
      emoji: '🌐',
      warmUp: [
        'What is polite in Egypt but might be rude in another country?',
        'Have you ever been confused by a custom in another culture?',
      ],
      grammar: {
        title: 'Talking about customs: V-ing subjects and “It is … to …”',
        points: [
          { form: 'V-ing as the subject + is …', use: 'Talk about an action as a general idea.', example: 'Arriving late to dinner is normal in some countries.' },
          { form: 'It is + adjective + to + verb', use: 'The same idea, often more natural in speech.', example: 'It is considered rude to refuse food in someone’s home.' },
          { form: 'be expected to / be allowed to + verb', use: 'What society wants or permits.', example: 'Guests are expected to bring a small gift.' },
        ],
        tip: 'A V-ing subject takes a singular verb: “Shaking hands is …”, not “Shaking hands are …”.',
      },
      discussion: [
        'Which customs would surprise a foreign visitor to Egypt?',
        'Have you ever experienced culture shock? Where?',
        'What stereotypes do people have about your country? Are they fair?',
        'Should you always do what the locals do, or are there limits?',
        'Which topics are taboo in your culture?',
        'How can someone fit in quickly in a new country?',
      ],
      task: {
        prompt: 'Explain Egyptian etiquette to a foreign colleague who is visiting Cairo.',
        points: [
          'How people greet each other',
          'Two things guests are expected to do',
          'One thing that is considered rude',
          'Advice to help them fit in',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "When my German colleague visited Cairo, he had a little culture shock. In his country, arriving even five minutes late is rude, but here it's normal for dinner guests to come half an hour late. He was also surprised by our hospitality: everywhere he went, people offered him tea. I explained a few customs. It's considered polite to refuse food once before you accept, and guests are expected to bring something sweet. He was very open-minded and tried everything. By the end of the week, he fitted in perfectly. As he said, when in Rome, do as the Romans do.",
    },
    `
n | custom | Something that people in a society usually do in a particular situation. | It's a custom to visit relatives on the first day of Eid.
n | etiquette | The rules of polite behavior in a society or a group. | Business etiquette in Japan is very formal.
n | manners | Polite ways of behaving with other people. | My mother taught us good table manners.
n | culture shock | A feeling of confusion when you visit or live in a very different culture. | I had culture shock during my first month in London.
n | stereotype | A fixed, often unfair idea of what a type of person is like. | It's a stereotype that all Egyptians live near the pyramids.
adj | offensive | Rude in a way that upsets people. | Some hand gestures are offensive in other countries.
adj | open-minded | Willing to accept different ideas and ways of living. | Traveling made me more open-minded.
n | gesture | A movement of your hand or head that shows a meaning. | A thumbs-up is a friendly gesture in most places.
v | greet | To say hello to someone or welcome them. | In Egypt, people often greet each other with a kiss on the cheek.
n | hospitality | Being friendly and generous to guests. | Egyptian hospitality is famous: guests are always offered tea.
adj | taboo | Not talked about or not allowed because it is offensive or embarrassing. | Talking about your salary is taboo in many offices.
pv | fit in | To feel happy and accepted in a group or a place. | It took me a year to fit in at my new school.
i | when in Rome, do as the Romans do | When you are in a new place, follow the customs of the people there. | I don't usually eat with my hands, but when in Rome, do as the Romans do.
`
  ),
];
