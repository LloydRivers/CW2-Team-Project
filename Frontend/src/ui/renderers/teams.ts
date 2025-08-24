import type { Team } from "../../types";

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
    html += `
            <div class="card">
                <h3>${team.name || team.team_name || "Unknown Team"}</h3>
                <p><strong>Base:</strong> ${
                  team.base || team.headquarters || "N/A"
                }</p>
                <p><strong>Points:</strong> ${team.points || "0"}</p>
                <p><strong>Principal:</strong> ${
                  team.team_principal || team.principal || "N/A"
                }</p>
                ${
                  team.drivers
                    ? `<p><strong>Drivers:</strong> ${team.drivers}</p>`
                    : ""
                }
                ${
                  team.position
                    ? `<p><strong>Championship Position:</strong> ${team.position}</p>`
                    : ""
                }
            </div>
        `;
  });

  container.innerHTML = html;
}
