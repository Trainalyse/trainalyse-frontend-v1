import { Card, CardContent } from "./card"
import React from "react"
import { Button } from "./button"
import { X, Calendar } from "lucide-react"
import { Separator } from "./separator"
import { cn } from "@/lib/utils"

// height of each row
const ITEM_HEIGHT = 48

//all the months are defined
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

//alright this function just converts a number to string and makes the numbers 2 characters so say like
// the number is 5 then it will be shown as 05 and if the number is already 2 characters so it will be shown
// normally like 23 will be 23 .
function pad(n: number) {
  return String(n).padStart(2, "0")
}

//alright this function figures out the days in a month like feb has 28 based on the year and in leap year it has 29
// and some months have 30 and others have 31
function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate()
}

//okay this is what the wheel shows and what it computes like it shows the string 05 but it computes 5 as number
// and for year like it shows 2003 as a string and it computes 2003 as number
interface WheelItem {
  value: number
  label: string
}

//so this is just property of the wheel and it has wheel items and selected index of the labels which are
// shown in the bold and then it sends the selected index as number like callback function
interface WheelProps {
  items: WheelItem[]
  selectedIndex: number
  onSelectIndex: (index: number) => void
}

// one scrolling column. it seeds itself to the selected row on mount, tracks
// which row is centered locally (so the bold highlight follows the scroll with
// no lag), and reports the choice to the parent only once scrolling settles.
function Wheel({ items, selectedIndex, onSelectIndex }: WheelProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  // which row is in the center slot right now — local so the bold row updates
  // instantly, without waiting on a round-trip through the parent's state.
  const [center, setCenter] = React.useState(selectedIndex)

  // seed the scroll position once, when the wheel mounts (the modal opening).
  React.useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    viewport.scrollTop = selectedIndex * ITEM_HEIGHT
    setCenter(selectedIndex)
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    let settleTimer: ReturnType<typeof setTimeout>
    const handleScroll = () => {
      const index = Math.min(
        Math.max(Math.round(viewport.scrollTop / ITEM_HEIGHT), 0),
        items.length - 1
      )
      // update the bold row immediately as you scroll...
      setCenter(index)
      // ...but only tell the parent once you've stopped, so dependent lists
      // (like the day count reacting to the month) don't churn mid-scroll.
      clearTimeout(settleTimer)
      settleTimer = setTimeout(() => onSelectIndex(index), 80)
    }
    viewport.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      viewport.removeEventListener("scroll", handleScroll)
      clearTimeout(settleTimer)
    }
  }, [items.length, onSelectIndex])

  // clamp so a stale center (e.g. day 31 after switching to a short month)
  // still highlights a real row until the next scroll resyncs it.
  const boldIndex = Math.min(center, items.length - 1)

  return (
    <div
      ref={viewportRef}
      className="h-36 flex-1 snap-y snap-mandatory overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="h-12" />
      {items.map((item, i) => (
        <div
          key={item.value}
          className={cn(
            "flex h-12 snap-center items-center justify-center tabular-nums",
            i === boldIndex
              ? "text-2xl font-bold text-foreground"
              : "text-lg text-muted-foreground"
          )}
        >
          {item.label}
        </div>
      ))}
      <div className="h-12" />
    </div>
  )
}

interface DobsetterProps {
  value: string
  onChange: (value: string) => void
}

function Dobsetter({ value, onChange }: DobsetterProps) {
  const [open, setOpen] = React.useState(false)
  const [day, setDay] = React.useState(1)
  const [month, setMonth] = React.useState(1)
  const [year, setYear] = React.useState(2000)

  const currentYear = new Date().getFullYear()

  const dayItems = React.useMemo(
    () =>
      Array.from({ length: daysInMonth(month, year) }, (_, i) => ({
        value: i + 1,
        label: pad(i + 1),
      })),
    [month, year]
  )

  const monthItems = React.useMemo(
    () => MONTHS.map((label, i) => ({ value: i + 1, label })),
    []
  )

  const yearItems = React.useMemo(
    () =>
      Array.from({ length: currentYear - 1900 + 1 }, (_, i) => ({
        value: 1900 + i,
        label: String(1900 + i),
      })),
    [currentYear]
  )

  const clampedDay = Math.min(day, dayItems.length)

  function handleOpen() {
      const today = new Date()
      const parts = value.split("-").map(Number)
      const isValidDate = parts.length === 3 && parts.every(Number.isFinite)

      setYear(isValidDate ? parts[0] : today.getFullYear())
      setMonth(isValidDate ? parts[1] : today.getMonth() + 1)
      setDay(isValidDate ? parts[2] : today.getDate())
      setOpen(true)
    }

  function handleDone() {
    onChange(`${year}-${pad(month)}-${pad(clampedDay)}`)
    setOpen(false)
  }

  const triggerLabel = (() => {
    const [y, m, d] = value.split("-").map(Number)
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
      return "Select your date of birth"
    }
    return `${d} ${MONTHS[m - 1]} ${y}`
  })()

  return (
    <>
      {/* trigger styled to match the weight/height fields exactly: same box
          (py-1 wrapper + h-11 content), border, radius and text sizing. */}
      <button
        type="button"
        onClick={handleOpen}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--border-inputEdge)] bg-[var(--bg-inputBox)] py-1 pr-4 pl-3 text-left transition-colors outline-none"
      >
        <span
          className={cn(
            "flex h-11 items-center",
            value
              ? "text-xl font-semibold text-foreground"
              : "text-base text-muted-foreground"
          )}
        >
          {triggerLabel}
        </span>
        <Calendar className="size-5 shrink-0 text-[var(--text-subheading)]" />
      </button>

      {open && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="relative w-[320px] p-4">
            <div className="flex items-center justify-between">
              <Button type="button" onClick={handleDone}>
                Done
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </div>

            <CardContent className="px-0">
              <div className="relative flex">
                <Wheel
                  key={`day-${open}`}
                  items={dayItems}
                  selectedIndex={clampedDay - 1}
                  onSelectIndex={(i) => setDay(dayItems[i].value)}
                />
                <Wheel
                  key={`month-${open}`}
                  items={monthItems}
                  selectedIndex={month - 1}
                  onSelectIndex={(i) => setMonth(monthItems[i].value)}
                />
                <Wheel
                  key={`year-${open}`}
                  items={yearItems}
                  selectedIndex={year - 1900}
                  onSelectIndex={(i) => setYear(yearItems[i].value)}
                />
                <Separator className="pointer-events-none absolute inset-x-0 top-12" />
                <Separator className="pointer-events-none absolute inset-x-0 top-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default Dobsetter
