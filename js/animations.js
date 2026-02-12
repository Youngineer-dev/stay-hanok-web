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

  // Elements to animate
  const animatedElements = document.querySelectorAll(
    ".fade-up, .fade-in, .feature-card, .room-card-large",
  );
  animatedElements.forEach((el, index) => {
    // Add default class if missing
    if (
      !el.classList.contains("fade-up") &&
      !el.classList.contains("fade-in")
    ) {
      el.classList.add("fade-up");
    }

    // Add stagger delays for grids
    if (el.classList.contains("feature-card")) {
      el.style.transitionDelay = `${index * 0.1}s`;
    }

    observer.observe(el);
  });

  /* ----------------------------------------------------
       Header Scroll Effect
    ---------------------------------------------------- */
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  /* ----------------------------------------------------
       Mobile Menu Toggle (Basic)
    ---------------------------------------------------- */
  const menuBtn = document.querySelector(".mobile-menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      alert(
        "모바일 메뉴는 추후 구현 예정입니다.\n(HTML 구조에 슬라이드 메뉴 추가 필요)",
      );
    });
  }
});
