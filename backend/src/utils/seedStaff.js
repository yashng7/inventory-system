require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const createStaff = async () => {
  try {
    await connectDB();

    // Check if staff already exists
    const staffExists = await User.findOne({ email: 'staff@inventory.com' });

    if (staffExists) {
      console.log('❌ Staff user already exists!');
      console.log('Email: staff@inventory.com');
      process.exit(0);
    }

    // Create staff user
    const staff = await User.create({
      name: 'Staff User',
      email: 'staff@inventory.com',
      password: 'staff123',
      role: 'staff',
      isActive: true
    });

    console.log('✅ Staff user created successfully!');
    console.log('━'.repeat(50));
    console.log('📧 Email: staff@inventory.com');
    console.log('🔑 Password: staff123');
    console.log('👤 Role: staff');
    console.log('━'.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('Error creating staff:', error.message);
    process.exit(1);
  }
};

createStaff();