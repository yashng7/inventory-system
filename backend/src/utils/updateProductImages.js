require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const productImageMap = {
  // Electronics
  'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
  'mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
  'keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
  'headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  'wireless': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
  'phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
  'tablet': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500',
  'dell': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
  
  // Clothing
  'shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
  't-shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
  'jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
  'jacket': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
  'shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
  'hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
  'blue': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
  
  // Books
  'book': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
  'javascript': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
  'novel': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
  'guide': 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500',
  
  // Food
  'coffee': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500',
  'snacks': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500',
  'chocolate': 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500',
  
  // Toys
  'toy': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500',
  'lego': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500',
  'puzzle': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
};

const categoryDefaults = {
  'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
  'Clothing': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500',
  'Books': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
  'Food': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
  'Toys': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500',
  'Other': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
};

const getImageForProduct = (productName, category) => {
  const name = productName.toLowerCase();
  
  // Try to match by keywords
  for (const [keyword, url] of Object.entries(productImageMap)) {
    if (name.includes(keyword)) {
      return url;
    }
  }
  
  // Use category default
  return categoryDefaults[category] || categoryDefaults['Other'];
};

const updateProductImages = async () => {
  try {
    await connectDB();
    
    const products = await Product.find({});
    
    console.log(`Found ${products.length} products to update`);
    
    for (const product of products) {
      const imageUrl = getImageForProduct(product.name, product.category);
      product.imageUrl = imageUrl;
      await product.save();
      console.log(`✅ Updated: ${product.name} -> ${imageUrl}`);
    }
    
    console.log('━'.repeat(50));
    console.log('✅ All products updated with images!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating products:', error);
    process.exit(1);
  }
};

updateProductImages();