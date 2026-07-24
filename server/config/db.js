const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas or local MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Do not use process.exit in serverless environments, just let it fail gracefully
  }
};

module.exports = connectDB;
