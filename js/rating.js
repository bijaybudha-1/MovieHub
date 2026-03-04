/* ============================================================
   MovieHub 2026 — Interactive Star Rating System
   ============================================================ */

const RATINGS_KEY = "moviehub_ratings";

/* ── Get / Set Ratings ─────────────────────────────────────── */
function getRatings() {
  return safeParse(RATINGS_KEY);
}
function setRatings(list) {
  safeWrite(RATINGS_KEY, list);
}

/* ── Get Rating for a specific item ────────────────────────── */
function getUserRating(id) {
  const ratings = getRatings();
  const found = ratings.find((r) => String(r.id) === String(id));
  return found ? found.rating : 0;
}

/* ── Save Rating ───────────────────────────────────────────── */
function saveRating(id, title, rating, poster) {
  const ratings = getRatings();
  const existingIdx = ratings.findIndex((r) => String(r.id) === String(id));

  const entry = {
    id,
    title,
    rating,
    poster_path: poster || "",
    timestamp: Date.now(),
  };

  if (existingIdx >= 0) {
    ratings[existingIdx] = entry;
    showToast(`Updated rating for "${title}" to ${rating}/10`, "success");
  } else {
    ratings.unshift(entry);
    showToast(`Rated "${title}" ${rating}/10`, "success");
  }

  setRatings(ratings);
  return entry;
}

/* ── Remove Rating ─────────────────────────────────────────── */
function removeRating(id) {
  let ratings = getRatings();
  const item = ratings.find((r) => String(r.id) === String(id));
  ratings = ratings.filter((r) => String(r.id) !== String(id));
  setRatings(ratings);
  if (item) showToast(`Removed rating for "${item.title}"`, "success");
  return ratings;
}

/* ── Create Interactive Star Rating Widget ─────────────────── */
function createStarRating(
  containerId,
  itemId,
  itemTitle,
  itemPoster,
  initialRating = 0,
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const existing = getUserRating(itemId);
  const currentRating = existing || initialRating;

  container.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "star-rating-widget";
  wrapper.style.cssText =
    "display:flex;align-items:center;gap:var(--space-md);";

  const starsWrapper = document.createElement("div");
  starsWrapper.className = "star-rating-interactive";
  starsWrapper.style.cssText = "display:flex;gap:4px;";

  const label = document.createElement("span");
  label.className = "rating-label";
  label.style.cssText =
    "font-size:var(--fs-sm);color:var(--text-secondary);min-width:60px;";
  label.textContent = currentRating ? `${currentRating}/10` : "Rate this";

  for (let i = 1; i <= 10; i++) {
    const star = document.createElement("i");
    star.className = i <= currentRating ? "bx bxs-star" : "bx bx-star";
    star.dataset.value = i;
    star.style.cssText = `
      font-size: 1.4rem;
      cursor: pointer;
      transition: color 0.15s ease, transform 0.2s ease;
      color: ${i <= currentRating ? "#f59e0b" : "var(--text-muted)"};
    `;

    star.addEventListener("mouseenter", () => {
      updateStarVisual(starsWrapper, i);
      label.textContent = `${i}/10`;
    });

    star.addEventListener("click", () => {
      saveRating(itemId, itemTitle, i, itemPoster);
      setStarRating(starsWrapper, i);
      label.textContent = `${i}/10`;
      // Animate
      star.style.transform = "scale(1.4)";
      setTimeout(() => (star.style.transform = "scale(1)"), 200);
    });

    starsWrapper.appendChild(star);
  }

  starsWrapper.addEventListener("mouseleave", () => {
    const saved = getUserRating(itemId);
    setStarRating(starsWrapper, saved);
    label.textContent = saved ? `${saved}/10` : "Rate this";
  });

  wrapper.appendChild(starsWrapper);
  wrapper.appendChild(label);
  container.appendChild(wrapper);
}

function updateStarVisual(wrapper, value) {
  wrapper.querySelectorAll("i").forEach((star) => {
    const v = parseInt(star.dataset.value);
    star.className = v <= value ? "bx bxs-star" : "bx bx-star";
    star.style.color = v <= value ? "#f59e0b" : "var(--text-muted)";
  });
}

function setStarRating(wrapper, value) {
  wrapper.querySelectorAll("i").forEach((star) => {
    const v = parseInt(star.dataset.value);
    star.className = v <= value ? "bx bxs-star" : "bx bx-star";
    star.style.color = v <= value ? "#f59e0b" : "var(--text-muted)";
  });
}

/* ── Render Rated Movies Grid ──────────────────────────────── */
function renderRatingsGrid(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const ratings = getRatings();
  if (ratings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bx bx-star"></i>
        <h3>No ratings yet</h3>
        <p>Start rating movies and shows!</p>
        <a href="index.html" class="btn btn-primary"><i class="bx bx-home"></i> Browse Movies</a>
      </div>
    `;
    return;
  }

  container.innerHTML = ratings
    .map(
      (item) => `
    <div class="watchlist-card reveal" data-id="${item.id}">
      ${item.poster_path ? `<img src="${item.poster_path}" alt="${item.title}" loading="lazy">` : ""}
      <div class="watchlist-card-info">
        <h4>${item.title}</h4>
        <p>
          ${"★".repeat(Math.round(item.rating))}${"☆".repeat(10 - Math.round(item.rating))}
          <strong>${item.rating}/10</strong>
        </p>
      </div>
      <button class="watchlist-remove rating-remove" data-id="${item.id}" title="Remove Rating">
        <i class="bx bx-x"></i>
      </button>
    </div>
  `,
    )
    .join("");

  container.querySelectorAll(".rating-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeRating(btn.dataset.id);
      renderRatingsGrid(containerId);
      if (typeof initScrollReveal === "function") initScrollReveal();
    });
  });
}

/* ── Rating Stats ──────────────────────────────────────────── */
function getRatingStats() {
  const ratings = getRatings();
  if (ratings.length === 0)
    return { total: 0, average: 0, distribution: new Array(10).fill(0) };

  const total = ratings.length;
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  const average = (sum / total).toFixed(1);

  const distribution = new Array(10).fill(0);
  ratings.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 10) distribution[r.rating - 1]++;
  });

  return { total, average, distribution };
}
