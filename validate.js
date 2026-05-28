export function normalizeDna(input) {
  return String(input || "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^ATCG]/g, "");
}

export function validateDnaStrict(input) {
  const raw = String(input || "").toUpperCase().replace(/\s+/g, "");
  if (!raw) return { ok: false, error: "DNA is empty." };
  const badIndex = [...raw].findIndex((ch) => !["A", "T", "C", "G"].includes(ch));
  if (badIndex !== -1) {
    return { ok: false, error: `Invalid base '${raw[badIndex]}' at position ${badIndex + 1}. Use only A/T/C/G.` };
  }
  return { ok: true, value: raw };
}

