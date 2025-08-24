import { apiCall } from "../api/api";
import { appData } from "../data/appData";
import type { Team } from "../types/types";
import { renderTeams } from "../ui/renderers/teams";
import { showError, showLoading } from "../ui/utils";

// Load teams data
export async function loadTeams(): Promise<void> {
  showLoading("teams-content");

  try {
    const [allTeams, currentTeams, featuredTeams] = await Promise.allSettled([
      apiCall<Team[]>("/teams"),
      apiCall<Team[]>("/teams/current"),
      apiCall<Team[]>("/teams/featured"),
    ]);

    let teams: Team[] = [];
    if (allTeams.status === "fulfilled") teams = allTeams.value;
    else if (currentTeams.status === "fulfilled") teams = currentTeams.value;
    else if (featuredTeams.status === "fulfilled") teams = featuredTeams.value;

    appData.teams = teams;
    renderTeams(teams);
  } catch (error) {
    showError("teams-content", "Failed to load teams data");
    console.error("Teams load error:", error);
  }
}
