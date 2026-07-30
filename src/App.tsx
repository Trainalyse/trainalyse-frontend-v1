import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { workouts, type Workout } from "./data/workouts" // we imported both the workouts and the type Workout and mind you that workouts is in the shape of Workout[]
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { format, parseISO } from "date-fns"
import React, { type ChangeEvent } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { CalendarIcon } from "lucide-react"
import { SearchIcon } from "lucide-react"
import { Settings } from "lucide-react"
import { Plus } from "lucide-react"
import { X } from "lucide-react"


export function App() {
  const navigate = useNavigate()
  const handleClick = () => {
    const time = new Date().toLocaleString()
    navigate("/Workout", { state: { time } })// here we are navigating to workout page when we click on + button and state is a way so that we can transfer a data while navigating
  }
  // this here is used so that we know what the user is searching at a time like with date or title or nothing.
  const [searchMode, setSearchMode] = React.useState<"none" | "date" | "title">(
    "none"
  )

  const [dateSearched, setDateSearched] = React.useState<Date>()
  const [titleSearched, setTitleSearched] = React.useState("")

  // this function is for the onchange of the title input , so that the ui keeps in sync with what the user is typing
  function handleTitleTypeForSearch(e: ChangeEvent<HTMLInputElement>) {
    setTitleSearched(e.target.value)
  }

  //this function is for setting the searchmode to date and clear the title so that the user can search with either date or tile at a time
  function handleDateSearch() {
    setSearchMode("date")
    setTitleSearched("")
  }

  //this function occurs when we click on the logged workouts and it takes us to workout page but with the prefilled workout data and that is
  // done by passing it through state and in that we pass workout : workout or simply workout
  function handleWorkoutOpen(workout: Workout) {
    navigate("/Workout", { state: { workout } })
  }

  // this is simple
  function handleSettings() {
    navigate("/Settings")
  }

  //this here shows the workouts but there is a catch , so if the user is searching with date it will show only those
  // workouts that are on that date and if not then if the user is searching with title it will show only those workouts
  // and if none of that then it will show all the workouts that were logged.
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
      {searchMode === "date" && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="relative p-4">
            <Calendar
              className="mt-6 [--cell-size:--spacing(9)]"
              mode="single" // allows only one date selection and not a range
              selected={dateSearched}
              onSelect={(date) => {
                setDateSearched(date)
                setSearchMode("none")
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2.5"
              onClick={() => setSearchMode("none")}
            >
              <X className="size-8" strokeWidth="1.5" />
            </Button>
          </Card>
        </div>
      )}
      <main className="relative flex min-h-0 flex-1 flex-col">
        <header className="mb-[var(--space-md)] border-b border-[var(--border-cardEdge)] bg-[var(--bg-surface-secondary)] pt-[env(safe-area-inset-top)]">
          <div className="flex flex-col gap-[var(--space-md)] px-[var(--space-23)] pt-6 pb-4">
            {/* Wordmark + circular icon buttons (calendar opens date search, gear opens settings) */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-brand">Trainalyse</h1>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Search by date"
                  onClick={handleDateSearch}
                  className="size-9 rounded-full text-primary"
                >
                  <CalendarIcon className="size-5" strokeWidth={2.25} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Go to Settings"
                  onClick={handleSettings}
                  className="size-9 rounded-full text-primary"
                >
                  <Settings className="size-5" strokeWidth={2.25} />
                </Button>
              </div>
            </div>

            {/* Persistent title search — the leading icon is decorative, the Input drives titleSearched */}
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-11 pl-10"
                type="text"
                placeholder="Search by title"
                value={titleSearched}
                onChange={handleTitleTypeForSearch}
              />
            </div>
          </div>
        </header>

        {/*in this section we handle all the 4 cases that the workouts can be displayed like, that are
         1. all the workouts that are saved are shown
        2. there are no workouts saved so show a text for the user to start logging the workouts
       3. the user is searching with date for the workouts so those workouts only which are on that date
      4.  the user is searching with title for the workouts so those workouts only which are with that title */}
        <section className="flex-1 overflow-y-auto">
          {workouts.length === 0 ? (
            <div className="flex h-full items-center justify-center px-8 text-center text-muted-foreground">
              <p>Start logging — your workouts will show up here.</p>{/*when there is no workout saved , this will show */}
            </div>
          ) : filteredWorkouts.length > 0 ? (
            [...filteredWorkouts]
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((workout) => (
                <div key={workout.id}>
                  <Button
                    className="h-auto w-full p-0 px-[var(--space-23)] py-2"
                    variant="ghost"
                    onClick={() => handleWorkoutOpen(workout)}
                  >
                    <Card className="w-full gap-0 rounded-[var(--radius-card)] bg-[var(--bg-surface-primary)] py-0 [--card-spacing:--spacing(6)]">
                      <CardHeader className="flex flex-col items-start pt-[14px] pb-3">
                        <CardTitle className="text-base font-normal">
                          {workout.title}
                        </CardTitle>
                        <CardDescription>
                          {format(
                            parseISO(workout.date),
                            "EEEE, do MMMM, yyyy"
                          )}
                        </CardDescription>
                      </CardHeader>
                      {/*<CardFooter className="rounded-b-[var(--radius-card)] border-[var(--border-cardEdge)] bg-[var(--bg-surface-secondary)] py-3 text-xs text-muted-foreground">
                        <p>Created at {workout.time}</p>
                      </CardFooter>*/}
                    </Card>
                  </Button>
                </div>
              ))
          ) : (
            <div className="flex h-full items-center justify-center px-8 text-center text-muted-foreground">
              <p>
                {dateSearched
                  ? `No workouts on ${format(dateSearched, "EEEE, do MMMM, yyyy")}`
                  : "No workouts by this title"}
              </p>
            </div>
          )}
        </section>

        {/*this is for the button which clears the date so that all the workouts are shown normally */}
        {dateSearched && (
          <Button
            className="absolute bottom-0 mb-4 self-center bg-brand"
            onClick={() => setDateSearched(undefined)}
          >
            Clear Date
          </Button>
        )}

        {/* this is for the + button*/}
        <Button
          aria-label="Add workout"
          size="icon"
          className="absolute right-[var(--space-23)] bottom-6 size-[60px] rounded-full bg-brand text-[var(--bg-surface-primary)] shadow-lg hover:bg-brand/90"
          onClick={handleClick}
        >
          <Plus className="size-8" strokeWidth={2.5} />
        </Button>
      </main>
    </>
  )
}
