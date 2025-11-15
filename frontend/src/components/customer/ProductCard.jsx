import { FiShoppingCart, FiPackage } from 'react-icons/fi';
import { useState } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await onAddToCart(product._id, quantity);
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48 bg-gray-200 flex items-center justify-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=' + product.name;
          }}
        />
        {product.isLowStock && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Low Stock
          </span>
        )}
        <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          {product.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate" title={product.name}>
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <FiPackage className="w-4 h-4" />
            <span>{product.stock} in stock</span>
          </div>
        </div>

        {product.stock > 0 ? (
          <div className="flex gap-2">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100 transition"
                type="button"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                className="w-16 text-center border-none outline-none"
                min="1"
                max={product.stock}
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-gray-100 transition"
                type="button"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              type="button"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FiShoppingCart className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        ) : (
          <button disabled className="w-full bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed">
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;