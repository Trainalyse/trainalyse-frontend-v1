import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { useNavigate } from "react-router-dom"

export function App() {
  const navigate = useNavigate()
  const handleClick = () => {
    const time = new Date().toLocaleString()
    navigate("/Workout", { state: { time } })
  }

  return (
    <>
      <header>
        <h1>Trainalyse</h1>
        <Button>Date</Button>
        <Button>Title</Button>
        <Button>Settings</Button>
        <Separator />
        <p>Days logged will be rendered here</p>
        <Separator />
        <Button onClick={handleClick}>+</Button>
        <footer>
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
