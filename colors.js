export const BASE_COLORS = Object.freeze({
  A: "var(--A)",
  T: "var(--T)",
  C: "var(--C)",
  G: "var(--G)",
  U: "var(--U)",
});

export function baseChip(letter) {
  const color = BASE_COLORS[letter] || "rgba(255,255,255,.35)";
  const el = document.createElement("span");
  el.className = "chip";
  el.innerHTML = `<span class="dot" style="background:${color}"></span><span>${letter}</span>`;
  return el;
}

