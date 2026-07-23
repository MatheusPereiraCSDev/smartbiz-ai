import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('renderiza o texto passado como children', () => {
    render(<Button type="button">Salvar</Button>)
    expect(screen.getByText('Salvar')).toBeInTheDocument()
  })

  it('chama onClick quando clicado', () => {
    const handleClick = vi.fn()
    render(<Button type="button" onClick={handleClick}>Clique aqui</Button>)
    fireEvent.click(screen.getByText('Clique aqui'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('fica desabilitado quando a prop disabled é true', () => {
    render(<Button type="button" disabled>Entrando...</Button>)
    expect(screen.getByText('Entrando...')).toBeDisabled()
  })
})