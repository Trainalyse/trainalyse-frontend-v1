import React from "react"
import { type ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
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

  function handleRepsChange(e: ChangeEvent<HTMLInputElement>) {
    update({ reps: e.target.valueAsNumber })
  }

  function handleAssistedWeightsChange(e: ChangeEvent<HTMLInputElement>) {
    update({ assistedWeights: e.target.valueAsNumber })
  }
  function handleExtraWeightsChange(e: ChangeEvent<HTMLInputElement>) {
    update({ extraWeights: e.target.valueAsNumber })
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
      ) : (
        <Input
          type="number"
          placeholder="-"
          className={cellInputClass}
          id={id + "-weight"}
          value={(difficulty === "assisted" ? limb.assistedWeights : limb.extraWeights) ?? ""}
          onChange={difficulty === "assisted" ? handleAssistedWeightsChange : handleExtraWeightsChange}
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
            <Input
              type="number"
              placeholder="-"
              className={cellInputClass}
              id={id + "-weight"}
              value={limb.weights ?? ""}
              onChange={handleWeightsChange}
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="-"
              className={cellInputClass}
              id={id + "-reps"}
              value={limb.reps ?? ""}
              onChange={handleRepsChange}
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
                <Input
                  type="number"
                  placeholder="-"
                  className={cellInputClass}
                  id={id + "-reps"}
                  value={limb.reps ?? ""}
                  onChange={handleRepsChange}
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
