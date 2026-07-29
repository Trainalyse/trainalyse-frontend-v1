"use client" // this is a just a nextjs thing and its a dead code and does nothing
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
  const location = useLocation()// in the other file we navigate with usenavigate and then we receive data here with uselocation
  const passedWorkout = location.state?.workout as WorkoutData | undefined
  // we are creating a new variable called passedWorkout and we pluck the data from the state by using the key which was
  // workout and we give the shape to it as Workoutdata from the json file
  // this is not same as workoutdata, this is just another name for the type Workout and it is Workoutdata
  const [exercises, setExercises] = React.useState<WorkoutExercise[]>(
      passedWorkout?.exercises ?? []
  )
  //this is the making of a new array which will be the exercise array which will have exercises from the saved
  // workouts if saved otherwise it would start out empty
  const [title, setTitle] = React.useState(passedWorkout?.title || "") // this is for title
  const [pickTime, setPickTime] = React.useState(
    passedWorkout?.time ?? format(new Date(), "HH:mm")
  )
  //this is for the modal that will pop up when you click on add new exercise
  const [showExerciseSearch, setShowExerciseSearch] =
    React.useState<boolean>(false)
  const[editingExerciseId, setEditingExerciseId] = React.useState<number | null>(null)

  // for the title change
  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
  }

  //this is for confirming a selectedexercise and it takes the catalog id of that exercise
  function handleConfirmExercise(exerciseId: number) {
     const base = Date.now()
     if (editingExerciseId !== null) {
       // EDITING: keep the row's own id, swap which catalog exercise it points at,
       // reset its sets to one fresh set+dropset
       setExercises(
         exercises.map((ex) =>
           ex.id === editingExerciseId
             ? { ...ex, exerciseId, sets: [{ id: base + 1, dropsets: [{ id: base + 2, left: {} }] }] }
             : ex
         )
       )
       setEditingExerciseId(null)
     } else {
       // ADDING: brand-new exercise (your existing behavior)
       const newExercise: WorkoutExercise = {
         id: base,
         exerciseId,
         sets: [{ id: base + 1, dropsets: [{ id: base + 2, left: {} }] }],
       }
       setExercises([...exercises, newExercise])
     }
   }

  // alright this argument called updatedexercise this is being detected when any onchange function is being fired.
    function handleExerciseChange(updatedExercise: WorkoutExercise) {
       setExercises(
         exercises.map((ex) => (ex.id === updatedExercise.id ? updatedExercise : ex))
       )
    }
  // this one works because the delete button has the same id as the exercise id so it will delete that exercise only
    function handleDeleteExercise(id: number) {
        setExercises(exercises.filter((ex) => ex.id !== id))
    }
  return (
    <div className="flex flex-col mx-auto max-w-[430px] px-[var(--space-23)] gap-[var(--space-md)] ">
      <div className="flex justify-between items-center mt-4">
        <Button className="pl-0 text-base text-destructive " variant="ghost" >
          <Trash2Icon className="size-5" />
          Discard
        </Button>
        <Button className="bg-brand h-10 px-4 text-base">Save</Button>
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col gap-2 flex-1">
        <Label className="text-muted-foreground">Date</Label>
      <DatePickerDemo
        initialDate={passedWorkout?.date ?? format(new Date(), "yyyy-MM-dd")}
         /></div>
        <div className="flex flex-col gap-2 flex-1" >
        <Label className="text-muted-foreground">Time</Label>
      <Timesetter value={pickTime} onChange={setPickTime} /></div></div>
      <Input
        type="text"
        placeholder="Enter your title"
        className="pl-3.5 h-10"
        value={title}
        onChange={handleTitleChange}
      />

      {/*this is the use of new array called exercises. at first the exercises array is empty but when we click on the add
       new exercise then there is a new exercise added in the exercises array as you may have seen in the function called
      handleexerciseChange and in this ondelete is a callback function which means the button is in the child component and the
     function is in the parent component and it takes the argument of the exercise id so as to delete specifically that exc. */}
      {exercises.map((exercise) => (
        <Exercise
            key={exercise.id}
            exerciseData={exercise}
            onChange={handleExerciseChange}
          onDelete={() => handleDeleteExercise(exercise.id)}
          onEdit={() => {
                setEditingExerciseId(exercise.id)
                setShowExerciseSearch(true)
              }}
          />
        ))}

      {/*for the add new exercise button */}
      <Button className="bg-brand h-11" onClick={() => (setShowExerciseSearch(true))}>Add new Exercise</Button>

      {/* this is for modal which shows all the exercise list and the user can search their exercise for them to add it*/}
      {showExerciseSearch && (
         <ExerciseSearch
         onClose={() => {
             setShowExerciseSearch(false)
             setEditingExerciseId(null)
           }}
           onConfirm={handleConfirmExercise}
         />
       )}

    </div>
  )
}

export default Workout
