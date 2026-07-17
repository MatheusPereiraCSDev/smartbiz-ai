interface LogoProps {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-[#5A43D6] shadow-[0_6px_18px_-4px_rgba(123,97,255,0.7)]">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M4 16.5L10 10.5L14 14.5L20 8.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 8.5H20V14.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-[1.05rem] font-semibold text-ink">SmartBiz</span>
        <span className="text-[0.65rem] font-medium tracking-[0.25em] text-accent-soft">AI SUITE</span>
      </div>
    </div>
  )
}
