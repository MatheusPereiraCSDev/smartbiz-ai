import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'
import SalesChart from '../components/SalesChart'
import OrdersPanel from '../components/OrdersPanel'
import AttentionPanel from '../components/AttentionPanel'


const mockStats = [
  { label: 'Receita do mês', value: 'R$ 0,00', trend: 'Aguardando integração' },
  { label: 'Clientes ativos', value: '0', trend: 'Aguardando integração' },
  { label: 'Tarefas pendentes', value: '0', trend: 'Aguardando integração' },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    {mockStats.map((stat) => (
      <StatCard key={stat.label} {...stat} />
    ))}
  </div>

  <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
    <div className="lg:col-span-2">
      <SalesChart />
    </div>
    <div className="flex flex-col gap-4">
      <AttentionPanel />
      <OrdersPanel />
    </div>
  </div>
</main>
      </div>
    </div>
  )
}
