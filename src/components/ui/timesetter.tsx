import { Card, CardContent } from "./card"
import React from "react"
import { Button } from "./button"
import { X } from "lucide-react"
import { ScrollArea } from "./scroll-area"
import { Separator } from "./separator"
import { cn } from "@/lib/utils"
import { useScrollLock } from "@/hooks/use-scroll-lock"

function pad(n: number) {
  return String(n).padStart(2, "0")
}

interface WheelProps {
  length: number
  selected: number
  onSelect: (n: number) => void
}

// One scrolling column of numbers (0 .. length-1). The number sitting in the
// center slot is the selected one — we read that from the scroll position.
function Wheel({ length, selected, onSelect }: WheelProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const itemRef = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const viewport = viewportRef.current
    const item = itemRef.current
    if (!viewport || !item) return
    // measure the row's real height rather than hardcoding 48px, so the scroll
    // math stays correct even if the root font-size changes what h-12 (3rem)
    // resolves to (the spacers and center band are rem-based and scale with it)
    const itemHeight = item.offsetHeight || 48
    // start scrolled so the initially-selected number is in the center slot
    viewport.scrollTop = selected * itemHeight
    const handleScroll = () => {
      const index = Math.round(viewport.scrollTop / itemHeight)
      onSelect(Math.min(Math.max(index, 0), length - 1))
    }
    viewport.addEventListener("scroll", handleScroll, { passive: true })
    return () => viewport.removeEventListener("scroll", handleScroll)
    // run once, when the wheel mounts (i.e. when the modal opens)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScrollArea
      viewportRef={viewportRef}
      viewportClassName="snap-y snap-mandatory"
      className="h-36 flex-1 [&_[data-slot=scroll-area-scrollbar]]:hidden"
    >
      {/* top spacer: lets the first number reach the center slot, and doubles
          as the measuring reference for the true row height */}
      <div ref={itemRef} className="h-12" />
      {Array.from({ length }, (_, i) => i).map((n) => (
        <div
          key={n}
          className={cn(
            "flex h-12 snap-center items-center justify-center tabular-nums",
            n === selected
              ? "text-2xl font-bold text-foreground"
              : "text-lg text-muted-foreground"
          )}
        >
          {pad(n)}
        </div>
      ))}
      {/* bottom spacer: lets the last number reach the center slot */}
      <div className="h-12" />
    </ScrollArea>
  )
}

interface TimesetterProps {
  value: string
  onChange: (value: string) => void
}

function Timesetter({ value, onChange }: TimesetterProps) {
  const [open, setOpen] = React.useState(false)
  const [hour, setHour] = React.useState(0)
  const [minute, setMinute] = React.useState(0)

  // freeze the page behind while the picker is open so it can't scroll
  useScrollLock(open)

  // On open, seed the wheels from the incoming value (so the modal always
  // opens on the current time; closing with X just discards any scrolling).
  function handleOpen() {
    const [h, m] = value.split(":").map(Number)
    setHour(Number.isFinite(h) ? h : 0)
    setMinute(Number.isFinite(m) ? m : 0)
    setOpen(true)
  }

  function handleDone() {
    onChange(`${pad(hour)}:${pad(minute)}`)
    setOpen(false)
  }

  return (
    <>
      {/* TRIGGER: the field showing the prefilled time. */}
      <Button variant="outline" className="w-full" onClick={handleOpen}>
        {value}
      </Button>

      {/* MODAL: blurred, centered backdrop (same as the calendar). */}
      {open && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="relative w-[320px] p-4">
            {/* TOP BAR: Done (left), X (right) */}
            <div className="flex items-center justify-between">
              <Button onClick={handleDone}>Done</Button>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X />
              </Button>
            </div>

            <CardContent className="px-0">
              {/* column headings so it's clear which wheel is hours vs minutes.
                  two flex-1 cells line up with the two flex-1 wheels below. */}
              <div className="mb-2 flex text-center text-xs font-medium tracking-wider ">
                <div className="flex-1 text-xl ">Hr</div>
                <div className="flex-1 text-xl ">Min</div>
              </div>
              <div className="relative flex">
                <Wheel length={24} selected={hour} onSelect={setHour} />
                <Wheel length={60} selected={minute} onSelect={setMinute} />
                {/* center selection band: two lines bracketing the middle slot */}
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

export default Timesetter
