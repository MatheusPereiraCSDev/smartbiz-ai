import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ClientModal from './ClientModal'

describe('ClientModal', () => {
  it('não renderiza nada quando open é false', () => {
    render(
      <ClientModal open={false} onClose={vi.fn()} onSubmit={vi.fn()} editingClient={null} />
    )
    expect(screen.queryByText('Novo cliente')).not.toBeInTheDocument()
  })

  it('mostra o título "Novo cliente" ao criar', () => {
    render(
      <ClientModal open={true} onClose={vi.fn()} onSubmit={vi.fn()} editingClient={null} />
    )
    expect(screen.getByText('Novo cliente')).toBeInTheDocument()
  })

  it('preenche o formulário com os dados do cliente ao editar', () => {
    const client = { id: 1, name: 'João Silva', email: 'joao@example.com', phone: '5511999999999' }
    render(
      <ClientModal open={true} onClose={vi.fn()} onSubmit={vi.fn()} editingClient={client} />
    )
    expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Editar cliente')).toBeInTheDocument()
  })

  it('chama onSubmit com os dados preenchidos ao salvar', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <ClientModal open={true} onClose={vi.fn()} onSubmit={handleSubmit} editingClient={null} />
    )

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Maria' } })
    fireEvent.click(screen.getByText('Salvar'))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Maria' })
      )
    })
  })

  it('exibe mensagem de erro se o envio falhar', async () => {
    const handleSubmit = vi.fn().mockRejectedValue(new Error('Falha'))
    render(
      <ClientModal open={true} onClose={vi.fn()} onSubmit={handleSubmit} editingClient={null} />
    )

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Maria' } })
    fireEvent.click(screen.getByText('Salvar'))

    await waitFor(() => {
      expect(screen.getByText('Não foi possível salvar o cliente.')).toBeInTheDocument()
    })
  })
})