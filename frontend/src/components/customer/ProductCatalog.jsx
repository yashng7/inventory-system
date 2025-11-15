import { useState, useEffect, useRef } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import ProductCard from "./ProductCard";
import productService from "../../services/productService";
import { useCart } from "../../hooks/useCart";
import Alert from "../common/Alert";
import Loader from "../common/Loader";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Input value
  const [searchTerm, setSearchTerm] = useState(""); // Actual search term for API
  const [selectedCategory, setSelectedCategory] = useState("");

  const { addToCart } = useCart();
  const searchTimeoutRef = useRef(null);

  const categories = [
    "All",
    "Electronics",
    "Clothing",
    "Food",
    "Books",
    "Toys",
    "Other",
  ];

  // Fetch products when searchTerm or category changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  // Debounce search input
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500); // Wait 500ms after user stops typing

    // Cleanup
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};

      if (selectedCategory && selectedCategory !== "All") {
        params.category = selectedCategory;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await productService.getAllProducts(params);
      setProducts(response.products);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productIdOrProduct, quantity) => {
    try {
      // Find the product from the products array
      const product =
        typeof productIdOrProduct === "string"
          ? products.find((p) => p._id === productIdOrProduct)
          : productIdOrProduct;

      if (!product) {
        setError("Product not found");
        return;
      }

      await addToCart(product, quantity);
      setSuccess("Product added to cart!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add to cart");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Catalog
          </h1>
          <p className="text-gray-600">Browse our collection of products</p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess("")}
          />
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {searchInput && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              {searchInput && searchInput !== searchTerm && (
                <p className="text-xs text-gray-500 mt-1">Searching...</p>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category === "All" ? "" : category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedCategory) && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Search: "{searchTerm}"
                <button
                  onClick={handleClearSearch}
                  className="hover:text-blue-900"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("")}
                  className="hover:text-green-900"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}

        {/* Products Count */}
        <div className="mb-4 text-gray-600">
          {loading ? (
            <span>Loading products...</span>
          ) : (
            <span>
              Found {products.length} product{products.length !== 1 ? "s" : ""}
              {searchTerm && ` for "${searchTerm}"`}
            </span>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FiSearch className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory
                ? "Try adjusting your search or filter criteria"
                : "No products available at the moment"}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="btn-primary"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={(productId, quantity) =>
                  handleAddToCart(product, quantity)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;
