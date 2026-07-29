// Layout.tsx
import { Outlet } from "react-router-dom"
import Footer from "./Footer"

function Layout() {
  return (
    <>
      <div className="mx-auto flex h-svh w-full max-w-[430px] flex-col overflow-hidden">
        {/* the only thing on the page that scrolls. without overflow-y-auto the
            pages content just spills past the bottom of this box and paints over
            the footer instead of scrolling under it */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Layout
