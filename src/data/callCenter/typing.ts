/**
 * Typing tests with the kind of text agents type all day: notes, chat
 * replies, emails. Straight quotes only, so every character can be typed.
 */
import type { TypingText } from './types';

export const TYPING_TEXTS: TypingText[] = [
  {
    id: 't-intro-notes',
    title: 'About me',
    text: "My name is Belal, and I'm a software developer from Cairo. I've been coding for three years, and I enjoy solving technical problems for people. I'm patient, organized and a fast learner. I'm applying for a technical support role because I want to help customers every day.",
  },
  {
    id: 't-login-ticket',
    title: 'Ticket: login issue',
    text: 'Customer called because he could not log in to his email. He was using a laptop. Caps Lock was on, so the password was rejected. Advised him to turn off Caps Lock and try again. Login successful. No further issues. Customer was happy with the help.',
  },
  {
    id: 't-customer-details',
    title: 'Customer details',
    text: 'Name: Karen Whitfield. Phone: 312-555-0148. Email: karen.whit@mailbox.com. Address: 2210 Lake Street, Apartment 4B, Chicago, IL 60614. Preferred contact: email. Account verified with ZIP code and date of birth.',
  },
  {
    id: 't-address-note',
    title: 'Note: address change',
    text: "Customer moved and asked to update his mailing address. Verified full name and phone number. New address confirmed by reading it back. Sent confirmation email to the address on file. Customer asked if the bill will change; explained that the price stays the same.",
  },
  {
    id: 't-experience-summary',
    title: 'Experience summary',
    text: "I graduated in 2022 with a degree in computer science. After that, I worked at a small software company for a year. Since then, I've worked as a freelance developer with clients from the US and Europe, and I've helped many of them with technical problems.",
  },
  {
    id: 't-incident-note',
    title: 'Note: internet after a storm',
    text: 'Cx reports no internet since last night after a power cut during a storm. Cx already restarted the modem. Internet light is blinking orange. Neighbor also has no service. Ran line test: signal loss in the area. Opened outage ticket and set a callback for tomorrow at 10 AM.',
  },
  {
    id: 't-hold-note',
    title: 'Chat: please hold',
    text: "Thank you for your patience. I'm checking your account now, and it should take about two minutes. Please stay in the chat, and I'll be right back with an update. If we get disconnected, I'll send you an email with everything we discussed.",
  },
  {
    id: 't-appointment-note',
    title: 'Note: technician booked',
    text: 'Line test failed, so a technician visit was booked for Friday between 2 and 4 PM. Technician will call 30 minutes before arriving. Customer was told that an adult must be home and that the modem must be easy to reach. Appointment number: A7318.',
  },
  {
    id: 't-call-summary-order',
    title: 'Note: delayed order',
    text: 'Cx called about a laptop bag ordered last week. Verified email on file. Order shipped Monday but the carrier marked it as delayed. New delivery date: Friday. If not delivered by Friday, send a replacement by express shipping at no cost. Cx agreed. Note added to the account.',
  },
  {
    id: 't-verification-note',
    title: 'Note: verification',
    text: 'Cx did not remember the security PIN. Verified with date of birth, billing ZIP code and a one-time code sent to the phone number on file. Code matched. Helped cx set a new PIN and advised not to use a birthday. Plan change completed after verification.',
  },
  {
    id: 't-probing-notes',
    title: 'Note: slow in the evenings',
    text: 'Cx says the internet is slow every evening after 7 PM for the past three days. All devices are affected, especially video streaming. No recent changes at home. Speed test from our side is normal in the morning. Likely network congestion at peak time. Monitoring for 48 hours.',
  },
  {
    id: 't-chat-clarify',
    title: 'Chat: clarifying the problem',
    text: "Thanks for reaching out! Just to make sure I understand: the app closes every time you open the camera, and it started after yesterday's update. Is that right? Could you also tell me which phone model you're using? That will help me find the fastest fix for you.",
  },
  {
    id: 't-apology-chat',
    title: 'Chat: apology and solution',
    text: "I'm really sorry that your order arrived late, and I completely understand how frustrating that is. What I can do is refund your shipping fee and add a 10% discount to your next order. I've already applied both, and you'll get a confirmation email in a few minutes.",
  },
  {
    id: 't-apology-email',
    title: 'Email: a late order',
    text: "Dear Mr. Grant, thank you for contacting us, and I'm sorry for the trouble with your order. The package was sent to the wrong warehouse, which was our mistake. A new one will be shipped today with next-day delivery, at no cost to you. Best regards, Belal, Customer Support.",
  },
  {
    id: 't-refund-email',
    title: 'Email: refund steps',
    text: "Hi Grace, I'm sorry your coffee machine arrived damaged. A prepaid return label is attached to this email. Please pack the item in any box, attach the label and drop it off at a post office. Once we receive it, your refund will be processed within 5-7 business days.",
  },
  {
    id: 't-billing-note',
    title: 'Note: prorated charge',
    text: 'Cx asked about a $24 charge on the March bill. Explained that it is a prorated charge for the new plan from March 18 to the end of the month. It is a one-time charge. Applied a $10 courtesy credit because the charge was not explained during the upgrade.',
  },
  {
    id: 't-troubleshoot-steps',
    title: 'Steps: restart the router',
    text: 'First, unplug the power cable from the back of the router. Wait for 30 seconds, then plug it back in. The lights will blink for about two minutes. Once the Internet light is solid green, open a website to test the connection. If the light turns red again, call us back.',
  },
  {
    id: 't-ticket-wifi',
    title: 'Ticket: weak Wi-Fi upstairs',
    text: 'Cx reports slow Wi-Fi in the upstairs bedroom only. Router is inside a cabinet on the ground floor. Explained that walls and distance weaken the signal. Advised moving the router to a central, high spot. If still slow, offer the Wi-Fi extender for $5 a month.',
  },
  {
    id: 't-ticket-password',
    title: 'Ticket: account locked',
    text: 'Account locked after too many failed sign-in attempts. Verified email on file. Unlocked the account and sent a reset link, which was in the spam folder. Cx reset the password on the call. Recommended two-step verification; cx agreed and turned it on.',
  },
  {
    id: 't-escalation-note',
    title: 'Note: escalation to Tier 2',
    text: 'Internet drops every evening. Reset the line, updated the settings and ran three line tests; the issue persists. Escalated to Tier 2 for an advanced line check. Warm transfer completed. Ticket #4821. If Tier 2 cannot fix it remotely, a technician visit will be scheduled.',
  },
  {
    id: 't-cover-message',
    title: 'Message: applying for a job',
    text: "Hello, my name is Belal, and I'm applying for the technical support position. I'm a software developer with three years of experience helping clients with technical problems in English. I'm flexible with shifts and available to start right away. My CV and a short voice note are attached.",
  },
  {
    id: 't-availability-email',
    title: 'Email: confirming an interview',
    text: "Dear Sarah, thank you for the invitation. I'm happy to confirm my interview on Tuesday at 11 AM. I'll bring a copy of my ID and my CV. Please let me know if there's anything else I should prepare. I look forward to meeting you. Best regards, Belal",
  },
  {
    id: 't-assessment-1',
    title: 'Assessment practice 1',
    text: 'Good customer service means solving the problem the first time. Agents who listen carefully, ask clear questions and explain the next steps usually get the best results. Customers remember how you made them feel, so a calm voice and a friendly tone are just as important as the right answer.',
  },
  {
    id: 't-assessment-2',
    title: 'Assessment practice 2',
    text: 'Technical support agents help customers with devices, apps and internet connections. A typical call starts with a greeting and verification, then moves to troubleshooting. Good agents test one fix at a time, keep the customer updated and write clear notes, so the next agent understands the case right away.',
  },
  {
    id: 't-mock-call-notes',
    title: 'Note: printer offline',
    text: 'Cx in a hurry, printer showing offline. Printer on the 2.4 GHz network, laptop on the 5 GHz network. Guided cx to connect the laptop to the same network as the printer. Test page printed. Advised cx to keep both devices on the "Home" network.',
  },
  {
    id: 't-star-story',
    title: 'A STAR story',
    text: "Last year, a client's online store stopped taking payments on the first day of a sale. My task was to fix it fast. I checked the logs, found a changed security setting, updated it and tested a small payment. The store was working again in forty minutes.",
  },
  {
    id: 't-final-1',
    title: 'Thank-you message',
    text: 'Dear Mr. Ahmed, thank you for your time today. I really enjoyed learning about the technical support team and the training program. The interview made me even more excited about this role. Please let me know if you need any more information from me. Best regards, Belal',
  },
  {
    id: 't-final-2',
    title: 'Note: a premium save',
    text: 'Cx wanted to cancel because the streaming box keeps freezing in the evening. Switched the router to a cleaner Wi-Fi channel remotely and advised using the network cable. Added one free month of the movie package. Follow-up call set for Thursday evening. Cx decided to stay.',
  },
];
