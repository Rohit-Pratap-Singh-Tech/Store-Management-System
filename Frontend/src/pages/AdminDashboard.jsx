import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logout } from "../auth";
import { dashboardAPI, userAPI, healthCheck } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(0);
  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenue: 0,
    profit: 0,
    lowStockItems: 0,
    outOfStockItems: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [salesStats, setSalesStats] = useState({
    totalSales: 0,
    totalTransactions: 0,
    averageTicket: 0,
    itemsSold: 0,
    recentTransactions: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setStaffLoading(true);

      // Fetch inventory and sales stats
      const [inventoryStats, salesData] = await Promise.all([
        dashboardAPI.getInventoryStats(),
        dashboardAPI.getSalesStats()
      ]);

      setStats(prev => ({
        ...prev,
        totalProducts: inventoryStats.totalProducts || 0,
        lowStockItems: inventoryStats.lowStockItems || 0,
        outOfStockItems: inventoryStats.outOfStockItems || 0
      }));

      setSalesStats({
        totalSales: salesData.totalSales || 0,
        totalTransactions: salesData.totalTransactions || 0,
        averageTicket: salesData.averageTicket || 0,
        itemsSold: salesData.itemsSold || 0,
        recentTransactions: Array.isArray(salesData.recentTransactions) ? salesData.recentTransactions : []
      });

      // Top products by stock
      if (Array.isArray(inventoryStats.products) && inventoryStats.products.length > 0) {
        const sortedProducts = inventoryStats.products
          .sort((a, b) => b.quantity_in_stock - a.quantity_in_stock)
          .slice(0, 4)
          .map(product => ({
            name: product.product_name,
            sales: product.quantity_in_stock,
            revenue: `$${parseFloat(product.price).toFixed(2)}`
          }));
        setTopProducts(sortedProducts);
      } else {
        setTopProducts([]);
      }

      // Recent activities (example: from backend if available)
      if (Array.isArray(inventoryStats.activities)) {
        setRecentActivities(inventoryStats.activities);
      } else {
        setRecentActivities([]);
      }

      // Fetch staff members from backend
      try {
        const staffResponse = await userAPI.getAllUsers();
        if (staffResponse && Array.isArray(staffResponse.users)) {
          setStaffMembers(staffResponse.users);
          setNotifications(staffResponse.users.filter(u => u.status && u.status.toLowerCase() !== "active").length);
        } else {
          setStaffMembers([]);
          setNotifications(0);
        }
      } catch (error) {
        setStaffMembers([]);
        setNotifications(0);
        showMessage('Failed to fetch staff data from backend. Please check your connection.', 'error');
      } finally {
        setStaffLoading(false);
      }

    } catch (error) {
      setRecentActivities([]);
      setTopProducts([]);
      setStaffMembers([]);
      setNotifications(0);
      showMessage('Failed to fetch dashboard data. Please check your backend connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'sales', name: 'Sales Analytics', icon: '💰' },
    { id: 'staff', name: 'Staff Management', icon: '👥' },
    { id: 'reports', name: 'Reports', icon: '📈' }
  ];

  const showMessage = (message, type = 'success') => {
    setMessage(message);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleStaffDelete = async (staffName, staffId) => {
    if (window.confirm(`Are you sure you want to delete ${staffName}?`)) {
      try {
        await userAPI.deleteUser(staffId);
        showMessage(`${staffName} has been removed from the system.`, 'success');
        fetchDashboardData();
      } catch (err) {
        showMessage(`Failed to delete ${staffName}.`, 'error');
      }
    }
  };

  const hasRequiredRole = (requiredRoles) => {
    const userRole = localStorage.getItem('userRole');
    return requiredRoles.includes(userRole);
  };

  const handleInventoryAccess = () => {
    const userRole = localStorage.getItem('userRole');
    if (hasRequiredRole(['Admin', 'Manager'])) {
      showMessage('Accessing Inventory Management...', 'success');
      setTimeout(() => {
        window.location.href = '/manager';
      }, 1000);
    } else {
      showMessage(`Access denied. Admin or Manager privileges required. Current role: ${userRole || 'Not set'}`, 'error');
    }
  };

  const handlePOSAccess = () => {
    const userRole = localStorage.getItem('userRole');
    if (hasRequiredRole(['Admin', 'Manager'])) {
      showMessage('Accessing POS System...', 'success');
      setTimeout(() => {
        window.location.href = '/cashier';
      }, 1000);
    } else {
      showMessage(`Access denied. Admin or Manager privileges required. Current role: ${userRole || 'Not set'}`, 'error');
    }
  };

  // Removed setAdminRole and getCurrentRoleStatus

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
            <div className="flex-1">
              <p className="font-semibold text-slate-800">
                {localStorage.getItem('fullName') || 'Admin User'}
              </p>
              <p className="text-sm text-slate-500">
                {localStorage.getItem('username') || 'admin@store.com'}
              </p>
              <p className="text-xs text-slate-400">
                Role: {localStorage.getItem('userRole') || 'Admin'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
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
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'sales' && 'Sales Analytics'}
                {activeTab === 'staff' && 'Staff Management'}
                {activeTab === 'reports' && 'Reports & Analytics'}
              </h1>
              <p className="text-slate-600 mt-1">
                {activeTab === 'overview' && 'Monitor your store performance and key metrics'}
                {activeTab === 'sales' && 'Track sales performance and revenue analytics'}
                {activeTab === 'staff' && 'Manage staff accounts and permissions'}
                {activeTab === 'reports' && 'Generate detailed reports and analytics'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              {/* Role Status Display removed */}
            </div>
          </div>
        </header>

        {/* Message Display */}
        {message && (
          <div className={`mx-6 mt-4 p-4 rounded-lg border ${
            messageType === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <span className="text-lg mr-2">
                {messageType === 'success' ? '✅' : '❌'}
              </span>
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                          <p className="text-sm font-medium text-slate-600">Staff Members</p>
                          <p className="text-2xl font-bold text-slate-800">{staffMembers.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">👥</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activities and Top Products */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activities</h3>
                      <div className="space-y-3">
                        {recentActivities.length > 0 ? (
                          recentActivities.map((activity, idx) => (
                            <div key={activity.id || idx} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-sm">📝</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-800">{activity.action || activity.description || 'Activity'}</p>
                                <p className="text-sm text-slate-600">{activity.user || 'System'} • {activity.time || ''}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-slate-600">No recent activities</p>
                            <p className="text-sm text-slate-500 mt-2">Activities will appear here as you use the system</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Products</h3>
                      <div className="space-y-3">
                        {topProducts.length > 0 ? (
                          topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-sm font-bold">{index + 1}</span>
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">{product.name}</p>
                                  <p className="text-sm text-slate-600">Stock: {product.sales}</p>
                                </div>
                              </div>
                              <p className="font-semibold text-slate-800">{product.revenue}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-slate-600">No products available</p>
                            <p className="text-sm text-slate-500 mt-2">Add products to see them here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
                    {/* Access Control and Set Admin Role removed */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={handleInventoryAccess}
                        className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <span className="text-2xl">📦</span>
                        <div>
                          <p className="font-medium text-slate-800">Manage Inventory</p>
                          <p className="text-sm text-slate-600">Add or update products</p>
                        </div>
                      </button>
                      <button
                        onClick={handlePOSAccess}
                        className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
                      >
                        <span className="text-2xl">💳</span>
                        <div>
                          <p className="font-medium text-slate-800">POS System</p>
                          <p className="text-sm text-slate-600">Process transactions</p>
                        </div>
                      </button>
                      <Link
                        to="/signup"
                        className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <span className="text-2xl">👨‍💼</span>
                        <div>
                          <p className="font-medium text-slate-800">Add Staff Member</p>
                          <p className="text-sm text-slate-600">Create new staff accounts</p>
                        </div>
                      </Link>
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
                      {salesStats.recentTransactions && salesStats.recentTransactions.length > 0 ? (
                        salesStats.recentTransactions.map((transaction) => (
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
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-600">No recent transactions</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'staff' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-slate-800">Staff Management</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={async () => {
                            const isConnected = await healthCheck();
                            if (isConnected) {
                              showMessage('Backend is reachable!', 'success');
                            } else {
                              showMessage('Backend connection failed!', 'error');
                            }
                          }}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          Test Backend
                        </button>
                        <button
                          onClick={() => {
                            fetchDashboardData();
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Refresh
                        </button>
                        <Link
                          to="/signup"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add New Staff
                        </Link>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {staffLoading ? (
                        <div className="text-center py-8">
                          <p className="text-slate-600">Loading staff data...</p>
                        </div>
                      ) : staffMembers.length > 0 ? (
                        staffMembers.map((staff, index) => (
                          <div key={staff.id || index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">
                                  {staff.full_name ? staff.full_name.split(' ').map(n => n[0]).join('') : staff.username}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">{staff.full_name || staff.username}</p>
                                <p className="text-sm text-slate-600">@{staff.username} • {staff.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                                {staff.status || 'Active'}
                              </span>
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleStaffDelete(staff.full_name || staff.username, staff.id)}
                              >
                                <span className="text-lg">🗑️</span>
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-600">No staff members found</p>
                          <p className="text-sm text-slate-500 mt-2">
                            Add staff members using the button above or check your backend connection
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs can be implemented similarly */}
              {activeTab !== 'overview' && activeTab !== 'staff' && activeTab !== 'sales' && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                  <p className="text-slate-600">This feature is coming soon. Stay tuned for updates!</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
