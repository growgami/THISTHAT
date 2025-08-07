import { ObjectId } from 'mongodb';

// Content vectors document schema
export interface ContentVector {
  _id: ObjectId;
  tweet_id: string;
  embedding_vector: number[];
  similarity_scores: {
    [tweet_id: string]: number; // cosine similarity scores with other tweets
  };
  topic_classifications: {
    primary_topic: string;
    confidence: number;
    secondary_topics: {
      topic: string;
      confidence: number;
    }[];
  };
  content_features: {
    sentiment_score: number; // -1 to 1
    readability_score: number;
    engagement_prediction: number;
    virality_score: number;
  };
  created_at: Date;
  updated_at: Date;
}

// Collection names as constants
export const COLLECTIONS = {
  CONTENT_VECTORS: 'content_vectors',
} as const;

// Index definitions for MongoDB collections
export const INDEXES = {
  content_vectors: [
    { key: { tweet_id: 1 }, unique: true },
    { key: { 'topic_classifications.primary_topic': 1 } },
    { key: { created_at: -1 } },
  ],
} as const;
