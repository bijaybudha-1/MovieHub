const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2Q1NTY0ODQyMWQyYTY5NDM1YmIxZGQxMTFiZGZlMiIsIm5iZiI6MTc2MjM5NTUxMC4zMDcwMDAyLCJzdWIiOiI2OTBjMDU3NmI5YzdlODM4MTU5MzRmZTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RixiipK_9oFs9wwUGOmiQFCEw2SiTTXu0qyiUOvArY0",
  },
};

// DOM Elements
const trendingSection = document.querySelector(".trending-movie-card-section");
const todayBtn = document.querySelector(".today-btn");
const thisWeekBtn = document.querySelector(".this-week-btn");

const sections = [
  {
    container: document.querySelector(".top-rated-card-content"),
    url: "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
  },
  {
    container: document.querySelector(".popular-card-content"),
    url: "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
  },
  {
    container: document.querySelector(".upcoming-card-content"),
    url: "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
  },
];

// Helper: render movies
const renderMovies = (container, movies) => {
  container.innerHTML = movies
    .map(
      (m) => `
      <div class="movie-card-content">
        <div class="movie-poster" id="${m.id}">
          <img class="movie-img" src="https://image.tmdb.org/t/p/w500${
            m.poster_path
          }" alt="${m.title}" />
          <div class="rating-circle" style="--rating:${Math.round(
            m.vote_average * 10,
          )};">
            <svg class="progress-ring" width="40" height="40">
              <circle class="ring-bg" cx="20" cy="20" r="15"/>
              <circle class="ring-progress" cx="20" cy="20" r="15"/>
            </svg>
            <span class="rating-text">${Math.round(m.vote_average * 10)}%</span>
          </div>
          <div class="more-icon sub-heading">
            <i class='bx bx-dots-horizontal-rounded'></i>
            <ul class="option-content hidden">
              <li class="option-link"><span>Add to List</span></li>
              <li class="option-link"><span>Favourite</span></li>
              <li class="option-link"><span>Watchlist</span></li>
              <li class="option-link"><span>Your Rating</span></li>
            </ul>
          </div>
        </div>
        <div class="movie-description text-white p-x-1 p-y-2">
          <h2 class="movie-name sub-para pointer text-black">${m.title}</h2>
          <h3 class="relase-date mini-para text-gray">${m.release_date}</h3>
        </div>
      </div>`,
    )
    .join("");
  applyRatingColors();
};

// Helper: fetch movies
const fetchMovies = (url, container) =>
  fetch(url, options)
    .then((res) => res.json())
    .then((data) => renderMovies(container, data.results))
    .catch((err) => console.error(err));

// Rating color logic
function applyRatingColors() {
  document.querySelectorAll(".rating-circle").forEach((circle) => {
    const r = parseInt(circle.style.getPropertyValue("--rating"));
    const ring = circle.querySelector(".ring-progress");
    ring.style.stroke = `var(--stat-${Math.floor(r / 10) * 10})`;
  });
}

// Trending
const loadTrending = (type = "day") =>
  fetchMovies(
    `https://api.themoviedb.org/3/trending/movie/${type}?language=en-US`,
    trendingSection,
  );

todayBtn.addEventListener("click", () => {
  todayBtn.classList.add("trending-active");
  thisWeekBtn.classList.remove("trending-active");
  loadTrending("day");
});

thisWeekBtn.addEventListener("click", () => {
  thisWeekBtn.classList.add("trending-active");
  todayBtn.classList.remove("trending-active");
  loadTrending("week");
});

loadTrending("day");
sections.forEach((s) => fetchMovies(s.url, s.container));

// Movie click navigation
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("movie-img")) {
    const id = e.target.parentNode.id;
    window.location.href = `http://127.0.0.1:5501/pages/movies-details.html?id=${id}`;
  }
});

// ---- More-icon dropdown and quick actions (favorite / watchlist / rating) ----
function showToast(message, type = "success") {
  const existing = document.querySelector(".toast-notification");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = `toast-notification ${type}`;
  let icon = "✓";
  if (type === "error") icon = "✕";
  if (type === "info") icon = "ℹ";
  toast.innerHTML = `<span class="toast-notification-icon">${icon}</span><span class="toast-notification-message">${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function safeParse(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    return [];
  }
}
function safeWrite(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
}

document.addEventListener("click", (e) => {
  // toggle dropdown when clicking the more-icon
  const more = e.target.closest(".more-icon");
  if (more && !e.target.closest(".option-link")) {
    const option = more.querySelector(".option-content");
    // close other dropdowns
    document.querySelectorAll(".option-content").forEach((o) => {
      if (o !== option) o.classList.add("hidden");
    });
    option.classList.toggle("hidden");
    return;
  }

  const opt = e.target.closest(".option-link");
  if (!opt) return;
  const poster = opt.closest(".movie-poster");
  if (!poster) return;
  const id = poster.id;
  const card = opt.closest(".movie-card-content");
  const titleEl = card && card.querySelector(".movie-name");
  const imgEl = poster.querySelector("img");
  const title = titleEl ? titleEl.textContent.trim() : "Movie";
  const posterSrc = imgEl ? imgEl.src : "";

  const actionText = opt.textContent.trim().toLowerCase();
  if (actionText.includes("favourite") || actionText.includes("favorite")) {
    const fav = safeParse("moviehub_favorites");
    if (fav.find((m) => String(m.id) === String(id))) {
      showToast(`Already in favorites: ${title}`, "info");
    } else {
      fav.unshift({ id, title, poster_path: posterSrc });
      safeWrite("moviehub_favorites", fav);
      showToast(`Your "${title}" added a favorite`, "success");
    }
  } else if (actionText.includes("watchlist")) {
    const wl = safeParse("moviehub_watchlist");
    if (wl.find((m) => String(m.id) === String(id))) {
      showToast(`Already in watchlist: ${title}`, "info");
    } else {
      wl.unshift({ id, title, poster_path: posterSrc });
      safeWrite("moviehub_watchlist", wl);
      showToast(`Added to watch list "${title}"`, "success");
    }
  } else if (actionText.includes("add to list")) {
    const al = safeParse("moviehub_addtolist");
    if (al.find((m) => String(m.id) === String(id))) {
      showToast(`Already in your list: ${title}`, "info");
    } else {
      al.unshift({ id, title, poster_path: posterSrc });
      safeWrite("moviehub_addtolist", al);
      showToast(`Added to your list "${title}"`, "success");
    }
  } else if (
    actionText.includes("rating") ||
    actionText.includes("your rating")
  ) {
    const val = prompt(`Rate "${title}" (1-10):`);
    if (val === null) return;
    const n = Number(val);
    if (!n || n < 1 || n > 10)
      return showToast("Please enter a number between 1 and 10", "error");
    const ratings = safeParse("moviehub_ratings");
    ratings.unshift({ id, title, rating: n });
    safeWrite("moviehub_ratings", ratings);
    showToast(`You rated "${title}" ${n}/10`, "success");
  }
  // close dropdown
  document
    .querySelectorAll(".option-content")
    .forEach((o) => o.classList.add("hidden"));
});
