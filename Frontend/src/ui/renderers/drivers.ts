import type { Driver } from "../../types/types";

// Render drivers
export function renderDrivers(drivers: Driver[]): void {
  const container = document.getElementById("drivers-content");
  if (!container) return;

  if (!drivers || drivers.length === 0) {
    container.innerHTML =
      '<div class="card"><h3>No drivers data available</h3></div>';
    return;
  }

  let html = "";
  drivers.forEach((driver, index) => {
    console.log("Rendering driver:", driver);
    html += `
            <div class="card">
                <div class="driver-card">
                    <div class="driver-number">${
                      driver.number || index + 1
                    }</div>
                    <div>
                        <h3>${
                          driver.name + " " + driver.surname || "Unknown Driver"
                        }</h3>
                        <p><strong>Nation:</strong> ${
                          driver.nationality || "N/A"
                        }</p>
                        <p><strong>Birthday:</strong> ${
                          driver.birthday || "0"
                        }</p>
                        ${
                          driver.driverId
                            ? `<p><strong>driverId:</strong> ${driver.driverId}</p>`
                            : ""
                        }
                    </div>
                </div>
            </div>
        `;
  });

  container.innerHTML = html;
}
