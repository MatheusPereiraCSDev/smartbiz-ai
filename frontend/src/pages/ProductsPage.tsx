import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import ProductsTable from '../components/ProductsTable'
import ProductModal from '../components/ProductModal'
import Button from '../components/Button'
import SearchInput from '../components/SearchInput'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api'
import type { Product, ProductFormData } from '../types/product'

export default function ProductsPage() {
  const { user, token, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  async function loadProducts() {
    if (!token) return
    setIsLoading(true)
    try {
      setProducts(await getProducts(token))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [token])

  function handleOpenCreate() {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  function handleOpenEdit(product: Product) {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  async function handleSubmit(data: ProductFormData) {
    if (!token) return
    if (editingProduct) {
      await updateProduct(token, editingProduct.id, data)
    } else {
      await createProduct(token, data)
    }
    await loadProducts()
  }

  async function handleDelete(id: number) {
    if (!token) return
    if (!confirm('Remover este produto?')) return
    await deleteProduct(token, id)
    await loadProducts()
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
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
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome..." />
            <Button type="button" onClick={handleOpenCreate} className="w-auto px-4 py-2 text-sm">
              + Novo produto
            </Button>
          </div>

          {isLoading ? (
            <p className="text-sm text-ink-muted">Carregando...</p>
          ) : (
            <ProductsTable products={filteredProducts} onEdit={handleOpenEdit} onDelete={handleDelete} />
          )}
        </main>
      </div>

      <ProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
      />
    </div>
  )
}