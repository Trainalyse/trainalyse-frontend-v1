import Dropsets from "./Dropsets"
import { type ExerciseType } from "./data/exercise"
import {
  Card,
  CardContent,

} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type WorkoutSet, type Dropset,type Limb} from "./data/workouts"

interface SetsProps {

  exerciseType: ExerciseType | ""
  isBodyweight: boolean
  setData: WorkoutSet
  activeLimb: Limb
  onChange: (updated: WorkoutSet) => void
}
export type Difficulty = "normal" | "assisted" | "weighted"

function Sets({ exerciseType, isBodyweight, setData,activeLimb, onChange }: SetsProps) {
  function handleAddDropset() {
    const newDropset: Dropset = { id: Date.now(), left: {} }
    // rebuild THIS set with the new dropset, and hand it up to Exercise
    onChange({ ...setData, dropsets: [...setData.dropsets, newDropset] })
  }

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
      <Card>

        <CardContent>
          {setData.dropsets.map((dropset) => (
            <div key={dropset.id}>
            <Dropsets
              exerciseType={exerciseType}
              isBodyweight={isBodyweight}
                dropsetData={dropset}
                activeLimb={activeLimb}
              onChange={handleDropsetChange}
              />
              <Button onClick={() => handleRemoveDropset(dropset.id)}>Delete</Button>
            </div>
          ))}
          <br />
          {/* this is the button to add a new drop set */}
          {exerciseType && (
            <Button onClick={handleAddDropset}>+ for drop sets</Button>
          )}

          {/* this is the button to remove a drop set, only shown if there are drop sets */}

        </CardContent>
      </Card>
    </>
  )
}

export default Sets
