// Responsive Navbar
const menubar = document.querySelector(".menu-bar-icon");
const mobileNavbar = document.querySelector(".mobile-navbar");
const bar = document.querySelector(".bx-menu");

menubar.addEventListener("click", () => {
  mobileNavbar.classList.toggle("mobile-navbar-active");
});

menubar.addEventListener("click", () => {
  bar.classList.toggle("bx-menu");
  bar.classList.toggle("bx-x");
});

// ---- Desktop Navbar Active State ----
const desktopNavbar = document.querySelector(".navbar-content .navbar-items");
const desktopLinks = desktopNavbar.querySelectorAll(".navbar-link");

desktopNavbar.addEventListener("click", (e) => {
  const target = e.target.closest(".navbar-link");
  if (!target) return;

  desktopLinks.forEach((el) => el.classList.remove("navbar-link-active"));
  target.classList.add("navbar-link-active");
});

// ---- Mobile Navbar Active State ----
const mobileNav = document.querySelector(".mobile-navbar .navbar-items");
const mobileLinks = mobileNavbar.querySelectorAll(".navbar-link");

mobileNav.addEventListener("click", (e) => {
  const target = e.target.closest(".navbar-link");
  if (!target) return;

  mobileLinks.forEach((el) => el.classList.remove("navbar-link-active"));
  target.classList.add("navbar-link-active");
});

// Footer Section
const copyDate = document.getElementById("copy-date");
const currentDate = new Date();

copyDate.innerHTML =`&copy;${currentDate.getFullYear()}, `;

// Trending Today and This Week Btn Script
const todayBtn = document.querySelector(".today-btn");
const thisWeekBtn = document.querySelector(".this-week-btn");
const contentTitle = document.querySelector(".content-title");

contentTitle.addEventListener("click", (e) => {
  console.log(e.target.classList[0]);
  if (e.target.classList[0] === "today-btn") {
    todayBtn.classList.add("trending-active");
    thisWeekBtn.classList.remove("trending-active");
  } else {
    thisWeekBtn.classList.add("trending-active");
    todayBtn.classList.remove("trending-active");
  }
});


// Poster Image More Option Icon Hidden and Display Script
const moreIcons = document.querySelectorAll(".more-icon");
const allMenus = document.querySelectorAll(".option-content");

// Close all menus function
function closeAllMenus() {
  allMenus.forEach(menu => {
    menu.classList.add("hidden");
    menu.classList.remove("d-block");
  });
}

// Add event to each more icon
moreIcons.forEach(icon => {
  const menu = icon.querySelector(".option-content");

  // Click on the more icon
  icon.addEventListener("click", (e) => {
    e.stopPropagation();

    // If this menu is already open → close all
    const isOpen = menu.classList.contains("d-block");
    closeAllMenus();

    // If it was closed before → open it
    if (!isOpen) {
      menu.classList.remove("hidden");
      menu.classList.add("d-block");
    }
  });

  // Click inside the menu (option clicked)
  menu.addEventListener("click", (e) => {
    e.stopPropagation();   // prevent document click
    closeAllMenus();       // close after selecting an option
  });
});

// Close when clicking outside
document.addEventListener("click", () => {
  closeAllMenus();
});
