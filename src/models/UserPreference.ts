 import { MongoClient, Collection, Document } from 'mongodb';

// Environment variables for MongoDB connection
const MONGODB_URI = process.env.USERPREF_MONGODB_URI || '';
const MONGODB_COLLECTION = process.env.USERPREF_MONGODB_COLLECTION || 'user_preferences';

// MongoDB document interface for user preferences
export interface UserPreferenceDocument extends Document {
  _id?: string;
  user_id: string;
  username: string;
  categoryPreferences: Record<string, number>; // Category name to preference weight
  tagPreferences: Record<string, number>; // Tag name to preference weight
  pointsAwarded: number;
  lastAwardAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// MongoDB connection and collection
let client: MongoClient | null = null;
let userPreferencesCollection: Collection<UserPreferenceDocument> | null = null;

/**
 * Initialize MongoDB connection for user preferences
 */
export async function connectToUserPreferencesDatabase(): Promise<void> {
  if (!MONGODB_URI) {
    throw new Error('USERPREF_MONGODB_URI environment variable is not set');
  }

  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }

  const db = client.db();
  userPreferencesCollection = db.collection<UserPreferenceDocument>(MONGODB_COLLECTION);
}

/**
 * Get the user preferences collection
 */
export function getUserPreferencesCollection(): Collection<UserPreferenceDocument> {
  if (!userPreferencesCollection) {
    throw new Error('User preferences database not connected');
  }
  return userPreferencesCollection;
}

/**
 * Close MongoDB connection for user preferences
 */
export async function closeUserPreferencesDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    userPreferencesCollection = null;
  }
}

/**
 * Create indexes for the user preferences collection
 */
export async function createUserPreferencesIndexes(): Promise<void> {
  const collection = getUserPreferencesCollection();
  
  // Create index on user_id for fast lookups
  await collection.createIndex({ user_id: 1 }, { unique: true });
  
  // Create index on username
  await collection.createIndex({ username: 1 });
  
  // Create index on lastAwardAt for time-based queries
  await collection.createIndex({ lastAwardAt: 1 });
  
  // Create index on pointsAwarded for ranking queries
  await collection.createIndex({ pointsAwarded: -1 });
  
  // Create compound index for common query patterns
  await collection.createIndex({ user_id: 1, lastAwardAt: -1 });
}

/**
 * Find user preference by user ID
 */
export async function findUserPreferenceByUserId(userId: string): Promise<UserPreferenceDocument | null> {
  const collection = getUserPreferencesCollection();
  return await collection.findOne({ user_id: userId });
}

/**
 * Create or update user preference
 */
export async function upsertUserPreference(
  userId: string,
  username: string,
  preferences: {
    categoryPreferences?: Record<string, number>;
    tagPreferences?: Record<string, number>;
    pointsAwarded?: number;
    lastAwardAt?: Date;
  }
): Promise<UserPreferenceDocument> {
  const collection = getUserPreferencesCollection();
  
  const now = new Date();
  
  const updateData = {
    $set: {
      user_id: userId,
      username,
      categoryPreferences: preferences.categoryPreferences || {},
      tagPreferences: preferences.tagPreferences || {},
      pointsAwarded: preferences.pointsAwarded || 0,
      lastAwardAt: preferences.lastAwardAt || now,
      updatedAt: now
    },
    $setOnInsert: {
      createdAt: now
    }
  };
  
  const result = await collection.findOneAndUpdate(
    { user_id: userId },
    updateData,
    { upsert: true, returnDocument: 'after' }
  );
  
  if (!result) {
    throw new Error('Failed to upsert user preference');
  }
  
  return result;
}

/**
 * Update points awarded for a user
 */
export async function updateUserPoints(
  userId: string,
  points: number,
  lastAwardAt: Date = new Date()
): Promise<boolean> {
  const collection = getUserPreferencesCollection();
  
  const result = await collection.updateOne(
    { user_id: userId },
    {
      $inc: { pointsAwarded: points },
      $set: { lastAwardAt, updatedAt: new Date() }
    }
  );
  
  return result.modifiedCount > 0;
}

/**
 * Get top users by points
 */
export async function getTopUsersByPoints(limit: number = 10): Promise<UserPreferenceDocument[]> {
  const collection = getUserPreferencesCollection();
  
  return await collection
    .find({})
    .sort({ pointsAwarded: -1 })
    .limit(limit)
    .toArray();
}

/**
 * Get users who haven't been awarded points recently
 */
export async function getUsersNotAwardedRecently(
  since: Date,
  limit: number = 100
): Promise<UserPreferenceDocument[]> {
  const collection = getUserPreferencesCollection();
  
  return await collection
    .find({ lastAwardAt: { $lt: since } })
    .limit(limit)
    .toArray();
}