import { loadDrivers } from "./drivers";
import { loadHighlights } from "./highlights";
import { loadSeasons } from "./seasons";
import { loadSessions } from "./sessions";
import { loadTeams } from "./teams";

// Load section data based on current view
export async function loadSectionData(section: string): Promise<void> {
  switch (section) {
    case "drivers":
      await loadDrivers();
      break;
    case "teams":
      await loadTeams();
      break;
    case "seasons":
      await loadSeasons();
      break;
    case "highlights":
      await loadHighlights();
      break;
    case "sessions":
      await loadSessions();
      break;
  }
}
