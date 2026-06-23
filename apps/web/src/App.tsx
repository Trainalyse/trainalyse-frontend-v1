import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { useNavigate } from "react-router-dom"
import { workouts, type Workout } from "./data/workouts"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { format, parseISO } from "date-fns"
import React, { type ChangeEvent } from "react"
import { DatePickerDemo } from "./components/DatePicker"
import { Input } from "@workspace/ui/components/input"

export function App() {
  const navigate = useNavigate()
  const handleClick = () => {
    const time = new Date().toLocaleString()
    navigate("/Workout", { state: { time } })
  }

  const [searchMode, setSearchMode] = React.useState<"none" | "date" | "title">(
    "none"
  )
  const [dateSearched, setDateSearched] = React.useState<Date>()
  const [titleSearched, setTitleSearched] = React.useState("")

  function handleTitleTypeForSearch(e: ChangeEvent<HTMLInputElement>) {
    setTitleSearched(e.target.value)
  }
  function handleDateSearch() {
    setSearchMode("date")
    setTitleSearched("")
  }
  function handleTitleSearch() {
    setSearchMode("title")
    setDateSearched(undefined)
  }
  function handleWorkoutOpen(workout: Workout) {
    navigate("/Workout", { state: { workout } })
  }

  function handleGraphs() {
    navigate("/Graphs")
  }

  const filteredWorkouts = dateSearched
    ? workouts.filter(
        (workout) => workout.date === format(dateSearched, "yyyy-MM-dd")
      )
    : titleSearched
      ? workouts.filter((workout) =>
          workout.title.toLowerCase().includes(titleSearched.toLowerCase())
        )
      : workouts

  return (
    <>
      <header>
        <div>
          <h1>Trainalyse</h1>
          <Button onClick={handleDateSearch}>Date</Button>
          <Button onClick={handleTitleSearch}>Title</Button>
          <Button>Settings</Button>
        </div>
        {searchMode === "date" && (
          <DatePickerDemo onDateChange={setDateSearched} />
        )}
        {searchMode === "title" && (
          <Input
            type="text"
            placeholder="enter the title of the workout"
            value={titleSearched}
            onChange={handleTitleTypeForSearch}
          />
        )}
        <Separator />
        {filteredWorkouts.length > 0 ? (
          [...filteredWorkouts]
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((workout) => (
              <div key={workout.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{workout.title}</CardTitle>
                    <CardAction>
                      <Button onClick={() => handleWorkoutOpen(workout)}>
                        Open
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <p>
                      {format(parseISO(workout.date), "EEEE, do MMMM, yyyy")}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p>Created at {workout.time}</p>
                  </CardFooter>
                </Card>
              </div>
            ))
        ) : (
          <p>No workouts found</p>
        )}

        <Separator />
        <footer>
          <Button onClick={handleClick}>+</Button>
          <nav>
            <Button>Home</Button>
            <Button onClick={handleGraphs}>Graph</Button>
            <Button>Improve</Button>
            <Button>More</Button>
          </nav>
        </footer>
      </header>
    </>
  )
}
