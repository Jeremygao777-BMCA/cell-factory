// Single-file bundle so the demo works even from file:// (no ES module loading needed).
// If you run a local server, you can switch back to module-based `src/app.js` later.

(() => {
  const $ = (id) => document.getElementById(id);

  // ===== bio/validate.js =====
  function validateDnaStrict(input) {
    const raw = String(input || "").toUpperCase().replace(/\s+/g, "");
    if (!raw) return { ok: false, error: "DNA is empty." };
    const badIndex = [...raw].findIndex((ch) => !["A", "T", "C", "G"].includes(ch));
    if (badIndex !== -1) {
      return {
        ok: false,
        error: `Invalid base '${raw[badIndex]}' at position ${badIndex + 1}. Use only A/T/C/G.`,
      };
    }
    return { ok: true, value: raw };
  }

  // ===== bio/pairing.js =====
  const DNA_PAIR = Object.freeze({ A: "T", T: "A", C: "G", G: "C" });

  function complementDna(dnaStrand) {
    return [...dnaStrand].map((b) => DNA_PAIR[b] || "?").join("");
  }

  // Assumes input is a DNA coding strand (5'->3'); mRNA matches coding except T->U.
  function transcribeMrnaFromCodingStrand(dnaCoding) {
    return [...dnaCoding].map((b) => (b === "T" ? "U" : b)).join("");
  }

  // ===== bio/codons.js =====
  const CODON_TABLE = Object.freeze({
    UUU: "Phe", UUC: "Phe", UUA: "Leu", UUG: "Leu",
    UCU: "Ser", UCC: "Ser", UCA: "Ser", UCG: "Ser",
    UAU: "Tyr", UAC: "Tyr", UAA: "STOP", UAG: "STOP",
    UGU: "Cys", UGC: "Cys", UGA: "STOP", UGG: "Trp",

    CUU: "Leu", CUC: "Leu", CUA: "Leu", CUG: "Leu",
    CCU: "Pro", CCC: "Pro", CCA: "Pro", CCG: "Pro",
    CAU: "His", CAC: "His", CAA: "Gln", CAG: "Gln",
    CGU: "Arg", CGC: "Arg", CGA: "Arg", CGG: "Arg",

    AUU: "Ile", AUC: "Ile", AUA: "Ile", AUG: "Met",
    ACU: "Thr", ACC: "Thr", ACA: "Thr", ACG: "Thr",
    AAU: "Asn", AAC: "Asn", AAA: "Lys", AAG: "Lys",
    AGU: "Ser", AGC: "Ser", AGA: "Arg", AGG: "Arg",

    GUU: "Val", GUC: "Val", GUA: "Val", GUG: "Val",
    GCU: "Ala", GCC: "Ala", GCA: "Ala", GCG: "Ala",
    GAU: "Asp", GAC: "Asp", GAA: "Glu", GAG: "Glu",
    GGU: "Gly", GGC: "Gly", GGA: "Gly", GGG: "Gly",
  });

  const START_CODON = "AUG";

  function chunkCodons(mrna) {
    const codons = [];
    for (let i = 0; i + 2 < mrna.length; i += 3) codons.push(mrna.slice(i, i + 3));
    return codons;
  }

  function translateMrna(mrna) {
    const codons = chunkCodons(mrna);
    const startIndex = codons.indexOf(START_CODON);
    if (startIndex === -1) return { ok: false, error: "No start codon (AUG) found.", codons, aminoAcids: [] };

    const aminoAcids = [];
    for (let i = startIndex; i < codons.length; i += 1) {
      const c = codons[i];
      const aa = CODON_TABLE[c] || "???";
      if (aa === "STOP") return { ok: true, codons, startIndex, stopIndex: i, aminoAcids };
      aminoAcids.push(aa);
    }
    return { ok: true, codons, startIndex, stopIndex: null, aminoAcids };
  }

  // ===== ui/render.js (minimal) =====
  const BASE_COLORS = Object.freeze({
    A: "var(--A)",
    T: "var(--T)",
    C: "var(--C)",
    G: "var(--G)",
    U: "var(--U)",
  });

  function baseChip(letter) {
    const color = BASE_COLORS[letter] || "rgba(255,255,255,.35)";
    const el = document.createElement("span");
    el.className = "chip";
    el.innerHTML = `<span class="dot" style="background:${color}"></span><span>${letter}</span>`;
    return el;
  }

  function renderLegend(container) {
    container.replaceChildren(baseChip("A"), baseChip("T"), baseChip("C"), baseChip("G"), baseChip("U"));
  }

  function renderSequence(container, seq, { title }) {
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

  function renderCodons(container, mrna) {
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

  // ===== app.js (adapted) =====
  const state = { act: "replication", score: 0 };

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
    const stopText =
      result.stopIndex === null ? "No stop codon reached (ran off end)." : `Stopped at codon #${result.stopIndex + 1}.`;
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

    $("dnaInput").addEventListener("input", () => renderStage());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

