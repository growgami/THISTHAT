import { NextRequest, NextResponse } from 'next/server';
import { connectToUserPreferencesDatabase, upsertUserPreference, findUserPreferenceByUserId } from '@/models/UserPreference';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { userId, username, preferences } = await request.json();
    
    // Debugging: Log received data
    console.log('Received preferences data:', { userId, username, preferences });
    
    // Additional debugging: Log the structure of preferences
    console.log('Preferences structure:', JSON.stringify(preferences, null, 2));
    
    // Validate required fields
    if (!userId || !username || !preferences) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, username, and preferences are required' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    await connectToUserPreferencesDatabase();
    
    // Transform preferences for the database model
    const categoryPreferences: Record<string, number> = {};
    const tagPreferences: Record<string, number> = {};
    
    // Process category preferences
    if (preferences.categoryPreferences) {
      Object.entries(preferences.categoryPreferences).forEach(([category, weight]) => {
        categoryPreferences[category] = Number(weight);
      });
    }
    
    // Debugging: Log category preferences
    console.log('Processed category preferences:', categoryPreferences);
    
    // Process tag preferences
    if (preferences.tagPreferences) {
      Object.entries(preferences.tagPreferences).forEach(([tag, weight]) => {
        tagPreferences[tag] = Number(weight);
      });
    }
    
    // Debugging: Log tag preferences
    console.log('Processed tag preferences:', tagPreferences);
    
    // Additional debugging: Log the original tag preferences from the request
    console.log('Original tag preferences from request:', preferences.tagPreferences);
    
    // Save preferences to database
    const result = await upsertUserPreference(userId, username, {
      categoryPreferences,
      tagPreferences,
      pointsAwarded: 0, // Initialize with 0 points
      lastAwardAt: new Date(0) // Initialize with epoch date
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Preferences saved successfully',
      data: result 
    });
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save user preferences' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    await connectToUserPreferencesDatabase();
    
    // Fetch user preferences
    const userPreferences = await findUserPreferenceByUserId(userId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Preferences fetched successfully',
      data: userPreferences
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user preferences' },
      { status: 500 }
    );
  }
}