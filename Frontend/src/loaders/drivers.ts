import { apiCall } from "../api/api";
import { appData } from "../data/appData";
import type { Driver } from "../types/types";
import { renderDrivers } from "../ui/renderers/drivers";
import { showError, showLoading } from "../ui/utils";

// Load drivers data
export async function loadDrivers(): Promise<void> {
  showLoading("drivers-content");

  try {
    const [allDrivers, currentDrivers, featuredDrivers] =
      await Promise.allSettled([
        apiCall<Driver[]>("/drivers"),
        apiCall<Driver[]>("/drivers/featured"),
        apiCall<Driver[]>("/drivers/current"),
      ]);
    console.log("allDrivers is: ", allDrivers);
    console.log("currentDrivers is: ", currentDrivers);
    console.log("featuredDrivers is: ", featuredDrivers);

    let drivers: Driver[] = [];
    if (allDrivers.status === "fulfilled") drivers = allDrivers.value;
    else if (currentDrivers.status === "fulfilled")
      drivers = currentDrivers.value;
    else if (featuredDrivers.status === "fulfilled")
      drivers = featuredDrivers.value;

    appData.drivers = drivers;
    renderDrivers(drivers);
  } catch (error) {
    showError("drivers-content", "Failed to load drivers data");
    console.error("Drivers load error:", error);
  }
}
