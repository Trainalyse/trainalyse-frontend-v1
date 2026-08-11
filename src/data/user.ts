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
//we defined a specific User type that anywhere in this project , the User would be used it should look like this and not
// like any other thing so import userdata which is a loose json but we define a User type and then we export a const user
// variable which contains the userdata json but in the form of type User.
export const user = userData as User
