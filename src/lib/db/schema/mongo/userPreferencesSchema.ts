import { ObjectId } from 'mongodb';

// User preferences document schema
export interface UserPreferences {
  _id: ObjectId;
  user_id: string; // UUID from PostgreSQL
  category_weights: {
    [category: string]: number; // 0-1 weight for each category
  };
  author_preferences: {
    preferred_authors: string[]; // author IDs
    blocked_authors: string[]; // author IDs
    author_weights: {
      [author_id: string]: number; // -1 to 1 preference score
    };
  };
  recommendation_state: {
    last_updated: Date;
    learning_phase: 'initial' | 'learning' | 'stable';
    interaction_count: number;
    preference_confidence: number; // 0-1
  };
  content_filters: {
    min_engagement_threshold: number;
    exclude_retweets: boolean;
    language_preferences: string[];
    content_types: ('text' | 'image' | 'video' | 'link')[];
  };
  updated_at: Date;
}

// Collection names as constants
export const COLLECTIONS = {
  USER_PREFERENCES: 'user_preferences',
} as const;

// Index definitions for MongoDB collections
export const INDEXES = {
  user_preferences: [
    { key: { user_id: 1 }, unique: true },
    { key: { updated_at: -1 } },
  ],
} as const;

// Type guards for runtime validation
export const isValidUserPreferences = (obj: unknown): obj is UserPreferences => {
  if (!obj) return false;
  
  const pref = obj as UserPreferences;
  
  // Validate basic properties
  if (typeof pref._id !== 'object' ||
      typeof pref.user_id !== 'string' ||
      !pref.category_weights ||
      typeof pref.category_weights !== 'object' ||
      !pref.author_preferences ||
      !pref.recommendation_state ||
      !pref.content_filters ||
      !(pref.updated_at instanceof Date)) {
    return false;
  }
  
  // Validate recommendation_state properties
  if (!(pref.recommendation_state.last_updated instanceof Date) ||
      !['initial', 'learning', 'stable'].includes(pref.recommendation_state.learning_phase) ||
      typeof pref.recommendation_state.interaction_count !== 'number' ||
      typeof pref.recommendation_state.preference_confidence !== 'number') {
    return false;
  }
  
  // Validate author_preferences properties
  if (!Array.isArray(pref.author_preferences.preferred_authors) ||
      !Array.isArray(pref.author_preferences.blocked_authors) ||
      typeof pref.author_preferences.author_weights !== 'object') {
    return false;
  }
  
  // Validate content_filters properties
  if (typeof pref.content_filters.min_engagement_threshold !== 'number' ||
      typeof pref.content_filters.exclude_retweets !== 'boolean' ||
      !Array.isArray(pref.content_filters.language_preferences) ||
      !Array.isArray(pref.content_filters.content_types)) {
    return false;
  }
  
  return true;
};
