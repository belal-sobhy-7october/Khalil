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
        "When my German colleague visited Cairo, he had a little culture shock. In his country, arriving even five minutes late is rude, but here it's normal for dinner guests to come half an hour late. He was also surprised by our hospitality: everywhere he went, people offered him tea. I explained a few customs. It's considered polite to refuse food once before you accept, and guests are expected to bring something sweet. He was very open-minded and tried everything. By the end of the week, he fit in perfectly. As he said, when in Rome, do as the Romans do.",
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
  pack(
    {
      id: 'self-introduction',
      group: 'talk',
      title: 'Self-Introduction & Background',
      description: 'Introduce yourself: where you come from, what you study or do and what you’re like.',
      level: 'B1',
      emoji: '👋',
      warmUp: [
        'How do you usually introduce yourself to someone new?',
        'What is one thing people are often surprised to learn about you?',
      ],
      grammar: {
        title: 'for, since and how long',
        points: [
          { form: 'have/has + past participle + for + a period', use: 'How long something has continued until now.', example: 'I’ve lived in Giza for ten years.' },
          { form: 'have/has + past participle + since + a starting point', use: 'When something started, if it is still true now.', example: 'I’ve worked at the call center since March.' },
          { form: 'How long have you + past participle …?', use: 'Asking about a situation that is still true.', example: 'How long have you known Ahmed?' },
          { form: 'past simple + ago', use: 'When a finished action happened, counted back from now.', example: 'I graduated two years ago.' },
        ],
        tip: 'Don’t say “I live here since 2020” or “I am here from five years”. Say “I’ve lived here since 2020” and “I’ve been here for five years”.',
      },
      discussion: [
        'What do you say first when you introduce yourself at a job interview, and what do you leave out?',
        'How long have you lived in your hometown, and would you like to relocate one day?',
        'Is your major or your job a good description of who you are? Why or why not?',
        'What kind of first impression do you want to make on new people?',
        'Do you think being bilingual changes the way people see you?',
        'Is it better to be a jack of all trades or an expert in one thing?',
        'When did you decide what you wanted to study, and how long have you been interested in it?',
      ],
      task: {
        prompt: 'Introduce yourself in one minute to a new class or a new team.',
        points: [
          'Where you are from and how long you have lived there',
          'What you studied or what you do now',
          'Two things that describe your personality',
          'One plan for the future',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Hi, I'm Mostafa. I'm from Mansoura, but I've lived in Cairo for six years, and I still miss my hometown sometimes. I graduated from Cairo University in 2022; my major was accounting, but my occupation now is customer service. I've worked at the same company since then, and I'm almost bilingual because I use English all day. People say I'm down-to-earth and self-motivated: I learned to edit videos and fix laptops on my own. My friends call me a jack of all trades. Maybe I'll relocate to Dubai for a few years, but one day I want to settle down near my family. In a nutshell, I'm a hard worker who loves learning new things.",
    },
    `
n | hometown | The town or city where you were born or grew up. | My hometown is Mansoura, but I've lived in Cairo for six years.
n | background | Your family, education and experience, which make you the person you are. | She comes from a medical background; both her parents are doctors.
n | major | The main subject that a student studies in college. | My major was English literature, but now I work in marketing.
v | graduate | To finish your studies at a college or university and get a degree. | I graduated from Ain Shams University in 2021.
adj | bilingual | Able to speak two languages very well. | Many call center agents in Cairo are bilingual in Arabic and English.
n | occupation | Your job, or the kind of work you do (a formal word used on forms). | Write your name, age and occupation on the form.
adj | self-motivated | Able to work hard and do things without someone telling you to. | I'm self-motivated: I learned to code from YouTube videos.
v | relocate | To move to live or work in a different place. | My company asked me to relocate to Alexandria for a year.
n | first impression | The opinion you form about someone when you meet them for the first time. | A smile and a firm handshake make a good first impression.
adj | down-to-earth | Practical, honest and easy to talk to, not proud or difficult. | Even though he's the manager, he's very down-to-earth.
pv | settle down | To start living a calm life in one place, often with a steady job and a family. | After years of moving around, I want to settle down in my hometown.
i | a jack of all trades | A person who can do many different kinds of work. | My uncle is a jack of all trades: he's a driver, a plumber and a cook.
i | in a nutshell | Said when you describe something in very few words. | In a nutshell, I'm a friendly person who loves learning languages.
`
  ),
  pack(
    {
      id: 'family-and-relatives',
      group: 'talk',
      title: 'Family & Relatives',
      description: 'Talk about your family, the relatives you’re close to and what runs in your family.',
      level: 'B1',
      emoji: '👨‍👩‍👧',
      warmUp: [
        'How many people are there in your family, and who do you live with?',
        'Who is the relative you call most often?',
      ],
      grammar: {
        title: 'Possessive ’s and whose',
        points: [
          { form: 'noun + ’s', use: 'Showing that something belongs to a person.', example: 'My father’s brother is my uncle.' },
          { form: 'plural noun ending in -s + ’', use: 'For plural nouns that end in -s, add only an apostrophe.', example: 'My parents’ house is in Shubra.' },
          { form: 'Whose + noun …?', use: 'Asking who something belongs to.', example: 'Whose car is outside? It’s my cousin’s.' },
          { form: 'the + noun + of + noun', use: 'For things and places, not people.', example: 'the end of the street · the name of the village' },
        ],
        tip: 'Don’t translate the Arabic word order: say “my mother’s sister”, not “the sister of my mother”. And don’t mix up whose with who’s (= who is).',
      },
      discussion: [
        'Do you come from a close-knit family? How often do you all meet?',
        'Who do you resemble more, your mother or your father? In what ways?',
        'What runs in your family: a talent, a habit or a health problem?',
        'In Egypt, is the extended family as important as it was in your grandparents’ time?',
        'Is it easier to be an only child or to have many siblings?',
        'Who was the breadwinner in your home when you were a child? Is that changing in Egypt?',
        'Whose advice do you listen to most in your family, and why?',
      ],
      task: {
        prompt: 'Describe your family to a new friend from another country.',
        points: [
          'Who is in your immediate family',
          'One relative you get along with very well, and why',
          'Something that runs in your family',
          'Use the possessive ’s at least three times',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I come from a close-knit family in Shubra. My father was the breadwinner for years, and my mother looked after the four of us. I have two siblings, an older brother and a younger sister, so I'm not an only child, thankfully. People say I resemble my father, but I have my mother's eyes. My grandmother's apartment is where the extended family meets every Friday; there are always at least twenty relatives there. Good cooking runs in the family: my aunt's stuffed vine leaves are famous. I get along with most of my cousins, especially Omar, whose sense of humor is just like mine. My little sister is the apple of my father's eye, and he can never say no to her.",
    },
    `
n | relative | A member of your family, such as an aunt, a cousin or a grandparent. | We visit our relatives in the village every Eid.
n | sibling | A brother or a sister. | I have three siblings, and I'm the youngest.
n | extended family | A family group that includes grandparents, aunts, uncles and cousins, not only parents and children. | My extended family meets at my grandmother's apartment every Friday.
n | only child | A person who has no brothers or sisters. | As an only child, I spent a lot of time with my cousins.
n | stepfather | The man who is married to your mother but is not your father. | My stepfather has raised me since I was five, and I call him Dad.
adj | close-knit | Describing a group of people who care about and support each other. | We're a close-knit family, so we talk on the phone every day.
n | breadwinner | The person in a family who earns the money that the family needs. | After my father retired, my older brother became the breadwinner.
v | resemble | To look like or be similar to another person. | My son resembles my husband; they have the same smile.
pv | look after | To take care of someone, especially a child or an old or sick person. | My grandmother looked after us while my parents were at work.
pv | get along with | To have a friendly relationship with someone. | I get along with my sister-in-law; we often go shopping together.
i | run in the family | To be a quality, a talent or an illness that many people in a family have. | Being tall runs in the family; my father and all my brothers are very tall.
i | the apple of someone's eye | The person that someone loves most and is very proud of. | My little sister is the apple of my father's eye.
n | family tree | A drawing that shows all the members of a family and how they are related. | I drew our family tree, and it goes back to my great-grandfather.
`
  ),
  pack(
    {
      id: 'goals-and-dreams',
      group: 'talk',
      title: 'Goals, Dreams & Ambitions',
      description: 'Talk about your dreams and goals, the plans that changed and how you keep going after a setback.',
      level: 'B2',
      emoji: '🎯',
      warmUp: [
        'What did you want to be when you were a child?',
        'What is one thing you want to do before you turn forty?',
      ],
      grammar: {
        title: 'The future in the past: was going to, would, was supposed to',
        points: [
          { form: 'was/were going to + base verb', use: 'A plan you had in the past, often one that didn’t happen.', example: 'I was going to study medicine, but I changed my mind.' },
          { form: 'thought / knew / hoped + (that) + would + base verb', use: 'What you expected about the future at a time in the past.', example: 'I thought I would be rich by thirty.' },
          { form: 'was/were supposed to + base verb', use: 'Something that was planned or expected but didn’t happen.', example: 'I was supposed to travel last summer, but my visa was rejected.' },
        ],
        tip: 'Don’t use will after a past verb: say “I knew I would pass”, not “I knew I will pass”.',
      },
      discussion: [
        'What were you going to do after school, and did it happen?',
        'What is on your bucket list, and how attainable is each item?',
        'How do you stay motivated after a setback?',
        'Is it better to have one big long-term goal or many small ones?',
        'Should parents encourage children to reach for the stars, or to be realistic?',
        'Have you ever given up on something that turned out to be a pipe dream? Do you regret it?',
        'What makes some people so driven, while others are happy with what they have?',
      ],
      task: {
        prompt: 'Talk about a dream you had and where it is now.',
        points: [
          'What you were going to do, and why',
          'A setback you faced',
          'How you kept going (or why you stopped)',
          'Your next step',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "When I was fifteen, I thought I would be a famous soccer player by twenty-five. It sounds like a pipe dream now, but I really trained every day. I was going to join a big club's youth team, but then I injured my knee, and that setback ended the dream. For a while, I didn't know what to pursue. My uncle told me to set a long-term goal that was attainable, so I decided to become a physical therapist and help injured players. I'm driven, and I've stuck with my studies even when they were hard. I still have a bucket list, and number one is to work with the national team. Some people say it's far-fetched, but I believe in reaching for the stars.",
    },
    `
n | aspiration | A strong hope or wish to achieve something important. | My aspiration is to open a clinic in my village one day.
n | bucket list | A list of things you want to do before you die. | Seeing the Northern Lights is at the top of my bucket list.
v | strive | To try very hard to achieve something. | We strive to be better than we were last year.
adj | far-fetched | Very unlikely to be true or to happen. | Becoming a millionaire by twenty-five sounds far-fetched, but some people do it.
adj | attainable | Possible to achieve. | Break a big dream into small, attainable goals.
n | setback | A problem that stops you from making progress for a while. | Failing my driving test was a setback, but I passed the second time.
n | long-term goal | Something you want to achieve over many years. | My long-term goal is to work for a company abroad.
v | pursue | To try to achieve something over a long time, such as a career or a dream. | She left her bank job to pursue a career in photography.
pv | go after | To try hard to get something you want. | If you want that scholarship, go after it.
pv | stick with | To continue doing something, even when it is difficult. | Learning English is slow, but I'm sticking with it.
i | reach for the stars | To try to achieve something very difficult or very great. | My teacher always told us to reach for the stars.
i | pipe dream | A hope or a plan that will probably never happen. | Owning a villa on the Nile is a pipe dream for most young people.
adj | driven | Having a strong wish to succeed and working very hard for it. | She's so driven that she studies after her night shifts.
`
  ),
  pack(
    {
      id: 'meeting-new-people',
      group: 'talk',
      title: 'Meeting New People',
      description: 'Meet new people, find what you have in common and keep in touch.',
      level: 'B1',
      emoji: '🤝',
      warmUp: [
        'Where did you meet your best friend?',
        'Is it easy for you to talk to people you don’t know?',
      ],
      grammar: {
        title: 'Subject and object questions',
        points: [
          { form: 'Who / What + verb …? (no do, does or did)', use: 'The question word is the subject: you ask who did the action.', example: 'Who introduced you to Sara?' },
          { form: 'Who / What + do/does/did + subject + verb …?', use: 'The question word is the object: you ask who received the action.', example: 'Who did you meet at the party?' },
          { form: 'Which / Whose + noun + verb …?', use: 'The same rule with a noun after the question word.', example: 'Which friend invited you? · Which friend did you invite?' },
        ],
        tip: 'Don’t add did to a subject question: say “Who told you?”, not “Who did tell you?”.',
      },
      discussion: [
        'Who introduced you to your closest friends?',
        'Do you prefer to meet new people through mutual friends, at work or online?',
        'Are you sociable or a bit shy at parties? Has that changed over time?',
        'How can a newcomer at work or at school make friends quickly?',
        'What did you and your best friend have in common when you first hit it off?',
        'Who is the life of the party in your group, and what makes them so good with people?',
        'What is the best way to reach out to someone you met only once?',
      ],
      task: {
        prompt: 'Tell the story of how you met someone who is now important to you.',
        points: [
          'Where and how you met',
          'Who introduced you, or who spoke first',
          'What you had in common',
          'How you stayed in touch',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I'm a bit shy, so meeting new people isn't easy for me. Last year, I joined a language exchange in Dokki, where everyone wore a name tag, so even a newcomer like me could say hello. The first person who spoke to me was Nour, who is very sociable. 'Who invited you?' she asked, and it turned out we had a mutual friend from college. We hit it off right away because we had a common interest in old Egyptian movies. She's the life of the party, and she introduced me to everyone. The next day, I reached out to her on WhatsApp, and now we meet every week. Who would have thought a name tag could start a friendship?",
    },
    `
v | introduce | To tell two people each other's names when they meet for the first time. | Let me introduce you to my colleague, Hany.
n | handshake | The act of shaking someone's hand when you meet them. | In a job interview, start with a firm handshake and a smile.
n | mutual friend | A person who is a friend of two people. | We met at the wedding of a mutual friend.
n | newcomer | A person who has recently arrived in a place or joined a group. | The team always takes newcomers out for lunch on their first day.
adj | sociable | Friendly and enjoying spending time with other people. | My brother is very sociable; he knows everyone in the building.
adj | shy | Nervous and uncomfortable with people, especially people you don't know. | I was too shy to speak to anyone at the party.
i | hit it off | To like each other and become friendly very quickly. | Nada and I hit it off on our first day at work.
pv | strike up | To start a conversation or a friendship with someone. | I struck up a conversation with the man next to me on the metro.
n | name tag | A small card with your name on it that you wear at an event. | Everyone at the conference wore a name tag.
n | common interest | Something that two or more people both enjoy. | Our common interest in photography made us friends.
i | the life of the party | A person who is fun and lively and makes a social event exciting. | My cousin is always the life of the party at weddings.
p | nice to meet you | A polite thing you say when you meet someone for the first time. | "This is my sister, Mai." "Nice to meet you, Mai."
pv | reach out | To contact someone, often to offer help or start a relationship. | I reached out to an old classmate on LinkedIn.
`
  ),
  pack(
    {
      id: 'keeping-conversations-going',
      group: 'talk',
      title: 'Keeping a Conversation Going',
      description: 'Show interest, react to what people say, tell short stories and keep a conversation alive.',
      level: 'B2',
      emoji: '💬',
      warmUp: [
        'Who is the best listener you know? What do they do?',
        'What do you do when a conversation goes silent?',
      ],
      grammar: {
        title: 'So do I, Neither do I: short answers and reply questions',
        points: [
          { form: 'So + auxiliary + subject', use: 'Agreeing with a positive sentence (me too).', example: '“I love mangoes.” “So do I.”' },
          { form: 'Neither + auxiliary + subject', use: 'Agreeing with a negative sentence (me neither).', example: '“I can’t swim.” “Neither can I.”' },
          { form: 'subject + auxiliary (+ not)', use: 'Disagreeing, or answering about yourself.', example: '“I’ve never been to Aswan.” “I have! It’s beautiful.”' },
          { form: 'auxiliary + subject?', use: 'A short reply question that shows interest.', example: '“I’m moving to Dubai.” “Are you? When?”' },
        ],
        tip: 'The auxiliary must match the sentence: “She works here.” “So do I.” · “He didn’t come.” “Neither did I.”',
      },
      discussion: [
        'What makes a person engaging to talk to?',
        'Do you prefer open-ended questions or quick yes-or-no questions when you meet someone?',
        'Is it ever OK to interrupt someone? When?',
        'What does body language tell you about whether someone is interested?',
        'Is eye contact important in Egyptian culture? Is it the same everywhere?',
        'How do you get a word in edgewise when someone talks too much?',
        'What do you do when a word is on the tip of your tongue in English?',
      ],
      task: {
        prompt: 'Record a short conversation (play both people) in which you keep the chat going.',
        points: [
          'Ask an open-ended question',
          'Reply with So do I or Neither do I',
          'Use a reply question like Do you? or Are you?',
          'Tell a short anecdote',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "I used to run out of things to say after two minutes, so I started practicing active listening. Now I ask open-ended questions, like 'What was the best part of your trip?', instead of questions with a yes-or-no answer. When someone says, 'I hate waking up early,' I answer, 'So do I!' or 'Do you? Why?' and they usually elaborate. I also tell a short anecdote of my own, so it doesn't feel like an interview. My body language matters too: I make eye contact and don't look at my phone. I try not to interrupt, but I chime in when there's a natural pause. When a word is on the tip of my tongue, I just describe it, and the conversation keeps going.",
    },
    `
v | elaborate | To give more details about something you have said. | Could you elaborate on that? I'd love to hear more.
n | anecdote | A short, interesting or funny story about something that really happened. | He told a funny anecdote about his first day at work.
adj | engaging | Interesting and pleasant in a way that keeps your attention. | She's an engaging speaker; nobody looks at their phone when she talks.
v | interrupt | To start speaking while another person is still talking. | Please don't interrupt me; let me finish my point.
n | body language | The way your face, hands and body show what you feel. | His body language showed he was bored: he kept checking the time.
n | eye contact | Looking directly into another person's eyes while you talk. | Good eye contact makes you seem confident and honest.
pv | chime in | To add a comment to a conversation, often without being asked. | Feel free to chime in if you have a question.
pv | trail off | To become quieter and then stop speaking. | Her voice trailed off when she forgot the word.
i | get a word in edgewise | To manage to say something when another person is talking a lot. | My aunt talked for an hour, and I couldn't get a word in edgewise.
i | on the tip of your tongue | Almost remembered, but not quite. | His name is on the tip of my tongue... wait, it's Karim!
adj | open-ended | Describing a question that has no fixed answer and invites a long reply. | "What do you like about your job?" is an open-ended question.
n | active listening | Listening carefully and showing that you understand, for example by nodding and asking questions. | Active listening is the most important skill in customer service.
p | run out of things to say | To have nothing more to talk about. | On our first date, we never ran out of things to say.
`
  ),
  pack(
    {
      id: 'misunderstandings',
      group: 'talk',
      title: 'Misunderstandings & Communication Problems',
      description: 'Explain what went wrong in a conversation, check what people mean and clear up a mix-up.',
      level: 'B2',
      emoji: '🤔',
      warmUp: [
        'Has a text message you sent ever been misunderstood?',
        'Is it easier to misunderstand someone in English or in Arabic?',
      ],
      grammar: {
        title: 'Clarifying: What I mean is…, I didn’t mean to…, So you’re saying…?',
        points: [
          { form: 'What I mean is + clause', use: 'Explaining your words in a clearer way.', example: 'What I mean is, we need more time, not more people.' },
          { form: 'I didn’t mean to + base verb', use: 'Saying that a bad result was not your intention.', example: 'I didn’t mean to upset you.' },
          { form: 'So you’re saying (that) + clause?', use: 'Checking that you understood the other person.', example: 'So you’re saying the meeting is canceled?' },
          { form: 'Do you mean + noun or clause?', use: 'Asking which meaning someone has in mind.', example: 'Do you mean this Friday or next Friday?' },
        ],
        tip: 'Use mean for what people intend to say: “What do you mean?”, not “What do you want to say?”, which is a translation from Arabic.',
      },
      discussion: [
        'Tell us about a funny mix-up that happened because of a language problem.',
        'Why are text messages so easy to misinterpret?',
        'What should you do when a manager gives you an ambiguous instruction?',
        'Is your tone different in English and in Arabic? How?',
        'What is a common misconception people have about your job or your city?',
        'Have you and a friend ever gotten your wires crossed about a time or a place?',
        'How do you read between the lines when someone says ’It’s fine’?',
      ],
      task: {
        prompt: 'Tell the story of a misunderstanding and how you cleared it up.',
        points: [
          'What was said and what you understood',
          'Why it was ambiguous',
          'How you found out',
          'What you said to clear it up',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last month, my manager texted me, 'We need to talk tomorrow.' I misinterpreted the message and thought I was going to lose my job. The tone felt cold, and I didn't sleep well. The next morning, I asked her, 'So you're saying there's a problem with my work?' She laughed and said, 'No! What I mean is, I want you to train the new agents.' We had gotten our wires crossed; it was just a mix-up. Since then, I rephrase what people say before I panic, and I try not to read between the lines too much. When a message is ambiguous, I call and clear it up right away.",
    },
    `
v | misunderstand | To understand something in the wrong way. | I misunderstood the address and went to the wrong building.
n | mix-up | A mistake that causes confusion, for example about times, names or places. | There was a mix-up with our hotel booking, so we had no room.
v | misinterpret | To understand someone's words or actions wrongly. | He misinterpreted my silence as anger.
adj | ambiguous | Having more than one possible meaning, so it is not clear. | The email was ambiguous: "next Friday" could mean two different days.
v | rephrase | To say something again using different words to make it clearer. | Let me rephrase the question.
n | tone | The way your voice or your writing shows what you feel. | I didn't like the tone of his message; it sounded angry.
n | misconception | A belief or an idea that is wrong. | It's a common misconception that you need perfect grammar to be fluent.
pv | clear up | To explain something so that a problem or a confusion ends. | A short phone call cleared up the confusion.
pv | talk something over | To discuss something seriously, often to solve a problem. | Let's talk it over before we make a decision.
i | get your wires crossed | To misunderstand each other, so that each person thinks something different. | We got our wires crossed: I waited at the metro station while she waited at the café.
i | lost in translation | Describing a meaning or a joke that is lost when it moves into another language. | Some Egyptian jokes get lost in translation.
i | read between the lines | To understand what someone really means, not only what they say. | Reading between the lines, I think he wants to quit.
n | mixed message | Words or actions that show two opposite meanings at the same time. | She says she's not angry but won't look at me; that's a mixed message.
`
  ),
  pack(
    {
      id: 'apologies-and-forgiveness',
      group: 'talk',
      title: 'Apologies & Forgiveness',
      description: 'Say sorry properly, accept an apology and talk about forgiving and moving on.',
      level: 'B2',
      emoji: '🙏',
      warmUp: [
        'Is it easy for you to say sorry?',
        'Who in your family apologizes first after an argument?',
      ],
      grammar: {
        title: 'sorry for + V-ing, sorry to + verb, apologize for',
        points: [
          { form: 'I’m sorry for + V-ing or noun', use: 'Apologizing for something you did.', example: 'I’m sorry for being late. · Sorry for the noise.' },
          { form: 'I’m sorry to + base verb', use: 'Apologizing for what you are doing now, or showing sympathy.', example: 'Sorry to bother you, but can I ask a question? · I’m sorry to hear about your father.' },
          { form: 'apologize (to someone) for + V-ing or noun', use: 'A more formal apology.', example: 'I apologize for the delay. · He apologized to his wife for forgetting her birthday.' },
        ],
        tip: 'Say apologize for, never apologize on, and use V-ing after for: “sorry for waking you”, not “sorry for wake you”.',
      },
      discussion: [
        'What makes an apology sincere? What makes it fake?',
        'Is it harder to apologize to your parents, your friends or your boss?',
        'Do you hold a grudge, or do you forgive quickly?',
        'Should you forgive someone who never owns up to their mistake?',
        'How can you make up for hurting someone’s feelings?',
        'Is turning the other cheek a sign of strength or weakness?',
        'Can you bury the hatchet with someone without forgetting what they did?',
      ],
      task: {
        prompt: 'Leave a voice message apologizing to a friend.',
        points: [
          'Say what you did wrong (sorry for + V-ing)',
          'Show you understand how they felt',
          'Don’t make excuses',
          'Offer to make up for it',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "Last year, I forgot my best friend's engagement party because I was working late. I knew I had hurt his feelings, and I felt really remorseful. At first, I wanted to make an excuse, but I decided to own up to my mistake. I called him and said, 'I'm sorry for missing the most important night of your life. I have no excuse.' He didn't answer for three days, and I was afraid he would hold a grudge. Then he called and said, 'You owe me an apology in person.' I bought him a gift to make up for it, and we buried the hatchet over coffee. Now it's water under the bridge, and we laugh about it.",
    },
    `
n | apology | Something you say or write to show you are sorry. | I owe you an apology; I was rude yesterday.
v | forgive | To stop being angry with someone for something bad they did. | It took her a long time to forgive him.
n | grudge | A feeling of anger toward someone because of something they did in the past. | He still holds a grudge against me for a joke I made years ago.
adj | sincere | Honest and really meant. | Her apology sounded sincere; she had tears in her eyes.
adj | remorseful | Feeling very sorry for something bad that you did. | He was remorseful after shouting at his little brother.
p | hurt someone's feelings | To make someone feel sad or upset by what you say or do. | I didn't mean to hurt your feelings.
n | excuse | A reason you give, often a false one, to explain why you did something wrong. | Traffic is not an excuse; you could have left earlier.
p | owe someone an apology | To be the person who should say sorry to someone. | I think you owe your mother an apology.
pv | make up for | To do something good so that a bad thing seems less bad. | I took my wife to dinner to make up for forgetting our anniversary.
pv | own up to | To admit that you did something wrong. | Nobody owned up to breaking the printer.
i | bury the hatchet | To stop arguing and become friends again. | After years of not speaking, the two brothers buried the hatchet at Eid.
i | turn the other cheek | To choose not to react when someone hurts or insults you. | My grandfather taught me to turn the other cheek instead of fighting.
i | water under the bridge | Problems from the past that are now forgotten or forgiven. | We had a big fight in high school, but that's water under the bridge.
`
  ),
  pack(
    {
      id: 'advice-and-support',
      group: 'talk',
      title: 'Giving Advice & Offering Support',
      description: 'Comfort a friend, offer practical help and give advice without sounding judgmental.',
      level: 'B2',
      emoji: '🫶',
      warmUp: [
        'Who do you go to when you have a problem?',
        'When you’re upset, do you want advice or just someone who listens?',
      ],
      grammar: {
        title: 'Offers: Should I…?, Would you like me to…?, I’ll…, Let me…',
        points: [
          { form: 'Should I + base verb?', use: 'Offering to do something (Shall I is more formal and more British).', example: 'Should I call the doctor for you?' },
          { form: 'Would you like me to + base verb?', use: 'A polite, open offer.', example: 'Would you like me to come with you?' },
          { form: 'I’ll + base verb', use: 'An offer you decide on at the moment of speaking.', example: 'Don’t worry, I’ll pick up the kids today.' },
          { form: 'Let me + base verb', use: 'A friendly, direct offer.', example: 'Let me help you with that.' },
        ],
        tip: 'Make offers with will, not the present simple: say “I’ll carry it”, not “I carry it”.',
      },
      discussion: [
        'What is the difference between support and unsolicited advice?',
        'How do you reassure someone who is worried about an exam result?',
        'Who is your shoulder to cry on, and why do you trust them?',
        'Have you ever talked a friend out of a bad decision? What did you say?',
        'Why do some people become judgmental when friends tell them their problems?',
        'Is it better to say ’Hang in there’ or to offer practical help?',
        'How can you be there for someone who lives far away?',
      ],
      task: {
        prompt: 'A friend has just lost their job. Leave them a supportive voice message.',
        points: [
          'Show you understand how they feel',
          'Make two offers (Would you like me to…? / I’ll…)',
          'Give one piece of advice, gently',
          'End with something encouraging',
          'Use at least 4 new words',
        ],
      },
      paragraph:
        "When my friend Hana failed her driving test for the third time, she called me in tears. I didn't give her unsolicited advice; first, I just listened and tried to be empathetic. Then I reassured her that many people fail three times. I said, 'Would you like me to practice with you on Friday? I'll bring my car.' I also tried to give her some perspective: it's a test, not her whole life. I wasn't judgmental, even though she had made the same mistake twice. She told me I was a real shoulder to cry on. 'Hang in there,' I said, 'I'll always be there for you.' She passed the next month, and we celebrated together.",
    },
    `
i | a shoulder to cry on | A person who listens to your problems and comforts you. | My older sister has always been a shoulder to cry on.
adj | empathetic | Able to understand and share other people's feelings. | A good doctor is empathetic as well as skilled.
v | reassure | To say or do something to make someone less worried. | The nurse reassured me that the operation was simple.
v | comfort | To make someone feel less sad or worried. | She comforted her son after his team lost the game.
adj | judgmental | Too quick to criticize other people and their choices. | I don't tell my uncle anything because he's so judgmental.
n | perspective | A sensible way of looking at a problem, which shows how important it really is. | Talking to my grandfather helped me put my problems into perspective.
p | hang in there | Said to encourage someone to keep going in a difficult situation. | Hang in there; exams will be over in two weeks.
pv | cheer up | To make someone feel happier. | We bought her flowers to cheer her up.
pv | stand by | To continue to support someone in a difficult situation. | My friends stood by me when I was sick.
pv | talk someone out of something | To persuade someone not to do something. | My dad talked me out of quitting college.
i | lend a hand | To help someone. | Can you lend a hand with these boxes?
p | be there for someone | To be ready to help and support someone when they need you. | Whatever happens, I'll be there for you.
n | unsolicited advice | Advice that nobody asked you for. | I'm tired of unsolicited advice about when to get married.
`
  ),
];
