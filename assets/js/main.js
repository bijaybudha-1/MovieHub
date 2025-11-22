// ============================
// Responsive Navbar
// ============================
const menubar = document.querySelector(".menu-bar-icon");
const mobileNavbar = document.querySelector(".mobile-navbar");
const bar = document.querySelector(".bx-menu");

menubar.addEventListener("click", () => {
  mobileNavbar.classList.toggle("mobile-navbar-active");
  bar.classList.toggle("bx-menu");
  bar.classList.toggle("bx-x");
});

// ============================
// Desktop Navbar Active State
// ============================
const desktopNavbar = document.querySelector(".navbar-content .navbar-items");
const desktopLinks = desktopNavbar.querySelectorAll(".navbar-link");

desktopNavbar.addEventListener("click", (e) => {
  const target = e.target.closest(".navbar-link");
  if (!target) return;

  desktopLinks.forEach((el) => el.classList.remove("navbar-link-active"));
  target.classList.add("navbar-link-active");
});

// ============================
// Mobile Navbar Active State
// ============================
const mobileNav = document.querySelector(".mobile-navbar .navbar-items");
const mobileLinks = mobileNavbar.querySelectorAll(".navbar-link");

mobileNav.addEventListener("click", (e) => {
  const target = e.target.closest(".navbar-link");
  if (!target) return;

  mobileLinks.forEach((el) => el.classList.remove("navbar-link-active"));
  target.classList.add("navbar-link-active");
});

// ============================
// Footer Date
// ============================
const copyDate = document.getElementById("copy-date");
const currentDate = new Date();
copyDate.innerHTML = `&copy;${currentDate.getFullYear()}, `;


document.addEventListener("click", (e) => {
  const clickedIcon = e.target.closest(".more-icon");

  // Get currently open menu (if any)
  const openMenu = document.querySelector(".option-content.d-block");

  // ----------------------------------------------
  // If click is OUTSIDE → Close all menus
  // ----------------------------------------------
  if (!clickedIcon) {
    if (openMenu) {
      openMenu.classList.add("hidden");
      openMenu.classList.remove("d-block");
    }
    return;
  }

  // ----------------------------------------------
  // If clicked on an icon having a menu
  // ----------------------------------------------
  const menu = clickedIcon.querySelector(".option-content");

  if (!menu) return;

  // If clicked the same menu → Toggle close
  if (menu === openMenu) {
    menu.classList.add("hidden");
    menu.classList.remove("d-block");
    return;
  }

  // If another menu was open → Close it
  if (openMenu) {
    openMenu.classList.add("hidden");
    openMenu.classList.remove("d-block");
  }

  // Open the newly clicked menu
  menu.classList.remove("hidden");
  menu.classList.add("d-block");
});

