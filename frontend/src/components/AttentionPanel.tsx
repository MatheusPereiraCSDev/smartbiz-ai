export interface Alert {
  title: string
  description: string
  level: 'warning' | 'critical'
}

interface AttentionPanelProps {
  alerts: Alert[]
}

const levelStyles: Record<Alert['level'], string> = {
  warning: 'border-accent-line/40 bg-accent-dim',
  critical: 'border-red-500/30 bg-red-500/10',
}

const dotStyles: Record<Alert['level'], string> = {
  warning: 'bg-accent-soft',
  critical: 'bg-red-400',
}

export default function AttentionPanel({ alerts }: AttentionPanelProps) {
  return (
    <div className="rounded-2xl border border-surface-line bg-surface p-5 sm:p-6">
      <h2 className="font-display text-base font-semibold text-ink">Pontos de atenção</h2>

      {alerts.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">Nenhum ponto de atenção no momento.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {alerts.map((alert) => (
            <div
              key={alert.title}
              className={`flex items-start gap-3 rounded-xl border p-3 ${levelStyles[alert.level]}`}
            >
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotStyles[alert.level]}`} />
              <div>
                <p className="text-sm font-medium text-ink">{alert.title}</p>
                <p className="text-xs text-ink-muted">{alert.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}