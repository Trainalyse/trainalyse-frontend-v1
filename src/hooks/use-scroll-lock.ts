import * as React from "react"

// Freezes the app's scroll container (the one div in Layout that scrolls) while a
// modal is open, so a touch-drag on the overlay can't bleed through and scroll the
// page behind it. Pass `locked` = whether the modal is currently open.
//
// A shared counter handles stacked modals: the container only unlocks once the
// LAST open modal releases it, so closing one modal that sits over another doesn't
// prematurely re-enable background scrolling.
let lockCount = 0

export function useScrollLock(locked: boolean) {
  React.useEffect(() => {
    if (!locked) return
    const el = document.getElementById("app-scroll")
    if (!el) return

    lockCount += 1
    el.style.overflow = "hidden"

    return () => {
      lockCount -= 1
      if (lockCount === 0) el.style.overflow = ""
    }
  }, [locked])
}
