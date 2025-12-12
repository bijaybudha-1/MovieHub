// Today Trending and This Week Trending Movie
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2Q1NTY0ODQyMWQyYTY5NDM1YmIxZGQxMTFiZGZlMiIsIm5iZiI6MTc2MjM5NTUxMC4zMDcwMDAyLCJzdWIiOiI2OTBjMDU3NmI5YzdlODM4MTU5MzRmZTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RixiipK_9oFs9wwUGOmiQFCEw2SiTTXu0qyiUOvArY0",
  },
};

const allTVShowsContent = document.querySelector(".all-tvShows-card-content");
const allTVShowsUrl = 'https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc';

fetch(allTVShowsUrl, options)
  .then((res) => res.json())
  .then((tvShows) => {
    allTVShowsContent.innerHTML = "";

    tvShows.results.forEach((allTVShows) => {
      const ratedImageUrl = `https://image.tmdb.org/t/p/w500${allTVShows.poster_path}`;
      const rating = Math.round(allTVShows.vote_average * 10);
      
      allTVShowsContent.innerHTML += `
          <div class="movie-card-content mt-2">
            <div class="movie-poster" id="${allTVShows.id}">
              <img class="tv-show-img" src="${ratedImageUrl}" alt="${allTVShows.name}" />

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
              <h2 class="movie-name sub-para pointer text-black">${allTVShows.name}</h2>
              <h3 class="relase-date mini-para text-gray">${allTVShows.first_air_date}</h3>
            </div>
          </div>
        `;
        applyRatingColors()
  
    });
  })
  .catch((err) => {
    console.error("ERROR: ", err);
  });

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


// Movie click navigation
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("tv-show-img")) {
    const id = e.target.parentNode.id;
    window.location.href = `http://127.0.0.1:5501/pages/tvshowDetails.html?id=${id}`;
  }
});