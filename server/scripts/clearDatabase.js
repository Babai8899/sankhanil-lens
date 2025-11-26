import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function clearDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear all collections
    await mongoose.connection.db.collection('images').deleteMany({});
    await mongoose.connection.db.collection('images.files').deleteMany({});
    await mongoose.connection.db.collection('images.chunks').deleteMany({});

    console.log('✅ Database cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();
