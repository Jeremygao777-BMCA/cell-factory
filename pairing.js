const DNA_PAIR = Object.freeze({
  A: "T",
  T: "A",
  C: "G",
  G: "C",
});

const RNA_FROM_DNA_TEMPLATE = Object.freeze({
  A: "U",
  T: "A",
  C: "G",
  G: "C",
});

export function complementDna(dnaStrand) {
  return [...dnaStrand].map((b) => DNA_PAIR[b] || "?").join("");
}

// Assumes input is a DNA coding strand (5'->3'); template is its complement.
// mRNA matches the coding strand except T->U.
export function transcribeMrnaFromCodingStrand(dnaCoding) {
  return [...dnaCoding].map((b) => (b === "T" ? "U" : b)).join("");
}

// If you want to show transcription from template explicitly:
export function transcribeMrnaFromTemplateStrand(dnaTemplate_3to5) {
  return [...dnaTemplate_3to5].map((b) => RNA_FROM_DNA_TEMPLATE[b] || "?").join("");
}

