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
import {
  LineChart,
  ComposedChart,
  Area,
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
  type YAxisTickContentProps,
} from "recharts"
import { ChartLine } from "lucide-react"

// a per-limb exercise leaves the total key undefined on every point (and vice
// versa), so pull out just the points this key actually has before comparing
function numericSeries(data: Array<Record<string, unknown>>, key: string) {
  return data
    .map((point) => point[key])
    .filter((value): value is number => typeof value === "number")
}

function latestValue(data: Array<Record<string, unknown>>, key: string) {
  return numericSeries(data, key).at(-1)
}

// percent change from the first logged session to the latest. undefined when
// theres nothing to compare against yet, or when the first session was 0 and
// the percentage would divide by zero
function percentFromFirst(data: Array<Record<string, unknown>>, key: string) {
  const series = numericSeries(data, key)
  if (series.length < 2) return undefined
  const first = series[0]
  if (first === 0) return undefined
  return ((series[series.length - 1] - first) / first) * 100
}

function formatMetric(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 1 })
}

// "9 June, 2026, 9:00 AM" -> "9 Jun". only the axis is shortened - the tooltip
// still shows the full label, which is where the exact date belongs
function shortDate(label: string) {
  const [day, month] = label.split(",")[0].split(" ")
  return month ? `${day} ${month.slice(0, 3)}` : label
}

// recharts right-anchors y ticks inside the gutter, which leaves them floating
// short of the card edge. drawing at x=0 lines them up with the title and value
function renderYTick({ y, payload }: YAxisTickContentProps) {
  return (
    <text
      x={0}
      y={y}
      dy={4}
      textAnchor="start"
      fontSize={11}
      fill="var(--text-subheading)"
    >
      {Number(payload.value).toLocaleString("en-US")}
    </text>
  )
}


// one metric = one card: title on top, the current value under it, then the
// chart. every chart block on the page is one of these.
function MetricCard({
  title,
  value,
  unit,
  trend,
  children,
}: {
  title: string
  value: number | undefined
  unit: string
  trend?: number
  children: React.ReactNode
}) {
  const gained = trend !== undefined && trend >= 0
  return (
    <div className="flex flex-col gap-[var(--space-sm)] rounded-[var(--radius-card)] border border-[var(--border-cardEdge)] bg-[var(--bg-surface-primary)] p-[var(--space-lg)]">
      <div className="flex items-baseline justify-between gap-[var(--space-sm)]">
        <span className="text-[length:var(--size-label)] leading-[var(--lh-label)] [font-weight:var(--fw-medium)] text-[var(--text-primary)]">
          {title}
        </span>
        {/* only meaningful once theres a second session to compare against */}
        {trend !== undefined && (
          <span
            className={
              gained
                ? "whitespace-nowrap text-[length:var(--size-footer)] leading-[var(--lh-footer)] text-[var(--text-accent)]"
                : "whitespace-nowrap text-[length:var(--size-footer)] leading-[var(--lh-footer)] text-[var(--text-subheading)]"
            }
          >
            {gained ? "▲" : "▼"} {Math.abs(Math.round(trend))}% from first
          </span>
        )}
      </div>
      {value !== undefined && (
        <div className="flex items-baseline gap-[var(--space-xs)]">
          <span className="text-[length:var(--size-metric)] leading-[var(--lh-metric)] [font-weight:var(--fw-bold)] tabular-nums text-[var(--text-primary)]">
            {formatMetric(value)}
          </span>
          <span className="text-[length:var(--size-footer)] leading-[var(--lh-footer)] text-[var(--text-subheading)]">
            {unit}
          </span>
        </div>
      )}
      {children}
    </div>
  )
}

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
  const sessionCount = getExerciseInstance(selectedExercise).length
  const hasInstances = sessionCount > 0
  const showCharts = selectedExercise !== "" && hasInstances
  // the three search states are mutually exclusive - matches, no matches, or
  // nothing typed yet (which is the only time the landing box belongs on screen)
  const isSearching = exerciseSearch !== ""
  const showResults = isSearching && matchedExercises.length > 0
  const showNoMatch = isSearching && matchedExercises.length === 0

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
  // zero side margins so the plot spans the full width between the cards padding
  const cardChartMargin = { top: 6, right: 0, left: 0, bottom: 0 }
  // dashed horizontals only - vertical rules would fight the data lines
  const cardChartGrid = {
    vertical: false,
    stroke: "var(--border-cardEdge)",
    strokeDasharray: "2 4",
  }
  // the tick renderers position their own text, so recharts own offsets are off
  const cardChartAxis = { tickLine: false, axisLine: false, tickSize: 0 }
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
    // no mx-auto/max-w here - Layout already gives us the centered 430px column,
    // and an auto side margin would override the parents stretch and shrink this
    // to fit-content
    <div className="flex flex-col px-[var(--space-23)] py-[var(--space-lg)] gap-[var(--space-md)]">
      {/* the bang on the background is load-bearing - the Input component ships
          dark:bg-input/30, which tailwind sorts after this and would otherwise win */}
      <Input
        type="text"
        placeholder="Search your exercise"
        value={exerciseSearch}
        onChange={handleExerciseSearch}
        className="h-11 rounded-[var(--radius-input)] border-[var(--border-inputEdge)] bg-[var(--bg-inputBox)]! px-[var(--space-md)] text-[length:var(--size-placeholder)] placeholder:text-[var(--text-placeholder)]"
      />
      {/* the results are their own group so they sit tight against each other
          instead of picking up the frame's 12px gap between every row */}
      {showResults && (
        <div className="flex flex-col">
          {matchedExercises.map((exercise) => (
            <Button
              key={exercise.id}
              variant="ghost"
              className="h-11 justify-start px-[var(--space-md)] text-[length:var(--size-primaryText)] [font-weight:var(--fw-regular)] text-[var(--text-subheading)]"
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
        </div>
      )}
      {/* padded to line up with the result rows, so the text lands where the
          first match would have been */}
      {showNoMatch && (
        <p className="px-[var(--space-md)] text-[length:var(--size-footer)] leading-[var(--lh-footer)] [font-weight:var(--fw-regular)] text-[var(--text-subheading)]">
          There are no exercises with this name.
        </p>
      )}
      {/* landing state - nothing picked yet, so the charts have nothing to draw.
          hidden the moment they start typing, so the box never sits under the
          results list or the no-match line */}
      {!selectedExercise && !isSearching && (
        <div className="flex flex-col items-center text-center gap-[var(--space-md)] rounded-[var(--radius-card)] border border-dashed border-[var(--border-cardEdge)] px-[var(--space-2xl)] py-[var(--space-3xl)]">
          <ChartLine
            size={40}
            strokeWidth={1.4}
            className="text-[var(--text-subheading)]"
          />
          <div className="flex flex-col gap-[var(--space-xs)]">
            <span className="text-[length:var(--size-primaryText)] leading-[var(--lh-primaryText)] [font-weight:var(--fw-medium)] text-[var(--text-primary)]">
              No exercise selected
            </span>
            {/* footer pair, not the label pair - this wraps, and --lh-label has no leading */}
            <span className="text-[length:var(--size-footer)] leading-[var(--lh-footer)] [font-weight:var(--fw-regular)] text-[var(--text-subheading)]">
              Search an exercise above to see your volume, weight and endurance
              over time.
            </span>
          </div>
        </div>
      )}
      {/* baseline-aligned so the name and the count sit on the same line even
          though theyre different sizes */}
      {selectedExercise && (
        <div className="flex items-baseline justify-between">
          <span className="text-[length:var(--size-h2)] leading-[var(--lh-h2)] [font-weight:var(--fw-bold)] text-[var(--text-primary)]">
            {selectedExercise}
          </span>
          <span className="text-[length:var(--size-footer)] leading-[var(--lh-footer)] [font-weight:var(--fw-regular)] text-[var(--text-subheading)]">
            {sessionCount} {sessionCount === 1 ? "session" : "sessions"}
          </span>
        </div>
      )}
      {selectedExercise && !hasInstances && (
        <p>You have not done this exercise yet.</p>
      )}
      {/* volume and endurance are the only charts that differ by exercise type.
          everything below them depends on bodyweight/difficulty instead, so the
          type check would tell us nothing and is left out. */}
      {showCharts && selectedExerciseType === "weightsAndReps" && (
        <MetricCard
          title="Volume"
          value={latestValue(volumeData, "volume")}
          unit="kg·reps"
          trend={percentFromFirst(volumeData, "volume")}
        >
          {/* no axis titles here - the card header already says what this is
              and what the unit is, so they'd only eat width. the surface has to
              overflow because the last dot sits right on the plot edge and would
              otherwise be sliced in half by the svg bounds */}
          <ChartContainer
            config={chartConfigForVolume}
            className="aspect-auto h-[130px] w-full [&_.recharts-surface]:overflow-visible"
          >
            <ComposedChart data={volumeData} margin={cardChartMargin}>
              <defs>
                <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-neon)"
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-neon)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid {...cardChartGrid} />
              {/* the shortening has to happen in tickFormatter, not in a custom
                  tick - recharts measures the formatted string to work out how
                  many labels fit, and the raw one is a full date and time */}
              <XAxis
                dataKey="label"
                {...cardChartAxis}
                axisLine={{ stroke: "var(--border-cardEdge)" }}
                tickFormatter={shortDate}
                tickMargin={12}
                interval="preserveStartEnd"
                tick={{ fill: "var(--text-subheading)", fontSize: 11 }}
              />
              {/* the width is the gutter the ticks are drawn into - the plot
                  starts after it, so this is what pushes the chart off the edge */}
              <YAxis width={52} {...cardChartAxis} tick={renderYTick} />
              <Area
                dataKey="volume"
                stroke="var(--color-neon)"
                strokeWidth={2.5}
                fill="url(#volumeFill)"
                dot={{ r: 2.5, fill: "var(--color-neon)", strokeWidth: 0 }}
                activeDot={{ r: 3.5, fill: "var(--color-neon)" }}
              />
              {/* per-limb has no total to fill under, so these stay bare lines */}
              <Line
                dataKey="volumeLeft"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={{ r: 2.5, fill: "var(--chart-2)", strokeWidth: 0 }}
              />
              <Line
                dataKey="volumeRight"
                stroke="var(--chart-3)"
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={{ r: 2, fill: "var(--chart-3)", strokeWidth: 0 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </ComposedChart>
          </ChartContainer>
        </MetricCard>
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
      {showCharts && !selectedExerciseIsBodyweight && (
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
      {showCharts && selectedExerciseIsBodyweight && <>{difficultySelect}</>}
      {showCharts &&
        selectedExerciseIsBodyweight &&
        selectedExerciseDifficulty === "assisted" &&
        // done the exercise, but never assisted, so this chart has nothing to draw
        (maxAssistedWeightData.length === 0 ? (
          <p>
            You have not done this exercise at {selectedExerciseDifficulty}{" "}
            difficulty.
          </p>
        ) : (
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
        ))}
      {showCharts &&
        selectedExerciseIsBodyweight &&
        selectedExerciseDifficulty === "weighted" &&
        // done the exercise, but never weighted, so this chart has nothing to draw
        (maxExtraWeightData.length === 0 ? (
          <p>
            You have not done this exercise at {selectedExerciseDifficulty}{" "}
            difficulty.
          </p>
        ) : (
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
        ))}
    </div>
  )
}

export default Graphs
