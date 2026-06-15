import type { FilterState, VibePreset } from "../utils/matching"
import { VIBE_PRESETS } from "../utils/matching"
import SliderFilter from "./SliderFilter"
import VibeButton from "./VibeButton"

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
    <aside className="flex h-screen w-[380px] shrink-0 flex-col border-r border-slate-800 bg-slate-950/95 backdrop-blur-xl">
      {/* ── Header ── */}
      <div className="border-b border-slate-800 px-6 py-5">
        <h1 className="text-xl font-bold tracking-tight text-white">
          🇲🇲 Where to{" "}
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Remote
          </span>
          ?
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Yangon • Workspace Explorer
        </p>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7 scrollbar-thin">
        {/* Essentials */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
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
          <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🔌</span>
                <div>
                  <p className="text-sm font-semibold text-amber-300">
                    Generator Backup
                  </p>
                  <p className="text-[11px] text-amber-500/70 font-medium">
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
                className={`
                  relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center
                  rounded-full border-2 border-transparent transition-colors duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
                  ${
                    filters.requireGenerator
                      ? "bg-amber-600"
                      : "bg-slate-700"
                  }
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-4 w-4 rounded-full bg-white
                    shadow transition-transform duration-200
                    ${filters.requireGenerator ? "translate-x-5" : "translate-x-0.5"}
                  `}
                />
              </button>
            </div>
            {filters.requireGenerator && (
              <p className="mt-2 text-[10px] text-amber-500/60">
                ⚡ Only showing spots with backup power. Bodhi Cafe is hidden.
              </p>
            )}
          </div>
        </section>

        {/* Vibe Presets */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
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
      <div className="border-t border-slate-800 px-6 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-slate-400">
            <span className="text-lg font-bold text-white tabular-nums">
              {matchCount}
            </span>
            <span className="text-slate-500"> / {totalCount} spots</span>
          </span>
          <button
            onClick={onReset}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
          >
            Reset
          </button>
        </div>
        {/* Match bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 ease-out"
            style={{
              width: totalCount > 0 ? `${(matchCount / totalCount) * 100}%` : "0%",
            }}
          />
        </div>
      </div>
    </aside>
  )
}
