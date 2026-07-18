import { FormEvent, useEffect, useState } from 'react'
import Input from './Input'
import Button from './Button'
import type { Client } from '../types/client'
import type { PurchaseFormData } from '../types/transaction'

interface PurchaseModalProps {
  open: boolean
  client: Client | null
  onClose: () => void
  onSubmit: (data: PurchaseFormData) => Promise<void>
}

export default function PurchaseModal({ open, client, onClose, onSubmit }: PurchaseModalProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState(0)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setDescription('')
      setAmount(0)
      setDate(new Date().toISOString().slice(0, 10))
      setError(null)
    }
  }, [open])

  if (!open || !client) return null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await onSubmit({ description, amount, date, client_id: client!.id })
      onClose()
    } catch {
      setError('Não foi possível registrar a compra.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
      <button type="button" aria-label="Fechar" onClick={onClose} className="absolute inset-0 bg-base-deep/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-md animate-modal-in rounded-2xl border border-accent bg-surface p-7 shadow-glow sm:p-8">
        <button type="button" onClick={onClose} aria-label="Fechar" className="absolute right-5 top-5 rounded-md p-1 text-ink-faint transition-colors hover:text-ink focus-ring">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <h2 className="font-display text-xl font-semibold text-ink">Registrar compra</h2>
        <p className="mt-1 text-sm text-ink-muted">Cliente: {client.name}</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            id="purchase-description"
            label="Descrição"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Input
            id="purchase-amount"
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            required
          />
          <Input
            id="purchase-date"
            label="Data"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isLoading} className="mt-2">
            {isLoading ? 'Salvando...' : 'Registrar compra'}
          </Button>
        </form>
      </div>
    </div>
  )
}