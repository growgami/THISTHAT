export interface Ranking {
  _id?: string;
  author_id: string;
  author: string;
  author_name: string;
  points: number;
  last_updated: Date;
}

export interface RankingDocument extends Ranking, Document {
  _id: string;
}

// Collection name constant
export const RANKING_COLLECTION = 'ranking';

// Index definitions for MongoDB collections
export const RANKING_INDEXES = {
  author_id: { key: { author_id: 1 }, unique: true },
  points: { key: { points: -1 } }, // For ranking by points
  last_updated: { key: { last_updated: -1 } }, // For recent activity
} as const;
