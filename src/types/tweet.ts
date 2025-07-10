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