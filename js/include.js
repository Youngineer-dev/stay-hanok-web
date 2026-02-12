document.addEventListener("DOMContentLoaded", function () {
  // Function to load external HTML files
  const loadComponent = (selector, file) => {
    fetch(file)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        return response.text();
      })
      .then((data) => {
        document.querySelector(selector).innerHTML = data;

        // Highlight active link after header loads
        if (file.includes("header")) {
          highlightActiveLink();
        }
      })
      .catch((error) => console.error("Error loading component:", error));
  };

  // Load Header and Footer
  loadComponent("#header-placeholder", "components/header.html");
  loadComponent("#footer-placeholder", "components/footer.html");

  // Helper: Active Link Highlighter
  function highlightActiveLink() {
    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";
    const links = document.querySelectorAll(".nav-links a");

    links.forEach((link) => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
      }
    });
  }
});
