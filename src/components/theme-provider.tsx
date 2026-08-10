/* eslint-disable react-refresh/only-export-components */
import * as React from "react"


// the allowed theme values. Theme = what the user can pick (includes "system").
// ResolvedTheme = what "system" becomes after resolving (only ever dark/light).
type Theme = "dark" | "light" | "system"
type ResolvedTheme = "dark" | "light"

// this is the property of the component
type ThemeProviderProps = {
  //this is for the all the react nodes that this component wraps like we saw in main.tsx that the themeprovider wraps around
  // the react nodes so it will be applied to all of its children that is the content inside this component.
  children: React.ReactNode

  //this is simple and it is for default theme
  defaultTheme?: Theme

  //this is for the saving of the theme in the browsers local storage and it will be saved as a string like
  // the theme that will be saved is "dark"
  storageKey?: string

  //when the themes are changed then there is an animation between the changing and this prop disables the
  // transition animation that makes it look ugly.
  disableTransitionOnChange?: boolean
}

// this is what the component will provide to the whole project
type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}


// the media-query string used to ask the OS if it's in dark mode (reused below)
const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"
// when the code runs , the types disappear and stop existing , they are only in the code so as to keep the code tight
// so we have to make actual variable like theme-values so as to keep the value that the types provide.
const THEME_VALUES: Theme[] = ["dark", "light", "system"]

//this is for tranfering the theme and settheme function by the help of context and not prop funnelling
// and it starts out as undefined until the themeprovider has given the browser a value for theme
const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

//this is a function used for whether the theme provided as a string is legit or not so the value is null then it is false
// and also the value should only be from dark,light and system and other than that is also false
function isTheme(value: string | null): value is Theme {
  if (value === null) {
    return false
  }

  return THEME_VALUES.includes(value as Theme)
}

//ask the os whether the theme is light or dark and if its dark then its dark else its light
function getSystemTheme(): ResolvedTheme {
  if (window.matchMedia(COLOR_SCHEME_QUERY).matches) {
    return "dark"
  }

  return "light"
}

// this fucntion is for removing the animation of changing colors from one theme to another
function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}


// this is the main function for this file
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  disableTransitionOnChange = true,
  ...props
}: ThemeProviderProps) {
  // current theme state. the initializer runs once on first render: use the
  // saved theme if it's valid, otherwise the default.
  const [theme, setThemeState] = React.useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey)
    if (isTheme(storedTheme)) {
      return storedTheme
    }

    return defaultTheme
  })

  //this function is the one that gets shared through the context and so that it persists across all renders except
  // when the actual theme changes then it should
  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      localStorage.setItem(storageKey, nextTheme)
      setThemeState(nextTheme)
    },
    [storageKey]
  )

  // the actual switch-flipper: resolve the theme, then add/remove the "dark"
  // class on <html> (the class the CSS reacts to), suppressing the flash.
  const applyTheme = React.useCallback(
    (nextTheme: Theme) => {
      const root = document.documentElement
      const resolvedTheme =
        nextTheme === "system" ? getSystemTheme() : nextTheme
      const restoreTransitions = disableTransitionOnChange
        ? disableTransitionsTemporarily()
        : null

      // DARK-ONLY LOCK: light theme is not finished (design-system.css tokens
      // are dark-only), so we always apply "dark" regardless of the saved/OS
      // choice. Remove this override and restore `resolvedTheme` once a real
      // light theme exists.
      void resolvedTheme
      root.classList.remove("light", "dark")
      root.classList.add("dark")

      if (restoreTransitions) {
        restoreTransitions()
      }
    },
    [disableTransitionOnChange]
  )

  // effect: apply the theme whenever it changes. if it's "system", also listen
  // for OS light/dark changes and re-apply live. cleanup removes the listener.
  React.useEffect(() => {
    applyTheme(theme)

    if (theme !== "system") {
      return undefined
    }

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)
    const handleChange = () => {
      applyTheme("system")
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme, applyTheme])



  // effect: cross-tab sync — if the theme is changed in another browser tab,
  // update this tab to match.
  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) {
        return
      }

      if (event.key !== storageKey) {
        return
      }

      if (isTheme(event.newValue)) {
        setThemeState(event.newValue)
        return
      }

      setThemeState(defaultTheme)
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [defaultTheme, storageKey])

  // package {theme, setTheme} into a stable object and hand it to the context
  // so children can consume it via useTheme().
  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// THE HOOK: how any component reads/sets the theme — const { theme, setTheme } =
// useTheme(). Throws if used outside <ThemeProvider> (a safety guard).
export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
