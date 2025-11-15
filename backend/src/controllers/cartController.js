const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name price stock imageUrl category isActive'
      });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
      return res.status(200).json({
        success: true,
        cart: {
          items: [],
          total: '0.00'
        }
      });
    }

    const validItems = [];
    let hasChanges = false;

    for (const item of cart.items) {
      if (item.product && item.product.isActive) {
        validItems.push(item);
      } else {
        hasChanges = true;
      }
    }

    if (hasChanges) {
      cart.items = validItems;
      await cart.save();
    }

    let total = 0;
    const cartItems = validItems.map(item => {
      const subtotal = item.product.price * item.quantity;
      total += subtotal;
      return {
        product: {
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          stock: item.product.stock,
          imageUrl: item.product.imageUrl,
          category: item.product.category
        },
        quantity: item.quantity,
        subtotal
      };
    });

    res.status(200).json({
      success: true,
      cart: {
        items: cartItems,
        total: total.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid product ID and quantity'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not available'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.product && item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name price stock imageUrl category isActive'
    });

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid product ID and quantity'
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const product = await Product.findById(productId);
    if (product && product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product && item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name price stock imageUrl category isActive'
    });

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item.product && item.product.toString() !== req.params.productId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    } else {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};