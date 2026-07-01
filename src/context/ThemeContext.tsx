import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type ThemeId = "dark" | "light"

export interface Theme {
  id: ThemeId
  label: string
  mapTileUrl: string
  mapAttribution: string
}

export const THEMES: Theme[] = [
  {
    id: "dark",
    label: "Dark",
    mapTileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    mapAttribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  {
    id: "light",
    label: "Light",
    mapTileUrl: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    mapAttribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
]

export function getThemeById(id: ThemeId): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}

interface ThemeContextValue {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setThemeId: (id: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEMES[0],
  isDark: true,
  toggleTheme: () => {},
  setThemeId: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    return (localStorage.getItem("wtr-theme") as ThemeId) ?? "dark"
  })

  const theme = getThemeById(themeId)
  const isDark = themeId === "dark"

  const handleSetThemeId = (id: ThemeId) => {
    setThemeId(id)
    localStorage.setItem("wtr-theme", id)
  }

  const toggleTheme = () => {
    const next: ThemeId = themeId === "dark" ? "light" : "dark"
    handleSetThemeId(next)
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeId)
  }, [themeId])

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setThemeId: handleSetThemeId }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
