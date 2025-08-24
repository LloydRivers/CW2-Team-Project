// Add visual effects
export function addVisualEffects(): void {
  // Add particle effect on hover for cards
  document.addEventListener("mousemove", (e) => {
    const target = e.target as HTMLElement;
    const card = target.closest(".card") as HTMLElement;
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(225, 6, 0, 0.1) 0%, transparent 50%), linear-gradient(145deg, #2a2a2a, #1e1e1e)`;
    }
  });

  // Reset card background on mouse leave
  document.addEventListener("mouseleave", (e) => {
    const target = e.target as HTMLElement;
    const card = target.closest(".card") as HTMLElement;
    if (card) {
      card.style.background = "linear-gradient(145deg, #2a2a2a, #1e1e1e)";
    }
  });
}
