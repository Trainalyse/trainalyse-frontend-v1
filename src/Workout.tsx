"use client"
import { Input } from "@/components/ui/input"
import React, { type ChangeEvent } from "react"
import { DatePickerDemo } from "./components/DatePicker"
import { Button } from "@/components/ui/button"
import { type Workout as WorkoutData, type WorkoutExercise } from "./data/workouts"
import { format } from "date-fns"
import Timesetter from "@/components/ui/timesetter"
import { Trash2Icon } from "lucide-react"
import { Label } from "./components/ui/label"
import ExerciseSearch from "./components/ExerciseSearch"
import Exercise from "./Exercise"
import { useLocation } from "react-router-dom"


function Workout() {
  const location = useLocation()
  const passedWorkout = location.state?.workout as WorkoutData | undefined
  const [exercises, setExercises] = React.useState<WorkoutExercise[]>(
      passedWorkout?.exercises ?? []
    )
  const [title, setTitle] = React.useState(passedWorkout?.title || "")
  const [pickTime, setPickTime] = React.useState(
    passedWorkout?.time ?? format(new Date(), "HH:mm")
  )
  const [showExerciseSearch, setShowExerciseSearch] =
    React.useState<boolean>(false)

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
  }
  function handleConfirmExercise(exerciseName: string) {
      // start every new exercise with one set that already holds one dropset.
      // `base` + offsets keep the three ids unique even when created in the same ms.
      const base = Date.now()
      const newExercise: WorkoutExercise = {
        id: base,
        exerciseName,
        sets: [{ id: base + 1, dropsets: [{ id: base + 2 ,left: {}}] }],
      }
      setExercises([...exercises, newExercise])
    }
    function handleExerciseChange(updatedExercise: WorkoutExercise) {
       setExercises(
         exercises.map((ex) => (ex.id === updatedExercise.id ? updatedExercise : ex))
       )
    }
    function handleDeleteExercise(id: number) {
        setExercises(exercises.filter((ex) => ex.id !== id))
      }
  return (
    <div className="flex flex-col mx-auto max-w-[430px] min-h-svh px-[var(--space-23)] gap-2 ">
      <div className="flex justify-between items-center mt-4">
        <Button className="pl-0 text-base " variant="ghost">
          <Trash2Icon className="size-5" />
          Discard
        </Button>
        <Button className="bg-brand h-10 px-6 text-base">Save</Button>
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
        <Label className="text-muted-foreground">Date</Label>
      <DatePickerDemo
        initialDate={passedWorkout?.date ?? format(new Date(), "yyyy-MM-dd")}
         /></div>
        <div className="flex flex-col gap-1 flex-1" >
        <Label className="text-muted-foreground">Time</Label>
      <Timesetter value={pickTime} onChange={setPickTime} /></div></div>
      <Input
        type="text"
        placeholder="Enter your title"
        value={title}
        onChange={handleTitleChange}
      />
      {exercises.map((exercise) => (
        <Exercise
            key={exercise.id}
            exerciseData={exercise}
            onChange={handleExerciseChange}
            onDelete={() => handleDeleteExercise(exercise.id)}
          />
        ))}
      <Button className="bg-brand mt-3 h-11"onClick={()=>(setShowExerciseSearch(true))}>Add new Exercise</Button>

      {showExerciseSearch && (
         <ExerciseSearch
           onClose={() => setShowExerciseSearch(false)}
           onConfirm={handleConfirmExercise}
         />
       )}

    </div>
  )
}

export default Workout
