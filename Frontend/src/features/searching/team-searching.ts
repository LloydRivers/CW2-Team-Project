import { appData } from "../../data/appData";
import { renderTeams } from "../../ui/renders/teams";

// Search functionality for teams
export function setupTeamSearch(): void {
  const searchInput = document.getElementById(
    "team-search"
  ) as HTMLInputElement;
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const searchTerm = target.value.toLowerCase();
      const filteredTeams = appData.teams.filter(
        (team) =>
          (team.teamName || "").toLowerCase().includes(searchTerm) ||
          (team.teamNationality || "").toLowerCase().includes(searchTerm)
      );
      renderTeams(filteredTeams);
    });
  }
}
