/* ============================================================
   MovieHub 2026 — Watchlist Manager
   ============================================================ */

const WL_KEY = 'moviehub_watchlist';
const FAV_KEY = 'moviehub_favorites';

/* ── Get / Set ─────────────────────────────────────────────── */
function getWatchlist() { return safeParse(WL_KEY); }
function setWatchlist(list) { safeWrite(WL_KEY, list); }
function getFavorites() { return safeParse(FAV_KEY); }
function setFavorites(list) { safeWrite(FAV_KEY, list); }

/* ── Add to Watchlist ──────────────────────────────────────── */
function addToWatchlist(item) {
  const list = getWatchlist();
  if (list.find(m => String(m.id) === String(item.id))) {
    showToast(`"${item.title}" is already in your watchlist`, 'info');
    return false;
  }
  list.unshift(item);
  setWatchlist(list);
  showToast(`Added "${item.title}" to watchlist`, 'success');
  return true;
}

/* ── Remove from Watchlist ─────────────────────────────────── */
function removeFromWatchlist(id) {
  let list = getWatchlist();
  const item = list.find(m => String(m.id) === String(id));
  list = list.filter(m => String(m.id) !== String(id));
  setWatchlist(list);
  if (item) showToast(`Removed "${item.title}" from watchlist`, 'success');
  return list;
}

/* ── Add to Favorites ──────────────────────────────────────── */
function addToFavorites(item) {
  const list = getFavorites();
  if (list.find(m => String(m.id) === String(item.id))) {
    showToast(`"${item.title}" is already in favorites`, 'info');
    return false;
  }
  list.unshift(item);
  setFavorites(list);
  showToast(`Added "${item.title}" to favorites`, 'success');
  return true;
}

/* ── Remove from Favorites ─────────────────────────────────── */
function removeFromFavorites(id) {
  let list = getFavorites();
  const item = list.find(m => String(m.id) === String(id));
  list = list.filter(m => String(m.id) !== String(id));
  setFavorites(list);
  if (item) showToast(`Removed "${item.title}" from favorites`, 'success');
  return list;
}

/* ── Render Watchlist Grid ─────────────────────────────────── */
function renderWatchlistGrid(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const list = getWatchlist();
  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bx bx-bookmark"></i>
        <h3>Your watchlist is empty</h3>
        <p>Start adding movies and shows you want to watch!</p>
        <a href="index.html" class="btn btn-primary"><i class="bx bx-home"></i> Browse Movies</a>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="watchlist-card reveal" data-id="${item.id}">
      <img src="${item.poster_path}" alt="${item.title}" loading="lazy">
      <div class="watchlist-card-info">
        <h4>${item.title}</h4>
        <p>Added to watchlist</p>
      </div>
      <button class="watchlist-remove" data-id="${item.id}" title="Remove">
        <i class="bx bx-x"></i>
      </button>
    </div>
  `).join('');

  // Remove handler
  container.querySelectorAll('.watchlist-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      removeFromWatchlist(id);
      renderWatchlistGrid(containerId);
      // Re-init scroll reveal for new elements
      if (typeof initScrollReveal === 'function') initScrollReveal();
    });
  });
}

/* ── Render Favorites Grid ─────────────────────────────────── */
function renderFavoritesGrid(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const list = getFavorites();
  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bx bx-heart"></i>
        <h3>No favorites yet</h3>
        <p>Mark movies and shows as favorites to see them here!</p>
        <a href="index.html" class="btn btn-primary"><i class="bx bx-home"></i> Browse Movies</a>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="watchlist-card reveal" data-id="${item.id}">
      <img src="${item.poster_path}" alt="${item.title}" loading="lazy">
      <div class="watchlist-card-info">
        <h4>${item.title}</h4>
        <p>Favorited</p>
      </div>
      <button class="watchlist-remove fav-remove" data-id="${item.id}" title="Remove">
        <i class="bx bx-x"></i>
      </button>
    </div>
  `).join('');

  container.querySelectorAll('.fav-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromFavorites(btn.dataset.id);
      renderFavoritesGrid(containerId);
      if (typeof initScrollReveal === 'function') initScrollReveal();
    });
  });
}

/* ── Watchlist Preview (for homepage) ──────────────────────── */
function renderWatchlistPreview(containerId, maxItems = 4) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const list = getWatchlist().slice(0, maxItems);
  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:var(--space-xl);">
        <i class="bx bx-bookmark" style="font-size:2.5rem;"></i>
        <h3 style="font-size:var(--fs-md);">No items in watchlist</h3>
        <p style="font-size:var(--fs-sm);">Add movies and shows to your watchlist!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="watchlist-card">
      <img src="${item.poster_path}" alt="${item.title}" loading="lazy">
      <div class="watchlist-card-info">
        <h4>${item.title}</h4>
        <p>In your watchlist</p>
      </div>
    </div>
  `).join('');
}
