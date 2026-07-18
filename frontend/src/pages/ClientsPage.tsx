import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import ClientsTable from '../components/ClientsTable'
import ClientModal from '../components/ClientModal'
import Button from '../components/Button'
import { getClients, createClient, updateClient, deleteClient } from '../services/api'
import type { Client, ClientFormData } from '../types/client'

export default function ClientsPage() {
  const { user, token, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function loadClients() {
    if (!token) return
    setIsLoading(true)
    try {
      const data = await getClients(token)
      setClients(data)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [token])

  function handleOpenCreate() {
    setEditingClient(null)
    setIsModalOpen(true)
  }

  function handleOpenEdit(client: Client) {
    setEditingClient(client)
    setIsModalOpen(true)
  }

  async function handleSubmit(data: ClientFormData) {
    if (!token) return
    if (editingClient) {
      await updateClient(token, editingClient.id, data)
    } else {
      await createClient(token, data)
    }
    await loadClients()
  }

  async function handleDelete(id: number) {
    if (!token) return
    if (!confirm('Remover este cliente?')) return
    await deleteClient(token, id)
    await loadClients()
  }

  return (
    <div className="flex min-h-screen bg-base text-ink">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1">
        <Topbar
          userName={user?.name ?? ''}
          userEmail={user?.email ?? ''}
          onMenuClick={() => setIsSidebarOpen(true)}
          onLogout={logout}
        />

        <main className="px-6 py-8 sm:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Clientes</h2>
            <Button
                    type="button"
                    onClick={handleOpenCreate}
                    className="w-auto px-[15px] py-[7.5px] text-xs"
                    >
                    + Novo cliente
            </Button>
          </div>

          {isLoading ? (
            <p className="text-sm text-ink-muted">Carregando...</p>
          ) : (
            <ClientsTable clients={clients} onEdit={handleOpenEdit} onDelete={handleDelete} />
          )}
        </main>
      </div>

      <ClientModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        editingClient={editingClient}
      />
    </div>
  )
}