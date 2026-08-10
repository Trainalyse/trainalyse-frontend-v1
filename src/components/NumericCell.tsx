import * as React from "react"
import { Input } from "@/components/ui/input"
import { sanitizeNumeric, stripLeadingZeros } from "@/lib/number-input"

interface NumericCellProps {
  // the stored value stays a real number (clean for the volume math + backend);
  // undefined means the cell is empty
  value: number | undefined
  onChange: (value: number | undefined) => void
  intDigits: number
  fracDigits: number
  // hard ceiling — a keystroke that would push the value above this is rejected
  max?: number
  id?: string
  className?: string
  placeholder?: string
}

// turn a stored number into the string the field shows
function toDraft(value: number | undefined): string {
  return value == null ? "" : String(value)
}
// turn the field's string into a stored number (empty / "." → undefined)
function toValue(draft: string): number | undefined {
  if (draft === "") return undefined
  const n = parseFloat(draft)
  return Number.isNaN(n) ? undefined : n
}

// A single numeric set cell. It's a controlled TEXT input so we can fully shape
// the string (digit caps, comma-as-decimal, leading-zero cleanup, max ceiling),
// while the value it reports up stays a proper number.
function NumericCell({
  value,
  onChange,
  intDigits,
  fracDigits,
  max,
  id,
  className,
  placeholder,
}: NumericCellProps) {
  // the string being edited. seeded from the stored number and kept in sync when
  // that number changes from the outside (e.g. switching the active limb).
  const [draft, setDraft] = React.useState<string>(() => toDraft(value))

  // resync only when the external value no longer matches what the draft holds —
  // during normal typing they match (we report toValue(draft)), so the draft
  // (including a trailing ".") is never clobbered mid-edit.
  React.useEffect(() => {
    if (toValue(draft) !== value) setDraft(toDraft(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // tidy leading zeros a beat after typing stops ("020" → "20"). the numeric
  // value is unchanged by this, so no need to report it up again.
  React.useEffect(() => {
    if (draft === "") return
    const t = setTimeout(() => setDraft((d) => stripLeadingZeros(d)), 50)
    return () => clearTimeout(t)
  }, [draft])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = sanitizeNumeric(event.target.value, intDigits, fracDigits)
    // hard max: reject the keystroke if it would exceed the ceiling
    if (max !== undefined) {
      const n = toValue(next)
      if (n !== undefined && n > max) return
    }
    setDraft(next)
    onChange(toValue(next))
  }

  return (
    <Input
      type="text"
      inputMode="decimal"
      id={id}
      className={className}
      placeholder={placeholder}
      value={draft}
      onChange={handleChange}
    />
  )
}

export default NumericCell
