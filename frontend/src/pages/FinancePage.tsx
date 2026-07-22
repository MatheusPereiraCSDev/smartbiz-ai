import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import TransactionsTable from '../components/TransactionsTable'
import TransactionModal from '../components/TransactionModal'
import Button from '../components/Button'
import SearchInput from '../components/SearchInput'
import { getTransactions, createExpense, deleteTransaction } from '../services/api'
import type { Transaction, ExpenseFormData } from '../types/transaction'

export default function FinancePage() {
  const { user, token, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  async function loadTransactions() {
    if (!token) return
    setIsLoading(true)
    try {
      setTransactions(await getTransactions(token))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [token])

  async function handleSubmit(data: ExpenseFormData) {
    if (!token) return
    await createExpense(token, data)
    await loadTransactions()
  }

  async function handleDelete(id: number) {
    if (!token) return
    if (!confirm('Remover esta transação?')) return
    await deleteTransaction(token, id)
    await loadTransactions()
  }

  const balance = transactions.reduce(
    (acc, tx) => acc + (tx.type === 'receita' ? tx.amount : -tx.amount),
    0
  )

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.client?.name.toLowerCase().includes(search.toLowerCase())
  )

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
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-2xl border border-surface-line bg-surface px-5 py-3">
              <p className="text-xs text-ink-muted">Saldo atual</p>
              <p className={`font-display text-xl font-semibold ${balance >= 0 ? 'text-accent-soft' : 'text-red-300'}`}>
                {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <SearchInput value={search} onChange={setSearch} placeholder="Buscar descrição ou cliente..." />
              <Button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-auto px-4 py-2 text-sm"
              >
                + Nova despesa
              </Button>
            </div>
          </div>

          {isLoading ? (
            <p className="text-sm text-ink-muted">Carregando...</p>
          ) : (
            <TransactionsTable transactions={filteredTransactions} onDelete={handleDelete} />
          )}
        </main>
      </div>

      <TransactionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}