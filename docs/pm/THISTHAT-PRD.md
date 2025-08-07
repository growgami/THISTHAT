# THISTHAT - Product Requirements Document

## 1. Title and Overview

### 1.1 Document Title & Version
**Product Name:** THISTHAT – Social Tweet Versus Platform  
**Tagline:** 'RANK ANYTHING, COMPARE EVERYTHING'  
**Version:** 1.0  
**Date:** January 2025  
**Status:** Draft  

### 1.2 Product Summary
THISTHAT is a social content versus platform designed to transform how users interact with Twitter and TikTok (eventually) content. The app presents users with pairs of tweets in a swipeable, Tinder-style interface that enables quick preference signaling. Through this interaction model, users can easily discover and curate high-quality social content.

**The end goal is it is a MORE FUN way to interact and discover X content AND people can COMPARE between categories, PEOPLE and tweets, not just content.**

**END OUTCOMES:**
- Massive virality
- People like comparing and making markets and ADDING themselves to markets
- People refer others
- People SHARE comparison tables like the reference one linked https://x.com/JasonYanowitz/status/1939699779552121262
- Cheap to run, pragmatic architecture that can SCALE as needed
- INVITE based onboarding for KOLs to use and then inviting other users
- COMPARE ARTICLES, PROFILES, VCS, DEFI, LENDING etc all the categories in crypto

**Key features include:**
- Real-time rankings of content creators, profiles and content
- Personalized collections based on preferences
- Intelligent recommendation algorithms for content relevance
- A credit-based economy that fuels engagement and content voting
- **We should allow unlimited swiping but super swipes should be paid. Maximum virality.**
- Custom voting markets for deeper community involvement
- A reward system that enables users to monetize through participation and content influence

## 2. User Personas

### 2.1 Primary User Types

**1. Social Media Enthusiast**
- Age Range: 18–35
- Behavior: Frequently active on social platforms
- Motivations: Seeks high-quality content and streamlined discovery
- Needs: Fast, engaging content experiences; enjoys finding new creators and trends

**2. Content Creator**
- Age Range: 22–45
- Behavior: Actively posts and engages on Twitter/X
- Motivations: Understands audience preferences and trends
- Needs: Analytics, trend discovery, and content performance insights

**3. Casual Browser**
- Age Range: 25–50
- Behavior: Light or occasional social media use
- Motivations: Leisure and information
- Needs: Simple, refined content without overwhelming volume

### 2.2 Goals & Pain Points

**User Goals**
- Discover high-quality, relevant tweets efficiently
- Provide feedback to improve recommendations
- Save and revisit favorite tweets in collections
- Follow trending creators and evolving content patterns

**Pain Points Addressed**
- Information Overload: Traditional feeds are noisy and overwhelming
- Curation Challenges: Users struggle to find consistently high-quality content
- Lack of Personalization: Feeds don't reflect user preferences well
- Time Inefficiency: Scrolling through endless content wastes time

## 3. Core Economic Systems

### 3.1 Credit System
THISTHAT's core interaction model is driven by a credit-based economy, designed to balance user engagement, platform utility, and monetization. Credits function as a soft currency within the app, enabling and limiting actions to encourage meaningful participation.

**Daily Credit Allocation**
- Users receive 10 credits daily, refreshed at midnight UTC
- Credits do not roll over to the next day
- New users receive a 20-credit welcome bonus
- Premium users may receive additional daily credits as part of their subscription benefits

**Credit Consumption**
- **Unlimited swipes and people get bonuses but they have to PAY to swipe more than once but this is limited too.** 1 credit is used per tweet swipe or selection
- 1 credit is consumed for each vote in a custom market
- Viewing full tweets is free, but making a selection costs 1 credit
- Creating a custom market requires 5 credits upfront
- **There has to be some kind of bonding curve mechanism where people can 'invest' in tweets SO that if they WIN in a ranking, they benefit.**

**Credit Acquisition**
- Daily allocation is the primary source
- Monetary purchase: $1 USD = 50 credits
- Market rewards for accurate predictions
- Referral rewards: 5 credits per successful referral
- Achievements and milestones unlock credit bonuses
- **Onramp and payment through crossmint / turnkey etc.**

### 3.2 Reward System
A comprehensive reward system recognizes and incentivizes quality engagement and platform contribution.

**Top 3 Recognition:**
- Daily, weekly, and monthly leaderboards
- Top 3 users receive premium benefits and recognition
- Exclusive badges and profile enhancements
- Monetary rewards for consistent top performance
- Priority access to new features and beta testing

**Custom Market Creation:**
- Users can create prediction markets on any topic
- Market creators set the parameters and voting duration
- Creators receive 10% commission on all votes cast
- Popular markets gain featured placement
- Market success contributes to user reputation score

**Achievement System:**
- Streak rewards for consecutive daily usage
- Milestone badges for interaction counts
- Special recognition for market accuracy
- Social sharing bonuses
- Content discovery achievements

## 4. Role-based Access

### 4.1 User Roles and Permissions

**Guest User**
- View tweet pairs without personalization
- Basic swipe/click interactions
- Access to public rankings
- Limited to 5 free interactions per day
- No collection saving capabilities
- Cannot participate in custom markets
- View-only access to leaderboards

**Registered User**
- Daily credit allocation (10 credits)
- Full personalized experience with recommendation engine
- Unlimited interactions within credit limits
- Personal collection management
- Profile customization and preference settings
- Access to detailed analytics and personal metrics
- Theme customization (dark/light mode)
- Create and participate in custom markets
- Eligible for rewards and achievements
- Purchase additional credits

**Premium User**
- Enhanced daily credit allocation (20 credits)
- Priority customer support
- Advanced analytics and insights
- Market creation tools with enhanced features
- Exclusive market categories
- Early access to new features
- Higher commission rates for market creation (15%)

**Admin User**
- Content moderation capabilities
- User management and analytics
- Platform configuration and settings
- Advanced analytics and reporting tools
- Credit system management
- Market oversight and regulation

## 5. User Stories

### US-001: Tweet Pair Viewing
**Title:** View Tweet Pairs for Comparison  
**Description:** As a user, I want to see two tweets side by side so I can compare and choose my preference.  
**Acceptance Criteria:**
- Two tweet cards are displayed simultaneously on desktop
- Tweets stack vertically on mobile devices
- Each tweet shows author info, profile picture, handle, and content
- Tweet text is truncated appropriately for card display
- Engagement metrics (likes, retweets) are visible
- Cards have hover effects and smooth animations

### US-002: Swipe Gesture Interaction (Mobile)
**Title:** Select Tweets via Swipe Gestures  
**Description:** As a mobile user, I want to swipe left or right to quickly select my preferred tweet.  
**Acceptance Criteria:**
- Left swipe selects the first (left) tweet
- Right swipe selects the second (right) tweet
- Visual feedback appears during swipe motion
- Swipe direction indicators show "FIRST" and "SECOND"
- Minimum swipe distance of 120px triggers selection
- Quick swipes (velocity > 500px/s) trigger with less distance
- Failed swipes snap back to original position

### US-003: Click/Tap Selection (Desktop)
**Title:** Select Tweets via Click Interaction
**Description:** As a desktop user, I want to click on a tweet card or the "$THIS" button to select my preference.  
**Acceptance Criteria:**
- Clicking anywhere on tweet card (except action area) selects it
- "$THIS" button provides explicit selection option
- Selected card shows "Selected!" feedback overlay
- Card becomes disabled after selection
- Smooth transition to next tweet pair after 600ms delay
- Hover effects enhance interactivity

### US-004: Full Tweet Viewing
**Title:** View Complete Tweet Content  
**Description:** As a user, I want to view the full tweet with all content and embeds when tweet text is truncated.  
**Acceptance Criteria:**
- "See full tweet" link appears on truncated tweets
- Clicking opens modal with embedded tweet
- Modal displays using Twitter's embed API
- Modal includes close button and "$THIS" selection option
- Selecting from modal counts as preference
- Modal is responsive and accessible

### US-005: Personalized Tweet Recommendations
**Title:** Receive Personalized Content Based on Preferences  
**Description:** As a registered user, I want to see tweets recommended based on my past selections and preferences.  
**Acceptance Criteria:**
- System tracks user interactions and preferences
- Content-based filtering considers categories, tags, and authors
- Recommendation algorithm weights recent interactions higher
- Diversity injection prevents filter bubbles (20% diverse content)
- User preferences persist across sessions
- Recommendation quality improves over time

### US-006: Author Rankings View
**Title:** View Creator Rankings and Statistics  
**Description:** As a user, I want to see which content creators are ranking highest based on engagement and metrics.  
**Acceptance Criteria:**
- Rankings page accessible via navigation
- Rankings calculated based on follower count and tweet frequency
- Top 3 creators displayed prominently with avatars
- Paginated list shows ranks 1-50+ with author details
- Each ranking entry shows: rank, author name, handle, score, avatar
- Rankings update dynamically based on latest data
- Smooth transitions when switching between pages

### US-007: Personal Collection Management
**Title:** Save and Manage Liked Tweets  
**Description:** As a registered user, I want to save tweets I've liked to a personal collection for later viewing.  
**Acceptance Criteria:**
- Collection page accessible via navigation
- Grid layout displays saved tweet previews
- Counter shows total number of saved tweets
- Clicking saved tweet opens full view modal
- Empty state message when no tweets saved
- Collection persists across user sessions
- Responsive grid adapts to screen size

### US-008: Theme Customization
**Title:** Switch Between Dark and Light Themes  
**Description:** As a user, I want to toggle between dark and light themes for comfortable viewing.  
**Acceptance Criteria:**
- Theme toggle button in navigation bar
- Smooth transitions between theme changes (300ms)
- Theme preference persists in localStorage
- All UI elements respect current theme
- High contrast ratios maintained for accessibility
- Default theme is dark mode

### US-009: Progressive Content Loading
**Title:** Continuous Content Discovery  
**Description:** As a user, I want new tweet pairs to load automatically so I can continue browsing without interruption.  
**Acceptance Criteria:**
- New tweet pairs load after current pair selection
- Batch loading of 20 tweets maintains smooth experience
- Loading states prevent user interaction during fetch
- Error handling for failed API requests
- Infinite scroll behavior for continuous discovery
- Performance optimization for large datasets

### US-010: Mobile-First Responsive Design
**Title:** Optimized Mobile Experience  
**Description:** As a mobile user, I want the interface optimized for touch interactions and small screens.  
**Acceptance Criteria:**
- Touch-friendly button sizes (minimum 44px)
- Swipe gestures work reliably on touch devices
- Mobile dock navigation for key features
- Optimized text sizing and spacing for mobile
- Reduced animation complexity on mobile
- Fast loading and smooth performance

### US-011: Credit Management System
**Title:** Daily Credit Allocation and Tracking  
**Description:** As a user, I want to receive and manage daily credits to interact with content on the platform.  
**Acceptance Criteria:**
- Users receive 10 credits daily at midnight UTC
- New users get 20 welcome bonus credits
- Credit balance displayed prominently in interface
- Credit consumption tracked for each interaction
- Warning notification when credits are low (≤2 remaining)
- Credit history log showing transactions
- Credits reset automatically without rollover

### US-012: Credit Purchase System
**Title:** Purchase Additional Credits  
**Description:** As a user, I want to purchase additional credits when my daily allocation is exhausted.  
**Acceptance Criteria:**
- Secure payment processing integration via crossmint/turnkey
- Multiple purchase tiers: $1=50, $5=300, $10=650 credits
- Immediate credit addition after successful payment
- Purchase confirmation and receipt generation
- Payment history accessible in user account
- Multiple payment methods supported (card, PayPal, digital wallets, crypto)
- Refund policy clearly stated

### US-013: Custom Market Creation
**Title:** Create Prediction Markets  
**Description:** As a user, I want to create custom voting markets on topics I'm interested in to engage community and earn commissions.  
**Acceptance Criteria:**
- Market creation interface with title, description, and options
- Market duration selector (1 hour to 30 days)
- Minimum 5 credit cost to create market
- Binary and multiple choice market types supported
- Market preview before publishing
- Creator earns 10% commission on all votes
- Market moderation and approval process
- Featured market promotion options

### US-014: Market Participation
**Title:** Vote in Custom Markets  
**Description:** As a user, I want to participate in prediction markets created by other users to engage with community predictions.  
**Acceptance Criteria:**
- Browse available markets by category and popularity
- Each vote costs 1 credit
- Vote confirmation dialog with market details
- Voting history tracked in user profile
- Real-time market results and statistics
- Payout calculation for winning votes
- Market resolution and reward distribution
- Dispute resolution mechanism for contested outcomes

### US-015: Leaderboard System
**Title:** Top 3 Recognition and Rankings  
**Description:** As a user, I want to see top performers and compete for recognition on daily, weekly, and monthly leaderboards.  
**Acceptance Criteria:**
- Three leaderboard timeframes: daily, weekly, monthly
- Ranking based on engagement score, market accuracy, and consistency
- Top 3 users prominently displayed with avatars and stats
- Badge system for different achievement levels
- Leaderboard history preservation
- Special rewards for top performers
- Fair play monitoring and anti-gaming measures

### US-016: Achievement System
**Title:** Unlock Achievements and Rewards  
**Description:** As a user, I want to unlock achievements for various activities to be recognized for my engagement and earn rewards.  
**Acceptance Criteria:**
- Multiple achievement categories: streaks, interactions, markets, social
- Progressive achievement levels (bronze, silver, gold, platinum)
- Achievement notification system with celebration animations
- Achievement showcase on user profile
- Bonus credit rewards for milestone achievements
- Rare achievement badges for exceptional performance
- Achievement sharing on social media
- Monthly achievement challenges and events

### US-017: Referral System
**Title:** Invite Friends and Earn Rewards  
**Description:** As a user, I want to invite friends to join the platform and receive bonus credits for successful referrals.  
**Acceptance Criteria:**
- Unique referral code generation for each user
- Multiple sharing options (email, social media, direct link)
- 5 credit bonus for each successful referral signup
- Additional bonus when referred user makes first purchase
- Referral tracking dashboard with statistics
- Referral leaderboard for top inviters
- Anti-fraud measures for referral abuse prevention

### US-018: Premium Subscription
**Title:** Premium User Benefits  
**Description:** As a user, I want to upgrade to premium for enhanced features and higher credit allocation.  
**Acceptance Criteria:**
- Monthly subscription model ($9.99/month)
- Double daily credits (20 instead of 10)
- Higher market creation commission (15% vs 10%)
- Priority customer support access
- Advanced analytics and insights dashboard
- Exclusive premium market categories
- Early access to beta features
- Premium badge display on profile

### US-019: Market Analytics Dashboard
**Title:** Track Market Performance  
**Description:** As a market creator, I want detailed analytics on my markets to understand performance and optimize future creations.  
**Acceptance Criteria:**
- Comprehensive market statistics (participants, accuracy, revenue)
- Performance trends over time
- Most popular market categories
- User engagement metrics
- Revenue tracking and payout history
- Market success recommendations
- Comparative analysis with similar markets
- Export functionality for detailed reports

### US-020: User Authentication and Sessions
**Title:** Secure User Registration and Login  
**Description:** As a user, I want to create an account and login securely to access personalized features.  
**Acceptance Criteria:**
- Email/password registration with validation
- Secure password requirements (8+ characters, mixed case, numbers)
- Email verification for new accounts
- Secure session management with JWT tokens
- Password reset functionality via email
- Account lockout after failed login attempts
- GDPR-compliant data handling

### US-021: Analytics and Metrics Dashboard
**Title:** Personal Engagement Analytics  
**Description:** As a registered user, I want to see my engagement statistics and preferences patterns.  
**Acceptance Criteria:**
- Daily streak counter for consecutive usage
- Total points/interactions given counter
- Most preferred content category identification
- Personal activity timeline and history
- Engagement patterns visualization
- Progress tracking and achievement badges
- Export capability for personal data

### US-022: Content Moderation and Reporting
**Title:** Report Inappropriate Content  
**Description:** As a user, I want to report tweets that violate community guidelines or contain inappropriate content.  
**Acceptance Criteria:**
- Report button accessible on all tweet views
- Multiple reporting categories (spam, harassment, etc.)
- Optional comment field for additional context
- Reported content flagged for review
- User feedback on report status
- Automatic content filtering for known violations

### US-023: Social Sharing Integration
**Title:** Share Comparison Tables and Rankings  
**Description:** As a user, I want to share comparison tables, rankings, and interesting content to drive virality and referrals.  
**Acceptance Criteria:**
- Share button on rankings, comparison tables, and full tweet views
- Multiple sharing options (Twitter/X, Facebook, LinkedIn, TikTok, copy link)
- Native social sharing APIs integration
- Custom sharing messages with THISTHAT attribution and "RANK ANYTHING, COMPARE EVERYTHING" branding
- Shareable comparison table graphics (similar to reference: https://x.com/JasonYanowitz/status/1939699779552121262)
- Share statistics tracking to measure virality
- Referral link integration for user acquisition
- Achievement rewards for successful viral shares

### US-024: Advanced Search and Filtering
**Title:** Search and Filter Content Across Categories  
**Description:** As a user, I want to search for specific content or filter by categories including articles, profiles, VCs, DeFi, lending, and crypto categories.  
**Acceptance Criteria:**
- Search bar accessible from main navigation
- Full-text search across tweet content, articles, and profiles
- Filter options: category (tweets, articles, profiles, VCs, DeFi, lending), tag, author, date range
- Crypto-specific category filters for comprehensive comparison
- Search result pagination and sorting
- Saved search functionality for registered users
- Search history for quick re-access
- Advanced operators (AND, OR, NOT) support

### US-025: Recommendation Algorithm Transparency
**Title:** Understand Content Recommendation Logic  
**Description:** As a user, I want to understand why certain content is recommended to me and control recommendation parameters.  
**Acceptance Criteria:**
- "Why this tweet?" explanation feature
- Recommendation preferences dashboard
- Ability to adjust algorithm weights (recency, popularity, similarity)
- Category preference sliders
- Option to reset recommendation profile
- Transparency report on data usage

### US-026: Tweet Investment & Bonding Curve
**Title:** Invest in Tweet Rankings  
**Description:** As a user, I want to invest credits in tweets I believe will perform well in rankings, with potential returns based on a bonding curve mechanism.  
**Acceptance Criteria:**
- Investment interface allowing users to "invest" credits in specific tweets
- Bonding curve pricing mechanism where early investors get better rates
- Return calculation based on tweet's final ranking performance
- Investment history and portfolio tracking
- Payout distribution when ranking periods close
- Risk disclosure and investment limits for responsible gambling
- Leaderboard for top investors and their ROI
- Market maker functionality to ensure liquidity

### US-027: Super Swipe Premium Feature
**Title:** Paid Super Swipes for Enhanced Engagement  
**Description:** As a user, I want to use super swipes for enhanced voting power while maintaining unlimited basic swiping for maximum virality.  
**Acceptance Criteria:**
- Unlimited basic swipes to maximize platform engagement
- Super swipe option with 2x or 3x voting weight
- Super swipe costs 5 credits (premium interaction)
- Limited super swipes per day even for paying users (e.g., 10 max)
- Visual distinction for super swipes vs regular swipes
- Super swipe impact shown in ranking calculations
- Achievement system for effective super swipe usage

### US-028: Invite-Only KOL Onboarding
**Title:** Key Opinion Leader Invitation System  
**Description:** As a platform admin, I want to manage invite-only onboarding for KOLs who can then invite other users to drive organic growth.  
**Acceptance Criteria:**
- Admin dashboard for KOL invitation management
- Custom invitation codes for verified KOLs
- KOL benefits: enhanced profile features, priority ranking, exclusive markets
- KOL invitation tracking and referral analytics
- Graduated public access after initial KOL seeding
- KOL performance metrics and engagement tracking
- Exclusive KOL-only features and early access programs

### US-029: Content Creator Analytics
**Title:** Analytics for Content Performance  
**Description:** As a content creator, I want to see how my tweets perform on the platform and understand audience preferences.  
**Acceptance Criteria:**
- Creator dashboard showing tweet performance metrics
- Selection rate statistics for posted content
- Audience preference insights and trends
- Comparative analysis with similar creators
- Performance improvement recommendations
- Export capability for analytics data

