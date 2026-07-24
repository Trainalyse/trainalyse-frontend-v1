import Dropsets from "./Dropsets"
import { Fragment } from "react"
import { type ExerciseType } from "./data/exercise"
import { Button } from "@/components/ui/button"
import { type WorkoutSet, type Dropset, type Limb } from "./data/workouts"


interface SetsProps {
  exerciseType: ExerciseType | ""
  isBodyweight: boolean
  number : number
  setData: WorkoutSet
  activeLimb: Limb
  onChange: (updated: WorkoutSet) => void
}


function Sets({ exerciseType, isBodyweight, setData, activeLimb, onChange,number }: SetsProps) {
  {/*this is for adding new dropset */}
  function handleAddDropset() {
    const newDropset: Dropset = { id: Date.now(), left: {} }
    // rebuild THIS set with the new dropset, and hand it up to Exercise
    onChange({ ...setData, dropsets: [...setData.dropsets, newDropset] })
  }


//deletion of a dropset
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
        <Fragment key={dropset.id}>
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
          {/* delete cell */}
          <div className="flex justify-end">
            <button
              type="button"
              aria-label="delete dropset"
              onClick={() => handleRemoveDropset(dropset.id)}
              className="size-4 rounded-full bg-white/80"
            />
          </div>
        </Fragment>
      ))}
      {/* + for drop sets spans the whole grid row */}
      {exerciseType && (
        <Button variant="outline" className="col-span-full w-3/4 justify-self-center" onClick={handleAddDropset}>
          Add new Drop set
        </Button>
      )}
    </>
  )
}

export default Sets
