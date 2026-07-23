import { FormEvent, useEffect, useState } from 'react'
import Input from './Input'
import Button from './Button'
import type { Client, ClientFormData } from '../types/client'
import { formatPhone, isValidPhone } from '../utils/phone'


interface ClientModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ClientFormData) => Promise<void>
  editingClient: Client | null
}

const emptyForm: ClientFormData = { name: '', email: '', phone: '' }

export default function ClientModal({ open, onClose, onSubmit, editingClient }: ClientModalProps) {
  const [data, setData] = useState<ClientFormData>(emptyForm)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setData(
        editingClient
          ? { name: editingClient.name, email: editingClient.email ?? '', phone: editingClient.phone ?? '' }
          : emptyForm
      )
      setError(null)
    }
  }, [open, editingClient])

  if (!open) return null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  setError(null)

  if (data.phone && !isValidPhone(data.phone)) {
    setError('Telefone inválido. Use o formato +55 (DDD) 99999-9999.')
    return
  }

  setIsLoading(true)
  try {
    await onSubmit(data)
    onClose()
  } catch {
    setError('Não foi possível salvar o cliente.')
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-base-deep/80 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md animate-modal-in rounded-2xl border border-accent bg-surface p-7 shadow-glow sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-5 top-5 rounded-md p-1 text-ink-faint transition-colors hover:text-ink focus-ring"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <h2 className="font-display text-xl font-semibold text-ink">
          {editingClient ? 'Editar cliente' : 'Novo cliente'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            id="client-name"
            label="Nome"
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
          />
          <Input
            id="client-email"
            label="E-mail"
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <Input
            id="client-phone"
            label="Telefone (com DDI)"
            type="text"
            placeholder="+55 (11) 99999-9999"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: formatPhone(e.target.value) })}
          />

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isLoading} className="mt-2">
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </div>
    </div>
  )
}