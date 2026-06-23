import { exercises } from "./exercise"
import { user } from "./user"
import { type Dropset } from "./workouts"
import { type WorkoutSet } from "./workouts"
import { type WorkoutExercise } from "./workouts"
import { type Workout } from "./workouts"
import { workouts } from "./workouts"
import { parse } from "date-fns"

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

export function getExerciseInstance(name: string) {
  const result = []
  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      if (name === exercise.exerciseName) {
        result.push({
          date: workout.date,
          time: workout.time,
          exercise: exercise,
        })
      }
    }
  }
  return result.sort((a, b) => {
    const aTime = parse(
      `${a.date} ${a.time}`,
      "yyyy-MM-dd h:mm a",
      new Date()
    ).getTime()
    const bTime = parse(
      `${b.date} ${b.time}`,
      "yyyy-MM-dd h:mm a",
      new Date()
    ).getTime()
    return aTime - bTime
  })
}

export function instanceVolume(name: string) {
  const instances = getExerciseInstance(name)
  const chartPoint = instances.map((inst) => ({
    label: inst.date + "," + inst.time,
    volume: exerciseVolume(inst.exercise),
  }))
  return chartPoint
}

export function instanceMaxWeight(name: string) {
  const instances = getExerciseInstance(name)
  return instances.map((inst) => {
    let maxWeight = 0
    for (const set of inst.exercise.sets) {
      for (const dropset of set.dropsets) {
        maxWeight = Math.max(maxWeight, dropset.weights ?? 0)
      }
    }
    return { label: inst.date + ", " + inst.time, maxWeight: maxWeight }
  })
}

export function instanceTotalReps(name: string) {
  const instances = getExerciseInstance(name)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.difficulty === "normal")
      )
    )
    .map((inst) => {
      let totalReps = 0
      for (const set of inst.exercise.sets) {
        for (const dropset of set.dropsets) {
          if (dropset.difficulty === "normal") {
            totalReps += dropset.reps ?? 0
          }
        }
      }
      return {
        label: inst.date + ", " + inst.time,
        totalReps: totalReps,
      }
    })
}

export function instanceMaxAssistedWeight(name: string) {
  const instances = getExerciseInstance(name)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.difficulty === "assisted")
      )
    )
    .map((inst) => {
      let maxAssistedWeight = 0
      for (const set of inst.exercise.sets) {
        for (const dropset of set.dropsets) {
          if (dropset.difficulty === "assisted") {
            maxAssistedWeight = Math.max(
              maxAssistedWeight,
              dropset.assistedWeights ?? 0
            )
          }
        }
      }
      return {
        label: inst.date + ", " + inst.time,
        maxAssistedWeight: maxAssistedWeight,
      }
    })
}

export function instanceMaxExtraWeight(name: string) {
  const instances = getExerciseInstance(name)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.difficulty === "weighted")
      )
    )
    .map((inst) => {
      let maxExtraWeight = 0
      for (const set of inst.exercise.sets) {
        for (const dropset of set.dropsets) {
          if (dropset.difficulty === "weighted") {
            maxExtraWeight = Math.max(maxExtraWeight, dropset.extraWeights ?? 0)
          }
        }
      }
      return {
        label: inst.date + ", " + inst.time,
        maxExtraWeight: maxExtraWeight,
      }
    })
}

export function instanceEndurance(name: string) {
  const instances = getExerciseInstance(name)
  const chartPoint = instances.map((inst) => ({
    label: inst.date + "," + inst.time,
    endurance: exerciseEndurance(inst.exercise),
  }))
  return chartPoint
}

export function instanceEnduranceMaxWeight(name: string) {
  const instances = getExerciseInstance(name)
  return instances.map((inst) => {
    let maxEnduranceWeight = 0
    for (const set of inst.exercise.sets) {
      for (const dropset of set.dropsets) {
        maxEnduranceWeight = Math.max(maxEnduranceWeight, dropset.weights ?? 0)
      }
    }
    return {
      label: inst.date + ", " + inst.time,
      maxEnduranceWeight: maxEnduranceWeight,
    }
  })
}

export function instanceTotalSeconds(name: string) {
  const instances = getExerciseInstance(name)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.difficulty === "normal")
      )
    )
    .map((inst) => {
      let totalSeconds = 0
      for (const set of inst.exercise.sets) {
        for (const dropset of set.dropsets) {
          if (dropset.difficulty === "normal") {
            totalSeconds +=
              (dropset.hours ?? 0) * 3600 +
              (dropset.minutes ?? 0) * 60 +
              (dropset.seconds ?? 0)
          }
        }
      }
      return {
        label: inst.date + ", " + inst.time,
        totalSeconds: totalSeconds,
      }
    })
}

export function instanceEnduranceMaxAssistedWeight(name: string) {
  const instances = getExerciseInstance(name)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.difficulty === "assisted")
      )
    )
    .map((inst) => {
      let maxEnduranceAssistedWeight = 0
      for (const set of inst.exercise.sets) {
        for (const dropset of set.dropsets) {
          if (dropset.difficulty === "assisted") {
            maxEnduranceAssistedWeight = Math.max(
              maxEnduranceAssistedWeight,
              dropset.assistedWeights ?? 0
            )
          }
        }
      }
      return {
        label: inst.date + ", " + inst.time,
        maxEnduranceAssistedWeight: maxEnduranceAssistedWeight,
      }
    })
}

export function instanceEnduranceMaxExtraWeight(name: string) {
  const instances = getExerciseInstance(name)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.difficulty === "weighted")
      )
    )
    .map((inst) => {
      let maxEnduranceExtraWeight = 0
      for (const set of inst.exercise.sets) {
        for (const dropset of set.dropsets) {
          if (dropset.difficulty === "weighted") {
            maxEnduranceExtraWeight = Math.max(
              maxEnduranceExtraWeight,
              dropset.extraWeights ?? 0
            )
          }
        }
      }
      return {
        label: inst.date + ", " + inst.time,
        maxEnduranceExtraWeight: maxEnduranceExtraWeight,
      }
    })
}
