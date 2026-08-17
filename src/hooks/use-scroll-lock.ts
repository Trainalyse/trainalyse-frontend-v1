import * as React from "react"

// Freezes the page's scroll container while a modal is open, so a touch-drag on
// the overlay can't bleed through and scroll the page behind it. Pass `locked` =
// whether the modal is currently open.
//
// Which element actually scrolls depends on the route: pages inside Layout scroll
// the inner `#app-scroll` div, while standalone pages (e.g. Workout, Moreinfo)
// scroll the document itself. So we lock `#app-scroll` when it exists and fall
// back to the root <html> element, whose overflow:hidden reliably stops window
// scrolling — without the fallback the lock silently did nothing off-Layout.
//
// A shared counter handles stacked modals: the container only unlocks once the
// LAST open modal releases it, so closing one modal that sits over another doesn't
// prematurely re-enable background scrolling.
let lockCount = 0

export function useScrollLock(locked: boolean) {
  React.useEffect(() => {
    if (!locked) return
    const el = document.getElementById("app-scroll") ?? document.documentElement

    lockCount += 1
    el.style.overflow = "hidden"

    return () => {
      lockCount -= 1
      if (lockCount === 0) el.style.overflow = ""
    }
  }, [locked])
}
