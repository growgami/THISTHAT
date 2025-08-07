import { ObjectId } from 'mongodb';

// Recommendation cache document schema
export interface RecommendationCache {
  _id: ObjectId;
  user_id: string; // UUID from PostgreSQL
  recommendations: {
    tweet_id: string;
    score: number;
    reasoning: {
      category_match: number;
      author_preference: number;
      content_similarity: number;
      trending_boost: number;
      recency_factor: number;
    };
    position: number;
  }[];
  trending_metrics: {
    global_trending: {
      tweet_id: string;
      trend_score: number;
      category: string;
    }[];
    category_trending: {
      [category: string]: {
        tweet_id: string;
        trend_score: number;
      }[];
    };
  };
  cache_metadata: {
    generated_at: Date;
    expires_at: Date;
    version: string;
    user_interaction_count: number;
    last_user_activity: Date;
  };
}

// Collection names as constants
export const COLLECTIONS = {
  RECOMMENDATION_CACHE: 'recommendation_cache',
} as const;

// Index definitions for MongoDB collections
export const INDEXES = {
  recommendation_cache: [
    { key: { user_id: 1 }, unique: true },
    { key: { 'cache_metadata.expires_at': 1 } },
    { key: { 'cache_metadata.generated_at': -1 } },
  ],
} as const;
