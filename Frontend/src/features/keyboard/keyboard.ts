// Keyboard shortcuts
export function setupKeyboardShortcuts(): void {
  document.addEventListener("keydown", (e) => {
    if (e.altKey) {
      switch (e.key) {
        case "1":
          document.querySelector<HTMLElement>('[data-section="home"]')?.click();
          break;
        case "2":
          document
            .querySelector<HTMLElement>('[data-section="drivers"]')
            ?.click();
          break;
        case "3":
          document
            .querySelector<HTMLElement>('[data-section="teams"]')
            ?.click();
          break;
        case "4":
          document
            .querySelector<HTMLElement>('[data-section="seasons"]')
            ?.click();
          break;
        case "5":
          document
            .querySelector<HTMLElement>('[data-section="highlights"]')
            ?.click();
          break;
        case "6":
          document
            .querySelector<HTMLElement>('[data-section="sessions"]')
            ?.click();
          break;
        case "r":
          e.preventDefault();
          location.reload();
          break;
      }
    }
  });
}
