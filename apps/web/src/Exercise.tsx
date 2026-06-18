import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import Sets from "./Set"
import React from "react"
import { type ExerciseType } from "./data/exercise"
import { Button } from "@workspace/ui/components/button"
import ExerciseAddition from "./ExerciseAddition"

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
}

function Exercise({ number }: ExerciseProps) {
  const id = React.useId()
  const counter = React.useRef(1)
  const [selectedExercise, setSelectedExercise] = React.useState("")
  const [exerciseMode, setExerciseMode] = React.useState("searching")
  const [exerciseType, setExerciseType] = React.useState<ExerciseType | "">("")
  // "searching" — show Add Exercise button + search UI
  // "selected" — show exercise name + edit button
  const [showSearch, setShowSearch] = React.useState(false)
  const [isBodyweight, setIsBodyweight] = React.useState<boolean>(false)

  const handleExerciseAddition = () => {
    setShowSearch(true)
  }

  function handleEditExercise() {
    setExerciseMode("searching")
  }

  const [arrOfSet, setArrOfSet] = React.useState<SetItem[]>([
    { id: id + "-0", dropsets: [] },
  ])

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
