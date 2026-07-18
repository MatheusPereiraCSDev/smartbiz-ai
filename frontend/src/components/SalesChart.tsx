import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

// Dados de exemplo — serão substituídos pela API de vendas.
const mockSales = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Fev', revenue: 15800 },
  { month: 'Mar', revenue: 14200 },
  { month: 'Abr', revenue: 19600 },
  { month: 'Mai', revenue: 21300 },
  { month: 'Jun', revenue: 18700 },
  { month: 'Jul', revenue: 24500 },
]

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-accent-line bg-surface-soft px-3 py-2 text-xs shadow-glow">
      <p className="text-ink-muted">{label}</p>
      <p className="font-semibold text-accent-soft">
        R$ {payload[0].value.toLocaleString('pt-BR')}
      </p>
    </div>
  )
}

export default function SalesChart() {
  return (
    <div className="rounded-2xl border border-surface-line bg-surface p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-base font-semibold text-ink">
            Performance de vendas
          </h2>
          <p className="text-xs text-ink-muted">Últimos 7 meses</p>
        </div>
        <span className="rounded-full bg-surface-soft px-2.5 py-1 text-[10px] font-medium text-ink-faint">
          Dados de exemplo
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockSales} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid stroke="#3A3D57" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#6E7191"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6E7191"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#7B61FF', strokeOpacity: 0.2 }} />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#9683FF"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#9683FF', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#9683FF' }}
              filter="url(#neonGlow)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}