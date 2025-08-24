import { apiCall } from "./api/api";
import { appData } from "./data/appData";
import { loadDashboard } from "./loaders/dashboard-data";
import { loadDrivers } from "./loaders/drivers";
import { loadHighlights } from "./loaders/highlights";
import { loadSeasons } from "./loaders/seasons";
import { loadSessions } from "./loaders/sessions";
import { loadTeams } from "./loaders/teams";
import type { AppData } from "./types";

import { startApp } from "./app";

// Initialize the app
document.addEventListener("DOMContentLoaded", startApp);

// Export functions for global access
declare global {
  interface Window {
    F1Hub: {
      loadDashboard: () => Promise<void>;
      loadDrivers: () => Promise<void>;
      loadTeams: () => Promise<void>;
      loadSeasons: () => Promise<void>;
      loadHighlights: () => Promise<void>;
      loadSessions: () => Promise<void>;
      apiCall: <T = any>(endpoint: string) => Promise<T>;
      appData: AppData;
    };
  }
}

window.F1Hub = {
  loadDashboard,
  loadDrivers,
  loadTeams,
  loadSeasons,
  loadHighlights,
  loadSessions,
  apiCall,
  appData,
};
