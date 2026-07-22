import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Sets from "./Set"
import { exercises, type ExerciseType } from "./data/exercise"
import { Button } from "@/components/ui/button"
import { type WorkoutExercise, type WorkoutSet ,type Limb} from "./data/workouts"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

//exercise data is like a singular workout exercise, onChange gives us the updated which is also like the
// workoutexercise and ondelete is the callback that was in the workout file
interface ExerciseProps {
  exerciseData: WorkoutExercise
  onChange: (updated: WorkoutExercise) => void
  onDelete: () => void
}


function Exercise({ exerciseData, onChange ,onDelete}: ExerciseProps) {
  // The exercise is already chosen (via the popup), so just look up its
  // type/bodyweight from the catalog by name — no local state needed.
  const matchedExercise = exercises.find(
    (e) => e.name === exerciseData.exerciseName
  )
  //this below lines means that there is a new variable called exerciseType and it will be like ExerciseType or
  // empty like "" and it will be equal to the exercise that the user has selected to add and it wil be equal to its
  // type otherwise it is empty
  const exerciseType: ExerciseType | "" = matchedExercise?.type ?? ""
  // isBodyweight a new variable which is a property of the exercise and not a specific type
  const isBodyweight = matchedExercise?.isBodyweight ?? false
  // again same , it is a property
  const perLimb = matchedExercise?.perLimb ?? false
  //this is for the limb that is currently being filled and by default it is left and we have imported the Limb
  const [activeLimb, setActiveLimb] = useState<Limb>("left")

  // this is the function where we are adding a new set to the exercise which has already 1 set by default
  function handleAddSet() {
      const base = Date.now()
      const newSet: WorkoutSet = { id: base, dropsets: [{ id: base + 1 ,left:{}}] }
      onChange({ ...exerciseData, sets: [...exerciseData.sets, newSet] })
  }

  // this is the section that handles logic that if a set has no dropset left so it will  be deleted and
  // if any dropset is updated then it is changed in the ui and kept in sync with the ui by the onchange
  function handleSetChange(updatedSet: WorkoutSet) {
    if (updatedSet.dropsets.length === 0) {
      onChange({
        ...exerciseData,sets : exerciseData.sets.filter( (s)=>s.id!== updatedSet.id),
      })
    } else {
      onChange({
        ...exerciseData,sets : exerciseData.sets.map((s)=>s.id===updatedSet.id?updatedSet:s),
      })
    }
  }

  // this is for toggle or switch that the user can turn on or off that they want to log for different limbs
  function handleTogglePerLimb(value: boolean) {
     onChange({ ...exerciseData, perLimbEnabled: value })
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>{exerciseData.exerciseName}</CardTitle>
        <Button onClick={onDelete}>Delete</Button>

        {/*ok so the below sections logic is that if the perlimb is true so either dumbbell or cable(nnot barbell) so thats
         when the switch wil be provided and when the user clicks on the switch the flip happens in the component internally
        and we dont see it right here in the code and then handletoggleperlimb function you see before return
       is just for saving the value that is being sent by the switch component. */}
        {perLimb && (
            <div className="flex items-center gap-2">
              <Switch
                checked={exerciseData.perLimbEnabled ?? false}
                onCheckedChange={handleTogglePerLimb}
              />
              <span>Log separate for each limb</span>
            </div>
          )}

        {/* so if the perlimb is true that is it can be done with one limb, and it is enabled that means the user
         does wants to record separately for each limb then there will left and right tabs appearing . */}
        {perLimb && exerciseData.perLimbEnabled && (
            <Tabs value={activeLimb} onValueChange={(v) => setActiveLimb(v as "left" | "right")}>
              <TabsList>
                <TabsTrigger value="left">Left</TabsTrigger>
                <TabsTrigger value="right">Right</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
      </CardHeader>
      <CardContent>
        {exerciseData.sets.map((set) => (
          <Sets
            key={set.id}
            exerciseType={exerciseType}
            isBodyweight={isBodyweight}
            setData={set}
            activeLimb={activeLimb}
            onChange={handleSetChange}
          />
        ))}
        <Button onClick={handleAddSet}>+ for Sets</Button>
      </CardContent>
    </Card>
  )
}

export default Exercise
