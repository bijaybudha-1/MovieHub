/* ============================================================
   MovieHub 2026 — Homepage Logic
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {
  // ── Hero Slider ──
  const heroData = await getTrending("movie", "day");
  if (heroData && heroData.results) {
    const movies = heroData.results.slice(0, 5);
    const slider = document.getElementById("hero-slider");
    const content = document.getElementById("hero-content");
    const dots = document.getElementById("hero-dots");
    let currentSlide = 0;

    // Create slides
    slider.innerHTML = movies
      .map(
        (m, i) => `
          <div class="hero-slide ${i === 0 ? "active" : ""}"
               style="background-image:url(${getBackdropUrl(m.backdrop_path)})">
          </div>
        `,
      )
      .join("");

    // Create dots
    dots.innerHTML = movies
      .map(
        (_, i) => `
          <button class="hero-dot ${i === 0 ? "active" : ""}" data-slide="${i}"></button>
        `,
      )
      .join("");

    // Update content
    function updateHeroContent(idx) {
      const m = movies[idx];
      const rating = (m.vote_average || 0).toFixed(1);
      content.innerHTML = `
            <span class="hero-badge"><i class="bx bxs-hot"></i> Trending Now</span>
            <h1 class="hero-title">${m.title || m.name}</h1>
            <p class="hero-overview">${m.overview}</p>
            <div class="hero-meta">
              <span class="hero-meta-item hero-rating"><i class="bx bxs-star"></i> ${rating}</span>
              <span class="hero-meta-item"><i class="bx bx-calendar"></i> ${m.release_date || m.first_air_date || "TBA"}</span>
              <span class="hero-meta-item"><i class="bx bx-movie-play"></i> Movie</span>
            </div>
            <div class="hero-buttons">
              <a href="pages/movie-details.html?id=${m.id}" class="btn btn-primary btn-lg"><i class="bx bx-play"></i> View Details</a>
              <button class="btn btn-outline btn-lg action-watchlist" data-id="${m.id}" data-title="${m.title || m.name}" data-poster="${getImageUrl(m.poster_path)}"><i class="bx bx-bookmark"></i> Watchlist</button>
            </div>
          `;
    }
    updateHeroContent(0);

    function goToSlide(idx) {
      slider
        .querySelectorAll(".hero-slide")
        .forEach((s, i) => s.classList.toggle("active", i === idx));
      dots
        .querySelectorAll(".hero-dot")
        .forEach((d, i) => d.classList.toggle("active", i === idx));
      updateHeroContent(idx);
      currentSlide = idx;
    }

    dots.addEventListener("click", (e) => {
      const dot = e.target.closest(".hero-dot");
      if (dot) goToSlide(parseInt(dot.dataset.slide));
    });

    // Auto-slide
    setInterval(() => {
      goToSlide((currentSlide + 1) % movies.length);
    }, 6000);
  }

  // ── Trending Section ──
  async function loadTrending(timeWindow = "day") {
    const data = await getTrending("movie", timeWindow);
    const container = document.getElementById("trending-scroll");
    if (data && data.results) {
      container.innerHTML = data.results
        .slice(0, 15)
        .map((m) => buildMovieCard(m, "movie"))
        .join("");
      initScrollReveal();
    }
  }
  loadTrending("day");

  document.querySelectorAll("[data-trending]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll("[data-trending]")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      loadTrending(btn.dataset.trending);
    });
  });

  // ── Top Rated ──
  const topRated = await getTopRatedMovies();
  if (topRated && topRated.results) {
    document.getElementById("top-rated-grid").innerHTML = topRated.results
      .slice(0, 10)
      .map((m) => buildMovieCard(m, "movie"))
      .join("");
  }

  // ── Popular TV Shows ──
  const popularTV = await getPopularTVShows();
  if (popularTV && popularTV.results) {
    document.getElementById("popular-tv-grid").innerHTML = popularTV.results
      .slice(0, 10)
      .map((m) => buildMovieCard(m, "tv"))
      .join("");
  }

  // ── Featured Genres ──
  const genreIcons = {
    28: "bx-bolt-circle",
    12: "bx-compass",
    16: "bx-palette",
    35: "bx-happy",
    80: "bx-search-alt",
    99: "bx-camera-movie",
    18: "bx-mask",
    10751: "bx-group",
    14: "bx-wand",
    36: "bx-book-open",
    27: "bx-ghost",
    10402: "bx-music",
    9648: "bx-question-mark",
    10749: "bx-heart",
    878: "bx-planet",
    53: "bx-target-lock",
    10752: "bx-shield",
    37: "bx-landscape",
  };
  const genreDescs = {
    28: "Explosive thrills",
    12: "Epic journeys",
    16: "Animated worlds",
    35: "Laughs guaranteed",
    80: "Criminal minds",
    99: "True stories",
    18: "Deep emotions",
    10751: "Fun for all",
    14: "Magical realms",
    36: "Past stories",
    27: "Pure terror",
    10402: "Musical vibes",
    9648: "Unsolved cases",
    10749: "Love stories",
    878: "Future worlds",
    53: "Edge of seat",
    10752: "Battle epics",
    37: "Wild frontier",
  };
  const genres = await getMovieGenres();
  if (genres && genres.genres) {
    document.getElementById("genre-grid").innerHTML = genres.genres
      .slice(0, 12)
      .map(
        (g, i) => `
          <div class="genre-card reveal delay-${(i % 6) + 1}">
            <div class="genre-icon"><i class="bx ${genreIcons[g.id] || "bx-movie"}"></i></div>
            <h3>${g.name}</h3>
            <p>${genreDescs[g.id] || "Discover more"}</p>
          </div>
        `,
      )
      .join("");
  }

  // ── Popular Actors ──
  const people = await getPopularPeople();
  if (people && people.results) {
    const actorsScroll = document.getElementById("actors-scroll");
    actorsScroll.innerHTML = people.results
      .slice(0, 20)
      .map(
        (p) => `
          <div class="actor-card reveal">
            <img class="actor-avatar" src="${getImageUrl(p.profile_path, "w185", p.name)}" alt="${p.name}" loading="lazy" onerror="handlePersonImageError(this)">
            <h4>${p.name}</h4>
            <p>${p.known_for_department || "Acting"}</p>
          </div>
        `,
      )
      .join("");

    const viewAllBtn = document.getElementById("view-all-actors");
    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", () => {
        const modal = document.getElementById("actors-modal");
        const grid = document.getElementById("actors-modal-grid");
        if (!modal || !grid) return;

        grid.innerHTML = people.results
          .map(
            (p) => `
                  <div class="actor-card">
                    <img class="actor-avatar" src="${getImageUrl(p.profile_path, "w185", p.name)}" alt="${p.name}" loading="lazy" onerror="handlePersonImageError(this)">
                    <h4>${p.name}</h4>
                    <p>${p.known_for_department || "Acting"}</p>
                  </div>
                `,
          )
          .join("");

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    }
  }

  // Global listener for actors modal close
  document.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("modal-overlay") ||
      e.target.closest(".modal-close")
    ) {
      const modal = document.getElementById("actors-modal");
      if (modal && modal.classList.contains("active")) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  });

  // ── Watchlist Preview ──
  renderWatchlistPreview("watchlist-preview");

  // ── Upcoming Releases ──
  const upcoming = await getUpcomingMovies();
  if (upcoming && upcoming.results) {
    document.getElementById("upcoming-grid").innerHTML = upcoming.results
      .slice(0, 6)
      .map((m) => {
        const releaseDate = m.release_date ? new Date(m.release_date) : null;
        const now = new Date();
        let countdown = "";
        if (releaseDate && releaseDate > now) {
          const days = Math.ceil((releaseDate - now) / (1000 * 60 * 60 * 24));
          countdown = `${days} days left`;
        } else {
          countdown = "Out now";
        }
        return `
            <div class="upcoming-card reveal">
              <a href="pages/movie-details.html?id=${m.id}" class="upcoming-card-poster">
                <img src="${getImageUrl(m.backdrop_path || m.poster_path, "w780")}" alt="${m.title}" loading="lazy">
                <span class="upcoming-countdown"><i class="bx bx-time-five"></i> ${countdown}</span>
              </a>
              <div class="upcoming-card-info">
                <h3>${m.title}</h3>
                <p>${m.release_date ? new Date(m.release_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "TBA"}</p>
              </div>
            </div>
          `;
      })
      .join("");
  }

  // Re-init scroll reveal for dynamically added elements
  initScrollReveal();
});
