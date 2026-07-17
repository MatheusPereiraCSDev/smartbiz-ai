import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from './Input'
import Button from './Button'
import type { LoginFormData } from '../types/auth'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

interface LoginFormProps {
  onRegisterClick: () => void
}

const initialData: LoginFormData = { email: '', password: '' }

export default function LoginForm({ onRegisterClick }: LoginFormProps) {
  const [data, setData] = useState<LoginFormData>(initialData)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await loginUser({
        email: data.email,
        password: data.password,
      })
      login(result.access_token, result.user)
      navigate('/dashboard')
    } catch {
      setError('E-mail ou senha incorretos. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="email"
        label="E-mail corporativo"
        type="email"
        placeholder="voce@empresa.com"
        autoComplete="email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        required
      />
      <Input
        id="password"
        label="Senha"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        required
      />

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300 animate-fade-in">
          {error}
        </p>
      )}

      <Button type="submit" className="mt-1" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>

      <p className="text-center text-sm text-ink-muted">
        Não possui conta?{' '}
        <button
          type="button"
          onClick={onRegisterClick}
          className="font-medium text-accent-soft transition-colors hover:text-accent focus-ring rounded"
        >
          Cadastre-se
        </button>
      </p>
    </form>
  )
}