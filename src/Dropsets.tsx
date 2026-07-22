import React from "react"
import { type ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { type ExerciseType } from "./data/exercise"
import { type Difficulty } from "./Set"
import { type Dropset ,type LimbValues,type Limb} from "./data/workouts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


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
    const next = { ...dropsetData, [activeLimb]: { ...limb, ...patch } }
    console.log("[Dropsets] activeLimb:", activeLimb, "| typed:", patch, "| new dropset:", next)
    onChange(next)
  }

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
      <SelectTrigger>
        <SelectValue placeholder="Difficulty" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="normal">Normal</SelectItem>
        <SelectItem value="assisted">Assisted</SelectItem>
        <SelectItem value="weighted">Weighted</SelectItem>
      </SelectContent>
    </Select>
  )

  return (

    <>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          {isBodyweight && <p>Difficulty</p>}
          {exerciseType === "weightsAndReps" && !isBodyweight && (
            <>
              <Input
                type="number"
                placeholder="enter the weights"
                id={id + "-weight"}
                value={limb.weights}
                onChange={handleWeightsChange}
              />
              <Input
                type="number"
                placeholder="enter the reps"
                id={id + "-reps"}
                value={limb.reps}
                onChange={handleRepsChange}
              />
            </>
          )}
          {exerciseType === "duration" && isBodyweight && (
            <>
              {difficultySelect}
              {difficulty === "assisted" && (
                <Input
                  type="number"
                  placeholder="enter the assisted weights"
                  id={id + "-assistedWeight"}
                  value={limb.assistedWeights}
                  onChange={handleAssistedWeightsChange}
                />
              )}
              {difficulty === "weighted" && (
                <Input
                  type="number"
                  placeholder="enter the extra weights"
                  id={id + "-extraWeight"}
                  value={limb.extraWeights}
                  onChange={handleExtraWeightsChange}
                />
              )}

              <Input
                type="number"
                min={0}
                max={24}
                placeholder="hours"
                id={id + "-hours"}
                value={limb.hours}
                onChange={(e) => update({ hours: e.target.valueAsNumber })}
              />
              <Input
                type="number"
                min={0}
                max={59}
                placeholder="minutes"
                id={id + "-minutes"}
                value={limb.minutes}
                onChange={(e) => update({ minutes: e.target.valueAsNumber })}
              />
              <Input
                type="number"
                min={0}
                max={59}
                placeholder="seconds"
                id={id + "-seconds"}
                value={limb.seconds}
                onChange={(e) => update({ seconds: e.target.valueAsNumber })}
              />
            </>
          )}
          {exerciseType === "weightsAndReps" && isBodyweight && (
            <>
              {difficultySelect}
              {difficulty === "normal" && (
                <Input
                  type="number"
                  placeholder="enter the reps"
                  id={id + "-reps"}
                  value={limb.reps}
                  onChange={handleRepsChange}
                />
              )}
              {difficulty === "assisted" && (
                <>
                  <Input
                    type="number"
                    placeholder="enter the assisted weights"
                    id={id + "-assistedWeight"}
                    value={limb.assistedWeights}
                    onChange={handleAssistedWeightsChange}
                  />
                  <Input
                    type="number"
                    placeholder="enter the reps"
                    id={id + "-reps"}
                    value={limb.reps}
                    onChange={handleRepsChange}
                  />
                </>
              )}
              {difficulty === "weighted" && (
                <>
                  <Input
                    type="number"
                    placeholder="enter the extra weights"
                    id={id + "-extraWeight"}
                    value={limb.extraWeights}
                    onChange={handleExtraWeightsChange}
                  />

                  <Input
                    type="number"
                    placeholder="enter the reps"
                    id={id + "-reps"}
                    value={limb.reps}
                    onChange={handleRepsChange}
                  />
                </>
              )}
            </>
          )}
          {exerciseType === "duration" && !isBodyweight && (
            <>
              <Input
                type="number"
                placeholder="enter the weights"
                id={id + "-weight"}
                value={limb.weights}
                onChange={handleWeightsChange}
              />
              <Input
                type="number"
                min={0}
                max={24}
                placeholder="hours"
                id={id + "-hours"}
                value={limb.hours}
                onChange={(e) => update({ hours: e.target.valueAsNumber })}
              />
              <Input
                type="number"
                min={0}
                max={59}
                placeholder="minutes"
                id={id + "-minutes"}
                value={limb.minutes}
                onChange={(e) => update({ minutes: e.target.valueAsNumber })}
              />
              <Input
                type="number"
                min={0}
                max={59}
                placeholder="seconds"
                id={id + "-seconds"}
                value={limb.seconds}
                onChange={(e) => update({ seconds: e.target.valueAsNumber })}
              />
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default Dropsets
