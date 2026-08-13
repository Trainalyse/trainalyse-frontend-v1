import { Fragment, useState } from "react"
import { format, parseISO } from "date-fns"
import { ChevronDown, X } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { exercises, type ExerciseType } from "@/data/exercise"
import {
  type Difficulty,
  type LimbValues,
  type Limb,
} from "@/data/workouts"
import { getExerciseInstance } from "@/data/calculations"

// Short forms shown in the read-only difficulty pill, same as the live editor.
const difficultyShortLabels: Record<Difficulty, string> = {
  normal: "Norm.",
  assisted: "Asst.",
  weighted: "Wtd.",
}

// Column templates mirror the live editor's getGridConfig, MINUS the trailing
// delete column — this modal is read-only, so there are no per-row delete icons.
// Headers must stay in lockstep with the template's column count (a mismatch
// makes the subgrid flow diagonally), so both come from one place.
function getReadonlyGridConfig(
  exerciseType: ExerciseType | "",
  isBodyweight: boolean
) {
  if (exerciseType === "duration") {
    return isBodyweight
      ? { template: "grid-cols-[min-content_minmax(min-content,1fr)_minmax(8ch,1fr)]", headers: ["Difficulty", "Weights", "Time"] }
      : { template: "grid-cols-[minmax(min-content,1fr)_minmax(8ch,1fr)]", headers: ["Weights", "Time"] }
  }
  return isBodyweight
    ? { template: "grid-cols-[min-content_minmax(min-content,1fr)_minmax(min-content,1fr)]", headers: ["Difficulty", "Weights", "Reps"] }
    : { template: "grid-cols-[minmax(min-content,1fr)_minmax(min-content,1fr)]", headers: ["Weights", "Reps"] }
}

// HH:MM:SS once there are hours, otherwise MM:SS — matches TimeInput's display.
function formatTime(hours = 0, minutes = 0, seconds = 0) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`
}

interface PreviousPerformanceProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exerciseId: number
}

// A read-only snapshot of the most recent logged instance of one exercise. Same
// cell shapes as the live editor, but every value is static text — no inputs,
// no delete icons, no add-set/add-dropset buttons. Slides up as a bottom sheet
// covering 70% of the screen; the top 30% is a dimmed, blurred backdrop that
// closes the sheet on tap (handled by the Sheet's overlay), and there's an X
// button top-right. Body scrolls inside; the page behind is scroll-locked.
function PreviousPerformance({ open, onOpenChange, exerciseId }: PreviousPerformanceProps) {
  // which limb is being read — only ever flips when the instance was logged
  // per-limb (Left/Right tabs); otherwise everything lives under "left".
  const [activeLimb, setActiveLimb] = useState<Limb>("left")

  const matched = exercises.find((e) => e.id === exerciseId)
  const instances = getExerciseInstance(exerciseId)
  // most recent = last, since getExerciseInstance sorts oldest -> newest
  const latest = instances[instances.length - 1]

  // defensive: the menu item is disabled when there's no instance, so this
  // shouldn't render open without one — but never crash if it does.
  if (!latest) return null

  const exerciseType: ExerciseType | "" = matched?.type ?? ""
  const isBodyweight = matched?.isBodyweight ?? false
  const workoutExercise = latest.exercise
  const perLimbEnabled = workoutExercise.perLimbEnabled ?? false

  const grid = getReadonlyGridConfig(exerciseType, isBodyweight)

  // one read-only value cell — mirrors the live Dropsets branch logic
  function renderCells(limb: LimbValues) {
    const difficulty: Difficulty = limb.difficulty ?? "normal"

    const difficultyPill = (
      <div className="inline-flex h-9 min-w-0 items-center justify-between gap-1 rounded-md border border-input bg-transparent px-1.5 text-sm">
        {difficultyShortLabels[difficulty]}
        <ChevronDown className="size-4 shrink-0 opacity-50" />
      </div>
    )

    // bodyweight weight cell: Normal adds no weight (muted NA); Assisted/Weighted
    // show the assist/extra weight typed for that dropset.
    const bodyweightWeight =
      difficulty === "normal" ? (
        <span className="block w-full text-center text-muted-foreground">NA</span>
      ) : (
        <span className="block w-full text-center">
          {(difficulty === "assisted" ? limb.assistedWeights : limb.extraWeights) ?? (
            <span className="text-muted-foreground">-</span>
          )}
        </span>
      )

    const plainWeight = (
      <span className="block w-full text-center">
        {limb.weights ?? <span className="text-muted-foreground">-</span>}
      </span>
    )

    const reps = (
      <span className="block w-full text-center">
        {limb.reps ?? <span className="text-muted-foreground">-</span>}
      </span>
    )

    const isTimeEmpty = !limb.hours && !limb.minutes && !limb.seconds
    const time = (
      <span className={`block text-sm tabular-nums ${isTimeEmpty ? "text-muted-foreground" : ""}`}>
        {formatTime(limb.hours, limb.minutes, limb.seconds)}
      </span>
    )

    if (exerciseType === "weightsAndReps" && !isBodyweight) {
      return (<><div>{plainWeight}</div><div>{reps}</div></>)
    }
    if (exerciseType === "weightsAndReps" && isBodyweight) {
      return (<><div>{difficultyPill}</div><div>{bodyweightWeight}</div><div>{reps}</div></>)
    }
    if (exerciseType === "duration" && !isBodyweight) {
      return (<><div>{plainWeight}</div><div>{time}</div></>)
    }
    // duration + bodyweight (plank)
    return (<><div>{difficultyPill}</div><div>{bodyweightWeight}</div><div>{time}</div></>)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        /* h-[70vh]! — the `!` beats SheetContent's data-[side=bottom]:h-auto (an
           attribute selector = higher specificity), which otherwise lets the sheet
           grow to full content height and spill past the viewport top with no
           bounded height for the body to scroll inside. */
        className="flex h-[70vh]! flex-col gap-0 rounded-t-[var(--radius-card)] border-[var(--border-cardEdge)] bg-[var(--bg-surface-primary)] p-0"
      >
        {/* Header: exercise name + when it was last done, and a round X to close */}
        <div className="flex shrink-0 items-start justify-between gap-3 px-[var(--space-23)] pt-[var(--space-lg)] pb-[var(--space-sm)]">
          <div className="flex min-w-0 flex-col gap-0.5">
            <SheetTitle className="text-lg font-bold text-foreground">{matched?.name}</SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">Last done {format(parseISO(latest.date), "d MMMM, yyyy")}</SheetDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="size-9 shrink-0 rounded-full border border-[var(--border-cardEdge)] bg-white/5 text-muted-foreground hover:text-foreground"
          >
            <X className="size-[18px]" />
          </Button>
        </div>

        {/* Scrollable read-only body; the page behind is locked by the Sheet. */}
        <div className="flex flex-1 flex-col gap-[var(--space-md)] overflow-y-auto px-[var(--space-23)] pt-[var(--space-sm)] pb-[var(--space-md)]">
          {/* Only when this instance was logged per-limb: read-only Left/Right
              tabs to switch between each side. The "Log separate for each limb"
              toggle is intentionally NOT shown — a non-interactive switch read
              as confusing. No per-limb data = nothing here at all. */}
          {perLimbEnabled && (
            <Tabs value={activeLimb} onValueChange={(v) => setActiveLimb(v as Limb)}>
              <TabsList className="w-full">
                <TabsTrigger
                  value="left"
                  className="text-base font-normal text-[var(--color-white-1)] data-active:text-[var(--color-neon)] dark:data-active:text-[var(--color-neon)]"
                >
                  Left
                </TabsTrigger>
                <TabsTrigger
                  value="right"
                  className="text-base font-normal text-[var(--color-white-1)] data-active:text-[var(--color-neon)] dark:data-active:text-[var(--color-neon)]"
                >
                  Right
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {/* Same narrow-width horizontal scroll guard the live editor uses.
              Structure matches Set.tsx: every row is a direct child of the grid
              (fragments only), so grid-cols-subgrid inherits the outer tracks. */}
          <div className="overflow-x-auto">
            <div className={`grid ${grid.template} min-w-[240px] items-center gap-x-[var(--space-sm)] gap-y-[var(--space-md)]`}>
              {workoutExercise.sets.map((set, setIndex) => (
                <Fragment key={set.id}>
                  {/* Set heading with the neon accent bar */}
                  <div className="col-span-full flex items-center gap-2">
                    <span className="h-5 w-1 rounded-full bg-[var(--color-neon)]" />
                    <h3 className="text-base font-semibold">Set {setIndex + 1}</h3>
                  </div>
                  {/* Column labels, aligned to the outer tracks via subgrid */}
                  <div className="col-span-full grid grid-cols-subgrid items-center text-left text-xs tracking-wider text-muted-foreground">
                    {grid.headers.map((label) => (
                      <div key={label} className={label === "Weights" || label === "Reps" ? "text-center" : "text-left"}>
                        {label.toLocaleUpperCase()}
                      </div>
                    ))}
                  </div>
                  {set.dropsets.map((dropset, dropIndex) => (
                    <Fragment key={dropset.id}>
                      <div className="col-span-full grid grid-cols-subgrid items-center">
                        {renderCells(dropset[activeLimb] ?? {})}
                      </div>
                      {dropIndex !== set.dropsets.length - 1 && (
                        <Separator className="col-span-full" />
                      )}
                    </Fragment>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default PreviousPerformance
