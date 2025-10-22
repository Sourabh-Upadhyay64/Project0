import { useEffect, useState } from 'react'
import axios from 'axios'
import { AlertTriangle, Package, TrendingDown } from 'lucide-react'
import { toast } from 'sonner'

interface InventoryItem {
  _id: string
  name: string
  category: string
  inventoryCount: number
  lowStockThreshold: number
  available: boolean
}

const InventoryManagement = () => {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'low'>('all')

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await axios.get('/api/menu')
      setItems(response.data)
    } catch (error) {
      toast.error('Failed to fetch inventory')
    } finally {
      setLoading(false)
    }
  }

  const updateStock = async (id: string, newCount: number) => {
    try {
      await axios.put(`/api/menu/${id}/inventory`, { inventoryCount: newCount })
      toast.success('Stock updated successfully')
      fetchInventory()
    } catch (error) {
      toast.error('Failed to update stock')
    }
  }

  const filteredItems = items.filter((item) => {
    if (filter === 'low') {
      return item.inventoryCount <= item.lowStockThreshold
    }
    return true
  })

  const lowStockCount = items.filter(
    (item) => item.inventoryCount <= item.lowStockThreshold
  ).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Items</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{items.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Low Stock Items</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{lowStockCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Unavailable Items</p>
              <p className="text-3xl font-bold text-gray-600 mt-1">
                {items.filter((i) => !i.available).length}
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <TrendingDown className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'low'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Low Stock ({lowStockCount})
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Item Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Current Stock</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Threshold</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const isLowStock = item.inventoryCount <= item.lowStockThreshold
              return (
                <tr key={item._id} className={`border-b hover:bg-gray-50 ${isLowStock ? 'bg-red-50' : ''}`}>
                  <td className="py-3 px-4 font-medium">{item.name}</td>
                  <td className="py-3 px-4">{item.category}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={item.inventoryCount}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0
                        setItems((prev) =>
                          prev.map((i) =>
                            i._id === item._id ? { ...i, inventoryCount: newValue } : i
                          )
                        )
                      }}
                      onBlur={(e) => updateStock(item._id, parseInt(e.target.value) || 0)}
                      className={`w-24 px-3 py-1 border rounded ${
                        isLowStock ? 'border-red-500' : 'border-gray-300'
                      }`}
                      min="0"
                    />
                  </td>
                  <td className="py-3 px-4">{item.lowStockThreshold}</td>
                  <td className="py-3 px-4">
                    {isLowStock ? (
                      <span className="flex items-center text-red-600 font-semibold">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">In Stock</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateStock(item._id, item.inventoryCount + 10)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => updateStock(item._id, item.inventoryCount + 50)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        +50
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InventoryManagement
