import userData from "./user.json"

export type User = {
  username: string
  email: string
  age: number
  weight: number
  height: number
  activity: string
}

export const user = userData as User
