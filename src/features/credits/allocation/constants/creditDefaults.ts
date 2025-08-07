/**
 * Credit system constants and default values
 * Designed to be easily replaceable with database queries
 */

export interface UserCreditData {
  userId: string;
  dailyCredits: number;
  totalCredits: number;
  lastResetDate: string;
  subscriptionTier: 'free' | 'premium' | 'pro';
}

export interface CreditTiers {
  free: {
    dailyLimit: number;
    resetTime: string;
  };
  premium: {
    dailyLimit: number;
    resetTime: string;
  };
  pro: {
    dailyLimit: number;
    resetTime: string;
  };
}

// Default credit tiers (will be replaced by DB queries)
export const CREDIT_TIERS: CreditTiers = {
  free: {
    dailyLimit: 10,
    resetTime: '00:00'
  },
  premium: {
    dailyLimit: 50,
    resetTime: '00:00'
  },
  pro: {
    dailyLimit: 200,
    resetTime: '00:00'
  }
};

// Mock user data (will be replaced by DB queries)
export const MOCK_USERS: UserCreditData[] = [
  {
    userId: 'user_1',
    dailyCredits: 5,
    totalCredits: 105,
    lastResetDate: '2025-07-24',
    subscriptionTier: 'free'
  },
  {
    userId: 'user_2',
    dailyCredits: 25,
    totalCredits: 275,
    lastResetDate: '2025-07-24',
    subscriptionTier: 'premium'
  },
  {
    userId: 'user_3',
    dailyCredits: 150,
    totalCredits: 1850,
    lastResetDate: '2025-07-24',
    subscriptionTier: 'pro'
  }
];

// Cron schedule for daily reset at midnight
export const RESET_CRON_SCHEDULE = '0 0 * * *';

// API endpoints
export const CREDIT_RESET_ENDPOINT = '/api/credit-reset';

// Database replacement functions (to be implemented when DB is ready)
export class CreditService {
  /**
   * Get all users that need credit reset
   * TODO: Replace with actual database query
   */
  static async getAllUsers(): Promise<UserCreditData[]> {
    return Promise.resolve([...MOCK_USERS]);
  }

  /**
   * Reset daily credits for a specific user
   * TODO: Replace with actual database update
   */
  static async resetUserCredits(userId: string): Promise<UserCreditData | null> {
    const userIndex = MOCK_USERS.findIndex(user => user.userId === userId);
    if (userIndex === -1) return null;

    const user = MOCK_USERS[userIndex];
    const tier = CREDIT_TIERS[user.subscriptionTier];
    
    // Reset daily credits to tier limit
    MOCK_USERS[userIndex] = {
      ...user,
      dailyCredits: tier.dailyLimit,
      lastResetDate: new Date().toISOString().split('T')[0]
    };

    return MOCK_USERS[userIndex];
  }

  /**
   * Reset daily credits for all users
   * TODO: Replace with batch database update
   */
  static async resetAllUserCredits(): Promise<{ success: boolean; count: number; errors: string[] }> {
    const errors: string[] = [];
    let successCount = 0;

    for (const user of MOCK_USERS) {
      try {
        await this.resetUserCredits(user.userId);
        successCount++;
      } catch (error) {
        errors.push(`Failed to reset credits for user ${user.userId}: ${error}`);
      }
    }

    return {
      success: errors.length === 0,
      count: successCount,
      errors
    };
  }

  /**
   * Get user credit data by ID
   * TODO: Replace with actual database query
   */
  static async getUserCredits(userId: string): Promise<UserCreditData | null> {
    return Promise.resolve(MOCK_USERS.find(user => user.userId === userId) || null);
  }
}
