// ================= TMDB OPTIONS =================
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2Q1NTY0ODQyMWQyYTY5NDM1YmIxZGQxMTFiZGZlMiIsIm5iZiI6MTc2MjM5NTUxMC4zMDcwMDAyLCJzdWIiOiI2OTBjMDU3NmI5YzdlODM4MTU5MzRmZTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RixiipK_9oFs9wwUGOmiQFCEw2SiTTXu0qyiUOvArY0",
  },
};

// ================= DOM ELEMENTS =================
const allTVShowsContent = document.querySelector(".all-tvShows-card-content");
const viewMoreBtn = document.querySelector(".view-more-series-btn");

// ================= LOADING SPINNER =================
const spinner = document.createElement("div");
spinner.className = "loading-spinner";
spinner.innerHTML = "⏳ Loading...";
spinner.style.textAlign = "center";
spinner.style.padding = "20px";
spinner.style.display = "none";
allTVShowsContent.after(spinner);

// ================= STATE =================
let currentPage = 1;
let isLoading = false;
let infiniteScrollEnabled = false;

// ================= API URL =================
function getTVShowsUrl(page) {
  return `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc`;
}

// ================= FETCH & RENDER =================
async function loadTVShows(page) {
  if (isLoading) return;
  isLoading = true;
  spinner.style.display = "block";

  try {
    const res = await fetch(getTVShowsUrl(page), options);
    const data = await res.json();

    data.results.forEach((tv) => {
      const poster = tv.poster_path
        ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
        : "../assets/images/no-image.png";

      const rating = Math.round(tv.vote_average * 10);

      allTVShowsContent.innerHTML += `
        <div class="movie-card-content mt-2">
          <div class="movie-poster" id="${tv.id}">
            <img class="tv-show-img" src="${poster}" alt="${tv.name}" />

            <div class="rating-circle" style="--rating:${rating};">
              <svg class="progress-ring" width="40" height="40">
                <circle class="ring-bg" cx="20" cy="20" r="15"></circle>
                <circle class="ring-progress" cx="20" cy="20" r="15"></circle>
              </svg>
              <span class="rating-text">${rating}%</span>
            </div>

            <div class="more-icon sub-heading">
              <i class='bx bx-dots-horizontal-rounded'></i>
              <ul class="option-content hidden">
                <li class="option-link">Add to List</li>
                <li class="option-link">Favourite</li>
                <li class="option-link">Watchlist</li>
                <li class="option-link">Your Rating</li>
              </ul>
            </div>
          </div>

          <div class="movie-description text-white p-x-1 p-y-2">
            <h2 class="movie-name sub-para pointer text-black">${tv.name}</h2>
            <h3 class="relase-date mini-para text-gray">${tv.first_air_date || "N/A"}</h3>
          </div>
        </div>
      `;
    });

    applyRatingColors();
    currentPage++;
  } catch (err) {
    console.error("ERROR:", err);
  }

  spinner.style.display = "none";
  isLoading = false;
}

// ================= RATING COLORS =================
function applyRatingColors() {
  document.querySelectorAll(".rating-circle").forEach((circle) => {
    const rating = parseInt(circle.style.getPropertyValue("--rating"));
    const ring = circle.querySelector(".ring-progress");

    if (rating <= 10) ring.style.stroke = "var(--stat-10)";
    else if (rating <= 20) ring.style.stroke = "var(--stat-20)";
    else if (rating <= 30) ring.style.stroke = "var(--stat-30)";
    else if (rating <= 40) ring.style.stroke = "var(--stat-40)";
    else if (rating <= 50) ring.style.stroke = "var(--stat-50)";
    else if (rating <= 60) ring.style.stroke = "var(--stat-60)";
    else if (rating <= 70) ring.style.stroke = "var(--stat-70)";
    else if (rating <= 80) ring.style.stroke = "var(--stat-80)";
    else if (rating <= 90) ring.style.stroke = "var(--stat-90)";
    else ring.style.stroke = "var(--stat-100)";
  });
}

// ================= FIRST LOAD =================
loadTVShows(currentPage);

// ================= VIEW MORE BUTTON =================
if (viewMoreBtn) {
  viewMoreBtn.addEventListener("click", () => {
    loadTVShows(currentPage);
    infiniteScrollEnabled = true;
    viewMoreBtn.style.display = "none";
  });
}

// ================= INFINITE SCROLL =================
window.addEventListener("scroll", () => {
  if (!infiniteScrollEnabled || isLoading) return;

  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 300
  ) {
    loadTVShows(currentPage);
  }
});

// ================= NAVIGATION =================
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("tv-show-img")) {
    const id = e.target.closest(".movie-poster").id;
    window.location.href = `tvShowDetails.html?id=${id}`;
  }
});

// ---- More-icon dropdown and quick actions (favorite / watchlist / rating) ----
function showToast(message, type = "success") {
  const existing = document.querySelector('.toast-notification'); if (existing) existing.remove();
  const toast = document.createElement('div'); toast.className = `toast-notification ${type}`;
  let icon = '✓'; if (type === 'error') icon = '✕'; if (type === 'info') icon = 'ℹ';
  toast.innerHTML = `<span class="toast-notification-icon">${icon}</span><span class="toast-notification-message">${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(()=>{ toast.classList.add('hide'); setTimeout(()=>toast.remove(),300); }, 3000);
}

function safeParse(key){ try{ return JSON.parse(localStorage.getItem(key))||[] }catch(e){return []} }
function safeWrite(key,val){ try{ localStorage.setItem(key, JSON.stringify(val)) }catch(e){} }

document.addEventListener('click', (e)=>{
  const more = e.target.closest('.more-icon');
  if (more && !e.target.closest('.option-link')) {
    const option = more.querySelector('.option-content');
    document.querySelectorAll('.option-content').forEach(o=>{ if (o !== option) o.classList.add('hidden'); });
    option.classList.toggle('hidden');
    return;
  }

  const opt = e.target.closest('.option-link');
  if (!opt) return;
  const poster = opt.closest('.movie-poster'); if (!poster) return;
  const id = poster.id;
  const card = opt.closest('.movie-card-content');
  const titleEl = card && card.querySelector('.movie-name');
  const imgEl = poster.querySelector('img');
  const title = titleEl ? titleEl.textContent.trim() : 'Show';
  const posterSrc = imgEl ? imgEl.src : '';

  const actionText = opt.textContent.trim().toLowerCase();
  if (actionText.includes('favourite') || actionText.includes('favorite')) {
    const fav = safeParse('moviehub_favorites');
    if (fav.find(m=>String(m.id)===String(id))) { showToast(`Already in favorites: ${title}`,'info'); }
    else { fav.unshift({id,title,poster_path:posterSrc}); safeWrite('moviehub_favorites',fav); showToast(`Your "${title}" added a favorite`,'success'); }
  } else if (actionText.includes('watchlist')) {
    const wl = safeParse('moviehub_watchlist');
    if (wl.find(m=>String(m.id)===String(id))) { showToast(`Already in watchlist: ${title}`,'info'); }
    else { wl.unshift({id,title,poster_path:posterSrc}); safeWrite('moviehub_watchlist',wl); showToast(`Added to watch list "${title}"`,'success'); }
  } else if (actionText.includes('add to list')) {
    const al = safeParse('moviehub_addtolist');
    if (al.find(m=>String(m.id)===String(id))) { showToast(`Already in your list: ${title}`,'info'); }
    else { al.unshift({id,title,poster_path:posterSrc}); safeWrite('moviehub_addtolist',al); showToast(`Added to your list "${title}"`,'success'); }
  } else if (actionText.includes('rating') || actionText.includes('your rating')) {
    const val = prompt(`Rate "${title}" (1-10):`);
    if (val === null) return;
    const n = Number(val);
    if (!n || n<1 || n>10) return showToast('Please enter a number between 1 and 10','error');
    const ratings = safeParse('moviehub_ratings'); ratings.unshift({id,title,rating:n}); safeWrite('moviehub_ratings',ratings); showToast(`You rated "${title}" ${n}/10`,'success');
  }
  document.querySelectorAll('.option-content').forEach(o=>o.classList.add('hidden'));
});
