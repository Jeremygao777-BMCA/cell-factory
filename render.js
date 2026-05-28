import { baseChip } from "./colors.js";

export function renderLegend(container) {
  container.replaceChildren(
    baseChip("A"),
    baseChip("T"),
    baseChip("C"),
    baseChip("G"),
    baseChip("U"),
  );
}

export function renderSequence(container, seq, { title }) {
  const wrap = document.createElement("div");
  wrap.className = "strand";

  const head = document.createElement("div");
  head.className = "strandTitle";
  head.textContent = title;

  const row = document.createElement("div");
  row.className = "seq";
  for (const b of seq) {
    const tile = document.createElement("div");
    tile.className = "base";
    tile.dataset.b = b;
    tile.textContent = b;
    row.appendChild(tile);
  }

  wrap.appendChild(head);
  wrap.appendChild(row);
  container.appendChild(wrap);
  return wrap;
}

export function renderCodons(container, mrna) {
  const strand = document.createElement("div");
  strand.className = "strand";
  strand.innerHTML = `<div class="strandTitle">mRNA codons (5' → 3')</div>`;

  const row = document.createElement("div");
  row.className = "seq";

  for (let i = 0; i < mrna.length; i += 3) {
    const codon = mrna.slice(i, i + 3);
    if (codon.length < 3) break;
    const tile = document.createElement("div");
    tile.className = "base";
    tile.style.width = "64px";
    tile.style.borderRadius = "12px";
    tile.dataset.b = codon[0];
    tile.textContent = codon;
    row.appendChild(tile);
  }

  strand.appendChild(row);
  container.appendChild(strand);
  return strand;
}

