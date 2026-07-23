import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'

function TestComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'logged-in' : 'logged-out'}</span>
      <span data-testid="user-name">{user?.name ?? 'no-user'}</span>
      <button onClick={() => login('fake-token', { id: 1, name: 'Maria', email: 'maria@example.com' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('começa deslogado quando não há dados no localStorage', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out')
  })

  it('atualiza o estado e o localStorage ao fazer login', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    act(() => {
      screen.getByText('Login').click()
    })

    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in')
    expect(screen.getByTestId('user-name')).toHaveTextContent('Maria')
    expect(localStorage.getItem('smartbiz_token')).toBe('fake-token')
  })

  it('limpa o estado e o localStorage ao fazer logout', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    act(() => {
      screen.getByText('Login').click()
    })
    act(() => {
      screen.getByText('Logout').click()
    })

    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out')
    expect(localStorage.getItem('smartbiz_token')).toBeNull()
  })

  it('recupera a sessão do localStorage ao montar', () => {
    localStorage.setItem('smartbiz_token', 'stored-token')
    localStorage.setItem('smartbiz_user', JSON.stringify({ id: 2, name: 'Carlos', email: 'carlos@example.com' }))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in')
    expect(screen.getByTestId('user-name')).toHaveTextContent('Carlos')
  })
})