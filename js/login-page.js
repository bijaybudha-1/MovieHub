/* ============================================================
   MovieHub 2026 — Login Page Logic
   ============================================================ */

// Toggle password visibility
document.getElementById("toggle-password").addEventListener("click", () => {
  const input = document.getElementById("login-password");
  const icon = document.getElementById("toggle-password").querySelector("i");
  if (input.type === "password") {
    input.type = "text";
    icon.className = "bx bx-show";
  } else {
    input.type = "password";
    icon.className = "bx bx-hide";
  }
});

// Form submit
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  if (email && password.length >= 6) {
    showToast("Welcome back!", "success");
    setTimeout(() => (window.location.href = "../index.html"), 1500);
  } else {
    showToast("Please enter valid credentials", "error");
  }
});
