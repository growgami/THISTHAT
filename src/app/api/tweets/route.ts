import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { tweetSchema } from '@/models/Tweet';
import { TweetQuery } from '@/types/tweet';

export async function GET(request: Request) {
  try {
    // Connect to the database
    const connection = await connectToDatabase();
    
    // Create the Tweet model using the specific connection
    const Tweet = connection.models.Tweet || connection.model('Tweet', tweetSchema);
    
    // Parse URL to get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    
    console.log('API Request:', { limit, skip, category, tag });
    
    // Build query with proper typing
    const query: TweetQuery = {};
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tag = tag;
    }
    
    // Fetch tweets
    const tweets = await Tweet.find(query)
      .sort({ created_at: -1 }) // Most recent first
      .skip(skip)
      .limit(limit);
    
    console.log(`Fetched ${tweets.length} tweets (skip: ${skip}, limit: ${limit})`);
    
    // Return the tweets
    return NextResponse.json({ tweets });
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tweets' },
      { status: 500 }
    );
  }
}
