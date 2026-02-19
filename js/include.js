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
          initHeaderScroll(); // Header scroll state
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

  // 3. Header Scroll State
  function initHeaderScroll() {
    const header = document.querySelector("header");
    if (!header) return;

    const syncHeaderScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };

    syncHeaderScroll();
    window.addEventListener("scroll", syncHeaderScroll, { passive: true });
  }

  // 4. Mobile Menu Toggle Logic
  function initMenu() {
    const menuBtn = document.querySelector(".menu-toggle");
    const overlay = document.querySelector(".menu-overlay");
    const header = document.querySelector("header");
    const body = document.body;
    const menuLinks = document.querySelectorAll(".menu-items a");

    if (!menuBtn || !overlay) return;

    const setMenuState = (isOpen) => {
      menuBtn.classList.toggle("open", isOpen);
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      overlay.classList.toggle("active", isOpen);
      overlay.setAttribute("aria-hidden", String(!isOpen));
      body.classList.toggle("menu-open", isOpen);
      body.style.overflow = isOpen ? "hidden" : "";
      if (header) header.classList.toggle("active", isOpen);
    };

    // Init ARIA state
    menuBtn.setAttribute("aria-expanded", "false");
    overlay.setAttribute("aria-hidden", "true");

    // Toggle menu
    menuBtn.addEventListener("click", () => {
      setMenuState(!overlay.classList.contains("active"));
    });

    // Close menu when clicking a link
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setMenuState(false);
      });
    });

    // Close when tapping outside menu panel
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        setMenuState(false);
      }
    });

    // Close on Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("active")) {
        setMenuState(false);
      }
    });

    // Ensure desktop state is clean after resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900 && overlay.classList.contains("active")) {
        setMenuState(false);
      }
    });
  }
});
