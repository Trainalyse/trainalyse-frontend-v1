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
  const exerciseType: ExerciseType | "" = matchedExercise?.type ?? ""
  const isBodyweight = matchedExercise?.isBodyweight ?? false
  const perLimb = matchedExercise?.perLimb ?? false
  const [activeLimb, setActiveLimb] = useState<Limb>("left")
  function handleAddSet() {
      const base = Date.now()
      const newSet: WorkoutSet = { id: base, dropsets: [{ id: base + 1 ,left:{}}] }
      onChange({ ...exerciseData, sets: [...exerciseData.sets, newSet] })
    }

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
  function handleTogglePerLimb(value: boolean) {
     onChange({ ...exerciseData, perLimbEnabled: value })
   }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{exerciseData.exerciseName}</CardTitle>
        <Button onClick={onDelete}>Delete</Button>
        {perLimb && (
            <div className="flex items-center gap-2">
              <Switch
                checked={exerciseData.perLimbEnabled ?? false}
                onCheckedChange={handleTogglePerLimb}
              />
              <span>Log separate for each limb</span>
            </div>
          )}
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
