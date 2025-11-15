import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import Alert from '../common/Alert';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, updateCartItem, removeFromCart, clearCart } = useCart();
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const updateQuantity = async (productId, quantity) => {
    try {
      setUpdating(true);
      await updateCartItem(productId, quantity);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update cart');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdating(true);
      await removeFromCart(productId);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        setUpdating(true);
        await clearCart();
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to clear cart');
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  const cartItems = cart?.items || [];
  const cartTotal = cart?.total || '0.00';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">{cartItems.length} item(s) in your cart</p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <FiArrowLeft />
            Continue Shopping
          </Link>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {!isAuthenticated && cartItems.length > 0 && (
          <Alert 
            type="info" 
            message="You're browsing as a guest. Sign in to checkout and save your cart!" 
          />
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add some products to get started!</p>
            <Link to="/products" className="btn-primary inline-block">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.product._id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=' + item.product.name;
                      }}
                    />

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        ${item.product.price.toFixed(2)} each
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.product.stock} available
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.product._id)}
                        disabled={updating}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          disabled={updating || item.quantity <= 1}
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          disabled={updating || item.quantity >= item.product.stock}
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-lg font-bold text-blue-600">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleClearCart}
                disabled={updating}
                className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
              >
                Clear Cart
              </button>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (0%)</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">${cartTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary py-3 mb-3"
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>

                <Link
                  to="/products"
                  className="block text-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;