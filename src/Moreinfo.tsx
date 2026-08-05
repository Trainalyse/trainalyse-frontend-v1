import React, { type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import StepIndicator from "@/components/ui/step-indicator"
import { CalendarModal } from "@/components/CalendarModal"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
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

function Moreinfo() {
  const navigate = useNavigate()
  const [dob, setDob] = React.useState<Date | undefined>(undefined)
  const [dobOpen, setDobOpen] = React.useState(false)
  const [weight, setWeight] = React.useState("")
  const [weightUnit, setWeightUnit] = React.useState<"kg" | "lbs">("kg")
  const [height, setHeight] = React.useState("")
  const [heightFeet, setHeightFeet] = React.useState("")
  const [heightInches, setHeightInches] = React.useState("")
  const [heightUnit, setHeightUnit] = React.useState<"cm" | "ft">("cm")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
              <div className="flex flex-col gap-2">
                <Label>Date of birth</Label>
                <button
                  type="button"
                  onClick={() => setDobOpen(true)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--border-inputEdge)] bg-[var(--bg-inputBox)] py-1 pr-4 pl-3 text-left transition-colors outline-none"
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
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="weight">Weight</Label>
                <div className={fieldBox}>
                  <input
                    className={bigInput}
                    id="weight"
                    type="number"
                    inputMode="decimal"
                    placeholder="Enter your weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                  <UnitToggle
                    options={["kg", "lbs"] as const}
                    value={weightUnit}
                    onChange={setWeightUnit}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="height">Height</Label>
                <div className={fieldBox}>
                  {heightUnit === "cm" ? (
                    <input
                      className={bigInput}
                      id="height"
                      type="number"
                      inputMode="decimal"
                      placeholder="Enter your height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  ) : (
                    <div className="flex min-w-0 flex-1 gap-3">
                      <input
                        className={bigInput}
                        id="height"
                        type="number"
                        inputMode="decimal"
                        placeholder="ft"
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(e.target.value)}
                      />
                      <input
                        className={bigInput}
                        type="number"
                        inputMode="decimal"
                        placeholder="in"
                        value={heightInches}
                        onChange={(e) => setHeightInches(e.target.value)}
                      />
                    </div>
                  )}
                  <UnitToggle
                    options={["cm", "ft"] as const}
                    value={heightUnit}
                    onChange={setHeightUnit}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="h-11 w-full">
              Continue
            </Button>
          </CardContent>
        </Card>
      </form>

      {/* onboarding progress — this is the last of the sign-up steps, pinned to
          the bottom of the screen */}
      <StepIndicator total={3} current={3} className=" pt-60 pb-10" />

      {dobOpen && (
        <CalendarModal
          onClose={() => setDobOpen(false)}
          selected={dob}
          onSelect={setDob}
          // birthdates only up to the end of 2022
          maxDate={new Date(2022, 11, 31)}
        />
      )}
    </div>
  )
}

export default Moreinfo
