import { exercises } from "./data/exercise"
import React from "react"
import { Input } from "@workspace/ui/components/input"
import { type ChangeEvent } from "react"
import { Button } from "@workspace/ui/components/button"
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
} from "@workspace/ui/components/select"
import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
  type ChartConfig,
} from "@workspace/ui/components/chart"
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
    volume: { label: "Volume", color: "var(--chart-1)" },
  } satisfies ChartConfig
  const chartConfigForMaxWeight = {
    maxWeight: { label: "Max Weight", color: "var(--chart-1)" },
  } satisfies ChartConfig
  const chartConfigForTotalReps = {
    totalReps: { label: "Total Reps", color: "var(--chart-1)" },
  } satisfies ChartConfig
  const chartConfigForMaxAssistedWeight = {
    maxAssistedWeight: {
      label: "Max Assisted Weight",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig
  const chartConfigForMaxExtraWeight = {
    maxExtraWeight: { label: "Max Extra Weight", color: "var(--chart-1)" },
  } satisfies ChartConfig
  const chartConfigForEndurance = {
    endurance: { label: "Endurance", color: "var(--chart-1)" },
  } satisfies ChartConfig
  const chartConfigForEnduranceMaxWeight = {
    maxEnduranceWeight: { label: "Max End Weight", color: "var(--chart-1)" },
  } satisfies ChartConfig
  const chartConfigForTotalSeconds = {
    totalSeconds: { label: "Total Seconds", color: "var(--chart-1)" },
  } satisfies ChartConfig
  const chartConfigForMaxEnduranceAssistedWeight = {
    maxEnduranceAssistedWeight: {
      label: "Max End Assisted Weight",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig
  const chartConfigForMaxEnduranceExtraWeight = {
    maxEnduranceExtraWeight: {
      label: "Max End Extra Weight",
      color: "var(--chart-1)",
    },
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
            className="min-h-[300px] w-full"
          >
            <LineChart data={volumeData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Line dataKey="volume" stroke="var(--color-volume)" />
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
              className="min-h-[300px] w-full"
            >
              <LineChart data={maxWeightData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line dataKey="maxWeight" stroke="var(--color-maxWeight)" />
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
              className="min-h-[300px] w-full"
            >
              <LineChart data={totalRepsData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line dataKey="totalReps" stroke="var(--color-totalReps)" />
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
              className="min-h-[300px] w-full"
            >
              <LineChart data={maxAssistedWeightData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line
                  dataKey="maxAssistedWeight"
                  stroke="var(--color-maxAssistedWeight)"
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
              className="min-h-[300px] w-full"
            >
              <LineChart data={maxExtraWeightData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line
                  dataKey="maxExtraWeight"
                  stroke="var(--color-maxExtraWeight)"
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
            className="min-h-[300px] w-full"
          >
            <LineChart data={enduranceData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Line dataKey="endurance" stroke="var(--color-endurance)" />
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
              className="min-h-[300px] w-full"
            >
              <LineChart data={maxEnduranceWeightData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line
                  dataKey="maxEnduranceWeight"
                  stroke="var(--color-maxEnduranceWeight)"
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
              className="min-h-[300px] w-full"
            >
              <LineChart data={totalSecondsData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line
                  dataKey="totalSeconds"
                  stroke="var(--color-totalSeconds)"
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
              className="min-h-[300px] w-full"
            >
              <LineChart data={maxEnduranceAssistedWeightData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line
                  dataKey="maxEnduranceAssistedWeight"
                  stroke="var(--color-maxEnduranceAssistedWeight)"
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
              className="min-h-[300px] w-full"
            >
              <LineChart data={maxEnduranceExtraWeightData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line
                  dataKey="maxEnduranceExtraWeight"
                  stroke="var(--color-maxEnduranceExtraWeight)"
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
