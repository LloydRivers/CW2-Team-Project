import type { SessionData } from "../../types/types";

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
              sessionData.type || sessionData.session_type || "Unknown"
            }</p>
            <p><strong>Circuit:</strong> ${
              sessionData.circuit || sessionData.track || "N/A"
            }</p>
            <p><strong>Date:</strong> ${
              sessionData.date || sessionData.session_date || "N/A"
            }</p>
            <p><strong>Weather:</strong> ${sessionData.weather || "N/A"}</p>
            <p><strong>Track Temperature:</strong> ${
              sessionData.track_temp || "N/A"
            }</p>
        </div>
    `;

  // Add session results if available
  if (sessionData.results && Array.isArray(sessionData.results)) {
    html += '<div class="card"><h3>📊 Session Results</h3>';
    sessionData.results.slice(0, 10).forEach((result, index) => {
      html += `
                <div class="driver-card">
                    <div class="driver-number">${index + 1}</div>
                    <div>
                        <p><strong>${result.driver || "Driver"}</strong></p>
                        <p>Time: ${result.time || result.lap_time || "N/A"}</p>
                        <p>Gap: ${result.gap || "N/A"}</p>
                    </div>
                </div>
            `;
    });
    html += "</div>";
  }

  // Add fastest laps if available
  if (sessionData.fastest_lap) {
    html += `
            <div class="card">
                <h3>🚀 Fastest Lap</h3>
                <p><strong>Driver:</strong> ${
                  sessionData.fastest_lap.driver || "N/A"
                }</p>
                <p><strong>Time:</strong> ${
                  sessionData.fastest_lap.time || "N/A"
                }</p>
                <p><strong>Speed:</strong> ${
                  sessionData.fastest_lap.speed || "N/A"
                }</p>
            </div>
        `;
  }

  container.innerHTML = html;
}
