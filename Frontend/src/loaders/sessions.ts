import { apiCall } from "../api/api";
import { appData } from "../data/appData";
import type { SessionData } from "../types";
import { renderSessions } from "../ui/renderers/sessions";
import { showError, showLoading } from "../ui/utils";

// Load sessions data
export async function loadSessions(): Promise<void> {
  showLoading("sessions-content");

  try {
    const sessionsData = await apiCall<SessionData>("/sessions/latest");
    appData.sessions = sessionsData;
    renderSessions(sessionsData);
  } catch (error) {
    showError("sessions-content", "Failed to load latest session data");
    console.error("Sessions load error:", error);
  }
}
