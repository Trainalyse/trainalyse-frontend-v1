import { cn } from "@/lib/utils"

// onboarding step dots: `total` pills, and only the `current` step (1-based)
// is lit with the neon accent — the step the user is on. the rest stay dark.
interface StepIndicatorProps {
  total: number
  current: number
  className?: string
}

function StepIndicator({ total, current, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-6 rounded-full transition-colors",
            i === current - 1 ? "bg-[var(--color-neon)]" : "bg-white/20"
          )}
        />
      ))}
    </div>
  )
}

export default StepIndicator
