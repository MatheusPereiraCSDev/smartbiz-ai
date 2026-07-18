interface StatCardProps {
  label: string
  value: string
  trend?: string
}

export default function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-surface-line bg-surface p-5">
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
      {trend && <p className="mt-1 text-xs text-accent-soft">{trend}</p>}
    </div>
  )
}