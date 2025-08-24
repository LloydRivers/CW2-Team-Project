import type { Highlight } from "../../types";
// Render highlights
export function renderHighlights(highlights: Highlight[]): void {
  const container = document.getElementById("highlights-content");
  if (!container) return;

  if (!highlights || highlights.length === 0) {
    container.innerHTML =
      '<div class="card"><h3>No highlights available</h3></div>';
    return;
  }

  let html = "";
  highlights.forEach((highlight) => {
    html += `
            <div class="highlight-item">
                <div class="highlight-content">
                    <div class="highlight-title">${
                      highlight.title || "F1 Highlight"
                    }</div>
                    <p><strong>Category:</strong> ${
                      highlight.category || "General"
                    }</p>
                    <p><strong>Date:</strong> ${
                      highlight.date || new Date().toLocaleDateString()
                    }</p>
                    ${
                      highlight.description
                        ? `<p>${highlight.description}</p>`
                        : ""
                    }
                    ${
                      highlight.video_url
                        ? `<p><strong>Video:</strong> <a href="${highlight.video_url}" target="_blank">Watch Here</a></p>`
                        : ""
                    }
                </div>
            </div>
        `;
  });

  container.innerHTML = html;
}
