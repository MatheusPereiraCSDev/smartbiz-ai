import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

const navItems = [
  { label: 'Visão geral', icon: 'grid', path: '/dashboard' },
  { label: 'Clientes', icon: 'users', path: '/clients' },
  { label: 'Financeiro', icon: 'wallet', path: '/finance' },
  { label: 'Produtos', icon: 'box', path: null },
]

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    grid: <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />,
    users: <path d="M16 11a4 4 0 10-8 0 4 4 0 008 0zM2 21a8 8 0 0116 0" />,
    wallet: <path d="M3 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM16 12h.01" />,
    box: <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8" />,
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
      {icons[name]}
    </svg>
  )
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()

  const content = (
    <>
      <Logo className="mb-8" />
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = item.path === location.pathname
          const isDisabled = !item.path

          if (isDisabled) {
            return (
              <button
                key={item.label}
                type="button"
                disabled
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-faint opacity-60 cursor-not-allowed"
              >
                <NavIcon name={item.icon} />
                {item.label}
                <span className="ml-auto rounded-full bg-surface-soft px-2 py-0.5 text-[10px] text-ink-faint">
                  em breve
                </span>
              </button>
            )
          }

          return (
            <Link
              key={item.label}
              to={item.path!}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent-dim text-accent-soft'
                  : 'text-ink-muted hover:bg-surface-soft hover:text-ink'
              }`}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-surface-line bg-surface/60 p-5 md:flex">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onClose}
            className="absolute inset-0 bg-base-deep/80 backdrop-blur-sm animate-fade-in"
          />
          <aside className="relative z-10 flex h-full w-64 flex-col border-r border-surface-line bg-surface p-5 animate-fade-in">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}