import type { Transaction } from '../types/transaction'

interface TransactionsTableProps {
  transactions: Transaction[]
  onDelete: (id: number) => void
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" strokeLinecap="round" />
    </svg>
  )
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(value: string) {
  return new Date(value + 'T00:00:00').toLocaleDateString('pt-BR')
}

export default function TransactionsTable({ transactions, onDelete }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-surface-line bg-surface p-10 text-center text-sm text-ink-muted">
        Nenhuma transação registrada ainda.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-line bg-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-surface-line text-xs uppercase tracking-wide text-ink-faint">
            <th className="px-5 py-3 font-medium">Descrição</th>
            <th className="px-5 py-3 font-medium">Tipo</th>
            <th className="px-5 py-3 font-medium">Data</th>
            <th className="px-5 py-3 font-medium text-right">Valor</th>
            <th className="px-5 py-3 font-medium text-right">Ações</th>
            <th className="px-5 py-3 font-medium">Cliente</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-line">
          {transactions.map((tx) => (
            <tr key={tx.id} className="group transition-colors hover:bg-surface-soft/50">
              <td className="px-5 py-3.5 font-medium text-ink">{tx.description}</td>
              <td className="px-5 py-3.5">
                <td className="px-5 py-3.5 text-ink-muted">{tx.client?.name ?? '—'}</td>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                    tx.type === 'receita'
                      ? 'bg-accent-dim text-accent-soft'
                      : 'bg-red-500/10 text-red-300'
                  }`}
                >
                  {tx.type}
                </span>
              </td>
              <td className="px-5 py-3.5 text-ink-muted">{formatDate(tx.date)}</td>
              <td
                className={`px-5 py-3.5 text-right font-medium ${
                  tx.type === 'receita' ? 'text-accent-soft' : 'text-red-300'
                }`}
              >
                {tx.type === 'despesa' ? '-' : '+'} {formatCurrency(tx.amount)}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end opacity-60 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => onDelete(tx.id)}
                    title="Remover"
                    className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-red-500/10 hover:text-red-300"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}