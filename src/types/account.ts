export interface UserStats {
  totalSwipes: number;
  totalCredits: number;
  currentStreak: number;
  totalMarketsCreated: number;
  totalMarketsParticipated: number;
  totalCreditsEarned: number;
  totalCreditsSpent: number;
  accountAge: number; // days since joining
  favoriteCategory: string;
  rank: number;
  level: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: {
    dailyCredits: boolean;
    marketResults: boolean;
    recommendations: boolean;
    achievements: boolean;
  };
  privacy: {
    showProfile: boolean;
    showStats: boolean;
    allowDirectMessages: boolean;
  };
  recommendations: {
    diversityLevel: number; // 0-100
    categories: Record<string, number>; // category weights
  };
}

export type PreferenceUpdates = Partial<UserPreferences>;

export interface CreditTransaction {
  id: string;
  amount: number;
  type: 'earned' | 'spent' | 'bonus' | 'refund';
  description: string;
  timestamp: Date;
  referenceId?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'engagement' | 'markets' | 'social' | 'milestone';
} 