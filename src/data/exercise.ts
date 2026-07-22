//this imports data in exercisejson as exercisedata
import exerciseData from "./exercise.json"

//this is for defining exercise type as weightAndReps and duration
export type ExerciseType = "weightsAndReps" | "duration"

//this is defining the exercise Type
export type Exercise = {
  id: number
  name: string
  type: ExerciseType
  isBodyweight: boolean
  perLimb?: boolean
}

//now we define a new variable as exercisedata and it will be a Exercise array so we give the shape to exercise data
export const exercises = exerciseData as Exercise[]

//this shape is followed in all the files of the json and then ts
