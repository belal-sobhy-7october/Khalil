/** The curated course catalog joined with its generated episode lists. */
import { COURSE_CATALOG, type CatalogPlaylist, type CatalogTrack, type CourseTrackId } from './courseCatalog';
import { COURSE_EPISODES } from './courseEpisodes';

export type { CourseTrackId };

export interface CourseEpisode {
  /** YouTube video id. */
  id: string;
  title: string;
  seconds: number;
}

export interface CoursePlaylist extends CatalogPlaylist {
  episodes: CourseEpisode[];
}

export interface CourseTrack extends Omit<CatalogTrack, 'playlists'> {
  playlists: CoursePlaylist[];
}

export const COURSE_TRACKS: CourseTrack[] = COURSE_CATALOG.map((track) => ({
  ...track,
  playlists: track.playlists.map((p) => ({ ...p, episodes: COURSE_EPISODES[p.id] ?? [] })),
}));

export const isCourseTrackId = (id: unknown): id is CourseTrackId => COURSE_TRACKS.some((t) => t.id === id);

export const getCourseTrack = (id: CourseTrackId): CourseTrack => COURSE_TRACKS.find((t) => t.id === id) ?? COURSE_TRACKS[0];

export const videoThumb = (videoId: string, size: 'mqdefault' | 'hqdefault' = 'mqdefault') =>
  `https://i.ytimg.com/vi/${videoId}/${size}.jpg`;

export const videoUrl = (videoId: string, listId?: string) =>
  `https://www.youtube.com/watch?v=${videoId}${listId ? `&list=${listId}` : ''}`;
