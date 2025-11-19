

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
