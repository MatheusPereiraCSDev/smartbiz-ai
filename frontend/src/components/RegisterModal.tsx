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
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Limpa o formulário sempre que o modal fecha
  useEffect(() => {
    if (!open) {
      setData(initialData)
      setError(null)
      setSuccess(false)
    }
  }, [open])

  if (!open) return null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (data.password !== data.confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    if (data.password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    setIsLoading(true)

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      setSuccess(true)
    } catch {
      setError('Não foi possível criar a conta. O e-mail já pode estar em uso.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-title"
    >
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

        {success ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center animate-fade-in">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-dim text-accent">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="font-display text-lg font-semibold text-ink">
              Conta criada com sucesso
            </h2>
            <p className="text-sm text-ink-muted">
              Agora você já pode entrar com seu e-mail e senha.
            </p>
            <Button type="button" onClick={onClose} className="mt-2">
              Ir para o login
            </Button>
          </div>
        ) : (
          <>
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

              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300 animate-fade-in">
                  {error}
                </p>
              )}

              <Button type="submit" className="mt-2" disabled={isLoading}>
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}