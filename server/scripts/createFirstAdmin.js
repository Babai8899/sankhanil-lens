import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const createFirstAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sankhanil-lens');
    console.log('✅ Connected to MongoDB');

    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    
    if (adminCount > 0) {
      console.log('❌ Admin already exists. Cannot create another admin through this script.');
      console.log('   Use the change password functionality or contact existing admin.');
      process.exit(0);
    }

    // Get credentials from command line arguments or use defaults
    const username = process.argv[2] || 'admin';
    const email = process.argv[3] || 'admin@sankhanil.com';
    const password = process.argv[4] || 'admin123';

    // Create first admin
    const admin = new Admin({
      username,
      email,
      password,
      role: 'superadmin'
    });

    await admin.save();

    console.log('✅ First admin created successfully!');
    console.log('');
    console.log('📋 Admin Details:');
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: superadmin`);
    console.log('');
    console.log('🔐 IMPORTANT: Change the password after first login!');
    console.log('   Visit: http://localhost:5173/admin/login');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createFirstAdmin();
