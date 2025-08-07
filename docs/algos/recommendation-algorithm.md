# Tweet Recommendation Algorithm

This document outlines the recommendation algorithm strategy for our tweet display system, including sentiment analysis and implementation details.

## Core Components

### 1. Data Model (Mongoose)

```javascript
// Tweet Schema
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

// User Interaction Schema (for tracking engagement)
const interactionSchema = new mongoose.Schema({
  userId: String,         // User ID
  tweetId: String,        // Tweet ID
  interactionType: String, // view, click, share, etc.
  timestamp: Date,        // When interaction occurred
  duration: Number,       // Time spent (for views)
  sentiment: Number       // User's sentiment toward content (optional)
});

// User Profile Schema (for personalization)
const userProfileSchema = new mongoose.Schema({
  userId: String,         // User ID
  preferences: {          // Learned preferences
    categories: Map,      // Map of category to weight
    tags: Map,            // Map of tag to weight
    authors: Map,         // Map of author to weight
    sentimentBias: Number // Preference for positive/negative content
  },
  history: [String]       // Recent tweet IDs viewed
});
```

### 2. Recommendation Algorithm Approaches

#### Content-Based Filtering

Recommends tweets similar to what the user has engaged with before.

```javascript
async function getContentBasedRecommendations(userId, limit = 10) {
  // Get user preferences
  const userProfile = await UserProfile.findOne({ userId });
  
  // Build query based on preferences
  const query = {
    $or: []
  };
  
  // Add category preferences
  if (userProfile.preferences.categories.size > 0) {
    const categoryWeights = [...userProfile.preferences.categories.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
      
    query.$or.push({
      category: { $in: categoryWeights.map(([cat]) => cat) }
    });
  }
  
  // Add tag preferences
  if (userProfile.preferences.tags.size > 0) {
    const tagWeights = [...userProfile.preferences.tags.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
      
    query.$or.push({
      tag: { $in: tagWeights.map(([tag]) => tag) }
    });
  }
  
  // Exclude recently viewed tweets
  query._id = { $nin: userProfile.history };
  
  // Get recommendations
  return Tweet.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);
}
```

#### Collaborative Filtering (K-Nearest Neighbors)

Recommends tweets that similar users have engaged with.

```javascript
async function getCollaborativeRecommendations(userId, limit = 10) {
  // Get user's interactions
  const userInteractions = await Interaction.find({ userId });
  
  // Find similar users (KNN algorithm)
  const similarUsers = await findSimilarUsers(userId, userInteractions);
  
  // Get tweets that similar users engaged with
  const similarUserIds = similarUsers.map(user => user.userId);
  const similarUserInteractions = await Interaction.find({
    userId: { $in: similarUserIds },
    interactionType: 'positive' // Only positive interactions
  });
  
  // Get unique tweet IDs from similar users
  const tweetIds = [...new Set(similarUserInteractions.map(i => i.tweetId))];
  
  // Filter out tweets the user has already seen
  const userViewedTweetIds = userInteractions.map(i => i.tweetId);
  const newTweetIds = tweetIds.filter(id => !userViewedTweetIds.includes(id));
  
  // Get and return tweets
  return Tweet.find({ _id: { $in: newTweetIds } })
    .sort({ authorFollowers: -1 }) // Sort by popularity
    .limit(limit);
}
```

#### Hybrid Approach

Combines content-based, collaborative filtering, and other signals.

```javascript
async function getHybridRecommendations(userId, limit = 20) {
  // Get both types of recommendations
  const contentRecs = await getContentBasedRecommendations(userId, limit/2);
  const collabRecs = await getCollaborativeRecommendations(userId, limit/2);
  
  // Combine and deduplicate
  const allRecs = [...contentRecs, ...collabRecs];
  const uniqueRecs = allRecs.filter((tweet, index, self) => 
    index === self.findIndex(t => t._id === tweet._id)
  );
  
  // Score and rank tweets
  const scoredRecs = await scoreAndRankTweets(uniqueRecs, userId);
  
  return scoredRecs.slice(0, limit);
}
```

### 3. Sentiment Analysis

Sentiment analysis evaluates the emotional tone of tweet content.

#### How Sentiment Analysis Works

The `sentiment` npm package uses a dictionary-based approach:

```javascript
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

function analyzeTweetSentiment(tweet) {
  const result = sentiment.analyze(tweet.text);
  return {
    score: result.score,             // Overall sentiment (-5 to +5)
    comparative: result.comparative, // Normalized by text length
    positive: result.positive,       // Positive words found
    negative: result.negative        // Negative words found
  };
}
```

#### Under the Hood

1. **Dictionary Lookup**: Each word is looked up in a pre-built dictionary of words with sentiment scores
2. **Score Aggregation**: Individual word scores are summed
3. **Negation Handling**: Words like "not" invert the sentiment of following words
4. **Intensifiers**: Words like "very" amplify sentiment scores

Example dictionary (simplified):
```javascript
{
  'love': 3,
  'hate': -3,
  'amazing': 2,
  'terrible': -2,
  'good': 1,
  'bad': -1
}
```

#### Using Sentiment in Recommendations

```javascript
function scoreTweetWithSentiment(tweet, userProfile) {
  // Analyze tweet sentiment
  const sentimentResult = analyzeTweetSentiment(tweet);
  
  // Base score from engagement potential
  let score = tweet.authorFollowers * 0.01;
  
  // Adjust based on user's sentiment preference
  const sentimentBias = userProfile.preferences.sentimentBias || 0;
  
  // If user prefers positive content and tweet is positive
  if (sentimentBias > 0 && sentimentResult.score > 0) {
    score *= (1 + sentimentBias * 0.2);
  } 
  // If user prefers negative content and tweet is negative
  else if (sentimentBias < 0 && sentimentResult.score < 0) {
    score *= (1 + Math.abs(sentimentBias) * 0.2);
  }
  
  return score;
}
```

### 4. Temporal Decay

Newer content gets higher priority.

```javascript
function applyTemporalDecay(tweet, baseScore) {
  const now = new Date();
  const tweetAge = (now - tweet.createdAt) / (1000 * 60 * 60); // Age in hours
  
  // Decay function: half-life of 24 hours
  const decayFactor = Math.pow(0.5, tweetAge / 24);
  
  return baseScore * decayFactor;
}
```

### 5. Diversity Injection

Avoid filter bubbles by introducing diverse content.

```javascript
function injectDiversity(recommendations, userId, limit = 20) {
  // 80% personalized recommendations
  const personalizedCount = Math.floor(limit * 0.8);
  const personalizedRecs = recommendations.slice(0, personalizedCount);
  
  // 20% diverse recommendations
  const diverseCount = limit - personalizedCount;
  const diverseRecs = getRandomHighQualityTweets(diverseCount);
  
  // Combine and shuffle slightly
  return shuffleArray([...personalizedRecs, ...diverseRecs]);
}
```

## Implementation Roadmap

1. **Basic Setup**
   - MongoDB connection with Mongoose
   - Tweet fetching API

2. **User Interaction Tracking**
   - Track views, clicks, time spent
   - Build user profiles

3. **Simple Ranking**
   - Sort by recency and engagement
   - Apply basic filtering

4. **Content Analysis**
   - Implement sentiment analysis
   - Extract topics and entities

5. **Personalization**
   - Implement content-based filtering
   - Add collaborative filtering
   - Build hybrid approach

6. **Optimization**
   - Add caching layer (Redis)
   - Pre-compute recommendations
   - A/B testing framework

## Required NPM Packages

```bash
# Core database and recommendation
npm install mongoose
npm install ml-knn
npm install ml-matrix

# Content analysis
npm install natural
npm install sentiment
npm install compromise

# Caching and performance
npm install redis ioredis
npm install node-cron

# Optional ML enhancements
npm install brain.js
npm install @tensorflow/tfjs-node
```

## Facebook-Style Algorithm Components

Based on research, Facebook's recommendation system uses:

1. **Graph-based relationships** - connections between users, content, and interactions
2. **Engagement signals** - likes, comments, shares, time spent
3. **User affinity scores** - how close users are to content creators
4. **Content quality scores** - based on engagement and reporting
5. **Recency factor** - newer content gets priority
6. **Session-based adjustments** - what the user is currently engaging with

## Twitter SimClusters Approach

Twitter's open-source algorithm uses:

1. **SimClusters** - grouping users with similar interests
2. **Embedding vectors** - representing users and tweets in high-dimensional space
3. **Producer-consumer model** - matching content producers with interested consumers
4. **Engagement prediction** - forecasting likelihood of positive interaction

## References

1. [Facebook Friend Suggestion Algorithm](https://medium.com/@shreyash9m/facebook-friend-suggestion-algorithm-ff9319e2ad7f)
2. [Twitter's Algorithm (SimClusters)](https://github.com/twitter/the-algorithm/blob/main/src/scala/com/twitter/simclusters_v2/README.md)
3. [Sentiment Analysis NPM Package](https://www.npmjs.com/package/sentiment)
4. [KNN Algorithm for Recommendations](https://learn.g2.com/k-nearest-neighbor) 