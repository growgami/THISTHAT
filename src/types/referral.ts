export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  referralCode: string;
  rewardCredits: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface ReferralCode {
  id: string;
  userId: string;
  code: string;
  usageCount: number;
  createdAt: Date;
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
  creditsAwarded: number;
  createdAt: Date;
  completedAt?: Date;
}
