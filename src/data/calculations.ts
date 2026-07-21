import { exercises } from "./exercise"
import { user } from "./user"
import { type Dropset } from "./workouts"
import { type LimbValues } from "./workouts"
import { type Limb } from "./workouts"
import { type WorkoutSet } from "./workouts"
import { type WorkoutExercise } from "./workouts"
import { type Workout } from "./workouts"
import { workouts } from "./workouts"
import { parse } from "date-fns"
import { format, parseISO } from "date-fns"

function limbVolume(limb: LimbValues, isBodyweight: boolean) {
  if (!isBodyweight) {
    return (limb.weights ?? 0) * (limb.reps ?? 0)
  } else {
    if (limb.difficulty === "normal") {
      return user.weight * (limb.reps ?? 0)
    } else if (limb.difficulty === "assisted") {
      return (user.weight - (limb.assistedWeights ?? 0)) * (limb.reps ?? 0)
    } else if (limb.difficulty === "weighted") {
      return (user.weight + (limb.extraWeights ?? 0)) * (limb.reps ?? 0)
    }
  }
  return 0
}

export function dropsetVolume(
  dropset: Dropset,
  isBodyweight: boolean,
  perLimb: boolean
) {
  let total = limbVolume(dropset.left, isBodyweight)
  if (perLimb) {
    total += limbVolume(dropset.right ?? dropset.left, isBodyweight)
  }
  return total
}

export function setVolume(
  set: WorkoutSet,
  isBodyweight: boolean,
  perLimb: boolean
) {
  let total = 0
  for (const dropset of set.dropsets) {
    total += dropsetVolume(dropset, isBodyweight, perLimb)
  }
  return total
}

export function exerciseVolume(exercise: WorkoutExercise) {
  const matchingExercise = exercises.find(
    (e) => e.name === exercise.exerciseName
  )
  const isBodyweight = matchingExercise?.isBodyweight ?? false
  const perLimb = exercise.perLimbEnabled ?? false
  let total = 0
  for (const set of exercise.sets) {
    total += setVolume(set, isBodyweight, perLimb)
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

function limbEndurance(limb: LimbValues, isBodyweight: boolean) {
  const seconds =
    (limb.hours ?? 0) * 3600 + (limb.minutes ?? 0) * 60 + (limb.seconds ?? 0)
  if (!isBodyweight) {
    return (limb.weights ?? 0) * seconds
  } else {
    if (limb.difficulty === "normal") {
      return seconds
    } else if (limb.difficulty === "assisted") {
      return (user.weight - (limb.assistedWeights ?? 0)) * seconds
    } else if (limb.difficulty === "weighted") {
      return (user.weight + (limb.extraWeights ?? 0)) * seconds
    }
  }
  return 0
}

export function dropsetEndurance(
  dropset: Dropset,
  isBodyweight: boolean,
  perLimb: boolean
) {
  let total = limbEndurance(dropset.left, isBodyweight)
  if (perLimb) {
    total += limbEndurance(dropset.right ?? dropset.left, isBodyweight)
  }
  return total
}

export function setEndurance(
  set: WorkoutSet,
  isBodyweight: boolean,
  perLimb: boolean
) {
  let total = 0
  for (const dropset of set.dropsets) {
    total += dropsetEndurance(dropset, isBodyweight, perLimb)
  }
  return total
}

export function exerciseEndurance(exercise: WorkoutExercise) {
  let total = 0
  const matchingExercise = exercises.find(
    (e) => e.name === exercise.exerciseName
  )
  const isBodyweight = matchingExercise?.isBodyweight ?? false
  const perLimb = exercise.perLimbEnabled ?? false
  for (const set of exercise.sets) {
    total += setEndurance(set, isBodyweight, perLimb)
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
          label:
            format(parseISO(workout.date), "d MMMM, yyyy") +
            ", " +
            workout.time,
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

function exerciseVolumeForLimb(exercise: WorkoutExercise, limb: Limb) {
  const matchingExercise = exercises.find(
    (e) => e.name === exercise.exerciseName
  )
  const isBodyweight = matchingExercise?.isBodyweight ?? false
  let total = 0
  for (const set of exercise.sets) {
    for (const dropset of set.dropsets) {
      total += limbVolume(dropset[limb] ?? dropset.left, isBodyweight)
    }
  }
  return total
}

export function instanceVolume(name: string) {
  const instances = getExerciseInstance(name)
  const chartPoint = instances.map((inst) => {
    const perLimb = inst.exercise.perLimbEnabled ?? false
    return {
      label: inst.label,
      volume: exerciseVolume(inst.exercise),
      volumeLeft: perLimb
        ? exerciseVolumeForLimb(inst.exercise, "left")
        : undefined,
      volumeRight: perLimb
        ? exerciseVolumeForLimb(inst.exercise, "right")
        : undefined,
    }
  })
  return chartPoint
}

export function instanceMaxWeight(name: string) {
  const instances = getExerciseInstance(name)
  return instances.map((inst) => {
    const perLimb = inst.exercise.perLimbEnabled ?? false
    let left = 0
    let right = 0
    for (const set of inst.exercise.sets) {
      for (const dropset of set.dropsets) {
        left = Math.max(left, dropset.left.weights ?? 0)
        right = Math.max(right, (dropset.right ?? dropset.left).weights ?? 0)
      }
    }
    return {
      label: inst.label,
      maxWeight: perLimb ? undefined : left,
      maxWeightLeft: perLimb ? left : undefined,
      maxWeightRight: perLimb ? right : undefined,
    }
  })
}

export function instanceTotalReps(name: string) {
  const instances = getExerciseInstance(name)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.left.difficulty === "normal")
      )
    )
    .map((inst) => {
      const perLimb = inst.exercise.perLimbEnabled ?? false
      let left = 0
      let right = 0
      for (const set of inst.exercise.sets) {
        for (const dropset of set.dropsets) {
          if (dropset.left.difficulty === "normal") {
            left += dropset.left.reps ?? 0
          }
          const r = dropset.right ?? dropset.left
          if (r.difficulty === "normal") {
            right += r.reps ?? 0
          }
        }
      }
      return {
        label: inst.label,
        totalReps: perLimb ? left + right : left,
        totalRepsLeft: perLimb ? left : undefined,
        totalRepsRight: perLimb ? right : undefined,
      }
    })
}

export function instanceMaxAssistedWeight(name: string) {
  const instances = getExerciseInstance(name)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.left.difficulty === "assisted")
      )
    )
    .map((inst) => {
      const perLimb = inst.exercise.perLimbEnabled ?? false
      let left = 0
      let right = 0
      for (const set of inst.exercise.sets) {
        for (const dropset of set.dropsets) {
          if (dropset.left.difficulty === "assisted") {
            left = Math.max(left, dropset.left.assistedWeights ?? 0)
          }
          const r = dropset.right ?? dropset.left
          if (r.difficulty === "assisted") {
            right = Math.max(right, r.assistedWeights ?? 0)
          }
        }
      }
      return {
        label: inst.label,
        maxAssistedWeight: perLimb ? undefined : left,
        maxAssistedWeightLeft: perLimb ? left : undefined,
        maxAssistedWeightRight: perLimb ? right : undefined,
      }
    })
}

export function instanceMaxExtraWeight(name: string) {
  const instances = getExerciseInstance(name)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.left.difficulty === "weighted")
      )
    )
    .map((inst) => {
      const perLimb = inst.exercise.perLimbEnabled ?? false
      let left = 0
      let right = 0
      for (const set of inst.exercise.sets) {
        for (const dropset of set.dropsets) {
          if (dropset.left.difficulty === "weighted") {
            left = Math.max(left, dropset.left.extraWeights ?? 0)
          }
          const r = dropset.right ?? dropset.left
          if (r.difficulty === "weighted") {
            right = Math.max(right, r.extraWeights ?? 0)
          }
        }
      }
      return {
        label: inst.label,
        maxExtraWeight: perLimb ? undefined : left,
        maxExtraWeightLeft: perLimb ? left : undefined,
        maxExtraWeightRight: perLimb ? right : undefined,
      }
    })
}

function exerciseEnduranceForLimb(exercise: WorkoutExercise, limb: Limb) {
  const matchingExercise = exercises.find(
    (e) => e.name === exercise.exerciseName
  )
  const isBodyweight = matchingExercise?.isBodyweight ?? false
  let total = 0
  for (const set of exercise.sets) {
    for (const dropset of set.dropsets) {
      total += limbEndurance(dropset[limb] ?? dropset.left, isBodyweight)
    }
  }
  return total
}

export function instanceEndurance(name: string) {
  const instances = getExerciseInstance(name)
  const chartPoint = instances.map((inst) => {
    const perLimb = inst.exercise.perLimbEnabled ?? false
    return {
      label: inst.label,
      endurance: exerciseEndurance(inst.exercise),
      enduranceLeft: perLimb
        ? exerciseEnduranceForLimb(inst.exercise, "left")
        : undefined,
      enduranceRight: perLimb
        ? exerciseEnduranceForLimb(inst.exercise, "right")
        : undefined,
    }
  })
  return chartPoint
}

export function instanceEnduranceMaxWeight(name: string) {
  const instances = getExerciseInstance(name)
  return instances.map((inst) => {
    const perLimb = inst.exercise.perLimbEnabled ?? false
    let left = 0
    let right = 0
    for (const set of inst.exercise.sets) {
      for (const dropset of set.dropsets) {
        left = Math.max(left, dropset.left.weights ?? 0)
        right = Math.max(right, (dropset.right ?? dropset.left).weights ?? 0)
      }
    }
    return {
      label: inst.label,
      maxEnduranceWeight: perLimb ? undefined : left,
      maxEnduranceWeightLeft: perLimb ? left : undefined,
      maxEnduranceWeightRight: perLimb ? right : undefined,
    }
  })
}

export function instanceTotalSeconds(name: string) {
  const instances = getExerciseInstance(name)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.left.difficulty === "normal")
      )
    )
    .map((inst) => {
      const perLimb = inst.exercise.perLimbEnabled ?? false
      let left = 0
      let right = 0
      for (const set of inst.exercise.sets) {
        for (const dropset of set.dropsets) {
          if (dropset.left.difficulty === "normal") {
            left +=
              (dropset.left.hours ?? 0) * 3600 +
              (dropset.left.minutes ?? 0) * 60 +
              (dropset.left.seconds ?? 0)
          }
          const r = dropset.right ?? dropset.left
          if (r.difficulty === "normal") {
            right +=
              (r.hours ?? 0) * 3600 + (r.minutes ?? 0) * 60 + (r.seconds ?? 0)
          }
        }
      }
      return {
        label: inst.label,
        totalSeconds: perLimb ? left + right : left,
        totalSecondsLeft: perLimb ? left : undefined,
        totalSecondsRight: perLimb ? right : undefined,
      }
    })
}

export function instanceEnduranceMaxAssistedWeight(name: string) {
  const instances = getExerciseInstance(name)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.left.difficulty === "assisted")
      )
    )
    .map((inst) => {
      const perLimb = inst.exercise.perLimbEnabled ?? false
      let left = 0
      let right = 0
      for (const set of inst.exercise.sets) {
        for (const dropset of set.dropsets) {
          if (dropset.left.difficulty === "assisted") {
            left = Math.max(left, dropset.left.assistedWeights ?? 0)
          }
          const r = dropset.right ?? dropset.left
          if (r.difficulty === "assisted") {
            right = Math.max(right, r.assistedWeights ?? 0)
          }
        }
      }
      return {
        label: inst.label,
        maxEnduranceAssistedWeight: perLimb ? undefined : left,
        maxEnduranceAssistedWeightLeft: perLimb ? left : undefined,
        maxEnduranceAssistedWeightRight: perLimb ? right : undefined,
      }
    })
}

export function instanceEnduranceMaxExtraWeight(name: string) {
  const instances = getExerciseInstance(name)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.left.difficulty === "weighted")
      )
    )
    .map((inst) => {
      const perLimb = inst.exercise.perLimbEnabled ?? false
      let left = 0
      let right = 0
      for (const set of inst.exercise.sets) {
        for (const dropset of set.dropsets) {
          if (dropset.left.difficulty === "weighted") {
            left = Math.max(left, dropset.left.extraWeights ?? 0)
          }
          const r = dropset.right ?? dropset.left
          if (r.difficulty === "weighted") {
            right = Math.max(right, r.extraWeights ?? 0)
          }
        }
      }
      return {
        label: inst.label,
        maxEnduranceExtraWeight: perLimb ? undefined : left,
        maxEnduranceExtraWeightLeft: perLimb ? left : undefined,
        maxEnduranceExtraWeightRight: perLimb ? right : undefined,
      }
    })
}
