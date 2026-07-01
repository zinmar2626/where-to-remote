interface VibeButtonProps {
  label: string
  emoji: string
  description: string
  selected: boolean
  onClick: () => void
}

export default function VibeButton({
  label,
  emoji,
  description,
  selected,
  onClick,
}: VibeButtonProps) {
  return (
    <button
      onClick={onClick}
      title={description}
      className="group relative flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-out active:scale-[0.97]"
      style={{
        border: selected
          ? "1px solid var(--accent-border)"
          : "1px solid var(--border)",
        background: selected ? "var(--accent-bg)" : "var(--bg-card)",
        color: selected ? "var(--accent-text)" : "var(--text-muted)",
        boxShadow: selected
          ? "0 0 20px color-mix(in srgb, var(--accent) 10%, transparent)"
          : "none",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "var(--border-strong)"
          e.currentTarget.style.background = "var(--bg-hover)"
          e.currentTarget.style.color = "var(--text-secondary)"
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "var(--border)"
          e.currentTarget.style.background = "var(--bg-card)"
          e.currentTarget.style.color = "var(--text-muted)"
        }
      }}
    >
      <span className="text-lg transition-transform duration-200 group-hover:scale-110">
        {emoji}
      </span>
      <span>{label}</span>
      {selected && (
        <span
          className="ml-auto h-2 w-2 rounded-full"
          style={{
            background: "var(--accent)",
            boxShadow: "0 0 6px color-mix(in srgb, var(--accent) 80%, transparent)",
          }}
        />
      )}
    </button>
  )
}
