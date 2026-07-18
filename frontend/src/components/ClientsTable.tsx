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

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18v12H3V6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.7.8-.9 1c-.2.2-.3.2-.6.1a6.6 6.6 0 01-2-1.2 7.4 7.4 0 01-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.1.2-.3.2-.4a.5.5 0 000-.5c-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2c0 1.3 1 2.6 1.1 2.7.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6a3.9 3.9 0 001.8.1c.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z" />
    </svg>
  )
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '')
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
                  {client.email ? (
                    <a href={`mailto:${client.email}`} title="Enviar e-mail" className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-accent-dim hover:text-accent-soft">
                      <MailIcon />
                    </a>
                  ) : null}
                  {client.phone ? (
                    <a href={`https://wa.me/${normalizePhone(client.phone)}`} target="_blank" rel="noopener noreferrer" title="Enviar mensagem via WhatsApp" className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-green-500/10 hover:text-green-400">
                      <WhatsAppIcon />
                    </a>
                  ) : null}
                  <button type="button" onClick={() => onEdit(client)} title="Editar" className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-accent-dim hover:text-accent-soft">
                    <EditIcon />
                  </button>
                  <button type="button" onClick={() => onDelete(client.id)} title="Remover" className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-red-500/10 hover:text-red-300">
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