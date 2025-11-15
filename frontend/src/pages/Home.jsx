import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTrendingUp, FiShield, FiZap, FiArrowRight, FiStar, FiTag } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import productService from '../services/productService';
import ProductCard from '../components/customer/ProductCard';
import Alert from '../components/common/Alert';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.products);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.products.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productIdOrProduct, quantity) => {
    try {
      const product = typeof productIdOrProduct === 'string' 
        ? products.find(p => p._id === productIdOrProduct)
        : productIdOrProduct;
      
      if (!product) {
        setError('Product not found');
        return;
      }

      await addToCart(product, quantity);
      setSuccess('Product added to cart!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add to cart');
      setTimeout(() => setError(''), 3000);
    }
  };

  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Shop Smart,
                <br />
                Live Better
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Discover amazing products at unbeatable prices. Quality guaranteed, satisfaction delivered.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/products"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition flex items-center gap-2 shadow-lg"
                >
                  <FiShoppingBag className="w-5 h-5" />
                  Shop Now
                </Link>
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="bg-blue-500 bg-opacity-20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold hover:bg-opacity-30 transition border-2 border-white border-opacity-20"
                  >
                    Sign Up Free
                  </Link>
                )}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <p className="text-3xl font-bold">{products.length}+</p>
                  <p className="text-blue-200 text-sm">Products</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-blue-200 text-sm">Authentic</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">24/7</p>
                  <p className="text-blue-200 text-sm">Support</p>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
                <div className="grid grid-cols-2 gap-4">
                  {featuredProducts.map((product, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 transform hover:scale-105 transition">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-24 object-cover rounded mb-2"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=Product';
                        }}
                      />
                      <p className="text-gray-900 text-sm font-semibold truncate">{product.name}</p>
                      <p className="text-blue-600 font-bold">${product.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600">Browse our wide selection of products</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const categoryIcons = {
              'Electronics': '💻',
              'Clothing': '👕',
              'Food': '🍕',
              'Books': '📚',
              'Toys': '🧸',
              'Other': '🎁'
            };

            return (
              <Link
                key={index}
                to={`/products?category=${category}`}
                className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="text-4xl mb-3">{categoryIcons[category] || '🏷️'}</div>
                <p className="font-semibold text-gray-900">{category}</p>
                <p className="text-sm text-gray-500">
                  {products.filter(p => p.category === category).length} items
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked items just for you</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All
              <FiArrowRight />
            </Link>
          </div>

          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={(productId, quantity) => handleAddToCart(product, quantity)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FiShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-gray-600 text-sm">On orders over $50</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FiShield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Payment</h3>
            <p className="text-gray-600 text-sm">100% secure transactions</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <FiTrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Best Prices</h3>
            <p className="text-gray-600 text-sm">Guaranteed low prices</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <FiZap className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">Quick & reliable shipping</p>
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FiStar className="w-6 h-6 text-yellow-500" />
                <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
              </div>
              <p className="text-gray-600">Fresh products added this week</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              See More
              <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.slice(4, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={(productId, quantity) => handleAddToCart(product, quantity)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FiTag className="w-16 h-16 mx-auto mb-6 text-white opacity-90" />
            <h2 className="text-4xl font-bold mb-4">Get Exclusive Deals & Offers</h2>
            <p className="text-xl mb-8 text-blue-100">
              Sign up now and get 10% off on your first purchase!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg"
              >
                Create Free Account
              </Link>
              <Link
                to="/products"
                className="bg-blue-500 bg-opacity-20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold hover:bg-opacity-30 transition border-2 border-white border-opacity-20"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Guest Shopping Notice */}
      {!isAuthenticated && (
        <div className="bg-yellow-50 border-t border-b border-yellow-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 text-yellow-800">
              <FiShoppingBag className="w-5 h-5" />
              <p className="font-medium">
                Shopping as guest? You can add items to cart, but you'll need to{' '}
                <Link to="/login" className="underline font-bold hover:text-yellow-900">
                  login
                </Link>
                {' '}to checkout!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-8">Subscribe to our newsletter for exclusive deals and updates</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiShoppingBag className="w-6 h-6" />
                BizShop
              </h3>
              <p className="text-gray-400 text-sm">
                Your one-stop shop for quality products at amazing prices.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/products" className="hover:text-white">All Products</Link></li>
                <li><Link to="/cart" className="hover:text-white">Shopping Cart</Link></li>
                <li><Link to="/orders" className="hover:text-white">My Orders</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {categories.slice(0, 4).map((cat, i) => (
                  <li key={i}>
                    <Link to={`/products?category=${cat}`} className="hover:text-white">
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 BizShop. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;