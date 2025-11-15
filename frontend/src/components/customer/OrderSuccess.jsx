import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiHome, FiDownload, FiCalendar, FiCreditCard, FiUser } from 'react-icons/fi';
import { useEffect } from 'react';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sale = location.state?.sale;

  useEffect(() => {
    if (!sale) {
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    }
  }, [sale, navigate]);

  if (!sale) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const handleDownloadReceipt = () => {
    const receiptContent = `
INVOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order Number: ${sale.saleNumber}
Date: ${new Date(sale.createdAt).toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ITEMS:
${sale.items.map(item => `
${item.productName}
Qty: ${item.quantity} × $${item.price.toFixed(2)} = $${item.subtotal.toFixed(2)}
`).join('')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: $${sale.totalAmount.toFixed(2)}
Payment Method: ${sale.paymentMethod.toUpperCase()}
Status: ${sale.status.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for your order!
`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${sale.saleNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center border-t-4 border-green-500">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <FiCheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Order Number</p>
                <p className="text-lg font-semibold text-gray-900">{sale.saleNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">${sale.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <FiCalendar className="w-4 h-4" />
                <span>Date</span>
              </div>
              <p className="text-gray-900 font-medium">
                {new Date(sale.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(sale.createdAt).toLocaleTimeString()}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <FiCreditCard className="w-4 h-4" />
                <span>Payment</span>
              </div>
              <p className="text-gray-900 font-medium capitalize">
                {sale.paymentMethod}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <FiPackage className="w-4 h-4" />
                <span>Status</span>
              </div>
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium capitalize">
                {sale.status}
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-semibold text-gray-900 mb-3">Order Items</h2>
            <div className="space-y-3">
              {sale.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start py-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${item.subtotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                ${sale.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {sale.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded border-l-4 border-gray-300">
              <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
              <p className="text-sm text-gray-600">{sale.notes}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={handleDownloadReceipt}
            className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            <FiDownload className="w-4 h-4" />
            Download Receipt
          </button>
          
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <FiPackage className="w-4 h-4" />
            My Orders
          </Link>
          
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-900 transition font-medium"
          >
            <FiHome className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            A confirmation has been sent to your email
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;