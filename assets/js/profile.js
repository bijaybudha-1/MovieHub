// Tab Navigation Functionality
document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".setting-nav-area li");
  const sections = {
    "Add to List": document.querySelector(".add-to-list-section"),
    Favorite: document.querySelector(".favorite-section"),
    "Watch List": document.querySelector(".watch-list-section"),
    Rating: document.querySelector(".rating-section"),
    Setting: document.querySelector(".setting-section"),
  };

  // Hide all sections except the first one
  function hideAllSections() {
    Object.values(sections).forEach((section) => {
      if (section) {
        section.style.display = "none";
      }
    });
  }

  // Remove active class from all nav items
  function removeActiveClass() {
    navItems.forEach((item) => {
      item.classList.remove("active");
    });
  }

  // Show specific section
  function showSection(sectionName) {
    hideAllSections();
    if (sections[sectionName]) {
      sections[sectionName].style.display = "block";
    }
  }

  // Initialize: Show first section and set first nav as active
  hideAllSections();
  if (sections["Add to List"]) {
    sections["Add to List"].style.display = "block";
  }
  if (navItems[0]) {
    navItems[0].classList.add("active");
  }

  // Add click event listeners to nav items
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const sectionName = this.textContent.trim();

      // Remove active class from all items
      removeActiveClass();

      // Add active class to clicked item
      this.classList.add("active");

      // Show corresponding section
      showSection(sectionName);
    });
  });
});

// Profile Page JavaScript - Tab Navigation & Card Actions

document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // TAB NAVIGATION FUNCTIONALITY
  // ============================================

  const navItems = document.querySelectorAll(".setting-nav-area li");
  const sections = {
    "Add to List": document.querySelector(".add-to-list-section"),
    Favorite: document.querySelector(".favorite-section"),
    "Watch List": document.querySelector(".watch-list-section"),
    Rating: document.querySelector(".rating-section"),
    Setting: document.querySelector(".setting-section"),
  };

  // Hide all sections
  function hideAllSections() {
    Object.values(sections).forEach((section) => {
      if (section) {
        section.style.display = "none";
      }
    });
  }

  // Remove active class from all nav items
  function removeActiveClass() {
    navItems.forEach((item) => {
      item.classList.remove("active");
    });
  }

  // Show specific section
  function showSection(sectionName) {
    hideAllSections();
    if (sections[sectionName]) {
      sections[sectionName].style.display = "block";
    }
  }

  // Initialize: Show first section
  hideAllSections();
  if (sections["Add to List"]) {
    sections["Add to List"].style.display = "block";
  }
  if (navItems[0]) {
    navItems[0].classList.add("active");
  }

  // Add click event listeners to nav items
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const sectionName = this.textContent.trim();
      removeActiveClass();
      this.classList.add("active");
      showSection(sectionName);
    });
  });

  // ============================================
  // TOAST NOTIFICATION FUNCTION
  // ============================================

  function showToast(message, type = "success") {
    // Remove existing toast if any
    const existingToast = document.querySelector(".toast-notification");
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;

    // Set icon based on type
    let icon = "✓";
    if (type === "error") icon = "✕";
    if (type === "info") icon = "ℹ";

    toast.innerHTML = `
      <span class="toast-notification-icon">${icon}</span>
      <span class="toast-notification-message">${message}</span>
    `;

    // Add to body
    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // ============================================
  // CARD BUTTON ACTIONS
  // ============================================

  // Get all cards in all sections
  const allCards = document.querySelectorAll(
    ".add-to-list-card, .favorite-card",
  );

  allCards.forEach((card) => {
    const buttons = card.querySelectorAll(".movie-card-btn button");
    const movieName =
      card.querySelector(".main-para, .para")?.textContent || "Movie";

    buttons.forEach((button, index) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();

        // Button actions based on index
        switch (index) {
          case 0: // Rating It
            handleRating(movieName);
            break;
          case 1: // Favorite
            handleFavorite(movieName);
            break;
          case 2: // Add to List
            handleAddToList(movieName);
            break;
          case 3: // Remove
            handleRemove(card, movieName);
            break;
        }
      });
    });
  });

  // ============================================
  // BUTTON ACTION HANDLERS
  // ============================================

  function handleRating(movieName) {
    showToast(`Rating feature for "${movieName}"`, "info");
    // Add your rating logic here
  }

  function handleFavorite(movieName) {
    showToast(`"${movieName}" added to favorites!`, "success");
    // Add your favorite logic here
  }

  function handleAddToList(movieName) {
    showToast(`"${movieName}" added to your list!`, "success");
    // Add your list logic here
  }

  function handleRemove(card, movieName) {
    // Add removing animation
    card.classList.add("card-removing");

    // Show toast notification
    showToast(`"${movieName}" has been removed`, "success");

    // Remove card after animation completes
    setTimeout(() => {
      card.remove();
    }, 400);
  }

  // ============================================
  // UTILITY: Update Card Count (Optional)
  // ============================================

  function updateCardCount() {
    const activeSection = document.querySelector(
      '.add-to-list-section:not([style*="display: none"]), .favorite-section:not([style*="display: none"])',
    );
    if (activeSection) {
      const cards = activeSection.querySelectorAll(
        ".add-to-list-card, .favorite-card",
      );
      console.log(`Cards in current section: ${cards.length}`);
    }
  }
});
