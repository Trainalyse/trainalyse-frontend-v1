import Dropsets from "./Dropsets"
import { type ExerciseType } from "./data/exercise"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import React from "react"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group"

interface SetsProps {
  number: number
  exerciseType: ExerciseType | ""
  isBodyweight: boolean
}
export type Difficulty = "normal" | "assisted" | "weighted"

function Sets({ number, exerciseType, isBodyweight }: SetsProps) {
  const id = React.useId()
  const counter = React.useRef(1)
  const [arrOfDS, setArrOfDS] = React.useState([{ id: id + "-0" }])
  const [difficulty, setDifficulty] = React.useState<Difficulty>("normal")

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
          {isBodyweight && (
            <RadioGroup
              value={difficulty}
              onValueChange={(value) => setDifficulty(value as Difficulty)}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal">Normal</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="assisted" id="assisted" />
                <Label htmlFor="assisted">Assisted</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="weighted" id="weighted" />
                <Label htmlFor="weighted">Weighted</Label>
              </div>
            </RadioGroup>
          )}
          {arrOfDS.map((dropset) => (
            <Dropsets
              key={dropset.id}
              exerciseType={exerciseType}
              isBodyweight={isBodyweight}
              difficulty={difficulty}
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
