import React, { type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Field, FieldError } from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"
import StepIndicator from "@/components/ui/step-indicator"
import { CalendarModal } from "@/components/CalendarModal"
import { cn } from "@/lib/utils"
import { format, differenceInYears } from "date-fns"
import { Calendar } from "lucide-react"

// small segmented control used for the kg/lbs and cm/ft unit choices. sits
// next to its input and matches the h-11 input height.
interface UnitToggleProps<T extends string> {
  options: readonly T[]
  value: T
  onChange: (value: T) => void
}

function UnitToggle<T extends string>({
  options,
  value,
  onChange,
}: UnitToggleProps<T>) {
  return (
    <div className="flex h-11 items-center rounded-lg border border-border bg-background p-0.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            // fixed width so kg/lbs and cm/ft toggles are the same total width,
            // keeping their left edges aligned across both fields
            "h-full w-12 rounded-md text-center text-sm font-medium transition-colors",
            value === option
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

// the value + unit toggle share one bordered field. the number sits borderless
// and large on the left, the toggle on the right.
const fieldBox =
  "flex items-center gap-2 rounded-xl border border-[var(--border-inputEdge)] bg-[var(--bg-inputBox)] py-1 pr-2 pl-3"
const bigInput =
  "min-w-0 flex-1 bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-base placeholder:font-normal placeholder:text-muted-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

type WeightUnit = "kg" | "lbs"

// plausible human bounds + how many digits the input accepts, per unit. lbs is
// the kg range converted (10kg≈22lbs, 500kg≈1102lbs). intDigits is how many
// figures may sit before the decimal; everything allows 2 after it.
const WEIGHT_LIMITS: Record<
  WeightUnit,
  { min: number; max: number; intDigits: number }
> = {
  kg: { min: 10, max: 500, intDigits: 3 },
  lbs: { min: 22, max: 1102, intDigits: 4 },
}
const WEIGHT_FRAC_DIGITS = 2

// height bounds are kept canonically in cm; the ft/in inputs are converted to
// cm before the range check. 20cm ≈ 0'8", 400cm ≈ 13'1".
const HEIGHT_CM_MIN = 20
const HEIGHT_CM_MAX = 400
const CM_PER_INCH = 2.54

// keep only digits and a single decimal point, and clamp the number of figures
// before/after the point. fracDigits 0 means integer only (no decimal at all).
// runs on every keystroke so an out-of-shape value can never even be typed.
function sanitizeNumeric(
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

function sanitizeWeight(raw: string, unit: WeightUnit): string {
  return sanitizeNumeric(raw, WEIGHT_LIMITS[unit].intDigits, WEIGHT_FRAC_DIGITS)
}

// collapse leading zeros so "020" reads as "20", keeping a single "0" before a
// decimal (".5" and "0.5" both settle to "0.5"). runs on a short delay so the
// digit isn't yanked out from under the user mid-keystroke.
function stripLeadingZeros(s: string): string {
  if (!s.includes(".")) {
    const stripped = s.replace(/^0+/, "")
    if (stripped !== "") return stripped
    return s === "" ? "" : "0"
  }
  const [intPart, fracPart] = s.split(".")
  const int = intPart.replace(/^0+/, "") || "0"
  return int + "." + fracPart
}

interface MoreinfoErrors {
  dob?: string
  weight?: string
  height?: string
}

interface HeightFields {
  unit: "cm" | "ft"
  cm: string
  feet: string
  inches: string
}

// turn whatever's in the height inputs into total cm, and note whether the user
// actually typed anything (height is optional, so blank stays valid).
function heightToCm(h: HeightFields): { cm: number; entered: boolean } {
  if (h.unit === "cm") {
    return { cm: parseFloat(h.cm), entered: h.cm.trim() !== "" }
  }
  const feet = parseFloat(h.feet) || 0
  const inches = parseFloat(h.inches) || 0
  return {
    cm: (feet * 12 + inches) * CM_PER_INCH,
    entered: h.feet.trim() !== "" || h.inches.trim() !== "",
  }
}

// date of birth and weight are required; height stays optional. only the keys
// with a problem are set, so an empty object means we're good to continue.
function validate(
  dob: Date | undefined,
  weight: string,
  weightUnit: WeightUnit,
  height: HeightFields
): MoreinfoErrors {
  const errors: MoreinfoErrors = {}

  if (!dob) {
    errors.dob = "Please select your date of birth."
  }

  const trimmed = weight.trim()
  const value = parseFloat(trimmed)
  const { min, max } = WEIGHT_LIMITS[weightUnit]
  if (!trimmed || Number.isNaN(value)) {
    errors.weight =
      "We need your weight to calculate the volume of bodyweight exercises, so this one's important."
  } else if (value < min || value > max) {
    errors.weight = `Please enter a weight between ${min} and ${max} ${weightUnit}.`
  }

  // optional: only complain if they typed a height. check the inches column is
  // a real inches value (0–11) first, then the overall range.
  const { cm, entered } = heightToCm(height)
  if (entered) {
    const inches = parseFloat(height.inches) || 0
    if (height.unit === "ft" && inches >= 12) {
      errors.height = "Inches must be between 0 and 11."
    } else if (!(cm >= HEIGHT_CM_MIN && cm <= HEIGHT_CM_MAX)) {
      errors.height =
        height.unit === "cm"
          ? `Please enter a height between ${HEIGHT_CM_MIN} and ${HEIGHT_CM_MAX} cm.`
          : `Please enter a height between 0 ft 8 in and 13 ft 1 in.`
    }
  }

  return errors
}

function Moreinfo() {
  const navigate = useNavigate()
  const [dob, setDob] = React.useState<Date | undefined>(undefined)
  const [dobOpen, setDobOpen] = React.useState(false)
  const [weight, setWeight] = React.useState("")
  const [weightUnit, setWeightUnit] = React.useState<WeightUnit>("kg")
  const [height, setHeight] = React.useState("")
  const [heightFeet, setHeightFeet] = React.useState("")
  const [heightInches, setHeightInches] = React.useState("")
  const [heightUnit, setHeightUnit] = React.useState<"cm" | "ft">("cm")
  // errors only appear after the first Continue press, then clear per-field as
  // the user fills each one in so the page never nags before they've tried.
  const [errors, setErrors] = React.useState<MoreinfoErrors>({})

  function handleSelectDob(next: Date | undefined) {
    setDob(next)
    if (errors.dob) setErrors((prev) => ({ ...prev, dob: undefined }))
  }
  function handleWeight(event: React.ChangeEvent<HTMLInputElement>) {
    setWeight(sanitizeWeight(event.target.value, weightUnit))
    if (errors.weight) setErrors((prev) => ({ ...prev, weight: undefined }))
  }
  // switching units re-clamps the digits to the new unit and clears any stale
  // range error (its message names the old unit).
  function handleWeightUnit(unit: WeightUnit) {
    setWeightUnit(unit)
    setWeight((w) => sanitizeWeight(w, unit))
    if (errors.weight) setErrors((prev) => ({ ...prev, weight: undefined }))
  }

  function clearHeightError() {
    if (errors.height) setErrors((prev) => ({ ...prev, height: undefined }))
  }
  function handleHeightCm(event: React.ChangeEvent<HTMLInputElement>) {
    setHeight(sanitizeNumeric(event.target.value, 3, 2)) // cm: up to 400.00
    clearHeightError()
  }
  function handleHeightFeet(event: React.ChangeEvent<HTMLInputElement>) {
    setHeightFeet(sanitizeNumeric(event.target.value, 2, 0)) // whole feet
    clearHeightError()
  }
  function handleHeightInches(event: React.ChangeEvent<HTMLInputElement>) {
    setHeightInches(sanitizeNumeric(event.target.value, 2, 2)) // inches, 2dp
    clearHeightError()
  }
  // cm and ft/in are separate state, so switching units keeps each entry; just
  // clear any stale range error since its message names the old unit.
  function handleHeightUnit(unit: "cm" | "ft") {
    setHeightUnit(unit)
    clearHeightError()
  }

  // tidy leading zeros a beat after typing stops ("020" → "20"). idempotent, so
  // once it settles it won't fire again.
  React.useEffect(() => {
    if (weight === "") return
    const id = setTimeout(() => {
      setWeight((w) => stripLeadingZeros(w))
    }, 50)
    return () => clearTimeout(id)
  }, [weight])

  // same leading-zero tidy for the three height inputs.
  React.useEffect(() => {
    const id = setTimeout(() => {
      setHeight((v) => stripLeadingZeros(v))
      setHeightFeet((v) => stripLeadingZeros(v))
      setHeightInches((v) => stripLeadingZeros(v))
    }, 50)
    return () => clearTimeout(id)
  }, [height, heightFeet, heightInches])

  // easter eggs: playful neon notes at the age extremes instead of plain errors.
  // non-blocking — the user can still continue. only one can ever show at once.
  const age = dob !== undefined ? differenceInYears(new Date(), dob) : null
  const isAncient = age !== null && age > 114
  const isYoung = age !== null && age < 15

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(dob, weight, weightUnit, {
      unit: heightUnit,
      cm: height,
      feet: heightFeet,
      inches: heightInches,
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    navigate("/")
  }

  return (
    <div className="flex min-h-svh flex-col p-4">
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-sm pt-12">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-bold">Some more info</h1>
          <p className="text-muted-foreground">
            A few details to personalize your log
          </p>
        </div>

        <Card className="[--card-spacing:--spacing(6)]">
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Field data-invalid={!!errors.dob}>
                <Label>Date of birth</Label>
                <button
                  type="button"
                  onClick={() => setDobOpen(true)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-xl border bg-[var(--bg-inputBox)] py-1 pr-4 pl-3 text-left transition-colors outline-none",
                    errors.dob
                      ? "border-destructive"
                      : "border-[var(--border-inputEdge)]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-11 items-center",
                      dob
                        ? "text-base font-semibold text-foreground"
                        : "text-base text-muted-foreground"
                    )}
                  >
                    {dob ? format(dob, "d MMM yyyy") : "Select your date of birth"}
                  </span>
                  <Calendar className="size-5 shrink-0 text-[var(--text-subheading)]" />
                </button>
                <FieldError>{errors.dob}</FieldError>
                {isAncient && (
                  <p className="text-sm font-medium text-[var(--color-neon)]">
                    Damn, you survived all the wars!! you're already built
                    different.
                  </p>
                )}
                {isYoung && (
                  <p className="text-sm font-medium text-[var(--color-neon)]">
                    Damn, you're starting this early!! please be gentle when you
                    grow up.
                  </p>
                )}
              </Field>

              <Field data-invalid={!!errors.weight}>
                <Label htmlFor="weight">Weight</Label>
                <div
                  className={cn(
                    fieldBox,
                    errors.weight && "border-destructive"
                  )}
                >
                  <input
                    className={bigInput}
                    id="weight"
                    type="text"
                    inputMode="decimal"
                    placeholder="Enter your weight"
                    value={weight}
                    onChange={handleWeight}
                    aria-invalid={!!errors.weight}
                  />
                  <UnitToggle
                    options={["kg", "lbs"] as const}
                    value={weightUnit}
                    onChange={handleWeightUnit}
                  />
                </div>
                <FieldError>{errors.weight}</FieldError>
              </Field>

              <Field data-invalid={!!errors.height}>
                <Label htmlFor="height">
                  Height{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <div
                  className={cn(fieldBox, errors.height && "border-destructive")}
                >
                  {heightUnit === "cm" ? (
                    <input
                      className={bigInput}
                      id="height"
                      type="text"
                      inputMode="decimal"
                      placeholder="Enter your height"
                      value={height}
                      onChange={handleHeightCm}
                      aria-invalid={!!errors.height}
                    />
                  ) : (
                    <div className="flex min-w-0 flex-1 gap-3">
                      <input
                        className={bigInput}
                        id="height"
                        type="text"
                        inputMode="decimal"
                        placeholder="ft"
                        value={heightFeet}
                        onChange={handleHeightFeet}
                        aria-invalid={!!errors.height}
                      />
                      <input
                        className={bigInput}
                        type="text"
                        inputMode="decimal"
                        placeholder="in"
                        value={heightInches}
                        onChange={handleHeightInches}
                        aria-invalid={!!errors.height}
                      />
                    </div>
                  )}
                  <UnitToggle
                    options={["cm", "ft"] as const}
                    value={heightUnit}
                    onChange={handleHeightUnit}
                  />
                </div>
                <FieldError>{errors.height}</FieldError>
              </Field>
            </div>

            <Button type="submit" className="h-11 w-full">
              Continue
            </Button>
          </CardContent>
        </Card>
      </form>

      {/* onboarding progress — this is the second (last) step, pinned to the
          bottom of the screen */}
      <StepIndicator total={2} current={2} className="mt-auto pt-8 pb-10" />

      {dobOpen && (
        <CalendarModal
          onClose={() => setDobOpen(false)}
          selected={dob}
          onSelect={handleSelectDob}
          // birthdates only up to the end of 2022
          maxDate={new Date(2022, 11, 31)}
        />
      )}
    </div>
  )
}

export default Moreinfo
