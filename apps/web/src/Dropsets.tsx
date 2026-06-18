import React from "react"
import { type ChangeEvent } from "react"
import { Input } from "@workspace/ui/components/input"
import { type ExerciseType } from "./data/exercise"
import { type Difficulty } from "./Set"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

interface DropsetsProps {
  exerciseType: ExerciseType | ""
  isBodyweight: boolean
}

function Dropsets({ exerciseType, isBodyweight }: DropsetsProps) {
  const [weights, setWeights] = React.useState<number>()
  const [reps, setReps] = React.useState<number>()
  const [minutes, setMinutes] = React.useState<number>()
  const [seconds, setSeconds] = React.useState<number>()
  const [hours, setHours] = React.useState<number>()
  const [difficulty, setDifficulty] = React.useState<Difficulty>("normal")
  const id = React.useId()

  function handleWeightsChange(e: ChangeEvent<HTMLInputElement>) {
    setWeights(e.target.valueAsNumber)
  }

  function handleRepsChange(e: ChangeEvent<HTMLInputElement>) {
    setReps(e.target.valueAsNumber)
  }

  const difficultySelect = (
    <Select
      value={difficulty}
      onValueChange={(value) => setDifficulty(value as Difficulty)}
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
                value={weights}
                onChange={handleWeightsChange}
              />
              <Input
                type="number"
                placeholder="enter the reps"
                id={id + "-reps"}
                value={reps}
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
                  id={id + "-weight"}
                  value={weights}
                  onChange={handleWeightsChange}
                />
              )}
              {difficulty === "weighted" && (
                <Input
                  type="number"
                  placeholder="enter the extra weights"
                  id={id + "-weight"}
                  value={weights}
                  onChange={handleWeightsChange}
                />
              )}

              <Input
                type="number"
                min={0}
                max={24}
                placeholder="hours"
                id={id + "-hours"}
                value={hours}
                onChange={(e) => setHours(e.target.valueAsNumber)}
              />
              <Input
                type="number"
                min={0}
                max={59}
                placeholder="minutes"
                id={id + "-minutes"}
                value={minutes}
                onChange={(e) => setMinutes(e.target.valueAsNumber)}
              />
              <Input
                type="number"
                min={0}
                max={59}
                placeholder="seconds"
                id={id + "-seconds"}
                value={seconds}
                onChange={(e) => setSeconds(e.target.valueAsNumber)}
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
                  value={reps}
                  onChange={handleRepsChange}
                />
              )}
              {difficulty === "assisted" && (
                <>
                  <Input
                    type="number"
                    placeholder="enter the assisted weights"
                    id={id + "-weight"}
                    value={weights}
                    onChange={handleWeightsChange}
                  />
                  <Input
                    type="number"
                    placeholder="enter the reps"
                    id={id + "-reps"}
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
                    id={id + "-weight"}
                    value={weights}
                    onChange={handleWeightsChange}
                  />
                  <Input
                    type="number"
                    placeholder="enter the reps"
                    id={id + "-reps"}
                    value={reps}
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
                min={0}
                max={24}
                placeholder="hours"
                id={id + "-hours"}
                value={hours}
                onChange={(e) => setHours(e.target.valueAsNumber)}
              />
              <Input
                type="number"
                min={0}
                max={59}
                placeholder="minutes"
                id={id + "-minutes"}
                value={minutes}
                onChange={(e) => setMinutes(e.target.valueAsNumber)}
              />
              <Input
                type="number"
                min={0}
                max={59}
                placeholder="seconds"
                id={id + "-seconds"}
                value={seconds}
                onChange={(e) => setSeconds(e.target.valueAsNumber)}
              />
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default Dropsets
