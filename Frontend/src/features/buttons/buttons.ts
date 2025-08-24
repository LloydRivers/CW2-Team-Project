import { loadDashboard } from "../../loaders/dashboard-data";
import { loadHighlights } from "../../loaders/highlights";
import { loadSeasons } from "../../loaders/seasons";
import { loadSessions } from "../../loaders/sessions";

// Setup button event listeners
export function setupButtonListeners(): void {
  const loadDashboardBtn = document.getElementById("load-dashboard");
  if (loadDashboardBtn) {
    loadDashboardBtn.addEventListener("click", loadDashboard);
  }

  const loadSeasonsBtn = document.getElementById("load-seasons");
  if (loadSeasonsBtn) {
    loadSeasonsBtn.addEventListener("click", loadSeasons);
  }

  const loadHighlightsBtn = document.getElementById("load-highlights");
  if (loadHighlightsBtn) {
    loadHighlightsBtn.addEventListener("click", loadHighlights);
  }

  const loadSessionsBtn = document.getElementById("load-sessions");
  if (loadSessionsBtn) {
    loadSessionsBtn.addEventListener("click", loadSessions);
  }
}
