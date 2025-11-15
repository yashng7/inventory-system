require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// initialize express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database only if NOT in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// routes

// root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎉 Inventory Sales Management API is running!',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'
  });
});

// health check route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  res.json({
    success: true,
    server: 'Running',
    database: statusMap[dbStatus],
    timestamp: new Date().toISOString()
  });
});

// auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// product routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// cart routes
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

// sales routes
const salesRoutes = require('./routes/salesRoutes');
app.use('/api/sales', salesRoutes);

//user routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// test models route (temporary - for testing)
app.get('/api/test-models', async (req, res) => {
  try {
    const User = require('./models/User');
    const Product = require('./models/Product');
    const Sale = require('./models/Sale');
    const Cart = require('./models/Cart');

    res.json({
      success: true,
      message: 'All models loaded successfully! ✅',
      models: {
        User: 'Ready',
        Product: 'Ready',
        Sale: 'Ready',
        Cart: 'Ready'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Model loading failed',
      error: error.message
    });
  }
});

// error handlers

// handle 404 - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// global error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

//start server

const PORT = process.env.PORT || 5000;

let server;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log('━'.repeat(50));
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📡 API URL: http://localhost:${PORT}`);
    console.log('━'.repeat(50));
  });
}

module.exports = { app, server };