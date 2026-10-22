/** Links the sales plan opens. Import-free. */

/** A YouTube search: used where the exact video isn't fixed, so a removed video never breaks a day. */
export const ytSearch = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
export const ytWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const ytPlaylist = (id: string) => `https://www.youtube.com/playlist?list=${id}`;
export const spotifySearch = (q: string) => `https://open.spotify.com/search/${encodeURIComponent(q)}/podcastAndEpisodes`;
