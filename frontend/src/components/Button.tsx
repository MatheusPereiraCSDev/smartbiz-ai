import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'ghost'
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'w-full rounded-lg px-4 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200 ease-out active:scale-[0.97] focus-ring disabled:opacity-50 disabled:pointer-events-none'

  const variants: Record<string, string> = {
    primary:
      'bg-accent text-white shadow-[0_8px_24px_-8px_rgba(123,97,255,0.65)] hover:bg-accent-soft hover:shadow-[0_10px_28px_-6px_rgba(123,97,255,0.8)] hover:-translate-y-0.5',
    ghost:
      'bg-transparent border border-surface-line text-ink hover:border-accent-line hover:bg-accent-dim',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
