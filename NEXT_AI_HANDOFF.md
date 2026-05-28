# Next AI Handoff (Specific Jobs)

This repo currently contains a **design spec** and a **minimal prototype**. Assign the next AIs to harden visuals, gameplay polish, and accuracy.

## Global acceptance criteria
- Base colors are consistent (`A/T/C/G/U`).
- Every major object is labeled + has a tooltip.
- DNA editor supports paste and validates input.
- The user can finish all three acts and see a final protein chain.

## What to hand off (send these files/notes)
- Repo folder (zip it) OR at minimum these files:
  - `index.html`
  - `src/app.js`
  - `src/styles.css`
  - `src/bio/codons.js`
  - `src/bio/pairing.js`
  - `docs/GAME_DESIGN.md`
  - `docs/ART_STYLE_GUIDE.md`
  - `docs/DEMO_SCRIPT.md`
  - `docs/NEXT_AI_HANDOFF.md`
- One sentence: “DNA input is a coding strand; mRNA = coding with T→U.”
- Your target demo length (e.g., 5 minutes) and whether you want “game” vs “lesson”.

## Repo map (where to work)
- Design: `docs/GAME_DESIGN.md`
- Art spec: `docs/ART_STYLE_GUIDE.md`
- Prototype entry: `index.html`
- Prototype logic: `src/app.js`
- Biology functions: `src/bio/*`
- UI rendering helpers: `src/ui/*`

## Copy/paste prompts (to give other AIs)
Use these verbatim to keep everyone aligned.

### Prompt for “Art & UI polish” AI
You are working on a browser learning-game demo called “Cell Factory” (DNA→RNA→Protein). Create a consistent set of simple, modern, label-friendly SVG assets (DNA, helicase, DNA polymerase, RNA polymerase, ribosome, tRNA, amino acid bead, nucleus/cytoplasm background). Colors MUST match: A=#2EE59D, T=#FF4D6D, C=#57A2FF, G=#FFCC4D, U=#B17BFF. Deliver assets into `assets/` and update `index.html`/`src/*` to use them. Keep it readable at 375px width.

### Prompt for “Biology accuracy” AI
Audit `docs/GAME_DESIGN.md` and `src/bio/*` for correctness. Ensure base pairing, transcription (U in RNA), and translation (codons, AUG start, UAA/UAG/UGA stop) are correct. Provide concrete edits to files (not just notes). Add short tooltips for DNA polymerase, RNA polymerase, ribosome, tRNA, codon, anticodon, amino acid.

### Prompt for “Gameplay design” AI
Turn this demo into a fun puzzle/arcade game. Propose 20 levels, each with objective + DNA seed + difficulty toggles. Add a scoring formula and 10 achievements. Keep it classroom-friendly.

### Prompt for “Engineering hardening” AI
Refactor the prototype into a clean state machine (replication/transcription/translation), add URL shareable seeds, and add lightweight tests for `src/bio/*` (either a test page or simple runner). No external dependencies unless strictly necessary.

---

# Recommended AI assignments (ChatGPT / Grok / Gemini)

## Gemini — Visual assets + layout polish (high leverage)
**Goal:** make it look like your reference images (clean textbook style) but “game-y”.

Specific jobs:
- Create `assets/` and add these SVGs (simple shapes are fine):
  - `assets/nucleus.svg`, `assets/cytoplasm.svg` (or one combined background)
  - `assets/dna.svg`, `assets/replication_fork.svg`
  - `assets/dna_polymerase.svg`, `assets/rna_polymerase.svg`
  - `assets/ribosome.svg`, `assets/trna.svg`
  - `assets/amino_bead.svg`
- Update UI composition in `index.html`/`src/styles.css`:
  - Nucleus on left/top, cytoplasm on right/bottom (like your examples)
  - Clear labels: “Nucleus”, “Cytoplasm”, “Replication”, “Transcription”, “Translation”
  - Legend always visible
- Add “shape labels” directly on/near objects (not just in side panel)

Definition of done:
- Opening `index.html` shows a clear nucleus/cytoplasm split and labeled objects.

## ChatGPT — Biology + copywriting + classroom tooltips
**Goal:** ensure correctness and improve the teaching text (tooltips + microcopy).

Specific jobs:
- Audit `src/bio/pairing.js` and `src/bio/codons.js`:
  - Confirm transcription logic matches your narrative (coding vs template)
  - Confirm start/stop behavior is explained consistently
- Add a tooltip dictionary (new file) `src/content/tooltips.js` with 10–15 short tooltips:
  - DNA, base pair, helicase, DNA polymerase
  - RNA polymerase, mRNA, codon, ribosome
  - tRNA, anticodon, amino acid, peptide bond, mutation
- Update `docs/GAME_DESIGN.md` wording so “coding strand vs template strand” is crystal clear.
- Add a “Teacher mode” suggestion section: 3 questions to ask students while demoing.

Definition of done:
- No contradictions between UI text and biology functions; tooltips are copy/paste ready.

## Grok — Gameification + levels + scoring + “fun”
**Goal:** turn it from a demo into a game with replay value.

Specific jobs:
- Design 20 level seeds (DNA strings) with objectives:
  - 5 easy (single AUG, no early stop)
  - 10 medium (decoy AUGs, early STOP risk, longer sequences)
  - 5 hard (frameshift/mutation repair goals)
- Define scoring formula and rank tiers:
  - Accuracy, time, hints used
- Add “events” to make it feel alive:
  - Mutation event cards (swap one base)
  - Time pressure “enzyme speed-up”
  - Bonus for perfect streak
- Provide JSON level pack format proposal:
  - `levels/{pack}.json` with `name`, `dna`, `objective`, `rules`, `parTime`

Definition of done:
- A level pack spec that an engineer can implement directly.

---

## AI #2 (Gemini suggested) — Art & UI polish
**Goal:** make the visuals look like a modern learning game.

Deliverables:
- `assets/` SVGs (or PNGs) for: DNA, helicase, DNA pol, RNA pol, ribosome, tRNA, amino acid beads, nucleus/cytoplasm background.
- A consistent palette + typography spec (add to `docs/ART_STYLE_GUIDE.md`).
- Replace prototype’s simple shapes with assets while keeping labels readable.

Acceptance:
- Works at 1280×720 and scales down to 375×667.
- Color-blind safe (patterns/letters still legible).

---

## AI #3 (ChatGPT or another) — Biology accuracy pass
**Goal:** verify rules and terminology shown to users.

Deliverables:
- Review `src/bio/*` functions and `docs/GAME_DESIGN.md`.
- Provide corrections where the prototype simplifies too far.
- Provide 5–10 “tooltips” (short, correct, student-friendly) for key objects.

Acceptance:
- No incorrect base pairing.
- Transcription uses U (not T) on RNA.
- Translation uses codons and start/stop correctly.

---

## AI #4 — Gameplay & progression design
**Goal:** turn demo into a sticky game.

Deliverables:
- Level list: 15–30 levels with increasing difficulty knobs.
- Scoring formula (accuracy/time/hints).
- 10 achievements and 10 cosmetic unlock ideas.

Acceptance:
- Each level has a single-sentence objective.
- Difficulty ramps without sudden spikes.

---

## AI #5 — Engineering hardening
**Goal:** refactor prototype into clean, extensible code.

Deliverables:
- Centralized state machine for acts (replication/transcription/translation).
- Unit tests for `src/bio/*` (if you add a test runner) OR a small in-browser test page.
- Save/load/share sequence via URL (seed in querystring).

Acceptance:
- No global mutable state leaks.
- Deterministic output from a given DNA input.
