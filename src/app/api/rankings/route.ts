import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Tweet from '@/models/Tweet';

export async function GET(request: Request) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Parse URL to get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    
    // Aggregate pipeline to get author rankings
    const rankings = await Tweet.aggregate([
      // Group by author to get metrics
      {
        $group: {
          _id: '$author',
          author_name: { $first: '$author_name' },
          author_pfp: { $first: '$author_pfp' },
          author_followers: { $first: '$author_followers' },
          tweet_count: { $sum: 1 },
          total_followers: { $max: '$author_followers' } // In case there are variations
        }
      },
      // Calculate a ranking score based on followers and tweet count
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ['$author_followers', 0.0001] }, // Follower weight (scaled down)
              { $multiply: ['$tweet_count', 10] } // Tweet count weight
            ]
          }
        }
      },
      // Sort by score in descending order
      { $sort: { score: -1 } },
      // Limit results
      { $limit: limit }
    ]);

    // Transform the data to match the expected RankerItem interface
    // Add ranks after the aggregation pipeline
    const transformedRankings = rankings.map((item, index) => ({
      id: index + 1,
      name: item.author_name,
      handle: item._id, // This is the author handle
      score: Math.min(item.score / 1000, 1), // Normalize score to 0-1 range
      rank: index + 1,
      author_pfp: item.author_pfp,
      author_followers: item.author_followers,
      tweet_count: item.tweet_count
    }));
    
    // Return the rankings
    return NextResponse.json({ rankings: transformedRankings });
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    );
  }
} 