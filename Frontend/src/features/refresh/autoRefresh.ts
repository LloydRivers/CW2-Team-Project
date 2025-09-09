import { loadDashboard } from "../../loaders/dashboard-data";
import { loadSectionData } from "../../loaders/section";

// Auto-refresh functionality
export function startAutoRefresh(): void {
  setInterval(async () => {
    const activeSection = document.querySelector(".section.active")?.id;
    if (activeSection === "home") {
      await loadDashboard();
    } else if (activeSection) {
      await loadSectionData(activeSection);
    }
  }, 300000); // Refresh every 5 minutes
}
