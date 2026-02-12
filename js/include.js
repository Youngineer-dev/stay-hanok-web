document.addEventListener("DOMContentLoaded", function () {
  // 1. Function to Load External HTML Files
  const loadComponent = (selector, file) => {
    fetch(file)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        return response.text();
      })
      .then((data) => {
        document.querySelector(selector).innerHTML = data;

        // Initialize Header Logic
        if (file.includes("header")) {
          initMenu(); // Mobile Menu Toggle
          highlightActiveLink(); // Highlight Current Page
        }

        // Initialize Footer Logic
        if (file.includes("footer")) {
          const yearEl = document.querySelector(".current-year");
          if (yearEl) yearEl.textContent = new Date().getFullYear();
        }
      })
      .catch((error) => console.error("Error loading component:", error));
  };

  // Load components
  loadComponent("#header-placeholder", "components/header.html");
  loadComponent("#footer-placeholder", "components/footer.html");

  // 2. Highlight Current Navigation Link
  function highlightActiveLink() {
    // Get current filename (e.g., 'about.html')
    let currentPath = window.location.pathname.split("/").pop();

    // Handle root path or empty path as index.html
    if (currentPath === "" || currentPath === "stay-hanok-web") {
      currentPath = "index.html";
    }

    // Select all nav links (Desktop + Mobile)
    const links = document.querySelectorAll(".nav-menu a, .menu-items a");

    links.forEach((link) => {
      const linkHref = link.getAttribute("href");

      // Exact match check
      if (linkHref === currentPath) {
        link.classList.add("active");
      }
    });
  }

  // 3. Mobile Menu Toggle Logic
  function initMenu() {
    const menuBtn = document.querySelector(".menu-toggle");
    const overlay = document.querySelector(".menu-overlay");
    const body = document.body;
    const menuLinks = document.querySelectorAll(".menu-items a");

    if (!menuBtn || !overlay) return;

    // Toggle Menu
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("open");
      overlay.classList.toggle("active");

      // Prevent scrolling on body when mobile menu is open
      if (overlay.classList.contains("active")) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "";
      }
    });

    // Close Menu when clicking a link
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuBtn.classList.remove("open");
        overlay.classList.remove("active");
        body.style.overflow = "";
      });
    });
  }
});
