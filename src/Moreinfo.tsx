import React, { type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

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
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-bold">Some more info</h1>
          <p className="text-muted-foreground">about you</p>
        </div>

        <Card className="[--card-spacing:--spacing(6)]">
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  className="h-11"
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
                  className="h-11"
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
                  className="h-11"
                  id="height"
                  type="number"
                  placeholder="Enter your height"
                  value={userHeight}
                  onChange={(e) => setUserHeight(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="h-11 w-full">
              Submit
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default Moreinfo
