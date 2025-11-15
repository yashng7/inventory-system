import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import {
  FiShoppingBag,
  FiLogOut,
  FiUser,
  FiPackage,
  FiBarChart2,
  FiHome,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isStaff } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <FiShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BizShop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Admin Links */}
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/products"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
                    >
                      Products
                    </Link>
                    <Link
                      to="/admin/users"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
                    >
                      Users
                    </Link>
                  </>
                )}

                {/* Staff Links */}
                {isStaff && (
                  <>
                    <Link
                      to="/staff/dashboard"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/staff/sales-entry"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
                    >
                      New Sale
                    </Link>
                  </>
                )}

                {/* Customer Links */}
                {!isAdmin && !isStaff && (
                  <>
                    <Link
                      to="/products"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
                    >
                      Shop
                    </Link>
                    <Link
                      to="/orders"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                  </>
                )}

                {/* Cart Icon */}
                <Link
                  to="/cart"
                  className="relative p-2 text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200 hover:bg-gray-100 rounded-md font-medium"
                >
                  {/* <FiShoppingBag className="w-5 h-5" /> */}
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition-colors duration-200 hover:bg-gray-100">
                    <FiUser className="w-5 h-5" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {user?.role}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/products"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
                >
                  Shop
                </Link>

                <Link
                  to="/cart"
                  className="text-sm font-medium relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 hover:bg-gray-100 rounded-md"
                >
                  {/* <FiShoppingBag className="w-5 h-5" /> */}
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md transition-colors duration-200"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/products"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Products
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Users
                    </Link>
                  </>
                )}

                {isStaff && (
                  <>
                    <Link
                      to="/staff/dashboard"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/staff/sales-entry"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      New Sale
                    </Link>
                  </>
                )}

                {!isAdmin && !isStaff && (
                  <>
                    <Link
                      to="/products"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Shop
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Orders
                    </Link>
                  </>
                )}

                <Link
                  to="/cart"
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiShoppingBag className="w-5 h-5" />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>

                <div className="border-t border-gray-200 mt-2 pt-2">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 flex items-center gap-2 rounded-md transition-colors duration-200"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/products"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiShoppingBag className="w-5 h-5" />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>

                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
