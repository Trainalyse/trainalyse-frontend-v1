import * as React from "react"

// trim the ends of a value, and optionally squeeze internal whitespace runs down
// to a single space ("a   b" -> "a b"). used at submit and on blur.
export function normalizeText(value: string, collapseInternal = false): string {
  const trimmed = value.trim()
  return collapseInternal ? trimmed.replace(/\s+/g, " ") : trimmed
}

// keeps a text field free of edge whitespace while allowing spaces between
// characters. leading spaces are stripped a beat after typing (safe — this can
// never touch a space between words); trailing spaces (and, when
// collapseInternal is set, doubled-up internal spaces) are removed when the
// field loses focus, since doing that on a 50ms timer would eat the space a user
// just typed before their next word. returns an onBlur to spread onto the input.
export function useTrimWhitespace(
  value: string,
  setValue: (next: string) => void,
  options?: { collapseInternal?: boolean }
) {
  const collapseInternal = options?.collapseInternal ?? false

  React.useEffect(() => {
    if (!/^\s/.test(value)) return
    const id = setTimeout(() => setValue(value.replace(/^\s+/, "")), 50)
    return () => clearTimeout(id)
  }, [value, setValue])

  return {
    onBlur: () => {
      const next = normalizeText(value, collapseInternal)
      if (next !== value) setValue(next)
    },
  }
}
