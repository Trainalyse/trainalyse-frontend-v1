import React from "react"
import { type ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import NumericCell from "@/components/NumericCell"
import { user } from "./data/user"
import TimeInput from "@/components/TimeInput"
import { type ExerciseType } from "./data/exercise"
import { type Difficulty } from "./data/workouts"
import { type Dropset ,type LimbValues,type Limb} from "./data/workouts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"


// Short forms shown in the closed trigger; the open list keeps the full names.
const difficultyShortLabels: Record<Difficulty, string> = {
  normal: "Norm.",
  assisted: "Asst.",
  weighted: "Wtd.",
}

// weight-cell limits keyed off the user's global unit. kg: up to 800 with 3
// same ceiling regardless of unit: up to 4 digits before the decimal and 2 after,
// so the highest weight that can be typed is 9999.99 (kg or lbs). the intDigits +
// fracDigits caps already enforce that; max is a redundant explicit safeguard. a
// value above this can't be typed at all. (must-be-greater-than-0 is a Save-time
// check, not enforced here — "0" has to be typeable as the start of "0.5".)
const WORKOUT_WEIGHT_LIMITS = {
  kg: { max: 9999.99, intDigits: 4 },
  lbs: { max: 9999.99, intDigits: 4 },
} as const
const WEIGHT_FRAC_DIGITS = 2

// reps are whole numbers only (fracDigits 0 = no decimal), unit-independent, up
// to 5 digits so the highest is 99999 in one dropset (the no-rest pushup record
// is north of 10,000, so 4 digits wasn't enough). shared by both reps cells.
// (must-be-greater-than-0 is a Save-time check, same reasoning as the weight cell.)
const REPS_LIMIT = { max: 99999, intDigits: 5, fracDigits: 0 } as const

interface DropsetsProps {
  exerciseType: ExerciseType | ""
  isBodyweight: boolean
  dropsetData: Dropset
  activeLimb: Limb
  onChange: (updated: Dropset) => void
}

function Dropsets({
  exerciseType,
  isBodyweight,
  dropsetData,
  activeLimb,
  onChange,
}: DropsetsProps) {
  const id = React.useId()
  const weightLimit = WORKOUT_WEIGHT_LIMITS[user.weightUnit]

  // Assisted weight (bodyweight exercises) must be STRICTLY less than the user's
  // bodyweight, so the effective load — (bodyweight − assistance) — stays > 0 and
  // volume/endurance can never hit 0 or go negative. With 2-decimal precision the
  // ceiling is bodyweight minus one cent (e.g. 56.65 → 56.64), computed in integer
  // cents to dodge float error. Falls back to the normal weight ceiling if the
  // user's bodyweight isn't set, so the cell never locks up.
  const assistedMax =
    user.weight > 0 ? (Math.round(user.weight * 100) - 1) / 100 : weightLimit.max

  // messages shown (as a toast) when a keystroke is rejected for exceeding a
  // cell's ceiling — so the user knows the allowed range instead of just being
  // silently blocked. Assisted references the bodyweight, since that's the cap.
  const unit = user.weightUnit
  const assistedRejectMsg = `You can only enter assisted weight between 0 and your bodyweight (${user.weight} ${unit}).`
  const weightRejectMsg = `You can only enter weight between 0 and ${weightLimit.max} ${unit}.`
  const extraRejectMsg = `You can only add extra weight between 0 and ${weightLimit.max} ${unit}.`
  const repsRejectMsg = `You can only enter reps between 0 and ${REPS_LIMIT.max}.`

  // the values for whichever limb is active — empty when that limb has no data
  // yet, so Left and Right stay fully independent (no mirroring)
  const limb: LimbValues = dropsetData[activeLimb] ?? {}

  // rebuild the ACTIVE limb with whatever field changed, and hand it up to Set
  function update(patch: Partial<LimbValues>) {
    onChange({ ...dropsetData, [activeLimb]: { ...limb, ...patch } })
  }
  {/*alright so for the above 2 sections this is the comment:-
    The two lines in one sentence each:
    - Line 1: "grab the active limb's values (or empty if it has none)."
    - update: "rebuild the dropset with the active limb's values + the one field that changed, and hand it up." */}

  // difficulty defaults to "normal" when nothing has been chosen yet
  const difficulty: Difficulty = limb.difficulty ?? "normal"

  function handleWeightsChange(e: ChangeEvent<HTMLInputElement>) {
    update({ weights: e.target.valueAsNumber })
  }

  const difficultySelect = (
    <Select
      value={difficulty}
      onValueChange={(value) => update({ difficulty: value as Difficulty })}
    >
      {/* Show the short form in the closed trigger (difficulty always has a
          value, defaulting to "normal") instead of mirroring the item text.
          w-full (not a fixed width) so the trigger fills the column rather than
          forcing it wider than the "DIFFICULTY" label. */}
      <SelectTrigger className="w-full min-w-0 gap-1 px-1.5 text-sm">
        {difficultyShortLabels[difficulty]}
      </SelectTrigger>
      {/* popper (not the default item-aligned) so the panel anchors to the
          trigger — item-aligned needs a <SelectValue> node to align onto, which
          we dropped for the short-form label. */}
      <SelectContent position="popper" >
        <SelectItem value="normal">Normal</SelectItem>
        <SelectItem value="assisted">Assisted</SelectItem>
        <SelectItem value="weighted">Weighted</SelectItem>
      </SelectContent>
    </Select>
  )

  // shared styling for the borderless, left-aligned numeric cells. w-full +
  // min-w-0 so the input shrinks with its minmax(0,1fr) track instead of
  // forcing the column wider (and expands to fill on wider screens).
  const cellInputClass =
    "w-full min-w-0 border-0 bg-transparent dark:bg-transparent text-center shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

  // Weights cell for BODYWEIGHT exercises — identical in weights&reps and duration.
  // Normal adds no weight → a muted "-" that still holds the column width; Assisted/
  // Weighted → the assist/extra weight is entered here. Always rendered so the
  // column never moves when difficulty changes.
  const bodyweightWeightsCell = (
    <div className="text-left">
      {difficulty === "normal" ? (
        <span className="inline-block w-full text-center text-muted-foreground">NA</span>
      ) : difficulty === "assisted" ? (
        // assistance is capped just below bodyweight (see assistedMax) so the
        // effective load never reaches 0
        <NumericCell
          className={cellInputClass}
          id={id + "-weight"}
          placeholder="-"
          value={limb.assistedWeights}
          onChange={(n) => update({ assistedWeights: n })}
          intDigits={weightLimit.intDigits}
          fracDigits={WEIGHT_FRAC_DIGITS}
          max={assistedMax}
          rejectMessage={assistedRejectMsg}
        />
      ) : (
        // weighted: extra load on top of bodyweight, same ceiling as a plain weight
        <NumericCell
          className={cellInputClass}
          id={id + "-weight"}
          placeholder="-"
          value={limb.extraWeights}
          onChange={(n) => update({ extraWeights: n })}
          intDigits={weightLimit.intDigits}
          fracDigits={WEIGHT_FRAC_DIGITS}
          max={weightLimit.max}
          rejectMessage={extraRejectMsg}
        />
      )}
    </div>
  )

  return (

    <>
      {/* Barbell: Weights + Reps */}
      {exerciseType === "weightsAndReps" && !isBodyweight && (
        <>
          <div>
            <NumericCell
              className={cellInputClass}
              id={id + "-weight"}
              placeholder="-"
              value={limb.weights}
              onChange={(n) => update({ weights: n })}
              intDigits={weightLimit.intDigits}
              fracDigits={WEIGHT_FRAC_DIGITS}
              max={weightLimit.max}
              rejectMessage={weightRejectMsg}
            />
          </div>
          <div>
            <NumericCell
              className={cellInputClass}
              id={id + "-reps"}
              placeholder="-"
              value={limb.reps}
              onChange={(n) => update({ reps: n })}
              intDigits={REPS_LIMIT.intDigits}
              fracDigits={REPS_LIMIT.fracDigits}
              max={REPS_LIMIT.max}
              rejectMessage={repsRejectMsg}
            />
          </div>
        </>
      )}
          {/* Bodyweight reps (pull-up): Difficulty + Weights + Reps */}
          {exerciseType === "weightsAndReps" && isBodyweight && (
            <>
              <div>{difficultySelect}</div>
              {bodyweightWeightsCell}
              <div>
                <NumericCell
                  className={cellInputClass}
                  id={id + "-reps"}
                  placeholder="-"
                  value={limb.reps}
                  onChange={(n) => update({ reps: n })}
                  intDigits={REPS_LIMIT.intDigits}
                  fracDigits={REPS_LIMIT.fracDigits}
                  max={REPS_LIMIT.max}
                  rejectMessage={repsRejectMsg}
                />
              </div>
            </>
          )}
          {/* Duration (weighted): Weights + Time */}
          {exerciseType === "duration" && !isBodyweight && (
            <>
              <div>
                <Input
                  type="number"
                  // blur on wheel so scrolling the row sideways can't nudge the number
                  onWheel={(e) => e.currentTarget.blur()}
                  placeholder="-"
                  className={cellInputClass}
                  id={id + "-weight"}
                  value={limb.weights ?? ""}
                  onChange={handleWeightsChange}
                />
              </div>
              <div>
                <TimeInput
                  hours={limb.hours}
                  minutes={limb.minutes}
                  seconds={limb.seconds}
                  onChange={(v) => update(v)}
                />
              </div>
            </>
          )}
          {/* Duration bodyweight (plank): Difficulty + Weights + Time */}
          {exerciseType === "duration" && isBodyweight && (
            <>
              <div>{difficultySelect}</div>
              {bodyweightWeightsCell}
              <div>
                <TimeInput
                  hours={limb.hours}
                  minutes={limb.minutes}
                  seconds={limb.seconds}
                  onChange={(v) => update(v)}
                />
              </div>
            </>
          )}
    </>
  )
}

export default Dropsets
