import { loadSectionData } from "../../loaders/section";

// Error handling for network issues
export function setupNetworkHandlers(): void {
  window.addEventListener("online", () => {
    document.body.style.filter = "none";
    const activeSection = document.querySelector(".section.active")?.id;
    if (activeSection) {
      loadSectionData(activeSection);
    }
  });

  window.addEventListener("offline", () => {
    document.body.style.filter = "grayscale(1)";
    const allContainers = document.querySelectorAll(
      ".grid, #dashboard-stats, #featured-content, #highlights-content"
    );
    allContainers.forEach((container) => {
      container.innerHTML =
        '<div class="error">🌐 You are currently offline. Please check your connection.</div>';
    });
  });
}
