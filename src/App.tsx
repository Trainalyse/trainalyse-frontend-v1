import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { workouts, type Workout } from "./data/workouts"
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
    navigate("/Workout", { state: { time } })
  }
  const titleSearchRef = React.useRef<HTMLInputElement>(null)
  const [searchMode, setSearchMode] = React.useState<"none" | "date" | "title">(
    "none"
  )
  const [dateSearched, setDateSearched] = React.useState<Date>()
  const [titleSearched, setTitleSearched] = React.useState("")
  const [showSearchBar, setShowSearchBar] = React.useState(false)

  function handleTitleTypeForSearch(e: ChangeEvent<HTMLInputElement>) {
    setTitleSearched(e.target.value)
  }
  function handleDateSearch() {
    setSearchMode("date")
    setTitleSearched("")
  }
  function handleTitleSearch() {
    setSearchMode("title")
    setShowSearchBar((current) => !current)
    setDateSearched(undefined)
  }
  function handleWorkoutOpen(workout: Workout) {
    navigate("/Workout", { state: { workout } })
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

  React.useEffect(() => {
    if (showSearchBar) {
      titleSearchRef.current?.focus()
    }
  }, [showSearchBar])

  return (
    <>
      {searchMode === "date" && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="relative p-4">
            <Calendar
              className="mt-6 [--cell-size:--spacing(9)]"
              mode="single"
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
          {showSearchBar ? (
            <div className="-mr-1.5 flex min-h-[80px] items-center justify-between gap-7 px-[var(--space-23)] py-6">
              <Input
                className="h-11 origin-left scale-x-100 opacity-100 transition duration-500 ease-out starting:scale-x-0 starting:opacity-0"
                type="text"
                placeholder="Enter the title of the workout"
                value={titleSearched}
                ref={titleSearchRef}
                onChange={handleTitleTypeForSearch}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowSearchBar(false)
                  setTitleSearched("")
                }}
              >
                <X className="size-8" strokeWidth="1.5" />
              </Button>
            </div>
          ) : (
            <div className="flex min-h-[80px] items-center justify-between px-[var(--space-23)] py-6">
              <h1 className="text-2xl font-bold text-brand">Trainalyse</h1>
              <div className="-mr-3 flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Search by date"
                  onClick={handleDateSearch}
                  className="size-11 text-primary"
                >
                  <CalendarIcon className="size-5" strokeWidth={2.25} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Search by Title"
                  onClick={handleTitleSearch}
                  className="size-11 text-primary"
                >
                  <SearchIcon className="size-5" strokeWidth={2.25} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Go to Settings"
                  onClick={handleSettings}
                  className="size-11 text-primary"
                >
                  <Settings className="size-5" strokeWidth={2.25} />
                </Button>
              </div>
            </div>
          )}
        </header>

        <section className="flex-1 overflow-y-auto">
          {workouts.length === 0 ? (
            <div className="flex h-full items-center justify-center px-8 text-center text-muted-foreground">
              <p>Start logging — your workouts will show up here.</p>
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
        {dateSearched && (
          <Button
            className="absolute bottom-0 mb-4 self-center bg-brand"
            onClick={() => setDateSearched(undefined)}
          >
            Clear Date
          </Button>
        )}

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
