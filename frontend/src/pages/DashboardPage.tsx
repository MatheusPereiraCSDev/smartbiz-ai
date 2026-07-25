import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'
import SalesChart from '../components/SalesChart'
import OrdersPanel from '../components/OrdersPanel'
import AttentionPanel from '../components/AttentionPanel'
import InsightsPanel from '../components/InsightsPanel'
import { getClients, getTransactions, getProducts, getDashboardInsights } from '../services/api'
import type { Client } from '../types/client'
import type { Transaction } from '../types/transaction'
import type { Product } from '../types/product'
import type { Alert } from '../components/AttentionPanel'

function currentMonthRevenue(transactions: Transaction[]): number {
  const now = new Date()
  return transactions
    .filter((tx) => {
      const txDate = new Date(tx.date + 'T00:00:00')
      return (
        tx.type === 'receita' &&
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear()
      )
    })
    .reduce((sum, tx) => sum + tx.amount, 0)
}

function monthlyRevenueSeries(transactions: Transaction[]) {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const now = new Date()
  const series: { month: string; revenue: number }[] = []

  for (let i = 6; i >= 0; i--) {
    const ref = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const revenue = transactions
      .filter((tx) => {
        const txDate = new Date(tx.date + 'T00:00:00')
        return (
          tx.type === 'receita' &&
          txDate.getMonth() === ref.getMonth() &&
          txDate.getFullYear() === ref.getFullYear()
        )
      })
      .reduce((sum, tx) => sum + tx.amount, 0)

    series.push({ month: months[ref.getMonth()], revenue })
  }

  return series
}

function buildAlerts(clients: Client[], transactions: Transaction[], products: Product[]): Alert[] {
  const alerts: Alert[] = []

  const lowStockProducts = products.filter((p) => p.stock <= 5)
  if (lowStockProducts.length > 0) {
    alerts.push({
      title: 'Estoque baixo',
      description: `${lowStockProducts.length} produto(s) com 5 unidades ou menos`,
      level: 'critical',
    })
  }

  const now = new Date()
  const monthExpenses = transactions.filter((tx) => {
    const txDate = new Date(tx.date + 'T00:00:00')
    return (
      tx.type === 'despesa' &&
      txDate.getMonth() === now.getMonth() &&
      txDate.getFullYear() === now.getFullYear()
    )
  })
  const totalExpenses = monthExpenses.reduce((sum, tx) => sum + tx.amount, 0)

  if (totalExpenses > 0) {
    alerts.push({
      title: 'Despesas do mês',
      description: `${monthExpenses.length} despesa(s) somando ${totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
      level: totalExpenses > 1000 ? 'critical' : 'warning',
    })
  }

  const clientsWithoutPurchase = clients.filter(
    (client) => !transactions.some((tx) => tx.client_id === client.id)
  )

  if (clientsWithoutPurchase.length > 0) {
    alerts.push({
      title: 'Clientes sem compras',
      description: `${clientsWithoutPurchase.length} cliente(s) cadastrado(s) sem nenhuma venda registrada`,
      level: 'warning',
    })
  }

  return alerts
}

export default function DashboardPage() {
  const { user, token, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [insights, setInsights] = useState<string[]>([])
  const [isLoadingInsights, setIsLoadingInsights] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!token) return
      setIsLoading(true)
      try {
        const [clientsData, transactionsData, productsData] = await Promise.all([
          getClients(token),
          getTransactions(token),
          getProducts(token),
        ])
        setClients(clientsData)
        setTransactions(transactionsData)
        setProducts(productsData)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [token])

  useEffect(() => {
    async function loadInsights() {
      if (!token) return
      setIsLoadingInsights(true)
      try {
        setInsights(await getDashboardInsights(token))
      } catch {
        setInsights([])
      } finally {
        setIsLoadingInsights(false)
      }
    }
    loadInsights()
  }, [token])

  const pendingExpenses = transactions.filter((tx) => tx.type === 'despesa').length

  const stats = [
    {
      label: 'Receita do mês',
      value: currentMonthRevenue(transactions).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      trend: `${transactions.filter((tx) => tx.type === 'receita').length} vendas no total`,
    },
    {
      label: 'Clientes ativos',
      value: String(clients.length),
      trend: 'Total cadastrado',
    },
    {
      label: 'Despesas registradas',
      value: String(pendingExpenses),
      trend: 'No período atual',
    },
  ]

  const recentOrders = transactions
    .filter((tx) => tx.type === 'receita')
    .slice(0, 5)

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
          {isLoading ? (
            <p className="text-sm text-ink-muted">Carregando...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>

              <div className="mt-6">
                <InsightsPanel insights={insights} isLoading={isLoadingInsights} />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <SalesChart data={monthlyRevenueSeries(transactions)} />
                </div>
                <div className="flex flex-col gap-4">
                  <AttentionPanel alerts={buildAlerts(clients, transactions, products)} />
                  <OrdersPanel orders={recentOrders} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}