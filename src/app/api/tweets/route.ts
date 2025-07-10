import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Tweet from '@/models/Tweet';
import { TweetQuery } from '@/types/tweet';

export async function GET(request: Request) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Parse URL to get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    
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
      .sort({ createdAt: -1 }) // Most recent first
      .limit(limit);
    
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
