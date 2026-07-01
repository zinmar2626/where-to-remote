import type { ReactNode } from "react"

interface SliderFilterProps {
  label: string
  emoji: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  labelLeft?: ReactNode
  labelRight?: ReactNode
  formatValue?: (value: number) => string
  onChange: (value: number) => void
}

export default function SliderFilter({
  label,
  emoji,
  value,
  min,
  max,
  step = 1,
  unit = "",
  labelLeft,
  labelRight,
  formatValue,
  onChange,
}: SliderFilterProps) {
  const pct = ((value - min) / (max - min)) * 100
  const displayed = formatValue ? formatValue(value) : `${value}${unit}`

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          <span className="text-base">{emoji}</span>
          {label}
        </span>
        <span
          className="text-sm font-semibold tabular-nums"
          style={{ color: "var(--accent)" }}
        >
          {displayed}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-track"
          style={
            {
              "--fill-pct": `${pct}%`,
            } as React.CSSProperties
          }
        />
      </div>
      <div
        className="flex justify-between text-[10px]"
        style={{ color: "var(--text-muted)" }}
      >
        <span>{labelLeft ?? `${min}${unit}`}</span>
        <span>{labelRight ?? `${max}${unit}`}</span>
      </div>
    </div>
  )
}
