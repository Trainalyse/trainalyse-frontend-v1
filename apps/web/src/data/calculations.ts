import { exercises } from "./exercise"
import { user } from "./user"
import { type Dropset } from "./workouts"
import { type WorkoutSet } from "./workouts"
import { type WorkoutExercise } from "./workouts"
import { type Workout } from "./workouts"

export function dropsetVolume(dropset: Dropset, isBodyweight: boolean) {
  if (!isBodyweight) {
    return (dropset.weights ?? 0) * (dropset.reps ?? 0)
  } else if (isBodyweight) {
    if (dropset.difficulty === "normal") {
      return user.weight * (dropset.reps ?? 0)
    } else if (dropset.difficulty === "assisted") {
      return (
        (user.weight - (dropset.assistedWeights ?? 0)) * (dropset.reps ?? 0)
      )
    } else if (dropset.difficulty === "weighted") {
      return (user.weight + (dropset.extraWeights ?? 0)) * (dropset.reps ?? 0)
    }
  }
  return 0
}

export function setVolume(set: WorkoutSet, isBodyweight: boolean) {
  let total = 0
  for (const dropset of set.dropsets) {
    total += dropsetVolume(dropset, isBodyweight)
  }
  return total
}

export function exerciseVolume(exercise: WorkoutExercise) {
  const matchingExercise = exercises.find(
    (e) => e.name === exercise.exerciseName
  )
  const isBodyweight = matchingExercise?.isBodyweight ?? false
  let total = 0
  for (const set of exercise.sets) {
    total += setVolume(set, isBodyweight)
  }
  return total
}

export function workoutVolume(workout: Workout) {
  let total = 0
  for (const exercise of workout.exercises) {
    total += exerciseVolume(exercise)
  }
  return total
}

export function dropsetEndurance(dropset: Dropset, isBodyweight: boolean) {
  if (!isBodyweight) {
    return (
      (dropset.weights ?? 0) *
      ((dropset.hours ?? 0) * 3600 +
        (dropset.minutes ?? 0) * 60 +
        (dropset.seconds ?? 0))
    )
  } else if (isBodyweight) {
    if (dropset.difficulty === "normal") {
      return (
        (dropset.hours ?? 0) * 3600 +
        (dropset.minutes ?? 0) * 60 +
        (dropset.seconds ?? 0)
      )
    } else if (dropset.difficulty === "assisted") {
      return (
        (user.weight - (dropset.assistedWeights ?? 0)) *
        ((dropset.hours ?? 0) * 3600 +
          (dropset.minutes ?? 0) * 60 +
          (dropset.seconds ?? 0))
      )
    } else if (dropset.difficulty === "weighted") {
      return (
        (user.weight + (dropset.extraWeights ?? 0)) *
        ((dropset.hours ?? 0) * 3600 +
          (dropset.minutes ?? 0) * 60 +
          (dropset.seconds ?? 0))
      )
    }
  }
  return 0
}

export function setEndurance(set: WorkoutSet, isBodyweight: boolean) {
  let total = 0
  for (const dropset of set.dropsets) {
    total += dropsetEndurance(dropset, isBodyweight)
  }
  return total
}

export function exerciseEndurance(exercise: WorkoutExercise) {
  let total = 0
  const matchingExercise = exercises.find(
    (e) => e.name === exercise.exerciseName
  )
  const isBodyweight = matchingExercise?.isBodyweight ?? false
  for (const set of exercise.sets) {
    total += setEndurance(set, isBodyweight)
  }
  return total
}

export function workoutEndurance(workout: Workout) {
  let total = 0
  for (const exercise of workout.exercises) {
    total += exerciseEndurance(exercise)
  }
  return total
}
