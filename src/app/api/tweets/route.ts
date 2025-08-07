import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { tweetSchema } from '@/models/Tweet';
import type { PipelineStage } from 'mongoose';
import { Types } from 'mongoose';
import { getAuthSession } from '@/features/auth/lib/auth';
import {
  connectToUserPreferencesDatabase,
  findUserPreferenceByUserId,
} from '@/models/UserPreference';

export async function GET(request: Request) {
  try {
    // Connect to the database
    const connection = await connectToDatabase();
    
    // Create the Tweet model using the specific connection
    const Tweet = connection.models.Tweet || connection.model('Tweet', tweetSchema);
    
    // Get session user
    const session = await getAuthSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    // Connect to UserPreference DB and load preferences
    await connectToUserPreferencesDatabase();
    const userPref = await findUserPreferenceByUserId(userId);

    const preferredCategories = Object.entries(userPref?.categoryPreferences || {})
      .filter(([, weight]) => (weight as number) > 0)
      .map(([name]) => name);
    const preferredTags = Object.entries(userPref?.tagPreferences || {})
      .filter(([, weight]) => (weight as number) > 0)
      .map(([name]) => name);

    // Parse URL to get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const mode = (searchParams.get('mode') || 'preference').toLowerCase();
    const excludeIdsParam = searchParams.get('excludeIds');
    const excludeIds = excludeIdsParam ? excludeIdsParam.split(',').filter(Boolean) : [];
    const excludeObjectIds = excludeIds
      .filter((id) => /^[a-fA-F0-9]{24}$/.test(id))
      .map((id) => new Types.ObjectId(id));
    
    console.log('API Request:', { limit, skip, category, tag, userId, preferredCategoriesCount: preferredCategories.length, preferredTagsCount: preferredTags.length });
    
    if (mode !== 'explore' && !category && !tag && preferredCategories.length === 0 && preferredTags.length === 0) {
      console.log('No user preferences found and no explicit filters provided. Returning empty tweets array.');
      return NextResponse.json({ tweets: [] });
    }

    // Build OR-based filters for preferences
    const orFilters: Record<string, unknown>[] = [];
    if (preferredCategories.length > 0) {
      orFilters.push(
        { category: { $in: preferredCategories } },
        { categories: { $in: preferredCategories } },
      );
    }
    if (preferredTags.length > 0) {
      orFilters.push(
        { tag: { $in: preferredTags } },
        { tags: { $in: preferredTags } },
      );
    }

    // Explicit query params narrow the results further (AND with overall match)
    const andNarrow: Record<string, unknown>[] = [];
    if (category) {
      andNarrow.push({ $or: [{ category }, { categories: category }] });
    }
    if (tag) {
      andNarrow.push({ $or: [{ tag }, { tags: tag }] });
    }
    if (excludeObjectIds.length > 0) {
      andNarrow.push({ _id: { $nin: excludeObjectIds } });
    }

    let matchStage: Record<string, unknown> = {};
    if (mode === 'explore') {
      // Explore: fetch all random tweets, only applying explicit narrows and excludeIds
      matchStage = andNarrow.length > 0 ? { $and: andNarrow } : {};
    } else {
      // Default: INCLUDE tweets matching user preferences (union)
      matchStage = orFilters.length > 0
        ? (andNarrow.length > 0 ? { $and: [{ $or: orFilters }, ...andNarrow] } : { $or: orFilters })
        : (andNarrow.length > 0 ? { $and: andNarrow } : {});
    }

    // Build aggregation to prioritize tag-matching tweets first, then category matches, then recency
    const tagPreferredExpr = {
      $cond: [
        {
          $or: [
            { $in: ['$tag', preferredTags] },
            { $gt: [{ $size: { $setIntersection: [ { $ifNull: ['$tags', []] }, preferredTags ] } }, 0] }
          ]
        },
        1,
        0
      ]
    } as const;

    const categoryPreferredExpr = {
      $cond: [
        {
          $or: [
            { $in: ['$category', preferredCategories] },
            { $gt: [{ $size: { $setIntersection: [ { $ifNull: ['$categories', []] }, preferredCategories ] } }, 0] }
          ]
        },
        1,
        0
      ]
    } as const;

    const random = searchParams.get('random') === 'true';

    // Aggregation pipeline
    const pipeline: PipelineStage[] = [
      { $match: matchStage } as PipelineStage,
      { $addFields: { tagPreferred: tagPreferredExpr, categoryPreferred: categoryPreferredExpr } } as PipelineStage,
    ];

    if (random) {
      pipeline.push({ $addFields: { rand: { $rand: {} } } } as PipelineStage);
    }

    // Sort: tagPreferred desc, then categoryPreferred desc, then recency, with optional random tiebreaker
    let sortStage: Record<string, 1 | -1>;
    if (mode === 'explore') {
      sortStage = random ? { rand: 1, created_at: -1 } : { created_at: -1 };
    } else {
      sortStage = random
        ? { tagPreferred: -1, categoryPreferred: -1, rand: 1, created_at: -1 }
        : { tagPreferred: -1, categoryPreferred: -1, created_at: -1 };
    }
    pipeline.push({ $sort: sortStage } as PipelineStage);

    if (!random && skip > 0) {
      pipeline.push({ $skip: skip } as PipelineStage);
    }
    pipeline.push({ $limit: limit } as PipelineStage);

    const tweets = await Tweet.aggregate(pipeline);

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
