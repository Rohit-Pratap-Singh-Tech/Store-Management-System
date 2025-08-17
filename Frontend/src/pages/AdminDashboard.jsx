import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logout } from "../auth"; 

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [notifications, setNotifications] = useState(3)
  const [stats, setStats] = useState({
    totalSales: 125840,
    totalOrders: 1247,
    totalCustomers: 892,
    totalProducts: 456,
    revenue: 89250,
    profit: 12580
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalSales: prev.totalSales + Math.floor(Math.random() * 100),
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 5)
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'sales', name: 'Sales Analytics', icon: '💰' },
    { id: 'inventory', name: 'Inventory', icon: '📦' },
    { id: 'customers', name: 'Customers', icon: '👥' },
    { id: 'staff', name: 'Staff Management', icon: '👨‍💼' },
    { id: 'reports', name: 'Reports', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ]

  const recentActivities = [
    { id: 1, action: 'New order placed', user: 'Customer #892', time: '2 minutes ago', type: 'order' },
    { id: 2, action: 'Staff member added', user: 'John Doe', time: '15 minutes ago', type: 'staff' },
    { id: 3, action: 'Inventory updated', user: 'System', time: '1 hour ago', type: 'inventory' },
    { id: 4, action: 'Payment processed', user: 'Customer #845', time: '2 hours ago', type: 'payment' }
  ]

  const topProducts = [
    { name: 'Wireless Headphones', sales: 245, revenue: '$12,250' },
    { name: 'Smart Watch', sales: 189, revenue: '$18,900' },
    { name: 'Laptop Stand', sales: 156, revenue: '$4,680' },
    { name: 'USB Cable', sales: 298, revenue: '$2,980' }
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Sidebar */}
      <aside className="w-72 bg-white/90 backdrop-blur-md shadow-2xl border-r border-white/20 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
              <p className="text-sm text-slate-500">Store Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                  {item.id === 'staff' && notifications > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {notifications}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">👤</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Admin User</p>
              <p className="text-sm text-slate-500">admin@store.com</p>
            </div>
          </div>
          
          <Link
            to="/signup"
            className="block w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-center mb-2"
          >
            Add Staff
          </Link>
          
          <button
            onClick={logout}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Enhanced Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 capitalize">
                {activeTab === 'overview' ? 'Dashboard Overview' : activeTab.replace('-', ' ')}
              </h1>
              <p className="text-slate-600 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17V3a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h6z"/>
                </svg>
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              
              <Link
                to="/"
                className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
              >
                🏠 Home
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-100px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Total Sales</p>
                      <p className="text-2xl font-bold text-slate-800">${stats.totalSales.toLocaleString()}</p>
                      <p className="text-emerald-600 text-sm">↗ +12.5% from last week</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      💰
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Total Orders</p>
                      <p className="text-2xl font-bold text-slate-800">{stats.totalOrders.toLocaleString()}</p>
                      <p className="text-blue-600 text-sm">↗ +8.2% from last week</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      📋
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Customers</p>
                      <p className="text-2xl font-bold text-slate-800">{stats.totalCustomers.toLocaleString()}</p>
                      <p className="text-purple-600 text-sm">↗ +15.3% from last week</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      👥
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Products</p>
                      <p className="text-2xl font-bold text-slate-800">{stats.totalProducts.toLocaleString()}</p>
                      <p className="text-orange-600 text-sm">↗ +5.1% from last week</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      📦
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts and Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Sales Analytics</h3>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-4">📈</div>
                      <p className="text-slate-600">Interactive Sales Chart</p>
                      <p className="text-sm text-slate-500 mt-2">Chart.js integration coming soon</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activities</h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'staff' ? 'bg-emerald-100 text-emerald-600' :
                          activity.type === 'inventory' ? 'bg-orange-100 text-orange-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {activity.type === 'order' ? '📋' :
                           activity.type === 'staff' ? '👨‍💼' :
                           activity.type === 'inventory' ? '📦' : '💳'}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{activity.action}</p>
                          <p className="text-sm text-slate-600">{activity.user}</p>
                        </div>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Top Selling Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300">
                      <h4 className="font-semibold text-slate-800">{product.name}</h4>
                      <p className="text-sm text-slate-600 mt-1">{product.sales} units sold</p>
                      <p className="text-lg font-bold text-blue-600 mt-2">{product.revenue}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other Tab Contents */}
          {activeTab !== 'overview' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center">
              <div className="text-6xl mb-4">
                {activeTab === 'sales' ? '💰' :
                 activeTab === 'inventory' ? '📦' :
                 activeTab === 'customers' ? '👥' :
                 activeTab === 'staff' ? '👨‍💼' :
                 activeTab === 'reports' ? '📈' : '⚙️'}
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2 capitalize">
                {activeTab.replace('-', ' ')} Section
              </h2>
              <p className="text-slate-600 mb-6">
                This section is under development. Coming soon with advanced features!
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <p className="text-sm text-slate-600">
                  🚀 Features coming soon: Advanced analytics, real-time updates, interactive charts, and more!
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
