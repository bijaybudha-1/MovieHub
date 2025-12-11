const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2Q1NTY0ODQyMWQyYTY5NDM1YmIxZGQxMTFiZGZlMiIsIm5iZiI6MTc2MjM5NTUxMC4zMDcwMDAyLCJzdWIiOiI2OTBjMDU3NmI5YzdlODM4MTU5MzRmZTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RixiipK_9oFs9wwUGOmiQFCEw2SiTTXu0qyiUOvArY0",
  },
};

const container = document.getElementById("movie-details");

const urlParams = new URLSearchParams(window.location.search);

const showMovieDetails = () => {
  const movieID = urlParams.get("id" || 1255775);

fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, options)
    .then((res) => res.json())
    .then((movie) => {
      console.log(movie);
      

        const container = document.getElementById("movie-details");
        const movieDetailBgImage = document.querySelector(".movie-details-section");

        movieDetailBgImage.style.background = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;
        movieDetailBgImage.style.backgroundPosition = 'center';
        movieDetailBgImage.style.backgroundSize = 'cover'

        let hours = Math.floor(movie.runtime / 60);
        let minutes = movie.runtime % 60;
        let runtimeText = movie.runtime ? `${hours}h ${minutes}m` : "Not Available";

        container.innerHTML = `
          <div class="movie-content">
          <div class="movie-content-poster w-fit-content">
            <figure>
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path
            }" alt="${movie.title}">
            </figure>
          </div>
        </div>
        <div class="movie-poster-desc w-fit-content text-white">
          <h1 class="main-heading mt-1">${movie.title}</h1>
          <div class="fact-content mb-2">
            <span class="certificate para">R</span>
            <span class="release para">${movie.release_date}</span>
            <span class="genres para">${movie.genres.map(
                (genre) => genre.name
            )}</span>
            <span class="runtime para">${runtimeText}</span>
          </div>
          <div class="icons-content-div d-flex gap-1">
            <div class="icon-content">
              <a href="#">
                <i class='bx  bx-list-plus'></i>
              </a>
            </div>
            <div class="icon-content">
              <a href="#">
                <i class='bx  bx-heart'></i>
              </a>
            </div>
            <div class="icon-content">
              <a href="#">
                <i class='bx  bx-bookmark'></i>
              </a>
            </div>
            <div class="icon-content play-icon">
              <a href="#">
                <span><i class='bx  bx-play'></i><span>Play Trailer</span></span>
              </a>
            </div>
          </div>
          <h2 class="sub-para tag-line">${movie.tagline}</h2>
          <h2 class="heading mb-half">Overview</h2>
          <h3 class="sub-para movie-title text-common mb-2">${movie.overview
            }</h3>
          <div class="people-content d-flex justify-between gap-2">
            <div class="people-profile">
              <h3 class="main-para">Nick Rowland</h3>
              <p class="sub-para">Director</p>
            </div>
            <div class="people-profile">
              <h3 class="main-para">Nick Rowland</h3>
              <p class="sub-para">Director</p>
            </div>
            <div class="people-profile">
              <h3 class="main-para">Nick Rowland</h3>
              <p class="sub-para">Director</p>
            </div>
          </div>
        </div>
        `;
    })
    .catch((err) => console.error(err));

}

showMovieDetails()