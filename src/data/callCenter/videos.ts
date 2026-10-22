/**
 * The videos the daily plan uses, checked on YouTube (length in seconds).
 * Most come from the playlists in catalog.ts; the Arabic ones are Egyptian
 * creators talking about English call center interviews.
 */
import type { VideoInfo } from './types';

const RACHEL = "Rachel's English";
const BBC = 'BBC Learning English';
const KWESTYON = 'Kwestyon';
const SINGLE_STEP = 'Single Step English';
const CC_ACADEMY = 'Call Center Academy';
const REA_NINJA = 'Rea Ninja';
const HIPRONARY = 'Hipronary School';
const COACHING = 'English coaching';

export const VIDEOS: Record<string, VideoInfo> = {
  // L1 W1
  'oWP9Riq-ZBg': { title: 'How to introduce yourself', seconds: 550, channel: RACHEL },
  '1AmS9h8g3E4': { title: 'Introduce yourself and make some friends', seconds: 242, channel: BBC },
  '4qiYg8MvsWc': { title: 'ازاي تعرّف نفسك بالانجليزي في الانترفيو', seconds: 238, channel: 'Ahmed Ezz-Elregal', arabic: true },
  '4z-sDnrs-FA': { title: 'Tell me something about yourself', seconds: 920, channel: KWESTYON },
  r09MNxGHBvI: { title: 'Call center job: English practice', seconds: 283, channel: SINGLE_STEP },
  // L1 W2
  LnXUl2e2Np0: { title: 'How to pronounce the alphabet', seconds: 494, channel: RACHEL },
  i3hd1rTVWWQ: { title: 'Listening for names, addresses, phone numbers and emails', seconds: 298, channel: CC_ACADEMY },
  bDTvkPMUF40: { title: 'Listening exercise: names, addresses, phones, emails', seconds: 257, channel: CC_ACADEMY },
  Co8fpooFWqY: { title: 'How to say the US states', seconds: 138, channel: CC_ACADEMY },
  yu6c89NUrKU: { title: 'Account verification, for beginners', seconds: 874, channel: CC_ACADEMY },
  // L1 W3
  KN2jyw6D1ak: { title: 'How to prepare for an interview', seconds: 276, channel: BBC },
  'sj-dX3fZmq0': { title: 'Answering interview questions', seconds: 231, channel: BBC },
  '45VicNg0aQI': { title: 'Why do you want to work in a call center?', seconds: 609, channel: KWESTYON },
  mTJb7ne0Mbg: { title: 'Why did you leave your last job?', seconds: 1037, channel: KWESTYON },
  '4g2vrWF-mnU': { title: 'What are your strengths?', seconds: 1099, channel: KWESTYON },
  // L1 W4
  QWBwCoecvkM: { title: 'Make polite requests', seconds: 242, channel: BBC },
  NzYxS_Xy0oM: { title: 'How to offer help', seconds: 226, channel: BBC },
  'MzhjD-XrYjg': { title: 'How to pronounce contractions', seconds: 691, channel: RACHEL },
  '2e4jGjfnRQY': { title: 'English for call centers: role-play practice', seconds: 496, channel: SINGLE_STEP },
  YqPOQLH_Evw: { title: 'Role-play: a utility company', seconds: 397, channel: SINGLE_STEP },
  // L2 W1
  '8Kqlc-SyNmA': { title: 'Call flow steps, explained', seconds: 215, channel: CC_ACADEMY },
  K6n6uspapos: { title: 'Handling customer inquiries', seconds: 616, channel: SINGLE_STEP },
  seQ5RRI6H4c: { title: 'Mock call with a call flow guide', seconds: 993, channel: KWESTYON },
  ilohgPkSj9c: { title: 'Verification scripts for call centers', seconds: 100, channel: CC_ACADEMY },
  '13SYL1xdqek': { title: 'How to succeed in a call center job', seconds: 414, channel: SINGLE_STEP },
  // L2 W2
  NPSA2pfFy1k: { title: 'How to understand fast-talking customers', seconds: 838, channel: REA_NINJA },
  '5pQcnCn6ZEU': { title: 'Troubleshooting: probing questions', seconds: 205, channel: CC_ACADEMY },
  '-stGMAQTibc': { title: "How to pronounce 'gonna' and 'gotta'", seconds: 789, channel: RACHEL },
  '0fSmHgOQy3Q': { title: 'How to avoid dead air on calls', seconds: 809, channel: KWESTYON },
  eSqzEbfiAb4: { title: 'Call center listening practice: general questions', seconds: 317, channel: CC_ACADEMY },
  // L2 W3
  'ujlp-kC6sZg': { title: 'Empathy in customer service: top 5 phrases', seconds: 230, channel: SINGLE_STEP },
  'e0sMbGp-Nzw': { title: 'Empathy & acknowledgement: speaking practice', seconds: 262, channel: CC_ACADEMY },
  Ewxa8KCfxnc: { title: 'Negative vs positive scripting', seconds: 735, channel: KWESTYON },
  JsVOye5Nj2s: { title: 'How to speak with angry customers', seconds: 514, channel: SINGLE_STEP },
  '33ozXz9F1ug': { title: 'Language to avoid in customer service', seconds: 872, channel: CC_ACADEMY },
  // L2 W4
  WIZcRCVYQ18: { title: 'Handling a billing dispute', seconds: 332, channel: SINGLE_STEP },
  wZiUgLaKNec: { title: 'Resolving a confusing billing issue', seconds: 327, channel: SINGLE_STEP },
  '0bB-QGS3wR8': { title: 'Role-play: returning an item', seconds: 252, channel: SINGLE_STEP },
  QdAP9ENItNo: { title: 'Mock call: shipping trouble', seconds: 390, channel: SINGLE_STEP },
  o34GHVojoiY: { title: 'Role-play: banking and finance', seconds: 428, channel: SINGLE_STEP },
  // L2 W5
  'iX-lwmQfOos': { title: 'Mock call practice: no internet connection', seconds: 297, channel: REA_NINJA },
  lN81K81Tzpc: { title: 'What is troubleshooting?', seconds: 545, channel: CC_ACADEMY },
  gnnzVfVEKSE: { title: 'Mock call practice: basic browser troubleshooting', seconds: 490, channel: REA_NINJA },
  LsvifVF2o_Y: { title: 'Poor vs great service: telco troubleshooting', seconds: 926, channel: KWESTYON },
  '9n84Nrsjh1A': { title: 'Telco mock call for beginners: no internet', seconds: 1840, channel: KWESTYON },
  // L2 W6
  EnYrCXXsgJM: { title: 'What tech support is really like', seconds: 939, channel: HIPRONARY },
  RsiwmpF4_s8: { title: "Tech support: software that won't work", seconds: 336, channel: HIPRONARY },
  zI01NcNV1Sw: { title: 'A supervisor call (escalation)', seconds: 505, channel: HIPRONARY },
  uUtmcnn3O2U: { title: 'Dealing with customer escalations', seconds: 512, channel: SINGLE_STEP },
  'nt78gsP4-BA': { title: 'How to handle dead-end scenarios', seconds: 645, channel: KWESTYON },
  // L3 W1
  'YFlxRB-bSkg': { title: 'Initial call center interview simulation', seconds: 489, channel: KWESTYON },
  'vrJ3Hb6-pcw': { title: 'How to pass an initial call center interview', seconds: 866, channel: KWESTYON },
  A3d0jeDQJdM: { title: 'ازاي تعدي انترفيو Vodafone UK أو Teleperformance', seconds: 633, channel: 'English with Kampa', arabic: true },
  _zpWmShXDzw: { title: 'كورس Get accepted لانترفيو الكول سنتر الانجليزي (الحلقة الأولى)', seconds: 273, channel: 'VACANCY', arabic: true },
  'tsPvthr-K0w': { title: '٣ خطوات هيخلوك تتقبل في أي English interview', seconds: 688, channel: 'Yassmin Khalid', arabic: true },
  // L3 W2
  VxOLWNzs65U: { title: 'The Versant English Speaking and Listening test, demonstrated', seconds: 573, channel: 'Pearson' },
  Pa47N7W6WaQ: { title: 'Versant test practice, parts A to F', seconds: 966, channel: KWESTYON },
  'NBV6JBNx-bs': { title: 'Story retelling technique for the Versant test', seconds: 409, channel: COACHING },
  'zXq1ei-GCOk': { title: 'Call center grammar test practice', seconds: 519, channel: REA_NINJA },
  ekfq6W3cD6E: { title: 'Versant practice: all parts, with answers', seconds: 1333, channel: COACHING },
  // L3 W3
  hH28QO2dBgM: { title: 'Interview simulation: no call center experience', seconds: 1089, channel: KWESTYON },
  PlAxAbBCKuk: { title: 'Sell me this pen: sample answers', seconds: 1072, channel: KWESTYON },
  VGDAl0e4AF4: { title: 'Describe colors to a blind person', seconds: 485, channel: KWESTYON },
  S07WDdDMnkI: { title: 'Behavioral interview questions: 10 sample answers', seconds: 1015, channel: KWESTYON },
  EzDQUBevzN8: { title: 'The final interview: how to pass', seconds: 556, channel: KWESTYON },
  // L3 W4
  cwS1oXAlsT4: { title: 'How to impress your interviewer', seconds: 699, channel: KWESTYON },
  ogu3ozlULrI: { title: 'How to pass your mock call test', seconds: 549, channel: KWESTYON },
  '81nQ4EyLFBM': { title: 'Why should we hire you? Sample answers', seconds: 928, channel: KWESTYON },
  M3ARCGEZouk: { title: 'If you failed your call center interview, watch this', seconds: 1287, channel: KWESTYON },
  uhK9zr5CWQs: { title: 'ازاي تجهز لانترفيو الكول سنتر؟ شوفوا قبل ما تترفضوا', seconds: 1967, channel: 'Sokar vlogs', arabic: true },
};
