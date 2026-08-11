// Shared submit-time validators for the auth forms (Login and Signup). Each
// rule takes a value and returns an error message string, or undefined when the
// value is fine — the same shape the <FieldError> components already consume, so
// a page just does `if (msg) errors.field = msg`. Keeping the rules here means
// the email shape and password policy live in one place instead of being copied
// into every form. These run on the client only; the backend re-checks later.

// a permissive but real email shape: something@something.something, no spaces.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// the one place the minimum length is written, so the check and the message it
// produces can never drift apart.
const MIN_PASSWORD_LENGTH = 5

// passwords allow no spaces at all. shared because the onChange handlers flag
// spaces live (before submit) using the exact same message.
export const PASSWORD_SPACE_MSG = "Spaces aren't allowed in your password."

// does the value contain any whitespace? used both here and by the live
// onChange space-flagging in the forms.
export function hasSpace(value: string): boolean {
  return /\s/.test(value)
}

// empty -> prompt, otherwise must match the email shape. trims internally so it
// behaves the same whether or not the caller has already trimmed.
export function emailError(email: string): string | undefined {
  const trimmed = email.trim()
  if (!trimmed) return "Please enter your email."
  if (!EMAIL_RE.test(trimmed)) {
    return "That doesn't look like a valid email address."
  }
  return undefined
}

// empty -> the caller's prompt (Login and Signup word it differently), then no
// spaces, then a minimum length. not used for the confirm field, which checks a
// match instead of a length.
export function passwordError(
  password: string,
  emptyMsg: string
): string | undefined {
  if (!password) return emptyMsg
  if (hasSpace(password)) return PASSWORD_SPACE_MSG
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  return undefined
}
