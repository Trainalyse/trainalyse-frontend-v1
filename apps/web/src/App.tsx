import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { useNavigate } from "react-router-dom"
import { workouts, type Workout } from "./data/workouts"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export function App() {
  const navigate = useNavigate()
  const handleClick = () => {
    const time = new Date().toLocaleString()
    navigate("/Workout", { state: { time } })
  }

  function handleWorkoutOpen(workout: Workout) {
    navigate("/Workout", { state: { workout } })
  }

  return (
    <>
      <header>
        <h1>Trainalyse</h1>
        <Button>Date</Button>
        <Button>Title</Button>
        <Button>Settings</Button>
        <Separator />
        {workouts.map((workout) => (
          <Card key={workout.id}>
            <CardHeader>
              <CardTitle>{workout.title}</CardTitle>
              <CardAction>
                <Button onClick={() => handleWorkoutOpen(workout)}>Open</Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p>{workout.date}</p>
            </CardContent>
            <CardFooter>
              <p>Created at {workout.time}</p>
            </CardFooter>
          </Card>
        ))}
        <Separator />
        <footer>
          <Button onClick={handleClick}>+</Button>
          <nav>
            <Button>Home</Button>
            <Button>Graph</Button>
            <Button>Improve</Button>
            <Button>More</Button>
          </nav>
        </footer>
      </header>
    </>
  )
}
