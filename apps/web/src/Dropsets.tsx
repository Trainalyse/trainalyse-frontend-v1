import React from "react"
import { type ChangeEvent } from "react"
import { Input } from "@workspace/ui/components/input"
import { type ExerciseType } from "./data/exercise"
import { type Difficulty } from "./Set"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"

interface DropsetsProps {
  exerciseType: ExerciseType | ""
  isBodyweight: boolean
  difficulty: Difficulty
}

function Dropsets({ exerciseType, isBodyweight, difficulty }: DropsetsProps) {
  const [weights, setWeights] = React.useState<number>()
  const [reps, setReps] = React.useState<number>()
  const [minutes, setMinutes] = React.useState<number>()
  const [seconds, setSeconds] = React.useState<number>()
  const [hours, setHours] = React.useState<number>()

  function handleWeightsChange(e: ChangeEvent<HTMLInputElement>) {
    setWeights(e.target.valueAsNumber)
  }

  function handleRepsChange(e: ChangeEvent<HTMLInputElement>) {
    setReps(e.target.valueAsNumber)
  }

  return (
    <>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          {exerciseType === "weightsAndReps" && !isBodyweight && (
            <>
              <Input
                type="number"
                placeholder="enter the weights"
                value={weights}
                onChange={handleWeightsChange}
              />
              <Input
                type="number"
                placeholder="enter the reps"
                value={reps}
                onChange={handleRepsChange}
              />
            </>
          )}
          {exerciseType === "duration" && isBodyweight && (
            <>
              {difficulty === "assisted" && (
                <>
                  <Input
                    type="number"
                    placeholder="enter the assisted weights"
                    value={weights}
                    onChange={handleWeightsChange}
                  />
                </>
              )}
              {difficulty === "weighted" && (
                <>
                  <Input
                    type="number"
                    placeholder="enter the extra weights"
                    value={weights}
                    onChange={handleWeightsChange}
                  />
                </>
              )}

              <Input
                type="number"
                min={0}
                max={24}
                placeholder="hours"
                value={hours}
                onChange={(e) => setHours(e.target.valueAsNumber)}
              />
              <Input
                type="number"
                min={0}
                max={59}
                placeholder="minutes"
                value={minutes}
                onChange={(e) => setMinutes(e.target.valueAsNumber)}
              />
              <Input
                type="number"
                min={0}
                max={59}
                placeholder="seconds"
                value={seconds}
                onChange={(e) => setSeconds(e.target.valueAsNumber)}
              />
            </>
          )}
          {exerciseType === "weightsAndReps" && isBodyweight && (
            <>
              {difficulty === "normal" && (
                <Input
                  type="number"
                  placeholder="enter the reps"
                  value={reps}
                  onChange={handleRepsChange}
                />
              )}
              {difficulty === "assisted" && (
                <>
                  <Input
                    type="number"
                    placeholder="enter the assisted weights"
                    value={weights}
                    onChange={handleWeightsChange}
                  />
                  <Input
                    type="number"
                    placeholder="enter the reps"
                    value={reps}
                    onChange={handleRepsChange}
                  />
                </>
              )}
              {difficulty === "weighted" && (
                <>
                  <Input
                    type="number"
                    placeholder="enter the extra weights"
                    value={weights}
                    onChange={handleWeightsChange}
                  />
                  <Input
                    type="number"
                    placeholder="enter the reps"
                    value={reps}
                    onChange={handleRepsChange}
                  />
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default Dropsets
