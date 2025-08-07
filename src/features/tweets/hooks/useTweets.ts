import { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Tweet } from '@/types/tweet';

export function useTweets() {
  const [currentTweetIndex, setCurrentTweetIndex] = useState(0);
  const [mode, setMode] = useState<'preference' | 'explore'>('preference');
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [excludeIds, setExcludeIds] = useState<string[]>([]);

  // Fetch tweets from API using TanStack Query's infinite query
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<Tweet[], Error>({
    queryKey: ['tweets', mode, mode === 'explore' ? excludeIds.join(',') : ''],
    queryFn: async () => {
      const limit = 10;
      console.log(`Fetching ${mode} random tweets with limit:`, limit);
      
      // For random tweets, we don't use skip/next page pattern
      // Instead, we fetch a new batch of random tweets each time
      const params = new URLSearchParams({ limit: String(limit), random: 'true', mode });
      if (mode === 'explore' && excludeIds.length > 0) {
        // Limit exclude list to a safe size to avoid URL length issues
        const excludeSlice = excludeIds.slice(-500);
        params.set('excludeIds', excludeSlice.join(','));
      }
      const response = await fetch(`/api/tweets?${params.toString()}`);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch tweets');
      }
      const data = await response.json();
      console.log('Received tweets:', data.tweets?.length || 0);
      return data.tweets || [];
    },
    getNextPageParam: (lastPage: Tweet[], allPages: Tweet[][]) => {
      // If no tweets returned, stop fetching more pages for this mode
      if (!lastPage || lastPage.length === 0) return undefined;
      // Otherwise fetch a new batch
      return allPages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Flatten all pages into a single array, memoized to avoid unstable dependencies
  const tweets = useMemo(() => (data?.pages.flat() || []), [data?.pages]);

  // Track seen tweet IDs for the currently displayed pair during preference mode only
  useEffect(() => {
    if (mode !== 'preference') return;
    const first = tweets[currentTweetIndex]?._id;
    const second = tweets[currentTweetIndex + 1]?._id;
    const toAdd = [first, second].filter(Boolean) as string[];
    if (toAdd.length === 0) return;
    setSeenIds(prev => new Set([...prev, ...toAdd]));
  }, [mode, currentTweetIndex, tweets]);

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

  // Determine if preference feed is exhausted (no next page and no more items to advance)
  const isPreferenceExhausted = useMemo(() => {
    if (mode !== 'preference') return false;
    // When fewer than 2 tweets are available to display and we're not fetching more, consider exhausted
    return currentTweets.length < 2 && !isFetchingNextPage;
  }, [mode, currentTweets.length, isFetchingNextPage]);

  const startExplore = () => {
    // Snapshot seenIds into excludeIds and switch mode
    const ids = Array.from(seenIds);
    setExcludeIds(ids);
    setMode('explore');
    setCurrentTweetIndex(0);
  };

  const isExploring = mode === 'explore';

  return {
    tweets,
    currentTweets,
    currentTweetIndex,
    isLoading,
    isFetchingNextPage,
    error,
    handleNext,
    isPreferenceExhausted,
    startExplore,
    isExploring,
  };
}
