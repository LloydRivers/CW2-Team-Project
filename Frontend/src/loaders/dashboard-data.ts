import { apiCall } from "../api/api";
import { appData } from "../data/appData";
import type {
  Driver,
  Team,
  Highlight,
  FeaturedDriver,
  FeaturedTeam,
} from "../types/types";
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
        apiCall<FeaturedDriver>("/drivers/featured"),
        apiCall<FeaturedTeam>("/teams/featured"),
        apiCall<Highlight[]>("/highlights"),
      ]);

    console.log("status calls are", {
      drivers: drivers.status,
      teams: teams.status,
      featuredDrivers: featuredDrivers,
      featuredTeams: featuredTeams.status,
      highlights: highlights,
    });

    // Store data
    if (drivers.status === "fulfilled") appData.drivers = drivers.value;
    if (teams.status === "fulfilled") appData.teams = teams.value;
    if (featuredDrivers.status === "fulfilled")
      appData.featuredDrivers = featuredDrivers.value;
    if (featuredTeams.status === "fulfilled")
      appData.featuredTeams = featuredTeams.value;
    if (highlights.status === "fulfilled")
      appData.highlights = highlights.value || [];

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

  // Featured Driver
  if (appData.featuredDrivers) {
    html += `
      <div class="card">
        <h3>🏆 Featured Driver</h3>
        <p><strong>Name:</strong> ${appData.featuredDrivers.name || "N/A"}</p>
        <p><strong>Birthday:</strong> ${
          appData.featuredDrivers.birthday || "N/A"
        }</p>
        <p><strong>Number:</strong> ${
          appData.featuredDrivers.number || "N/A"
        }</p>
        <p><strong>Nationality:</strong> ${
          appData.featuredDrivers.nationality || "N/A"
        }</p>
      </div>
    `;
  }

  // Featured Team
  if (appData.featuredTeams) {
    html += `
      <div class="card">
        <h3>🏁 Featured Team</h3>
        <p><strong>Team Name:</strong> ${
          appData.featuredTeams.teamName || "N/A"
        }</p>
        <p><strong>Nationality:</strong> ${
          appData.featuredTeams.teamNationality || "N/A"
        }</p>
        <p><strong>Id:</strong> ${appData.featuredTeams.teamId || "N/A"}</p>
        <p><strong>Championships:</strong> ${
          appData.featuredTeams.driversChampionships || "N/A"
        }</p>
      </div>
    `;
  }

  // Latest Highlights (optional, commented out)
  // if (appData.highlights && appData.highlights.length > 0) {
  //   appData.highlights.slice(0, 2).forEach((highlight) => {
  //     html += `
  //       <div class="card">
  //         <h3>📰 Latest Highlight</h3>
  //         <p><strong>Title:</strong> ${highlight.title || "N/A"}</p>
  //         <p><strong>Category:</strong> ${highlight.category || "N/A"}</p>
  //         <p><strong>Date:</strong> ${highlight.date || "N/A"}</p>
  //       </div>
  //     `;
  //   });
  // }

  container.innerHTML =
    html ||
    '<div class="card"><h3>No featured content available</h3><p>Try refreshing or check back later.</p></div>';
}
