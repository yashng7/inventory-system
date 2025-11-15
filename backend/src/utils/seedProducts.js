require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const connectDB = require('../config/db');

const sampleProducts = [
  {
    name: 'MacBook Pro 16"',
    description: 'Apple M2 Pro chip, 16GB RAM, 512GB SSD',
    category: 'Electronics',
    price: 2499.99,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
  },
  {
    name: 'Wireless Mouse Logitech MX',
    description: 'Ergonomic wireless mouse with precision tracking',
    category: 'Electronics',
    price: 99.99,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'Cherry MX switches, RGB backlight',
    category: 'Electronics',
    price: 149.99,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation',
    category: 'Electronics',
    price: 399.99,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
  },
  {
    name: 'iPhone 15 Pro',
    description: 'A17 Pro chip, titanium design, 256GB',
    category: 'Electronics',
    price: 1199.99,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
  },
  {
    name: 'Blue Cotton T-Shirt',
    description: 'Premium cotton, comfortable fit',
    category: 'Clothing',
    price: 29.99,
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'
  },
  {
    name: 'Slim Fit Jeans',
    description: 'Classic blue denim jeans',
    category: 'Clothing',
    price: 79.99,
    stock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'
  },
  {
    name: 'Leather Jacket',
    description: 'Genuine leather, classic style',
    category: 'Clothing',
    price: 299.99,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'
  },
  {
    name: 'Running Shoes Nike',
    description: 'Comfortable running shoes with air cushioning',
    category: 'Clothing',
    price: 129.99,
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'
  },
  {
    name: 'JavaScript: The Definitive Guide',
    description: 'Master the world\'s most-used programming language',
    category: 'Books',
    price: 59.99,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'
  },
  {
    name: 'React Cookbook',
    description: 'Recipes for mastering React',
    category: 'Books',
    price: 49.99,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'
  },
  {
    name: 'Artisan Coffee Beans',
    description: 'Premium roasted coffee beans, 1kg',
    category: 'Food',
    price: 24.99,
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500'
  },
  {
    name: 'Dark Chocolate Bar',
    description: '70% cocoa, organic',
    category: 'Food',
    price: 4.99,
    stock: 150,
    imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500'
  },
  {
    name: 'LEGO Star Wars Set',
    description: 'Millennium Falcon building set, 1000+ pieces',
    category: 'Toys',
    price: 159.99,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500'
  },
  {
    name: 'Puzzle 1000 Pieces',
    description: 'Beautiful landscape puzzle',
    category: 'Toys',
    price: 19.99,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500'
  },
  {
    name: 'Smart Watch Series 8',
    description: 'Fitness tracking, heart rate monitor',
    category: 'Electronics',
    price: 449.99,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
  },
  {
    name: 'Bluetooth Speaker JBL',
    description: 'Portable waterproof speaker',
    category: 'Electronics',
    price: 129.99,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'
  },
  {
    name: 'Canvas Backpack',
    description: 'Durable canvas backpack for everyday use',
    category: 'Other',
    price: 49.99,
    stock: 55,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
  },
  {
    name: 'Sunglasses Ray-Ban',
    description: 'Classic aviator style, UV protection',
    category: 'Other',
    price: 189.99,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated, keeps drinks cold for 24 hours',
    category: 'Other',
    price: 34.99,
    stock: 70,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'
  }
];

const seedProducts = async () => {
  try {
    await connectDB();

    // Get admin user
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found. Please run: npm run seed:admin');
      process.exit(1);
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Add createdBy to all products
    const productsWithAdmin = sampleProducts.map(product => ({
      ...product,
      createdBy: admin._id
    }));

    // Insert sample products
    await Product.insertMany(productsWithAdmin);

    console.log('✅ Sample products created successfully!');
    console.log('━'.repeat(50));
    console.log(`📦 Created ${sampleProducts.length} products`);
    console.log('━'.repeat(50));
    
    // Display products by category
    const categories = [...new Set(sampleProducts.map(p => p.category))];
    categories.forEach(category => {
      const count = sampleProducts.filter(p => p.category === category).length;
      console.log(`   ${category}: ${count} products`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();