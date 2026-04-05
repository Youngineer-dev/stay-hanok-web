/* ----------------------------------------------------
     Scroll Animations (Intersection Observer)
  ---------------------------------------------------- */
const _observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.15,
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
const _delayMs = Number.parseFloat(_delayToken) || 80;

const _applyStagger = (selector) => {
  const items = document.querySelectorAll(selector);
  items.forEach((item, index) => {
    _ensureRevealClass(item);
    item.style.transitionDelay = `${(index % 3) * _delayMs}ms`;
    _fadeObserver.observe(item);
  });
};

// 동적으로 추가된 요소도 감지할 수 있도록 전역 노출
window.observeFadeUps = function () {
  document.querySelectorAll(".fade-up, .fade-in").forEach((el) => {
    _fadeObserver.observe(el);
  });
  _applyStagger(".special-grid .special-item");
  _applyStagger(".features-grid .feature-card");
  _applyStagger(".open-plan-track .open-plan-step");
};

document.addEventListener("DOMContentLoaded", function () {
  window.observeFadeUps();
});
