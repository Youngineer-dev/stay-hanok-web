document.addEventListener("DOMContentLoaded", () => {
  // 1. Fade In on Load
  // Add a slight delay to ensure CSS has loaded
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 50);

  // 2. Intercept Link Clicks for Fade Out
  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      const target = link.getAttribute("target");

      // Do not animate if:
      // - Link is empty, hash (#), or javascript:void(0)
      // - Link opens in a new tab (_blank)
      // - Link is external (starts with http) unless same domain (rare in static)
      // - User is holding Ctrl/Cmd (new tab intent)
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:") ||
        target === "_blank" ||
        e.ctrlKey ||
        e.metaKey
      ) {
        return;
      }

      // Prevent immediate navigation
      e.preventDefault();

      // Add fade-out class
      document.body.style.opacity = "0";

      // Navigate after transition completes (match CSS duration: 0.5s)
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    });
  });
});
