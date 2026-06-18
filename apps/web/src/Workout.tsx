"use client"
import { Input } from "@workspace/ui/components/input"
import React, { type ChangeEvent } from "react"
import { DatePickerDemo } from "./components/DatePicker"
import Exercise from "./Exercise"
import { type ExerciseType } from "./data/exercise"
import { Button } from "@workspace/ui/components/button"
import { useLocation } from "react-router-dom"

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
  const [title, setTitle] = React.useState("")
  const id = React.useId()
  const [exerciseArray, setExerciseArray] = React.useState(
    [
      {
        id: id + "-0",
        sets: [],
      },
    ] // pre-fill exercises if data was passed, otherwise start with one default
  )
  const location = useLocation()
  const time = location.state?.time

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
  }
  const counter = React.useRef(1)
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
      {time && (
        <p className="text-sm text-muted-foreground">Started at {time}</p>
      )}
      <DatePickerDemo />
      <Input
        type="text"
        placeholder="Enter your title"
        value={title}
        onChange={handleTitleChange}
      />
      {exerciseArray.map((exercise, index) => (
        <Exercise key={exercise.id} number={index + 1} />
      ))}
      <Button onClick={handleExerciseAddition}>+ for Exercises</Button>
      {exerciseArray.length > 1 && (
        <Button onClick={handleMinus}>- for Exercises</Button>
      )}
    </>
  )
}

export default Workout
