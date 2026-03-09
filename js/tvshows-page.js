/* ============================================================
   MovieHub 2026 — TV Shows Page Logic
   ============================================================ */

let tvPage = 1,
  tvSort = "popularity.desc",
  tvGenre = "",
  tvTotalPages = 1;

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

  // Trending TV (Backdrop Slider)
  const trending = await getTrending("tv", "week");
  if (trending && trending.results) {
    const container = document.getElementById("trending-tv-scroll");
    container.className = "backdrop-scroll";
    container.innerHTML = trending.results
      .slice(0, 10)
      .map((m) => {
        const backdrop = getImageUrl(m.backdrop_path, "w780");
        return `
        <a href="tv-details.html?id=${m.id}" class="backdrop-card reveal">
          <img src="${backdrop}" alt="${m.name}" loading="lazy">
          <div class="backdrop-overlay">
            <div class="movie-card-actions" style="margin-bottom: var(--space-sm)">
              <button class="btn-icon action-watchlist" title="Add to Watchlist" data-id="${m.id}" data-title="${m.name}" data-poster="${getImageUrl(m.poster_path)}" data-type="tv">
                <i class="bx bx-bookmark"></i>
              </button>
              <button class="btn-icon action-favorite" title="Favorite" data-id="${m.id}" data-title="${m.name}" data-poster="${getImageUrl(m.poster_path)}" data-type="tv">
                <i class="bx bx-heart"></i>
              </button>
            </div>
            <h3>${m.name}</h3>
            <p>${m.vote_average.toFixed(1)} Rating</p>
          </div>
        </a>
      `;
      })
      .join("");
    setupScrollButtons(
      "trending-tv-scroll",
      "trending-tv-prev",
      "trending-tv-next",
    );
  }

  // Top Rated TV
  const topRated = await getTopRatedTVShows();
  if (topRated && topRated.results) {
    document.getElementById("top-rated-tv-scroll").innerHTML = topRated.results
      .slice(0, 15)
      .map((m) => buildMovieCard(m, "tv"))
      .join("");
    setupScrollButtons(
      "top-rated-tv-scroll",
      "top-rated-tv-prev",
      "top-rated-tv-next",
    );
  }

  // New Sections:
  // 6. Binge-Worthy Series
  const binge = await discoverTV({
    sort_by: "vote_count.desc",
    "vote_count.gte": 5000,
  });
  if (binge && binge.results) {
    document.getElementById("binge-grid").innerHTML = binge.results
      .slice(0, 8)
      .map((m) => buildMovieCard(m, "tv"))
      .join("");
  }

  // 7. Streaming Originals
  const originals = await discoverTV({
    with_networks: "213|1024|2739|4330", // Netflix, Amazon, HBO, Apple TV+
  });
  if (originals && originals.results) {
    document.getElementById("originals-scroll").innerHTML = originals.results
      .slice(0, 15)
      .map((m) => buildMovieCard(m, "tv"))
      .join("");
    setupScrollButtons("originals-scroll", "originals-prev", "originals-next");
  }

  // 8. TV Throwbacks (List View)
  const throwbacks = await discoverTV({
    "first_air_date.lte": "2010-01-01",
    sort_by: "popularity.desc",
  });
  if (throwbacks && throwbacks.results) {
    const container = document.getElementById("throwbacks-scroll");
    container.className = "list-view";
    container.innerHTML = throwbacks.results
      .slice(0, 6)
      .map((m) => {
        const poster = getImageUrl(m.poster_path, "w185");
        return `
        <a href="tv-details.html?id=${m.id}" class="list-item reveal">
          <img src="${poster}" alt="${m.name}" class="item-poster" loading="lazy">
          <div class="item-info">
            <h4>${m.name}</h4>
            <p>${m.overview || "No description available."}</p>
            <div class="movie-card-actions" style="margin-top: var(--space-sm)">
              <button class="btn-icon action-watchlist" title="Add to Watchlist" data-id="${m.id}" data-title="${m.name}" data-poster="${getImageUrl(m.poster_path)}" data-type="tv">
                <i class="bx bx-bookmark"></i>
              </button>
              <button class="btn-icon action-favorite" title="Favorite" data-id="${m.id}" data-title="${m.name}" data-poster="${getImageUrl(m.poster_path)}" data-type="tv">
                <i class="bx bx-heart"></i>
              </button>
            </div>
          </div>
          <i class="bx bx-chevron-right" style="font-size: 1.5rem; color: var(--primary)"></i>
        </a>
      `;
      })
      .join("");
  }

  // 9. Critics' Choice (Featured Grid)
  const critics = await discoverTV({
    "vote_average.gte": 8.5,
    "vote_count.gte": 1000,
  });
  if (critics && critics.results) {
    const data = critics.results.slice(0, 5);
    const container = document.getElementById("critics-grid");
    container.className = "featured-grid";

    const featured = data[0];
    const others = data.slice(1);

    let html = `
      <a href="tv-details.html?id=${featured.id}" class="featured-item reveal">
        <img src="${getImageUrl(featured.backdrop_path, "w1280")}" alt="${featured.name}">
        <div class="featured-content">
          <span class="hero-badge"><i class="bx bxs-star"></i> Top Rated</span>
          <h2>${featured.name}</h2>
          <div class="hero-buttons">
            <button class="btn btn-primary">Watch Now</button>
            <button class="btn btn-outline action-watchlist" data-id="${featured.id}" data-title="${featured.name}" data-poster="${getImageUrl(featured.poster_path)}" data-type="tv"><i class="bx bx-bookmark"></i></button>
            <button class="btn btn-outline action-favorite" data-id="${featured.id}" data-title="${featured.name}" data-poster="${getImageUrl(featured.poster_path)}" data-type="tv"><i class="bx bx-heart"></i></button>
          </div>
        </div>
      </a>
    `;

    html += others
      .map(
        (m) => `
      <div class="standard-card reveal">
        ${buildMovieCard(m, "tv")}
      </div>
    `,
      )
      .join("");

    container.innerHTML = html;
  }

  // 10. Animation Station (Poster Wall)
  const animation = await discoverTV({ with_genres: 16 }); // 16 = Animation
  if (animation && animation.results) {
    const container = document.getElementById("animation-scroll");
    container.className = "poster-wall";
    container.innerHTML = animation.results
      .slice(0, 12)
      .map((m) => {
        const poster = getImageUrl(m.poster_path, "w342");
        return `
        <a href="tv-details.html?id=${m.id}" class="poster-item reveal">
          <img src="${poster}" alt="${m.name}" loading="lazy">
          <div class="poster-info">
            <div class="movie-card-actions" style="margin-bottom: var(--space-sm)">
              <button class="btn-icon action-watchlist" style="width: 32px; height: 32px; font-size: 0.9rem" title="Add to Watchlist" data-id="${m.id}" data-title="${m.name}" data-poster="${getImageUrl(m.poster_path)}" data-type="tv">
                <i class="bx bx-bookmark"></i>
              </button>
              <button class="btn-icon action-favorite" style="width: 32px; height: 32px; font-size: 0.9rem" title="Favorite" data-id="${m.id}" data-title="${m.name}" data-poster="${getImageUrl(m.poster_path)}" data-type="tv">
                <i class="bx bx-heart"></i>
              </button>
            </div>
            <h4>${m.name}</h4>
          </div>
        </a>
      `;
      })
      .join("");
  }

  initScrollReveal();
});

async function loadTV() {
  const spinner = document.getElementById("tv-spinner");
  if (spinner) spinner.style.display = "block";

  const params = { page: tvPage, sort_by: tvSort };
  if (tvGenre) params.with_genres = tvGenre;
  const data = await discoverTV(params);

  if (spinner) spinner.style.display = "none";

  if (data && data.results) {
    tvTotalPages = Math.min(data.total_pages, 20); // Limit to 20 pages
    document.getElementById("tv-grid").innerHTML = data.results
      .map((m) => buildMovieCard(m, "tv"))
      .join("");

    renderPagination();
    initScrollReveal();
  }
}

function renderPagination() {
  const container = document.getElementById("tv-pagination");
  if (!container) return;
  let html = "";

  if (tvPage > 1) {
    html += `<button class="pagination-btn" data-page="${tvPage - 1}"><i class="bx bx-chevron-left"></i></button>`;
  }

  const start = Math.max(1, tvPage - 2);
  const end = Math.min(tvTotalPages, tvPage + 2);

  if (start > 1)
    html += `<button class="pagination-btn" data-page="1">1</button>`;
  if (start > 2)
    html += `<span class="pagination-btn" style="border:none;cursor:default;">...</span>`;

  for (let i = start; i <= end; i++) {
    html += `<button class="pagination-btn ${i === tvPage ? "active" : ""}" data-page="${i}">${i}</button>`;
  }

  if (end < tvTotalPages - 1)
    html += `<span class="pagination-btn" style="border:none;cursor:default;">...</span>`;
  if (end < tvTotalPages)
    html += `<button class="pagination-btn" data-page="${tvTotalPages}">${tvTotalPages}</button>`;

  if (tvPage < tvTotalPages) {
    html += `<button class="pagination-btn" data-page="${tvPage + 1}"><i class="bx bx-chevron-right"></i></button>`;
  }

  container.innerHTML = html;
  container.querySelectorAll("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      tvPage = parseInt(btn.dataset.page);
      loadTV();
      window.scrollTo({ top: 300, behavior: "smooth" });
    });
  });
}
