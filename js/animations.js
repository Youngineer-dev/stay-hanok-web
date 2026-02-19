document.addEventListener("DOMContentLoaded", function () {
  /* ----------------------------------------------------
       Scroll Animations (Intersection Observer)
    ---------------------------------------------------- */
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Once visible, don't observe again
      }
    });
  }, observerOptions);

  const ensureRevealClass = (el) => {
    if (!el.classList.contains("fade-up") && !el.classList.contains("fade-in")) {
      el.classList.add("fade-up");
    }
  };

  // Base reveal targets
  document.querySelectorAll(".fade-up, .fade-in").forEach((el) => {
    observer.observe(el);
  });

  // Stagger only for intentional list/grid groups
  const delayToken = getComputedStyle(document.documentElement)
    .getPropertyValue("--motion-enter-delay-step")
    .trim();
  const delayMs = Number.parseFloat(delayToken) || 80;

  const applyStagger = (selector) => {
    const items = document.querySelectorAll(selector);
    items.forEach((item, index) => {
      ensureRevealClass(item);
      item.style.transitionDelay = `${(index % 3) * delayMs}ms`;
      observer.observe(item);
    });
  };

  applyStagger(".features-grid .feature-card");
  applyStagger(".special-grid .special-item");
  applyStagger(".open-plan-track .open-plan-step");
});
