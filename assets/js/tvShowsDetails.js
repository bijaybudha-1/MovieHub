const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2Q1NTY0ODQyMWQyYTY5NDM1YmIxZGQxMTFiZGZlMiIsIm5iZiI6MTc2MjM5NTUxMC4zMDcwMDAyLCJzdWIiOiI2OTBjMDU3NmI5YzdlODM4MTU5MzRmZTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RixiipK_9oFs9wwUGOmiQFCEw2SiTTXu0qyiUOvArY0",
  },
};

const movieID = new URLSearchParams(window.location.search).get("id");
const container = document.getElementById("movie-details");

// Fetch TV Show Details
const showMovieDetails = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${movieID}?language=en-US`,
      options
    );
    const tv = await res.json();
    console.log(tv);

    const movieDetailBgImage = document.querySelector(".movie-details-section");
    movieDetailBgImage.style.background = `url(https://image.tmdb.org/t/p/w500${tv.backdrop_path})`;
    movieDetailBgImage.style.backgroundSize = "cover";
    movieDetailBgImage.style.backgroundPosition = "center";

    const runtime =
      tv.episode_run_time.length > 0
        ? `${tv.episode_run_time[0]} min`
        : "Not Available";

    const genres = tv.genres.map((g) => g.name).join(", ");

    container.innerHTML = `
      <div class="movie-content">
        <div class="movie-content-poster w-fit-content">
          <figure>
            <img src="https://image.tmdb.org/t/p/w500${tv.poster_path}" alt="${tv.name}">
          </figure>
        </div>
      </div>

      <div class="movie-poster-desc w-fit-content text-white">
        <h1 class="main-heading mt-1">${tv.name}</h1>

        <div class="fact-content mb-2">
          <span class="release para">${tv.first_air_date}</span>
          <span class="genres para">${genres}</span>
          <span class="runtime para">${runtime}</span>
        </div>

        <div class="icons-content-div d-flex gap-1">
          <div class="icon-content"><a><i class='bx bx-list-plus'></i></a></div>
          <div class="icon-content"><a><i class='bx bx-heart'></i></a></div>
          <div class="icon-content"><a><i class='bx bx-bookmark'></i></a></div>
          <div class="icon-content play-icon">
            <a><span><i class='bx bx-play'></i> <span>Play Trailer</span></span></a>
          </div>
        </div>

        <h2 class="heading mb-half">Overview</h2>
        <h3 class="sub-para movie-title text-common mb-2">${tv.overview}</h3>

        <div class="people-content d-flex justify-between gap-2"></div>
      </div>
    `;

    const movieDescription = document.querySelector(".movie-description-content");
    movieDescription.innerHTML = `
      <div class="movie-desc-card">
        <h4 class="heading text-bold">Status</h4>
        <span class="sub-para mt-half">${tv.status}</span>
      </div>

      <div class="movie-desc-card mt-1">
        <h4 class="heading text-bold">Language</h4>
        <span class="sub-para mt-half">${tv.spoken_languages[0].english_name}</span>
      </div>

      <div class="movie-desc-card mt-1">
        <h4 class="heading text-bold">Seasons</h4>
        <span class="sub-para mt-half">${tv.number_of_seasons}</span>
      </div>

      <div class="movie-desc-card mt-1">
        <h4 class="heading text-bold">Episodes</h4>
        <span class="sub-para mt-half">${tv.number_of_episodes}</span>
      </div>

      <div class="movie-desc-card mt-1">
        <h4 class="keyword-heading heading text-bold">Keywords</h4>
        <div class="keyword-card"></div>
      </div>
    `;
  } catch (error) {
    console.error(error);
  }
};


// Fetch TV Show Cast
const showCastProfile = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${movieID}/credits?language=en-US`,
      options
    );
    const data = await res.json();

    const castCardContent = document.querySelector(".cast-card-content");
    const crewCardContent = document.querySelector(".people-content");

    castCardContent.innerHTML = data.cast
      .slice(0, 15)
      .map((actor) => {
        const img = actor.profile_path
          ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
          : "../assets/images/avatar-images.avif";

        return `
          <div class="cast-card">
            <div class="cast-card-image">
              <figure><img src="${img}" alt="${actor.name}"></figure>
            </div>
            <div class="cast-card-details">
              <div class="actor-name">${actor.name}</div>
              <div class="actor-role">${actor.character}</div>
            </div>
          </div>
        `;
      })
      .join("");

    crewCardContent.innerHTML = data.crew
      .slice(0, 6)
      .map(
        (crew) => `
        <div class="people-profile">
          <h3 class="main-para">${crew.name}</h3>
          <p class="sub-para">${crew.job}</p>
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.log(error);
  }
};

// Fetch TV Show Keywords
const showKeywords = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${movieID}/keywords`,
      options
    );
    const data = await res.json();

    const keywordsContainer = document.querySelector(".keyword-card");

    keywordsContainer.innerHTML = data.results
      .map(
        (keyword) =>
          `<span class="keywords para my-half mx-half">${keyword.name}</span>`
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
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
    `https://api.themoviedb.org/3/tv/${movieID}/videos?language=en-US`,
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

