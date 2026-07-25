interface InsightsPanelProps {
  insights: string[]
  isLoading: boolean
}

export default function InsightsPanel({ insights, isLoading }: InsightsPanelProps) {
  return (
    <div className="rounded-2xl border border-accent-line/40 bg-accent-dim p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white text-xs">
          IA
        </span>
        <h2 className="font-display text-base font-semibold text-ink">Insights automáticos</h2>
      </div>

      {isLoading ? (
        <p className="text-sm text-ink-muted">Analisando seus dados...</p>
      ) : insights.length === 0 ? (
        <p className="text-sm text-ink-muted">Nenhum insight disponível no momento.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-soft" />
              {insight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}