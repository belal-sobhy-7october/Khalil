/**
 * One natural listen-and-repeat paragraph per topic pack (keyed by pack id),
 * written with the pack's own vocabulary. Topics that aren't packs get
 * practice texts built from their example sentences instead.
 */
export const TOPIC_PARAGRAPHS: Record<string, string> = {
  'call-center-interview':
    "I graduated two years ago, and since then I've been working hard on my English. I'm a people person: I enjoy talking to customers and solving their problems. In my previous role, I handled a high volume of requests every day, and I learned to stay calm under pressure. I'm a fast learner and a team player, and I'm comfortable working rotational shifts. I'd like to start my career in customer service and grow into a team leader role.",
  'call-center-on-the-call':
    "Thank you for calling, my name is Sara. How may I help you today? I'm sorry to hear that your internet isn't working. For security purposes, could you please verify your account number? Thank you. Bear with me for a moment while I pull up your account. I can see the problem, and I've gone ahead and reset your connection. It should take effect within a few minutes. Is there anything else I can help you with today? Thank you for your patience, and have a great day!",
  'call-center-difficult-customers':
    "I completely understand how frustrating this must be, and you have every right to be upset. I'm sorry for the inconvenience. Let me see what I can do. I'm afraid I can't cancel the fee myself, but what I can do is escalate this to my supervisor and add a goodwill credit to your account today. I'll personally make sure this gets resolved. Thank you for bringing this to our attention — I really appreciate your patience.",
  'job-interview':
    "Thank you for the opportunity to interview today. I'd describe myself as reliable, proactive and detail-oriented. In my previous role, I carried out customer surveys and helped my team meet tight deadlines. I'm keen to learn, and I think I can bring strong communication skills to the table. I'm looking for an opportunity to take on more responsibility and grow with a professional company. When can I expect to hear back from you?",
  'phone-and-email':
    "Hi, I'm calling about the meeting next week. I tried to call you this morning, but I couldn't get through, so I left a voicemail. Sorry, I think we got cut off earlier. Could you call me back when you're free? I've also sent you an email with the agenda — please find the file attached. If you have any questions, please don't hesitate to reach out. I look forward to hearing from you.",
  'work-and-office':
    "This week I have a lot on my plate. My workload is heavy because a colleague is on sick leave, so I'm filling in for her. I'm trying to catch up on my emails and hand in my report before the deadline. Luckily, I get along with everyone on my team, and my supervisor gives me useful feedback. We're on a tight schedule, but if we stay on the same page, we'll finish on time. Then I'll call it a day and rest.",
  'meetings-and-discussions':
    "Let's get the ball rolling. The first item on the agenda is the new schedule. I'd like to bring up one problem: we don't have enough people on the night shift. I see what you mean about the budget, but I couldn't agree more that we need more agents. Could you clarify what you mean by 'soon'? Okay, let's put off the final decision until Monday. To sum up, everyone will come up with one solution, and we'll go over them next week.",
  'small-talk':
    "Hey, long time no see! How's it going? What have you been up to? I ran into Ahmed at the mall last week — small world! How was your weekend? Mine was quiet; I just hung out with friends and caught up on some sleep. It's been a long day, honestly, so I'd better get going soon. Anyway, it was nice talking to you. Let's catch up properly over coffee next week.",
  'opinions-and-arguing':
    "In my opinion, working from home is better for most people. The way I see it, you save time and money on commuting. On the one hand, it's harder to build relationships with colleagues; on the other hand, you can focus better. Having said that, it depends on the job. I see your point that some people feel lonely, but that's not necessarily true for everyone. Maybe we should just agree to disagree.",
  'feelings-and-personality':
    "My brother is outgoing and easy-going — he makes friends everywhere. I'm a bit more reserved, and I sometimes feel anxious before big events. Last month I had my first interview, and I was really on edge. When they called me with the offer, I was over the moon and so relieved. My mum was thrilled too. I've always looked up to her because she's patient and considerate, and she never loses her temper.",
  'shopping-and-money':
    "I needed a new phone, so I decided to shop around before buying. The first shop was overpriced, and the model I wanted was out of stock. In the second shop, I found a real bargain with a twenty percent discount. I asked if I could pay in monthly installments, and they said yes. I kept the receipt because it has a two-year warranty. I'm trying to save up now, so no more splashing out this month!",
  travel:
    "Last summer we set off early in the morning to catch our flight. We checked in online, so we only had to show our boarding passes at the gate. The flight was delayed by an hour, and we had a long layover in Dubai. When we finally arrived, my friend picked us up from the airport and dropped us off at the hotel. We spent the next day sightseeing, and we found a lovely café off the beaten track.",
  'restaurant-and-food':
    "On Friday we decided to eat out instead of ordering in. We shared a starter, and for the main course I had grilled fish. My friend asked the waiter if the chicken was spicy, because he can't eat spicy food. The portions were huge and everything was delicious, so we had leftovers to take home. When we asked for the bill, my friend said, 'Put your wallet away — it's on me.' We left a good tip.",
  health:
    "I think I'm coming down with the flu. I've had a sore throat and a headache since yesterday, and I feel a bit dizzy when I stand up. I made an appointment with the doctor this morning. She said it's nothing serious and gave me a prescription. I asked her how often I should take the medicine and whether it has any side effects. I'm feeling under the weather today, but I hope I'll be back on my feet soon.",
  'tech-everyday':
    "Thanks for calling technical support. Let's troubleshoot the problem together. First, could you walk me through what happened? Okay, so the app crashed and now your laptop keeps freezing. Have you tried restarting it? Let's turn it off and turn it on again. Now, please go to Settings and check for an update. Is the issue still occurring? Great — it's working now. Remember to back up your files regularly.",
  'daily-routine':
    "I'm a morning person, so I usually wake up at six. I get up, have a quick breakfast and get ready for work in about twenty minutes. My commute takes forty minutes by metro, and I try to avoid rush hour. After work I run some errands and pick up groceries. In the evening I do the dishes, tidy up a little and unwind with a book. By ten o'clock I'm exhausted, so I hit the sack early.",
};
