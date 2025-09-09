import { appData } from "../../../data/appData";

/**
 * Returns dashboard statistics in a simple key/value object
 */

const currentYear = new Date().getFullYear();
export function getDashboardStats() {
  return {
    driversCount: appData.drivers.length || 0,
    teamsCount: appData.teams.length || 0,
    highlightsCount: appData.highlights.length || 0,
    featuredDriversCount:
      appData.featuredDrivers && Object.keys(appData.featuredDrivers).length > 0
        ? 1
        : 0,
    featuredTeamsCount:
      appData.featuredTeams && Object.keys(appData.featuredTeams).length > 0
        ? 1
        : 0,
    currentSeason: currentYear,
  };
}
