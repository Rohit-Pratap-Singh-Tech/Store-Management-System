import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  CreditCard, 
  Users, 
  Package, 
  Search, 
  Plus,
  Minus,
  X,
  Receipt,
  Clock,
  TrendingUp,
  LogOut,
  CheckCircle,
  XCircle,
  DollarSign,
  Percent,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { productAPI } from '../services/api';

const CashierDashboard = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // POS System State
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // Real data from API
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [recentTransactions, setRecentTransactions] = useState([]);

  const [dailyStats, setDailyStats] = useState({
    totalSales: 0,
    totalTransactions: 0,
    averageTicket: 0,
    itemsSold: 0
  });

  // Fetch real data from API
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();
      if (response.status === 'success') {
        setProducts(response.products);
        setFilteredProducts(response.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showMessage('error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('selectedRole');
    window.location.href = '/';
  };

  const addToCart = (product) => {
    // Check if product is already in cart
    const existingItem = cart.find(item => item.product_name === product.product_name);
    
    if (existingItem) {
      // Check if adding one more would exceed available stock
      if (existingItem.quantity >= product.quantity_in_stock) {
        showMessage('error', `Cannot add more ${product.product_name}. Only ${product.quantity_in_stock} in stock.`);
        return;
      }
      
      setCart(cart.map(item => 
        item.product_name === product.product_name 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Check if product has stock available
      if (product.quantity_in_stock <= 0) {
        showMessage('error', `${product.product_name} is out of stock.`);
        return;
      }
      
      setCart([...cart, { 
        ...product, 
        quantity: 1,
        id: product.product_name // Use product name as ID since backend doesn't have numeric IDs
      }]);
    }
    showMessage('success', `${product.product_name} added to cart`);
  };

  const removeFromCart = (productName) => {
    setCart(cart.filter(item => item.product_name !== productName));
    showMessage('success', 'Item removed from cart');
  };

  const updateQuantity = (productName, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productName);
      return;
    }
    
    // Find the product to check available stock
    const product = products.find(p => p.product_name === productName);
    if (product && newQuantity > product.quantity_in_stock) {
      showMessage('error', `Cannot set quantity higher than available stock (${product.quantity_in_stock})`);
      return;
    }
    
    setCart(cart.map(item => 
      item.product_name === productName 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const processTransaction = async () => {
    if (cart.length === 0) {
      showMessage('error', 'Cart is empty');
      return;
    }

    try {
      setLoading(true);
      
      // Update stock for each item in cart
      const stockUpdatePromises = cart.map(async (item) => {
        const newQuantity = item.quantity_in_stock - item.quantity;
        if (newQuantity < 0) {
          throw new Error(`Insufficient stock for ${item.product_name}`);
        }
        
        // Update stock in backend
        await productAPI.updateProductStock(item.product_name, newQuantity);
        
        // Return updated product data
        return {
          ...item,
          quantity_in_stock: newQuantity
        };
      });

      // Wait for all stock updates to complete
      const updatedProducts = await Promise.all(stockUpdatePromises);
      
      // Update local products state with new stock levels
      setProducts(prevProducts => 
        prevProducts.map(product => {
          const updatedProduct = updatedProducts.find(up => up.product_name === product.product_name);
          return updatedProduct ? { ...product, quantity_in_stock: updatedProduct.quantity_in_stock } : product;
        })
      );

      // Note: Transaction records would be saved to backend here
      // For now, we only update stock levels
      console.log('Transaction completed:', {
        customer: customerInfo.name || 'Walk-in Customer',
        amount: getCartTotal(),
        items: getCartItemCount(),
        cart: cart
      });

      // Clear cart and customer info
      setCart([]);
      setCustomerInfo({ name: '', phone: '', email: '' });
      showMessage('success', 'Transaction completed successfully! Stock updated.');
      
    } catch (error) {
      console.error('Transaction error:', error);
      showMessage('error', error.message || 'Failed to process transaction');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity <= 0) return { color: 'text-red-600', bg: 'bg-red-100', text: 'Out of Stock' };
    if (quantity <= 5) return { color: 'text-orange-600', bg: 'bg-orange-100', text: 'Low Stock' };
    return { color: 'text-green-600', bg: 'bg-green-100', text: 'In Stock' };
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white/90 backdrop-blur-md shadow-2xl border-r border-white/20 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Cashier Panel</h2>
              <p className="text-sm text-slate-500">Point of Sale</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('pos')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'pos'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-purple-600'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>POS System</span>
                {cart.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {getCartItemCount()}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'transactions'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-purple-600'
                }`}
              >
                <Receipt className="h-5 w-5" />
                <span>Transactions</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-purple-600'
                }`}
              >
                <TrendingUp className="h-5 w-5" />
                <span>Analytics</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">👤</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">Cashier</p>
              <p className="text-sm text-slate-500">cashier@store.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
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
                {activeTab === 'pos' && 'Point of Sale'}
                {activeTab === 'transactions' && 'Transaction History'}
                {activeTab === 'analytics' && 'Sales Analytics'}
              </h1>
              <p className="text-slate-600 mt-1">
                {activeTab === 'pos' && 'Process sales and manage transactions'}
                {activeTab === 'transactions' && 'View recent transaction history'}
                {activeTab === 'analytics' && 'Sales performance and insights'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <ShoppingCart className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Message Display */}
        {message.text && (
          <div className="px-6 mt-4">
            <div className={`p-4 rounded-lg flex items-center space-x-2 ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'pos' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Product Selection */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Search Bar */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Products Grid */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Products</h3>
                      {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredProducts.map((product, index) => {
                            const stockStatus = getStockStatus(product.quantity_in_stock);
                            return (
                              <div
                                key={index}
                                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                                  product.quantity_in_stock > 0
                                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                                    : 'bg-red-50 border-red-200 cursor-not-allowed'
                                }`}
                                onClick={() => product.quantity_in_stock > 0 && addToCart(product)}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium text-slate-800">{product.product_name}</h4>
                                  <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.color} ${stockStatus.bg}`}>
                                    {stockStatus.text}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 mb-2">{product.category || 'Uncategorized'}</p>
                                <div className="flex justify-between items-center">
                                  <p className="font-semibold text-slate-800">${parseFloat(product.price).toFixed(2)}</p>
                                  <p className="text-sm text-slate-600">Stock: {product.quantity_in_stock}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-slate-600 text-center py-8">No products found.</p>
                      )}
                    </div>
                  </div>

                  {/* Shopping Cart */}
                  <div className="space-y-6">
                    {/* Cart */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Shopping Cart</h3>
                      {cart.length > 0 ? (
                        <div className="space-y-3">
                          {cart.map((item) => {
                            const stockStatus = getStockStatus(item.quantity_in_stock - item.quantity);
                            return (
                              <div key={item.product_name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex-1">
                                  <p className="font-medium text-slate-800">{item.product_name}</p>
                                  <p className="text-sm text-slate-600">${parseFloat(item.price).toFixed(2)} each</p>
                                  <p className="text-xs text-slate-500">
                                    Stock after purchase: {item.quantity_in_stock - item.quantity}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => updateQuantity(item.product_name, item.quantity - 1)}
                                    className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.product_name, item.quantity + 1)}
                                    disabled={item.quantity >= item.quantity_in_stock}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                      item.quantity >= item.quantity_in_stock
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                                    }`}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => removeFromCart(item.product_name)}
                                    className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                          <div className="border-t pt-3">
                            <div className="flex justify-between items-center font-semibold text-lg">
                              <span>Total:</span>
                              <span>${getCartTotal().toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-600 text-center py-8">Cart is empty</p>
                      )}
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Customer Information</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Customer Name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="email"
                          placeholder="Email (Optional)"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment</h3>
                      <button
                        onClick={processTransaction}
                        disabled={cart.length === 0}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                          cart.length > 0
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <CreditCard className="inline h-5 w-5 mr-2" />
                        Process Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}

                             {activeTab === 'transactions' && (
                 <div className="space-y-6">
                   <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                     <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h3>
                     <div className="space-y-3">
                       {recentTransactions.length > 0 ? (
                         recentTransactions.map((transaction) => (
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
                           <p className="text-slate-600">No transactions yet</p>
                           <p className="text-sm text-slate-500 mt-2">Transactions will appear here once sales are processed</p>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Daily Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Sales</p>
                          <p className="text-2xl font-bold text-slate-800">${dailyStats.totalSales.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Transactions</p>
                          <p className="text-2xl font-bold text-slate-800">{dailyStats.totalTransactions}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Receipt className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Average Ticket</p>
                          <p className="text-2xl font-bold text-slate-800">${dailyStats.averageTicket.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Items Sold</p>
                          <p className="text-2xl font-bold text-slate-800">{dailyStats.itemsSold}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                                     <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                     <h3 className="text-lg font-semibold text-slate-800 mb-4">Sales Analytics</h3>
                     <div className="text-center py-8">
                       <p className="text-slate-600">No sales data available yet</p>
                       <p className="text-sm text-slate-500 mt-2">Sales analytics will appear here once transactions are processed</p>
                     </div>
                   </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CashierDashboard;
