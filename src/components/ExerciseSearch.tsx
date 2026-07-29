import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { exercises } from "@/data/exercise"
import React, { type ChangeEvent } from "react"

// this interface is used for the functions that are like properties of this component like onclose it should go to void
// and onconfirm it should pass the id of the exercise which was confirmed and should go to void
interface ExerciseSearchProps {
    onClose: () => void
    onConfirm: (exerciseId: number) => void
  }


function ExerciseSearch({ onClose, onConfirm }: ExerciseSearchProps) {
  // this if for the exercise that is being searched by the user
  const [exerciseSearch, setExerciseSearch] = React.useState("")
  // the selection is held by id, not by name - the name is only ever display
  // text, so everything that has to survive a rename keys off this instead
  const [selectedExerciseId, setSelectedExerciseId] = React.useState<
    number | null
  >(null)
  const selectedExercise =
    exercises.find((e) => e.id === selectedExerciseId)?.name ?? ""
  // this function is for setting the onchange on the input for the search and also unselecting the selected exercise
  function handleExerciseTypeForSearch(e: ChangeEvent<HTMLInputElement>) {
    setExerciseSearch(e.target.value)
    setSelectedExerciseId(null)
  }
  // this lowers down the list of exercises after the user enters their search letters
  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  )

  return (
    // BACKDROP: blurred workout page behind; clicking it closes the popup.
    <div
      className="fixed inset-0 z-10 flex items-start + pt-[15vh] justify-center bg-black/60 backdrop-blur-sm "
      onClick={onClose}
    >
      {/* CARD: the small popup. stopPropagation so clicks inside don't close it. */}
      <div
        className="flex max-h-[70vh] w-[85%] max-w-[360px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-cardEdge)] bg-[var(--bg-surface-primary)] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <Input
            className="h-11 flex-1 min-w-0"
            placeholder="Search your exercise"
            value={selectedExercise ? selectedExercise : exerciseSearch}
            // so this is for the value that is being displayed in the ui , if there is a selected exercise
            // then it will show that selected exercise in the search bar other wise it will show what the user has typed
            // in the search bar
            onChange={handleExerciseTypeForSearch}
          />

          {/*so if a exercise is selected then after clicking the confirm button it sends that name of the exc and in the
           workout file it adds the exercise to that exercise array, but if there is no selected exc then on pressing the
          X button the user can click the modal */}
          <div className="flex w-24 shrink-0 justify-end">
            {selectedExercise ? (
              <Button
                  className="bg-brand h-10 w-full text-base"
                  onClick={() => {
                    if (selectedExerciseId !== null) onConfirm(selectedExerciseId)
                    onClose()
                  }}
                >
                  Confirm
                </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="size-9" />
              </Button>
            )}
          </div>
        </div>

{/* so this part under it covers the logic that if there is no selected exc then after clicking the exc that the user
 wants , it will be selected, but if the exercise is selected and the user clicks on that same exercise then it deselects
that exercise and if the user has selected some exercise and the user clicks on another exercise then that exercise replaces
the previous exercise and it gets selected . and also the exc that is selected will be bolder and brighter than the not
selected once.*/}
        <div className="mt-6 flex min-h-0 flex-col overflow-y-auto">
          {filteredExercises.map((exercise) => (
            <Button
              key={exercise.id}
              variant="ghost"
              className="justify-start text-muted-foreground h-15 "
              onClick={() => {
                // tapping the selected one clears it, tapping any other replaces it
                setSelectedExerciseId(
                  selectedExerciseId === exercise.id ? null : exercise.id
                )
              }}
            >
              <p
                className={
                  selectedExerciseId === exercise.id
                    ? "text-lg justify-start text-primary font-bold h-15 "
                    : " text-lg justify-start text-muted-foreground h-15 "
                }
              >
                {exercise.name}
              </p>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExerciseSearch
