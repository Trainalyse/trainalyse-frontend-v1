import { Button } from "@workspace/ui/components/button"
import { useNavigate } from "react-router-dom"
import { workouts, type Workout } from "./data/workouts"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { format, parseISO } from "date-fns"
import React, { type ChangeEvent } from "react"
import { DatePickerDemo } from "./components/DatePicker"
import { Input } from "@workspace/ui/components/input"
import { CalendarIcon } from "lucide-react"
import { SearchIcon } from "lucide-react"
import { EllipsisVerticalIcon } from "lucide-react"
import { Separator } from "@workspace/ui/components/separator"

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
  function handleSettings() {
    navigate("/Settings")
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
      <main className="flex h-svh flex-col">
        <header className="mb-[12px] border-b border-[#FFFFFF1A] bg-[#26262680]">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-3xl font-bold text-brand">Trainalyse</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search by date"
                onClick={handleDateSearch}
                className="text-primary"
              >
                <CalendarIcon />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search by Title"
                onClick={handleTitleSearch}
                className="text-primary"
              >
                <SearchIcon />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Go to Settings"
                onClick={handleSettings}
                className="text-primary"
              >
                <EllipsisVerticalIcon />
              </Button>
            </div>
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
        </header>

        <section className="flex-1 overflow-y-auto">
          {filteredWorkouts.length > 0 ? (
            [...filteredWorkouts]
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((workout) => (
                <div key={workout.id}>
                  <Button
                    className="h-auto p-0 px-[23px] py-3"
                    variant="ghost"
                    onClick={() => handleWorkoutOpen(workout)}
                  >
                    <Card className="py-6 [--card-spacing:--spacing(6)]">
                      <CardHeader>
                        <CardTitle>{workout.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          {format(
                            parseISO(workout.date),
                            "EEEE, do MMMM, yyyy"
                          )}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <p>Created at {workout.time}</p>
                      </CardFooter>
                    </Card>
                  </Button>
                </div>
              ))
          ) : (
            <p>No workouts found</p>
          )}
          <Button onClick={handleClick}>+</Button>
        </section>
        <footer>
          <nav>
            <Button>Home</Button>
            <Button onClick={handleGraphs}>Graph</Button>
            <Button>Improve</Button>
            <Button>More</Button>
          </nav>
        </footer>
      </main>
    </>
  )
}
