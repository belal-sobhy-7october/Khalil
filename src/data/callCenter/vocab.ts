/**
 * The call center word bank: 384 words in 24 units of 16, one unit per study
 * day of Level 1, so the whole bank is learned in a month. Items use the same
 * `pos | word | definition | example` lines as the Topic Library packs and go
 * into the Vocabulary flashcards. Each unit ends with a short text that uses
 * its words, to hear on the device or in NaturalReader.
 *
 * Rules: README.md §5 (American spelling, the meaning the word has on a call,
 * a call center example, no word in two units).
 */
import { parseItems, type PackItem } from '../topicPacks/types';

export interface VocabUnit {
  /** `v01`…`v24`. */
  id: string;
  number: number;
  title: string;
  words: PackItem[];
  /** About five sentences that use the unit's words. */
  text: string;
}

const unit = (number: number, title: string, raw: string, text: string): VocabUnit => ({
  id: `v${String(number).padStart(2, '0')}`,
  number,
  title,
  words: parseItems(raw),
  text,
});

export const VOCAB_UNITS: VocabUnit[] = [
  unit(1, 'Call center basics', `
n | agent | A person whose job is to answer customers' calls, chats or emails for a company. | I work as an agent on a US internet account.
n | inbound call | A call that a customer makes to the company. | Most of my shift is inbound calls from people with no internet.
n | outbound call | A call that the agent makes to a customer. | On outbound calls we remind customers about their unpaid bills.
n | account | The client company and its customers that a team of agents works for. | She moved from the banking account to the tech support account.
n | queue | The list of callers waiting for the next free agent. | There were forty calls in the queue, so nobody took a break.
n | shift | The fixed hours when you work, which may be at night. | My shift starts at 6 p.m. Cairo time, when Americans wake up.
n | headset | Headphones with a microphone that agents wear to take calls. | Check that your headset is plugged in before you log in.
n | script | The words a company gives you to say at certain points of a call. | You don't have to read the script word for word, but cover every point.
n | ticket | A record of a customer's problem in the company's system, with a number. | I opened a ticket so the technical team can follow up tomorrow.
v | escalate | To pass a problem to someone with more authority or skill. | If the reset doesn't work, I'll escalate the case to Tier 2.
n | supervisor | The person in charge of a team of agents, who also takes difficult calls. | The customer asked for a supervisor, so I placed him on hold.
n | tier | A level of support: Tier 1 handles common problems and Tier 2 harder ones. | Tier 1 agents reset passwords; Tier 2 handles network problems.
n | client | The company that pays the call center to look after its customers. | Our client is a big American phone company.
n | caller | The person who is calling. | The caller didn't give his name at first.
n | workstation | The desk and computer where an agent works. | Log out of your workstation before you go on your break.
n | floor | The big room where the agents work. | The floor gets really busy on Monday mornings.
`, "I work as an agent on the floor of a big call center in Cairo. My shift starts at 6 p.m., when our client's customers in the US wake up. I put on my headset, log in to my workstation and take inbound calls from the queue. When a caller has a problem I can't fix in Tier 1, I open a ticket and escalate it. My supervisor listens to some of my calls, so I follow the script but try to sound natural."),

  unit(2, 'Customer service essentials', `
v | assist | To help someone (a more formal word). | How may I assist you today?
n | issue | A problem that a customer has. | Let me see what's causing this issue.
n | inquiry | A question you ask to get information. | We received your inquiry about the new plan.
n | complaint | Words that say you are unhappy with a product or a service. | I've logged your complaint, and a manager will review it.
v | resolve | To find an answer to a problem and end it. | We resolved the issue in less than ten minutes.
n | inconvenience | Trouble or problems that something causes you. | I'm sorry for the inconvenience this has caused.
v | appreciate | To be thankful for something. | I really appreciate your help with these steps.
n | patience | Being able to wait or stay calm without getting angry. | Thank you for your patience while I checked your account.
n | customer satisfaction | How happy customers are with a company's service. | Customer satisfaction is the number our client cares about most.
n | feedback | Opinions about how good something was, used to make it better. | Your feedback helps us train our agents.
n | policy | The official rules a company follows. | Our policy allows returns within thirty days.
pv | follow up | To contact someone again to check on something. | I'll follow up with you by email tomorrow.
v | assure | To tell someone something firmly so they stop worrying. | I can assure you that your money is safe.
v | confirm | To say or show that something is true or correct. | Can you confirm your email address for me?
n | request | Something that you ask for politely or formally. | I've sent your request to the billing team.
adj | courteous | Polite and respectful. | Even when he shouted, she stayed courteous.
`, "Good customer service starts with a courteous greeting and a simple question: how may I assist you? Every inquiry, request or complaint is a chance to resolve an issue and make someone's day better. When something goes wrong, apologize for the inconvenience and thank the customer for their patience. Confirm the details, assure them you'll take care of it, and follow up if you promise to. Their feedback decides our customer satisfaction score, and our policy is to treat every caller with respect."),

  unit(3, 'Computers & devices', `
n | device | A machine such as a phone, a laptop or a tablet. | Which device are you using right now?
n | operating system | The main software that runs a computer or a phone, such as Windows or iOS. | What operating system is on your laptop?
n | settings | The part of a device or an app where you change how it works. | Open Settings and tap Wi-Fi.
v | restart | To turn a device off and on again. | Let's restart the phone and see if the problem is still there.
pv | shut down | To turn a computer off completely. | Please shut down the laptop and wait thirty seconds.
n | software update | A new version of a program that fixes problems or adds features. | A software update is ready; it'll take about ten minutes.
v | install | To put a new program on a device so it can be used. | Can you install the app from the App Store?
v | uninstall | To remove a program from a device. | Let's uninstall the app and install it again.
n | browser | A program for visiting websites, such as Chrome or Safari. | Which browser do you use to open your account?
n | storage | The space on a device for saving files and apps. | Your phone is almost out of storage.
n | screenshot | A picture of what is on a screen. | Could you send us a screenshot of the error?
n | desktop | The main screen of a computer, with its icons. | Do you see the printer icon on your desktop?
n | icon | A small picture on a screen that you click to open something. | Click the gear icon at the top right.
n | drop-down menu | A list of choices that opens when you click it. | Choose your country from the drop-down menu.
n | pop-up | A small window that suddenly appears on the screen. | If you see a pop-up, click Allow.
v | tap | To touch a phone screen quickly with your finger. | Tap the three dots at the bottom of the screen.
`, "Most tech support calls start with one question: which device are you using? Then we check the operating system, because the settings look different on Windows, a Mac or an Android phone. Often a simple restart helps, or we shut down the laptop and turn it on again after a software update. If an app keeps failing, we uninstall it and install it again, or open the website in another browser. I always ask for a screenshot of any pop-up, so I can see exactly which icon or drop-down menu the customer means."),

  unit(4, 'Internet & home networks', `
n | router | The box that sends the internet to the devices in your home. | Is the router on, and are its lights green?
n | modem | The box that connects your home to the internet company's network. | The modem is the box the cable from the wall goes into.
n | Wi-Fi | A way to connect devices to the internet without wires. | Your laptop is connected to Wi-Fi, but there's no internet.
n | connection | The link between a device and the internet or a network. | Your connection keeps dropping every few minutes.
n | bandwidth | How much data an internet connection can carry at once. | Streaming on four TVs uses a lot of bandwidth.
n | speed test | A short test that measures how fast your internet is. | Let's run a speed test to see what speed you're getting.
n | signal | The radio waves a router or a phone tower sends, and how strong they are. | The signal is weak in the bedroom because it's far from the router.
n | Ethernet cable | A wire that connects a device straight to the router. | Can you connect the laptop with an Ethernet cable for a minute?
n | outage | A time when a service, like the internet or power, stops working in an area. | There's an outage in your area, and our team is fixing it.
v | reboot | To restart a device or a system. | I'll reboot your modem from here; it takes two minutes.
n | IP address | A number that identifies a device on a network. | The router gives each device its own IP address.
adj | blinking | Going on and off quickly (a light). | Is the internet light blinking or solid?
adj | solid | Staying on without blinking (a light). | Wait until the light is solid green.
n | network name | The name of a Wi-Fi network that you see on your devices. | Do you see your network name in the list?
n | coverage | The area where a service, like Wi-Fi or a phone network, works. | You have no coverage in the basement.
n | provider | The company that sells you a service such as the internet. | We're your internet provider, so we can test the line from here.
`, "When a customer says the internet is down, I first check for an outage in their area. If there isn't one, we look at the modem and the router: is the internet light solid or blinking? Sometimes the Wi-Fi signal is just weak, so the coverage doesn't reach every room. I might reboot the modem from my side, then ask them to run a speed test on a laptop connected with an Ethernet cable. If the speed is fine on the cable, the connection is good, and the problem is the Wi-Fi."),

  unit(5, 'Talking about yourself', `
n | background | The education and experience you have had. | I have a background in software development.
n | degree | The qualification you get when you finish university. | I have a degree in computer science.
v | graduate | To finish university and get a degree. | I graduated from university three years ago.
adj | fluent | Able to speak a language easily and well. | I practice every day to become fluent in English.
adj | flexible | Able to change your plans or hours easily. | I'm flexible with night shifts and weekends.
adj | reliable | Someone others can trust to do what they should. | My last manager said I'm the most reliable person on the team.
adj | motivated | Wanting very much to do something well. | I'm motivated to learn and grow with this company.
adj | detail-oriented | Careful to notice and get small things right. | Being detail-oriented helps me take notes without mistakes.
n | team player | Someone who works well with other people. | I'm a team player; I share what I learn with my teammates.
n | problem-solving | Finding answers to difficult problems. | Problem-solving is the part of programming I enjoy most.
v | multitask | To do several things at the same time. | Agents multitask: they talk, type notes and search the system.
n | fast learner | Someone who learns new things quickly. | I'm a fast learner, so the training won't be a problem.
n | strength | Something you are good at. | My biggest strength is staying calm under pressure.
n | weakness | Something you are not so good at yet. | One weakness I'm working on is speaking too fast.
n | goal | Something you want to achieve. | My goal is to become a team leader in two years.
adj | passionate | Having a very strong interest in something. | I'm passionate about technology and helping people use it.
`, "I have a background in software development and a degree in computer science. After I graduated, I worked on websites and apps, and I found that problem-solving is what I enjoy most. I'm a fast learner, a team player and very reliable, and I'm flexible with night shifts. My biggest strength is staying calm; my weakness is speaking too fast, so I'm working on it. My goal is to become fluent and grow into a team leader, because I'm passionate about helping people with technology."),

  unit(6, 'Jobs & hiring', `
n | applicant | A person who applies for a job. | There were two hundred applicants for twenty places.
n | candidate | A person a company is considering for a job. | The recruiter called five candidates for the final interview.
n | position | A job in a company. | I'm applying for the technical support position.
n | vacancy | A job that is free for someone to take. | They have a vacancy for an English-speaking agent.
n | recruiter | A person whose job is to find people for jobs. | The recruiter asked me to send a voice note first.
n | assessment | A test that checks your skills, often online. | The assessment had grammar, listening and typing.
n | screening call | A short first phone interview to check if you are suitable. | The screening call took about ten minutes.
v | shortlist | To choose the best people from a list for the next step. | I was shortlisted for the operations interview.
n | job offer | When a company formally offers you a job. | I got the job offer the day after the interview.
n | net salary | The money you get after taxes and other payments are taken out. | The net salary is about fifteen thousand pounds a month.
n | gross salary | Your salary before taxes and other payments are taken out. | My gross salary is higher than what I actually receive.
n | probation | The first months in a job, when the company checks if you are good enough. | The probation period is three months.
n | training | The weeks when a company teaches new employees the job. | Training lasts four weeks before you take real calls.
n | contract | A written legal agreement between you and the company. | Read the contract carefully before you sign it.
n | allowance | Extra money paid for something, like transport or night shifts. | There's a night shift allowance on this account.
n | requirement | Something a company needs a candidate to have. | B2 English is the main requirement for this job.
`, "Every vacancy gets hundreds of applicants, so the recruiter starts with a voice note or a short screening call. The best candidates are shortlisted for an online assessment and then an interview with operations. If you pass, you get a job offer with the net salary, any allowance, and the length of training. Most companies have a probation period of three months. Before you sign the contract, ask about every requirement of the position and how the salary can grow."),

  unit(7, 'Personal details', `
n | first name | Your own name, not your family name. | Could I have your first name, please?
n | last name | Your family name. | And how do you spell your last name?
n | date of birth | The day, month and year you were born. | For security, can you confirm your date of birth?
n | street address | The number and name of the street where you live. | What's the street address where the service is installed?
n | ZIP code | The numbers at the end of a US address that show the area. | Your ZIP code is 60614, correct?
n | phone number | The number you call to reach someone. | Is this the best phone number to reach you?
n | email address | The address you send someone email to. | Please spell your email address for me.
n | account number | The number a company uses to identify your account. | Your account number is at the top of your bill.
n | account holder | The person whose name the account is in. | Am I speaking with the account holder?
n | billing address | The address where a company sends your bills. | Is your billing address the same as your home address?
n | middle initial | The first letter of your middle name. | What's your middle initial?
adj | lowercase | In small letters, like a, b and c. | Your username is all lowercase.
adj | uppercase | In capital letters, like A, B and C. | The code has two uppercase letters.
n | digit | One number from 0 to 9. | Please read me the last four digits.
n | underscore | The _ sign. | It's john underscore smith at mailbox dot com.
n | hyphen | The short - sign that joins words (people also call it a dash). | Her last name has a hyphen: Smith-Lopez.
`, "Before I can help, I need a few details from the account holder. I ask for the first name, the last name and the middle initial, and I spell them back with the NATO alphabet. Then I confirm the date of birth, the street address and the ZIP code. For the email address, I check every digit, every hyphen and every underscore, and whether it's all lowercase. Finally I read the account number back slowly, because one wrong digit means the wrong customer."),

  unit(8, 'Money & numbers', `
n | amount | How much money something costs or someone pays. | The amount due is $59.99.
n | balance | The money you still owe, or the money you have in an account. | Your current balance is zero.
n | charge | An amount of money you have to pay for something. | I can see a charge of $10 on May 3rd.
n | fee | Money you pay for a service. | There's a $5 fee for paper bills.
n | rate | A fixed price for something, often per month. | Your monthly rate will stay the same for a year.
n | refund | Money that a company pays back to you. | You'll get a full refund within five business days.
n | credit | Money taken off what you owe a company. | I've added a $15 credit to your account.
n | discount | A lower price than usual. | You get a 10% discount if you pay for the whole year.
n | due date | The day by which you must pay. | The due date is the 15th of every month.
adj | overdue | Not paid by the day it should be. | Your bill is ten days overdue.
n | payment | Money that you pay. | We received your payment this morning.
n | tax | Money that people pay to the government. | The price on the website doesn't include tax.
n | total | The amount you get when you add everything up. | That comes to a total of $84.50.
n | receipt | A paper or an email that shows you paid for something. | I'll email you a receipt for the payment.
n | transaction | One payment or one movement of money. | I don't recognize this transaction on my card.
n | installment | One of several smaller payments for something expensive. | You can pay for the phone in twelve installments.
`, "Billing calls are all about numbers, so I always say amounts slowly and clearly. A customer might ask why their balance is higher, and I explain each charge, fee and tax on the bill. If we charged them twice, I offer a refund or a credit, and I tell them when they'll see it. When a payment is overdue, I explain the due date and offer to split the total into installments. At the end, I send a receipt so they have a record of every transaction."),

  unit(9, 'Time & scheduling', `
n | appointment | A fixed time to meet someone or for a visit. | Your appointment is Tuesday between 8 and 10 a.m.
v | schedule | To plan something for a certain time. | I'll schedule a technician for tomorrow morning.
v | reschedule | To change the time of something that was planned. | Would you like to reschedule the visit?
adj | available | Free to do something, or free to be used. | The earliest available time is Friday.
n | time slot | A period of time kept for something, like a visit. | Which time slot works best for you?
n | business day | A working day, Monday to Friday, that isn't a holiday. | It takes three to five business days.
p | within 24 hours | In no more than 24 hours. | You'll get an email within 24 hours.
p | as soon as possible | At the earliest time you can. | I'll send you the details as soon as possible.
n | time zone | One of the areas of the world that has its own time. | What time zone are you in, Eastern or Central?
n | callback | A phone call to someone who called you before. | I've set up a callback for 3 p.m. your time.
n | deadline | The time by which something must be done. | The deadline to return the item is May 30th.
adj | estimated | Guessed as closely as possible, but not exact. | The estimated wait time is five minutes.
adv | overnight | During the night, until the next morning. | The update will run overnight.
p | in the meantime | While you wait for something to happen. | In the meantime, you can use your mobile data.
n | weekday | Any day from Monday to Friday. | Our store is open on weekdays only.
adj | upcoming | Happening soon. | You'll see the credit on your upcoming bill.
`, "When a customer needs a technician, I check which time slot is available and schedule the appointment. I always confirm their time zone, because 9 a.m. Eastern is not 9 a.m. Pacific. If they can't make it, we can reschedule on any weekday, and the technician calls within 24 hours to confirm. The estimated arrival time is a two-hour window. In the meantime, I set up a callback, so they know someone will follow up as soon as possible."),

  unit(10, 'Verification & security', `
v | verify | To check that something, like a person's identity, is true. | Before we start, I need to verify your identity.
n | security question | A personal question you answer to prove who you are. | What's the answer to your security question?
n | PIN | A secret number you use to get into an account. | Can you give me your four-digit PIN?
n | one-time code | A code sent to you that works only once. | I've sent a one-time code to your phone.
n | authorized user | A person who is allowed to use or manage an account. | You're not listed as an authorized user, so I can't make changes.
adj | unauthorized | Done without permission. | We noticed an unauthorized login from another country.
n | identity | Who someone is. | We take these steps to protect your identity.
n | fraud | Using lies or tricks to get money illegally. | If you think this is fraud, we'll block the card right now.
adj | suspicious | Making you think something is wrong or illegal. | Don't click links in suspicious emails.
v | lock | To stop an account from being used. | We locked the account after three wrong passwords.
n | privacy | Keeping someone's personal information secret. | For privacy reasons, I can only speak to the account holder.
adj | confidential | Secret, and only to be shared with certain people. | Your card number is confidential; never share it.
n | scam | A dishonest plan to get someone's money. | That call wasn't from us; it was a scam.
v | protect | To keep someone or something safe. | These questions protect your account.
v | match | To be the same as something. | That date doesn't match our records.
n | record | Information that is kept about something, often in a system. | Our records show a different phone number.
`, "Before I make any change, I need to verify the caller's identity. I ask the security question or send a one-time code, and the answer has to match our records. If they aren't the account holder or an authorized user, I can't discuss the account, for privacy reasons. When a customer reports a suspicious or unauthorized transaction, we lock the account and investigate the fraud. I remind them that their PIN is confidential, and that we will never ask for it in an email; that's how a scam works."),

  unit(11, 'Orders & delivery', `
n | order | Something you ask a company to send you and pay for. | I'm calling about my order from last week.
n | order number | The number that identifies an order. | What's the order number? It starts with two letters.
n | tracking number | A number you use to see where a package is. | Here's the tracking number for your package.
n | shipment | A group of goods that are sent together. | Your order will come in two shipments.
v | ship | To send goods to someone. | The item will ship tomorrow.
n | delivery | When goods are brought to your home. | Delivery takes three to five business days.
n | carrier | The company that delivers packages, like UPS or FedEx. | The carrier shows the package as delivered.
n | package | A box of goods sent by post or by a delivery company. | The package was left at your front door.
p | out for delivery | On the truck and arriving today. | Good news: your order is out for delivery.
adj | delayed | Later than planned. | Your delivery is delayed because of the storm.
n | warehouse | A big building where goods are kept before they are sent. | The item is still at our warehouse.
p | in stock | Available to buy now. | That color is back in stock.
p | out of stock | Not available to buy right now. | Sorry, that model is out of stock.
n | backorder | An order for something that isn't in stock yet, to be sent later. | Your headphones are on backorder until June.
n | shipping address | The address where an order is sent. | Is the shipping address still correct?
v | cancel | To stop something that was planned or ordered. | I can cancel the order because it hasn't shipped yet.
`, "Most retail calls start with an order number. I check whether the item was in stock or on backorder, and when it left the warehouse. If it has shipped, I give the customer the tracking number and the name of the carrier. When a delivery is delayed, I explain why and give a new date; if the package is out for delivery, it should arrive today. If it hasn't shipped yet, I can still change the shipping address or cancel the order."),

  unit(12, 'On the phone', `
v | dial | To press the numbers to call someone. | Dial 1 to talk to the billing team.
pv | pick up | To answer the phone. | Nobody picked up when I called back.
pv | hang up | To end a phone call. | Please don't hang up; I'll be right back.
pv | call back | To phone someone again, or to return their call. | I'll call you back in ten minutes.
pv | hold on | To wait for a short time. | Hold on a second while I check.
p | on hold | Waiting on the phone while the other person does something. | Sorry to keep you on hold for so long.
v | mute | To turn off the sound of a microphone. | I'll mute my line while the page loads.
v | drop | (of a call) To end suddenly because of a problem. | If the call drops, I'll call you right back.
n | line | A phone connection, or a phone number. | The line is very quiet; can you hear me?
n | extension | The number of one phone inside a company. | My extension is 4021.
n | voicemail | A system that records messages when you don't answer. | I left you a voicemail this morning.
n | speakerphone | A phone setting that lets you talk without holding the phone. | Can you put me on speakerphone while you check the router?
n | background noise | Sounds around you that make it hard to hear. | There's a lot of background noise; are you outside?
pv | break up | (of a voice on the phone) To become unclear because of a bad signal. | You're breaking up; could you repeat that?
n | caller ID | A feature that shows who is calling. | Our number may show on your caller ID as unknown.
v | transfer | To send a call to another person or team. | I'm going to transfer you to the billing team.
`, "Phone English has its own words. When the line is bad, you might hear the customer breaking up, or a lot of background noise. Before you put someone on hold, ask them to hold on, and tell them how long it will take. If the customer needs another team, transfer the call or give them the extension to dial. And if the call drops, call back right away; if nobody picks up, leave a short voicemail."),

  unit(13, 'Work experience verbs', `
v | handle | To deal with something or someone as part of your job. | I handled about sixty calls a day.
pv | deal with | To take action to solve a problem or help someone. | I know how to deal with angry customers.
v | achieve | To succeed in doing something after a lot of effort. | Our team achieved a 95% quality score.
v | improve | To make something better. | I improved my typing speed to forty words per minute.
v | train | To teach someone the skills for a job. | I trained two new interns on our tools.
v | lead | To be in charge of a group of people. | I led a small team of three developers.
v | coordinate | To organize people so they work well together. | I coordinated with the design team every week.
v | communicate | To share information with other people. | It's important to communicate clearly with clients.
v | collaborate | To work together with others on something. | We collaborated with the support team to fix bugs.
v | maintain | To keep something working and in good condition. | I maintained the company's website for a year.
v | develop | To build or create something over time. | I developed a booking system for a clinic.
v | support | To help someone, especially with technical problems. | I supported fifty users with their computers.
v | increase | To make something bigger. | We increased customer satisfaction by ten points.
v | reduce | To make something smaller or less. | The new tool reduced our handle time.
p | meet a target | To reach a number or a goal you were given. | I met my target every month last year.
n | responsibility | Something it is your duty to deal with as part of your job. | My main responsibility was answering client emails.
`, "In an interview, strong verbs make your experience sound real. As a developer, I developed and maintained websites, and I collaborated with designers every week. I supported users when something broke, so I learned to communicate clearly and deal with stressed people. In my last project, I led a small team and trained two interns. Together we reduced the number of bugs, improved the app's speed and met every target we were given."),

  unit(14, 'When things go wrong', `
n | error message | A message on the screen that says something has gone wrong. | What does the error message say, word for word?
n | bug | A mistake in a program that makes it work badly. | It's a known bug, and the next update will fix it.
v | crash | (of a program) To suddenly stop working. | The app crashes every time I open it.
v | freeze | (of a screen or a computer) To stop moving or responding. | My laptop froze in the middle of a video call.
n | glitch | A small problem that stops something working properly for a short time. | It was just a glitch; it's working now.
adj | down | (of a system or a website) Not working. | The website is down for maintenance.
adj | slow | Taking more time than usual. | The internet is really slow in the evening.
adj | stuck | Not able to move forward. | The update is stuck at 45%.
adj | unresponsive | Not reacting when you click or touch it. | The screen is completely unresponsive to touch.
adj | faulty | Not working properly because something is wrong with it. | The technician replaced a faulty cable.
adj | defective | Made with a fault from the start. | We'll send a new one if it's defective.
adj | damaged | Broken or harmed. | The box arrived damaged.
adj | intermittent | Stopping and starting again, not happening all the time. | It's an intermittent problem; it happens a few times a day.
n | malfunction | When a machine doesn't work as it should. | A power cut caused the malfunction.
n | maintenance | Work done to keep a system working well. | Scheduled maintenance is tonight from 1 to 3 a.m.
n | root cause | The main reason a problem happens. | We found the root cause: an old printer driver.
`, "Customers describe problems in many ways. The app crashes, the screen freezes, or the update is stuck at 45%. Sometimes the website is down for maintenance, and sometimes it's just a glitch that disappears. An intermittent problem is the hardest, because it doesn't happen while you're on the call. I always ask for the exact error message, then look for the root cause: a bug, a faulty cable or a defective device."),

  unit(15, 'Troubleshooting steps', `
v | troubleshoot | To find and fix the cause of a problem, step by step. | Let's troubleshoot this together.
v | power cycle | To turn a device off, wait, and turn it on again. | Let's power cycle the modem.
v | unplug | To take a cable out of the power or out of a device. | Unplug the router for thirty seconds.
pv | plug in | To connect something to the power or to another device. | Now plug it back in.
p | clear the cache | To delete the temporary files a browser or an app has saved. | Clearing the cache usually fixes the loading problem.
pv | log out | To leave your account on a website or an app. | Log out of the app and log back in.
pv | sign in | To enter your details to use an account. | Sign in with your email and password.
v | reinstall | To install a program again. | If it still crashes, reinstall the app.
p | run a scan | To let a program check a device for problems or viruses. | Let's run a scan to check for viruses.
v | restore | To bring something back to how it was before. | You can restore your photos from the backup.
n | factory reset | Putting a device back to how it was when new, which deletes everything. | A factory reset deletes all your data, so let's back up first.
pv | rule out | To decide that something is not the cause. | Let's rule out the cable first.
v | toggle | To switch a setting on or off. | Toggle airplane mode on and off.
n | step | One of a series of actions. | Let's go step by step.
n | workaround | A way to get around a problem until it is fixed. | Here's a workaround until the update comes out.
n | driver | Software that lets a computer use a device, like a printer. | Your printer needs a new driver.
`, "Good troubleshooting is one step at a time, starting with the simplest fix. First, we power cycle the device: unplug it, wait thirty seconds and plug it back in. If the problem is in an app, we log out and sign in again, clear the cache, or reinstall it. Each step helps us rule out a possible cause. If nothing works, we may need a factory reset, or a workaround until the real fix comes."),

  unit(16, 'Feelings & empathy', `
adj | frustrated | Annoyed because you can't do what you want to do. | I understand how frustrated you must be.
adj | upset | Unhappy and worried because something bad happened. | She was upset because her order was late.
adj | annoyed | A little angry. | He was annoyed about waiting on hold.
adj | confused | Not able to understand something. | Many customers are confused by the new bill.
adj | worried | Unhappy because you think something bad may happen. | Please don't be worried; your data is safe.
adj | disappointed | Sad because something wasn't as good as you hoped. | I'm sorry you're disappointed with the service.
adj | relieved | Happy because a worry has gone. | She sounded relieved when the internet came back.
adj | satisfied | Pleased with what you got. | Are you satisfied with the solution today?
adj | understandable | Easy to understand why someone feels or acts that way. | Your reaction is completely understandable.
adj | stressful | Making you feel worried and tense. | Losing the internet before a deadline is stressful.
v | reassure | To make someone feel less worried. | I reassured him that the charge would be removed.
v | empathize | To understand and share someone's feelings. | Good agents empathize before they try to solve.
n | empathy | Understanding how someone else feels. | A little empathy calms most angry callers.
pv | calm down | To become less angry or upset. | She calmed down once she knew we'd fix it.
n | tone | The way your voice sounds, which shows how you feel. | Keep a warm tone, even when the customer is rude.
adj | polite | Speaking and behaving in a respectful way. | Stay polite, even if the caller isn't.
`, "Customers rarely call when they're happy; they're frustrated, upset, confused or worried. Before you fix anything, empathize: tell them their feelings are understandable. A warm tone and a little empathy help an annoyed caller calm down. Then reassure them with a clear plan, so the stressful situation feels under control. When the problem is solved, they sound relieved, and a satisfied customer remembers how polite you were."),

  unit(17, 'Bills & plans', `
n | bill | A paper or a message that shows how much you have to pay. | Your bill this month is higher because the promotion ended.
n | billing cycle | The period of time that one bill covers. | Your billing cycle runs from the 1st to the 30th.
n | statement | A document that lists your payments and charges. | You can download your statement from the app.
n | invoice | A list of things sold, with the amount to pay, sent to a customer. | I'll email you a copy of the invoice.
n | plan | A package of services you pay for every month. | You're on the 300-megabit plan.
n | subscription | Paying regularly to use a service. | You can cancel your subscription anytime.
v | upgrade | To change to a better or more expensive plan or product. | Would you like to upgrade to faster internet?
v | downgrade | To change to a cheaper or smaller plan. | If you downgrade, your bill will go down by $20.
adj | prorated | Charged only for the part of the period you used. | The first bill is prorated, so it's smaller.
n | late fee | Extra money you pay because you paid late. | I've removed the late fee as a one-time courtesy.
n | autopay | A setting that pays your bill automatically every month. | Would you like to set up autopay?
n | payment method | The way you pay, such as a card or a bank account. | Do you want to update your payment method?
v | overcharge | To make someone pay too much money. | You were overcharged by $12, and I've fixed it.
v | dispute | To say officially that a charge is wrong. | You can dispute the charge with your bank.
v | waive | To decide not to make someone pay something. | I can waive the fee this time.
n | promotion | A special lower price for a limited time. | Your twelve-month promotion ended last month.
`, "The most common billing question is: why is my bill higher this month? Usually the promotion ended, or the first bill was prorated because the plan started in the middle of the billing cycle. I explain the statement line by line, and if we overcharged the customer, I correct it. If they paid late, I can sometimes waive the late fee and suggest autopay with a saved payment method. Some customers decide to downgrade their plan, and others upgrade when they hear what they're getting."),

  unit(18, 'Accounts & passwords', `
n | username | The name you use to sign in to an account. | Your username is your email address.
n | password | A secret word you use to sign in. | Your password needs at least eight characters.
n | credentials | Your username and password. | Never share your login credentials with anyone.
n | profile | The page with your personal information in an account or an app. | You can change your photo in your profile.
n | reset link | A link sent by email that lets you make a new password. | Click the reset link in the email we sent.
v | expire | To stop being valid after a certain time. | The link expires in fifteen minutes.
p | locked out | Not able to get into your account. | I've been locked out of my account since yesterday.
v | recover | To get back something you lost, like an account. | Let's recover your account with your phone number.
n | recovery email | A second email address used to get back into your account. | Do you have a recovery email on the account?
n | two-step verification | A security step where you enter a code as well as your password. | Two-step verification keeps hackers out.
pv | sign up | To create a new account. | You can sign up with your Google account.
v | deactivate | To turn off an account, usually so it can be turned on again later. | I've deactivated the old account.
v | update | To make information newer or correct it. | Let's update the phone number on your account.
n | character | A letter, a number or a sign. | Use at least one special character, like @.
adj | case-sensitive | Treating capital letters and small letters as different. | Remember, the password is case-sensitive.
n | security code | A short code used to prove who you are. | Enter the security code from the text message.
`, "Being locked out of an account is one of the most common reasons people call. First, I check the username and remind them that the password is case-sensitive. If that doesn't work, I send a reset link to the recovery email; it expires in fifteen minutes, so they should use it right away. The new password needs at least eight characters, including a number and a special character. Before we finish, I suggest two-step verification, so a security code protects their credentials."),

  unit(19, 'Useful adverbs', `
adv | certainly | Used to say yes politely and strongly. | Certainly, I can help you with that.
adv | absolutely | Completely; also a strong way to say yes. | You're absolutely right to call us about this.
adv | unfortunately | Used to say that something is sad or disappointing. | Unfortunately, that item is no longer available.
adv | actually | In fact; used to add something true or surprising. | Actually, there's an easier way to do this.
adv | currently | At the present time. | We're currently having an outage in your area.
adv | immediately | Right now, without waiting. | I'll send the email immediately.
adv | temporarily | For a short time only. | The service is temporarily unavailable.
adv | permanently | Forever. | The account will be permanently deleted.
adv | eventually | In the end, after a long time. | Eventually, we found the problem.
adv | briefly | For a short time, or in a few words. | Let me briefly explain what happened.
adv | completely | Totally. | I completely understand how you feel.
adv | exactly | Correctly, with every detail. | That's exactly what I needed.
adv | approximately | Almost exactly; about. | It takes approximately two hours.
adv | recently | Not long ago. | Have you recently changed your password?
adv | automatically | Without anyone doing it by hand. | The app updates automatically.
adv | successfully | In a way that works or gets the result you want. | Your payment went through successfully.
`, "Small adverbs make you sound like a native agent. Certainly and absolutely are polite ways to say yes, and unfortunately softens bad news. Currently, we're having an outage, so the service is temporarily unavailable. It should be back in approximately two hours, and your router will reconnect automatically. Let me briefly explain what happened, so you know exactly what to expect."),

  unit(20, 'The call flow', `
n | greeting | The words you say when you start a call. | Use the full greeting: the company, your name and an offer to help.
n | closing | The last part of a call. | A good closing includes a short recap.
n | recap | A short summary of what was said or done. | Let me give you a quick recap.
v | probe | To ask questions to find out more. | Probe before you suggest a fix.
v | paraphrase | To say what someone said in your own words. | Paraphrase the problem to show you understood.
v | acknowledge | To show that you heard and understood someone. | Always acknowledge the customer's feelings first.
n | resolution | The answer or the end to a problem. | The customer wants a resolution today.
n | first call resolution | Solving a customer's problem on the first call. | First call resolution is one of our main goals.
n | case number | A number that identifies a customer's problem in the system. | Here's your case number for future calls.
n | reference number | A number you give someone so they can find a record later. | Please write down your reference number: 77412.
n | note | A short written record of what happened on a call. | Write clear notes so the next agent understands.
n | documentation | Written records of calls and problems. | Good documentation saves time later.
n | dead air | Silence on a call when nobody speaks. | Avoid dead air: tell the customer what you're doing.
n | hold time | How long a customer waits on hold. | Keep the hold time under two minutes.
n | warm transfer | Transferring a call after you explain the case to the next person. | I'll do a warm transfer, so you don't have to repeat yourself.
n | knowledge base | A collection of articles that explain how to fix problems. | I checked the knowledge base for that error code.
`, "Every call has the same flow. It starts with a greeting, then you verify the customer, probe for the real problem and paraphrase it to check you understood. While you search the knowledge base, avoid dead air and keep the hold time short. The goal is first call resolution; if you can't solve it, do a warm transfer and give a case number. In the closing, give a recap, and then write clear notes for the documentation."),

  unit(21, 'KPIs & the workplace', `
n | average handle time | The average length of a call, including hold time and notes (AHT). | Our average handle time target is six minutes.
n | CSAT | Customer satisfaction score: how happy customers say they are after a call. | My CSAT went up after I slowed down.
n | NPS | Net Promoter Score: how likely customers are to recommend the company. | The client looks at our NPS every week.
n | adherence | How closely you follow your work schedule. | Adherence means being on the phone when you should be.
n | quality assurance | Checking calls to make sure agents follow the standards (QA). | Quality assurance listened to five of my calls.
n | metric | A number used to measure how well something is done. | Handle time is just one metric.
n | target | A number or a result you are expected to reach. | My target is a 95% quality score.
n | performance | How well someone does their job. | My performance review is next week.
n | coaching | Help from a team leader to improve your work. | After coaching, my scores went up.
n | break | A short rest from work. | I have a fifteen-minute break at 9 p.m.
n | overtime | Extra hours you work after your normal hours. | We get paid for overtime.
n | team leader | The person who manages a small group of agents. | My team leader listens to my calls every week.
n | attendance | Being at work on time every day you should be. | Good attendance is part of the bonus.
n | incentive | Extra money or a prize to encourage you to work well. | There's a monthly incentive for high CSAT.
n | headcount | The number of people working in a team or a company. | They're increasing the headcount on the account.
n | escalation rate | How often an agent passes calls to someone higher. | A low escalation rate shows you solve problems yourself.
`, "In a call center, your performance is measured with metrics. The big ones are average handle time, CSAT, NPS and the escalation rate. Quality assurance listens to your calls, and your team leader uses them for coaching. Adherence and attendance matter too: be on the phone when your schedule says so, and take your break on time. Agents who meet every target can earn an incentive, and some accounts pay for overtime."),

  unit(22, 'Returns & complaints', `
n | return | Sending back something you bought. | You can start a return from your account.
n | exchange | Swapping something you bought for something else. | Would you like an exchange or a refund?
n | replacement | A new item that takes the place of a broken one. | We'll ship a replacement today.
n | warranty | A promise to repair or replace a product if it breaks within a certain time. | The laptop is still under warranty.
adj | eligible | Allowed by the rules to do or get something. | Your order is eligible for a free return.
n | store credit | Money you can spend only in that store. | We can give you store credit instead.
n | return label | A label with the address for sending an item back. | I'll email you a prepaid return label.
n | compensation | Money or something else you get because of a loss or a problem. | As compensation, we've added a free month.
n | claim | An official request for money or a repair. | I've opened a claim for the damaged item.
v | investigate | To look into something carefully to find out what happened. | We'll investigate what happened to your package.
n | apology | Words that say you are sorry. | Please accept my apology for the delay.
n | goodwill gesture | Something a company gives to show it cares, though it doesn't have to. | As a goodwill gesture, I've removed the delivery fee.
adj | non-refundable | That cannot be paid back. | The installation fee is non-refundable.
n | condition | The state that something is in. | The item must be in its original condition.
n | original packaging | The box and the materials something came in when you bought it. | Please return it in the original packaging.
n | proof of purchase | Something that shows you bought an item, like a receipt. | We need proof of purchase for warranty claims.
`, "When a product breaks, the customer usually wants a return, an exchange or a replacement. First, I check if they're eligible: is it within thirty days, and is it in its original condition and packaging? If the item is under warranty, I open a claim and ask for proof of purchase. When the problem was our fault, I give a sincere apology and sometimes a goodwill gesture or compensation. If they can't get a refund, I can offer store credit and email a return label."),

  unit(23, 'Mobile & telecom', `
n | mobile data | Internet on a phone that uses the phone network. | Turn on your mobile data while the Wi-Fi is down.
n | roaming | Using your phone in another country, on another company's network. | Roaming charges apply when you travel abroad.
n | SIM card | A small card in a phone that connects it to a network. | Try taking out the SIM card and putting it back in.
n | hotspot | Using your phone to share its internet with other devices. | You can use your phone as a hotspot for the laptop.
n | data cap | The most data you can use in a month on your plan. | You've reached your data cap for this month.
adj | unlimited | With no limit. | Your plan has unlimited calls and texts.
n | text message | A short written message sent by phone. | We'll send you a text message with the code.
n | dead zone | A place where there's no phone signal. | The basement is a dead zone.
n | bundle | Several services sold together for one price. | The TV and internet bundle saves you $30 a month.
v | activate | To make something start working. | Your new SIM card is activated.
v | port | To move your phone number to another company. | You can port your number to us for free.
n | bars | The little lines on a phone that show how strong the signal is. | How many bars do you have right now?
pv | top up | To add more money to a prepaid phone. | You can top up online in two minutes.
adj | prepaid | Paid for before you use it. | It's a prepaid line, so there's no monthly bill.
n | handset | A mobile phone (the device itself). | Is the problem with the handset or the SIM card?
n | dropped call | A call that ends suddenly because of a bad signal. | She gets dropped calls every time she's at home.
`, "Telecom accounts have their own vocabulary. A customer with dropped calls might live in a dead zone, with only one or two bars of signal. If their mobile data stops working, they may have reached their data cap, or they're roaming abroad without the right bundle. New customers can port their number to us, and we activate the SIM card the same day. Prepaid customers top up online, while others prefer an unlimited plan."),

  unit(24, 'Phrasal verbs for calls', `
pv | look into | To try to find out about a problem. | I'll look into it and call you back.
pv | sort out | To fix a problem. | Let's get this sorted out today.
pv | set up | To prepare something so it can be used. | I can help you set up the new router.
pv | turn on | To make a device start working. | Turn on the Wi-Fi on your phone.
pv | turn off | To make a device stop working. | Turn off the computer completely.
pv | back up | To make a copy of your files in case they are lost. | Back up your photos before the reset.
pv | run out of | To use all of something, so there is none left. | You've run out of data for this month.
pv | fill out | To write the information a form asks for. | Please fill out the short survey after the call.
pv | go through | To explain or check something step by step. | Let me go through the steps with you.
pv | figure out | To understand something, or find the answer to it. | We'll figure out what's wrong.
pv | get back to | To contact someone later with an answer. | I'll get back to you by Friday.
pv | carry on | To continue. | Carry on with the next step.
pv | find out | To learn something you didn't know. | Let me find out why the charge is there.
pv | come up | (of a message or a problem) To appear. | What comes up on the screen?
pv | check in | To contact someone to see how things are going. | I'll check in with you tomorrow.
pv | put through | To connect someone on the phone to another person. | I'll put you through to my supervisor.
`, "Native speakers use phrasal verbs all the time on calls. A customer might say they ran out of data, or that an error came up when they turned on the laptop. You answer: let me look into it, and we'll figure out what's wrong together. Then you go through the steps one by one, ask them to back up their files, and sort out the problem or set up the device again. If you can't fix it, you promise to get back to them, check in the next day, and ask them to fill out the survey."),
];

/** Every word in the bank, with its unit. */
export const VOCAB_WORDS: Array<PackItem & { unitId: string }> = VOCAB_UNITS.flatMap((u) => u.words.map((w) => ({ ...w, unitId: u.id })));

/** The flashcard category a unit's words go into. */
export const vocabCategory = (u: VocabUnit) => `Call Center Vocab ${String(u.number).padStart(2, '0')}: ${u.title}`;

export const getVocabUnit = (id: string) => VOCAB_UNITS.find((u) => u.id === id);
