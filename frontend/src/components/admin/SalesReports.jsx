import { useState, useEffect } from 'react';
import { FiDownload, FiCalendar, FiDollarSign, FiShoppingCart, FiTrendingUp, FiEye } from 'react-icons/fi';
import salesService from '../../services/salesService';
import Alert from '../common/Alert';
import Loader from '../common/Loader';

const SalesReports = () => {
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (statusFilter) params.status = statusFilter;

      const [salesResponse, statsResponse] = await Promise.all([
        salesService.getAllSales(params),
        salesService.getSalesStats()
      ]);

      setSales(salesResponse.sales);
      setStats(statsResponse.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = ['Sale Number', 'Date', 'Customer', 'Items', 'Total', 'Payment', 'Status'];
      const rows = sales.map(sale => [
        sale.saleNumber,
        new Date(sale.createdAt).toLocaleDateString(),
        sale.customer?.name || 'Guest',
        sale.items.length,
        `$${sale.totalAmount.toFixed(2)}`,
        sale.paymentMethod,
        sale.status
      ]);

      let csvContent = headers.join(',') + '\n';
      rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
      });

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccess('Sales report exported successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to export CSV');
    }
  };

  const handleViewDetails = async (saleId) => {
    try {
      const response = await salesService.getSale(saleId);
      setSelectedSale(response.sale);
      setShowModal(true);
    } catch (err) {
      setError('Failed to load sale details');
    }
  };

  const applyQuickFilter = (filter) => {
    const today = new Date();
    let start = '';
    let end = new Date().toISOString().split('T')[0];

    switch (filter) {
      case 'today':
        start = end;
        break;
      case 'week':
        const weekAgo = new Date(today.setDate(today.getDate() - 7));
        start = weekAgo.toISOString().split('T')[0];
        break;
      case 'month':
        const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
        start = monthAgo.toISOString().split('T')[0];
        break;
      case 'all':
        start = '';
        end = '';
        break;
    }

    setStartDate(start);
    setEndDate(end);
    setDateFilter(filter);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Reports</h1>
            <p className="text-gray-600">Track and analyze sales performance</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="btn-primary flex items-center gap-2"
            disabled={sales.length === 0}
          >
            <FiDownload className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <FiDollarSign className="w-10 h-10 opacity-80" />
                <span className="text-sm opacity-80">Today</span>
              </div>
              <p className="text-3xl font-bold mb-1">${stats.daily.revenue}</p>
              <p className="text-sm opacity-80">{stats.daily.count} sales</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <FiTrendingUp className="w-10 h-10 opacity-80" />
                <span className="text-sm opacity-80">This Week</span>
              </div>
              <p className="text-3xl font-bold mb-1">${stats.weekly.revenue}</p>
              <p className="text-sm opacity-80">{stats.weekly.count} sales</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <FiShoppingCart className="w-10 h-10 opacity-80" />
                <span className="text-sm opacity-80">This Month</span>
              </div>
              <p className="text-3xl font-bold mb-1">${stats.monthly.revenue}</p>
              <p className="text-sm opacity-80">{stats.monthly.count} sales</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <FiDollarSign className="w-10 h-10 opacity-80" />
                <span className="text-sm opacity-80">All Time</span>
              </div>
              <p className="text-3xl font-bold mb-1">${stats.allTime.revenue}</p>
              <p className="text-sm opacity-80">{stats.allTime.count} sales</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => applyQuickFilter('today')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  dateFilter === 'today'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => applyQuickFilter('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  dateFilter === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => applyQuickFilter('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  dateFilter === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => applyQuickFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  dateFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Time
              </button>
            </div>

            <div className="flex gap-2 flex-1">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setDateFilter('');
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Start Date"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setDateFilter('');
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="End Date"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mb-4 text-gray-600">
          Found {sales.length} sale{sales.length !== 1 ? 's' : ''}
          {(startDate || endDate) && ' in selected date range'}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sale Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{sale.saleNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(sale.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {sale.customer?.name || 'Guest'}
                      </div>
                      {sale.customer?.email && (
                        <div className="text-xs text-gray-500">{sale.customer.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sale.items.length} items</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${sale.totalAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 capitalize">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          sale.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : sale.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(sale._id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sales.length === 0 && (
            <div className="text-center py-12">
              <FiShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No sales found</h3>
              <p className="text-gray-500">
                {startDate || endDate || statusFilter
                  ? 'Try adjusting your filters'
                  : 'No sales have been made yet'}
              </p>
            </div>
          )}
        </div>

        {showModal && selectedSale && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Sale Details</h2>
                  <p className="text-gray-600">{selectedSale.saleNumber}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                  <p className="font-semibold">
                    {new Date(selectedSale.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Customer</p>
                  <p className="font-semibold">{selectedSale.customer?.name || 'Guest'}</p>
                  {selectedSale.customer?.email && (
                    <p className="text-sm text-gray-600">{selectedSale.customer.email}</p>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="font-semibold capitalize">{selectedSale.paymentMethod}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 text-sm rounded-full ${
                      selectedSale.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : selectedSale.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedSale.status}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Items</h3>
                <div className="space-y-3">
                  {selectedSale.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ${selectedSale.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {selectedSale.notes && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Notes:</p>
                  <p className="text-gray-600">{selectedSale.notes}</p>
                </div>
              )}

              <div className="mt-6">
                <button onClick={() => setShowModal(false)} className="w-full btn-primary">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesReports;