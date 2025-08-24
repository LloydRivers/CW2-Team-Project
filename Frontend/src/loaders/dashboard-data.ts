import { apiCall } from "../api/api";
import { appData } from "../data/appData";
import type { Driver, Team, Highlight } from "../types";
import { renderDashboardStats } from "../ui/renderers/dashboard-statistics";
import { showError, showLoading } from "../ui/utils";

// Load dashboard data
export async function loadDashboard(): Promise<void> {
  showLoading("dashboard-stats");
  showLoading("featured-content");

  try {
    // Load all dashboard data in parallel
    const [drivers, teams, featuredDrivers, featuredTeams, highlights] =
      await Promise.allSettled([
        apiCall<Driver[]>("/drivers"),
        apiCall<Team[]>("/teams"),
        apiCall<Driver[]>("/drivers/featured"),
        apiCall<Team[]>("/teams/featured"),
        apiCall<Highlight[]>("/highlights"),
      ]);

    // Store data
    if (drivers.status === "fulfilled") appData.drivers = drivers.value;
    if (teams.status === "fulfilled") appData.teams = teams.value;
    if (featuredDrivers.status === "fulfilled")
      appData.featuredDrivers = featuredDrivers.value;
    if (featuredTeams.status === "fulfilled")
      appData.featuredTeams = featuredTeams.value;
    if (highlights.status === "fulfilled")
      appData.highlights = highlights.value;

    renderDashboardStats();
    renderFeaturedContent();
  } catch (error) {
    showError("dashboard-stats", "Failed to load dashboard data");
    console.error("Dashboard load error:", error);
  }
}

function renderFeaturedContent(): void {
  const container = document.getElementById("featured-content");
  if (!container) return;

  let html = "";

  // Featured Drivers
  if (appData.featuredDrivers && appData.featuredDrivers.length > 0) {
    appData.featuredDrivers.slice(0, 3).forEach((driver) => {
      html += `
                <div class="card">
                    <h3>🏆 Featured Driver</h3>
                    <p><strong>Name:</strong> ${driver.name || "N/A"}</p>
                    <p><strong>Team:</strong> ${driver.team || "N/A"}</p>
                    <p><strong>Number:</strong> ${driver.number || "N/A"}</p>
                    <p><strong>Points:</strong> ${driver.points || "N/A"}</p>
                </div>
            `;
    });
  }

  // Featured Teams
  if (appData.featuredTeams && appData.featuredTeams.length > 0) {
    appData.featuredTeams.slice(0, 3).forEach((team) => {
      html += `
                <div class="card">
                    <h3>🏁 Featured Team</h3>
                    <p><strong>Name:</strong> ${team.name || "N/A"}</p>
                    <p><strong>Base:</strong> ${team.base || "N/A"}</p>
                    <p><strong>Points:</strong> ${team.points || "N/A"}</p>
                    <p><strong>Drivers:</strong> ${team.drivers || "N/A"}</p>
                </div>
            `;
    });
  }

  // Latest Highlights
  if (appData.highlights && appData.highlights.length > 0) {
    appData.highlights.slice(0, 2).forEach((highlight) => {
      html += `
                <div class="card">
                    <h3>📰 Latest Highlight</h3>
                    <p><strong>Title:</strong> ${highlight.title || "N/A"}</p>
                    <p><strong>Category:</strong> ${
                      highlight.category || "N/A"
                    }</p>
                    <p><strong>Date:</strong> ${highlight.date || "N/A"}</p>
                </div>
            `;
    });
  }

  container.innerHTML =
    html ||
    '<div class="card"><h3>No featured content available</h3><p>Try refreshing or check back later.</p></div>';
}
