interface Order {
  id: string
  client: string
  value: string
  status: 'Concluído' | 'Pendente' | 'Cancelado'
}

const mockOrders: Order[] = [
  { id: '#3291', client: 'Ana Ribeiro', value: 'R$ 1.240,00', status: 'Concluído' },
  { id: '#3290', client: 'Carlos Souza', value: 'R$ 890,00', status: 'Pendente' },
  { id: '#3289', client: 'Marcos Lima', value: 'R$ 2.150,00', status: 'Concluído' },
  { id: '#3288', client: 'Julia Prado', value: 'R$ 430,00', status: 'Cancelado' },
]

const statusStyles: Record<Order['status'], string> = {
  'Concluído': 'bg-accent-dim text-accent-soft',
  'Pendente': 'bg-surface-soft text-ink-muted',
  'Cancelado': 'bg-red-500/10 text-red-300',
}

export default function OrdersPanel() {
  return (
    <div className="rounded-2xl border border-surface-line bg-surface p-5 sm:p-6">
      <h2 className="font-display text-base font-semibold text-ink">Pedidos recentes</h2>

      <div className="mt-4 flex flex-col divide-y divide-surface-line">
        {mockOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between py-3 text-sm">
            <div>
              <p className="font-medium text-ink">{order.client}</p>
              <p className="text-xs text-ink-faint">{order.id}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-medium text-ink">{order.value}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[order.status]}`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}