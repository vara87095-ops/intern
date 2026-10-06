import mongoose from 'mongoose';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`[Database] Error connecting to configured MONGODB_URI: ${error.message}`);
      console.log(`[Database] Falling back to in-memory MongoDB for seamless local run...`);
    }
  }

  // Graceful fallback to mongodb-memory-server
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`[Database] In-Memory MongoDB Server running at: ${memUri}`);
    console.log(`[Database] Note: All data will be held in memory. Set MONGODB_URI in backend/.env to persist.`);
    return conn;
  } catch (err) {
    console.error(`[Database] Failed to initialize in-memory database: ${err.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
