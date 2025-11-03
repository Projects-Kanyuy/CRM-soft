const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const importData = async () => {
  try {
    // Clear existing users to prevent duplicates (optional, but good for a clean seed)
    await User.deleteMany();

    // Hash the admin password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('adminpassword', salt); // Use a strong password

    // Create the admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: passwordHash,
      role: 'Admin', // Assign the Admin role
    });

    await adminUser.save();

    console.log('✅ Data Imported! Admin user created.'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // You can choose to destroy specific models' data here
    await User.deleteMany();
    // await Contact.deleteMany(); // Example
    // await Deal.deleteMany(); // Example
    
    console.log('🔥 Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Check for command-line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}