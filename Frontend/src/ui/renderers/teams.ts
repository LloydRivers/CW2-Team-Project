import type { Team } from "../../types/types";

// Render teams
export function renderTeams(teams: Team[]): void {
  const container = document.getElementById("teams-content");
  if (!container) return;

  if (!teams || teams.length === 0) {
    container.innerHTML =
      '<div class="card"><h3>No teams data available</h3></div>';
    return;
  }

  let html = "";
  teams.forEach((team) => {
    console.log("Rendering team:", team);

    html += `
      <div class="card">
          <h3>${team.teamName}</h3>
          <p><strong>Nationality:</strong> ${team.teamNationality}</p>
          ${
            team.firstAppeareance
              ? `<p><strong>First Appearance:</strong> ${team.firstAppeareance}</p>`
              : ""
          }
          ${
            team.constructorsChampionships !== null
              ? `<p><strong>Constructors Championships:</strong> ${team.constructorsChampionships}</p>`
              : ""
          }
          ${
            team.driversChampionships !== null
              ? `<p><strong>Drivers Championships:</strong> ${team.driversChampionships}</p>`
              : ""
          }
          <p><a href="${team.url}" target="_blank">More Info</a></p>
      </div>
    `;
  });

  container.innerHTML = html;
}
