import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logout } from "../auth";
import { dashboardAPI, salesAPI } from '../services/api';

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [pendingTasks, setPendingTasks] = useState([])
  const [salesStats, setSalesStats] = useState({
    totalSales: 0,
    totalTransactions: 0,
    averageTicket: 0,
    itemsSold: 0,
    recentTransactions: []
  })

  // Fetch real data from API
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [inventoryStats, salesData] = await Promise.all([
        dashboardAPI.getInventoryStats(),
        dashboardAPI.getSalesStats()
      ]);
      
      setStats(prev => ({
        ...prev,
        totalProducts: inventoryStats.totalProducts,
        lowStockItems: inventoryStats.lowStockItems,
        outOfStockItems: inventoryStats.outOfStockItems
      }));

      setSalesStats(salesData);

      // Generate pending tasks based on inventory status
      const tasks = [];
      if (inventoryStats.lowStockItems > 0) {
        tasks.push({
          id: 1,
          title: 'Low Stock Alert',
          description: `${inventoryStats.lowStockItems} items need restocking`,
          priority: 'high',
          type: 'inventory'
        });
      }
      if (inventoryStats.outOfStockItems > 0) {
        tasks.push({
          id: 2,
          title: 'Out of Stock Items',
          description: `${inventoryStats.outOfStockItems} items are completely out of stock`,
          priority: 'urgent',
          type: 'inventory'
        });
      }
      if (inventoryStats.totalProducts === 0) {
        tasks.push({
          id: 3,
          title: 'No Products Available',
          description: 'Add products to start selling',
          priority: 'high',
          type: 'setup'
        });
      }
      setPendingTasks(tasks);

      // Set recent orders from sales data (empty for now since no sales backend)
      setRecentOrders([]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('selectedRole');
    window.location.href = '/login';
  };

  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'sales', name: 'Sales', icon: '💰' },
    { id: 'inventory', name: 'Inventory', icon: '📦' },
    { id: 'reports', name: 'Reports', icon: '📈' }
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white/90 backdrop-blur-md shadow-2xl border-r border-white/20 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Manager Panel</h2>
              <p className="text-sm text-slate-500">Store Operations</p>
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
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-green-600'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                  {item.id === 'inventory' && (stats.lowStockItems > 0 || stats.outOfStockItems > 0) && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {stats.lowStockItems + stats.outOfStockItems}
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
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">👤</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">Manager</p>
              <p className="text-sm text-slate-500">manager@store.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-white/20 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {activeTab === 'overview' && 'Manager Overview'}
                {activeTab === 'sales' && 'Sales Management'}
                {activeTab === 'inventory' && 'Inventory Overview'}
                {activeTab === 'reports' && 'Reports & Analytics'}
              </h1>
              <p className="text-slate-600 mt-1">
                {activeTab === 'overview' && 'Monitor store operations and key performance metrics'}
                {activeTab === 'sales' && 'Track sales performance and manage transactions'}
                {activeTab === 'inventory' && 'Monitor inventory levels and stock management'}
                {activeTab === 'reports' && 'Generate and view detailed reports'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Sales</p>
                          <p className="text-2xl font-bold text-slate-800">${salesStats.totalSales.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">💰</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Products</p>
                          <p className="text-2xl font-bold text-slate-800">{stats.totalProducts}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Low Stock Items</p>
                          <p className="text-2xl font-bold text-orange-600">{stats.lowStockItems}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">⚠️</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Out of Stock</p>
                          <p className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🚫</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders and Pending Tasks */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Orders</h3>
                                           <div className="space-y-3">
                       {recentOrders.length > 0 ? (
                         recentOrders.slice(0, 5).map((order) => (
                           <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                             <div>
                               <p className="font-medium text-slate-800">{order.customer}</p>
                               <p className="text-sm text-slate-600">{order.time} • {order.items} items</p>
                             </div>
                             <div className="text-right">
                               <p className="font-semibold text-slate-800">${order.amount.toFixed(2)}</p>
                               <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                                 {order.status}
                               </span>
                             </div>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-8">
                           <p className="text-slate-600">No recent orders</p>
                           <p className="text-sm text-slate-500 mt-2">Orders will appear here once sales are processed</p>
                         </div>
                       )}
                     </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Pending Tasks</h3>
                                           <div className="space-y-3">
                       {pendingTasks.length > 0 ? (
                         pendingTasks.map((task) => (
                           <div key={task.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border-l-4 border-orange-500">
                             <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                               <span className="text-sm">📋</span>
                             </div>
                             <div className="flex-1">
                               <p className="font-medium text-slate-800">{task.title}</p>
                               <p className="text-sm text-slate-600">{task.description}</p>
                             </div>
                             <span className={`text-xs px-2 py-1 rounded-full ${
                               task.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                             }`}>
                               {task.priority}
                             </span>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-8">
                           <p className="text-slate-600">No pending tasks</p>
                           <p className="text-sm text-slate-500 mt-2">All inventory levels are healthy</p>
                         </div>
                       )}
                     </div>
                    </div>
                  </div>


                </div>
              )}

              {activeTab === 'sales' && (
                <div className="space-y-6">
                  {/* Sales Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Sales</p>
                          <p className="text-2xl font-bold text-slate-800">${salesStats.totalSales.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">💰</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Transactions</p>
                          <p className="text-2xl font-bold text-slate-800">{salesStats.totalTransactions}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📊</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Average Ticket</p>
                          <p className="text-2xl font-bold text-slate-800">${salesStats.averageTicket.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📈</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Items Sold</p>
                          <p className="text-2xl font-bold text-slate-800">{salesStats.itemsSold}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Transactions */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h3>
                    <div className="space-y-3">
                      {salesStats.recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-800">{transaction.customer}</p>
                            <p className="text-sm text-slate-600">{transaction.time} • {transaction.items} items</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-800">${transaction.amount.toFixed(2)}</p>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'inventory' && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-800">Inventory Overview</h3>
                    <Link
                      to="/inventory"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Manage Inventory
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-slate-600">Total Products</p>
                      <p className="text-2xl font-bold text-slate-800">{stats.totalProducts}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm font-medium text-slate-600">Low Stock Items</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.lowStockItems}</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm font-medium text-slate-600">Out of Stock</p>
                      <p className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-600">Access the full inventory management system to add, edit, and manage products and categories.</p>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Reports & Analytics</h3>
                  <p className="text-slate-600">Detailed reports and analytics features are coming soon. For now, you can view basic statistics in the Overview and Sales tabs.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
