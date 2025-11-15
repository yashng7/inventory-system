import { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import cartService from '../services/cartService';
import guestCartService from '../services/guestCartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], total: '0.00' });
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  const loadCart = async () => {
    if (isAuthenticated) {
      await fetchUserCart();
    } else {
      fetchGuestCart();
    }
  };

  const fetchUserCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      console.log('User cart fetched:', response);
      setCart(response.cart);
      updateCartCount(response.cart.items);
    } catch (error) {
      console.error('Error fetching user cart:', error);
      setCart({ items: [], total: '0.00' });
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuestCart = () => {
    try {
      setLoading(true);
      const guestCart = guestCartService.getCart();
      const total = guestCartService.getCartTotal();
      setCart({ items: guestCart.items, total });
      updateCartCount(guestCart.items);
    } catch (error) {
      console.error('Error fetching guest cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartCount = (items) => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  };

  const addToCart = async (productIdOrProduct, quantity) => {
    try {
      if (isAuthenticated) {
        const productId = typeof productIdOrProduct === 'string' 
          ? productIdOrProduct 
          : productIdOrProduct._id;
        
        console.log('Adding to user cart:', productId, quantity);
        await cartService.addToCart(productId, quantity);
        await fetchUserCart();
      } else {
        const product = typeof productIdOrProduct === 'object' ? productIdOrProduct : null;
        if (!product) {
          console.error('Product object required for guest cart');
          return;
        }
        console.log('Adding to guest cart:', product, quantity);
        const updatedCart = guestCartService.addItem(product, quantity);
        const total = guestCartService.getCartTotal();
        setCart({ items: updatedCart.items, total });
        updateCartCount(updatedCart.items);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      if (isAuthenticated) {
        await cartService.updateCartItem(productId, quantity);
        await fetchUserCart();
      } else {
        const updatedCart = guestCartService.updateItem(productId, quantity);
        const total = guestCartService.getCartTotal();
        setCart({ items: updatedCart.items, total });
        updateCartCount(updatedCart.items);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (isAuthenticated) {
        await cartService.removeFromCart(productId);
        await fetchUserCart();
      } else {
        const updatedCart = guestCartService.removeItem(productId);
        const total = guestCartService.getCartTotal();
        setCart({ items: updatedCart.items, total });
        updateCartCount(updatedCart.items);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartService.clearCart();
        await fetchUserCart();
      } else {
        guestCartService.clearCart();
        setCart({ items: [], total: '0.00' });
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const mergeGuestCart = async () => {
    const guestCart = guestCartService.getCart();
    
    if (guestCart.items.length > 0) {
      try {
        for (const item of guestCart.items) {
          await cartService.addToCart(item.product._id, item.quantity);
        }
        guestCartService.clearCart();
        await fetchUserCart();
      } catch (error) {
        console.error('Error merging cart:', error);
      }
    }
  };

  const value = {
    cart,
    cartCount,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: isAuthenticated ? fetchUserCart : fetchGuestCart,
    mergeGuestCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};