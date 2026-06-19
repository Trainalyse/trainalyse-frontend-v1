import { format, parseISO } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
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

  function handleSelect(selected: Date | undefined) {
    setDate(selected)
    onDateChange?.(selected)
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className="w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          >
            <CalendarIcon />
            {date ? format(date, "EEEE") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={handleSelect} />
        </PopoverContent>
      </Popover>

      {date && (
        <p className="mt-2 text-sm text-muted-foreground">
          {format(date, "PPP")} — {format(date, "EEEE")}
        </p>
      )}
    </>
  )
}
