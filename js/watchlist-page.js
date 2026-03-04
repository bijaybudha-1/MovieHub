/* ============================================================
   MovieHub 2026 — Watchlist Page Logic
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("wl-count").textContent =
    safeParse("moviehub_watchlist").length;
  document.getElementById("fav-count").textContent =
    safeParse("moviehub_favorites").length;
  renderWatchlistGrid("watchlist-grid");
  renderFavoritesGrid("favorites-grid");

  const rec = await getPopularMovies();
  if (rec && rec.results) {
    document.getElementById("rec-scroll").innerHTML = rec.results
      .slice(0, 15)
      .map((m) => buildMovieCard(m))
      .join("");
  }
  initScrollReveal();
});
