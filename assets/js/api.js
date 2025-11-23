// Today Trending and This Week Trending Movie
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2Q1NTY0ODQyMWQyYTY5NDM1YmIxZGQxMTFiZGZlMiIsIm5iZiI6MTc2MjM5NTUxMC4zMDcwMDAyLCJzdWIiOiI2OTBjMDU3NmI5YzdlODM4MTU5MzRmZTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RixiipK_9oFs9wwUGOmiQFCEw2SiTTXu0qyiUOvArY0",
  },
};

const movieSection = document.querySelector(".trending-movie-card-section");
const todayBtn = document.querySelector(".today-btn");
const thisWeekBtn = document.querySelector(".this-week-btn");

function loadTrending(type = "day") {
  const url = `https://api.themoviedb.org/3/trending/movie/${type}?language=en-US`;

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      movieSection.innerHTML = "";

      data.results.forEach((movie) => {
        const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        const rating = Math.round(movie.vote_average * 10);

        movieSection.innerHTML += `
          <div class="movie-card-content">
            <div class="movie-poster">
              <img src="${imageUrl}" alt="${movie.title}" />

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
              <h2 class="movie-name sub-para pointer text-black">${movie.title}</h2>
              <h3 class="relase-date mini-para text-gray">${movie.release_date}</h3>
            </div>
          </div>
        `;
      });
    })
    .catch((err) => console.error(err));
}

// BUTTON CLICK EVENTS

// Trending Today
todayBtn.addEventListener("click", () => {
  todayBtn.classList.add("trending-active");
  thisWeekBtn.classList.remove("trending-active");

  loadTrending("day"); // Load today's trending
});

// Trending This Week
thisWeekBtn.addEventListener("click", () => {
  thisWeekBtn.classList.add("trending-active");
  todayBtn.classList.remove("trending-active");

  loadTrending("week"); // Load this week's trending
});

loadTrending("day");

// Popular Card Section
const popularContent = document.querySelector(".popular-card-content");
const popularUrl =
  "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";

fetch(popularUrl, options)
  .then((res) => res.json())
  .then((popular) => {
    popularContent.innerHTML = "";

    popular.results.forEach((popularMovie) => {
      const popularImageUrl = `https://image.tmdb.org/t/p/w500${popularMovie.poster_path}`;
      const rating = Math.round(popularMovie.vote_average * 10);

      popularContent.innerHTML += `
      <div class="movie-card-content">
        <div class="movie-poster">
          <img src="${popularImageUrl}" alt="${popularMovie.title}" />

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
          <h2 class="movie-name sub-para pointer text-black">${popularMovie.title}</h2>
          <h3 class="relase-date mini-para text-gray">${popularMovie.release_date}</h3>
        </div>
      </div>
    `;
    });
  })
  .catch((err) => {
    console.error(err);
  });

// Top rated Card Section
const topRatedContent = document.querySelector(".top-rated-card-content");
const topRatedUrl =
  "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

fetch(topRatedUrl, options)
  .then((res) => res.json())
  .then((topRated) => {
    topRatedContent.innerHTML = "";

    topRated.results.forEach((topRatedMovie) => {
      const ratedImageUrl = `https://image.tmdb.org/t/p/w500${topRatedMovie.poster_path}`;
      const rating = Math.round(topRatedMovie.vote_average * 10);

      topRatedContent.innerHTML += `
          <div class="movie-card-content">
            <div class="movie-poster">
              <img src="${ratedImageUrl}" alt="${topRatedMovie.title}" />

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
              <h2 class="movie-name sub-para pointer text-black">${topRatedMovie.title}</h2>
              <h3 class="relase-date mini-para text-gray">${topRatedMovie.release_date}</h3>
            </div>
          </div>
        `;
    });
  })
  .catch((err) => {
    console.error("ERROR: ", err);
  });

const upcomingContent = document.querySelector(".upcoming-card-content");
const upcomingURL =
  "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1";

fetch(upcomingURL, options)
  .then((res) => res.json())
  .then((upcoming) => {
    upcomingContent.innerHTML = "";

    upcoming.results.forEach((upcomingMovie) => {
      const ratedImageUrl = `https://image.tmdb.org/t/p/w500${upcomingMovie.poster_path}`;

      const rating = Math.round(upcomingMovie.vote_average * 10);

      upcomingContent.innerHTML += `
    <div class="movie-card-content">
            <div class="movie-poster">
              <img src="${ratedImageUrl}" alt="${upcomingMovie.title}" />

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
              <h2 class="movie-name sub-para pointer text-black">${upcomingMovie.title}</h2>
              <h3 class="relase-date mini-para text-gray">${upcomingMovie.release_date}</h3>
            </div>
          </div>
        `;
    });
  })
  .catch((err) => console.error(err));
