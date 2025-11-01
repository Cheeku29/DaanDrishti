import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fund-trust';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

export const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@fundtrust.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Default admin user created: admin@fundtrust.com / admin123');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

