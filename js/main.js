/* ============================================================
   MovieHub 2026 — Main Application Logic
   ============================================================ */

/* ── DOM Ready ─────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initThemeToggle();
  initFooterYear();
  initActiveLinks();
  initAuthStatus();
});

/* ── Authentication & Authorization ────────────────────────── */
function isLoggedIn() {
  return localStorage.getItem("moviehub_user") !== null;
}

function initAuthStatus() {
  const profile = document.querySelector(".nav-profile img");
  if (profile && isLoggedIn()) {
    const user = JSON.parse(localStorage.getItem("moviehub_user"));
    profile.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e50914&color=fff&size=36`;
  }
}

function requireAuth(action) {
  if (!isLoggedIn()) {
    showToast("Please login to continue", "info");
    setTimeout(() => {
      // For static site, redirect to login page
      const base = getPageBase();
      window.location.href = base + "login.html";
    }, 1500);
    return false;
  }
  return true;
}

/* ── Mobile Navbar Toggle ──────────────────────────────────── */
function initNavbar() {
  const hamburger = document.querySelector(".nav-hamburger");
  const mobileNav = document.querySelector(".mobile-nav");
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileNav.classList.toggle("active");
  });

  // Close on link click
  mobileNav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mobileNav.classList.remove("active");
    });
  });

  // Scroll shadow on navbar
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener(
      "scroll",
      () => {
        navbar.classList.toggle("scrolled", window.scrollY > 20);
      },
      { passive: true },
    );
  }
}

/* ── Theme Toggle ──────────────────────────────────────────── */
function initThemeToggle() {
  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;

  const savedTheme = localStorage.getItem("moviehub_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(toggle, savedTheme);

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("moviehub_theme", next);
    updateThemeIcon(toggle, next);
  });
}

function updateThemeIcon(toggle, theme) {
  const icon = toggle.querySelector("i");
  if (!icon) return;
  icon.className = theme === "dark" ? "bx bx-sun" : "bx bx-moon";
}

/* ── Active Nav Link ───────────────────────────────────────── */
function initActiveLinks() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkPage = href.split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}

/* ── Footer Year ───────────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Toast Notification System ─────────────────────────────── */
function showToast(message, type = "success") {
  // Remove existing
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icons = { success: "bx-check", error: "bx-x", info: "bx-info-circle" };
  toast.innerHTML = `
    <div class="toast-icon"><i class="bx ${icons[type] || icons.success}"></i></div>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);
  // Trigger show
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("show"));
  });

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hiding");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ── LocalStorage Helpers ──────────────────────────────────── */
function safeParse(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function safeWrite(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* storage full */
  }
}

/* ── Trailer Modal ─────────────────────────────────────────── */
function openTrailerModal(videoKey) {
  if (!requireAuth()) return;
  const modal = document.getElementById("trailer-modal");
  const iframe = document.getElementById("trailer-iframe");
  if (!modal || !iframe) return;

  iframe.src = `https://www.youtube.com/embed/${videoKey}?autoplay=1`;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeTrailerModal() {
  const modal = document.getElementById("trailer-modal");
  const iframe = document.getElementById("trailer-iframe");
  if (!modal || !iframe) return;

  modal.classList.remove("active");
  iframe.src = "";
  document.body.style.overflow = "";
}

// Global listener for modal close
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("modal-overlay") ||
    e.target.closest(".modal-close")
  ) {
    closeTrailerModal();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeTrailerModal();
});

/* ── Rating Color Helper ───────────────────────────────────── */
function getRatingClass(vote) {
  const pct = Math.round(vote * 10);
  if (pct >= 70) return "high";
  if (pct >= 50) return "mid";
  return "low";
}

function getRatingColor(vote) {
  const pct = Math.round(vote * 10);
  if (pct >= 70) return "#22c55e";
  if (pct >= 50) return "#f59e0b";
  return "#ef4444";
}

/* ── Image Fallback Helper ─────────────────────────────────── */
function handlePersonImageError(img) {
  const name = img.alt || "User";
  img.onerror = null; // Prevent infinite loop
  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a25&color=fff&size=512`;
}

/* ── Page Base Path Helper ─────────────────────────────────── */
function getPageBase() {
  // If we're on a page inside /pages/, detail links are same-directory.
  // If we're on a root page (index.html), detail links need pages/ prefix.
  const path = window.location.pathname;
  const inPages = path.includes("/pages/");
  return inPages ? "" : "pages/";
}

/* ── Movie Card HTML Builder ───────────────────────────────── */
function buildMovieCard(item, type = "movie") {
  const title = item.title || item.name || "Untitled";
  const date = item.release_date || item.first_air_date || "";
  const poster = getImageUrl(item.poster_path, "w342");
  const rating = (item.vote_average || 0).toFixed(1);
  const ratingClass = getRatingClass(item.vote_average || 0);
  const base = getPageBase();
  const detailPage =
    base + (type === "tv" ? "tv-details.html" : "movie-details.html");

  return `
    <div class="movie-card reveal" data-id="${item.id}" data-type="${type}">
      <a href="${detailPage}?id=${item.id}" class="movie-card-poster">
        <img src="${poster}" alt="${title}" loading="lazy">
        <div class="card-rating ${ratingClass}">
          <i class="bx bxs-star"></i>
          <span>${rating}</span>
        </div>
        <div class="movie-card-overlay">
          <div class="movie-card-actions">
            <button class="btn-icon action-watchlist" title="Add to Watchlist" data-id="${item.id}" data-title="${title}" data-poster="${poster}" onclick="event.preventDefault();event.stopPropagation();">
              <i class="bx bx-bookmark"></i>
            </button>
            <button class="btn-icon action-favorite" title="Favorite" data-id="${item.id}" data-title="${title}" data-poster="${poster}" onclick="event.preventDefault();event.stopPropagation();">
              <i class="bx bx-heart"></i>
            </button>
          </div>
        </div>
      </a>
      <div class="movie-card-info">
        <h3 class="movie-card-title">${title}</h3>
        <p class="movie-card-date">${date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBA"}</p>
      </div>
    </div>
  `;
}

/* ── Global Quick Actions (Watchlist / Favorite) ───────────── */
document.addEventListener("click", (e) => {
  const wlBtn = e.target.closest(".action-watchlist");
  if (wlBtn) {
    if (!requireAuth()) return;
    const { id, title, poster } = wlBtn.dataset;
    const list = safeParse("moviehub_watchlist");
    if (list.find((m) => String(m.id) === String(id))) {
      showToast(`"${title}" is already in your watchlist`, "info");
    } else {
      list.unshift({ id, title, poster_path: poster });
      safeWrite("moviehub_watchlist", list);
      showToast(`Added "${title}" to watchlist`, "success");
    }
    return;
  }

  const favBtn = e.target.closest(".action-favorite");
  if (favBtn) {
    if (!requireAuth()) return;
    const { id, title, poster } = favBtn.dataset;
    const list = safeParse("moviehub_favorites");
    if (list.find((m) => String(m.id) === String(id))) {
      showToast(`"${title}" is already in favorites`, "info");
    } else {
      list.unshift({ id, title, poster_path: poster });
      safeWrite("moviehub_favorites", list);
      showToast(`Added "${title}" to favorites`, "success");
    }
    return;
  }
});

/* ── Button Ripple Effect ──────────────────────────────────── */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn");
  if (!btn) return;

  const ripple = document.createElement("span");
  ripple.className = "ripple";
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = e.clientX - rect.left - size / 2 + "px";
  ripple.style.top = e.clientY - rect.top - size / 2 + "px";
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});
