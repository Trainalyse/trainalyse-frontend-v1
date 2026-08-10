// Layout.tsx
// alright the imports with braces are specific imports and wihtout braces will be like the default exports the
// file is giving like a certain file can have names exports and a default export so without braces will import
// the default the export
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
