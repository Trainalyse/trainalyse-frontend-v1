import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { exercises } from "@/data/exercise"
import React, { type ChangeEvent } from "react"

interface ExerciseSearchProps {
  onClose: () => void
}

function ExerciseSearch({ onClose }: ExerciseSearchProps) {
  const [exerciseSearch, setExerciseSearch] = React.useState("")

  const [selectedExercise, setSelectedExercise] = React.useState<string>("")

  function handleExerciseTypeForSearch(e: ChangeEvent<HTMLInputElement>) {
    setExerciseSearch(e.target.value)
    setSelectedExercise("")
  }

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  )

  return (
    // BACKDROP: blurred workout page behind; clicking it closes the popup.
    <div
      className="fixed inset-0 z-10 flex items-start justify-center bg-black/60 pt-[12vh] backdrop-blur-sm"
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
            onChange={handleExerciseTypeForSearch}
          />
          <div className="flex w-24 shrink-0 justify-end">
            {selectedExercise ? (
              <Button className="bg-brand h-10 w-full text-base">Confirm</Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="size-9" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 flex min-h-0 flex-col overflow-y-auto">
          {filteredExercises.map((exercise) => (
            <Button
              key={exercise.id}
              variant="ghost"
              className="justify-start text-muted-foreground h-15 "
              onClick={() => {
                if (!selectedExercise) {
                  setSelectedExercise(exercise.name)
                } else if (selectedExercise === exercise.name) {
                  setSelectedExercise("")
                } else if (selectedExercise !== exercise.name) {
                  setSelectedExercise(exercise.name)
                }
              }}
            >
              <p
                className={
                  selectedExercise === exercise.name
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
