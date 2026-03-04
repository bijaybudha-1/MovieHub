/* ============================================================
   MovieHub 2026 — TV Shows Page Logic
   ============================================================ */

let tvPage = 1,
  tvSort = "popularity.desc",
  tvGenre = "";

document.addEventListener("DOMContentLoaded", async () => {
  const genres = await getTVGenres();
  const genreSelect = document.getElementById("tv-genre-filter");
  if (genres && genres.genres) {
    genres.genres.forEach((g) => {
      genreSelect.innerHTML += `<option value="${g.id}">${g.name}</option>`;
    });
  }

  loadTV();

  document.getElementById("tv-sort").addEventListener("change", (e) => {
    tvSort = e.target.value;
    tvPage = 1;
    loadTV();
  });
  genreSelect.addEventListener("change", (e) => {
    tvGenre = e.target.value;
    tvPage = 1;
    loadTV();
  });

  let t;
  document.getElementById("tv-search").addEventListener("input", (e) => {
    clearTimeout(t);
    const q = e.target.value.trim();
    t = setTimeout(async () => {
      if (q.length >= 2) {
        const d = await searchTVShows(q);
        if (d && d.results)
          document.getElementById("tv-grid").innerHTML = d.results
            .map((m) => buildMovieCard(m, "tv"))
            .join("");
      } else loadTV();
    }, 400);
  });

  // Trending TV
  const trending = await getTrending("tv", "week");
  if (trending && trending.results) {
    document.getElementById("trending-tv-scroll").innerHTML = trending.results
      .slice(0, 15)
      .map((m) => buildMovieCard(m, "tv"))
      .join("");
  }

  // Top Rated TV
  const topRated = await getTopRatedTVShows();
  if (topRated && topRated.results) {
    document.getElementById("top-rated-tv-scroll").innerHTML = topRated.results
      .slice(0, 15)
      .map((m) => buildMovieCard(m, "tv"))
      .join("");
  }

  initScrollReveal();
});

async function loadTV() {
  document.getElementById("tv-spinner").style.display = "block";
  const params = { page: tvPage, sort_by: tvSort };
  if (tvGenre) params.with_genres = tvGenre;
  const data = await discoverTV(params);
  document.getElementById("tv-spinner").style.display = "none";
  if (data && data.results) {
    document.getElementById("tv-grid").innerHTML = data.results
      .map((m) => buildMovieCard(m, "tv"))
      .join("");
    initScrollReveal();
  }
}
