export function unlockApp() {
  // Show all protected nav links
  document.querySelectorAll(".nav-link.protected").forEach((link) => {
    (link as HTMLElement).style.display = "inline-block";
  });

  // Show the protected content sections
  document.getElementById("protected-content")!.style.display = "block";

  // Swap login/logout buttons
  document.getElementById("login-btn")!.style.display = "none";
  document.getElementById("logout-btn")!.style.display = "inline-block";
}

export function lockApp() {
  console.log("lock app called");
  // Hide protected nav links
  document.querySelectorAll(".nav-link.protected").forEach((link) => {
    (link as HTMLElement).style.display = "none";
  });

  // Hide protected content sections
  document.getElementById("protected-content")!.style.display = "none";

  // Swap login/logout buttons
  document.getElementById("login-btn")!.style.display = "inline-block";
  document.getElementById("logout-btn")!.style.display = "none";
}
