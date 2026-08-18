import workoutData from "./workouts.json"

export type Difficulty = "normal" | "assisted" | "weighted"

export type LimbValues = {
  difficulty?: Difficulty
  weights?: number
  assistedWeights?: number
  extraWeights?: number
  reps?: number
  hours?: number
  minutes?: number
  seconds?: number
}

export type Dropset = {
  id: number
  left: LimbValues
  right?: LimbValues
}

export type WorkoutSet = {
  id: number
  dropsets: Dropset[]
}

export type WorkoutExercise = {
  id: number
  // points at the catalog by id, not by name - a name is display text and can be
  // renamed or retyped, which would orphan every workout that logged it
  exerciseId: number
  sets: WorkoutSet[]
  perLimbEnabled?: boolean
  // optional free-text note the user jots about how the exercise felt. Absent /
  // empty string both mean "no note" — it's never required.
  notes?: string
}

export type Workout = {
  id: number
  date: string
  title: string
  time?: string
  exercises: WorkoutExercise[]
}

export type Limb = "left" | "right"

export const workouts = workoutData as Workout[]
