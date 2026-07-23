import { FormEvent, useEffect, useState } from 'react'
import Input from './Input'
import Button from './Button'
import type { ExpenseFormData, Transaction } from '../types/transaction'

interface TransactionModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ExpenseFormData) => Promise<void>
  editingTransaction: Transaction | null
}

const emptyForm: ExpenseFormData = {
  description: '',
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
}

export default function TransactionModal({ open, onClose, onSubmit, editingTransaction }: TransactionModalProps) {
  const [data, setData] = useState<ExpenseFormData>(emptyForm)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setData(
        editingTransaction
          ? { description: editingTransaction.description, amount: editingTransaction.amount, date: editingTransaction.date }
          : emptyForm
      )
      setError(null)
    }
  }, [open, editingTransaction])

  if (!open) return null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await onSubmit(data)
      onClose()
    } catch {
      setError('Não foi possível salvar a despesa.')
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

        <h2 className="font-display text-xl font-semibold text-ink">
          {editingTransaction ? 'Editar despesa' : 'Nova despesa'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            id="expense-description"
            label="Descrição"
            type="text"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            required
          />
          <Input
            id="expense-amount"
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0"
            value={data.amount}
            onChange={(e) => setData({ ...data, amount: parseFloat(e.target.value) || 0 })}
            required
          />
          <Input
            id="expense-date"
            label="Data"
            type="date"
            value={data.date}
            onChange={(e) => setData({ ...data, date: e.target.value })}
            required
          />

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isLoading} className="mt-2">
            {isLoading ? 'Salvando...' : 'Salvar despesa'}
          </Button>
        </form>
      </div>
    </div>
  )
}