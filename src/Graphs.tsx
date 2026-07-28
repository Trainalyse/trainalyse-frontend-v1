import { exercises } from "./data/exercise"
import React from "react"
import { Input } from "@/components/ui/input"
import { type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { type ExerciseType } from "./data/exercise"
import { instanceVolume } from "./data/calculations"
import { instanceMaxWeight } from "./data/calculations"
import { instanceMaxAssistedWeight } from "./data/calculations"
import { instanceMaxExtraWeight } from "./data/calculations"
import { instanceEndurance } from "./data/calculations"
import { getExerciseInstance } from "./data/calculations"
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
  // starts empty so the dropdown shows its placeholder - "normal" is no longer
  // an option in the list, so it cant be the default anymore
  const [selectedExerciseDifficulty, setSelectedExerciseDifficulty] =
    React.useState<Difficulty | "">("")
  // the three max-* datasets are shared by both exercise types - the duration
  // charts below reuse them instead of having their own endurance copies
  const volumeData = instanceVolume(selectedExercise)
  const maxWeightData = instanceMaxWeight(selectedExercise)
  const maxAssistedWeightData = instanceMaxAssistedWeight(selectedExercise)
  const maxExtraWeightData = instanceMaxExtraWeight(selectedExercise)
  const enduranceData = instanceEndurance(selectedExercise)
  // no logged workouts for this exercise = show a message instead of empty charts
  const hasInstances = getExerciseInstance(selectedExercise).length > 0
  const showCharts = selectedExercise !== "" && hasInstances

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
  // shared axis-label bits so every chart lines up the same way
  const chartMargin = { top: 5, right: 10, left: 10, bottom: 20 }
  const xAxisLabel = { value: "Date", position: "insideBottom" as const, offset: -10 }
  const yAxisLabel = (value: string) => ({
    value,
    angle: -90 as const,
    position: "insideLeft" as const,
    style: { textAnchor: "middle" as const },
  })
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
              // without this the difficulty carries over from the last exercise
              setSelectedExerciseDifficulty("")
              // closes the results list, otherwise it stays open above the charts
              setExerciseSearch("")
            }}
          >
            {exercise.name}
          </Button>
        ))}
      <p>{selectedExercise}</p>
      {selectedExercise && !hasInstances && (
        <p>You have not done this exercise yet.</p>
      )}
      {showCharts && selectedExerciseType === "weightsAndReps" && (
        <>
          <h3 className="text-sm font-medium">Volume</h3>
          <ChartContainer
            config={chartConfigForVolume}
            className="min-h-75 w-full"
          >
            <LineChart data={volumeData} margin={chartMargin}>
              <XAxis dataKey="label" label={xAxisLabel} />
              <YAxis label={yAxisLabel("Volume")} />
              <Line dataKey="volume" stroke="var(--color-volume)" />
              <Line dataKey="volumeLeft" stroke="var(--color-volumeLeft)" />
              <Line dataKey="volumeRight" stroke="var(--color-volumeRight)" />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
        </>
      )}
      {showCharts &&
        selectedExerciseType === "weightsAndReps" &&
        !selectedExerciseIsBodyweight && (
          <>
            <h3 className="text-sm font-medium">Max Weight</h3>
            <ChartContainer
              config={chartConfigForMaxWeight}
              className="min-h-75 w-full"
            >
              <LineChart data={maxWeightData} margin={chartMargin}>
                <XAxis dataKey="label" label={xAxisLabel} />
                <YAxis label={yAxisLabel("Weight")} />
                <Line dataKey="maxWeight" stroke="var(--color-maxWeight)" />
                <Line dataKey="maxWeightLeft" stroke="var(--color-maxWeightLeft)" />
                <Line dataKey="maxWeightRight" stroke="var(--color-maxWeightRight)" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </>
        )}
      {showCharts &&
        selectedExerciseType === "weightsAndReps" &&
        selectedExerciseIsBodyweight && <>{difficultySelect}</>}
      {showCharts &&
        selectedExerciseType === "weightsAndReps" &&
        selectedExerciseIsBodyweight &&
        selectedExerciseDifficulty === "assisted" && (
          <>
            <h3 className="text-sm font-medium">Max Assisted Weight</h3>
            <ChartContainer
              config={chartConfigForMaxAssistedWeight}
              className="min-h-75 w-full"
            >
              <LineChart data={maxAssistedWeightData} margin={chartMargin}>
                <XAxis dataKey="label" label={xAxisLabel} />
                <YAxis label={yAxisLabel("Max Assisted Weight")} />
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
      {showCharts &&
        selectedExerciseType === "weightsAndReps" &&
        selectedExerciseIsBodyweight &&
        selectedExerciseDifficulty === "weighted" && (
          <>
            <h3 className="text-sm font-medium">Max Extra Weight</h3>
            <ChartContainer
              config={chartConfigForMaxExtraWeight}
              className="min-h-75 w-full"
            >
              <LineChart data={maxExtraWeightData} margin={chartMargin}>
                <XAxis dataKey="label" label={xAxisLabel} />
                <YAxis label={yAxisLabel("Max Extra Weight")} />
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
      {showCharts && selectedExerciseType === "duration" && (
        <>
          <h3 className="text-sm font-medium">Endurance</h3>
          <ChartContainer
            config={chartConfigForEndurance}
            className="min-h-75 w-full"
          >
            <LineChart data={enduranceData} margin={chartMargin}>
              <XAxis dataKey="label" label={xAxisLabel} />
              <YAxis label={yAxisLabel("Endurance")} />
              <Line dataKey="endurance" stroke="var(--color-endurance)" />
              <Line dataKey="enduranceLeft" stroke="var(--color-enduranceLeft)" />
              <Line dataKey="enduranceRight" stroke="var(--color-enduranceRight)" />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
        </>
      )}
      {showCharts &&
        selectedExerciseType === "duration" &&
        !selectedExerciseIsBodyweight && (
          <>
            <h3 className="text-sm font-medium">Max Weight</h3>
            <ChartContainer
              config={chartConfigForMaxWeight}
              className="min-h-75 w-full"
            >
              <LineChart data={maxWeightData} margin={chartMargin}>
                <XAxis dataKey="label" label={xAxisLabel} />
                <YAxis label={yAxisLabel("Weight")} />
                <Line dataKey="maxWeight" stroke="var(--color-maxWeight)" />
                <Line dataKey="maxWeightLeft" stroke="var(--color-maxWeightLeft)" />
                <Line dataKey="maxWeightRight" stroke="var(--color-maxWeightRight)" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </>
        )}
      {showCharts &&
        selectedExerciseType === "duration" &&
        selectedExerciseIsBodyweight && <>{difficultySelect}</>}
      {showCharts &&
        selectedExerciseType === "duration" &&
        selectedExerciseIsBodyweight &&
        selectedExerciseDifficulty === "assisted" && (
          <>
            <h3 className="text-sm font-medium">Max Assisted Weight</h3>
            <ChartContainer
              config={chartConfigForMaxAssistedWeight}
              className="min-h-75 w-full"
            >
              <LineChart data={maxAssistedWeightData} margin={chartMargin}>
                <XAxis dataKey="label" label={xAxisLabel} />
                <YAxis label={yAxisLabel("Max Assisted Weight")} />
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
      {showCharts &&
        selectedExerciseType === "duration" &&
        selectedExerciseIsBodyweight &&
        selectedExerciseDifficulty === "weighted" && (
          <>
            <h3 className="text-sm font-medium">Max Extra Weight</h3>
            <ChartContainer
              config={chartConfigForMaxExtraWeight}
              className="min-h-75 w-full"
            >
              <LineChart data={maxExtraWeightData} margin={chartMargin}>
                <XAxis dataKey="label" label={xAxisLabel} />
                <YAxis label={yAxisLabel("Max Extra Weight")} />
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
    </>
  )
}

export default Graphs
