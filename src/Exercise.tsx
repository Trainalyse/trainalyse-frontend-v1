import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Sets from "./Set"
import { exercises, type ExerciseType } from "./data/exercise"
import { Button } from "@/components/ui/button"
import { type WorkoutExercise, type WorkoutSet ,type Limb} from "./data/workouts"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./components/ui/accordion"
import { EllipsisVerticalIcon } from "lucide-react"
import { useScrollLock } from "@/hooks/use-scroll-lock"

// Per-exercise-type column config: the grid-cols template AND the header labels
// come from ONE place so the header count can never drift from the column count
// (a mismatch makes the grid auto-flow shift diagonally). The Set number is no
// longer a column — it's a per-set heading above the rows — so `headers` lists
// the value cells and the template adds only the trailing Delete column.
//
// Responsive sizing, from left to right:
//   • Difficulty — min-content: a fixed dropdown, pinned to its label width at
//     every screen size (it shouldn't balloon on wide screens).
//   • Weights / Reps — minmax(min-content, 1fr): at their header width when
//     there's no room (320px), and they breathe as the screen widens.
//   • Time — minmax(8ch, 1fr): same, but with a floor of ~8 characters
//     (HH:MM:SS) so the widest value can never clip even while sharing space.
//   • Delete — auto: hugs the icon.
// So at 320px everything sits at its minimum (fits), and every extra pixel is
// split between the value columns — no column hoards the slack.
// NOTE: `grid-cols-[…]` strings must be written as full literals so Tailwind can
// see and generate them — don't build them by concatenation.
function getGridConfig(exerciseType: ExerciseType | "", isBodyweight: boolean) {
  if (exerciseType === "duration") {
    return isBodyweight
      ? { template: "grid-cols-[min-content_minmax(min-content,1fr)_minmax(8ch,1fr)_auto]", headers: ["Difficulty", "Weights", "Time"] }
      : { template: "grid-cols-[minmax(min-content,1fr)_minmax(8ch,1fr)_auto]", headers: ["Weights", "Time"] }
  }
  // weightsAndReps (and the "" no-exercise fallback)
  return isBodyweight
    ? { template: "grid-cols-[min-content_minmax(min-content,1fr)_minmax(min-content,1fr)_auto]", headers: ["Difficulty", "Weights", "Reps"] }
    : { template: "grid-cols-[minmax(min-content,1fr)_minmax(min-content,1fr)_auto]", headers: ["Weights", "Reps"] }
}

//exercise data is like a singular workout exercise, onChange gives us the updated which is also like the
// workoutexercise and ondelete is the callback that was in the workout file
interface ExerciseProps {
  exerciseData: WorkoutExercise
  onChange: (updated: WorkoutExercise) => void
  onDelete: () => void
   onEdit: () => void
}


function Exercise({ exerciseData, onChange, onDelete, onEdit }: ExerciseProps) {
  // The exercise is already chosen (via the popup), so just look up its
  // type/bodyweight from the catalog by id — no local state needed. the name
  // comes from here too now, rather than being stored on the workout row
  const matchedExercise = exercises.find(
    (e) => e.id === exerciseData.exerciseId
  )
  //this below lines means that there is a new variable called exerciseType and it will be like ExerciseType or
  // empty like "" and it will be equal to the exercise that the user has selected to add and it wil be equal to its
  // type otherwise it is empty
  const exerciseType: ExerciseType | "" = matchedExercise?.type ?? ""
  // isBodyweight a new variable which is a property of the exercise and not a specific type
  const isBodyweight = matchedExercise?.isBodyweight ?? false
  // again same , it is a property
  const perLimb = matchedExercise?.perLimb ?? false
  //this is for the limb that is currently being filled and by default it is left and we have imported the Limb
  const [activeLimb, setActiveLimb] = useState<Limb>("left")

  // whether the "delete this whole exercise" confirm modal is open. deleting an
  // exercise is more destructive than a dropset, so it goes through a confirm
  // step (mirrors the dropset delete modal in Set.tsx) instead of firing instantly.
  const [confirmDelete, setConfirmDelete] = useState(false)
  useScrollLock(confirmDelete)

  // grid template + header labels for THIS exercise type (see getGridConfig above)
  const gridConfig = getGridConfig(exerciseType, isBodyweight)

  // this is the function where we are adding a new set to the exercise which has already 1 set by default
  function handleAddSet() {
      const base = Date.now()
      const newSet: WorkoutSet = { id: base, dropsets: [{ id: base + 1 ,left:{}}] }
      onChange({ ...exerciseData, sets: [...exerciseData.sets, newSet] })
  }

  // this is the section that handles logic that if a set has no dropset left so it will  be deleted and
  // if any dropset is updated then it is changed in the ui and kept in sync with the ui by the onchange
  function handleSetChange(updatedSet: WorkoutSet) {
    if (updatedSet.dropsets.length === 0) {
      onChange({
        ...exerciseData,sets : exerciseData.sets.filter( (s)=>s.id!== updatedSet.id),
      })
    } else {
      onChange({
        ...exerciseData,sets : exerciseData.sets.map((s)=>s.id===updatedSet.id?updatedSet:s),
      })
    }
  }

  // this is for toggle or switch that the user can turn on or off that they want to log for different limbs
  function handleTogglePerLimb(value: boolean) {
     onChange({ ...exerciseData, perLimbEnabled: value })
  }


  return (
    <>
    <Card>
      <Accordion type="single" collapsible defaultValue="exercise">
        <AccordionItem value="exercise">
          <CardHeader className="pl-3.5 pr-4 items-center">
            <AccordionTrigger className="py-0">
              <CardTitle className="text-lg font-bold">{matchedExercise?.name}</CardTitle>
            </AccordionTrigger>
            <CardAction className="self-center row-span-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="translate-x-3.5">
                    <EllipsisVerticalIcon className="size-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={onEdit}>Edit Exercise</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => setConfirmDelete(true)}>
                    Delete Exercise
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardAction>
          </CardHeader>

          <AccordionContent className="h-auto pb-0">
            <CardContent className="pl-3.5 pr-4 flex flex-col gap-[var(--space-md)]">
              {/*ok so the below sections logic is that if the perlimb is true so either dumbbell or cable(nnot barbell) so thats
               when the switch wil be provided and when the user clicks on the switch the flip happens in the component internally
              and we dont see it right here in the code and then handletoggleperlimb function you see before return
             is just for saving the value that is being sent by the switch component. */}
              {perLimb && (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={exerciseData.perLimbEnabled ?? false}
                    onCheckedChange={handleTogglePerLimb}
                  />
                  <span>Log separate for each limb</span>
                </div>
              )}

              {/* so if the perlimb is true that is it can be done with one limb, and it is enabled that means the user
               does wants to record separately for each limb then there will left and right tabs appearing . */}

              {perLimb && exerciseData.perLimbEnabled && (

                <Tabs value={activeLimb} onValueChange={(v) => setActiveLimb(v as "left" | "right")}>
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

              {/* Horizontal scroll for pathologically narrow widths (< ~320px,
                  e.g. the Galaxy Fold cover screen at 280px). The grid floors at
                  ~240px — roughly its width inside the card at a 320px viewport —
                  so every column including the trailing delete stays usable, and
                  overflow-x-auto lets the row scroll sideways instead of the card
                  clipping the delete off-screen. At >=320px it fills, no scroll. */}
              <div className="overflow-x-auto">
              <div className={`grid ${gridConfig.template} items-center gap-x-[var(--space-sm)] gap-y-[var(--space-md)] min-w-[240px]`}>
              {exerciseData.sets.map((set,index) => (
                <Sets
                  key={set.id}
                  number = {index+1}
                  exerciseType={exerciseType}
                  isBodyweight={isBodyweight}
                  headers={gridConfig.headers}
                  setData={set}
                  activeLimb={activeLimb}
                  isOnlySet={exerciseData.sets.length === 1}
                  onChange={handleSetChange}
                />
              ))}</div>
              </div>
              <Button className="w-full" onClick={handleAddSet}>Add new Set</Button>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>

    {/* Confirm-delete modal for the whole exercise. Same look as the dropset
        delete modal (Set.tsx): tap the backdrop or Cancel to dismiss, Confirm
        removes it. Shows the exercise name so it's clear which one is going. */}
    {confirmDelete && (
      <div
        className="fixed inset-0 z-10 flex items-center justify-center bg-black/40"
        onClick={() => setConfirmDelete(false)}
      >
        <div
          className="flex w-[85%] max-w-[360px] flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--border-cardEdge)] bg-[var(--bg-surface-primary)] p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-base">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{matchedExercise?.name}</span>?
          </p>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete()
                setConfirmDelete(false)
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default Exercise
