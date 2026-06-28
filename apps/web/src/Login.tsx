import React, { type ChangeEvent, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  function handleEmail(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
  }
  function handlePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }
  function handleSignUp() {
    navigate("/Signup")
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-bold text-brand">Trainalyse</h1>
          <p className="text-muted-foreground">Welcome back!</p>
        </div>

        <Card className="[--card-spacing:--spacing(6)]">
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
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
                  value={password}
                  onChange={handlePassword}
                />
              </div>
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
    </div>
  )
}

export default Login
