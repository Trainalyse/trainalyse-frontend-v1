import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "./ui/card"
import React from "react"
import { X } from "lucide-react"

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
  const [open,setOpen] = React.useState<boolean>(false)

  function handleSelect(selected: Date | undefined) {
    setDate(selected)
    onDateChange?.(selected)
  }

  return (
    <>

        <Button variant="outline" onClick={()=>(setOpen(true))} >
            {date ? format(date, "EEE, d MMMM yyyy") : <span>Pick a date</span>}
        </Button>
        {open  && (
          <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <Card className="relative p-4">
              <Calendar
                className="mt-6 [--cell-size:--spacing(9)]"
                mode="single"
                selected={date}
                onSelect={(selected) => {
                  handleSelect(selected)
                  setOpen(false)
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2.5"
                onClick={() => setOpen(false)}
              >
                <X className="size-8" strokeWidth="1.5" />
              </Button>
            </Card>
          </div>
        )}



    </>
  )
}
