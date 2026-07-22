import type { Product } from '../types/product'

interface ProductsTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

const LOW_STOCK_THRESHOLD = 5

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5" strokeLinecap="round" />
      <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
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

export default function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-surface-line bg-surface p-10 text-center text-sm text-ink-muted">
        Nenhum produto cadastrado ainda.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-line bg-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-surface-line text-xs uppercase tracking-wide text-ink-faint">
            <th className="px-5 py-3 font-medium">Nome</th>
            <th className="px-5 py-3 font-medium text-right">Preço</th>
            <th className="px-5 py-3 font-medium text-right">Estoque</th>
            <th className="px-5 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-line">
          {products.map((product) => (
            <tr key={product.id} className="group transition-colors hover:bg-surface-soft/50">
              <td className="px-5 py-3.5 font-medium text-ink">{product.name}</td>
              <td className="px-5 py-3.5 text-right text-ink-muted">{formatCurrency(product.price)}</td>
              <td className="px-5 py-3.5 text-right">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    product.stock <= LOW_STOCK_THRESHOLD
                      ? 'bg-red-500/10 text-red-300'
                      : 'text-ink-muted'
                  }`}
                >
                  {product.stock}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                  <button type="button" onClick={() => onEdit(product)} title="Editar" className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-accent-dim hover:text-accent-soft">
                    <EditIcon />
                  </button>
                  <button type="button" onClick={() => onDelete(product.id)} title="Remover" className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-red-500/10 hover:text-red-300">
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