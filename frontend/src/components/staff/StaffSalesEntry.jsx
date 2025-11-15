import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiShoppingCart, FiSearch } from 'react-icons/fi';
import productService from '../../services/productService';
import salesService from '../../services/salesService';
import Alert from '../common/Alert';
import Loader from '../common/Loader';

const StaffSalesEntry = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.products.filter(p => p.stock > 0));
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = (product) => {
    const existing = selectedProducts.find(p => p.productId === product._id);
    if (existing) {
      updateQuantity(product._id, existing.quantity + 1);
    } else {
      setSelectedProducts([...selectedProducts, {
        productId: product._id,
        name: product.name,
        price: product.price,
        maxStock: product.stock,
        quantity: 1
      }]);
    }
    setSearchTerm('');
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = selectedProducts.find(p => p.productId === productId);
    if (newQuantity > product.maxStock) {
      setError(`Only ${product.maxStock} items available`);
      setTimeout(() => setError(''), 3000);
      return;
    }
    setSelectedProducts(selectedProducts.map(p =>
      p.productId === productId ? { ...p, quantity: Math.max(1, newQuantity) } : p
    ));
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.productId !== productId));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      setError('Please add at least one product');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const items = selectedProducts.map(p => ({
        productId: p.productId,
        quantity: p.quantity
      }));

      await salesService.createSale({
        items,
        paymentMethod,
        notes
      });

      setSuccess('Sale processed successfully!');
      setTimeout(() => {
        navigate('/staff/sales-history');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process sale');
      setProcessing(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedProducts.find(sp => sp.productId === p._id)
  );

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Process Sale</h1>
          <p className="text-gray-600">Add products and complete the transaction</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Add Products</h2>
              
              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {searchTerm && filteredProducts.length > 0 && (
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg mb-4">
                  {filteredProducts.slice(0, 5).map(product => (
                    <button
                      key={product._id}
                      onClick={() => addProduct(product)}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.stock} in stock</p>
                      </div>
                      <p className="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Selected Products</h2>
              
              {selectedProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No products added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProducts.map(product => (
                    <div key={product.productId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">${product.price.toFixed(2)} each</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(product.productId, product.quantity - 1)}
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => updateQuantity(product.productId, parseInt(e.target.value) || 1)}
                          className="w-16 text-center border border-gray-300 rounded py-1"
                          min="1"
                          max={product.maxStock}
                        />
                        <button
                          onClick={() => updateQuantity(product.productId, product.quantity + 1)}
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-bold text-gray-900 w-24 text-right">
                        ${(product.price * product.quantity).toFixed(2)}
                      </p>

                      <button
                        onClick={() => removeProduct(product.productId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Sale Summary</h2>

              <div className="mb-6 pb-6 border-b">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">${calculateTotal()}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="online">Online</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  rows="3"
                  placeholder="Add any notes..."
                />
              </div>

              <button
                type="submit"
                disabled={processing || selectedProducts.length === 0}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : `Complete Sale - $${calculateTotal()}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffSalesEntry;