import { validateDnaStrict } from "./bio/validate.js";
import { complementDna, transcribeMrnaFromCodingStrand } from "./bio/pairing.js";
import { translateMrna } from "./bio/codons.js";
import { renderLegend, renderSequence, renderCodons } from "./ui/render.js";

const $ = (id) => document.getElementById(id);

const state = {
  act: "replication",
  score: 0,
};

function setPillAct() {
  const label = state.act[0].toUpperCase() + state.act.slice(1);
  $("pillAct").textContent = `Act: ${label}`;
  $("stageTitle").textContent = label;
}

function setScore(delta = 0) {
  state.score += delta;
  $("pillScore").textContent = `Score: ${state.score}`;
}

function randomDna(len = 45) {
  const bases = ["A", "T", "C", "G"];
  let s = "";
  for (let i = 0; i < len; i += 1) s += bases[Math.floor(Math.random() * bases.length)];
  return s;
}

function dnaValue() {
  return $("dnaInput").value.toUpperCase().replace(/\s+/g, "");
}

function showHint(msg, type) {
  const el = $("dnaHint");
  el.className = "hint" + (type ? ` ${type}` : "");
  el.textContent = msg || "";
}

function renderActCard() {
  const card = $("actCard");
  const act = state.act;
  const common = `
    <div class="rule">
      <div class="pill">Base pairing: A↔T, C↔G</div>
      <div class="pill">mRNA uses U (not T)</div>
      <div class="pill">Start: AUG · Stop: UAA/UAG/UGA</div>
    </div>
  `;

  if (act === "replication") {
    card.innerHTML = `
      <div><strong>Goal:</strong> build the complementary DNA strand.</div>
      <div class="muted" style="margin-top:6px">In cells, DNA polymerase copies DNA using base pairing rules.</div>
      ${common}
    `;
    return;
  }
  if (act === "transcription") {
    card.innerHTML = `
      <div><strong>Goal:</strong> transcribe DNA into mRNA.</div>
      <div class="muted" style="margin-top:6px">RNA polymerase makes mRNA. RNA uses U instead of T.</div>
      ${common}
    `;
    return;
  }
  card.innerHTML = `
    <div><strong>Goal:</strong> translate codons into an amino acid chain.</div>
    <div class="muted" style="margin-top:6px">Ribosomes read mRNA in codons (3 bases) to build proteins.</div>
    ${common}
  `;
}

function renderStage() {
  const stage = $("stage");
  stage.replaceChildren();

  const v = validateDnaStrict(dnaValue());
  if (!v.ok) {
    showHint(v.error, "bad");
    stage.innerHTML = `<div class="muted">Fix the DNA input to continue.</div>`;
    return;
  }
  showHint("DNA looks valid.", "good");

  const dnaCoding = v.value;
  const dnaTemplate = complementDna(dnaCoding);
  const mrna = transcribeMrnaFromCodingStrand(dnaCoding);

  if (state.act === "replication") {
    renderSequence(stage, dnaCoding, { title: "DNA coding strand (5' → 3')" });
    renderSequence(stage, dnaTemplate, { title: "Complementary strand (3' → 5')" });
    setScore(1);
    return;
  }

  if (state.act === "transcription") {
    renderSequence(stage, dnaCoding, { title: "DNA coding strand (5' → 3')" });
    renderSequence(stage, dnaTemplate, { title: "DNA template strand (3' → 5')" });
    renderSequence(stage, mrna, { title: "mRNA transcript (5' → 3')" });
    renderCodons(stage, mrna);
    setScore(2);
    return;
  }

  renderSequence(stage, mrna, { title: "mRNA (5' → 3')" });
  renderCodons(stage, mrna);
  const result = translateMrna(mrna);
  const out = document.createElement("div");
  out.className = "strand";
  if (!result.ok) {
    out.innerHTML = `<div class="strandTitle">Translation result</div><div class="muted">${result.error}</div>`;
    stage.appendChild(out);
    return;
  }

  const aa = result.aminoAcids;
  const stopText = result.stopIndex === null ? "No stop codon reached (ran off end)." : `Stopped at codon #${result.stopIndex + 1}.`;
  out.innerHTML = `
    <div class="strandTitle">Protein (amino acid chain)</div>
    <div class="muted">Start at codon #${result.startIndex + 1}. ${stopText}</div>
  `;
  const row = document.createElement("div");
  row.className = "seq";
  for (const a of aa) {
    const tile = document.createElement("div");
    tile.className = "base";
    tile.style.width = "56px";
    tile.style.borderRadius = "12px";
    tile.textContent = a;
    row.appendChild(tile);
  }
  out.appendChild(row);
  stage.appendChild(out);
  setScore(3);
}

function setAct(act) {
  state.act = act;
  for (const btn of document.querySelectorAll(".tab")) {
    btn.classList.toggle("active", btn.dataset.act === act);
  }
  setPillAct();
  renderActCard();
  renderStage();
}

function boot() {
  renderLegend($("legend"));
  setAct("replication");

  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => setAct(btn.dataset.act));
  });

  $("btnRandom").addEventListener("click", () => {
    $("dnaInput").value = randomDna();
    renderStage();
  });

  $("btnValidate").addEventListener("click", () => renderStage());
  $("btnReset").addEventListener("click", () => {
    state.score = 0;
    $("pillScore").textContent = "Score: 0";
    setAct("replication");
  });

  $("dnaInput").addEventListener("input", () => {
    // Soft validation; render on pause would be nicer, but keep simple for prototype.
    renderStage();
  });
}

boot();

