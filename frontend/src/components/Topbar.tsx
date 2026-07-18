import Avatar from './Avatar'

interface TopbarProps {
  userName: string
  userEmail: string
  onMenuClick: () => void
  onLogout: () => void
}

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function Topbar({ userName, userEmail, onMenuClick, onLogout }: TopbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-surface-line px-6 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menu"
          className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface-soft hover:text-ink md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>

        <div>
          <h1 className="font-display text-lg font-semibold">
            {greeting()}, {userName}
          </h1>
          <p className="text-sm text-ink-muted">{userEmail}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Avatar name={userName} />
        <button
          onClick={onLogout}
          className="rounded-lg border border-surface-line px-4 py-2 text-sm font-medium transition-colors hover:border-accent-line hover:bg-accent-dim"
        >
          Sair
        </button>
      </div>
    </header>
  )
}