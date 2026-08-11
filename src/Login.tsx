import React, { type ChangeEvent, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import StepIndicator from "@/components/ui/step-indicator"
import { useTrimWhitespace } from "@/hooks/use-trim-whitespace"
import {
  emailError,
  passwordError,
  hasSpace,
  PASSWORD_SPACE_MSG,
} from "@/lib/validation"

interface LoginErrors {
  email?: string
  password?: string
}

// figure out what, if anything, is wrong with each field. only the keys that
// have a problem are set, so an empty object means the form is good to go.
function validate(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {}

  const emailMsg = emailError(email)
  if (emailMsg) errors.email = emailMsg

  const passwordMsg = passwordError(password, "Please enter your password.")
  if (passwordMsg) errors.password = passwordMsg

  return errors
}

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  // errors only appear after the first submit attempt, then clear per-field as
  // the user fixes each one so the page never nags before they've tried.
  const [errors, setErrors] = React.useState<LoginErrors>({})
  // strip edge whitespace on the email: leading as they type, trailing on blur.
  const emailTrim = useTrimWhitespace(email, setEmail)

  function handleEmail(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
  }
  function handlePassword(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setPassword(value)
    // flag spaces the instant they appear; otherwise clear the field's error
    if (hasSpace(value)) {
      setErrors((prev) => ({ ...prev, password: PASSWORD_SPACE_MSG }))
    } else if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }))
    }
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // normalize the email's edge whitespace before checking (covers submitting
    // mid-timer). the password is left as-is — any space in it is an error.
    const cleanEmail = email.trim()
    if (cleanEmail !== email) setEmail(cleanEmail)
    const nextErrors = validate(cleanEmail, password)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    navigate("/")
  }
  function handleSignUp() {
    navigate("/Signup")
  }

  return (
    <>
    <div className="flex min-h-svh flex-col p-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto my-auto w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-bold text-brand">Trainalyse</h1>
          <p className="text-muted-foreground">Welcome back!</p>
        </div>

        <Card className="[--card-spacing:--spacing(6)]">
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  className="h-11"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={254}
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmail}
                  onBlur={emailTrim.onBlur}
                  aria-invalid={!!errors.email}
                />
                <FieldError>{errors.email}</FieldError>
              </Field>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                  className="h-11"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  spellCheck={false}
                  maxLength={128}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePassword}
                  aria-invalid={!!errors.password}
                />
                <FieldError>{errors.password}</FieldError>
              </Field>
            </div>

            <Button type="submit" className="h-11 w-full">
              Login
            </Button>
          </CardContent>

          <CardFooter className="justify-center gap-2 p-4">
            <span className="text-sm text-muted-foreground">
              Don&apos;t have an account?
            </span>
            <Button
              className="h-auto p-0 text-brand"
              type="button"
              variant="link"
              onClick={handleSignUp}
            >
              Sign up
            </Button>
          </CardFooter>
        </Card>
      </form>
      {/* two-step onboarding: login is the first (and only) step before the app */}
      <StepIndicator total={2} current={1} className="pt-8 pb-10" />
      </div>

    </>
  )
}

export default Login
