/* ============================================================
   MovieHub 2026 — Register Page Logic
   ============================================================ */

// Toggle password
const toggleBtn = (btnId, inputId) => {
  document.getElementById(btnId).addEventListener("click", () => {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(btnId).querySelector("i");
    if (input.type === "password") {
      input.type = "text";
      icon.className = "bx bx-show";
    } else {
      input.type = "password";
      icon.className = "bx bx-hide";
    }
  });
};

toggleBtn("toggle-reg-password", "reg-password");
toggleBtn("toggle-reg-confirm", "reg-confirm");

// Password strength
document.getElementById("reg-password").addEventListener("input", (e) => {
  const pw = e.target.value;
  const bars = document.querySelectorAll(".strength-bar");
  const text = document.querySelector(".strength-text");
  let strength = 0;
  if (pw.length >= 8) strength++;
  if (/[A-Z]/.test(pw)) strength++;
  if (/[0-9]/.test(pw)) strength++;
  if (/[^A-Za-z0-9]/.test(pw)) strength++;

  const colors = ["#ef4444", "#f59e0b", "#22c55e", "#10b981"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  bars.forEach((bar, i) => {
    bar.style.background =
      i < strength ? colors[Math.min(strength - 1, 3)] : "var(--border-color)";
  });
  text.textContent =
    pw.length > 0 ? labels[Math.min(strength - 1, 3)] || "Too short" : "";
  text.style.color =
    pw.length > 0
      ? colors[Math.min(strength - 1, 3)] || "#ef4444"
      : "var(--text-muted)";
});

// Form submit
document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;
  const confirm = document.getElementById("reg-confirm").value;

  if (password !== confirm) {
    showToast("Passwords do not match", "error");
    return;
  }

  if (password.length < 8) {
    showToast("Password must be at least 8 characters", "error");
    return;
  }

  // Get existing users
  const users = JSON.parse(localStorage.getItem("moviehub_users") || "[]");

  // Check if email or username exists
  if (users.find((u) => u.email === email)) {
    showToast("Email already registered", "error");
    return;
  }
  if (users.find((u) => u.username === username)) {
    showToast("Username already taken", "error");
    return;
  }

  // Create new user
  const newUser = {
    name,
    email,
    username,
    password, // In a real app, this should be hashed
    joinDate: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e50914&color=fff&size=128`,
  };

  users.push(newUser);
  localStorage.setItem("moviehub_users", JSON.stringify(users));

  // Auto-login
  localStorage.setItem("moviehub_currentUser", JSON.stringify(newUser));

  showToast("Account created successfully!", "success");
  setTimeout(() => (window.location.href = "../index.html"), 1500);
});
