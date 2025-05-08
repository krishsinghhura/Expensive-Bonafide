const mongoose = require('mongoose');
require('dotenv').config(); // For using MONGO_URI from .env

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectToMongoDB;
