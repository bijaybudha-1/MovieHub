// TMDB API OPTIONS 
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2Q1NTY0ODQyMWQyYTY5NDM1YmIxZGQxMTFiZGZlMiIsIm5iZiI6MTc2MjM5NTUxMC4zMDcwMDAyLCJzdWIiOiI2OTBjMDU3NmI5YzdlODM4MTU5MzRmZTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RixiipK_9oFs9wwUGOmiQFCEw2SiTTXu0qyiUOvArY0",
  },
};

// DOM ELEMENTS 
const seriesContent = document.querySelector(".series-list-card-content");
const airingTodayBtn = document.querySelector(".airing-today-btn");
const onTheAirBtn = document.querySelector(".on-the-air-btn");
const popularBtn = document.querySelector(".popular-btn");
const topRatedBtn = document.querySelector(".top-rated-btn");
const viewMoreBtn = document.querySelector(".view-more-series-btn");

//  STATE 
let currentPage = 1;
let currentType = "airing_today";
let isLoading = false;
let hasMorePages = true;
let infiniteScrollEnabled = false;

// LOADING SPINNER
const spinner = document.createElement("div");
spinner.className = "loading-spinner";
spinner.innerHTML = "⏳ Loading...";
spinner.style.textAlign = "center";
spinner.style.padding = "20px";
spinner.style.display = "none";
seriesContent.after(spinner);

//  FETCH & RENDER SERIES
function seriesList(type = "airing_today", loadMore = false) {
  if (isLoading || !hasMorePages) return;

  isLoading = true;
  spinner.style.display = "block";

  if (!loadMore) {
    seriesContent.innerHTML = "";
    currentPage = 1;
    hasMorePages = true;
    infiniteScrollEnabled = false;
    viewMoreBtn.style.display = "block";
    currentType = type;
  }

  const url = `https://api.themoviedb.org/3/tv/${currentType}?language=en-US&page=${currentPage}`;

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      if (!data.results || data.results.length === 0) {
        hasMorePages = false;
        spinner.innerHTML = "🚫 No more series";
        viewMoreBtn.style.display = "none";
        return;
      }

      data.results.forEach((movie) => {
        const imageUrl = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "../assets/images/no-image.png";

        const rating = Math.round(movie.vote_average * 10);

        seriesContent.innerHTML += `
          <div class="movie-card-content mt-2">
            <div class="movie-poster" id="${movie.id}">
              <img class="series-img" src="${imageUrl}" alt="${movie.name}" />

              <div class="rating-circle" style="--rating: ${rating};">
                <svg class="progress-ring" width="40" height="40">
                  <circle class="ring-bg" cx="20" cy="20" r="15" />
                  <circle class="ring-progress" cx="20" cy="20" r="15" />
                </svg>
                <span class="rating-text">${rating}%</span>
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
              <h2 class="movie-name sub-para pointer text-black">${movie.name}</h2>
              <h3 class="relase-date mini-para text-gray">
                ${movie.first_air_date || "N/A"}
              </h3>
            </div>
          </div>
        `;
      });

      applyRatingColors();
      currentPage++;
    })
    .catch(console.error)
    .finally(() => {
      isLoading = false;
      spinner.style.display = "none";
    });
}

//VIEW MORE (FIRST TIME ONLY)
viewMoreBtn.addEventListener("click", () => {
  seriesList(currentType, true);
  infiniteScrollEnabled = true;
  viewMoreBtn.style.display = "none";
});

// INFINITE SCROLL (AFTER BUTTON CLICK)
window.addEventListener("scroll", () => {
  if (!infiniteScrollEnabled || isLoading || !hasMorePages) return;

  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 300
  ) {
    seriesList(currentType, true);
  }
});

// BUTTON EVENTS 
airingTodayBtn.addEventListener("click", () => {
  setActive(airingTodayBtn);
  seriesList("airing_today");
});

onTheAirBtn.addEventListener("click", () => {
  setActive(onTheAirBtn);
  seriesList("on_the_air");
});

popularBtn.addEventListener("click", () => {
  setActive(popularBtn);
  seriesList("popular");
});

topRatedBtn.addEventListener("click", () => {
  setActive(topRatedBtn);
  seriesList("top_rated");
});

function setActive(activeBtn) {
  [airingTodayBtn, onTheAirBtn, popularBtn, topRatedBtn].forEach((btn) =>
    btn.classList.remove("series-active")
  );
  activeBtn.classList.add("series-active");
}

// RATING COLOR LOGIC 
function applyRatingColors() {
  document.querySelectorAll(".rating-circle").forEach((circle) => {
    const rating = parseInt(circle.style.getPropertyValue("--rating"));
    const ring = circle.querySelector(".ring-progress");

    if (rating < 10) ring.style.stroke = `var(--stat-10)`;
    else if (rating < 20) ring.style.stroke = `var(--stat-20)`;
    else if (rating < 30) ring.style.stroke = `var(--stat-30)`;
    else if (rating < 40) ring.style.stroke = `var(--stat-40)`;
    else if (rating < 50) ring.style.stroke = `var(--stat-50)`;
    else if (rating < 60) ring.style.stroke = `var(--stat-60)`;
    else if (rating < 70) ring.style.stroke = `var(--stat-70)`;
    else if (rating < 80) ring.style.stroke = `var(--stat-80)`;
    else if (rating < 90) ring.style.stroke = `var(--stat-90)`;
    else ring.style.stroke = `var(--stat-100)`;
  });
}

// SERIES CARD CLICK
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("series-img")) {
    const id = e.target.parentNode.id;
    window.location.href = `/pages/tvshowDetails.html?id=${id}`;
  }
});

// INITIAL LOAD
airingTodayBtn.classList.add("series-active");
seriesList("airing_today");
