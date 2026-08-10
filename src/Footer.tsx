import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"
import { Home, ChartLine, Target, Menu } from "lucide-react"
import { Label } from "@/components/ui/label"

function Footer() {
  //uselocation is for the component to know that on which url the user is at like where is the current location of the
  // user like if the user is on home page or not or is the user on graphs page , the reason is that whatvere page the
  // user is on that icon is neon color and other are dull so thats why we need the user's current location in the footer.
  const location = useLocation()

  // this is for the user to get them a function which will take them to different pages like navigate is a function which
  // enables for the user to navigate between different pages.
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
      {/* shrink-0 is what nails it down - as a flex child it would otherwise be
          squashed by a tall page instead of holding its height */}
      <footer className="shrink-0 border-t border-[var(--border-cardEdge)] bg-[var(--bg-surface-secondary)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <nav className="flex min-h-20 items-center justify-between px-[var(--space-23)]">
          <Button
            variant="ghost"
            aria-label="Go to Home"
            onClick={() => {
              handleHome()
            }}
            className={`flex h-auto flex-col px-0 ${
              location.pathname === "/" ? "text-brand" : "text-muted-foreground"
            }`}
          >
            <Home className="size-5" strokeWidth={1.2} />
            <Label>Home</Label>
          </Button>
          <Button
            variant="ghost"
            aria-label="Go to Graphs"
            onClick={() => {
              handleGraphs()
            }}
            className={`flex h-auto flex-col items-center px-0 ${
              location.pathname === "/Graphs"
                ? "text-brand"
                : "text-muted-foreground"
            }`}
          >
            <ChartLine className="size-5" strokeWidth={1.2} />{" "}
            <Label>Graphs</Label>
          </Button>
          <Button
            variant="ghost"
            aria-label="Go to Improve"
            onClick={() => {
              handleImprove()
            }}
            className={`flex h-auto flex-col items-center px-0 ${
              location.pathname === "/Improve"
                ? "text-brand"
                : "text-muted-foreground"
            }`}
          >
            <Target className="size-5" strokeWidth={1.2} />
            <Label>Improve</Label>
          </Button>
          <Button
            variant="ghost"
            aria-label="Go to More"
            onClick={() => {
              handleMore()
            }}
            className={`flex h-auto flex-col items-center px-0 ${
              location.pathname === "/More"
                ? "text-brand"
                : "text-muted-foreground"
            }`}
          >
            <Menu className="size-5" strokeWidth={1.2} />
            <Label>More</Label>
          </Button>
        </nav>
      </footer>
    </>
  )
}

export default Footer
