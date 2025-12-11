const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "'Bearer YOUR_API_KEY_HERE'",
  },
};

// DOM Elements
const trendingSection = document.querySelector(".trending-movie-card-section");
const todayBtn = document.querySelector(".today-btn");
const thisWeekBtn = document.querySelector(".this-week-btn");

const sections = [
  { container: document.querySelector(".top-rated-card-content"), url: "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1" },
  { container: document.querySelector(".popular-card-content"), url: "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1" },
  { container: document.querySelector(".upcoming-card-content"), url: "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1" },
];

// Helper: render movies
const renderMovies = (container, movies) => {
  container.innerHTML = movies
    .map(
      (m) => `
      <div class="movie-card-content">
        <div class="movie-poster" id="${m.id}">
          <img class="movie-img" src="https://image.tmdb.org/t/p/w500${m.poster_path}" alt="${m.title}" />
          <div class="rating-circle" style="--rating:${Math.round(m.vote_average*10)};">
            <svg class="progress-ring" width="40" height="40">
              <circle class="ring-bg" cx="20" cy="20" r="15"/>
              <circle class="ring-progress" cx="20" cy="20" r="15"/>
            </svg>
            <span class="rating-text">${Math.round(m.vote_average*10)}%</span>
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
      </div>`
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
    ring.style.stroke = `var(--stat-${Math.floor(r/10)*10})`;
  });
}

// Trending
const loadTrending = (type = "day") => fetchMovies(`https://api.themoviedb.org/3/trending/movie/${type}?language=en-US`, trendingSection);

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
