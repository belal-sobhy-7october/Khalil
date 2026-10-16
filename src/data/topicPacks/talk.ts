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
adj | chatty | Liking to talk a lot in a friendly, informal way. | My new neighbour is very chatty.
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
          { form: 'make + someone + feel + adjective', use: 'Saying what causes a feeling.', example: 'Long queues make me feel frustrated.' },
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
adj | stubborn | Refusing to change your opinion or behaviour, even when there are good reasons to. | He's so stubborn — he never admits he's wrong.
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
          { form: 'wish + someone + would + base verb', use: 'Annoyance: you want someone to change their behaviour.', example: 'I wish you would listen to me.' },
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
];
