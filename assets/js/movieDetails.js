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
const movieID = urlParams.get("id");

const showMovieDetails = () => {
  fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, options)
    .then((res) => res.json())
    .then((movie) => {
      const container = document.getElementById("movie-details");
      const movieDetailBgImage = document.querySelector(
        ".movie-details-section"
      );

      movieDetailBgImage.style.background = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;
      movieDetailBgImage.style.backgroundPosition = "center";
      movieDetailBgImage.style.backgroundSize = "cover";

      let hours = Math.floor(movie.runtime / 60);
      let minutes = movie.runtime % 60;
      let runtimeText = movie.runtime
        ? `${hours}h ${minutes}m`
        : "Not Available";

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
            <span class="genres para">${movie.genres.map((genre) => genre.name).join(", ")}</span>
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
          </div>
        </div>
        `;

      const movieDescription = document.querySelector(
        ".movie-description-content"
      );
      movieDescription.innerHTML = `
        <div class="movie-desc-card">
          <h4 class="heading text-bold">Status</h4>
          <span class="movie-status sub-para text-normal mt-half">${movie.status
        }</span>
        </div>
        <div class="movie-desc-card mt-1">
          <h4 class="heading text-bold">Original Language</h4>
          <span class="movie-status sub-para text-normal mt-half">${movie.spoken_languages[0].english_name
        }</span>
        </div>
        <div class="movie-desc-card mt-1">
          <h4 class="heading text-bold">Budget</h4>
          <span class="movie-status sub-para text-normal mt-half">${movie.budget === 0
          ? "Not Available"
          : "$" + movie.budget.toLocaleString("en")
        }</span>
        </div>
        <div class="movie-desc-card mt-1">
          <h4 class="heading text-bold">Revenue</h4>
          <span class="movie-status sub-para text-normal mt-half">${movie.revenue === 0
          ? "Not Available"
          : "$" + movie.revenue.toLocaleString("en")
        }<span>
        </div>
        <div class="movie-desc-card mt-1">
          <h4 class="keyword-heading heading text-bold">Keywords</h4>
          <div class="keyword-card">
          </div>
        </div>`;
    })
    .catch((err) => console.error(err));
};

const showCastProfile = () => {
  fetch(
    `https://api.themoviedb.org/3/movie/${movieID}/credits?language=en-US`,
    options
  )
    .then((res) => res.json())
    .then((data) => {
      const cast = data.cast;
      console.log(data);

      const castCardContent = document.querySelector(".cast-card-content");
      const crewCardContent = document.querySelector(".people-content");

      // Build HTML for cast list
      castCardContent.innerHTML = cast
        .slice(0, 15) // limit to top 15 cast (optional)
        .map((actor) => {
          const imgSrc = actor.profile_path
            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
            : "../assets/images/avatar-images.avif";

          return `
            <div class="cast-card">
              <div class="cast-card-image">
                <figure>
                  <img src="${imgSrc}" alt="${actor.name}">
                </figure>
              </div>

              <div class="cast-card-details">
                <div class="actor-name">${actor.name}</div>
                <div class="actor-role">${actor.character || "Unknown"}</div>
              </div>
            </div>
          `;
        })
        .join("");

      // Crew Member Section
      crewCardContent.innerHTML = data.crew
        .slice(0, 6) // top 5 crew
        .map((artist) => {
          return `
            <div class="people-profile">
              <h3 class="main-para">${artist.name}</h3>
              <p class="sub-para">${artist.job || "Crew"}</p>
            </div>
          `;
        })
        .join("");
    })

    .catch((err) => console.log(err));
};

const showKeywords = () => {
  fetch(
    `https://api.themoviedb.org/3/movie/${movieID}/keywords?language=en-US`,
    options
  )
    .then((res) => res.json())
    .then((data) => {
      const keywords = data.keywords;
      console.log(data);

      const keywordsContainer = document.querySelector(".keyword-card");

      keywordsContainer.innerHTML = keywords
        .map(
          (keyword) =>
            `<span class="keywords para my-half mx-half">${keyword.name}</span>`
        )
        .join("");
    })
    .catch((err) => console.error(err));
};

(async () => {
  await showMovieDetails();
  await showCastProfile();
  await showKeywords();
})();


// Play Movie Trailer Video Script
const playTrailerBtn = document.querySelector(".play-icon");
const trailerModal = document.getElementById("trailerModal");
const trailerVideo = document.getElementById("trailerVideo");
const closeBtn = document.querySelector(".close-btn");

// ----------- Popup Function -----------
function showPopup(message) {
  let popup = document.createElement("div");
  popup.className = "popup-message";
  popup.textContent = message;

  document.body.appendChild(popup);

  // Show animation
  setTimeout(() => {
    popup.classList.add("show");
  }, 10);

  // Remove after 5 seconds
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 500);
  }, 2000);
}

// ----------- Fetch Trailer -----------
const fetchTrailer = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieID}/videos?language=en-US`,
    options
  );

  const data = await res.json();
  const trailers = data.results.filter((item) => item.type === "Trailer");

  if (trailers.length === 0) {
    showPopup("No trailer available for this TV show");
    return;
  }

  const youtubeKey = trailers[0].key;
  const youtubeURL = `https://www.youtube.com/embed/${youtubeKey}?autoplay=1`;

  trailerVideo.src = youtubeURL;
  trailerModal.style.display = "flex";
};

// ----------- Event Listeners -----------
document.addEventListener("click", (e) => {
  if (e.target.closest(".play-icon")) {
    fetchTrailer();
  }
});

closeBtn.addEventListener("click", () => {
  trailerModal.style.display = "none";
  trailerVideo.src = "";
});

trailerModal.addEventListener("click", (e) => {
  if (e.target === trailerModal) {
    trailerModal.style.display = "none";
    trailerVideo.src = "";
  }
});

