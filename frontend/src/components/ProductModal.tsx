import { FormEvent, useEffect, useState } from 'react'
import Input from './Input'
import Button from './Button'
import type { Product, ProductFormData } from '../types/product'

interface ProductModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ProductFormData) => Promise<void>
  editingProduct: Product | null
}

const emptyForm: ProductFormData = { name: '', price: 0, stock: 0 }

export default function ProductModal({ open, onClose, onSubmit, editingProduct }: ProductModalProps) {
  const [data, setData] = useState<ProductFormData>(emptyForm)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setData(
        editingProduct
          ? { name: editingProduct.name, price: editingProduct.price, stock: editingProduct.stock }
          : emptyForm
      )
      setError(null)
    }
  }, [open, editingProduct])

  if (!open) return null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await onSubmit(data)
      onClose()
    } catch {
      setError('Não foi possível salvar o produto.')
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
          {editingProduct ? 'Editar produto' : 'Novo produto'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            id="product-name"
            label="Nome"
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
          />
          <Input
            id="product-price"
            label="Preço (R$)"
            type="number"
            step="0.01"
            min="0"
            value={data.price}
            onChange={(e) => setData({ ...data, price: parseFloat(e.target.value) || 0 })}
            required
          />
          <Input
            id="product-stock"
            label="Estoque"
            type="number"
            min="0"
            value={data.stock}
            onChange={(e) => setData({ ...data, stock: parseInt(e.target.value) || 0 })}
            required
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