import type { SessionData } from "../../types/sessions";

// Render sessions
export function renderSessions(sessionData: SessionData): void {
  const container = document.getElementById("sessions-content");
  if (!container) return;

  if (!sessionData) {
    container.innerHTML =
      '<div class="card"><h3>No session data available</h3></div>';
    return;
  }

  let html = `
        <div class="card">
            <h3>⏱️ Latest Session</h3>
            <p><strong>Type:</strong> ${
              sessionData.sessionType || "Unknown"
            }</p>
            <p><strong>Round:</strong> ${sessionData.round || "N/A"}</p>
            <p><strong>Circuit:</strong> ${
              sessionData.circuit.circuitName || "N/A"
            }</p>
            <p><strong>Country:</strong> ${
              sessionData.circuit.country || "N/A"
            }</p>
            <p><strong>Date:</strong> ${sessionData.date || "N/A"}</p>
            <p><strong>Time:</strong> ${sessionData.time || "N/A"}</p>
            <p><a href="${sessionData.url}" target="_blank">More Info</a></p>
        </div>
    `;

  // Add session results if available
  if (sessionData.results && sessionData.results.length > 0) {
    html += '<div class="card"><h3>📊 Session Results (Top 10)</h3>';
    sessionData.results.slice(0, 10).forEach((result, index) => {
      html += `
        <div class="driver-card">
            <div class="driver-number">${index + 1}</div>
            <div>
                <p><strong>${result.driver.name} ${
        result.driver.surname
      }</strong> (${result.driver.nationality})</p>
                <p>Team: ${result.team.teamName}</p>
                <p>Position: ${result.position ?? "N/A"}</p>
                <p>Time: ${result.time || "N/A"}</p>
                <p>Points: ${result.points}</p>
            </div>
        </div>
      `;
    });
    html += "</div>";
  }

  container.innerHTML = html;
}
