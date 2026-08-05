import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { CalendarModal } from "./CalendarModal"
import React from "react"

interface DatePickerDemoProps {
  initialDate?: string
  onDateChange?: (date: Date | undefined) => void
}

export function DatePickerDemo({
  initialDate,
  onDateChange,
}: DatePickerDemoProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    initialDate ? parseISO(initialDate) : undefined
  )
  const [open, setOpen] = React.useState<boolean>(false)

  function handleSelect(selected: Date | undefined) {
    setDate(selected)
    onDateChange?.(selected)
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        {date ? format(date, "EEE, d MMMM yyyy") : <span>Pick a date</span>}
      </Button>

      {open && (
        <CalendarModal
          onClose={() => setOpen(false)}
          selected={date}
          onSelect={handleSelect}
          // no logging workouts in the future
          maxDate={new Date()}
        />
      )}
    </>
  )
}
