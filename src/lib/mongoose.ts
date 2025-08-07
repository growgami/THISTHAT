import mongoose from 'mongoose';

// Define the cache type for separate connections
interface MongooseConnectionCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Extend the global type to include mongoose cache
declare global {
  var tweetsMongooseCache: MongooseConnectionCache | undefined;
  var rankingMongooseCache: MongooseConnectionCache | undefined;
}

// Cache the tweets mongoose connection
const tweetsCache: MongooseConnectionCache = global.tweetsMongooseCache || { conn: null, promise: null };

if (!global.tweetsMongooseCache) {
  global.tweetsMongooseCache = tweetsCache;
}

export async function connectToDatabase() {
  if (tweetsCache.conn) {
    return tweetsCache.conn;
  }

  if (!tweetsCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Ensure the environment variable is defined
    const mongoUri = process.env.TWEETS_MONGODB_URI;
    if (!mongoUri) {
      throw new Error('TWEETS_MONGODB_URI environment variable is not defined');
    }

    // Create a separate connection instance for tweets
    tweetsCache.promise = mongoose.createConnection(mongoUri, opts).asPromise();
  }

  try {
    tweetsCache.conn = await tweetsCache.promise;
  } catch (e) {
    tweetsCache.promise = null;
    throw e;
  }

  return tweetsCache.conn;
}

// Cache the ranking mongoose connection
const rankingCache: MongooseConnectionCache = global.rankingMongooseCache || { conn: null, promise: null };

if (!global.rankingMongooseCache) {
  global.rankingMongooseCache = rankingCache;
}

export async function connectToRankingDatabase() {
  if (rankingCache.conn) {
    return rankingCache.conn;
  }

  if (!rankingCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Ensure the environment variable is defined
    const mongoUri = process.env.RANKING_MONGODB_URI;
    if (!mongoUri) {
      throw new Error('RANKING_MONGODB_URI environment variable is not defined');
    }

    // Create a separate connection instance for ranking
    rankingCache.promise = mongoose.createConnection(mongoUri, opts).asPromise();
  }

  try {
    rankingCache.conn = await rankingCache.promise;
  } catch (e) {
    rankingCache.promise = null;
    throw e;
  }

  return rankingCache.conn;
}