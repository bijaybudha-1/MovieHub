/* ============================================================
   MovieHub 2026 — Centralized TMDB API Layer
   ============================================================ */

const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2Q1NTY0ODQyMWQyYTY5NDM1YmIxZGQxMTFiZGZlMiIsIm5iZiI6MTc2MjM5NTUxMC4zMDcwMDAyLCJzdWIiOiI2OTBjMDU3NmI5YzdlODM4MTU5MzRmZTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RixiipK_9oFs9wwUGOmiQFCEw2SiTTXu0qyiUOvArY0';

const TMDB_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_TOKEN}`
  }
};

const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

/* ── Image URL Helper ──────────────────────────────────────── */
function getImageUrl(path, size = 'w500', name = '') {
  if (!path) {
    if (name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a25&color=fff&size=512`;
    }
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="750" fill="%23222"%3E%3Crect width="500" height="750"/%3E%3Ctext x="250" y="375" text-anchor="middle" fill="%23555" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E';
  }
  return `${IMG_BASE}/${size}${path}`;
}

function getBackdropUrl(path) {
  return getImageUrl(path, 'original');
}

/* ── Generic Fetch ─────────────────────────────────────────── */
async function fetchTMDB(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  try {
    const res = await fetch(url.toString(), TMDB_OPTIONS);
    if (!res.ok) throw new Error(`TMDB Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('TMDB fetch error:', err);
    return null;
  }
}

/* ── Movie Endpoints ───────────────────────────────────────── */
function getTrending(mediaType = 'movie', timeWindow = 'day') {
  return fetchTMDB(`/trending/${mediaType}/${timeWindow}`);
}

function getPopularMovies(page = 1) {
  return fetchTMDB('/movie/popular', { page });
}

function getTopRatedMovies(page = 1) {
  return fetchTMDB('/movie/top_rated', { page });
}

function getUpcomingMovies(page = 1) {
  return fetchTMDB('/movie/upcoming', { page });
}

function getNowPlayingMovies(page = 1) {
  return fetchTMDB('/movie/now_playing', { page });
}

function getMovieDetails(id) {
  return fetchTMDB(`/movie/${id}`);
}

function getMovieCredits(id) {
  return fetchTMDB(`/movie/${id}/credits`);
}

function getMovieVideos(id) {
  return fetchTMDB(`/movie/${id}/videos`);
}

function getMovieKeywords(id) {
  return fetchTMDB(`/movie/${id}/keywords`);
}

function getMovieReviews(id) {
  return fetchTMDB(`/movie/${id}/reviews`);
}

function getSimilarMovies(id) {
  return fetchTMDB(`/movie/${id}/similar`);
}

function getMovieRecommendations(id) {
  return fetchTMDB(`/movie/${id}/recommendations`);
}

/* ── TV Show Endpoints ─────────────────────────────────────── */
function getPopularTVShows(page = 1) {
  return fetchTMDB('/tv/popular', { page });
}

function getTopRatedTVShows(page = 1) {
  return fetchTMDB('/tv/top_rated', { page });
}

function getTVShowDetails(id) {
  return fetchTMDB(`/tv/${id}`);
}

function getTVShowCredits(id) {
  return fetchTMDB(`/tv/${id}/credits`);
}

function getTVShowVideos(id) {
  return fetchTMDB(`/tv/${id}/videos`);
}

function getSimilarTVShows(id) {
  return fetchTMDB(`/tv/${id}/similar`);
}

function getTVShowReviews(id) {
  return fetchTMDB(`/tv/${id}/reviews`);
}

/* ── People Endpoints ──────────────────────────────────────── */
function getPopularPeople(page = 1) {
  return fetchTMDB('/person/popular', { page });
}

function getPersonDetails(id) {
  return fetchTMDB(`/person/${id}`);
}

/* ── Search ────────────────────────────────────────────────── */
function searchMulti(query, page = 1) {
  return fetchTMDB('/search/multi', { query, page });
}

function searchMovies(query, page = 1) {
  return fetchTMDB('/search/movie', { query, page });
}

function searchTVShows(query, page = 1) {
  return fetchTMDB('/search/tv', { query, page });
}

/* ── Genres ─────────────────────────────────────────────────── */
function getMovieGenres() {
  return fetchTMDB('/genre/movie/list');
}

function getTVGenres() {
  return fetchTMDB('/genre/tv/list');
}

/* ── Discover ──────────────────────────────────────────────── */
function discoverMovies(params = {}) {
  return fetchTMDB('/discover/movie', { sort_by: 'popularity.desc', include_adult: false, ...params });
}

function discoverTV(params = {}) {
  return fetchTMDB('/discover/tv', { sort_by: 'popularity.desc', include_adult: false, ...params });
}
