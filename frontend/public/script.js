document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-theme");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const body = document.body;

  // Load theme preference
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️";
    // Set aria-pressed for accessibility (Suggestion #4)
    toggleBtn.setAttribute("aria-pressed", "true");
  } else {
    toggleBtn.setAttribute("aria-pressed", "false");
  }

  // Theme toggle
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      const isDark = body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      toggleBtn.textContent = isDark ? "☀️" : "🌙";

      // Update aria-pressed attribute for screen readers (Suggestion #4)
      toggleBtn.setAttribute("aria-pressed", isDark.toString());
    });
  }

  // Menu toggle
  if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-expanded", "false"); // Initialize (Suggestion #1)

    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");

      // Toggle aria-expanded for accessibility (Suggestion #1)
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", (!expanded).toString());
    });

    // Close mobile menu when clicking any nav link (Suggestion #2)
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
});
