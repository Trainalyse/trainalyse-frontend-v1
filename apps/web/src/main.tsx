import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "@workspace/ui/globals.css"
import { App } from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import Workout from "./Workout.tsx"
import Login from "./Login.tsx"
import Signup from "./Signup.tsx"
import Moreinfo from "./Moreinfo.tsx"
import Graphs from "./Graphs.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/Workout" element={<Workout />} />
          <Route path="*" element={<App />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Moreinfo" element={<Moreinfo />} />
          <Route path="/Graphs" element={<Graphs />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
