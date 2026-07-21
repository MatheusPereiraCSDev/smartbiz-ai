import type { Transaction } from '../types/transaction'

interface OrdersPanelProps {
  orders: Transaction[]
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function OrdersPanel({ orders }: OrdersPanelProps) {
  return (
    <div className="rounded-2xl border border-surface-line bg-surface p-5 sm:p-6">
      <h2 className="font-display text-base font-semibold text-ink">Vendas recentes</h2>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">Nenhuma venda registrada ainda.</p>
      ) : (
        <div className="mt-4 flex flex-col divide-y divide-surface-line">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium text-ink">{order.client?.name ?? order.description}</p>
                <p className="text-xs text-ink-faint">{order.description}</p>
              </div>
              <span className="font-medium text-accent-soft">{formatCurrency(order.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}