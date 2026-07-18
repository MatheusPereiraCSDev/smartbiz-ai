import type { Client } from '../types/client'

interface ClientsTableProps {
  clients: Client[]
  onEdit: (client: Client) => void
  onDelete: (id: number) => void
}

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

export default function ClientsTable({ clients, onEdit, onDelete }: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <div className="rounded-2xl border border-surface-line bg-surface p-10 text-center text-sm text-ink-muted">
        Nenhum cliente cadastrado ainda.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-line bg-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-surface-line text-xs uppercase tracking-wide text-ink-faint">
            <th className="px-5 py-3 font-medium">Nome</th>
            <th className="px-5 py-3 font-medium">E-mail</th>
            <th className="px-5 py-3 font-medium">Telefone</th>
            <th className="px-5 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-line">
          {clients.map((client) => (
            <tr key={client.id} className="group transition-colors hover:bg-surface-soft/50">
              <td className="px-5 py-3.5 font-medium text-ink">{client.name}</td>
              <td className="px-5 py-3.5 text-ink-muted">{client.email || '—'}</td>
              <td className="px-5 py-3.5 text-ink-muted">{client.phone || '—'}</td>
              <td className="px-5 py-3.5">
                <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => onEdit(client)}
                    aria-label="Editar cliente"
                    className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-accent-dim hover:text-accent-soft"
                  >
                    <EditIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(client.id)}
                    aria-label="Remover cliente"
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