import React, { type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent } from "@workspace/ui/components/card"

function Moreinfo() {
  const navigate = useNavigate()
  const [userAge, setUserAge] = React.useState("")
  const [userWeight, setUserWeight] = React.useState("")
  const [userHeight, setUserHeight] = React.useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate("/")
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Some more info</h1>
          <p className="text-muted-foreground">about you</p>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={userAge}
                onChange={(e) => setUserAge(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter your weight"
                value={userWeight}
                onChange={(e) => setUserWeight(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter your height"
                value={userHeight}
                onChange={(e) => setUserHeight(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default Moreinfo
