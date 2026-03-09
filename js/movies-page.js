/* ============================================================
   MovieHub 2026 — Movies Page Logic
   ============================================================ */

let currentPage = 1;
let currentSort = "popularity.desc";
let currentGenre = "";
let totalPages = 1;

document.addEventListener("DOMContentLoaded", async () => {
  // Load genres for filter
  const genres = await getMovieGenres();
  const genreSelect = document.getElementById("genre-filter");
  if (genres && genres.genres) {
    genres.genres.forEach((g) => {
      genreSelect.innerHTML += `<option value="${g.id}">${g.name}</option>`;
    });
  }

  loadMovies();

  // Sort change
  document.getElementById("sort-select").addEventListener("change", (e) => {
    currentSort = e.target.value;
    currentPage = 1;
    loadMovies();
  });

  // Genre change
  genreSelect.addEventListener("change", (e) => {
    currentGenre = e.target.value;
    currentPage = 1;
    loadMovies();
  });

  // Search
  let searchTimer;
  document.getElementById("movie-search").addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    const q = e.target.value.trim();
    searchTimer = setTimeout(async () => {
      if (q.length >= 2) {
        const data = await searchMovies(q);
        if (data && data.results) {
          renderMovieGrid(data.results);
          document.getElementById("pagination").innerHTML = "";
        }
      } else {
        loadMovies();
      }
    }, 400);
  });

  // Recommended (Backdrop Slider)
  const rec = await getTopRatedMovies();
  if (rec && rec.results) {
    const container = document.getElementById("recommended-scroll");
    container.className = "backdrop-scroll";
    container.innerHTML = rec.results
      .slice(0, 10)
      .map((m) => {
        const backdrop = getImageUrl(m.backdrop_path, "w780");
        return `
        <a href="movie-details.html?id=${m.id}" class="backdrop-card reveal">
          <img src="${backdrop}" alt="${m.title || m.name}" loading="lazy">
          <div class="backdrop-overlay">
            <div class="movie-card-actions" style="margin-bottom: var(--space-sm)">
              <button class="btn-icon action-watchlist" title="Add to Watchlist" data-id="${m.id}" data-title="${m.title || m.name}" data-poster="${getImageUrl(m.poster_path)}" data-type="movie">
                <i class="bx bx-bookmark"></i>
              </button>
              <button class="btn-icon action-favorite" title="Favorite" data-id="${m.id}" data-title="${m.title || m.name}" data-poster="${getImageUrl(m.poster_path)}" data-type="movie">
                <i class="bx bx-heart"></i>
              </button>
            </div>
            <h3>${m.title || m.name}</h3>
            <p>${m.vote_average.toFixed(1)} Rating</p>
          </div>
        </a>
      `;
      })
      .join("");
    setupScrollButtons(
      "recommended-scroll",
      "recommended-prev",
      "recommended-next",
    );
  }

  // New Sections:
  // 6. Cinematic Legends (Poster Wall)
  const legends = await discoverMovies({
    sort_by: "vote_average.desc",
    "vote_count.gte": 15000,
  });
  if (legends && legends.results) {
    const container = document.getElementById("legends-grid");
    container.className = "poster-wall";
    container.innerHTML = legends.results
      .slice(0, 12)
      .map((m) => {
        const poster = getImageUrl(m.poster_path, "w342");
        return `
        <a href="movie-details.html?id=${m.id}" class="poster-item reveal">
          <img src="${poster}" alt="${m.title}" loading="lazy">
          <div class="poster-info">
            <div class="movie-card-actions" style="margin-bottom: var(--space-sm)">
              <button class="btn-icon action-watchlist" style="width: 32px; height: 32px; font-size: 0.9rem" title="Add to Watchlist" data-id="${m.id}" data-title="${m.title}" data-poster="${getImageUrl(m.poster_path)}" data-type="movie">
                <i class="bx bx-bookmark"></i>
              </button>
              <button class="btn-icon action-favorite" style="width: 32px; height: 32px; font-size: 0.9rem" title="Favorite" data-id="${m.id}" data-title="${m.title}" data-poster="${getImageUrl(m.poster_path)}" data-type="movie">
                <i class="bx bx-heart"></i>
              </button>
            </div>
            <h4>${m.title}</h4>
            <span class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.7rem">View</span>
          </div>
        </a>
      `;
      })
      .join("");
  }

  // 7. Upcoming Blockbusters
  const upcoming = await getUpcomingMovies();
  if (upcoming && upcoming.results) {
    document.getElementById("upcoming-blockbusters-scroll").innerHTML =
      upcoming.results
        .slice(0, 15)
        .map((m) => buildMovieCard(m, "movie"))
        .join("");
    setupScrollButtons(
      "upcoming-blockbusters-scroll",
      "upcoming-prev",
      "upcoming-next",
    );
  }

  // 8. Award Winners (Featured Grid)
  const awards = await discoverMovies({
    sort_by: "revenue.desc",
    "vote_average.gte": 8,
  });
  if (awards && awards.results) {
    const data = awards.results.slice(0, 5);
    const container = document.getElementById("awards-scroll");
    container.className = "featured-grid";

    const featured = data[0];
    const others = data.slice(1);

    let html = `
      <a href="movie-details.html?id=${featured.id}" class="featured-item reveal">
        <img src="${getImageUrl(featured.backdrop_path, "w1280")}" alt="${featured.title}">
        <div class="featured-content">
          <span class="hero-badge"><i class="bx bxs-trophy"></i> Featured Winner</span>
          <h2>${featured.title}</h2>
          <div class="hero-buttons">
            <btn class="btn btn-primary">Watch Now</btn>
            <button class="btn btn-outline action-watchlist" data-id="${featured.id}" data-title="${featured.title}" data-poster="${getImageUrl(featured.poster_path)}" data-type="movie"><i class="bx bx-bookmark"></i></button>
            <button class="btn btn-outline action-favorite" data-id="${featured.id}" data-title="${featured.title}" data-poster="${getImageUrl(featured.poster_path)}" data-type="movie"><i class="bx bx-heart"></i></button>
          </div>
        </div>
      </a>
    `;

    html += others
      .map(
        (m) => `
      <div class="standard-card reveal">
        ${buildMovieCard(m, "movie")}
      </div>
    `,
      )
      .join("");

    container.innerHTML = html;
  }

  // 9. Genre Spotlight: Action (List View)
  const spot = await discoverMovies({ with_genres: 28 }); // 28 = Action
  if (spot && spot.results) {
    const container = document.getElementById("genre-spotlight-grid");
    container.className = "list-view";
    container.innerHTML = spot.results
      .slice(0, 6)
      .map((m) => {
        const poster = getImageUrl(m.poster_path, "w185");
        return `
        <a href="movie-details.html?id=${m.id}" class="list-item reveal">
          <img src="${poster}" alt="${m.title}" class="item-poster" loading="lazy">
          <div class="item-info">
            <h4>${m.title}</h4>
            <p>${m.overview || "No description available."}</p>
            <div class="movie-card-actions" style="margin-top: var(--space-sm)">
              <button class="btn-icon action-watchlist" title="Add to Watchlist" data-id="${m.id}" data-title="${m.title}" data-poster="${getImageUrl(m.poster_path)}" data-type="movie">
                <i class="bx bx-bookmark"></i>
              </button>
              <button class="btn-icon action-favorite" title="Favorite" data-id="${m.id}" data-title="${m.title}" data-poster="${getImageUrl(m.poster_path)}" data-type="movie">
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

  initScrollReveal();
});

async function loadMovies() {
  const spinner = document.getElementById("loading-spinner");
  spinner.style.display = "block";

  const params = { page: currentPage, sort_by: currentSort };
  if (currentGenre) params.with_genres = currentGenre;

  const data = await discoverMovies(params);
  spinner.style.display = "none";

  if (data && data.results) {
    totalPages = Math.min(data.total_pages, 20);
    renderMovieGrid(data.results);
    renderPagination();
    initScrollReveal();
  }
}

function renderMovieGrid(movies) {
  document.getElementById("movies-grid").innerHTML = movies
    .map((m) => buildMovieCard(m, "movie"))
    .join("");
}

function renderPagination() {
  const container = document.getElementById("pagination");
  let html = "";

  if (currentPage > 1) {
    html += `<button class="pagination-btn" data-page="${currentPage - 1}"><i class="bx bx-chevron-left"></i></button>`;
  }

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  if (start > 1)
    html += `<button class="pagination-btn" data-page="1">1</button>`;
  if (start > 2)
    html += `<span class="pagination-btn" style="border:none;cursor:default;">...</span>`;

  for (let i = start; i <= end; i++) {
    html += `<button class="pagination-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
  }

  if (end < totalPages - 1)
    html += `<span class="pagination-btn" style="border:none;cursor:default;">...</span>`;
  if (end < totalPages)
    html += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;

  if (currentPage < totalPages) {
    html += `<button class="pagination-btn" data-page="${currentPage + 1}"><i class="bx bx-chevron-right"></i></button>`;
  }

  container.innerHTML = html;
  container.querySelectorAll("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPage = parseInt(btn.dataset.page);
      loadMovies();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}
