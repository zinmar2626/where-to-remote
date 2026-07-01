import type { FilterState, VibePreset } from "../utils/matching"
import { VIBE_PRESETS } from "../utils/matching"
import SliderFilter from "./SliderFilter"
import VibeButton from "./VibeButton"
import ThemeToggle from "./ThemeToggle"

interface SidebarProps {
  filters: FilterState
  matchCount: number
  totalCount: number
  onFilterChange: (updates: Partial<FilterState>) => void
  onToggleVibe: (vibeId: string) => void
  onReset: () => void
}

function formatMMK(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K MMK`
  return `${value} MMK`
}

export default function Sidebar({
  filters,
  matchCount,
  totalCount,
  onFilterChange,
  onToggleVibe,
  onReset,
}: SidebarProps) {
  return (
    <aside
      className="flex h-screen w-[380px] shrink-0 flex-col scrollbar-thin"
      style={{
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-strong)",
        backdropFilter: "blur(20px)",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* ── Header ── */}
      <div
        className="px-6 py-5"
        style={{ borderBottom: "1px solid var(--border-strong)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              🇲🇲 Where to{" "}
              <span
                style={{
                  background: "linear-gradient(to right, var(--accent), color-mix(in srgb, var(--accent) 70%, #f97316))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Remote
              </span>
              ?
            </h1>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              Yangon • Workspace Explorer
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7 scrollbar-thin">
        {/* Essentials */}
        <section>
          <h2
            className="mb-4 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            ⚡ Essentials
          </h2>
          <div className="space-y-5">
            <SliderFilter
              label="Wi-Fi Stability"
              emoji="📶"
              value={filters.minWifiStability}
              min={0}
              max={300}
              step={25}
              unit=" Mbps"
              onChange={(v) => onFilterChange({ minWifiStability: v })}
            />

            <SliderFilter
              label="Noise Level"
              emoji="🔇"
              value={filters.maxNoiseLevel}
              min={1}
              max={5}
              labelLeft="🤫 Quiet"
              labelRight="🎉 Lively"
              formatValue={(v) => {
                const labels = ["", "Library", "Calm", "Moderate", "Buzzy", "Lively"]
                return labels[v]
              }}
              onChange={(v) => onFilterChange({ maxNoiseLevel: v })}
            />

            <SliderFilter
              label="Price Range"
              emoji="💸"
              value={filters.maxPriceMMK}
              min={5000}
              max={30000}
              step={1000}
              labelLeft="Budget"
              labelRight="Premium"
              formatValue={(v) => formatMMK(v)}
              onChange={(v) => onFilterChange({ maxPriceMMK: v })}
            />
          </div>

          {/* Generator toggle — Yangon's most important feature */}
          <div
            className="mt-5 rounded-xl px-4 py-3.5"
            style={{
              border: "1px solid var(--accent-border)",
              background: "var(--accent-bg)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🔌</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--accent-text)" }}>
                    Generator Backup
                  </p>
                  <p className="text-[11px] font-medium" style={{ color: "var(--accent)", opacity: 0.7 }}>
                    အရေးကြီးဆုံး — most important
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={filters.requireGenerator}
                onClick={() =>
                  onFilterChange({ requireGenerator: !filters.requireGenerator })
                }
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none"
                style={{
                  backgroundColor: filters.requireGenerator ? "var(--accent)" : "var(--slider-track)",
                  boxShadow: filters.requireGenerator
                    ? `0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent)`
                    : "none",
                }}
              >
                <span
                  className="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
                  style={{
                    transform: filters.requireGenerator ? "translateX(20px)" : "translateX(2px)",
                  }}
                />
              </button>
            </div>
            {filters.requireGenerator && (
              <p className="mt-2 text-[10px]" style={{ color: "var(--accent)", opacity: 0.6 }}>
                ⚡ Only showing spots with backup power. Bodhi Cafe is hidden.
              </p>
            )}
          </div>
        </section>

        {/* Vibe Presets */}
        <section>
          <h2
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            🎯 Quick Vibe
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {VIBE_PRESETS.map((preset: VibePreset) => (
              <VibeButton
                key={preset.id}
                label={preset.label}
                emoji={preset.emoji}
                description={preset.description}
                selected={filters.selectedVibeIds.includes(preset.id)}
                onClick={() => onToggleVibe(preset.id)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* ── Footer ── */}
      <div
        className="px-6 py-4"
        style={{ borderTop: "1px solid var(--border-strong)" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            <span
              className="text-lg font-bold tabular-nums"
              style={{ color: "var(--text-primary)" }}
            >
              {matchCount}
            </span>
            <span style={{ color: "var(--text-muted)" }}> / {totalCount} spots</span>
          </span>
          <button
            onClick={onReset}
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)"
              e.currentTarget.style.color = "var(--text-secondary)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.color = "var(--text-muted)"
            }}
          >
            Reset
          </button>
        </div>
        {/* Match bar */}
        <div
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: "var(--slider-track)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: totalCount > 0 ? `${(matchCount / totalCount) * 100}%` : "0%",
              background: "linear-gradient(to right, var(--accent), color-mix(in srgb, var(--accent) 70%, #f97316))",
            }}
          />
        </div>
      </div>
    </aside>
  )
}

