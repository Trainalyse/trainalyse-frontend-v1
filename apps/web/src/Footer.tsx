import { Button } from "@workspace/ui/components/button"
import { useNavigate, useLocation } from "react-router-dom"
import { Home, ChartLine, Target, Menu } from "lucide-react"
import { Label } from "@workspace/ui/components/label"

function Footer() {
  const location = useLocation()
  const navigate = useNavigate()
  const handleHome = () => {
    navigate("/")
  }
  const handleImprove = () => {
    navigate("/Improve")
  }
  const handleMore = () => {
    navigate("/More")
  }
  function handleGraphs() {
    navigate("/Graphs")
  }
  return (
    <>
      <footer className="border-t border-[#FFFFFF1A] bg-[#26262680]">
        <nav className="flex min-h-[80px] items-center justify-between px-[23px] py-6">
          <Button
            variant="ghost"
            aria-label="Go to Home"
            onClick={() => {
              handleHome()
            }}
            className={`flex h-auto flex-col items-center ${
              location.pathname === "/" ? "text-brand" : "text-muted-foreground"
            }`}
          >
            <Home className="size-6" strokeWidth={1.2} />
            <Label className="mt-2">Home</Label>
          </Button>
          <Button
            variant="ghost"
            aria-label="Go to Graphs"
            onClick={() => {
              handleGraphs()
            }}
            className={`flex h-auto flex-col items-center ${
              location.pathname === "/Graphs"
                ? "text-brand"
                : "text-muted-foreground"
            }`}
          >
            <ChartLine className="size-6" strokeWidth={1.2} />{" "}
            <Label className="mt-2">Graph</Label>
          </Button>
          <Button
            variant="ghost"
            aria-label="Go to Improve"
            onClick={() => {
              handleImprove()
            }}
            className={`flex h-auto flex-col items-center ${
              location.pathname === "/Improve"
                ? "text-brand"
                : "text-muted-foreground"
            }`}
          >
            <Target className="size-6" strokeWidth={1.2} />
            <Label className="mt-2">Improve</Label>
          </Button>
          <Button
            variant="ghost"
            aria-label="Go to More"
            onClick={() => {
              handleMore()
            }}
            className={`flex h-auto flex-col items-center ${
              location.pathname === "/More"
                ? "text-brand"
                : "text-muted-foreground"
            }`}
          >
            <Menu className="size-6" strokeWidth={1.2} />
            <Label className="mt-2">More</Label>
          </Button>
        </nav>
      </footer>
    </>
  )
}

export default Footer
