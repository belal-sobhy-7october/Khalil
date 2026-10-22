import { describe, expect, it } from 'vitest';
import { parseDuration, parsePodcastFeed } from './podcastFeed';

const FEED = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
<channel>
  <title><![CDATA[Daily English listening ‏استماع الإنجليزية يوميا]]></title>
  <item>
    <title><![CDATA[English Listening #3]]></title>
    <guid isPermaLink="false">c-3</guid>
    <pubDate>Tue, 03 Sep 2024 05:00:00 GMT</pubDate>
    <enclosure url="https://example.com/3.mp3?x=1&amp;y=2" length="1" type="audio/mpeg"/>
    <itunes:duration>00:05:31</itunes:duration>
  </item>
  <item>
    <title>Tom &amp; Jerry&#39;s day</title>
    <guid>c-2</guid>
    <pubDate>Mon, 02 Sep 2024 05:00:00 GMT</pubDate>
    <enclosure type="audio/mpeg" url="https://example.com/2.mp3" length="1"/>
    <itunes:duration>331</itunes:duration>
  </item>
  <item>
    <title>No audio, skipped</title>
    <guid>c-x</guid>
  </item>
  <item>
    <title>English Listening #1</title>
    <guid>c-1</guid>
    <pubDate>Sun, 01 Sep 2024 05:00:00 GMT</pubDate>
    <enclosure url="https://example.com/1.mp3" length="1" type="audio/mpeg"/>
    <itunes:duration>4:59</itunes:duration>
  </item>
</channel>
</rss>`;

describe('parsePodcastFeed', () => {
  it('reads the show title and every episode with audio, oldest first', () => {
    const feed = parsePodcastFeed(FEED);
    expect(feed.title).toBe('Daily English listening ‏استماع الإنجليزية يوميا');
    expect(feed.episodes).toEqual([
      { id: 'pod:c-1', title: 'English Listening #1', audio: 'https://example.com/1.mp3', seconds: 299, date: '2024-09-01' },
      { id: 'pod:c-2', title: "Tom & Jerry's day", audio: 'https://example.com/2.mp3', seconds: 331, date: '2024-09-02' },
      { id: 'pod:c-3', title: 'English Listening #3', audio: 'https://example.com/3.mp3?x=1&y=2', seconds: 331, date: '2024-09-03' },
    ]);
  });

  it('copes with missing parts', () => {
    expect(parsePodcastFeed('<rss><channel></channel></rss>')).toEqual({ title: '', episodes: [] });
    const [e] = parsePodcastFeed('<rss><channel><item><enclosure url="a.mp3"/></item></channel></rss>').episodes;
    expect(e).toEqual({ id: 'pod:a.mp3', title: 'Episode 1', audio: 'a.mp3', seconds: 0, date: '' });
  });

  it('reads durations in every form feeds use', () => {
    expect(parseDuration('1:02:03')).toBe(3723);
    expect(parseDuration('12:05')).toBe(725);
    expect(parseDuration('725')).toBe(725);
    expect(parseDuration('abc')).toBe(0);
    expect(parseDuration(undefined)).toBe(0);
  });
});
