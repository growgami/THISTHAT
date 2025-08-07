import { connectToDatabase } from '@/lib/mongoose';
import { Ranking } from '@/models/Ranking';

interface AuthorData {
  author_id: string;
  author_username: string;
  author_name: string;
}

/**
 * Event handler for when a tweet is selected/swiped
 * Awards 1 point to the author of the tweet
 * @param authorData - The author information
 */
export async function handleAuthorPoints(authorData: AuthorData): Promise<void> {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Find existing author record or create new one
    const existingAuthor = await Ranking.findOne({ author_id: authorData.author_id });
    
    if (existingAuthor) {
      // Update existing author's points
      await Ranking.updateOne(
        { author_id: authorData.author_id },
        { 
          $inc: { points: 1 },
          $set: { 
            author_username: authorData.author_username,
            author_name: authorData.author_name,
            last_updated: new Date() 
          }
        }
      );
    } else {
      // Create new author record
      await Ranking.create({
        author_id: authorData.author_id,
        author_username: authorData.author_username,
        author_name: authorData.author_name,
        points: 1,
        last_updated: new Date()
      });
    }
  } catch (error) {
    console.error('Error handling author points:', error);
    throw new Error('Failed to update author points');
  }
}

export default handleAuthorPoints;