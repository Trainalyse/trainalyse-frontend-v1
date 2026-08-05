import userData from "./user.json"

export type User = {
  username: string
  email: string
  dob: string // "YYYY-MM-DD"
  weight: number
  weightUnit: "kg" | "lbs"
  height: number
  heightUnit: "cm" | "ft"
  activity: string
}

export const user = userData as User
