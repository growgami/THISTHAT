export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  referralCode: string;
  status: 'pending' | 'completed' | 'expired';
  rewardCredits: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface ReferralCode {
  id: string;
  userId: string;
  code: string;
  isActive: boolean;
  usageCount: number;
  maxUses: number | null;
  createdAt: Date;
  expiresAt?: Date;
}

export interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  totalCreditsEarned: number;
}

export interface ReferralHistoryItem {
  id: string;
  referredUser: {
    id: string;
    name: string;
    email: string;
  };
  referralCode: string;
  status: 'pending' | 'completed' | 'expired';
  creditsAwarded: number;
  createdAt: Date;
  completedAt?: Date;
}
