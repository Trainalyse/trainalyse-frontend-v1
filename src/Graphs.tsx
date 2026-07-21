import { exercises } from "./data/exercise"
import React from "react"
import { Input } from "@/components/ui/input"
import { type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { type ExerciseType } from "./data/exercise"
import { instanceVolume } from "./data/calculations"
import { instanceMaxWeight } from "./data/calculations"
import { instanceTotalReps } from "./data/calculations"
import { instanceMaxAssistedWeight } from "./data/calculations"
import { instanceMaxExtraWeight } from "./data/calculations"
import { instanceEndurance } from "./data/calculations"
import { instanceEnduranceMaxWeight } from "./data/calculations"
import { instanceTotalSeconds } from "./data/calculations"
import { instanceEnduranceMaxAssistedWeight } from "./data/calculations"
import { instanceEnduranceMaxExtraWeight } from "./data/calculations"
import { type Difficulty } from "./data/workouts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis } from "recharts"

function Graphs() {
  const [exerciseSearch, setExerciseSearch] = React.useState("")
  const matchedExercises = exercises.filter((e) =>
    e.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  )
  const [selectedExercise, setSelectedExercise] = React.useState("")
  const [selectedExerciseType, setSelectedExerciseType] = React.useState<
    ExerciseType | ""
  >("")
  const [selectedExerciseIsBodyweight, setSelectedExerciseIsBodyweight] =
    React.useState(false)
  const [selectedExerciseDifficulty, setSelectedExerciseDifficulty] =
    React.useState<Difficulty | "">("normal")
  const volumeData = instanceVolume(selectedExercise)
  const maxWeightData = instanceMaxWeight(selectedExercise)
  const totalRepsData = instanceTotalReps(selectedExercise)
  const maxAssistedWeightData = instanceMaxAssistedWeight(selectedExercise)
  const maxExtraWeightData = instanceMaxExtraWeight(selectedExercise)
  const enduranceData = instanceEndurance(selectedExercise)
  const totalSecondsData = instanceTotalSeconds(selectedExercise)
  const maxEnduranceWeightData = instanceEnduranceMaxWeight(selectedExercise)
  const maxEnduranceAssistedWeightData =
    instanceEnduranceMaxAssistedWeight(selectedExercise)
  const maxEnduranceExtraWeightData =
    instanceEnduranceMaxExtraWeight(selectedExercise)
  const chartConfigForVolume = {
    volume: { label: "Total", color: "var(--chart-1)" },
    volumeLeft: { label: "Left", color: "var(--chart-2)" },
    volumeRight: { label: "Right", color: "var(--chart-3)" },
  } satisfies ChartConfig
  const chartConfigForMaxWeight = {
    maxWeight: { label: "Max Weight", color: "var(--chart-1)" },
    maxWeightLeft: { label: "Left", color: "var(--chart-2)" },
    maxWeightRight: { label: "Right", color: "var(--chart-3)" },
  } satisfies ChartConfig
  const chartConfigForTotalReps = {
    totalReps: { label: "Total Reps", color: "var(--chart-1)" },
    totalRepsLeft: { label: "Left", color: "var(--chart-2)" },
    totalRepsRight: { label: "Right", color: "var(--chart-3)" },
  } satisfies ChartConfig
  const chartConfigForMaxAssistedWeight = {
    maxAssistedWeight: { label: "Max Assisted Weight", color: "var(--chart-1)" },
    maxAssistedWeightLeft: { label: "Left", color: "var(--chart-2)" },
    maxAssistedWeightRight: { label: "Right", color: "var(--chart-3)" },
  } satisfies ChartConfig
  const chartConfigForMaxExtraWeight = {
    maxExtraWeight: { label: "Max Extra Weight", color: "var(--chart-1)" },
    maxExtraWeightLeft: { label: "Left", color: "var(--chart-2)" },
    maxExtraWeightRight: { label: "Right", color: "var(--chart-3)" },
  } satisfies ChartConfig
  const chartConfigForEndurance = {
    endurance: { label: "Endurance", color: "var(--chart-1)" },
    enduranceLeft: { label: "Left", color: "var(--chart-2)" },
    enduranceRight: { label: "Right", color: "var(--chart-3)" },
  } satisfies ChartConfig
  const chartConfigForEnduranceMaxWeight = {
    maxEnduranceWeight: { label: "Max End Weight", color: "var(--chart-1)" },
    maxEnduranceWeightLeft: { label: "Left", color: "var(--chart-2)" },
    maxEnduranceWeightRight: { label: "Right", color: "var(--chart-3)" },
  } satisfies ChartConfig
  const chartConfigForTotalSeconds = {
    totalSeconds: { label: "Total Seconds", color: "var(--chart-1)" },
    totalSecondsLeft: { label: "Left", color: "var(--chart-2)" },
    totalSecondsRight: { label: "Right", color: "var(--chart-3)" },
  } satisfies ChartConfig
  const chartConfigForMaxEnduranceAssistedWeight = {
    maxEnduranceAssistedWeight: {
      label: "Max End Assisted Weight",
      color: "var(--chart-1)",
    },
    maxEnduranceAssistedWeightLeft: { label: "Left", color: "var(--chart-2)" },
    maxEnduranceAssistedWeightRight: { label: "Right", color: "var(--chart-3)" },
  } satisfies ChartConfig
  const chartConfigForMaxEnduranceExtraWeight = {
    maxEnduranceExtraWeight: {
      label: "Max End Extra Weight",
      color: "var(--chart-1)",
    },
    maxEnduranceExtraWeightLeft: { label: "Left", color: "var(--chart-2)" },
    maxEnduranceExtraWeightRight: { label: "Right", color: "var(--chart-3)" },
  } satisfies ChartConfig
  const difficultySelect = (
    <Select
      value={selectedExerciseDifficulty}
      onValueChange={(value) =>
        setSelectedExerciseDifficulty(value as Difficulty)
      }
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
  function handleExerciseSearch(e: ChangeEvent<HTMLInputElement>) {
    setExerciseSearch(e.target.value)
  }

  return (
    <>
      <Input
        type="text"
        placeholder="Search your exercise"
        value={exerciseSearch}
        onChange={handleExerciseSearch}
      />
      {exerciseSearch &&
        matchedExercises.map((exercise) => (
          <Button
            key={exercise.id}
            onClick={() => {
              setSelectedExercise(exercise.name)
              setSelectedExerciseType(exercise.type)
              setSelectedExerciseIsBodyweight(exercise.isBodyweight)
            }}
          >
            {exercise.name}
          </Button>
        ))}
      <p>{selectedExercise}</p>
      {selectedExercise && selectedExerciseType === "weightsAndReps" && (
        <>
          <ChartContainer
            config={chartConfigForVolume}
            className="min-h-75 w-full"
          >
            <LineChart data={volumeData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Line dataKey="volume" stroke="var(--color-volume)" />
              <Line dataKey="volumeLeft" stroke="var(--color-volumeLeft)" />
              <Line dataKey="volumeRight" stroke="var(--color-volumeRight)" />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
        </>
      )}
      {selectedExercise &&
        selectedExerciseType === "weightsAndReps" &&
        !selectedExerciseIsBodyweight && (
          <>
            <ChartContainer
              config={chartConfigForMaxWeight}
              className="min-h-75 w-full"
            >
              <LineChart data={maxWeightData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line dataKey="maxWeight" stroke="var(--color-maxWeight)" />
                <Line dataKey="maxWeightLeft" stroke="var(--color-maxWeightLeft)" />
                <Line dataKey="maxWeightRight" stroke="var(--color-maxWeightRight)" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </>
        )}
      {selectedExercise &&
        selectedExerciseType === "weightsAndReps" &&
        selectedExerciseIsBodyweight && <>{difficultySelect}</>}
      {selectedExercise &&
        selectedExerciseType === "weightsAndReps" &&
        selectedExerciseIsBodyweight &&
        selectedExerciseDifficulty === "normal" && (
          <>
            <ChartContainer
              config={chartConfigForTotalReps}
              className="min-h-75 w-full"
            >
              <LineChart data={totalRepsData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line dataKey="totalReps" stroke="var(--color-totalReps)" />
                <Line dataKey="totalRepsLeft" stroke="var(--color-totalRepsLeft)" />
                <Line dataKey="totalRepsRight" stroke="var(--color-totalRepsRight)" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </>
        )}
      {selectedExercise &&
        selectedExerciseType === "weightsAndReps" &&
        selectedExerciseIsBodyweight &&
        selectedExerciseDifficulty === "assisted" && (
          <>
            <ChartContainer
              config={chartConfigForMaxAssistedWeight}
              className="min-h-75 w-full"
            >
              <LineChart data={maxAssistedWeightData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line
                  dataKey="maxAssistedWeight"
                  stroke="var(--color-maxAssistedWeight)"
                />
                <Line
                  dataKey="maxAssistedWeightLeft"
                  stroke="var(--color-maxAssistedWeightLeft)"
                />
                <Line
                  dataKey="maxAssistedWeightRight"
                  stroke="var(--color-maxAssistedWeightRight)"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </>
        )}
      {selectedExercise &&
        selectedExerciseType === "weightsAndReps" &&
        selectedExerciseIsBodyweight &&
        selectedExerciseDifficulty === "weighted" && (
          <>
            <ChartContainer
              config={chartConfigForMaxExtraWeight}
              className="min-h-75 w-full"
            >
              <LineChart data={maxExtraWeightData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line
                  dataKey="maxExtraWeight"
                  stroke="var(--color-maxExtraWeight)"
                />
                <Line
                  dataKey="maxExtraWeightLeft"
                  stroke="var(--color-maxExtraWeightLeft)"
                />
                <Line
                  dataKey="maxExtraWeightRight"
                  stroke="var(--color-maxExtraWeightRight)"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </>
        )}
      {selectedExercise && selectedExerciseType === "duration" && (
        <>
          <ChartContainer
            config={chartConfigForEndurance}
            className="min-h-75 w-full"
          >
            <LineChart data={enduranceData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Line dataKey="endurance" stroke="var(--color-endurance)" />
              <Line dataKey="enduranceLeft" stroke="var(--color-enduranceLeft)" />
              <Line dataKey="enduranceRight" stroke="var(--color-enduranceRight)" />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
        </>
      )}
      {selectedExercise &&
        selectedExerciseType === "duration" &&
        !selectedExerciseIsBodyweight && (
          <>
            <ChartContainer
              config={chartConfigForEnduranceMaxWeight}
              className="min-h-75 w-full"
            >
              <LineChart data={maxEnduranceWeightData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line
                  dataKey="maxEnduranceWeight"
                  stroke="var(--color-maxEnduranceWeight)"
                />
                <Line
                  dataKey="maxEnduranceWeightLeft"
                  stroke="var(--color-maxEnduranceWeightLeft)"
                />
                <Line
                  dataKey="maxEnduranceWeightRight"
                  stroke="var(--color-maxEnduranceWeightRight)"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </>
        )}
      {selectedExercise &&
        selectedExerciseType === "duration" &&
        selectedExerciseIsBodyweight && <>{difficultySelect}</>}
      {selectedExercise &&
        selectedExerciseType === "duration" &&
        selectedExerciseIsBodyweight &&
        selectedExerciseDifficulty === "normal" && (
          <>
            <ChartContainer
              config={chartConfigForTotalSeconds}
              className="min-h-75 w-full"
            >
              <LineChart data={totalSecondsData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line
                  dataKey="totalSeconds"
                  stroke="var(--color-totalSeconds)"
                />
                <Line
                  dataKey="totalSecondsLeft"
                  stroke="var(--color-totalSecondsLeft)"
                />
                <Line
                  dataKey="totalSecondsRight"
                  stroke="var(--color-totalSecondsRight)"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </>
        )}
      {selectedExercise &&
        selectedExerciseType === "duration" &&
        selectedExerciseIsBodyweight &&
        selectedExerciseDifficulty === "assisted" && (
          <>
            <ChartContainer
              config={chartConfigForMaxEnduranceAssistedWeight}
              className="min-h-75 w-full"
            >
              <LineChart data={maxEnduranceAssistedWeightData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line
                  dataKey="maxEnduranceAssistedWeight"
                  stroke="var(--color-maxEnduranceAssistedWeight)"
                />
                <Line
                  dataKey="maxEnduranceAssistedWeightLeft"
                  stroke="var(--color-maxEnduranceAssistedWeightLeft)"
                />
                <Line
                  dataKey="maxEnduranceAssistedWeightRight"
                  stroke="var(--color-maxEnduranceAssistedWeightRight)"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </>
        )}
      {selectedExercise &&
        selectedExerciseType === "duration" &&
        selectedExerciseIsBodyweight &&
        selectedExerciseDifficulty === "weighted" && (
          <>
            <ChartContainer
              config={chartConfigForMaxEnduranceExtraWeight}
              className="min-h-75 w-full"
            >
              <LineChart data={maxEnduranceExtraWeightData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line
                  dataKey="maxEnduranceExtraWeight"
                  stroke="var(--color-maxEnduranceExtraWeight)"
                />
                <Line
                  dataKey="maxEnduranceExtraWeightLeft"
                  stroke="var(--color-maxEnduranceExtraWeightLeft)"
                />
                <Line
                  dataKey="maxEnduranceExtraWeightRight"
                  stroke="var(--color-maxEnduranceExtraWeightRight)"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </>
        )}
    </>
  )
}

export default Graphs
