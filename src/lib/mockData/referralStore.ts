// Shared in-memory store for referral codes during development
// In a real implementation, this would be replaced with database calls
// This implementation includes file-based persistence as a fallback

import fs from 'fs';
import path from 'path';

export type ReferralCode = {
  userId: string;
  code: string;
  isActive: boolean;
  usageCount: number;
  maxUses: number | null;
  createdAt: Date;
  expiresAt: Date | null;
};

export type Referral = {
  id: string;
  referrerId: string;
  referredId: string;
  referralCode: string;
  status: string;
  rewardCredits: number;
  createdAt: Date;
  completedAt: Date;
};

// File path for persistent storage
const REFERRAL_DATA_FILE = path.join(process.cwd(), 'referral-data.json');

// Shared mock data stores
export const mockReferralCodes: ReferralCode[] = [];
export const mockReferrals: Referral[] = [];

// Load data from file on startup
function loadFromFile() {
  try {
    if (fs.existsSync(REFERRAL_DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(REFERRAL_DATA_FILE, 'utf8'));
      
      // Convert date strings back to Date objects
      mockReferralCodes.push(...data.referralCodes.map((code: ReferralCode) => ({
        ...code,
        createdAt: new Date(code.createdAt),
        expiresAt: code.expiresAt ? new Date(code.expiresAt) : null
      })));
      
      mockReferrals.push(...data.referrals.map((referral: Referral) => ({
        ...referral,
        createdAt: new Date(referral.createdAt),
        completedAt: referral.completedAt ? new Date(referral.completedAt) : new Date()
      })));
    }
  } catch (error) {
    console.error('Error loading referral data from file:', error);
  }
}

// Save data to file
function saveToFile() {
  try {
    const data = {
      referralCodes: mockReferralCodes,
      referrals: mockReferrals
    };
    fs.writeFileSync(REFERRAL_DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving referral data to file:', error);
  }
}

// Load data when module is imported
loadFromFile();

// Helper functions to manage referral codes
export const findReferralCodeByUserId = (userId: string): ReferralCode | undefined => {
  console.log('Searching for referral code by user ID:', userId);
  console.log('Current referral codes in store:', mockReferralCodes);
  const result = mockReferralCodes.find(code => code.userId === userId);
  console.log('Found result:', result);
  return result;
};

export const findReferralCodeByCode = (code: string): ReferralCode | undefined => {
  return mockReferralCodes.find(referralCode => referralCode.code === code);
};

export const addReferralCode = (code: ReferralCode): void => {
  console.log('Adding referral code:', code);
  mockReferralCodes.push(code);
  console.log('Referral codes after adding:', mockReferralCodes);
  saveToFile();
};

export const addReferral = (referral: Referral): void => {
  mockReferrals.push(referral);
  // Update usage count for the referral code
  const referralCode = findReferralCodeByCode(referral.referralCode);
  if (referralCode) {
    referralCode.usageCount += 1;
  }
  saveToFile();
};

export const findReferralByReferredIdAndCode = (referredId: string, referralCode: string): Referral | undefined => {
  return mockReferrals.find(ref => ref.referredId === referredId && ref.referralCode === referralCode);
};

export const getReferralHistoryByUserId = (userId: string): Referral[] => {
  return mockReferrals.filter(ref => ref.referrerId === userId);
};

export const getReferralStatsByUserId = (userId: string) => {
  const userReferrals = getReferralHistoryByUserId(userId);
  const userCode = findReferralCodeByUserId(userId);
  
  return {
    totalReferrals: userReferrals.length,
    totalCreditsEarned: userReferrals.reduce((sum, ref) => sum + ref.rewardCredits, 0),
    activeCode: userCode?.code || null,
    codeUsageCount: userCode?.usageCount || 0,
    maxUses: userCode?.maxUses || null,
  };
};

// Initialize with some mock data for testing
mockReferralCodes.push(
  { 
    userId: 'user1', 
    code: 'ABC123DE', 
    isActive: true, 
    usageCount: 2, 
    maxUses: 10, 
    createdAt: new Date(), 
    expiresAt: null 
  },
  { 
    userId: 'user2', 
    code: 'XYZ789FG', 
    isActive: true, 
    usageCount: 0, 
    maxUses: 5, 
    createdAt: new Date(), 
    expiresAt: null 
  }
);
