import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "@/styles/globals.css"
import "@/design-system.css"
import { App } from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import Workout from "./Workout.tsx"
import Login from "./Login.tsx"
import Signup from "./Signup.tsx"
import Moreinfo from "./Moreinfo.tsx"
import Graphs from "./Graphs.tsx"
import Settings from "./Settings.tsx"
import Improve from "./Improve.tsx"
import More from "./More.tsx"
import Layout from "./Layout.tsx"

createRoot(document.getElementById("root")!).render(
  //this only works in production side and not when the user is using the project and the job for strictmode is
  // to revoke the functions twice to see if there is any impurity in the function like is there any subscription
  // remaining to clean up and other things like that.
  <StrictMode>
    <ThemeProvider>
      {/*and the BrowserRouter is a component from the library that is being improted called react router dom */}
      <BrowserRouter>
        <Routes>
          <Route path="/Workout" element={<Workout />} />
          <Route path="*" element={<App />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Moreinfo" element={<Moreinfo />} />
          {/*now layout is like these pages will be rendered with a footer in the bottom of the screen
           and you will understand this after reading the layout file and this code basically means
          the footer and frame persist, and only the inner content changes as you navigate between them. */}
          <Route element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/Graphs" element={<Graphs />} />
            <Route path="/Improve" element={<Improve />} />
            <Route path="/More" element={<More />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
