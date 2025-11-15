require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@inventory.com' });

    if (adminExists) {
      console.log('❌ Admin user already exists!');
      console.log('Email: admin@inventory.com');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@inventory.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('━'.repeat(50));
    console.log('📧 Email: admin@inventory.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('━'.repeat(50));
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();