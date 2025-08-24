import type { SeasonData } from "../../types/seasons";

// Render seasons
export function renderSeasons(seasonData: SeasonData): void {
  const container = document.getElementById("seasons-content");
  if (!container) return;

  if (!seasonData) {
    container.innerHTML =
      '<div class="card"><h3>No season data available</h3></div>';
    return;
  }

  console.log("Rendering season:", seasonData);

  let html = `
    <div class="card">
        <h3>🏁 ${seasonData.championship.championshipName} (${seasonData.championship.year})</h3>
        <p><a href="${seasonData.championship.url}" target="_blank">Championship Info</a></p>
    </div>
  `;

  if (seasonData.races && Array.isArray(seasonData.races)) {
    seasonData.races.forEach((race) => {
      html += `
        <div class="card">
            <h3>🏆 ${race.raceName}</h3>
            <p><strong>Circuit:</strong> ${race.circuit.circuitName}</p>
            <p><strong>Country:</strong> ${race.circuit.country}</p>
            <p><strong>Date:</strong> ${race.schedule.race.date} ${
        race.schedule.race.time
      }</p>
            ${
              race.winner
                ? `<p><strong>Winner:</strong> ${race.winner.name} ${race.winner.surname}</p>`
                : ""
            }
        </div>
      `;
    });
  }

  container.innerHTML = html;
}
