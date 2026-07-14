"use client"
import { Input } from "@/components/ui/input"
import React, { type ChangeEvent } from "react"
import { DatePickerDemo } from "./components/DatePicker"
import { Button } from "@/components/ui/button"
import { useLocation } from "react-router-dom"
import { type Workout as WorkoutData } from "./data/workouts"
import { format } from "date-fns"
import Timesetter from "@/components/ui/timesetter"
import { Trash2Icon } from "lucide-react"
import { Label } from "./components/ui/label"
import ExerciseSearch from "./components/ExerciseSearch"

function Workout() {
  const location = useLocation()
  const passedWorkout = location.state?.workout as WorkoutData | undefined
  const [title, setTitle] = React.useState(passedWorkout?.title || "")
  const [pickTime, setPickTime] = React.useState(
    passedWorkout?.time ?? format(new Date(), "HH:mm")
  )
  const [showExerciseSearch, setShowExerciseSearch] =
    React.useState<boolean>(false)

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
  }

  return (
    <div className="flex flex-col mx-auto max-w-[430px] min-h-svh px-[var(--space-23)] gap-2 ">
      <div className="flex justify-between items-center mt-4">
        <Button className="pl-0 text-base" variant="ghost">
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

      <Button className="bg-brand mt-3 h-11"onClick={()=>(setShowExerciseSearch(true))}>Add new Exercise</Button>

      {showExerciseSearch && (
        <ExerciseSearch onClose={() => setShowExerciseSearch(false)} />
      )}
    </div>
  )
}

export default Workout
