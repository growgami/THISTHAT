import { useQuery } from '@tanstack/react-query';

export interface RankerItem {
  id: number;
  name: string;
  handle: string;
  score: number;
  rank: number;
  author_pfp?: string;
  author_followers?: number;
  tweet_count?: number;
}

export interface RankingsResponse {
  rankings: RankerItem[];
}

export function useRankings(limit: number = 50) {
  return useQuery({
    queryKey: ['rankings', limit],
    queryFn: async (): Promise<RankingsResponse> => {
      const response = await fetch(`/api/rankings?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch rankings');
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
