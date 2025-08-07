import mongoose from 'mongoose';

// Define the Tweet schema to match actual MongoDB field names
const tweetSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    required: true
  },
  created_at: { 
    type: Date, 
    required: true 
  },
  tweet_url: { 
    type: String, 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  tag: { 
    type: String, 
    required: true 
  },
  author_id: { 
    type: String, 
    required: true 
  },
  author: { 
    type: String, 
    required: true 
  },
  author_name: { 
    type: String, 
    required: true 
  },
  author_pfp: { 
    type: String, 
    required: true 
  },
  author_followers: { 
    type: Number, 
    required: true 
  },
  // Additional fields from the schema
  retweet_count: { 
    type: Number, 
    default: 0 
  },
  like_count: { 
    type: Number, 
    default: 0 
  },
  reply_count: { 
    type: Number, 
    default: 0 
  },
  quote_count: { 
    type: Number, 
    default: 0 
  },
  url: { 
    type: String 
  },
  media: [{
    type: {
      type: String,
      enum: ['photo', 'video', 'gif']
    },
    url: String,
    alt_text: String
  }],
  processed_at: { 
    type: Date 
  },
  embedding_vector: [{
    type: Number
  }],
  topic_classification: {
    primary_topic: String,
    confidence: Number,
    secondary_topics: [{
      topic: String,
      confidence: Number
    }]
  },
  author_ranking: {
    author_points: Number,
    author_rank: Number,
    last_updated: Date
  },
  content_relationships: {
    related_tweets: [{
      type: String
    }],
    related_authors: [{
      type: String
    }],
    cross_category_tags: [{
      type: String
    }]
  },
  categories: [{
    type: String
  }],
  tags: [{
    type: String
  }]
}, {
  // This ensures the model uses the collection name specified here
  collection: 'tweet_data'
  // Removed toJSON transform for camelCase normalization
});

// Add indexes for better query performance
tweetSchema.index({ created_at: -1 });
tweetSchema.index({ 'author.id': 1 });
tweetSchema.index({ categories: 1 });
tweetSchema.index({ tags: 1 });
tweetSchema.index({ processed_at: -1 });
tweetSchema.index({ 'author_ranking.author_points': -1 });
tweetSchema.index({ 'author_ranking.last_updated': -1 });

// Export the schema for use with specific connection
export { tweetSchema };

// Create the model only if it doesn't already exist
// This prevents errors when the model is imported multiple times
const Tweet = mongoose.models.Tweet || mongoose.model('Tweet', tweetSchema);

export default Tweet; 