import { useState } from 'react';

interface AuthorData {
  author_id: string;
  author_username: string;
  author_name: string;
  author_pfp?: string; // Optional profile picture URL
}

/**
 * Hook for managing author ranking functionality
 * Handles awarding points to authors when their tweets are selected
 */
export function useRanking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Award points to an author when their tweet is selected
   * @param authorData - The author information
   */
  const awardAuthorPoints = async (authorData: AuthorData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authorData),
      });

      if (!response.ok) {
        // Try to get the error details from the response
        let errorDetails;
        try {
          errorDetails = await response.json();
        } catch {
          errorDetails = { error: response.statusText };
        }
        
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorDetails
        });
        
        throw new Error(`Failed to award points: ${response.status} ${response.statusText}. ${errorDetails.error || ''}`);
      }

      const result = await response.json();
      if (!result.success) {
        console.error('API Success=false Response:', result);
        throw new Error(result.error || 'Failed to award author points');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to award author points';
      setError(errorMessage);
      console.error('Error awarding author points:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    awardAuthorPoints,
    isLoading,
    error
  };
}

export default useRanking;
