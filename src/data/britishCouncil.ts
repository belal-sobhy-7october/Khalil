/**
 * British Council LearnEnglish's graded reading lessons (A1–C1): each has a
 * preparation task, a text and two tasks, and is read on their site
 * (learnenglish.britishcouncil.org/free-resources/reading/<level>). The
 * list is in the site's order (by title); a lesson's link is its slug.
 */
export type BritishCouncilLevel = 'a1' | 'a2' | 'b1' | 'b2' | 'c1';

export interface BritishCouncilText {
  slug: string;
  title: string;
}

export const BRITISH_COUNCIL_READING: Record<BritishCouncilLevel, BritishCouncilText[]> = {
  a1: [
    { slug: 'poster-work', title: 'A poster at work' },
    { slug: 'poster-exam-candidates', title: 'A poster for exam candidates' },
    { slug: 'restaurant-menu', title: 'A restaurant menu' },
    { slug: 'study-timetable', title: 'A study timetable' },
    { slug: 'airport-departures-board', title: 'An airport departures board' },
    { slug: 'business-cards', title: 'Business cards' },
    { slug: 'dictionary-definitions', title: 'Dictionary definitions' },
    { slug: 'holiday-home-adverts', title: 'Holiday home adverts' },
    { slug: 'job-adverts', title: 'Job adverts' },
    { slug: 'notes-work', title: 'Notes at work' },
    { slug: 'student-card-application', title: 'Student card application' },
    { slug: 'text-messages-friend', title: 'Text messages to a friend' },
  ],
  a2: [
    { slug: 'message-new-friend', title: 'A message to a new friend' },
    { slug: 'airport-notice', title: 'An airport notice' },
    { slug: 'email-friend', title: 'An email from a friend' },
    { slug: 'end-term-report', title: 'An end of term report' },
    { slug: 'infographic-forgetting-curve', title: 'An infographic on the forgetting curve' },
    { slug: 'invitation-job-interview', title: 'An invitation to a job interview' },
    { slug: 'choosing-conference-venue', title: 'Choosing a conference venue' },
    { slug: 'english-course-prospectus', title: 'English course prospectus' },
  ],
  b1: [
    { slug: 'conference-programme', title: 'A conference programme' },
    { slug: 'flyer-gym', title: 'A flyer for a gym' },
    { slug: 'travel-guide', title: 'A travel guide' },
    { slug: 'email-request-help', title: 'An email request for help' },
    { slug: 'digital-habits-across-generations', title: 'Digital habits across generations' },
    { slug: 'how-spot-fake-news', title: 'How to spot fake news' },
    { slug: 'innovation-business', title: 'Innovation in business' },
    { slug: 'robot-teachers', title: 'Robot teachers' },
    { slug: 'social-media-influencers', title: 'Social media influencers' },
    { slug: 'legend-fairies', title: 'The legend of fairies' },
    { slug: 'martian-book-review', title: 'The Martian: a book review' },
  ],
  b2: [
    { slug: 'plastic-ocean-film-review', title: 'A Plastic Ocean: a film review' },
    { slug: 'short-story-extract', title: 'A short story extract' },
    { slug: 'asteroids', title: 'Asteroids' },
    { slug: 'cultural-expectations-leadership', title: 'Cultural expectations and leadership' },
    { slug: 'instant-messages', title: 'Instant messages' },
    { slug: 'millennials-workplace', title: 'Millennials in the workplace' },
    { slug: 'star-wars-hero-myth', title: 'Star Wars and the hero myth' },
    { slug: 'buy-nothing-movement', title: 'The Buy Nothing movement' },
    { slug: 'sharing-economy', title: 'The sharing economy' },
    { slug: 'why-bridges-collapse', title: 'Why bridges collapse' },
    { slug: 'work-life-balance', title: 'Work–life balance' },
  ],
  c1: [
    { slug: 'biography-kilian-jornet', title: 'A biography of Kilian Jornet' },
    { slug: 'threat-bananas', title: 'A threat to bananas' },
    { slug: 'cultural-behaviour-business', title: 'Cultural behaviour in business' },
    { slug: 'four-book-summaries', title: 'Four book summaries' },
    { slug: 'horror-film-cliches', title: 'Horror film clichés' },
    { slug: 'how-humans-evolved-language', title: 'How humans evolved language' },
    { slug: 'life-mars', title: 'Life on Mars' },
    { slug: 'managing-problem', title: 'Managing a problem' },
    { slug: 'political-manifestos', title: 'Political manifestos' },
    { slug: 'sustainable-supermarkets', title: 'Sustainable supermarkets' },
    { slug: 'state-world', title: 'The state of the world' },
  ],
};

export const britishCouncilUrl = (level: BritishCouncilLevel, slug: string) =>
  `https://learnenglish.britishcouncil.org/free-resources/reading/${level}/${slug}`;
