// Guest cart stored in localStorage
const GUEST_CART_KEY = 'guestCart';

const guestCartService = {
  // Get guest cart
  getCart: () => {
    const cart = localStorage.getItem(GUEST_CART_KEY);
    return cart ? JSON.parse(cart) : { items: [] };
  },

  // Save cart to localStorage
  saveCart: (cart) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  },

  // Add item to guest cart
  addItem: (product, quantity) => {
    const cart = guestCartService.getCart();
    
    // Check if product already exists
    const existingIndex = cart.items.findIndex(
      item => item.product._id === product._id
    );

    if (existingIndex > -1) {
      // Update quantity
      cart.items[existingIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: product,
        quantity: quantity
      });
    }

    guestCartService.saveCart(cart);
    return cart;
  },

  // Update item quantity
  updateItem: (productId, quantity) => {
    const cart = guestCartService.getCart();
    const itemIndex = cart.items.findIndex(
      item => item.product._id === productId
    );

    if (itemIndex > -1) {
      if (quantity === 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    guestCartService.saveCart(cart);
    return cart;
  },

  // Remove item
  removeItem: (productId) => {
    const cart = guestCartService.getCart();
    cart.items = cart.items.filter(item => item.product._id !== productId);
    guestCartService.saveCart(cart);
    return cart;
  },

  // Clear cart
  clearCart: () => {
    localStorage.removeItem(GUEST_CART_KEY);
    return { items: [] };
  },

  // Get cart count
  getCartCount: () => {
    const cart = guestCartService.getCart();
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Calculate total
  getCartTotal: () => {
    const cart = guestCartService.getCart();
    return cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0).toFixed(2);
  }
};

export default guestCartService;