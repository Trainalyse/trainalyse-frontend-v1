import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { workouts, type Workout } from "./data/workouts" // we imported both the workouts and the type Workout and mind you that workouts is in the shape of Workout[]
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { workoutVolume, workoutEndurance } from "./data/calculations"
import { cn } from "@/lib/utils"
import { format, parse, parseISO } from "date-fns"
import React, { type ChangeEvent } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { CalendarIcon } from "lucide-react"
import { SearchIcon } from "lucide-react"
import { Settings } from "lucide-react"
import { Plus } from "lucide-react"
import { X } from "lucide-react"

// one grey pill inside a workout card. the number plus its short unit (vol. /
// endu. / exc.), 8px apart from its neighbours via the row's gap.
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[var(--bg-surface-secondary)] px-3 py-1.5 text-sm whitespace-nowrap text-[var(--color-white-2)]">
      {children}
    </span>
  )
}

// the title row + pill row for a single workout. the duration pill is held back
// until Save is wired, so only three pills can show: volume and endurance are
// hidden at 0, exercise count always shows.
function WorkoutContent({
  workout,
  showDay,
}: {
  workout: Workout
  showDay: boolean
}) {
  const volume = workoutVolume(workout)
  const endurance = workoutEndurance(workout)
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg leading-tight font-bold text-primary">
          {workout.title}
        </h3>
        {/* the day-of-week is a property of the date, so it renders once per
            card — on the top workout only, not on each workout. */}
        {showDay && (
          <span className="mt-0.5 shrink-0 text-sm font-semibold text-[var(--text-subheading)]">
            {format(parseISO(workout.date), "EEE")}
          </span>
        )}
      </div>
      <div className="mt-[var(--space-md)] flex flex-wrap gap-[var(--space-sm)]">
        {volume > 0 && <Pill>{volume} vol.</Pill>}
        {endurance > 0 && <Pill>{endurance} endu.</Pill>}
        <Pill>{workout.exercises.length} exc.</Pill>
      </div>
    </>
  )
}

// the left rail for one date: the day number with its month below, plus a
// track holding one circle (centred on the card) and the connecting line. the
// line hides above the first card and below the last so it never crosses a
// month heading, and each half reaches 6px into the 12px inter-card gap so the
// two halves meet and read as one continuous line.
function TimelineRail({
  date,
  isFirst,
  isLast,
}: {
  date: string
  isFirst: boolean
  isLast: boolean
}) {
  return (
    // items-center centers the date label on the card; the track alone stretches
    // to full card height (self-stretch) to carry the line, so the date and the
    // circle both sit on the card's exact centerline.
    <div className="flex items-center gap-2">
      <div className="flex w-9 flex-col items-start">
        <span className="text-xl leading-none font-bold text-primary">
          {format(parseISO(date), "d")}
        </span>
        <span className="mt-1 text-sm font-medium text-[var(--text-subheading)]">
          {format(parseISO(date), "MMM")}
        </span>
      </div>
      <div className="relative w-3 self-stretch">
        {!isFirst && (
          <span className="absolute top-[-6px] bottom-1/2 left-1/2 w-px -translate-x-1/2 bg-[rgb(var(--white-channels)/20%)]" />
        )}
        {!isLast && (
          <span className="absolute top-1/2 bottom-[-6px] left-1/2 w-px -translate-x-1/2 bg-[rgb(var(--white-channels)/20%)]" />
        )}
        <span className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-white-2)]" />
      </div>
    </div>
  )
}

// one date's card. a single workout fills the card and the whole card taps
// through to it; two workouts stack most-recent-first, split by a separator,
// and each half is its own tap target (12px of breathing room each side of the
// separator, 16px at the outer top and bottom).
function DateCard({
  group,
  onOpen,
}: {
  group: { date: string; items: Workout[] }
  onOpen: (workout: Workout) => void
}) {
  const twoUp = group.items.length > 1
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--bg-surface-primary)]">
      {group.items.map((workout, i) => (
        <React.Fragment key={workout.id}>
          {i > 0 && (
            <Separator className="mx-[var(--space-md)] data-horizontal:w-auto bg-[var(--border-cardEdge)]" />
          )}
          <button
            type="button"
            onClick={() => onOpen(workout)}
            className={cn(
              // 12px side padding lives on the button so the whole area, gutters
              // included, is the tap target for its workout.
              "block w-full px-[var(--space-md)] text-left",
              !twoUp && "py-[var(--space-lg)]",
              twoUp && i === 0 && "pt-[var(--space-lg)] pb-[var(--space-md)]",
              twoUp && i > 0 && "pt-[var(--space-md)] pb-[var(--space-lg)]"
            )}
          >
            <WorkoutContent workout={workout} showDay={i === 0} />
          </button>
        </React.Fragment>
      ))}
    </div>
  )
}


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

  // this function is for the onchange of the title input , so that the ui keeps in sync with what the user is typing.
  // it also clears any active date search (the date filter otherwise wins over the title one), so typing a title
  // drops the user straight onto the title results without a stale date hiding them.
  function handleTitleTypeForSearch(e: ChangeEvent<HTMLInputElement>) {
    setTitleSearched(e.target.value)
    setDateSearched(undefined)
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

  // group the filtered workouts for the timeline: newest date first, then
  // workouts sharing a date collapse into one card (most recent time on top),
  // and finally those date-cards are grouped under their month heading so a
  // heading only renders once per month that has a hit.
  const sortedWorkouts = [...filteredWorkouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const dateGroups: { date: string; items: Workout[] }[] = []
  for (const workout of sortedWorkouts) {
    const last = dateGroups[dateGroups.length - 1]
    if (last && last.date === workout.date) last.items.push(workout)
    else dateGroups.push({ date: workout.date, items: [workout] })
  }
  for (const group of dateGroups) {
    group.items.sort(
      (a, b) =>
        parse(b.time ?? "12:00 AM", "h:mm a", new Date()).getTime() -
        parse(a.time ?? "12:00 AM", "h:mm a", new Date()).getTime()
    )
  }
  const monthGroups: { label: string; groups: typeof dateGroups }[] = []
  for (const group of dateGroups) {
    const label = format(parseISO(group.date), "MMMM yyyy")
    const last = monthGroups[monthGroups.length - 1]
    if (last && last.label === label) last.groups.push(group)
    else monthGroups.push({ label, groups: [group] })
  }

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
                className="h-11 pr-10 pl-10"
                type="text"
                placeholder="Search by title"
                value={titleSearched}
                onChange={handleTitleTypeForSearch}
              />
              {/* one-tap clear for the whole title, shown only while there's text to erase */}
              {titleSearched && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setTitleSearched("")}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  <X className="size-5" />
                </button>
              )}
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
            // 23px side gutters, 16px top/bottom for the middle area, and 16px
            // between month blocks (last card of one month to the next heading).
            <div className="flex flex-col gap-[var(--space-lg)] px-[var(--space-23)] py-[var(--space-lg)]">
              {monthGroups.map((month) => (
                // 16px between the heading and its first card.
                <div key={month.label} className="flex flex-col gap-[var(--space-lg)]">
                  <h2 className="text-2xl font-bold text-primary">
                    {month.label}
                  </h2>
                  {/* 12px between date-cards within the same month. each row
                      pairs the timeline rail with its card. */}
                  <div className="flex flex-col gap-[var(--space-md)]">
                    {month.groups.map((group, i) => (
                      <div
                        key={group.date}
                        className="flex items-stretch gap-4"
                      >
                        <TimelineRail
                          date={group.date}
                          isFirst={i === 0}
                          isLast={i === month.groups.length - 1}
                        />
                        <div className="min-w-0 flex-1">
                          <DateCard group={group} onOpen={handleWorkoutOpen} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
