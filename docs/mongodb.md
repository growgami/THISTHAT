# MongoDB Integration

This document outlines how our application integrates with MongoDB using Mongoose.

## Connection Setup

The connection to MongoDB is established using Mongoose in `src/lib/mongoose.js`. We use a connection caching mechanism to prevent multiple connections during development hot reloads.

```javascript
import mongoose from 'mongoose';

// Cache the mongoose connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // Connection logic...
}
```

## Environment Variables

The MongoDB connection string is stored in the `.env` file:

```
TWEETS_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

## Models

### Tweet Model

The Tweet model (`src/models/Tweet.js`) maps to the `tweets` collection in MongoDB:

```javascript
const tweetSchema = new mongoose.Schema({
  id: String,             // Tweet ID from CSV
  createdAt: Date,        // When tweet was created
  tweetUrl: String,       // URL to original tweet
  text: String,           // Tweet content
  category: String,       // Category/topic
  tag: String,            // Tag for filtering
  authorId: String,       // Twitter's author ID
  author: String,         // Author handle (username)
  authorName: String,     // Actual author display name
  authorPfp: String,      // Profile picture URL
  authorFollowers: Number // Follower count
});
```

## API Routes

### GET /api/tweets

Fetches tweets from the database with optional filtering:

- `limit`: Number of tweets to return (default: 10)
- `category`: Filter by category
- `tag`: Filter by tag

Example:
```
GET /api/tweets?limit=5&category=tech
```

## Frontend Integration

The TweetCard component fetches tweets from the API and displays them using the TwitterEmbed component:

```javascript
useEffect(() => {
  async function fetchTweets() {
    const response = await fetch('/api/tweets?limit=10');
    const data = await response.json();
    setTweets(data.tweets);
  }

  fetchTweets();
}, []);
```

## Future Enhancements

1. Add pagination support
2. Implement caching with Redis
3. Add user authentication and personalized recommendations
4. Implement the recommendation algorithm described in `recommendation-algorithm.md` 