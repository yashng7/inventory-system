const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const generateSaleNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SALE-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
};

const createSaleFromCart = async (req, res, next) => {
  try {
    const { paymentMethod, notes } = req.body;

    const cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name price stock isActive _id'
      });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const saleItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      if (!item.product) {
        continue;
      }

      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product.name} is no longer available`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available.`
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      saleItems.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal
      });

      product.stock -= item.quantity;
      await product.save();
    }

    if (saleItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid items in cart'
      });
    }

    const saleNumber = generateSaleNumber();

    const sale = await Sale.create({
      saleNumber,
      customer: req.user.id,
      items: saleItems,
      totalAmount,
      paymentMethod: paymentMethod || 'cash',
      status: 'completed',
      processedBy: req.user.id,
      notes: notes || ''
    });

    cart.items = [];
    await cart.save();

    const populatedSale = await Sale.findById(sale._id)
      .populate('customer', 'name email');

    console.log('Sale created successfully:', populatedSale);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      sale: {
        _id: populatedSale._id,
        saleNumber: populatedSale.saleNumber,
        customer: populatedSale.customer,
        items: populatedSale.items,
        totalAmount: populatedSale.totalAmount,
        paymentMethod: populatedSale.paymentMethod,
        status: populatedSale.status,
        notes: populatedSale.notes,
        createdAt: populatedSale.createdAt
      }
    });
  } catch (error) {
    console.error('Checkout error:', error);
    next(error);
  }
};

const createSale = async (req, res, next) => {
  try {
    const { items, customerId, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide sale items'
      });
    }

    const saleItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not active`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available.`
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      saleItems.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const saleNumber = generateSaleNumber();

    const sale = await Sale.create({
      saleNumber,
      customer: customerId || null,
      items: saleItems,
      totalAmount,
      paymentMethod: paymentMethod || 'cash',
      status: 'completed',
      processedBy: req.user.id,
      notes: notes || ''
    });

    await sale.populate('processedBy', 'name email');
    if (customerId) {
      await sale.populate('customer', 'name email');
    }

    res.status(201).json({
      success: true,
      message: 'Sale created successfully',
      sale
    });
  } catch (error) {
    console.error('Create sale error:', error);
    next(error);
  }
};

const getAllSales = async (req, res, next) => {
  try {
    const { startDate, endDate, status } = req.query;

    let query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    if (status) {
      query.status = status;
    }

    const sales = await Sale.find(query)
      .populate('customer', 'name email')
      .populate('processedBy', 'name email')
      .sort({ createdAt: -1 });

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    res.status(200).json({
      success: true,
      count: sales.length,
      totalRevenue: totalRevenue.toFixed(2),
      sales
    });
  } catch (error) {
    next(error);
  }
};

const getSale = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('processedBy', 'name email')
      .populate('items.product', 'name category');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    if (req.user.role === 'customer' && 
        sale.customer && 
        sale.customer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this sale'
      });
    }

    res.status(200).json({
      success: true,
      sale
    });
  } catch (error) {
    next(error);
  }
};

const getMySales = async (req, res, next) => {
  try {
    const sales = await Sale.find({ customer: req.user.id })
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sales.length,
      sales
    });
  } catch (error) {
    next(error);
  }
};

const getSalesStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const dailySales = await Sale.find({
      createdAt: { $gte: today },
      status: 'completed'
    });

    const weeklySales = await Sale.find({
      createdAt: { $gte: thisWeek },
      status: 'completed'
    });

    const monthlySales = await Sale.find({
      createdAt: { $gte: thisMonth },
      status: 'completed'
    });

    const allSales = await Sale.find({ status: 'completed' });

    const calculateTotal = (sales) => 
      sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    res.status(200).json({
      success: true,
      stats: {
        daily: {
          count: dailySales.length,
          revenue: calculateTotal(dailySales).toFixed(2)
        },
        weekly: {
          count: weeklySales.length,
          revenue: calculateTotal(weeklySales).toFixed(2)
        },
        monthly: {
          count: monthlySales.length,
          revenue: calculateTotal(monthlySales).toFixed(2)
        },
        allTime: {
          count: allSales.length,
          revenue: calculateTotal(allSales).toFixed(2)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSaleFromCart,
  createSale,
  getAllSales,
  getSale,
  getMySales,
  getSalesStats
};