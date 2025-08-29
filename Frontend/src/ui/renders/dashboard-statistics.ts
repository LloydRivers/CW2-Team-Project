import { getDashboardStats } from "./helpers";

export function renderDashboardStats(): void {
  const statsContainer = document.getElementById("dashboard-stats");
  if (!statsContainer) return;

  const stats = getDashboardStats();

  statsContainer.innerHTML = `
    <div class="stat-card">
        <span class="stat-number">${stats.driversCount}</span>
        <span class="stat-label">Active Drivers</span>
    </div>
    <div class="stat-card">
        <span class="stat-number">${stats.teamsCount}</span>
        <span class="stat-label">Racing Teams</span>
    </div>
    <div class="stat-card">
        <span class="stat-number">${stats.highlightsCount}</span>
        <span class="stat-label">Latest Highlights</span>
    </div>
    <div class="stat-card">
        <span class="stat-number">${stats.featuredDriversCount}</span>
        <span class="stat-label">Featured Drivers</span>
    </div>
    <div class="stat-card">
        <span class="stat-number">${stats.featuredTeamsCount}</span>
        <span class="stat-label">Featured Teams</span>
    </div>
    <div class="stat-card">
        <span class="stat-number">${stats.currentSeason}</span>
        <span class="stat-label">Current Season</span>
    </div>
  `;
}
