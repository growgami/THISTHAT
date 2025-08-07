import { ObjectId } from 'mongodb';

// Author points document schema for ranking system
export interface AuthorPoints {
  _id: ObjectId;
  author_id: string; // Unique identifier for the author
  author_name: string; // Display name
  author_username: string; // Twitter handle
  points: number; // Total swipe points
  last_updated: Date; // Timestamp of last update
}

// Index definitions for MongoDB collections
export const INDEXES = {
  author_points: [
    { key: { author_id: 1 }, unique: true },
    { key: { points: -1 } }, // For ranking by points
    { key: { last_updated: -1 } }, // For recent activity
  ],
} as const;

// Type guards for runtime validation
export const isValidAuthorPoints = (obj: unknown): obj is AuthorPoints => {
  return !!obj &&
    typeof (obj as AuthorPoints)._id === 'object' &&
    typeof (obj as AuthorPoints).author_id === 'string' &&
    typeof (obj as AuthorPoints).author_name === 'string' &&
    typeof (obj as AuthorPoints).author_username === 'string' &&
    typeof (obj as AuthorPoints).points === 'number' &&
    (obj as AuthorPoints).points >= 0 &&
    (obj as AuthorPoints).last_updated instanceof Date;
};

// Interface for tracking swipe history in user interactions
export interface SwipeHistory {
  tweet_id: string;
  swipe_direction: 'left' | 'right';
  timestamp: Date;
  author_id: string; // For quick author lookup
}

// Enhanced Tweet interface with ranking metadata
// Note: This interface extends the base Tweet interface with additional ranking metadata
export interface EnhancedTweet {
  _id: ObjectId;
  content: string;
  author: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  metadata: {
    created_at: Date;
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
    url?: string;
    media?: {
      type: 'photo' | 'video' | 'gif';
      url: string;
      alt_text?: string;
    }[];
  };
  categories: string[];
  tags: string[];
  processed_at: Date;
  embedding_vector?: number[];
  topic_classification?: {
    primary_topic: string;
    confidence: number;
    secondary_topics: { topic: string; confidence: number }[];
  };
  // Author ranking metadata
  author_ranking?: {
    author_points: number;
    author_rank?: number;
    last_updated: Date;
  };
  // Content relationships for filtering and recommendations
  content_relationships?: {
    related_tweets: string[]; // IDs of related tweets
    related_authors: string[]; // Authors in same category/topic
    cross_category_tags: string[]; // Tags that appear across multiple categories
  };
}
