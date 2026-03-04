/* ============================================================
   MovieHub 2026 — Register Page Logic
   ============================================================ */

// Toggle password
document.getElementById("toggle-reg-password").addEventListener("click", () => {
  const input = document.getElementById("reg-password");
  const icon = document
    .getElementById("toggle-reg-password")
    .querySelector("i");
  if (input.type === "password") {
    input.type = "text";
    icon.className = "bx bx-show";
  } else {
    input.type = "password";
    icon.className = "bx bx-hide";
  }
});

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
  showToast("Account created successfully!", "success");
  setTimeout(() => (window.location.href = "../index.html"), 1500);
});
