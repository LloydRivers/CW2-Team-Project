export function showLoading(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element)
    element.innerHTML =
      '<div class="loading"><div class="spinner"></div></div>';
}

export function showError(elementId: string, message: string): void {
  const element = document.getElementById(elementId);
  if (element)
    element.innerHTML = `<div class="error">⚠️ Error: ${message}</div>`;
}
