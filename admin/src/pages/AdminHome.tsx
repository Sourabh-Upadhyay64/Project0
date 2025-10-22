import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { LogOut, Menu as MenuIcon, Users, Package, TrendingUp, ShoppingCart, AlertTriangle } from 'lucide-react'
import Dashboard from '../components/admin/Dashboard'
import MenuManagement from '../components/admin/MenuManagement'
import InventoryManagement from '../components/admin/InventoryManagement'
import UserManagement from '../components/admin/UserManagement'

type Tab = 'dashboard' | 'menu' | 'inventory' | 'users'

const AdminHome = () => {
  const { logout, user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
  }

  const tabs = [
    { id: 'dashboard' as Tab, name: 'Dashboard', icon: TrendingUp },
    { id: 'menu' as Tab, name: 'Menu Management', icon: MenuIcon },
    { id: 'inventory' as Tab, name: 'Inventory', icon: Package },
    { id: 'users' as Tab, name: 'Kitchen Staff', icon: Users },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-900 text-white transition-all duration-300`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && <h1 className="text-xl font-bold">QuickServe Admin</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-blue-800 rounded-lg"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {sidebarOpen && <span>{tab.name}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {tabs.find(t => t.id === activeTab)?.name}
            </h2>
            <p className="text-gray-600">Welcome back, {user?.username}!</p>
          </div>

          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'menu' && <MenuManagement />}
          {activeTab === 'inventory' && <InventoryManagement />}
          {activeTab === 'users' && <UserManagement />}
        </div>
      </div>
    </div>
  )
}

export default AdminHome
