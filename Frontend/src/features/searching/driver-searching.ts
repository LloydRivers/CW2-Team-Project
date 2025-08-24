import { appData } from "../../data/appData";
import { renderDrivers } from "../../ui/renderers/drivers";

// Search functionality for drivers
export function setupDriverSearch(): void {
  const searchInput = document.getElementById(
    "driver-search"
  ) as HTMLInputElement;
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const searchTerm = target.value.toLowerCase();
      const filteredDrivers = appData.drivers.filter(
        (driver) =>
          (driver.name || "").toLowerCase().includes(searchTerm) ||
          (driver.full_name || "").toLowerCase().includes(searchTerm) ||
          (driver.team || "").toLowerCase().includes(searchTerm) ||
          (driver.nationality || "").toLowerCase().includes(searchTerm)
      );
      renderDrivers(filteredDrivers);
    });
  }
}
