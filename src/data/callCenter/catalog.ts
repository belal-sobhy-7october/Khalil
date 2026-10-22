/**
 * Free YouTube playlists for Call Center Prep's video library (also the
 * "power hours" of each day). Their episodes are generated into ./episodes.ts
 * by `node scripts/sync-courses.mjs callcenter` — run it again to pick up
 * new episodes.
 *
 * Same shape as a section of ../courseCatalog.ts. This file must stay free
 * of imports so the sync script can load it.
 */

export interface CallCenterPlaylist {
  /** YouTube playlist id (the `list=` parameter). */
  id: string;
  name: string;
  /** Episodes to leave out. */
  exclude?: string[];
  /** The playlist lists its newest episode first: keep episode 1 first. */
  reverse?: boolean;
}

export interface CallCenterSource {
  kind: 'youtube';
  id: string;
  name: string;
  channel: { name: string; url: string };
  playlists: CallCenterPlaylist[];
  tidyTitles?: boolean;
}

export interface CallCenterLibrary {
  id: 'callcenter';
  name: string;
  icon: string;
  sources: CallCenterSource[];
}

export const CALL_CENTER_LIBRARY: CallCenterLibrary = {
  id: 'callcenter',
  name: 'Call Center Library',
  icon: '🎧',
  sources: [
    {
      kind: 'youtube',
      id: 'single-step',
      name: 'Single Step English',
      channel: { name: 'Single Step English · Call Center English', url: 'https://www.youtube.com/@SingleStepEnglish' },
      playlists: [{ id: 'PLQ6Jq55I6_W_yCO4J3_YSANxrGP3jfGYS', name: 'Call Center English: Role-Play Calls' }],
    },
    {
      kind: 'youtube',
      id: 'kwestyon',
      name: 'Kwestyon',
      channel: { name: 'Kwestyon · Call Center Coach', url: 'https://www.youtube.com/@Kwestyon' },
      playlists: [
        { id: 'PLQS8BRecii9FCgzwQQgwf_mA6nM96QlJZ', name: 'Call Center Job Interview Questions' },
        { id: 'PLQS8BRecii9FgChYjjgN6_cv2tA82mffg', name: 'Mock Calls with Explanation' },
        { id: 'PLQS8BRecii9ECKkF43UHXxCnAjgFKjMA-', name: 'Improve Your English for Call Center' },
      ],
    },
    {
      kind: 'youtube',
      id: 'cc-academy',
      name: 'Call Center Academy',
      channel: { name: 'Call Center Academy', url: 'https://www.youtube.com/@excellencelanguagefacilita8636' },
      playlists: [
        { id: 'PLU_eVIGNvkSVMjHLcvEcEevvZ_p2oQC_g', name: 'Call Center Listening Practice' },
        { id: 'PLU_eVIGNvkSU4CI7WrMRmmLo8Iph1zh8w', name: 'English for Customer Service' },
      ],
    },
    {
      kind: 'youtube',
      id: 'rea-ninja',
      name: 'Rea Ninja',
      channel: { name: 'Rea Ninja · Mock Call Practice', url: 'https://www.youtube.com/@ReaNinja' },
      playlists: [{ id: 'PLpEXFgzuDIjCoZSWMqX2joP0FDL24h7u6', name: 'Mock Call Practice: Season 1' }],
    },
    {
      kind: 'youtube',
      id: 'hipronary',
      name: 'Hipronary School',
      channel: { name: 'Hipronary School · Call Center Conversations', url: 'https://www.youtube.com/@HipronarySchool' },
      playlists: [{ id: 'PL7ZPPywS4nAyK2xjK2BEKna39ggo9ukxs', name: 'Call Center Conversations' }],
    },
    {
      kind: 'youtube',
      id: 'versant',
      name: 'Versant Practice',
      channel: { name: 'English coaching · Versant practice', url: 'https://www.youtube.com/@English_Coach_Mark' },
      playlists: [{ id: 'PLqtNxGjerSpet62OdOMQVVmVMxqIRDx9g', name: 'Versant English Test: Practice & Answers' }],
    },
    {
      kind: 'youtube',
      id: 'bbc-work',
      name: 'BBC English at Work',
      channel: { name: 'BBC Learning English', url: 'https://www.youtube.com/@bbclearningenglish' },
      playlists: [{ id: 'PLcetZ6gSk969oGvAI0e4_PgVnlGbm64bp', name: 'English at Work' }],
    },
    {
      kind: 'youtube',
      id: 'rachel',
      name: "Rachel's English",
      channel: { name: "Rachel's English · American accent", url: 'https://www.youtube.com/@rachelsenglish' },
      playlists: [
        { id: 'PLrqHrGoMJdTRwaQFCCDp4G88yX5D3gOdP', name: 'Where to Start' },
        { id: 'PLrqHrGoMJdTRJcd1rrp1qfYBu9VgTIfoX', name: 'Fast English: Words that Reduce' },
      ],
    },
    {
      kind: 'youtube',
      id: 'vacancy',
      name: 'VACANCY (Arabic)',
      channel: { name: 'VACANCY · كورس Get accepted', url: 'https://www.youtube.com/@mshokr2000' },
      playlists: [{ id: 'PL6YFA5xPTImSaldxdGtHgdSwsFt2SIG_i', name: 'Get Accepted: English Call Center Interview Questions', reverse: true }],
    },
  ],
};
