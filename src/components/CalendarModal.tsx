import { Button } from "@/components/ui/button"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import React from "react"
import { X } from "lucide-react"

interface CalendarModalProps {
  onClose: () => void
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  // latest selectable day; every day after it is disabled (and the year/month
  // dropdowns stop here). omit for no upper bound.
  maxDate?: Date
}

// a date with the time-of-day stripped, so comparisons are day-accurate
function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

// the shared date-picker modal: a centered, blurred-backdrop card holding the
// styled calendar (month + year dropdowns, circular nav, neon today ring) and a
// "Jump to today" action. used by the workout date field and the DOB field.
// render it conditionally (`{open && <CalendarModal .../>}`) so it mounts fresh
// each time — the month view then starts on the selected date without an effect.
export function CalendarModal({
  onClose,
  selected,
  onSelect,
  maxDate,
}: CalendarModalProps) {
  const today = new Date()
  // is today itself out of the allowed range? (e.g. DOB capped at 2022) — if so
  // "Jump to today" is meaningless, and we open on maxDate's month instead.
  const todayOutOfRange =
    maxDate !== undefined && stripTime(today) > stripTime(maxDate)

  // the month the calendar is showing — controlled so "Jump to today" can move
  // the view. seeded from the selected date, else today (clamped to maxDate's
  // month when today is beyond the allowed range).
  const [month, setMonth] = React.useState<Date>(
    selected ?? (todayOutOfRange ? (maxDate as Date) : today)
  )

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 p-[var(--space-lg)] backdrop-blur-sm">
      <Card className="w-full max-w-[400px] gap-[var(--space-lg)] rounded-[var(--radius-card)] border-[var(--border-cardEdge)] bg-[var(--bg-surface-primary)] p-[var(--space-lg)]">
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close calendar"
            onClick={onClose}
            className="size-9 rounded-full bg-[var(--bg-surface-secondary)] text-[var(--text-primary)]"
          >
            <X className="size-5" strokeWidth={2} />
          </Button>
        </div>

        <Calendar
          className="w-full bg-transparent p-0 [--cell-size:--spacing(8)]"
          mode="single"
          animate
          fixedWeeks
          captionLayout="dropdown"
          startMonth={new Date(1900, 0)}
          endMonth={maxDate ?? new Date(new Date().getFullYear(), 11)}
          disabled={maxDate ? { after: maxDate } : undefined}
          month={month}
          onMonthChange={setMonth}
          selected={selected}
          onSelect={(date) => {
            onSelect(date)
            onClose()
          }}
          classNames={{
            root: "w-full",
            // drop the default grey "today" fill — today is a neon ring
            today: "",
            caption_label:
              "inline-flex items-center gap-1 text-lg font-bold text-[var(--text-primary)] [&>svg]:size-4 [&>svg]:text-[var(--text-subheading)]",
            dropdowns:
              "flex h-(--cell-size) w-full items-center justify-center gap-2",
            button_previous:
              "flex size-9 items-center justify-center rounded-full bg-[var(--bg-surface-secondary)] p-0 text-[var(--text-primary)] select-none aria-disabled:opacity-50",
            button_next:
              "flex size-9 items-center justify-center rounded-full bg-[var(--bg-surface-secondary)] p-0 text-[var(--text-primary)] select-none aria-disabled:opacity-50",
            weeks_before_enter: "cal-weeks-before-enter",
            weeks_before_exit: "cal-weeks-before-exit",
            weeks_after_enter: "cal-weeks-after-enter",
            weeks_after_exit: "cal-weeks-after-exit",
            caption_before_enter: "cal-caption-before-enter",
            caption_before_exit: "cal-caption-before-exit",
            caption_after_enter: "cal-caption-after-enter",
            caption_after_exit: "cal-caption-after-exit",
          }}
          components={{
            DayButton: (dayProps) => (
              <CalendarDayButton
                {...dayProps}
                className={cn(
                  dayProps.className,
                  dayProps.modifiers.outside &&
                    "text-[var(--text-dateOutside)]",
                  // today: neon number + neon ring. also override the selected
                  // white fill so that when today IS the picked date, it still
                  // reads as the ring, not a bright box.
                  dayProps.modifiers.today &&
                    "text-[var(--text-accent)] data-[selected-single=true]:bg-transparent data-[selected-single=true]:text-[var(--text-accent)] after:absolute after:inset-[4px] after:rounded-full after:border-2 after:border-[var(--text-accent)] after:content-['']"
                )}
              />
            ),
          }}
        />

        {/* only offer Jump to today when today is actually selectable */}
        {!todayOutOfRange && (
          <>
            <Separator className="bg-[var(--border-cardEdge)]" />
            <div className="flex items-center justify-end text-sm font-medium text-[var(--text-subheading)]">
              <button
                type="button"
                onClick={() => setMonth(new Date())}
                className="flex items-center gap-[var(--space-sm)] rounded-md outline-none transition-colors hover:text-[var(--text-primary)]"
              >
                <span className="size-4 rounded-full ring-2 ring-[var(--text-accent)] ring-inset" />
                Jump to today
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
