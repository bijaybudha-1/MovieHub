/* ============================================================
   MovieHub 2026 — Profile Page Logic
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Stats
  const wl = safeParse("moviehub_watchlist");
  const ratings = safeParse("moviehub_ratings");
  const favs = safeParse("moviehub_favorites");
  const stats = getRatingStats();

  document.getElementById("stat-watchlist").dataset.count = wl.length;
  document.getElementById("stat-watchlist").textContent = wl.length;
  document.getElementById("stat-rated").dataset.count = ratings.length;
  document.getElementById("stat-rated").textContent = ratings.length;
  document.getElementById("stat-favorites").dataset.count = favs.length;
  document.getElementById("stat-favorites").textContent = favs.length;
  document.getElementById("stat-avg").textContent = stats.average;

  // Watchlist preview
  renderWatchlistPreview("profile-watchlist", 4);

  // Ratings preview
  const ratingsContainer = document.getElementById("profile-ratings");
  const ratingsList = ratings.slice(0, 4);
  if (ratingsList.length === 0) {
    ratingsContainer.innerHTML =
      '<div class="empty-state" style="padding:var(--space-xl);"><i class="bx bx-star" style="font-size:2.5rem;"></i><h3 style="font-size:var(--fs-md);">No ratings yet</h3><p style="font-size:var(--fs-sm);">Rate movies and shows to see them here!</p></div>';
  } else {
    ratingsContainer.innerHTML = ratingsList
      .map(
        (item) => `
          <div class="watchlist-card"><img src="${item.poster_path || "https://ui-avatars.com/api/?name=" + encodeURIComponent(item.title) + "&background=333&color=fff"}" alt="${item.title}" loading="lazy"><div class="watchlist-card-info"><h4>${item.title}</h4><p>⭐ ${item.rating}/10</p></div></div>
        `,
      )
      .join("");
  }

  // Dark mode toggle sync
  const dmToggle = document.getElementById("dark-mode-toggle");
  dmToggle.checked =
    document.documentElement.getAttribute("data-theme") !== "light";
  dmToggle.addEventListener("change", () => {
    const theme = dmToggle.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("moviehub_theme", theme);
  });

  initScrollReveal();
  animateCounters();
});
