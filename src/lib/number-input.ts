// Shared helpers for controlled numeric text inputs (the Moreinfo weight/height
// fields and the workout set cells). We use type="text" + these instead of
// type="number" so we can fully control the string: cap digits per side, treat a
// comma as a decimal point, and strip leading zeros — none of which type="number"
// allows reliably.

// keep only digits and a single decimal point, and clamp the number of figures
// before/after the point. fracDigits 0 means integer only (no decimal at all).
// runs on every keystroke so an out-of-shape value can never even be typed.
export function sanitizeNumeric(
  raw: string,
  intDigits: number,
  fracDigits: number
): string {
  // treat a comma as a decimal point so comma-locale keyboards ("80,5") work
  let s = raw.replace(/,/g, ".").replace(/[^\d.]/g, "")
  if (fracDigits === 0) {
    return s.replace(/\./g, "").slice(0, intDigits)
  }
  const firstDot = s.indexOf(".")
  if (firstDot !== -1) {
    // drop any decimal points after the first
    s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, "")
  }
  const [intPart = "", fracPart] = s.split(".")
  const int = intPart.slice(0, intDigits)
  if (fracPart === undefined) return int
  return int + "." + fracPart.slice(0, fracDigits)
}

// collapse leading zeros so "020" reads as "20", keeping a single "0" before a
// decimal (".5" and "0.5" both settle to "0.5"). runs on a short delay so the
// digit isn't yanked out from under the user mid-keystroke.
export function stripLeadingZeros(s: string): string {
  if (!s.includes(".")) {
    const stripped = s.replace(/^0+/, "")
    if (stripped !== "") return stripped
    return s === "" ? "" : "0"
  }
  const [intPart, fracPart] = s.split(".")
  const int = intPart.replace(/^0+/, "") || "0"
  return int + "." + fracPart
}
