import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Tweet } from '@/types/tweet';

export function useTweets() {
  const [currentTweetIndex, setCurrentTweetIndex] = useState(0);

  // Fetch tweets from API using TanStack Query's infinite query
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<Tweet[], Error>({
    queryKey: ['tweets'],
    queryFn: async ({ pageParam = 0 }) => {
      const skip = pageParam as number;
      const limit = 10;
      console.log('Fetching tweets with skip:', skip, 'limit:', limit);
      
      const response = await fetch(`/api/tweets?limit=${limit}&skip=${skip}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tweets');
      }
      const data = await response.json();
      console.log('Received tweets:', data.tweets?.length || 0);
      return data.tweets || [];
    },
    getNextPageParam: (lastPage: Tweet[], allPages: Tweet[][]) => {
      // Continue fetching if we got a full page (meaning there might be more)
      const TWEETS_PER_PAGE = 10;
      if (lastPage.length < TWEETS_PER_PAGE) {
        // No more pages if we got less than expected
        return undefined;
      }
      
      // Calculate the next skip value based on total tweets fetched so far
      const totalTweetsFetched = allPages.reduce((total, page) => total + page.length, 0);
      console.log('Next page skip will be:', totalTweetsFetched);
      return totalTweetsFetched;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Flatten all pages into a single array
  const tweets = data?.pages.flat() || [];

  // Handle next tweets (move by 2)
  const handleNext = () => {
    const nextIndex = currentTweetIndex + 2;
    
    console.log('handleNext called:', {
      currentIndex: currentTweetIndex,
      nextIndex,
      totalTweets: tweets.length,
      hasNextPage,
      isFetchingNextPage,
      tweetsRemaining: tweets.length - nextIndex
    });
    
    // Check if we need to fetch more tweets
    // When we have less than 6 tweets remaining from current position, fetch more
    const tweetsRemaining = tweets.length - nextIndex;
    if (tweetsRemaining <= 6 && hasNextPage && !isFetchingNextPage) {
      console.log('Fetching next page... (tweets remaining:', tweetsRemaining, ')');
      fetchNextPage();
    }
    
    // Only advance if we have tweets available
    if (nextIndex < tweets.length) {
      console.log('Advancing to index:', nextIndex);
      setCurrentTweetIndex(nextIndex);
    } else {
      console.log('Cannot advance - no more tweets available. Current:', currentTweetIndex, 'Total:', tweets.length);
      // If we've reached the end and no more pages, stay at current position
      // The user will see "no tweet" for the second card which indicates end
    }
  };

  // Current tweets (return two tweets)
  const currentTweets: Tweet[] = [
    tweets[currentTweetIndex],
    tweets[currentTweetIndex + 1]
  ].filter((tweet): tweet is Tweet => tweet !== undefined); // Remove undefined tweets

  return {
    tweets,
    currentTweets,
    currentTweetIndex,
    isLoading,
    isFetchingNextPage,
    error,
    handleNext
  };
}
