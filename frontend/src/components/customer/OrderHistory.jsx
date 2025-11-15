import { useState, useEffect } from 'react';
import { FiPackage, FiCalendar, FiDollarSign } from 'react-icons/fi';
import salesService from '../../services/salesService';
import Loader from '../common/Loader';
import Alert from '../common/Alert';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await salesService.getMySales();
      setOrders(response.sales);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">View all your past orders</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiPackage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order Number</p>
                      <p className="text-lg font-bold text-gray-900">{order.saleNumber}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          Date
                        </p>
                        <p className="font-semibold">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <FiDollarSign className="w-4 h-4" />
                          Total
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Items:</p>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                          <FiPackage className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900">${item.subtotal.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Payment Info */}
                  <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      Payment: <span className="font-medium capitalize">{order.paymentMethod}</span>
                    </span>
                    {order.notes && (
                      <span className="text-gray-600">
                        Note: <span className="italic">{order.notes}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;