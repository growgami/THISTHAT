// Tweet data structure from MongoDB and API
export interface Tweet {
  _id: string;
  created_at: string;
  tweet_url: string;
  text: string;
  category: string;
  tag: string;
  author_id: string;
  author: string;
  author_name: string;
  author_pfp: string;
  author_followers: number;
  // Additional fields
  retweet_count?: number;
  like_count?: number;
  reply_count?: number;
  quote_count?: number;
  url?: string;
  media?: {
    type: 'photo' | 'video' | 'gif';
    url: string;
    alt_text?: string;
  }[];
  processed_at?: string;
  embedding_vector?: number[];
  topic_classification?: {
    primary_topic: string;
    confidence: number;
    secondary_topics: { topic: string; confidence: number }[];
  };
  author_ranking?: {
    author_points: number;
    author_rank?: number;
    last_updated: string;
  };
  content_relationships?: {
    related_tweets: string[];
    related_authors: string[];
    cross_category_tags: string[];
  };
  categories?: string[];
  tags?: string[];
}

// Query parameters for filtering tweets
export interface TweetQuery {
  category?: string;
  tag?: string;
}

// API response structure
export interface TweetApiResponse {
  tweets: Tweet[];
}

// Error response structure
export interface ApiErrorResponse {
  error: string;
} 