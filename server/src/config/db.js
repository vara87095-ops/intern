import mongoose from 'mongoose';

let isMongoConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    console.log('ℹ️  No MONGODB_URI provided in environment.');
    console.log('🚀 Using local JSON persistent database adapter (instant zero-configuration mode).');
    isMongoConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    isMongoConnected = true;
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB Connection failed (${error.message}).`);
    console.log('🔄 Falling back to local persistent database adapter.');
    isMongoConnected = false;
    return false;
  }
}

export function getDBStatus() {
  return {
    isMongoConnected,
    type: isMongoConnected ? 'MongoDB' : 'Local JSON Persistent Store',
    status: 'online'
  };
}
