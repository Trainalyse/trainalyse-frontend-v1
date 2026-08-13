//so it says that import all the named exports form the react library under the name React and it is different from the line
// import React from react because the react library dosent have any default exports and so it can break
import * as React from "react"
import { warnToast } from "@/components/warn-toast"
import { Input } from "@/components/ui/input"
import { sanitizeNumeric, stripLeadingZeros } from "@/lib/number-input"

//interface and type are used for explaining the shape of objects and they are almost interchangeable but
// you see these unions right number | underfined , these type of unions are not allowed in interface outside of
// curly brackets but you can use it in type like type lol = number | undefined but in interface you would have to do
// interface something {
//  lol : number | undefined
//  }
interface NumericCellProps {
  // the stored value stays a real number (clean for the volume math + backend);
  // undefined means the cell is empty
  value: number | undefined
  onChange: (value: number | undefined) => void
  intDigits: number
  fracDigits: number
  // hard ceiling — a keystroke that would push the value above this is rejected
  max?: number
  // shown as a toast when a keystroke is rejected for exceeding `max`, so the
  // user understands WHY the value won't go in (e.g. the allowed range). No
  // message = silent reject (previous behaviour).
  rejectMessage?: string
  id?: string
  className?: string
  placeholder?: string
}// this is for the weights input that we are entering in the dropset inputs

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
// the above 2 functions are used when the user is typing number in the input and on screen it is turning to a string from a
// number and then in the background for all the graph calculations it is  turning to the number from a string and nan is a
// check for the parsing of a number to string and nan(not a number) checks that if the parsing was successfull or not.

// A single numeric set cell. It's a controlled TEXT input so we can fully shape
// the string (digit caps, comma-as-decimal, leading-zero cleanup, max ceiling),
// while the value it reports up stays a proper number.
function NumericCell({
  value,
  onChange,
  intDigits,
  fracDigits,
  max,
  rejectMessage,
  id,
  className,
  placeholder,
}: NumericCellProps) {
  // the string being edited. seeded from the stored number and kept in sync when
  // that number changes from the outside (e.g. switching the active limb).
  const [draft, setDraft] = React.useState<string>(() => toDraft(value))
  // stable id so repeated over-limit keystrokes refresh ONE toast instead of
  // stacking a new one per rejected key.
  const toastId = React.useId()

  // keeps the two copies of the value in sync: the parent owns `value` (a number),
  // this cell owns `draft` (the string in the box). they can drift apart, so:
  //
  //   - when `value` changes from the OUTSIDE (e.g. switching the active limb),
  //     the draft is now stale and we copy the new number back down into it.
  //   - when the change came from the user TYPING, `value` also changed (handleChange
  //     reports it up), so this effect still fires — but here draft and value already
  //     agree, so we must NOT touch the draft or we'd eat characters like a trailing ".".
  //
  // the `if` tells the two apart: toValue(draft) === value means "this change was my
  // own typing, leave it alone"; they only differ on a genuine outside change, which
  // is the one case we actually resync. runs on [value] only — draft is left out of
  // the deps on purpose (that's the eslint-disable), since typing must not re-trigger it.
  React.useEffect(() => {
    // intentional controlled resync: copy the number back down ONLY when it
    // changed from the outside (see the block comment above). safe here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    const raw = event.target.value
    const next = sanitizeNumeric(raw, intDigits, fracDigits)
    const n = toValue(next)

    // Two ways a keystroke gets blocked, both worth a toast (deduped by toastId)
    // so it isn't a silent mystery:
    //   1. overMax   — the value would exceed the ceiling (e.g. assisted > bodyweight)
    //   2. droppedChar — the sanitiser threw the character away: too many digits
    //      (the 4999.99 / 99999 caps), a 2nd decimal point, or a decimal in an
    //      integer-only cell. That shows up as "the raw input changed, but
    //      sanitising collapsed it right back to the current draft".
    const overMax = max !== undefined && n !== undefined && n > max
    const droppedChar = next === draft && raw !== draft
    if (overMax || droppedChar) {
      if (rejectMessage) warnToast(rejectMessage, toastId)
      return
    }

    setDraft(next)
    onChange(n)
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

// so this file's main job is that it is giving an input that has the conditions for the tightness of the component that i
// wanted. there are 2 main effects here: one handles stripping away leading 0s after 50ms (like "02" showing as "2" only),
// and the other handles something far trickier — keeping the box in sync when the value changes from outside.
//
// the mechanism: the parent holds the VALUE which is a number, but on screen the user is typing TEXT. so the user types
// "20" as the DRAFT, and here the draft is leading — it then gets converted into the number (value) by toValue via parsing.
// so during normal typing, draft leads and value follows.
//
// the tricky case is when the user switches to the other limb after typing in one. the DRAFT goes stale, not the value:
// the value is already the correct new-limb number, but the draft still shows the old text. e.g. user types "20" in the
// left limb and switches to the right limb — the box must now show the RIGHT limb's value (empty if it was never filled,
// or its own number if it has one), not the leftover "20". here the value leads, and effect A syncs the stale draft up
// to match it so the display is never stale.
