import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Sets from "./Set"
import React from "react"
import { exercises, type ExerciseType } from "./data/exercise"
import { Button } from "@/components/ui/button"
import ExerciseAddition from "./ExerciseAddition"
import { type WorkoutExercise } from "./data/workouts"

interface Dropset {
  id: number
  weight?: number
  reps?: number
  minutes?: number
  seconds?: number
  hours?: number
}

// This is what's stored in the array
interface SetItem {
  id: string
  dropsets: Dropset[]
}

interface ExerciseProps {
  number: number
  exerciseData?: WorkoutExercise
}

function Exercise({ number, exerciseData }: ExerciseProps) {
  const id = React.useId()
  // when prefilled, look up type/isBodyweight from the catalog by name
  const matchedExercise = exerciseData
    ? exercises.find((e) => e.name === exerciseData.exerciseName)
    : undefined
  const counter = React.useRef(exerciseData ? exerciseData.sets.length : 1)
  const [selectedExercise, setSelectedExercise] = React.useState(
    exerciseData?.exerciseName ?? ""
  )
  const [exerciseMode, setExerciseMode] = React.useState(
    exerciseData ? "selected" : "searching"
  )
  const [exerciseType, setExerciseType] = React.useState<ExerciseType | "">(
    matchedExercise?.type ?? ""
  )
  // "searching" — show Add Exercise button + search UI
  // "selected" — show exercise name + edit button
  const [showSearch, setShowSearch] = React.useState(false)
  const [isBodyweight, setIsBodyweight] = React.useState<boolean>(
    matchedExercise?.isBodyweight ?? false
  )

  const handleExerciseAddition = () => {
    setShowSearch(true)
  }

  function handleEditExercise() {
    setExerciseMode("searching")
  }

  const [arrOfSet, setArrOfSet] = React.useState<SetItem[]>(
    exerciseData
      ? exerciseData.sets.map((_, index) => ({
          id: id + "-" + index,
          dropsets: [],
        }))
      : [{ id: id + "-0", dropsets: [] }]
  )

  function handleAddSets() {
    setArrOfSet([
      ...arrOfSet,
      { id: id + "-" + counter.current++, dropsets: [] },
    ])
  }

  function handleMinus() {
    if (arrOfSet.length > 0) {
      const updatedSets = arrOfSet.slice(0, -1)
      setArrOfSet(updatedSets)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Exercise {number}</CardTitle>
        </CardHeader>
        <CardContent>
          {exerciseMode === "searching" && (
            <>
              <Button onClick={handleExerciseAddition}>Search Exercise</Button>
              {showSearch && (
                <ExerciseAddition
                  selectedExercise={selectedExercise}
                  setSelectedExercise={setSelectedExercise}
                  setExerciseMode={setExerciseMode}
                  setExerciseType={setExerciseType}
                  setIsBodyweight={setIsBodyweight}
                />
              )}
            </>
          )}
          {exerciseMode === "selected" && (
            <>
              <p>{selectedExercise}</p>
              <Button onClick={handleEditExercise}>Edit exercise</Button>
            </>
          )}
          {selectedExercise &&
            arrOfSet.map((set, index) => (
              <Sets
                key={set.id}
                number={index + 1}
                exerciseType={exerciseType}
                isBodyweight={isBodyweight}
                setData={exerciseData?.sets[index]}
              />
            ))}
          {selectedExercise && (
            <Button onClick={handleAddSets}>+ for Sets</Button>
          )}

          {arrOfSet.length > 1 && (
            <Button onClick={handleMinus}>- for Sets</Button>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default Exercise
