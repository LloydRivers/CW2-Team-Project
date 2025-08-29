import { loadSectionData } from "../../loaders/section";

// Navigation handling
export function setupNavigation(): void {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active class from all links
      navLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      link.classList.add("active");

      // Hide all sections
      const sections = document.querySelectorAll(".section");
      sections.forEach((section) => {
        section.classList.remove("active");
      });

      // Show target section
      const targetSection = link.getAttribute("data-section");
      if (targetSection) {
        const section = document.getElementById(targetSection);
        if (section) {
          section.classList.add("active");
        }

        // Load section data if needed
        loadSectionData(targetSection);
      }
    });
  });
}
