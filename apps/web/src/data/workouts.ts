import workoutData from "./workouts.json"

export type Difficulty = "normal" | "assisted" | "weighted"

export type Dropset = {
  id: number
  difficulty?: Difficulty
  weight?: number
  reps?: number
  hours?: number
  minutes?: number
  seconds?: number
}

export type WorkoutSet = {
  id: number
  dropsets: Dropset[]
}

export type WorkoutExercise = {
  id: number
  exerciseName: string
  sets: WorkoutSet[]
}

export type Workout = {
  id: number
  date: string
  title: string
  time?: string
  exercises: WorkoutExercise[]
}

export const workouts = workoutData as Workout[]
