import { toast } from "sonner"
import { TriangleAlert, X } from "lucide-react"

// A warning toast styled like the app's cards: an amber alert badge on the left,
// the message in the middle, and a round grey dismiss (X) button INSIDE the toast
// on the right (not floating in a corner). Rendered via toast.custom so we fully
// control the layout. `id` dedupes repeated fires (e.g. holding an over-limit
// key) into one toast instead of stacking a pile.
export function warnToast(message: string, id: string) {
  toast.custom(
    (t) => (
      <div className="flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-[var(--border-cardEdge)] bg-[var(--bg-surface-primary)] p-4 shadow-lg">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-warning-40)] bg-[var(--color-warning-10)] text-[var(--color-warning)]">
          <TriangleAlert className="size-5" />
        </span>
        <p className="flex-1 text-sm font-medium text-[var(--text-primary)]">{message}</p>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => toast.dismiss(t)}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-grey-2)] text-[var(--color-grey-3)] transition-colors hover:text-[var(--text-primary)]"
        >
          <X className="size-4" />
        </button>
      </div>
    ),
    { id }
  )
}
