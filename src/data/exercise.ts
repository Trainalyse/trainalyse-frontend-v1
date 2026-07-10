import exerciseData from "./exercise.json"

export type ExerciseType = "weightsAndReps" | "duration"

export type Exercise = {
  id: number
  name: string
  type: ExerciseType
  isBodyweight: boolean
}

export const exercises = exerciseData as Exercise[]
