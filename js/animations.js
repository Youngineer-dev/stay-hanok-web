/* ----------------------------------------------------
     Scroll Animations (Intersection Observer)
  ---------------------------------------------------- */
const _observerOptions = {
  root: null,
  rootMargin: "0px 0px -24px 0px",
  threshold: 0.05,
};

const _fadeObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    }
  });
}, _observerOptions);

const _ensureRevealClass = (el) => {
  if (!el.classList.contains("fade-up") && !el.classList.contains("fade-in")) {
    el.classList.add("fade-up");
  }
};

const _delayToken = getComputedStyle(document.documentElement)
  .getPropertyValue("--motion-enter-delay-step")
  .trim();
const _delayMs = Number.parseFloat(_delayToken) || 70;

const _applyStagger = (selector) => {
  const items = document.querySelectorAll(selector);
  items.forEach((item, index) => {
    _ensureRevealClass(item);
    item.style.transitionDelay = `${(index % 3) * _delayMs}ms`;
    _fadeObserver.observe(item);
  });
};

window.observeFadeUps = function () {
  document.querySelectorAll(".fade-up, .fade-in").forEach((el) => {
    _fadeObserver.observe(el);
  });
  _applyStagger(".journal-card");
  _applyStagger(".pillar-item");
  _applyStagger(".open-plan-step");
  _applyStagger(".attraction-editorial-card");
};

document.addEventListener("DOMContentLoaded", function () {
  window.observeFadeUps();
});
