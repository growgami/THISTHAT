import { NextResponse } from 'next/server';
import { connectToRankingDatabase } from '@/lib/mongoose';
import { Ranking } from '@/models/Ranking';

export async function GET(request: Request) {
  try {
    // Connect to the ranking database
    const rankingConnection = await connectToRankingDatabase();
    
    // Create the Ranking model using the specific connection
    const RankingModel = rankingConnection.models.Ranking || rankingConnection.model('Ranking', Ranking.schema);
    
    // Parse URL to get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    
    // Fetch rankings from the ranking collection, sorted by points (descending)
    const rankings = await RankingModel.find({})
      .sort({ points: -1 }) // Sort by points in descending order
      .limit(limit)
      .lean(); // Use lean() for better performance

    // Transform the data to match the expected RankerItem interface
    const transformedRankings = rankings.map((item, index) => ({
      id: item._id?.toString() || (index + 1).toString(),
      name: item.author_name || 'Unknown Author',
      handle: item.author_username || item.author || 'unknown',
      score: item.points || 0,
      rank: index + 1,
      author_pfp: item.author_pfp || undefined,
      author_followers: item.author_followers || undefined,
      tweet_count: undefined // Not available in ranking collection
    }));
    
    console.log(`Fetched ${transformedRankings.length} rankings from ranking database`);
    
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

export async function POST(request: Request) {
  try {
    // Connect to the ranking database
    const rankingConnection = await connectToRankingDatabase();
    
    // Create the Ranking model using the specific connection
    const RankingModel = rankingConnection.models.Ranking || rankingConnection.model('Ranking', Ranking.schema);
    
    // Parse the request body
    const body = await request.json();
    const { author_id, author_username, author_name, author_pfp } = body;
    
    // Debug: Log the received data
    console.log('Received ranking data:', body);
    
    // Validate required fields with detailed error messages
    const missingFields = [];
    if (!author_id) missingFields.push('author_id');
    if (!author_username) missingFields.push('author_username');
    if (!author_name) missingFields.push('author_name');
    
    if (missingFields.length > 0) {
      const errorMessage = `Missing required fields: ${missingFields.join(', ')}. Received: ${JSON.stringify(body)}`;
      console.error('Validation error:', errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
    
    // Additional validation for empty strings
    if (typeof author_id !== 'string' || author_id.trim() === '') {
      const errorMessage = 'author_id must be a non-empty string';
      console.error('Validation error:', errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
    
    if (typeof author_name !== 'string' || author_name.trim() === '') {
      const errorMessage = 'author_name must be a non-empty string';
      console.error('Validation error:', errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
    
    if (typeof author_username !== 'string' || author_username.trim() === '') {
      const errorMessage = 'author_username must be a non-empty string';
      console.error('Validation error:', errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
    
    // Update or create author ranking record
    // Use findOneAndUpdate with upsert to aggregate points per author
    const result = await RankingModel.findOneAndUpdate(
      { author_id }, // Find by author_id
      {
        $inc: { points: 1 }, // Increment points by 1
        $set: {
          author_username,
          author_name,
          author_pfp, // Include profile picture URL
          last_updated: new Date()
        }
      },
      {
        upsert: true, // Create if doesn't exist
        new: true, // Return the updated document
        runValidators: true
      }
    );
    
    console.log('Updated author ranking:', result);
    
    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating author points:', error);
    return NextResponse.json(
      { error: 'Failed to update author points' },
      { status: 500 }
    );
  }
}