import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-base px-4 py-10 text-ink">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold">
              Bem-vindo, {user?.name}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">{user?.email}</p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg border border-surface-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent-line hover:bg-accent-dim"
          >
            Sair
          </button>
        </div>

        <div className="mt-10 rounded-2xl border border-surface-line bg-surface p-8">
          <p className="text-ink-muted">
            Este é o painel principal do SmartBiz AI. As funcionalidades de
            gestão serão construídas aqui nas próximas etapas.
          </p>
        </div>
      </div>
    </div>
  )
}