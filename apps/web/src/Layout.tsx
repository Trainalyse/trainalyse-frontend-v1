// Layout.tsx
import { Outlet } from "react-router-dom"
import Footer from "./Footer"

function Layout() {
  return (
    <>
      <div className="flex h-svh flex-col">
        <div className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Layout
