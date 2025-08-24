import { apiCall } from "../api/api";
import { appData } from "../data/appData";
import type { Highlight } from "../types/index";
import { renderHighlights } from "../ui/renderers/highlights";
import { showError, showLoading } from "../ui/utils";

// Load highlights data
export async function loadHighlights(): Promise<void> {
  showLoading("highlights-content");

  try {
    const highlightsData = await apiCall<Highlight[]>("/highlights");
    console.log("Highlights data:", highlightsData);
    appData.highlights = highlightsData;
    renderHighlights(highlightsData);
  } catch (error) {
    showError("highlights-content", "Failed to load highlights data");
    console.error("Highlights load error:", error);
  }
}
