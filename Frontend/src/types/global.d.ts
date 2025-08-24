import type { AppData } from "../types";

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
