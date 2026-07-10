import React, { type ChangeEvent, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

function Signup() {
  const navigate = useNavigate()
  const [userName, setUserName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password1, setPassword1] = React.useState("")
  const [password2, setPassword2] = React.useState("")

  function handleUsername(event: ChangeEvent<HTMLInputElement>) {
    setUserName(event.target.value)
  }
  function handleEmail(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
  }
  function handlePassword1(event: ChangeEvent<HTMLInputElement>) {
    setPassword1(event.target.value)
  }
  function handlePassword2(event: ChangeEvent<HTMLInputElement>) {
    setPassword2(event.target.value)
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password1 !== password2) {
      alert("Both passwords don't match")
      return
    }
    navigate("/Moreinfo")
  }
  function handleLogin() {
    navigate("/Login")
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-bold text-brand">Trainalyse</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        <Card className="[--card-spacing:--spacing(6)]">
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  className="h-11"
                  id="username"
                  type="text"
                  placeholder="Create your username"
                  value={userName}
                  onChange={handleUsername}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="h-11"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmail}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  className="h-11"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password1}
                  onChange={handlePassword1}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  className="h-11"
                  id="confirm-password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={password2}
                  onChange={handlePassword2}
                />
              </div>
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
    </div>
  )
}

export default Signup
