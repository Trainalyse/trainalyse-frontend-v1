import Dropsets from "./Dropsets"
import { type ExerciseType } from "./data/exercise"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React from "react"
import { Button } from "@/components/ui/button"
import { type WorkoutSet } from "./data/workouts"

interface SetsProps {
  number: number
  exerciseType: ExerciseType | ""
  isBodyweight: boolean
  setData?: WorkoutSet
}
export type Difficulty = "normal" | "assisted" | "weighted"

function Sets({ number, exerciseType, isBodyweight, setData }: SetsProps) {
  const id = React.useId()
  const counter = React.useRef(setData ? setData.dropsets.length : 1)
  const [arrOfDS, setArrOfDS] = React.useState(
    setData
      ? setData.dropsets.map((_, index) => ({ id: id + "-" + index }))
      : [{ id: id + "-0" }]
  )

  function handleDropSets() {
    const updatedDropSets = [
      ...arrOfDS,
      {
        id: id + "-" + counter.current++,
      },
    ]
    setArrOfDS(updatedDropSets)
  }

  function handleMinus() {
    if (arrOfDS.length > 0) {
      const updatedDropSets = arrOfDS.slice(0, -1)
      setArrOfDS(updatedDropSets)
    }
  }
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Set {number}</CardTitle>
        </CardHeader>
        <CardContent>
          {arrOfDS.map((dropset, index) => (
            <Dropsets
              key={dropset.id}
              exerciseType={exerciseType}
              isBodyweight={isBodyweight}
              dropsetData={setData?.dropsets[index]}
            />
          ))}
          <br />
          {/* this is the button to add a new drop set */}
          {exerciseType && (
            <Button onClick={handleDropSets}>+ for drop sets</Button>
          )}

          {/* this is the button to remove a drop set, only shown if there are drop sets */}
          {arrOfDS.length > 1 && (
            <Button onClick={handleMinus}>- for drop sets</Button>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default Sets
