import { useState, useEffect } from 'react';

interface UserPreferenceDocument {
  _id?: string;
  user_id: string;
  username: string;
  categoryPreferences: Record<string, number>; // Category name to preference weight (1)
  tagPreferences: Record<string, number>; // Tag name to preference weight (2)
  pointsAwarded: number;
  lastAwardAt: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface UseUserPrefStateReturn {
  userPreferences: UserPreferenceDocument | null;
  isLoading: boolean;
  error: string | null;
  hasPreferences: boolean;
}

export function useUserPrefState(userId: string | null): UseUserPrefStateReturn {
  const [userPreferences, setUserPreferences] = useState<UserPreferenceDocument | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchUserPreferences = async () => {
      try {
        setIsLoading(true);
        // Fetch user preferences from API
        const response = await fetch(`/api/user/preferences?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user preferences');
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setUserPreferences(result.data);
        } else {
          // Set default empty preferences if none exist
          setUserPreferences({
            user_id: userId,
            username: '',
            categoryPreferences: {},
            tagPreferences: {},
            pointsAwarded: 0,
            lastAwardAt: new Date(0).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      } catch (err) {
        setError('Failed to fetch user preferences');
        console.error('Error fetching user preferences:', err);
        
        // Set default empty preferences on error
        setUserPreferences({
          user_id: userId || '',
          username: '',
          categoryPreferences: {},
          tagPreferences: {},
          pointsAwarded: 0,
          lastAwardAt: new Date(0).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPreferences();
  }, [userId]);

  // Check if user has any preferences set
  const hasPreferences = userPreferences && 
    ((userPreferences.categoryPreferences && Object.keys(userPreferences.categoryPreferences).length > 0) ||
     (userPreferences.tagPreferences && Object.keys(userPreferences.tagPreferences).length > 0));

  return {
    userPreferences,
    isLoading,
    error,
    hasPreferences: hasPreferences || false
  };
}

export default useUserPrefState;