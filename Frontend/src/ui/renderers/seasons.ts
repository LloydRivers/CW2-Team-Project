import type { Season } from "../../types";

// Render seasons
export function renderSeasons(seasonData: Season): void {
  const container = document.getElementById("seasons-content");
  if (!container) return;

  if (!seasonData) {
    container.innerHTML =
      '<div class="card"><h3>No season data available</h3></div>';
    return;
  }

  let html = `
        <div class="card">
            <h3>🏁 2025 Formula 1 Season</h3>
            <p><strong>Status:</strong> ${seasonData.status || "Active"}</p>
            <p><strong>Races:</strong> ${
              seasonData.race_count || seasonData.races || "TBD"
            }</p>
            <p><strong>Current Round:</strong> ${
              seasonData.current_round || "TBD"
            }</p>
            <p><strong>Champion:</strong> ${seasonData.champion || "TBD"}</p>
        </div>
    `;

  // Add races if available
  if (seasonData.races && Array.isArray(seasonData.races)) {
    seasonData.races.forEach((race) => {
      html += `
                <div class="card">
                    <h3>🏆 ${race.name || "Grand Prix"}</h3>
                    <p><strong>Circuit:</strong> ${race.circuit || "N/A"}</p>
                    <p><strong>Date:</strong> ${race.date || "TBD"}</p>
                    <p><strong>Country:</strong> ${race.country || "N/A"}</p>
                    ${
                      race.winner
                        ? `<p><strong>Winner:</strong> ${race.winner}</p>`
                        : ""
                    }
                </div>
            `;
    });
  }

  container.innerHTML = html;
}
