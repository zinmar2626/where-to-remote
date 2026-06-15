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
      className={`
        group relative flex items-center gap-2.5 rounded-xl border px-4 py-3
        text-sm font-medium transition-all duration-200 ease-out
        active:scale-[0.97]
        ${
          selected
            ? "border-amber-500/50 bg-amber-500/15 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
            : "border-slate-700/60 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-300"
        }
      `}
    >
      <span className="text-lg transition-transform duration-200 group-hover:scale-110">
        {emoji}
      </span>
      <span>{label}</span>
      {selected && (
        <span className="ml-auto h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
      )}
    </button>
  )
}
