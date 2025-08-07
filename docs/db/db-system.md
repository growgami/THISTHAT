mongodb
- tweets (content, metadata, author info, categories, tags)
- user_interactions (swipes, selections, engagement tracking)
- user_preferences (category weights, author preferences, recommendation state)
- content_vectors (tweet embeddings, similarity scores, topic classifications)
- recommendation_cache (personalized content suggestions, trending metrics)

postgres
- users (id, email, twitter_id, created_at, subscription_tier, status)
- user_profiles (user_id, display_name, avatar_url, bio, settings)
- credit_transactions (id, user_id, amount, type, description, timestamp)
- user_credits (user_id, current_balance, total_earned, total_spent)
- prediction_markets (id, creator_id, title, description, end_date, status)
- market_votes (market_id, user_id, option, credits_spent, timestamp)
- daily_user_stats (user_id, date, swipes_made, markets_created, credits_earned)
- content_performance (tweet_id, views, selections, shares, ranking_score)
- leaderboards (user_id, rank, score, category, period)
- referrals (referrer_id, referred_id, status, created_at, credits_awarded) 

# Database Schema Architecture

## PostgreSQL Schema (Relational Data)

### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    twitter_id VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    last_login TIMESTAMP,
    email_verified BOOLEAN DEFAULT false
);
```

### user_profiles
```sql
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    settings JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### user_credits
```sql
CREATE TABLE user_credits (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_balance INTEGER DEFAULT 0,
    total_earned INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### credit_transactions
```sql
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'spent', 'bonus', 'refund')),
    description TEXT,
    reference_id UUID, -- References to markets, referrals, etc.
    reference_type VARCHAR(50), -- 'market_vote', 'referral', 'daily_bonus', etc.
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);
```

### prediction_markets
```sql
CREATE TABLE prediction_markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    options JSONB NOT NULL, -- Array of voting options
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'resolved', 'cancelled')),
    resolution_data JSONB,
    total_volume INTEGER DEFAULT 0,
    participant_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### market_votes
```sql
CREATE TABLE market_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_id UUID NOT NULL REFERENCES prediction_markets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    option VARCHAR(100) NOT NULL,
    credits_spent INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(market_id, user_id) -- One vote per user per market
);
```

### daily_user_stats
```sql
CREATE TABLE daily_user_stats (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    swipes_made INTEGER DEFAULT 0,
    markets_created INTEGER DEFAULT 0,
    markets_participated INTEGER DEFAULT 0,
    credits_earned INTEGER DEFAULT 0,
    credits_spent INTEGER DEFAULT 0,
    engagement_score DECIMAL(5,2) DEFAULT 0,
    PRIMARY KEY (user_id, date)
);
```

### content_performance
```sql
CREATE TABLE content_performance (
    tweet_id VARCHAR(50) PRIMARY KEY,
    views INTEGER DEFAULT 0,
    selections INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    ranking_score DECIMAL(10,4) DEFAULT 0,
    engagement_rate DECIMAL(5,4) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);
```

### leaderboards
```sql
CREATE TABLE leaderboards (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    score INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
    period_start DATE NOT NULL,
    period_end DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, category, period, period_start)
);
```

### referrals
```sql
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id),
    referred_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    credits_awarded INTEGER DEFAULT 0,
    referral_code VARCHAR(20) UNIQUE,
    UNIQUE(referrer_id, referred_id)
);
```

## MongoDB Schema (Document Data)

### tweets
```javascript
{
  _id: ObjectId,
  tweet_id: String, // Twitter's unique ID
  content: {
    text: String,
    html: String,
    media: [{
      type: String, // 'image', 'video', 'gif'
      url: String,
      thumbnail_url: String,
      alt_text: String
    }],
    urls: [{
      url: String,
      expanded_url: String,
      display_url: String,
      title: String,
      description: String
    }]
  },
  author: {
    id: String,
    username: String,
    display_name: String,
    avatar_url: String,
    verified: Boolean,
    follower_count: Number,
    following_count: Number
  },
  metadata: {
    created_at: Date,
    retweet_count: Number,
    like_count: Number,
    reply_count: Number,
    quote_count: Number,
    language: String,
    source: String
  },
  categories: [String], // ['tech', 'ai', 'startup']
  tags: [String], // ['#AI', '#MachineLearning']
  sentiment: {
    score: Number, // -1 to 1
    magnitude: Number,
    label: String // 'positive', 'negative', 'neutral'
  },
  indexed_at: Date,
  last_updated: Date
}
```

### user_interactions
```javascript
{
  _id: ObjectId,
  user_id: String, // UUID from PostgreSQL
  tweet_id: String,
  interactions: [{
    type: String, // 'swipe_left', 'swipe_right', 'select', 'share', 'bookmark'
    timestamp: Date,
    context: {
      session_id: String,
      position_in_feed: Number,
      time_spent_viewing: Number, // milliseconds
      device_type: String,
      source: String // 'feed', 'search', 'recommendation'
    }
  }],
  engagement_metrics: {
    total_time_spent: Number,
    interaction_count: Number,
    last_interaction: Date,
    engagement_score: Number
  },
  created_at: Date,
  updated_at: Date
}
```

### user_preferences
```javascript
{
  _id: ObjectId,
  user_id: String, // UUID from PostgreSQL
  category_weights: {
    tech: Number,
    politics: Number,
    sports: Number,
    entertainment: Number,
    business: Number,
    science: Number,
    // ... other categories
  },
  author_preferences: {
    liked_authors: [{
      author_id: String,
      weight: Number,
      last_interaction: Date
    }],
    blocked_authors: [{
      author_id: String,
      blocked_at: Date,
      reason: String
    }]
  },
  content_filters: {
    min_follower_count: Number,
    exclude_retweets: Boolean,
    exclude_replies: Boolean,
    language_preferences: [String],
    content_types: [String] // ['text', 'image', 'video']
  },
  recommendation_state: {
    last_updated: Date,
    model_version: String,
    personalization_score: Number,
    cold_start_phase: Boolean
  },
  created_at: Date,
  updated_at: Date
}
```

### content_vectors
```javascript
{
  _id: ObjectId,
  tweet_id: String,
  embeddings: {
    text_vector: [Number], // Dense vector representation
    image_vectors: [[Number]], // Array of image embeddings
    combined_vector: [Number] // Multimodal embedding
  },
  similarity_scores: {
    cluster_id: String,
    topic_scores: {
      topic_1: Number,
      topic_2: Number,
      // ... other topics
    },
    semantic_hash: String
  },
  topic_classifications: [{
    topic: String,
    confidence: Number,
    model_version: String
  }],
  processing_metadata: {
    model_version: String,
    processed_at: Date,
    processing_time_ms: Number,
    quality_score: Number
  },
  created_at: Date,
  updated_at: Date
}
```

### recommendation_cache
```javascript
{
  _id: ObjectId,
  user_id: String, // UUID from PostgreSQL
  recommendations: [{
    tweet_id: String,
    score: Number,
    reasoning: {
      factors: [String], // ['category_match', 'author_preference', 'trending']
      weights: [Number],
      explanation: String
    },
    position: Number,
    generated_at: Date,
    expires_at: Date
  }],
  trending_metrics: {
    global_trending: [{
      topic: String,
      score: Number,
      tweet_count: Number,
      growth_rate: Number
    }],
    personalized_trending: [{
      topic: String,
      relevance_score: Number,
      user_interest_score: Number
    }]
  },
  cache_metadata: {
    generated_at: Date,
    expires_at: Date,
    model_version: String,
    cache_hit_count: Number,
    last_accessed: Date
  },
  created_at: Date,
  updated_at: Date
}
```

## Indexes and Performance Optimization

### PostgreSQL Indexes
```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_twitter_id ON users(twitter_id);
CREATE INDEX idx_users_status ON users(status);

-- Credit Transactions
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_timestamp ON credit_transactions(timestamp);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);

-- Prediction Markets
CREATE INDEX idx_prediction_markets_creator_id ON prediction_markets(creator_id);
CREATE INDEX idx_prediction_markets_status ON prediction_markets(status);
CREATE INDEX idx_prediction_markets_end_date ON prediction_markets(end_date);

-- Market Votes
CREATE INDEX idx_market_votes_market_id ON market_votes(market_id);
CREATE INDEX idx_market_votes_user_id ON market_votes(user_id);

-- Daily User Stats
CREATE INDEX idx_daily_user_stats_date ON daily_user_stats(date);

-- Leaderboards
CREATE INDEX idx_leaderboards_category_period ON leaderboards(category, period, period_start);
CREATE INDEX idx_leaderboards_rank ON leaderboards(rank);
```

### MongoDB Indexes
```javascript
// tweets collection
db.tweets.createIndex({ "tweet_id": 1 }, { unique: true });
db.tweets.createIndex({ "categories": 1 });
db.tweets.createIndex({ "author.id": 1 });
db.tweets.createIndex({ "metadata.created_at": -1 });
db.tweets.createIndex({ "tags": 1 });

// user_interactions collection
db.user_interactions.createIndex({ "user_id": 1, "tweet_id": 1 }, { unique: true });
db.user_interactions.createIndex({ "user_id": 1, "updated_at": -1 });
db.user_interactions.createIndex({ "tweet_id": 1 });

// user_preferences collection
db.user_preferences.createIndex({ "user_id": 1 }, { unique: true });

// content_vectors collection
db.content_vectors.createIndex({ "tweet_id": 1 }, { unique: true });
db.content_vectors.createIndex({ "similarity_scores.cluster_id": 1 });

// recommendation_cache collection
db.recommendation_cache.createIndex({ "user_id": 1 }, { unique: true });
db.recommendation_cache.createIndex({ "cache_metadata.expires_at": 1 });