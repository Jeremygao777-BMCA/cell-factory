# Game Design: “Cell Factory”

## One‑sentence pitch
Players edit DNA (A/T/C/G), replicate it correctly, transcribe mRNA (A/U/C/G), and translate codons into a protein—earning points for accuracy and speed while learning what each molecule does.

## Core learning goals (what users should walk away with)
- DNA is a double‑stranded code with **base pairing** (A–T, C–G).
- **Replication** copies DNA (semi‑conservative; new complementary strand).
- **Transcription** makes **mRNA** from a DNA template (A–U, T–A, C–G, G–C).
- **Translation** reads mRNA in **codons** (3 bases) on a **ribosome**, using **tRNA anticodons** to bring amino acids, building a **polypeptide**.
- **Start/stop codons** (AUG start; UAA/UAG/UGA stop) define open reading frames.

## Target platform
- Web (desktop first), runs in browser, touch-friendly optional.

## Visual language (shapes, labels, colors)
Use consistent color coding everywhere (DNA bases, RNA bases, UI chips, tooltips).

### Base colors (recommended)
- `A` = Green
- `T` = Red
- `C` = Blue
- `G` = Yellow/Amber
- `U` = Purple (RNA only)

### Shape mapping (simple + recognizable)
- DNA double helix: two rails + base “rungs” (rectangles/capsules)
- Replication fork: “Y” split with helicase wedge icon
- DNA polymerase: rounded capsule/robot tool
- RNA polymerase: capsule tool with “RNA Pol” label
- mRNA: single strand ribbon with codon grouping brackets
- Ribosome: two-lobed “hamburger bun” with A/P/E sites labeled
- tRNA: clover/T shape with anticodon at bottom, amino acid bead at top
- Amino acids: colored beads; protein = bead chain

### Mandatory labeling
Every major object has:
- Label (e.g., “DNA Polymerase”)
- Tooltip (1–2 sentences)
- Color stripe matching its type (enzyme vs nucleic acid vs organelle)

## Game loop (3 acts, always in same order)

### Act 1 — Replication (in nucleus)
**Player goal:** produce the correct complementary strand(s).

Mechanics:
- Drag-and-drop bases onto an exposed template strand at the fork.
- Enforce pairing rules (A↔T, C↔G).
- Optional “Okazaki fragments” as a harder mode (lagging strand mini‑puzzles).

Feedback:
- Wrong base: red shake + brief note (“A pairs with T”).
- Correct streak: combo multiplier.

Outputs:
- Completed replicated DNA (two double strands).
- Exported “coding strand” sequence for transcription act.

### Act 2 — Transcription (RNA polymerase)
**Player goal:** create an mRNA transcript.

Mechanics:
- DNA template strand is shown; RNA polymerase moves along it.
- Player can:
  - “Auto transcribe” (for story mode) OR
  - Place complementary RNA bases (for game mode)
- Rules: A→U, T→A, C→G, G→C (as RNA is complementary to template).

Optional mini‑features (toggleable):
- Promoter selection (“Start here”)
- Pre‑mRNA vs mRNA: simple splicing puzzle (remove intron blocks)

Outputs:
- mRNA sequence grouped into codons (triplets).

### Act 3 — Translation (ribosome in cytoplasm)
**Player goal:** translate codons into a protein chain.

Mechanics:
- Ribosome highlights current codon.
- Player chooses matching tRNA (anticodon) to drop into A site.
- When correct:
  - Amino acid bead added to chain
  - Ribosome shifts forward one codon
- Start: must find `AUG` to begin
- Stop: ends at `UAA/UAG/UGA`

Feedback:
- Incorrect tRNA: bounce back + hint (“anticodon pairs with codon”).
- Score: accuracy + time + fewer hints.

Outputs:
- Protein chain visualization + “name” (just length / motif badges).

## Customization (ATCG editor)

### DNA editor
- User edits a **coding strand** (5'→3') with:
  - Randomize
  - Paste/import
  - Mutate (point mutation tool)
- Validates characters: only `A/T/C/G`.

### Constraints (to keep it fun)
- Story mode forces the sequence to include at least one start codon in mRNA.
- Challenge mode may include decoy starts, early stops, or frameshift hazards.

### Game-friendly genetics (not clinically accurate on purpose)
- We keep the full codon table mapping to amino acids, but we do not model folding, post-translational modifications, or cellular regulation unless you add an “Advanced” mode later.

## Modes

### 1) Story / Guided (best for demo)
- Big labels, tooltips, step-by-step narration
- “Auto” buttons available
- No timers

### 2) Arcade / Timed
- Timers per act
- Combos for correct streaks
- Leaderboard-ready scoring (local only)

### 3) Puzzle / Levels
- Fixed sequences with a goal:
  - “Make a 6-aa protein”
  - “Avoid premature stop codon”
  - “Repair a mutation”

### 4) Sandbox / Creator
- Full DNA customization
- Toggle act difficulty independently
- Export/share a seed string (e.g., base sequence + toggles)

## Difficulty knobs (great for “fun game”)
- Base placement: drag vs click vs type
- Enzyme speed: slower/faster polymerase animations
- Hint budget: 3–5 hints per act
- Noise: add distractor molecules floating by
- Biology realism: enable/disable Okazaki, splicing, reading frame overlays

## Rewards & progression
- XP for completing acts with accuracy
- Cosmetic unlocks:
  - Ribosome skins
  - Base tile themes
  - “Cell background” styles (cartoon vs textbook)
- Badges:
  - “Perfect Pairing”
  - “No Hints”
  - “Fast Translator”

## UX requirements
- Always show:
  - Current strand direction (5'/3')
  - Current codon index
  - Active rule (pairing / transcription / translation)
- One-click “Reset act”
- Accessibility:
  - Color-blind safe secondary encoding (letter + pattern)
  - Keyboard support (A/T/C/G/U keys)

## Technical architecture (recommended)
- Vanilla JS + Canvas/DOM hybrid (no build step required).
- Modules:
  - `src/bio/` pure functions (pairing, transcription, translation)
  - `src/ui/` rendering + interactions
  - `src/state/` single source of truth (acts, score, hints)

