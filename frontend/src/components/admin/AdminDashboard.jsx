import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiDollarSign, FiPackage, FiAlertTriangle, FiShoppingCart, FiUsers, FiEye, FiArrowRight } from 'react-icons/fi';
import salesService from '../../services/salesService';
import productService from '../../services/productService';
import Loader from '../common/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, lowStockResponse, salesResponse] = await Promise.all([
        salesService.getSalesStats(),
        productService.getLowStockProducts(),
        salesService.getAllSales()
      ]);
      
      setStats(statsResponse.stats);
      setLowStockProducts(lowStockResponse.products);
      setRecentSales(salesResponse.sales.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your inventory and sales</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FiDollarSign className="w-10 h-10 opacity-80" />
              <span className="text-sm opacity-80">Today</span>
            </div>
            <p className="text-3xl font-bold mb-1">${stats?.daily.revenue || '0.00'}</p>
            <p className="text-sm opacity-80">{stats?.daily.count || 0} sales</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FiTrendingUp className="w-10 h-10 opacity-80" />
              <span className="text-sm opacity-80">This Week</span>
            </div>
            <p className="text-3xl font-bold mb-1">${stats?.weekly.revenue || '0.00'}</p>
            <p className="text-sm opacity-80">{stats?.weekly.count || 0} sales</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FiShoppingCart className="w-10 h-10 opacity-80" />
              <span className="text-sm opacity-80">This Month</span>
            </div>
            <p className="text-3xl font-bold mb-1">${stats?.monthly.revenue || '0.00'}</p>
            <p className="text-sm opacity-80">{stats?.monthly.count || 0} sales</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FiPackage className="w-10 h-10 opacity-80" />
              <span className="text-sm opacity-80">All Time</span>
            </div>
            <p className="text-3xl font-bold mb-1">${stats?.allTime.revenue || '0.00'}</p>
            <p className="text-sm opacity-80">{stats?.allTime.count || 0} sales</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/products"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <FiPackage className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Products</h3>
            <p className="text-gray-600 text-sm">Add, edit, or remove products</p>
          </Link>

          <Link
            to="/admin/sales"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <FiDollarSign className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">View Sales</h3>
            <p className="text-gray-600 text-sm">Track all sales and revenue</p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <FiUsers className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Users</h3>
            <p className="text-gray-600 text-sm">Manage staff accounts</p>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Sales */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FiShoppingCart className="w-6 h-6 text-blue-600" />
                Recent Sales
              </h2>
              <Link
                to="/admin/sales"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View All
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentSales.length > 0 ? (
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div
                    key={sale._id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{sale.saleNumber}</p>
                      <p className="text-sm text-gray-500">
                        {sale.customer?.name || 'Guest'} • {sale.items.length} items
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(sale.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${sale.totalAmount.toFixed(2)}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        sale.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : sale.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sale.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No sales yet</p>
              </div>
            )}
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FiAlertTriangle className="w-6 h-6 text-red-600" />
                Low Stock Alerts
                {lowStockProducts.length > 0 && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                    {lowStockProducts.length}
                  </span>
                )}
              </h2>
              <Link
                to="/admin/products"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                Manage
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div
                    key={product._id}
                    className="flex justify-between items-center p-4 bg-red-50 rounded-lg border-l-4 border-red-500"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">
                        {product.stock}
                      </p>
                      <p className="text-xs text-gray-500">
                        Threshold: {product.lowStockThreshold}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiPackage className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">All products well stocked</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;