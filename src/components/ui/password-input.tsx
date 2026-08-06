import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

// a password field with a show/hide toggle at its trailing edge. masked by
// default (closed-eye icon); tapping reveals the text and swaps to the open eye.
function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type">) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        // room on the right so the text never slides under the toggle
        className={cn("pr-11", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex items-center rounded-md pr-3 pl-2 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground"
      >
        {visible ? (
          <Eye className="size-5" />
        ) : (
          <EyeOff className="size-5" />
        )}
      </button>
    </div>
  )
}

export { PasswordInput }
