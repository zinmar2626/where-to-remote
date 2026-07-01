import { useState } from "react"
import { THEMES, useTheme, type ThemeId } from "../context/ThemeContext"

export default function ThemeToggle() {
  const { theme, setThemeId } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className="theme-toggle-wrapper">
      {/* Trigger button */}
      <button
        id="theme-toggle-btn"
        aria-label="Change theme"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="theme-toggle-btn"
      >
        <span className="theme-toggle-emoji">{theme.emoji}</span>
        <span className="theme-toggle-label">{theme.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`theme-toggle-chevron ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="theme-backdrop"
            onClick={() => setOpen(false)}
          />
          <div className="theme-dropdown" role="listbox" aria-label="Select theme">
            <p className="theme-dropdown-title">Choose Theme</p>
            <div className="theme-options">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  role="option"
                  aria-selected={theme.id === t.id}
                  onClick={() => {
                    setThemeId(t.id as ThemeId)
                    setOpen(false)
                  }}
                  className={`theme-option ${theme.id === t.id ? "theme-option--active" : ""}`}
                >
                  <span className="theme-option-swatch" data-theme-swatch={t.id} />
                  <span className="theme-option-emoji">{t.emoji}</span>
                  <span className="theme-option-label">{t.label}</span>
                  {theme.id === t.id && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="theme-option-check"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
