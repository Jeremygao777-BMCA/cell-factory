# Master Handoff: “Cell Factory” (3D documentary + free explore)

This document is the *single source of truth* for coordinating multiple AIs to reach a shippable product.

## Non‑negotiables
- Look: **3D-ish documentary** (soft lighting, depth, smooth eased motion, subtle grain), but still readable like a science explainer.
- Mode: **Free Explore** (player can pan/zoom, click molecules, scrub time, trigger processes).
- Platform: **static website** (plays from a URL on any laptop; no installs).
- No copyrighted microscope footage; generate original visuals (stylized “microscope” aesthetic is OK).

## Distribution (so everyone can play)
Ship as a static site via **GitHub Pages** (recommended) or Netlify/Vercel.
- All asset paths must be relative (e.g., `assets/...`).
- Must run on Chrome/Edge/Safari/Firefox.

## Current repo status (what exists)
- Running prototype UI: `index.html`, `src/app.bundle.js`, `src/styles.css`
- Design specs: `docs/GAME_DESIGN.md`, `docs/ART_STYLE_GUIDE.md`, `docs/DEMO_SCRIPT.md`
- This coordination plan: `docs/MASTER_HANDOFF.md`

## Target “vertical slice” (definition of done for v1)
User can:
1) Open link on any laptop.
2) Enter DNA sequence.
3) Switch to **Explore Mode**:
   - Pan/zoom around a cell scene.
   - Click molecules to see labels/tooltips.
   - Use a **timeline scrubber** to run replication → transcription → translation.
4) See codons highlighted and protein chain growing.

## Architecture choice (recommended)
Use **SVG + Web Animations API (WAAPI)** for:
- Crisp labels/text
- Easy layering and hit-testing
- Static deploy (no build step)

Optional upgrade path (v2):
- PixiJS/Three.js for true lighting/particles if needed.

## Scene model (shared contract between Art and Engineering)

### Required SVG assets
Create these as layered SVGs with **stable group ids** for animation and click targets:
- `assets/scene_cell.svg`
  - Contains background: membrane, cytoplasm haze, nucleus shell, pores, grain overlay.
- `assets/molecules.svg`
  - Contains reusable symbols or groups:
    - `dna`
    - `replicationFork`
    - `helicase`
    - `dnaPolymerase`
    - `rnaPolymerase`
    - `mrna`
    - `ribosomeSmall`, `ribosomeLarge`
    - `trna`
    - `aminoBead`
    - `proteinChain`

### Group id naming rules
- Use `id` on `<g>` nodes only (not paths) for things that animate.
- All ids must be ASCII, camelCase, unique.
- Animate using transforms on the group, not individual paths.

### Mandatory “hotspots” (clickable)
In `assets/molecules.svg`, include invisible hit areas:
- `hotspot_dna`, `hotspot_rnaPol`, `hotspot_ribosome`, `hotspot_trna`
(simple transparent rectangles/paths).

## Explore Mode UX (must-haves)
- Pan/zoom with mouse wheel + drag (trackpad friendly).
- Left panel shows:
  - Selected object name + tooltip
  - “Process controls”: Play/Pause, Step, Reset
  - Timeline scrubber (0–100%)
- On-scene labels that can be toggled:
  - Always-on for major compartments (Nucleus/Cytoplasm)
  - Optional for molecules (toggle)

## Process animation beats (timing contract)
All timings are “slow documentary” (no frantic motion).

### Replication (0%–33%)
- DNA unzips at fork (helicase)
- Polymerase follows; complementary bases appear

### Transcription (33%–66%)
- RNA polymerase binds, travels along DNA
- mRNA ribbon extrudes and letters appear

### Translation (66%–100%)
- Ribosome clamps onto mRNA
- Codon highlight steps every beat
- tRNA docks; amino bead added; protein chain grows

## Data + biology contract
- Input DNA is **coding strand** 5'→3'
- mRNA = coding strand with **T→U**
- Translation:
  - Start at first `AUG` codon
  - Stop at `UAA/UAG/UGA` or end-of-sequence

## Workstream split (3 AIs)

### AI: Gemini (Art Director + Asset Creator)
Deliverables:
- `assets/scene_cell.svg`
- `assets/molecules.svg`
- `docs/ANIMATION_STORYBOARD.md` (shots + timings + which group ids move)
- Update `docs/ART_STYLE_GUIDE.md` with:
  - Lighting notes (soft rim light, AO shading)
  - Grain settings (subtle)

Acceptance:
- Assets look 3D-ish (gradient shading + subtle highlights).
- Hotspots exist and align with visuals.
- All group ids follow rules above.

### AI: ChatGPT (Animation/Explore Engineer)
Deliverables:
- Update `index.html` UI to include:
  - Explore Mode toggle
  - Timeline scrubber
  - Pan/zoom canvas area (SVG viewport)
- Update `src/app.bundle.js`:
  - `loadSvgAssets()`
  - Pan/zoom controller (no dependencies)
  - Timeline controller: maps 0–1 progress to transforms/opacity
  - Click-to-select using hotspot ids
  - Hooks to show DNA/mRNA/protein strings in side panel

Acceptance:
- Runs from GitHub Pages.
- Smooth playback at 60fps on typical laptop.
- Timeline scrub works both directions.

### AI: Grok (Game Systems Designer)
Deliverables:
- `docs/LEVELS_AND_SCORING.md`
- `levels/levels.v1.json` with 25 levels + 1 free-sandbox config
- A “Explore Quests” list (10 micro-objectives) that fit free roam

Acceptance:
- Each level has: `dna`, objective, constraints, hint budget, par time.

## Integration checkpoints (to avoid “almost works”)
1) **Checkpoint A (Art):** assets load + show in stage (static).
2) **Checkpoint B (Explore):** pan/zoom + click hotspots show tooltips.
3) **Checkpoint C (Timeline):** scrubber runs the 3 acts end-to-end.
4) **Checkpoint D (Game):** levels load and swap DNA + objectives.

