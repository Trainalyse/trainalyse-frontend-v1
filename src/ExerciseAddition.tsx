import React from "react"
import { exercises, type ExerciseType } from "./data/exercise"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ExerciseAdditionProps {
  selectedExercise: string
  setSelectedExercise: (value: string) => void
  setExerciseMode: (value: string) => void
  setExerciseType: (value: ExerciseType | "") => void
  setIsBodyweight: (value: boolean) => void
}

function ExerciseAddition({
  selectedExercise,
  setSelectedExercise,
  setExerciseMode,
  setExerciseType,
  setIsBodyweight,
}: ExerciseAdditionProps) {
  const [searchedExercise, setSearchedExercise] = React.useState("")
  const [exerciseSelected, setExerciseSelected] = React.useState(false)
  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchedExercise.toLowerCase())
  )

  function handleSubmition() {
    setExerciseMode("selected")
  }

  return (
    <>
      <p>Search your exercise:</p>
      <Input
        type="text"
        placeholder="enter your exercise"
        value={searchedExercise}
        onChange={(e) => {
          setSearchedExercise(e.target.value)
        }}
      />
      {searchedExercise &&
        filteredExercises.map((exercise) => (
          <Button
            key={exercise.id}
            onClick={() => {
              setSelectedExercise(exercise.name)
              setExerciseType(exercise.type)
              setIsBodyweight(exercise.isBodyweight)
              setExerciseSelected(true)
            }}
          >
            {exercise.name}
          </Button>
        ))}

      {exerciseSelected && <p>{`you have selected: ${selectedExercise}`}</p>}
      {exerciseSelected && (
        <Button onClick={handleSubmition}>Add Exercise</Button>
      )}
    </>
  )
}

export default ExerciseAddition
