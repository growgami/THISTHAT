import { useQuery } from '@tanstack/react-query';

// Interface for individual ranking item based on author points from ranking database
export interface RankerItem {
  id: string; // MongoDB _id as string
  name: string; // author_name
  handle: string; // author_username
  score: number; // points accumulated
  rank: number; // calculated rank based on points
  author_pfp?: string; // profile picture (may not be available in ranking collection)
  author_followers?: number; // follower count (may not be available in ranking collection)
  tweet_count?: number; // not available in ranking collection
}

// Response interface for rankings API
export interface RankingsResponse {
  rankings: RankerItem[];
}

/**
 * Hook to fetch author rankings from the ranking database
 * Authors are ranked by their accumulated points in descending order
 * 
 * @param limit - Maximum number of rankings to fetch (default: 50)
 * @returns Query result with rankings data, loading state, and error handling
 */
export function useRankings(limit: number = 50) {
  return useQuery({
    queryKey: ['rankings', limit],
    queryFn: async (): Promise<RankingsResponse> => {
      console.log(`Fetching top ${limit} author rankings by points...`);
      
      const response = await fetch(`/api/rankings?limit=${limit}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Rankings API error:', response.status, errorText);
        throw new Error(`Failed to fetch rankings: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched ${data.rankings?.length || 0} rankings`);
      
      return data;
    },
    staleTime: 0, // Always consider data stale so it refetches on mount
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Always refetch when component mounts
    retry: 3, // Retry failed requests up to 3 times
  });
}
