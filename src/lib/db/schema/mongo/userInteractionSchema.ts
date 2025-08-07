import { ObjectId } from 'mongodb';

// User interactions document schema
export interface UserInteraction {
  _id: ObjectId;
  user_id: string; // UUID from PostgreSQL
  tweet_id: string;
  interaction_type: 'swipe_left' | 'swipe_right' | 'selection' | 'share' | 'bookmark';
  timestamp: Date;
  session_id: string;
  context: {
    position_in_feed: number;
    total_tweets_in_session: number;
    time_spent_viewing: number; // milliseconds
  };
  metadata: {
    device_type?: string;
    app_version?: string;
    user_agent?: string;
  };
  // Swipe history tracking for author ranking and filtering
  swipe_history?: {
    previous_tweet_ids: string[]; // Recently swiped tweet IDs
    author_interactions: {
      author_id: string;
      interaction_count: number;
      last_interaction: Date;
    }[];
  };
  // Reference to author for quick lookup
  author_id?: string;
}

// Collection names as constants
export const COLLECTIONS = {
  USER_INTERACTIONS: 'user_interactions',
} as const;

// Index definitions for MongoDB collections
export const INDEXES = {
  user_interactions: [
    { key: { user_id: 1, timestamp: -1 } },
    { key: { tweet_id: 1 } },
    { key: { interaction_type: 1 } },
    { key: { session_id: 1 } },
    { key: { author_id: 1 } }, // For author-based queries
  ],
} as const;

// Type guards for runtime validation
export const isValidUserInteraction = (obj: unknown): obj is UserInteraction => {
  return!! obj &&
    typeof (obj as UserInteraction)._id === 'object' &&
    typeof (obj as UserInteraction).user_id === 'string' &&
    typeof (obj as UserInteraction).tweet_id === 'string' &&
    ['swipe_left', 'swipe_right', 'selection', 'share', 'bookmark'].includes((obj as UserInteraction).interaction_type) &&
    (obj as UserInteraction).timestamp instanceof Date;
};
