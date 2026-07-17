import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className = '', ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-xs font-medium text-ink-muted tracking-wide">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={`w-full rounded-lg border border-surface-line bg-surface-soft px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus-ring transition-colors duration-200 ${className}`}
          {...rest}
        />
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
