"use client"
import { Input } from "@/components/ui/input"
import React, { type ChangeEvent } from "react"
import { DatePickerDemo } from "./components/DatePicker"
import Exercise from "./Exercise"
import { type ExerciseType } from "./data/exercise"
import { Button } from "@/components/ui/button"
import { useLocation } from "react-router-dom"
import { type Workout as WorkoutData } from "./data/workouts"
import { format } from "date-fns"
import Timesetter from "@/components/ui/timesetter"

interface Dropset {
  id: number
  weight?: number
  reps?: number
  minutes?: number
  seconds?: number
  hours?: number
}

interface Set {
  id: number
  dropsets: Dropset[]
}

interface Exercise {
  id: number
  exerciseName: string
  exerciseType: ExerciseType
  sets: Set[]
}

function Workout() {
  const location = useLocation()
  const passedWorkout = location.state?.workout as WorkoutData | undefined
  const [title, setTitle] = React.useState(passedWorkout?.title || "")
  const [pickTime, setPickTime] = React.useState(
    passedWorkout?.time ?? format(new Date(), "HH:mm")
  )
  const id = React.useId()
  // one structural slot per passed exercise, otherwise a single empty one.
  // The actual data is passed down by index from passedWorkout below.
  const [exerciseArray, setExerciseArray] = React.useState(
    passedWorkout
      ? passedWorkout.exercises.map((_, index) => ({
          id: id + "-" + index,
          sets: [],
        }))
      : [{ id: id + "-0", sets: [] }]
  )

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
  }
  const counter = React.useRef(
    passedWorkout ? passedWorkout.exercises.length : 1
  )
  function handleExerciseAddition() {
    setExerciseArray([
      ...exerciseArray,
      {
        id: id + "-" + counter.current++,
        sets: [],
      },
    ])
  }
  function handleMinus() {
    if (exerciseArray.length > 0) {
      const updatedExercises = exerciseArray.slice(0, -1) //0th to last element but the last element is excluded
      setExerciseArray(updatedExercises)
    }
  }

  return (
    <>
      <DatePickerDemo
        initialDate={passedWorkout?.date ?? format(new Date(), "yyyy-MM-dd")}
      />
      <Timesetter value={pickTime} onChange={setPickTime} />
      <Input
        type="text"
        placeholder="Enter your title"
        value={title}
        onChange={handleTitleChange}
      />
      {exerciseArray.map((exercise, index) => (
        <Exercise
          key={exercise.id}
          number={index + 1}
          exerciseData={passedWorkout?.exercises[index]}
        />
      ))}
      <Button onClick={handleExerciseAddition}>+ for Exercises</Button>
      {exerciseArray.length > 1 && (
        <Button onClick={handleMinus}>- for Exercises</Button>
      )}
    </>
  )
}

export default Workout
