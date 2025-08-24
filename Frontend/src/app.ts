import { setupButtonListeners } from "./features/buttons/buttons";
import { setupKeyboardShortcuts } from "./features/keyboard/keyboard";
import { setupNavigation } from "./features/navigation/navigation";
import { setupNetworkHandlers } from "./features/network/network";
import { startAutoRefresh } from "./features/refresh/autoRefresh";
import { setupDriverSearch } from "./features/searching/driver-searching";
import { setupTeamSearch } from "./features/searching/team-searching";
import { addVisualEffects } from "./features/visualEffects/visualEffects";
import { loadDashboard } from "./loaders/dashboard-data";

export function startApp() {
  console.log("🏎️ F1 Hub initialized!");
  console.log("💡 Tip: Use Alt+1-6 for quick navigation, Alt+R to refresh");

  // Setup all event listeners
  setupNavigation();
  setupButtonListeners();
  setupDriverSearch();
  setupTeamSearch();
  setupNetworkHandlers();
  setupKeyboardShortcuts();

  // Load initial dashboard data
  loadDashboard();

  // Start auto-refresh
  startAutoRefresh();

  // Add visual effects after a delay
  setTimeout(addVisualEffects, 1000);

  // Add some visual flair
  setTimeout(() => {
    document.body.style.background =
      "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 30%, #2d2d2d 70%, #1a1a1a 100%)";
  }, 1000);
}
