import React, { type ChangeEvent, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import StepIndicator from "@/components/ui/step-indicator"
import { useTrimWhitespace, normalizeText } from "@/hooks/use-trim-whitespace"

// a permissive but real email shape: something@something.something, no spaces
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_SPACE_MSG = "Spaces aren't allowed in your password."

interface SignupErrors {
  userName?: string
  email?: string
  password1?: string
  password2?: string
}

// figure out what, if anything, is wrong with each field. only the keys that
// have a problem are set, so an empty object means the form is good to go.
function validate(
  userName: string,
  email: string,
  password1: string,
  password2: string
): SignupErrors {
  const errors: SignupErrors = {}

  if (!userName.trim()) {
    errors.userName = "Please choose a username."
  }

  if (!email.trim()) {
    errors.email = "Please enter your email."
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = "That doesn't look like a valid email address."
  }

  if (!password1) {
    errors.password1 = "Please enter a password."
  } else if (/\s/.test(password1)) {
    errors.password1 = PASSWORD_SPACE_MSG
  } else if (password1.length < 5) {
    errors.password1 = "Password must be at least 5 characters."
  }

  if (!password2) {
    errors.password2 = "Please re-enter your password."
  } else if (/\s/.test(password2)) {
    errors.password2 = PASSWORD_SPACE_MSG
  } else if (password1 !== password2) {
    errors.password2 = "Those passwords don't match."
  }

  return errors
}

function Signup() {
  const navigate = useNavigate()
  const [userName, setUserName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password1, setPassword1] = React.useState("")
  const [password2, setPassword2] = React.useState("")
  // errors only appear after the first submit attempt, then clear per-field as
  // the user fixes each one so the page never nags before they've tried.
  const [errors, setErrors] = React.useState<SignupErrors>({})
  // username: trim ends + collapse internal runs to one space, on blur.
  const userNameTrim = useTrimWhitespace(userName, setUserName, {
    collapseInternal: true,
  })
  // email: trim ends only. passwords allow no spaces at all, so they get no
  // trim hook — spaces there are flagged as errors instead.
  const emailTrim = useTrimWhitespace(email, setEmail)

  function handleUsername(event: ChangeEvent<HTMLInputElement>) {
    setUserName(event.target.value)
    if (errors.userName) setErrors((prev) => ({ ...prev, userName: undefined }))
  }
  function handleEmail(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
  }
  function handlePassword1(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setPassword1(value)
    // flag spaces the instant they appear; otherwise clear the field's error
    if (/\s/.test(value)) {
      setErrors((prev) => ({ ...prev, password1: PASSWORD_SPACE_MSG }))
    } else if (errors.password1) {
      setErrors((prev) => ({ ...prev, password1: undefined }))
    }
  }
  function handlePassword2(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setPassword2(value)
    if (/\s/.test(value)) {
      setErrors((prev) => ({ ...prev, password2: PASSWORD_SPACE_MSG }))
    } else if (errors.password2) {
      setErrors((prev) => ({ ...prev, password2: undefined }))
    }
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // normalize whitespace before checking (covers submitting mid-timer): the
    // username collapses internal runs too; the email just trims. passwords are
    // left as-is — any space in them is flagged as an error.
    const cleanUserName = normalizeText(userName, true)
    const cleanEmail = email.trim()
    if (cleanUserName !== userName) setUserName(cleanUserName)
    if (cleanEmail !== email) setEmail(cleanEmail)
    const nextErrors = validate(
      cleanUserName,
      cleanEmail,
      password1,
      password2
    )
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    navigate("/Moreinfo")
  }
  function handleLogin() {
    navigate("/Login")
  }

  return (
    <div className="flex min-h-svh flex-col p-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto my-auto w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-bold text-brand">Trainalyse</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        <Card className="[--card-spacing:--spacing(6)]">
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Field data-invalid={!!errors.userName}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  className="h-11"
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={30}
                  placeholder="Create your username"
                  value={userName}
                  onChange={handleUsername}
                  onBlur={userNameTrim.onBlur}
                  aria-invalid={!!errors.userName}
                />
                <FieldError>{errors.userName}</FieldError>
              </Field>

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

              <Field data-invalid={!!errors.password1}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                  className="h-11"
                  id="password"
                  name="new-password"
                  autoComplete="new-password"
                  spellCheck={false}
                  maxLength={128}
                  placeholder="Enter your password"
                  value={password1}
                  onChange={handlePassword1}
                  aria-invalid={!!errors.password1}
                />
                <FieldError>{errors.password1}</FieldError>
              </Field>

              <Field data-invalid={!!errors.password2}>
                <FieldLabel htmlFor="confirm-password">
                  Confirm password
                </FieldLabel>
                <PasswordInput
                  className="h-11"
                  id="confirm-password"
                  name="confirm-password"
                  autoComplete="new-password"
                  spellCheck={false}
                  maxLength={128}
                  placeholder="Re-enter your password"
                  value={password2}
                  onChange={handlePassword2}
                  aria-invalid={!!errors.password2}
                />
                <FieldError>{errors.password2}</FieldError>
              </Field>
            </div>

            <Button type="submit" className="h-11 w-full">
              Sign Up
            </Button>
          </CardContent>

          <CardFooter className="justify-center gap-2 p-4">
            <span className="text-sm text-muted-foreground">
              Already have an account?
            </span>
            <Button
              className="h-auto p-0 text-brand"
              type="button"
              variant="link"
              onClick={handleLogin}
            >
              Log in
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* two-step onboarding: sign up is the first step, more info is the second */}
      <StepIndicator total={2} current={1} className="pt-8 pb-10" />
    </div>
  )
}

export default Signup
