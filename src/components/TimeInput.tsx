import { type KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"

interface TimeInputProps {
  hours?: number
  minutes?: number
  seconds?: number
  onChange: (value: { hours: number; minutes: number; seconds: number }) => void
}

const pad = (n: number) => String(n).padStart(2, "0")

// A single masked HH:MM:SS field with right-aligned "timer" entry: digits fill
// from the RIGHT (type 30 → 00:00:30, type 2030 → 00:20:30), Backspace pops the
// last digit. The whole value is derived from the hours/minutes/seconds props,
// so there is no internal state to keep in sync — every keystroke just recomputes
// h/m/s and hands them up via onChange.
function TimeInput({ hours = 0, minutes = 0, seconds = 0, onChange }: TimeInputProps) {
  // Durations are usually under an hour, and HH:MM:SS is the widest cell in the
  // row — so only show the hours group once there actually are hours; otherwise
  // MM:SS. Entry is unaffected: keystrokes recompute from `digits`, not this.
  const display = hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`
  // the 6 significant digits with leading zeros stripped = what's been "typed so far"
  const digits = `${pad(hours)}${pad(minutes)}${pad(seconds)}`.replace(/^0+/, "")
  const isEmpty = !hours && !minutes && !seconds

  // turn a (≤6)-digit string back into h/m/s: pad to 6, split into three pairs
  function commit(next: string) {
    const p = next.padStart(6, "0")
    onChange({
      hours: Number(p.slice(0, 2)),
      minutes: Number(p.slice(2, 4)),
      seconds: Number(p.slice(4, 6)),
    })
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key >= "0" && e.key <= "9") {
      e.preventDefault()
      commit((digits + e.key).slice(-6)) // append, keep only the last 6 digits
    } else if (e.key === "Backspace") {
      e.preventDefault()
      commit(digits.slice(0, -1))
    }
    // Tab / arrows / etc. fall through so the field stays keyboard-navigable
  }

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={display}
      onChange={() => {}}
      onKeyDown={handleKeyDown}
      className={`w-full min-w-0 px-0 text-sm tabular-nums border-0 bg-transparent dark:bg-transparent text-left shadow-none focus-visible:ring-0 ${
        isEmpty ? "text-muted-foreground" : ""
      }`}
    />
  )
}

export default TimeInput
