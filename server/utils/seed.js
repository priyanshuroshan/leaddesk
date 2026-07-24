require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const {
  MONGO_URI,
  ADMIN_NAME = 'Admin',
  ADMIN_EMAIL = 'admin@leaddesk.com',
  ADMIN_PASSWORD = 'Admin@123456',
} = process.env;

const seed = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Remove existing admin with same email
    await Admin.deleteOne({ email: ADMIN_EMAIL.toLowerCase() });

    // Create fresh admin (password hashing handled by pre-save hook)
    const admin = await Admin.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      password: ADMIN_PASSWORD,
    });

    console.log('✅ Admin account seeded successfully!');
    console.log(`   Name:     ${admin.name}`);
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('\n🚀 You can now log in at /login');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
