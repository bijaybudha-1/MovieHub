// Today Trending and This Week Trending Movie
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2Q1NTY0ODQyMWQyYTY5NDM1YmIxZGQxMTFiZGZlMiIsIm5iZiI6MTc2MjM5NTUxMC4zMDcwMDAyLCJzdWIiOiI2OTBjMDU3NmI5YzdlODM4MTU5MzRmZTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RixiipK_9oFs9wwUGOmiQFCEw2SiTTXu0qyiUOvArY0",
  },
};

const seriesContent = document.querySelector(".series-list-card-content");
const airingTodayBtn = document.querySelector(".airing-today-btn");
const onTheAirBtn = document.querySelector(".on-the-air-btn");
const popularBtn = document.querySelector(".popular-btn");
const topRatedBtn = document.querySelector(".top-rated-btn");

function seriesList(type = "airing_today") {
  const url = `https://api.themoviedb.org/3/tv/${type}?language=en-US&page=1`;
  

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      seriesContent.innerHTML = "";

      data.results.forEach((movie) => {
        const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        const rating = Math.round(movie.vote_average * 10);

        seriesContent.innerHTML += `
          <div class="movie-card-content mt-2">
            <div class="movie-poster">
              <img src="${imageUrl}" alt="${movie.name}" />

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
              <h3 class="relase-date mini-para text-gray">${movie.first_air_date}</h3>
            </div>
          </div>
        `;
        applyRatingColors()
      });
    })
    .catch((err) => console.error(err));
}

// BUTTON CLICK EVENTS

// Airing Today Btn
airingTodayBtn.addEventListener("click", () => {
  airingTodayBtn.classList.add("series-active");
  onTheAirBtn.classList.remove("series-active");
  popularBtn.classList.remove("series-active");
  topRatedBtn.classList.remove("series-active");

  seriesList('airing_today'); // Load today's trending
});

// On The Air Btn
onTheAirBtn.addEventListener("click", () => {
  onTheAirBtn.classList.add("series-active");
  airingTodayBtn.classList.remove("series-active");
  popularBtn.classList.remove("series-active");
  topRatedBtn.classList.remove("series-active");

  seriesList("on_the_air"); // Load this week's trending
});

// Popular Btn
popularBtn.addEventListener("click", () => {
  popularBtn.classList.add("series-active");
  topRatedBtn.classList.remove("series-active");
  airingTodayBtn.classList.remove("series-active");
  onTheAirBtn.classList.remove("series-active");

  seriesList("popular"); // Load this week's trending
});
// Top Rated Btn
topRatedBtn.addEventListener("click", () => {
  topRatedBtn.classList.add("series-active");
  popularBtn.classList.remove("series-active");
  airingTodayBtn.classList.remove("series-active");
  onTheAirBtn.classList.remove("series-active");

  seriesList("on_the_air"); // Load this week's trending
});

seriesList("top_rated");

function applyRatingColors() {
  const circles = document.querySelectorAll(".rating-circle");

  circles.forEach(circle => {
    const rating = parseInt(circle.style.getPropertyValue("--rating"));
    const ring = circle.querySelector(".ring-progress");
    
    if (rating === 0 ) {
      ring.style.stroke = `var(--stat-0)`;
    } else if (rating > 0 && rating < 10){
      ring.style.stroke = `var(--stat-10)`;
    } else if (rating > 10 && rating < 20){
      ring.style.stroke = `var(--stat-20)`;
    } else if (rating > 20 && rating < 30){
      ring.style.stroke = `var(--stat-30)`;
    } else if (rating > 30 && rating < 40){
      ring.style.stroke = `var(--stat-40)`;
    } else if (rating > 40 && rating < 50){
      ring.style.stroke = `var(--stat-50)`;
    } else if (rating > 50 && rating < 60){
      ring.style.stroke = `var(--stat-60)`;
    } else if (rating > 60 && rating < 70){
      ring.style.stroke = `var(--stat-70)`;
    } else if (rating > 70 && rating < 80){
      ring.style.stroke = `var(--stat-80)`;
    } else if (rating > 80 && rating < 90){
      ring.style.stroke = `var(--stat-90)`;
    } else if (rating > 90 && rating < 100){
      ring.style.stroke = `var(--stat-100)`;
    }
    
  });
}