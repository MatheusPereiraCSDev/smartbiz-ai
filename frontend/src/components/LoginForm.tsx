import { loginUser } from '../services/api'
import { FormEvent, useState } from 'react'
import Input from './Input'
import Button from './Button'
import type { LoginFormData } from '../types/auth'

interface LoginFormProps {
  onRegisterClick: () => void
}

const initialData: LoginFormData = { email: '', password: '' }

export default function LoginForm({ onRegisterClick }: LoginFormProps) {
  const [data, setData] = useState<LoginFormData>(initialData)

  // UI-only placeholder. Real authentication will be wired to
  // FastAPI + JWT in a later stage of the project.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()

  try {
    const result = await loginUser({
      email: data.email,
      password: data.password,
    })
    console.log('Login OK:', result)
  } catch (error) {
    console.error('Erro no login:', error)
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

      <Button type="submit" className="mt-1">
        Entrar
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
