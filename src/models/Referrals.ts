import { MongoClient, Collection, Document } from 'mongodb';

// Environment variables for MongoDB connection
const MONGODB_URI = process.env.REFERRALS_MONGODB_URI || '';
const MONGODB_COLLECTION = process.env.REFERRALS_MONGODB_COLLECTION || 'referrals';
const MONGODB_CODES_COLLECTION = process.env.REFERRALS_MONGODB_CODES_COLLECTION || 'referral_codes';

// MongoDB document interface for referrals
export interface ReferralDocument extends Document {
  _id?: string;
  id: string;
  referrerId: string;
  referredId: string;
  referredBy: string | null; // New field to track who referred the user
  referralCode: string;
  rewardCredits: number;
  createdAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
}

// MongoDB document interface for referral codes
export interface ReferralCodeDocument extends Document {
  _id?: string;
  id: string;
  userId: string;
  code: string;
  usageCount: number;
  createdAt: Date;
}

// MongoDB connection and collection
let client: MongoClient | null = null;
let referralsCollection: Collection<ReferralDocument> | null = null;
let referralCodesCollection: Collection<ReferralCodeDocument> | null = null;

/**
 * Initialize MongoDB connection for referrals
 */
export async function connectToReferralsDatabase(): Promise<void> {
  if (!MONGODB_URI) {
    throw new Error('REFERRALS_MONGODB_URI environment variable is not set');
  }

  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }

  const db = client.db();
  referralsCollection = db.collection<ReferralDocument>(MONGODB_COLLECTION);
  referralCodesCollection = db.collection<ReferralCodeDocument>(MONGODB_CODES_COLLECTION);
}

/**
 * Get the referrals collection
 */
export function getReferralsCollection(): Collection<ReferralDocument> {
  if (!referralsCollection) {
    throw new Error('Referrals database connection not initialized');
  }
  return referralsCollection;
}

/**
 * Get the referral codes collection
 */
export function getReferralCodesCollection(): Collection<ReferralCodeDocument> {
  if (!referralCodesCollection) {
    throw new Error('Referral codes database connection not initialized');
  }
  return referralCodesCollection;
}

/**
 * Close MongoDB connection
 */
export async function closeReferralsDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    referralsCollection = null;
    referralCodesCollection = null;
  }
}

/**
 * Create indexes for the referrals collection
 */
export async function createReferralsIndexes(): Promise<void> {
  const collection = getReferralsCollection();
  
  // Create indexes for efficient querying
  await collection.createIndex({ referrerId: 1 });
  await collection.createIndex({ referredId: 1 });
  await collection.createIndex({ referralCode: 1 });
  await collection.createIndex({ createdAt: -1 });
  await collection.createIndex({ referredBy: 1 }); // Index for the new referredBy field
}

/**
 * Create indexes for the referral codes collection
 */
export async function createReferralCodesIndexes(): Promise<void> {
  const collection = getReferralCodesCollection();
  
  // Create indexes for efficient querying
  await collection.createIndex({ userId: 1 });
  await collection.createIndex({ code: 1 });
  await collection.createIndex({ isActive: 1 });
  await collection.createIndex({ createdAt: -1 });
}

/**
 * Find referral code by user ID
 */
export async function findReferralCodeByUserId(userId: string): Promise<ReferralCodeDocument | null> {
  const collection = getReferralCodesCollection();
  return await collection.findOne({ userId });
}

/**
 * Find referral code by code string
 */
export async function findReferralCodeByCode(code: string): Promise<ReferralCodeDocument | null> {
  const collection = getReferralCodesCollection();
  return await collection.findOne({ code });
}

/**
 * Create a new referral code
 */
export async function createReferralCode(codeData: Omit<ReferralCodeDocument, '_id'>): Promise<ReferralCodeDocument> {
  const collection = getReferralCodesCollection();
  const result = await collection.insertOne(codeData as unknown as ReferralCodeDocument);
  return { ...codeData, _id: result.insertedId.toString() } as ReferralCodeDocument;
}

/**
 * Update referral code
 */
export async function updateReferralCode(id: string, updateData: Partial<ReferralCodeDocument>): Promise<boolean> {
  const collection = getReferralCodesCollection();
  const result = await collection.updateOne(
    { id } as unknown as ReferralCodeDocument,
    { $set: updateData }
  );
  return result.modifiedCount > 0;
}

/**
 * Find referral by referred ID and code
 */
export async function findReferralByReferredIdAndCode(referredId: string, referralCode: string): Promise<ReferralDocument | null> {
  const collection = getReferralsCollection();
  return await collection.findOne({ referredId, referralCode } as unknown as ReferralDocument);
}

/**
 * Create a new referral
 */
export async function createReferral(referralData: Omit<ReferralDocument, '_id'>): Promise<ReferralDocument> {
  const collection = getReferralsCollection();
  const result = await collection.insertOne(referralData as unknown as ReferralDocument);
  return { ...referralData, _id: result.insertedId.toString() } as ReferralDocument;
}

/**
 * Get referral history by user ID
 */
export async function getReferralHistoryByUserId(userId: string): Promise<ReferralDocument[]> {
  const collection = getReferralsCollection();
  return await collection.find({ referrerId: userId }).sort({ createdAt: -1 }).toArray() as unknown as ReferralDocument[];
}

/**
 * Get referral stats by user ID
 */
export async function getReferralStatsByUserId(userId: string): Promise<{
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  totalCreditsEarned: number;
}> {
  const collection = getReferralsCollection();
  const userReferrals = await collection.find({ referrerId: userId }).toArray() as unknown as ReferralDocument[];
  
  // Since referrals are now always active, all referrals are considered completed
  const totalReferrals = userReferrals.length;
  const pendingReferrals = 0;
  const completedReferrals = totalReferrals;
  const totalCreditsEarned = userReferrals.reduce((sum, ref) => sum + ref.rewardCredits, 0);
  
  return {
    totalReferrals,
    pendingReferrals,
    completedReferrals,
    totalCreditsEarned
  };
}