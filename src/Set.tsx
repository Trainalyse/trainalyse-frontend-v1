import Dropsets from "./Dropsets"
import { type ExerciseType } from "./data/exercise"
import { Button } from "@/components/ui/button"
import { CircleX } from "lucide-react"
import { type WorkoutSet, type Dropset, type Limb } from "./data/workouts"
import React from "react"


interface SetsProps {
  exerciseType: ExerciseType | ""
  isBodyweight: boolean
  number : number
  setData: WorkoutSet
  activeLimb: Limb
  isOnlySet: boolean
  onChange: (updated: WorkoutSet) => void
}


function Sets({ exerciseType, isBodyweight, setData, activeLimb, onChange,number, isOnlySet }: SetsProps) {
  {/*this is for adding new dropset */}
  function handleAddDropset() {
    const newDropset: Dropset = { id: Date.now(), left: {} }
    // rebuild THIS set with the new dropset, and hand it up to Exercise
    onChange({ ...setData, dropsets: [...setData.dropsets, newDropset] })
  }


  // which dropset is pending deletion — null when the confirm modal is closed.
  // One piece of state does three jobs: which row to highlight, whether the
  // modal is open, and which id to delete on confirm.
  const [pendingDeleteId, setPendingDeleteId] = React.useState<number | null>(null)

  // clicking a row's delete icon opens the confirm modal for THAT dropset
  function handleRemoveModalDropset(id: number) {
    setPendingDeleteId(id)
  }
  // actually removes the dropset — called from the modal's Confirm button
  function handleRemoveDropset(id: number) {
    onChange({ ...setData, dropsets: setData.dropsets.filter((d)=>d.id!==id) })
  }

  function handleDropsetChange(updatedDropset: Dropset) {
    // one of my dropsets changed — swap it in by id and hand my new self up
    onChange({
      ...setData,
      dropsets: setData.dropsets.map((d) =>
        d.id === updatedDropset.id ? updatedDropset : d
      ),
    })
  }

  return (
    <>
      {setData.dropsets.map((dropset, i) => (
        // Each dropset row is ONE element now: it spans all the outer columns
        // (col-span-full) and re-uses the parent's column tracks via subgrid, so
        // its cells still line up with the header. Being a single element means
        // row-level styling (background, hover, highlight) is one class here.
        <div
          key={dropset.id}
          className={`col-span-full grid grid-cols-subgrid items-center rounded-md transition-colors ${
            dropset.id === pendingDeleteId ? "bg-input/30" : ""
          }`}
        >
          {/* Set# cell — number on the first dropset of the set, empty on the rest */}
          <div className="self-center text-center">{i === 0 ? number : ""}</div>
          {/* Dropsets renders the value cells (weights, reps) */}
          <Dropsets
            exerciseType={exerciseType}
            isBodyweight={isBodyweight}
            dropsetData={dropset}
            activeLimb={activeLimb}
            onChange={handleDropsetChange}
          />
          {/* delete cell — hidden on the only set's only dropset (deleting it
              would empty the exercise; use the kebab menu instead). The cell
              still renders to keep the grid's delete column aligned. */}
          <div className="flex justify-end">
            {!(isOnlySet && setData.dropsets.length === 1) && (
              <button
                type="button"
                aria-label="delete dropset"
                onClick={() => handleRemoveModalDropset(dropset.id)}
                className="text-white/80 transition-colors hover:text-white"
              >
                <CircleX className="size-5" />
              </button>
            )}
          </div>
        </div>
      ))}
      {/* + for drop sets spans the whole grid row */}
      {exerciseType && (
        <Button variant="outline" className="col-span-full w-3/4 justify-self-center" onClick={handleAddDropset}>
          Add new Drop set
        </Button>
      )}

      {/* Confirm-delete modal (position:fixed, so it's out of the grid flow).
          Open while a dropset is pending; the highlighted row shows which one. */}
      {pendingDeleteId !== null && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black/40"
          onClick={() => setPendingDeleteId(null)}
        >
          <div
            className="flex w-[85%] max-w-[360px] flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--border-cardEdge)] bg-[var(--bg-surface-primary)] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base">Are you sure you want to delete this dropset?</p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setPendingDeleteId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleRemoveDropset(pendingDeleteId)
                  setPendingDeleteId(null)
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

export default Sets
