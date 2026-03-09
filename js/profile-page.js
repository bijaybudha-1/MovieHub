/* ============================================================
   MovieHub 2026 — Profile Page Logic
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Check auth
  if (!isLoggedIn()) {
    requireAuth();
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("moviehub_currentUser"));

  // Render User Profile
  renderUserProfile(currentUser);

  // Stats
  updateStats();

  // Watchlist preview
  renderWatchlistPreview("profile-watchlist", 4);

  // Ratings preview
  updateRatingsPreview();

  // Dark mode toggle sync
  initToggles();

  // Action Buttons
  initActionButtons();

  initScrollReveal();
  animateCounters();
});

function renderUserProfile(user) {
  if (!user) return;
  setText("user-display-name", user.name);
  setText(
    "user-display-username",
    `@${user.username || user.name.toLowerCase().replace(/\s/g, "")}`,
  );
  setText("user-display-email", user.email);
  setText(
    "user-display-username-small",
    `@${user.username || user.name.toLowerCase().replace(/\s/g, "")}`,
  );

  const avatar = document.querySelector(".profile-avatar-lg");
  if (avatar) {
    avatar.src =
      user.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e50914&color=fff&size=120&font-size=0.4`;
  }
}

function updateStats() {
  const wl = safeParse("moviehub_watchlist");
  const ratings = safeParse("moviehub_ratings");
  const favs = safeParse("moviehub_favorites");
  const stats =
    typeof getRatingStats === "function" ? getRatingStats() : { average: 0 };

  setStat("stat-watchlist", wl.length);
  setStat("stat-rated", ratings.length);
  setStat("stat-favorites", favs.length);
  setText("stat-avg", stats.average);
}

function updateRatingsPreview() {
  const ratings = safeParse("moviehub_ratings");
  const container = document.getElementById("profile-ratings");
  if (!container) return;

  const ratingsList = ratings.slice(0, 4);
  if (ratingsList.length === 0) {
    container.innerHTML =
      '<div class="empty-state" style="padding:var(--space-xl);"><i class="bx bx-star" style="font-size:2.5rem;"></i><h3 style="font-size:var(--fs-md);">No ratings yet</h3><p style="font-size:var(--fs-sm);">Rate movies and shows to see them here!</p></div>';
  } else {
    container.innerHTML = ratingsList
      .map(
        (item) => `
          <div class="watchlist-card"><img src="${item.poster_path || "https://ui-avatars.com/api/?name=" + encodeURIComponent(item.title) + "&background=333&color=fff"}" alt="${item.title}" loading="lazy"><div class="watchlist-card-info"><h4>${item.title}</h4><p>⭐ ${item.rating}/10</p></div></div>
        `,
      )
      .join("");
  }
}

function initToggles() {
  const dmToggle = document.getElementById("dark-mode-toggle");
  if (dmToggle) {
    dmToggle.checked =
      document.documentElement.getAttribute("data-theme") !== "light";
    dmToggle.addEventListener("change", () => {
      const theme = dmToggle.checked ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("moviehub_theme", theme);
    });
  }
}

function initActionButtons() {
  // Clear Data
  const clearBtn = document.getElementById("clear-data-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (
        confirm(
          "Are you sure you want to clear your watchlist, ratings, and favorites? This action cannot be undone.",
        )
      ) {
        localStorage.removeItem("moviehub_watchlist");
        localStorage.removeItem("moviehub_ratings");
        localStorage.removeItem("moviehub_favorites");
        localStorage.removeItem("moviehub_reviews");
        showToast("Activity data cleared", "success");
        setTimeout(() => location.reload(), 1000);
      }
    });
  }

  // Logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("moviehub_currentUser");
      showToast("Logged out successfully", "success");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1000);
    });
  }
}

// Helpers
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setStat(id, val) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = val;
    el.dataset.count = val;
  }
}
