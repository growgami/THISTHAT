import mongoose from 'mongoose';

// Define the cache type
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global type to include mongoose cache
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Cache the mongoose connection
const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Ensure the environment variable is defined
    const mongoUri = process.env.TWEETS_MONGODB_URI;
    if (!mongoUri) {
      throw new Error('TWEETS_MONGODB_URI environment variable is not defined');
    }

    cached.promise = mongoose.connect(mongoUri, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
} 