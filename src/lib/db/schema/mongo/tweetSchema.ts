import { ObjectId } from 'mongodb';

// Tweet document schema
export interface Tweet {
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

// Collection names as constants
export const COLLECTIONS = {
  TWEETS: 'tweets',
} as const;

// Index definitions for MongoDB collections
export const INDEXES = {
  tweets: [
    { key: { 'author.id': 1 } },
    { key: { categories: 1 } },
    { key: { tags: 1 } },
    { key: { 'metadata.created_at': -1 } },
    { key: { processed_at: -1 } },
    { key: { 'author_ranking.author_points': -1 } }, // For ranking by author points
    { key: { 'author_ranking.last_updated': -1 } }, // For recent ranking updates
  ],
} as const;

// Type guards for runtime validation
export const isValidTweet = (obj: unknown): obj is Tweet => {
  return!! obj && 
    typeof (obj as Tweet)._id === 'object' &&
    typeof (obj as Tweet).content === 'string' &&
    (obj as Tweet).author &&
    typeof (obj as Tweet).author.id === 'string' &&
    (obj as Tweet).metadata &&
    (obj as Tweet).categories &&
    Array.isArray((obj as Tweet).categories) &&
    (obj as Tweet).tags &&
    Array.isArray((obj as Tweet).tags) &&
    typeof (obj as Tweet).metadata.created_at === 'object' &&
    (obj as Tweet).metadata.created_at instanceof Date &&
    typeof (obj as Tweet).processed_at === 'object' &&
    (obj as Tweet).processed_at instanceof Date;
};
