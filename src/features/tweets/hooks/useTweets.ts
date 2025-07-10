import { useState, useEffect } from 'react';
import { Tweet } from '@/types/tweet';

export function useTweets() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [currentTweetIndex, setCurrentTweetIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tweets from API
  useEffect(() => {
    async function fetchTweets() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/tweets?limit=20');
        const data = await response.json();
        
        if (data.tweets && data.tweets.length > 0) {
          setTweets(data.tweets);
        }
      } catch (error) {
        console.error('Error fetching tweets:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTweets();
  }, []);

  // Handle next tweets (move by 2)
  const handleNext = () => {
    setCurrentTweetIndex(prev => 
      prev + 2 < tweets.length ? prev + 2 : 0
    );
  };

  // Current tweets (return two tweets)
  const currentTweets = [
    tweets[currentTweetIndex],
    tweets[currentTweetIndex + 1]
  ].filter(Boolean); // Remove undefined tweets

  return {
    tweets,
    currentTweets,
    currentTweetIndex,
    isLoading,
    handleNext
  };
}
