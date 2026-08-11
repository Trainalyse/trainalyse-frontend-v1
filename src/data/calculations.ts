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

//it is a new variable which is like limbvalues but it is empty
const EMPTY_LIMB: LimbValues = {}


// so this is a function which has vairable like dropset which is like Dropset and then catalogperlimb is like
// whether the switch should be provided or not and then the enabled basically is the switch is on or not
// and this function will return the values which would be either like limbvalues or null and inside the function
// if the switch is not there then return null for the right side ,else if the enabled is on then return the values
// input in the right or if they are not just use the empty values and if the switch is off , then just duplicate
// whatever there is on the left.
function effectiveRight(
  dropset: Dropset,
  catalogPerLimb: boolean,
  enabled: boolean
): LimbValues | null {
  if (!catalogPerLimb) return null
  return enabled ? (dropset.right ?? EMPTY_LIMB) : dropset.left
}// the result of this is either null or dropset.left or dropset.right if the user has given the input and this is just for
//right side

//this function takes the values that are input and just the smallest unit for the volume calculation, so it is basically
// calculating the volume of one side dropset across all cases where the volume can be calculated
// dont confuse this limb with workout.ts Limb because this is small l and it is same as Limbvalues
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
}//this calculates volume for the dropset on one side , whichever side is given to this function
//we can assume the above function to be like atom

// this function is basically calculating dropset volume for both left and right side
// so the above function is for only one side and this function is for both sides combined.
export function dropsetVolume(
  dropset: Dropset,
  isBodyweight: boolean,
  catalogPerLimb: boolean,
  enabled: boolean
) {
  let total = limbVolume(dropset.left, isBodyweight)
  const right = effectiveRight(dropset, catalogPerLimb, enabled)
  if (right) {
    //here we have used right instead of dropset.right becauase right can be anything it could be null
    // , it could be dropset.left and it could be dropset.right so we gave it a general name.
    total += limbVolume(right, isBodyweight)
  }
  return total
}//this sums both sides and gives us the dropset volume
//we can assume this function to be like a molecule

//just a set volume
export function setVolume(
  set: WorkoutSet,
  isBodyweight: boolean,
  catalogPerLimb: boolean,
  enabled: boolean
) {
  let total = 0
  for (const dropset of set.dropsets) {
    total += dropsetVolume(dropset, isBodyweight, catalogPerLimb, enabled)
  }
  return total
}//we can assume this function to be like a bigger molecule

//just a exercise volume
export function exerciseVolume(exercise: WorkoutExercise) {
  const matchingExercise = exercises.find(
    (e) => e.id === exercise.exerciseId
  )
  const isBodyweight = matchingExercise?.isBodyweight ?? false
  // catalogPerLimb = can this exercise EVER be split (dumbbell/cable)?; enabled =
  // did the user turn the switch ON for this instance? Both feed effectiveRight.
  const catalogPerLimb = matchingExercise?.perLimb ?? false
  const enabled = exercise.perLimbEnabled ?? false
  let total = 0
  for (const set of exercise.sets) {
    total += setVolume(set, isBodyweight, catalogPerLimb, enabled)
  }
  return total
}// this function can be assumed to be like a compound and this function is for exercises like when we have to show the
//total volume for a exercise , like say the exercise is bench press where the switch is not provided and
// lets say the exercise is like bicep curl but the switch is off then we need this function but when the switch is on
// then we need the other function named exercisevolumeforlimb

//workout volume - dont know what is the use for this
export function workoutVolume(workout: Workout) {
  let total = 0
  for (const exercise of workout.exercises) {
    total += exerciseVolume(exercise)
  }
  return total
}// i am still thinking of how can i use this cause on the home page , i dont think displaying it is the right idea
//cause the user might get demotivated

// this is just like limbvolume but instead its for endurance.
function limbEndurance(limb: LimbValues, isBodyweight: boolean) {
  const seconds =
    (limb.hours ?? 0) * 3600 + (limb.minutes ?? 0) * 60 + (limb.seconds ?? 0)
  if (!isBodyweight) {
    return (limb.weights ?? 0) * seconds
  } else {
    if (limb.difficulty === "normal") {
      // bodyweight × seconds — consistent with assisted/weighted below (and with
      // volume's bodyweight × reps), so all three difficulties share the same
      // kg·seconds unit and combine cleanly on one endurance graph.
      return user.weight * seconds
    } else if (limb.difficulty === "assisted") {
      return (user.weight - (limb.assistedWeights ?? 0)) * seconds
    } else if (limb.difficulty === "weighted") {
      return (user.weight + (limb.extraWeights ?? 0)) * seconds
    }
  }
  return 0
}

//this is some of both sides left and right for dropset, just like dropsetvolume
export function dropsetEndurance(
  dropset: Dropset,
  isBodyweight: boolean,
  catalogPerLimb: boolean,
  enabled: boolean
) {
  let total = limbEndurance(dropset.left, isBodyweight)
  const right = effectiveRight(dropset, catalogPerLimb, enabled)
  if (right) {
    total += limbEndurance(right, isBodyweight)
  }
  return total
}

//set endurance
export function setEndurance(
  set: WorkoutSet,
  isBodyweight: boolean,
  catalogPerLimb: boolean,
  enabled: boolean
) {
  let total = 0
  for (const dropset of set.dropsets) {
    total += dropsetEndurance(dropset, isBodyweight, catalogPerLimb, enabled)
  }
  return total
}

//exercise endurance
export function exerciseEndurance(exercise: WorkoutExercise) {
  let total = 0
  const matchingExercise = exercises.find(
    (e) => e.id === exercise.exerciseId
  )
  const isBodyweight = matchingExercise?.isBodyweight ?? false
  const catalogPerLimb = matchingExercise?.perLimb ?? false
  const enabled = exercise.perLimbEnabled ?? false
  for (const set of exercise.sets) {
    total += setEndurance(set, isBodyweight, catalogPerLimb, enabled)
  }
  return total
}

//whole workout endurance, dont know yet what is the use of this just like workout volume
export function workoutEndurance(workout: Workout) {
  let total = 0
  for (const exercise of workout.exercises) {
    total += exerciseEndurance(exercise)
  }
  return total
}

//its like gathering all the instances of one exercise in one array
export function getExerciseInstance(exerciseId: number) {
  const result = []
  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      if (exerciseId === exercise.exerciseId) {
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
}// graph is like searching all the instances of a exercise like say bench press then it has the id and the id is given
//to this function and all the instances from all the workouts are gathered here for that exercise

// so this is for the cases where we have to calculate the volume for both limbs separately , the earlier function for
// the exercise volume was for the cases where there was no swtich or the switch was off.
function exerciseVolumeForLimb(exercise: WorkoutExercise, limb: Limb) {
  const matchingExercise = exercises.find(
    (e) => e.id === exercise.exerciseId
  )
  const isBodyweight = matchingExercise?.isBodyweight ?? false
  let total = 0
  for (const set of exercise.sets) {
    for (const dropset of set.dropsets) {
      total += limbVolume(dropset[limb] ?? EMPTY_LIMB, isBodyweight)
    }
  }
  return total
}// this function is being used when the total exercise volume function is not being used like when the switch is on.

//this is for getting volume for each and every instance that is stored in that results array
// in getting the instance function.
export function instanceVolume(exerciseId: number) {
  const instances = getExerciseInstance(exerciseId)
  const chartPoint = instances.map((inst) => {
    const perLimb = inst.exercise.perLimbEnabled ?? false
    return {
      label: inst.label,
      // switch on = left/right only, switch off = one total line. never both.
      volume: perLimb ? undefined : exerciseVolume(inst.exercise),
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

//this is for getting the max wewight lifted based on the switch is on or off, if the switch is not provided or it is
// off then the max weight is calculated from the left and if it is on then both limbs are accounted for.
// works for both exercise types - the weights field is the same whether its reps or duration, so the
// duration charts use this too. the type gate lives in Graphs, not here.
export function instanceMaxWeight(exerciseId: number) {
  const instances = getExerciseInstance(exerciseId)
  return instances.map((inst) => {
    const matchingExercise = exercises.find(
      (e) => e.id === inst.exercise.exerciseId
    )
    const catalogPerLimb = matchingExercise?.perLimb ?? false
    const enabled = inst.exercise.perLimbEnabled ?? false
    let left = 0
    let right = 0
    for (const set of inst.exercise.sets) {
      for (const dropset of set.dropsets) {
        left = Math.max(left, dropset.left.weights ?? 0)
        // effectiveRight handles barbell (null) / switch off (mirror) / switch on
        const r = effectiveRight(dropset, catalogPerLimb, enabled)
        if (r) {
          right = Math.max(right, r.weights ?? 0)
        }
      }
    }
    return {
      label: inst.label,
      maxWeight: enabled ? undefined : left,
      maxWeightLeft: enabled ? left : undefined,
      maxWeightRight: enabled ? right : undefined,
    }
  })
}

//
export function instanceTotalReps(exerciseId: number) {
  const instances = getExerciseInstance(exerciseId)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.left.difficulty === "normal")
      )
    )
    .map((inst) => {
      const matchingExercise = exercises.find(
        (e) => e.id === inst.exercise.exerciseId
      )
      const catalogPerLimb = matchingExercise?.perLimb ?? false
      const enabled = inst.exercise.perLimbEnabled ?? false
      let left = 0
      let right = 0
      for (const set of inst.exercise.sets) {
        for (const dropset of set.dropsets) {
          if (dropset.left.difficulty === "normal") {
            left += dropset.left.reps ?? 0
          }
          // right already accounts for mirror (switch off) / none (barbell)
          const r = effectiveRight(dropset, catalogPerLimb, enabled)
          if (r && r.difficulty === "normal") {
            right += r.reps ?? 0
          }
        }
      }
      return {
        label: inst.label,
        // right is 0 (barbell), a left-mirror (switch off), or the real right
        // (switch on), so the combined total is just left + right in every case
        totalReps: left + right,
        // split lines only when the switch is genuinely ON (a real imbalance)
        totalRepsLeft: enabled ? left : undefined,
        totalRepsRight: enabled ? right : undefined,
      }
    })
}

//this is for max assistance taken. used by both exercise types, same as instanceMaxWeight.
export function instanceMaxAssistedWeight(exerciseId: number) {
  const instances = getExerciseInstance(exerciseId)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.left.difficulty === "assisted")
      )
    )
    .map((inst) => {
      const matchingExercise = exercises.find(
        (e) => e.id === inst.exercise.exerciseId
      )
      const catalogPerLimb = matchingExercise?.perLimb ?? false
      const enabled = inst.exercise.perLimbEnabled ?? false
      let left = 0
      let right = 0
      for (const set of inst.exercise.sets) {
        for (const dropset of set.dropsets) {
          if (dropset.left.difficulty === "assisted") {
            left = Math.max(left, dropset.left.assistedWeights ?? 0)
          }
          // effectiveRight handles barbell (null) / switch off (mirror) / switch on
          const r = effectiveRight(dropset, catalogPerLimb, enabled)
          if (r && r.difficulty === "assisted") {
            right = Math.max(right, r.assistedWeights ?? 0)
          }
        }
      }
      return {
        label: inst.label,
        maxAssistedWeight: enabled ? undefined : left,
        maxAssistedWeightLeft: enabled ? left : undefined,
        maxAssistedWeightRight: enabled ? right : undefined,
      }
    })
}

//this is for max extra weight lifted. used by both exercise types, same as instanceMaxWeight.
export function instanceMaxExtraWeight(exerciseId: number) {
  const instances = getExerciseInstance(exerciseId)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.left.difficulty === "weighted")
      )
    )
    .map((inst) => {
      const matchingExercise = exercises.find(
        (e) => e.id === inst.exercise.exerciseId
      )
      const catalogPerLimb = matchingExercise?.perLimb ?? false
      const enabled = inst.exercise.perLimbEnabled ?? false
      let left = 0
      let right = 0
      for (const set of inst.exercise.sets) {
        for (const dropset of set.dropsets) {
          if (dropset.left.difficulty === "weighted") {
            left = Math.max(left, dropset.left.extraWeights ?? 0)
          }
          // effectiveRight handles barbell (null) / switch off (mirror) / switch on
          const r = effectiveRight(dropset, catalogPerLimb, enabled)
          if (r && r.difficulty === "weighted") {
            right = Math.max(right, r.extraWeights ?? 0)
          }
        }
      }
      return {
        label: inst.label,
        maxExtraWeight: enabled ? undefined : left,
        maxExtraWeightLeft: enabled ? left : undefined,
        maxExtraWeightRight: enabled ? right : undefined,
      }
    })
}

//this is same exercisevolumeforlimb function , just takes into account for the cases in which the switch is on.
function exerciseEnduranceForLimb(exercise: WorkoutExercise, limb: Limb) {
  const matchingExercise = exercises.find(
    (e) => e.id === exercise.exerciseId
  )
  const isBodyweight = matchingExercise?.isBodyweight ?? false
  let total = 0
  for (const set of exercise.sets) {
    for (const dropset of set.dropsets) {
      total += limbEndurance(dropset[limb] ?? EMPTY_LIMB, isBodyweight)
    }
  }
  return total
}

//this is for the chartline same as instancevolume function
export function instanceEndurance(exerciseId: number) {
  const instances = getExerciseInstance(exerciseId)
  const chartPoint = instances.map((inst) => {
    const perLimb = inst.exercise.perLimbEnabled ?? false
    return {
      label: inst.label,
      // switch on = left/right only, switch off = one total line. never both.
      endurance: perLimb ? undefined : exerciseEndurance(inst.exercise),
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

export function instanceTotalSeconds(exerciseId: number) {
  const instances = getExerciseInstance(exerciseId)
  return instances
    .filter((inst) =>
      inst.exercise.sets.some((set) =>
        set.dropsets.some((dropset) => dropset.left.difficulty === "normal")
      )
    )
    .map((inst) => {
      const matchingExercise = exercises.find(
        (e) => e.id === inst.exercise.exerciseId
      )
      const catalogPerLimb = matchingExercise?.perLimb ?? false
      const enabled = inst.exercise.perLimbEnabled ?? false
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
          // right already accounts for mirror (switch off) / none (barbell)
          const r = effectiveRight(dropset, catalogPerLimb, enabled)
          if (r && r.difficulty === "normal") {
            right +=
              (r.hours ?? 0) * 3600 + (r.minutes ?? 0) * 60 + (r.seconds ?? 0)
          }
        }
      }
      return {
        label: inst.label,
        totalSeconds: left + right,
        totalSecondsLeft: enabled ? left : undefined,
        totalSecondsRight: enabled ? right : undefined,
      }
    })
}
