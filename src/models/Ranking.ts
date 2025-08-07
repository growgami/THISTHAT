import mongoose from 'mongoose';

// Define the Author Points schema for ranking system
const authorPointsSchema = new mongoose.Schema({
  author_id: { 
    type: String, 
    required: true,
    unique: true
  },
  author_name: { 
    type: String, 
    required: true 
  },
  author_username: { 
    type: String, 
    required: true 
  },
  author_pfp: { 
    type: String, 
    required: false // Optional field for profile picture URL
  },
  points: { 
    type: Number, 
    default: 0 
  },
  last_updated: { 
    type: Date, 
    default: Date.now 
  }
}, {
  collection: process.env.RANKING_MONGODB_COLLECTION
});

// Create and export the Ranking model
const Ranking = mongoose.models.Ranking || mongoose.model('Ranking', authorPointsSchema);

export { Ranking };
export default Ranking;