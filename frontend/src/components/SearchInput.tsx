interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  )
}

export default function SearchInput({ value, onChange, placeholder = 'Buscar...' }: SearchInputProps) {
  return (
    <div className="relative w-full sm:w-72">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint">
        <SearchIcon />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-surface-line bg-surface-soft py-2.5 pl-9 pr-3.5 text-sm text-ink placeholder:text-ink-faint focus-ring transition-colors"
      />
    </div>
  )
}