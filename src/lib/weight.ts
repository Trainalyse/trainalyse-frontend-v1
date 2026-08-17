// One source of truth for human bodyweight bounds and weight-field shaping,
// shared by the Moreinfo signup field and the in-workout "update bodyweight"
// modal so the two can never drift apart. These run on the client only; the
// backend re-checks later.
import { sanitizeNumeric } from "@/lib/number-input"

export type WeightUnit = "kg" | "lbs"

// plausible human bounds + how many integer digits the input accepts, per unit.
// lbs is the kg range converted (10kg≈22lbs, 500kg≈1102lbs). intDigits is how
// many figures may sit before the decimal; everything allows 2 after it.
export const WEIGHT_LIMITS: Record<
  WeightUnit,
  { min: number; max: number; intDigits: number }
> = {
  kg: { min: 10, max: 500, intDigits: 3 },
  lbs: { min: 22, max: 1102, intDigits: 4 },
}
export const WEIGHT_FRAC_DIGITS = 2

// keep only the figures a weight field allows for this unit (integer cap per
// unit, 2 decimals). runs on every keystroke so an out-of-shape value can never
// be typed.
export function sanitizeWeight(raw: string, unit: WeightUnit): string {
  return sanitizeNumeric(raw, WEIGHT_LIMITS[unit].intDigits, WEIGHT_FRAC_DIGITS)
}

// range check for a committed weight NUMBER — undefined = fine, string = why it
// isn't. The max is also enforced live per keystroke, but the min can't be
// ("10" has to pass through "1"), so this is the commit-time gate for both.
export function weightRangeError(
  weight: number | undefined,
  unit: WeightUnit
): string | undefined {
  const { min, max } = WEIGHT_LIMITS[unit]
  if (weight === undefined || weight < min || weight > max) {
    return `Please enter a weight between ${min} and ${max} ${unit}.`
  }
  return undefined
}
