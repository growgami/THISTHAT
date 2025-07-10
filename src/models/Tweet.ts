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
  }
}, {
  // This ensures the model uses the collection name specified here
  collection: 'tweets'
  // Removed toJSON transform for camelCase normalization
});

// Create the model only if it doesn't already exist
// This prevents errors when the model is imported multiple times
const Tweet = mongoose.models.Tweet || mongoose.model('Tweet', tweetSchema);

export default Tweet; 