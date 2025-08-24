import { appData } from "../../data/appData";

// Render dashboard statistics
export function renderDashboardStats(): void {
  const statsContainer = document.getElementById("dashboard-stats");
  if (!statsContainer) return;

  const driversCount = appData.drivers.length || 0;
  const teamsCount = appData.teams.length || 0;
  const highlightsCount = appData.highlights.length || 0;

  statsContainer.innerHTML = `
        <div class="stat-card">
            <span class="stat-number">${driversCount}</span>
            <span class="stat-label">Active Drivers</span>
        </div>
        <div class="stat-card">
            <span class="stat-number">${teamsCount}</span>
            <span class="stat-label">Racing Teams</span>
        </div>
        <div class="stat-card">
            <span class="stat-number">${highlightsCount}</span>
            <span class="stat-label">Latest Highlights</span>
        </div>
        <div class="stat-card">
            <span class="stat-number">2025</span>
            <span class="stat-label">Current Season</span>
        </div>
    `;
}
