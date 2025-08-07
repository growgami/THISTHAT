import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface CategoryPreferences {
  [categoryName: string]: number; // Category name to preference weight
}

interface TagPreferences {
  [tagName: string]: number; // Tag name to preference weight
}

interface UserPreferences {
  categoryPreferences: CategoryPreferences;
  tagPreferences: TagPreferences;
}

interface UseUserPreferencesReturn {
  savePreferences: (categories: string[], tags: Record<string, string[]>) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useUserPreferences(): UseUserPreferencesReturn {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const savePreferences = async (categories: string[], tags: Record<string, string[]>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate user is authenticated
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }
      
      // Transform categories and tags into preference weights
      const categoryPreferences: CategoryPreferences = {};
      categories.forEach(category => {
        categoryPreferences[category] = 1; // Base weight
      });
      
      const tagPreferences: TagPreferences = {};
      Object.entries(tags).forEach(([category, categoryTags]) => {
        categoryTags.forEach(tag => {
          // Higher weight for tags (2) than categories (1)
          tagPreferences[`${category}:${tag}`] = 2;
        });
      });
      
      // Debugging: Log preferences data
      console.log('Sending preferences data:', { categories, tags, categoryPreferences, tagPreferences });
      
      // Additional debugging: Log the structure of tags
      console.log('Tags structure:', JSON.stringify(tags, null, 2));
      
      // Prepare the preferences object
      const preferences: UserPreferences = {
        categoryPreferences,
        tagPreferences
      };
      
      // Make API call to save preferences
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          username: session.user.name || 'Anonymous',
          preferences
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save preferences');
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error saving user preferences:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    savePreferences,
    isLoading,
    error
  };
}

export default useUserPreferences;