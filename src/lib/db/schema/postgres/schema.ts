// PostgreSQL schema definitions with TypeScript interfaces

// User table schema
export interface User {
  id: string; // UUID
  email: string;
  twitter_id?: string;
  created_at: Date;
  updated_at: Date;
  subscription_tier: 'free' | 'premium' | 'pro';
  status: 'active' | 'suspended' | 'deleted';
  last_login?: Date;
  email_verified: boolean;
}

// User profile table schema
export interface UserProfile {
  user_id: string; // UUID, references users.id
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  settings: Record<string, unknown>; // JSONB
  preferences: Record<string, unknown>; // JSONB
  created_at: Date;
  updated_at: Date;
}

// User credits table schema
export interface UserCredits {
  user_id: string; // UUID, references users.id
  current_balance: number;
  total_earned: number;
  total_spent: number;
  last_updated: Date;
}

// Credit transactions table schema
export interface CreditTransaction {
  id: string; // UUID
  user_id: string; // UUID, references users.id
  amount: number;
  type: 'earned' | 'spent' | 'bonus' | 'refund';
  description?: string;
  reference_id?: string; // UUID
  reference_type?: string; // 'market_vote', 'referral', 'daily_bonus', etc.
  timestamp: Date;
  metadata: Record<string, unknown>; // JSONB
}

// Prediction markets table schema
export interface PredictionMarket {
  id: string; // UUID
  creator_id: string; // UUID, references users.id
  title: string;
  description?: string;
  category?: string;
  options: Array<{
    id: string;
    text: string;
    description?: string;
  }>; // JSONB
  end_date: Date;
  status: 'active' | 'closed' | 'resolved' | 'cancelled';
  resolution_data?: {
    winning_option_id?: string;
    resolved_at: Date;
    resolver_id: string;
    resolution_notes?: string;
  }; // JSONB
  total_volume: number;
  participant_count: number;
  created_at: Date;
  updated_at: Date;
}

// Market votes table schema
export interface MarketVote {
  id: string; // UUID
  market_id: string; // UUID, references prediction_markets.id
  user_id: string; // UUID, references users.id
  option_id: string;
  credits_spent: number;
  confidence_level?: number; // 1-10 scale
  timestamp: Date;
  is_active: boolean; // for vote changes/cancellations
}

// Daily user stats table schema
export interface DailyUserStats {
  id: string; // UUID
  user_id: string; // UUID, references users.id
  date: Date; // Date only, no time
  swipes_made: number;
  selections_made: number;
  markets_created: number;
  markets_participated: number;
  credits_earned: number;
  credits_spent: number;
  session_count: number;
  total_time_spent: number; // minutes
  created_at: Date;
}

// Content performance table schema
export interface ContentPerformance {
  id: string; // UUID
  tweet_id: string;
  date: Date; // Date only, for daily aggregation
  views: number;
  selections: number;
  shares: number;
  bookmarks: number;
  swipe_left_count: number;
  swipe_right_count: number;
  ranking_score: number;
  engagement_rate: number;
  created_at: Date;
  updated_at: Date;
}

// Leaderboards table schema
export interface Leaderboard {
  id: string; // UUID
  user_id: string; // UUID, references users.id
  rank: number;
  score: number;
  category: string; // 'prediction_accuracy', 'credits_earned', 'content_curation', etc.
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  period_start: Date;
  period_end: Date;
  created_at: Date;
  updated_at: Date;
}

// Referrals table schema
export interface Referral {
  id: string; // UUID
  referrer_id: string; // UUID, references users.id
  referred_id: string; // UUID, references users.id
  status: 'pending' | 'completed' | 'expired';
  referral_code: string;
  credits_awarded: number;
  completion_requirements?: {
    min_swipes?: number;
    min_markets_participated?: number;
    min_days_active?: number;
  }; // JSONB
  completed_at?: Date;
  created_at: Date;
  expires_at?: Date;
}

// Author ranking table schema for leaderboard functionality
export interface AuthorRanking {
  id: string; // UUID
  author_id: string; // References author in MongoDB
  author_name: string; // Display name
  author_username: string; // Twitter handle
  points: number; // Total swipe points
  rank?: number; // Current rank
  last_updated: Date; // Timestamp of last update
  period: 'daily' | 'weekly' | 'monthly' | 'all_time'; // Ranking period
  category?: string; // Category-specific ranking
}

// Author ranking history table schema for tracking rank changes
export interface AuthorRankingHistory {
  id: string; // UUID
  author_id: string; // References author in MongoDB
  points: number; // Points at this timestamp
  rank: number; // Rank at this timestamp
  timestamp: Date; // When this ranking was recorded
  period: 'daily' | 'weekly' | 'monthly' | 'all_time'; // Ranking period
  category?: string; // Category-specific ranking
}

// Table names as constants
export const TABLES = {
  USERS: 'users',
  USER_PROFILES: 'user_profiles',
  USER_CREDITS: 'user_credits',
  CREDIT_TRANSACTIONS: 'credit_transactions',
  PREDICTION_MARKETS: 'prediction_markets',
  MARKET_VOTES: 'market_votes',
  DAILY_USER_STATS: 'daily_user_stats',
  CONTENT_PERFORMANCE: 'content_performance',
  LEADERBOARDS: 'leaderboards',
  REFERRALS: 'referrals',
  AUTHOR_RANKINGS: 'author_rankings',
  AUTHOR_RANKING_HISTORY: 'author_ranking_history',
} as const;

// SQL DDL statements for table creation
export const CREATE_TABLES = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      twitter_id VARCHAR(50) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
      last_login TIMESTAMP,
      email_verified BOOLEAN DEFAULT false
    );
  `,
  user_profiles: `
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      display_name VARCHAR(100),
      avatar_url TEXT,
      bio TEXT,
      settings JSONB DEFAULT '{}',
      preferences JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,
  user_credits: `
    CREATE TABLE IF NOT EXISTS user_credits (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      current_balance INTEGER DEFAULT 0,
      total_earned INTEGER DEFAULT 0,
      total_spent INTEGER DEFAULT 0,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,
  credit_transactions: `
    CREATE TABLE IF NOT EXISTS credit_transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL,
      type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'spent', 'bonus', 'refund')),
      description TEXT,
      reference_id UUID,
      reference_type VARCHAR(50),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      metadata JSONB DEFAULT '{}'
    );
  `,
  prediction_markets: `
    CREATE TABLE IF NOT EXISTS prediction_markets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      creator_id UUID NOT NULL REFERENCES users(id),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      options JSONB NOT NULL,
      end_date TIMESTAMP NOT NULL,
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'resolved', 'cancelled')),
      resolution_data JSONB,
      total_volume INTEGER DEFAULT 0,
      participant_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,
  market_votes: `
    CREATE TABLE IF NOT EXISTS market_votes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      market_id UUID NOT NULL REFERENCES prediction_markets(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      option_id VARCHAR(50) NOT NULL,
      credits_spent INTEGER NOT NULL,
      confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 10),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT true,
      UNIQUE(market_id, user_id, option_id)
    );
  `,
  daily_user_stats: `
    CREATE TABLE IF NOT EXISTS daily_user_stats (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      swipes_made INTEGER DEFAULT 0,
      selections_made INTEGER DEFAULT 0,
      markets_created INTEGER DEFAULT 0,
      markets_participated INTEGER DEFAULT 0,
      credits_earned INTEGER DEFAULT 0,
      credits_spent INTEGER DEFAULT 0,
      session_count INTEGER DEFAULT 0,
      total_time_spent INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, date)
    );
  `,
  content_performance: `
    CREATE TABLE IF NOT EXISTS content_performance (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tweet_id VARCHAR(50) NOT NULL,
      date DATE NOT NULL,
      views INTEGER DEFAULT 0,
      selections INTEGER DEFAULT 0,
      shares INTEGER DEFAULT 0,
      bookmarks INTEGER DEFAULT 0,
      swipe_left_count INTEGER DEFAULT 0,
      swipe_right_count INTEGER DEFAULT 0,
      ranking_score DECIMAL(10, 2) DEFAULT 0,
      engagement_rate DECIMAL(5, 4) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(tweet_id, date)
    );
  `,
  leaderboards: `
    CREATE TABLE IF NOT EXISTS leaderboards (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rank INTEGER NOT NULL,
      score DECIMAL(10, 2) NOT NULL,
      category VARCHAR(100) NOT NULL,
      period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
      period_start TIMESTAMP NOT NULL,
      period_end TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, category, period, period_start)
    );
  `,
  referrals: `
    CREATE TABLE IF NOT EXISTS referrals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
      referral_code VARCHAR(50) NOT NULL,
      credits_awarded INTEGER DEFAULT 0,
      completion_requirements JSONB,
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP,
      UNIQUE(referrer_id, referred_id)
    );
  `,
  author_rankings: `
    CREATE TABLE IF NOT EXISTS author_rankings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      author_id VARCHAR(50) NOT NULL,
      author_name VARCHAR(100) NOT NULL,
      author_username VARCHAR(50) NOT NULL,
      points INTEGER DEFAULT 0,
      rank INTEGER,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
      category VARCHAR(100),
      UNIQUE(author_id, period, category)
    );
  `,
  author_ranking_history: `
    CREATE TABLE IF NOT EXISTS author_ranking_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      author_id VARCHAR(50) NOT NULL,
      points INTEGER DEFAULT 0,
      rank INTEGER NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
      category VARCHAR(100)
    );
  `,
} as const;

// Index definitions for PostgreSQL tables
export const INDEXES = {
  users: [
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
    'CREATE INDEX IF NOT EXISTS idx_users_twitter_id ON users(twitter_id)',
    'CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier)',
    'CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)',
    'CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)',
  ],
  user_profiles: [
    'CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_user_profiles_display_name ON user_profiles(display_name)',
  ],
  user_credits: [
    'CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_user_credits_last_updated ON user_credits(last_updated)',
  ],
  credit_transactions: [
    'CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(type)',
    'CREATE INDEX IF NOT EXISTS idx_credit_transactions_timestamp ON credit_transactions(timestamp)',
    'CREATE INDEX IF NOT EXISTS idx_credit_transactions_reference_id ON credit_transactions(reference_id)',
  ],
  prediction_markets: [
    'CREATE INDEX IF NOT EXISTS idx_prediction_markets_creator_id ON prediction_markets(creator_id)',
    'CREATE INDEX IF NOT EXISTS idx_prediction_markets_category ON prediction_markets(category)',
    'CREATE INDEX IF NOT EXISTS idx_prediction_markets_status ON prediction_markets(status)',
    'CREATE INDEX IF NOT EXISTS idx_prediction_markets_end_date ON prediction_markets(end_date)',
    'CREATE INDEX IF NOT EXISTS idx_prediction_markets_created_at ON prediction_markets(created_at)',
  ],
  market_votes: [
    'CREATE INDEX IF NOT EXISTS idx_market_votes_market_id ON market_votes(market_id)',
    'CREATE INDEX IF NOT EXISTS idx_market_votes_user_id ON market_votes(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_market_votes_option_id ON market_votes(option_id)',
    'CREATE INDEX IF NOT EXISTS idx_market_votes_timestamp ON market_votes(timestamp)',
    'CREATE INDEX IF NOT EXISTS idx_market_votes_is_active ON market_votes(is_active)',
  ],
  daily_user_stats: [
    'CREATE INDEX IF NOT EXISTS idx_daily_user_stats_user_id ON daily_user_stats(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_daily_user_stats_date ON daily_user_stats(date)',
    'CREATE INDEX IF NOT EXISTS idx_daily_user_stats_created_at ON daily_user_stats(created_at)',
  ],
  content_performance: [
    'CREATE INDEX IF NOT EXISTS idx_content_performance_tweet_id ON content_performance(tweet_id)',
    'CREATE INDEX IF NOT EXISTS idx_content_performance_date ON content_performance(date)',
    'CREATE INDEX IF NOT EXISTS idx_content_performance_ranking_score ON content_performance(ranking_score)',
    'CREATE INDEX IF NOT EXISTS idx_content_performance_created_at ON content_performance(created_at)',
  ],
  leaderboards: [
    'CREATE INDEX IF NOT EXISTS idx_leaderboards_user_id ON leaderboards(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_leaderboards_category ON leaderboards(category)',
    'CREATE INDEX IF NOT EXISTS idx_leaderboards_period ON leaderboards(period)',
    'CREATE INDEX IF NOT EXISTS idx_leaderboards_rank ON leaderboards(rank)',
    'CREATE INDEX IF NOT EXISTS idx_leaderboards_period_start ON leaderboards(period_start)',
    'CREATE INDEX IF NOT EXISTS idx_leaderboards_created_at ON leaderboards(created_at)',
  ],
  referrals: [
    'CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id)',
    'CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id)',
    'CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status)',
    'CREATE INDEX IF NOT EXISTS idx_referrals_referral_code ON referrals(referral_code)',
    'CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON referrals(created_at)',
  ],
  author_rankings: [
    'CREATE INDEX IF NOT EXISTS idx_author_rankings_author_id ON author_rankings(author_id)',
    'CREATE INDEX IF NOT EXISTS idx_author_rankings_points ON author_rankings(points)',
    'CREATE INDEX IF NOT EXISTS idx_author_rankings_rank ON author_rankings(rank)',
    'CREATE INDEX IF NOT EXISTS idx_author_rankings_period ON author_rankings(period)',
    'CREATE INDEX IF NOT EXISTS idx_author_rankings_category ON author_rankings(category)',
    'CREATE INDEX IF NOT EXISTS idx_author_rankings_last_updated ON author_rankings(last_updated)',
  ],
  author_ranking_history: [
    'CREATE INDEX IF NOT EXISTS idx_author_ranking_history_author_id ON author_ranking_history(author_id)',
    'CREATE INDEX IF NOT EXISTS idx_author_ranking_history_timestamp ON author_ranking_history(timestamp)',
    'CREATE INDEX IF NOT EXISTS idx_author_ranking_history_period ON author_ranking_history(period)',
    'CREATE INDEX IF NOT EXISTS idx_author_ranking_history_category ON author_ranking_history(category)',
  ],
} as const;

// Type guards for runtime validation
export const isValidUser = (obj: unknown): obj is User => {
  return!! obj &&
    typeof (obj as User).id === 'string' &&
    typeof (obj as User).email === 'string' &&
    ['free', 'premium', 'pro'].includes((obj as User).subscription_tier) &&
    ['active', 'suspended', 'deleted'].includes((obj as User).status) &&
    typeof (obj as User).email_verified === 'boolean';
};

export const isValidPredictionMarket = (obj: unknown): obj is PredictionMarket => {
  return!! obj &&
    typeof (obj as PredictionMarket).id === 'string' &&
    typeof (obj as PredictionMarket).creator_id === 'string' &&
    typeof (obj as PredictionMarket).title === 'string' &&
    Array.isArray((obj as PredictionMarket).options) &&
    (obj as PredictionMarket).end_date instanceof Date &&
    ['active', 'closed', 'resolved', 'cancelled'].includes((obj as PredictionMarket).status);
};

export const isValidMarketVote = (obj: unknown): obj is MarketVote => {
  return!! obj &&
    typeof (obj as MarketVote).id === 'string' &&
    typeof (obj as MarketVote).market_id === 'string' &&
    typeof (obj as MarketVote).user_id === 'string' &&
    typeof (obj as MarketVote).option_id === 'string' &&
    typeof (obj as MarketVote).credits_spent === 'number' &&
    (obj as MarketVote).credits_spent > 0;
};

export const isValidAuthorRanking = (obj: unknown): obj is AuthorRanking => {
  return!! obj &&
    typeof (obj as AuthorRanking).id === 'string' &&
    typeof (obj as AuthorRanking).author_id === 'string' &&
    typeof (obj as AuthorRanking).author_name === 'string' &&
    typeof (obj as AuthorRanking).author_username === 'string' &&
    typeof (obj as AuthorRanking).points === 'number' &&
    (obj as AuthorRanking).points >= 0 &&
    (obj as AuthorRanking).last_updated instanceof Date &&
    ['daily', 'weekly', 'monthly', 'all_time'].includes((obj as AuthorRanking).period);
};

export const isValidAuthorRankingHistory = (obj: unknown): obj is AuthorRankingHistory => {
  return!! obj &&
    typeof (obj as AuthorRankingHistory).id === 'string' &&
    typeof (obj as AuthorRankingHistory).author_id === 'string' &&
    typeof (obj as AuthorRankingHistory).points === 'number' &&
    typeof (obj as AuthorRankingHistory).rank === 'number' &&
    (obj as AuthorRankingHistory).timestamp instanceof Date &&
    ['daily', 'weekly', 'monthly', 'all_time'].includes((obj as AuthorRankingHistory).period);
};