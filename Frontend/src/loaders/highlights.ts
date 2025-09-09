import { apiCall } from "../api/api";
import { appData } from "../data/appData";
import { renderHighlights } from "../ui/renders/highlights";
import { showError, showLoading } from "../ui/utils";
import type { Highlights } from "../types/types";

// Load highlights data
export async function loadHighlights(): Promise<void> {
  showLoading("highlights-content");

  try {
    const highlightsData = await apiCall<Highlight[]>("/highlights");
    console.log("Fetched highlights data:", highlightsData);
    renderHighlights(highlightsData);
  } catch (error) {
    showError("highlights-content", "Failed to load highlights data");
    console.error("Highlights load error:", error);
  }
}
