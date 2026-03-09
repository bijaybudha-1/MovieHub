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

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem("moviehub_users") || "[]");

  // Find user
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Set current user
    localStorage.setItem("moviehub_currentUser", JSON.stringify(user));

    showToast("Welcome back!", "success");
    setTimeout(() => (window.location.href = "../index.html"), 1500);
  } else {
    showToast("Invalid email or password", "error");
  }
});
