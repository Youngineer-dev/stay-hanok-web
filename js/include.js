document.addEventListener("DOMContentLoaded", function () {
  const getCurrentPath = () => {
    let currentPath = window.location.pathname.split("/").pop();

    // Handle root path or empty path as index.html
    if (currentPath === "" || currentPath === "stay-hanok-web") {
      currentPath = "index.html";
    }

    return currentPath;
  };

  const currentPath = getCurrentPath();
  if (currentPath === "reserve.html") {
    document.body.classList.add("is-reserve-page");
  }

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
          initMobileSubmenu(); // Mobile accordion for submenus
          highlightActiveLink(); // Highlight Current Page
        }

        // Initialize Footer Logic
        if (file.includes("footer")) {
          const yearEl = document.querySelector(".current-year");
          if (yearEl) yearEl.textContent = new Date().getFullYear();
        }

        // Apply dynamic data to loaded components
        if (window.dataLoadPromise && window.applyDataToDOM) {
          window.dataLoadPromise.then(() => {
            window.applyDataToDOM(document.querySelector(selector));
            if (file.includes("header")) {
              populateDynamicSubmenus();
            }
          });
        }
      })
      .catch((error) => console.error("Error loading component:", error));
  };

  // Load components
  loadComponent("#header-placeholder", "components/header.html");
  loadComponent("#footer-placeholder", "components/footer.html");

  // 2. Highlight Current Navigation Link
  function highlightActiveLink() {
    // Select all nav links (Desktop + Mobile)
    const links = document.querySelectorAll(".nav-menu a, .menu-items a");

    links.forEach((link) => {
      const linkHref = link.getAttribute("href") || "";
      // href에 #이나 ? 가 있으면 경로 부분만 비교 (submenu anchors 대응)
      const linkPath = linkHref.split("#")[0].split("?")[0];
      if (linkPath === currentPath) {
        link.classList.add("active");
      }
    });
  }

  // 5. Populate dynamic submenus (attractions, special) from data.json
  function populateDynamicSubmenus() {
    if (!window.siteData) return;

    // Attractions — items[].title 그대로 사용
    const attractions = window.siteData.attractions?.items || [];
    const attrDesktop = document.getElementById("nav-attractions-sub");
    const attrMobile = document.getElementById("mobile-attractions-sub");
    if (attractions.length > 0) {
      const html = attractions
        .map((item, i) => {
          const title = (item.title || "").replace(/\s*\(.*?\)\s*$/, "").trim();
          return `<a href="attractions.html#attr-${i}" role="menuitem">${title}</a>`;
        })
        .join("");
      if (attrDesktop) attrDesktop.innerHTML = html;
      if (attrMobile) attrMobile.innerHTML = html;
    }

    // Special — 중복 제거 후 삽입 (data.json 순서 유지)
    const specials = window.siteData.special?.items || [];
    const seen = new Set();
    const unique = specials.filter((item) => {
      const key = (item.title || "").replace(/\s+/g, "").toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const spDesktop = document.getElementById("nav-special-sub");
    const spMobile = document.getElementById("mobile-special-sub");
    if (unique.length > 0) {
      const html = unique
        .map((item) => {
          const slug = (item.title || "").replace(/\s+/g, "").toLowerCase();
          return `<a href="special.html#sp-${slug}" role="menuitem">${item.title}</a>`;
        })
        .join("");
      if (spDesktop) spDesktop.innerHTML = html;
      if (spMobile) spMobile.innerHTML = html;
    }

    // 모바일에서 동적 서브메뉴 링크 클릭 시에도 메뉴를 닫도록 재바인딩
    rebindMobileLinks();
  }

  // 6. Mobile submenu accordion
  function initMobileSubmenu() {
    const toggles = document.querySelectorAll(".menu-group-toggle");
    toggles.forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const group = toggle.closest(".menu-group");
        if (!group) return;
        const isOpen = group.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    });
  }

  // Rebind link handlers after dynamic submenu insertion
  function rebindMobileLinks() {
    const overlay = document.querySelector(".menu-overlay");
    if (!overlay) return;
    const links = overlay.querySelectorAll("a");
    links.forEach((link) => {
      if (link.dataset.menuBound === "1") return;
      link.dataset.menuBound = "1";
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });
  }

  function closeMobileMenu() {
    const menuBtn = document.querySelector(".menu-toggle");
    const overlay = document.querySelector(".menu-overlay");
    const header = document.querySelector("header");
    const body = document.body;
    if (!menuBtn || !overlay) return;
    menuBtn.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    body.classList.remove("menu-open");
    body.style.overflow = "";
    if (header) header.classList.remove("active");
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

    // Close menu on link click (static + dynamic — flag로 중복 방지)
    rebindMobileLinks();

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
