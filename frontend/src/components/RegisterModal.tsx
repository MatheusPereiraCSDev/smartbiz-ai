import { FormEvent, useEffect, useState } from 'react'
import Input from './Input'
import Button from './Button'
import type { RegisterFormData } from '../types/auth'
import { registerUser } from '../services/api'

interface RegisterModalProps {
  open: boolean
  onClose: () => void
}

const initialData: RegisterFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default function RegisterModal({ open, onClose }: RegisterModalProps) {
  const [data, setData] = useState<RegisterFormData>(initialData)

  // Lock background scroll while the modal is open.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Allow closing with Escape.
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  // UI-only placeholder. Account creation will be wired to the
  // backend API in a later stage of the project.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()

  try {
    const result = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    })
    console.log('Sucesso:', result)
  } catch (error) {
    console.error('Erro:', error)
  }
}

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-base-deep/80 backdrop-blur-sm"
      />

      {/* Modal card */}
      <div className="relative w-full max-w-md animate-modal-in rounded-2xl border border-accent bg-surface p-7 shadow-glow sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar cadastro"
          className="absolute right-5 top-5 rounded-md p-1 text-ink-faint transition-colors hover:text-ink focus-ring"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 id="register-title" className="font-display text-xl font-semibold text-ink">
          Criar conta
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Configure seu acesso à plataforma SmartBiz AI.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            id="name"
            label="Nome completo"
            type="text"
            placeholder="Seu nome"
            autoComplete="name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
          />
          <Input
            id="register-email"
            label="E-mail corporativo"
            type="email"
            placeholder="voce@empresa.com"
            autoComplete="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required
          />
          <Input
            id="register-password"
            label="Senha"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            required
          />
          <Input
            id="confirm-password"
            label="Confirmar senha"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={data.confirmPassword}
            onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
            required
          />

          <Button type="submit" className="mt-2">
            Criar conta
          </Button>
        </form>
      </div>
    </div>
  )
}
