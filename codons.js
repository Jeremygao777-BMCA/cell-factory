// Standard genetic code (RNA codons -> amino acid 3-letter abbreviations; STOP for stops)
// Source-free: this is a common, stable mapping used in textbooks.
export const CODON_TABLE = Object.freeze({
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

export const START_CODON = "AUG";
export const STOP_CODONS = Object.freeze(new Set(["UAA", "UAG", "UGA"]));

export function chunkCodons(mrna) {
  const codons = [];
  for (let i = 0; i + 2 < mrna.length; i += 3) codons.push(mrna.slice(i, i + 3));
  return codons;
}

export function translateMrna(mrna) {
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

