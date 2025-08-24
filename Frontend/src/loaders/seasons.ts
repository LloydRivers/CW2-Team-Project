import { apiCall } from "../api/api";
import { appData } from "../data/appData";
import type { Season } from "../types";
import { renderSeasons } from "../ui/renderers/seasons";
import { showError, showLoading } from "../ui/utils";

// Load seasons data
export async function loadSeasons(): Promise<void> {
  showLoading("seasons-content");

  try {
    const seasonData = await apiCall<Season>("/seasons/2025");
    appData.seasons = seasonData;
    renderSeasons(seasonData);
  } catch (error) {
    showError("seasons-content", "Failed to load 2025 season data");
    console.error("Seasons load error:", error);
  }
}
