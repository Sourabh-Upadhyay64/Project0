import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '../../lib/utils'

interface MenuItem {
  _id?: string
  name: string
  description: string
  price: number
  category: string
  image: string
  available: boolean
  inventoryCount: number
  lowStockThreshold: number
}

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<MenuItem>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    available: true,
    inventoryCount: 0,
    lowStockThreshold: 5,
  })

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('/api/menu')
      setMenuItems(response.data)
    } catch (error) {
      toast.error('Failed to fetch menu items')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem?._id) {
        await axios.put(`/api/menu/${editingItem._id}`, formData)
        toast.success('Menu item updated successfully')
      } else {
        await axios.post('/api/menu', formData)
        toast.success('Menu item added successfully')
      }
      fetchMenuItems()
      resetForm()
    } catch (error) {
      toast.error('Failed to save menu item')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      await axios.delete(`/api/menu/${id}`)
      toast.success('Menu item deleted successfully')
      fetchMenuItems()
    } catch (error) {
      toast.error('Failed to delete menu item')
    }
  }

  const toggleAvailability = async (item: MenuItem) => {
    try {
      await axios.put(`/api/menu/${item._id}`, {
        ...item,
        available: !item.available,
      })
      toast.success(`Item ${!item.available ? 'enabled' : 'disabled'}`)
      fetchMenuItems()
    } catch (error) {
      toast.error('Failed to update availability')
    }
  }

  const updateInventory = async (id: string, count: number) => {
    try {
      await axios.put(`/api/menu/${id}/inventory`, { inventoryCount: count })
      toast.success('Inventory updated')
      fetchMenuItems()
    } catch (error) {
      toast.error('Failed to update inventory')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      available: true,
      inventoryCount: 0,
      lowStockThreshold: 5,
    })
    setEditingItem(null)
    setShowForm(false)
  }

  const startEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData(item)
    setShowForm(true)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Menu Items</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inventory Count</label>
                  <input
                    type="number"
                    value={formData.inventoryCount}
                    onChange={(e) => setFormData({ ...formData, inventoryCount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
                  <input
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Available for orders</label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-5 h-5 inline mr-2" />
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Item</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Inventory</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    )}
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">{item.category}</td>
                <td className="py-3 px-4 font-semibold">{formatCurrency(item.price)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={item.inventoryCount}
                      onChange={(e) => updateInventory(item._id!, parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border rounded"
                      min="0"
                    />
                    {item.inventoryCount <= item.lowStockThreshold && (
                      <span className="text-red-600 text-xs font-semibold">Low Stock!</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => toggleAvailability(item)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.available ? 'Available' : 'Unavailable'}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id!)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MenuManagement
