import { useState, useEffect } from 'react';

interface LoaderState {
  isLoading: boolean;
  progress: number;
  message: string;
}

export function useLoader() {
  const [loaderState, setLoaderState] = useState<LoaderState>({
    isLoading: true,
    progress: 0,
    message: 'Initializing...'
  });

  useEffect(() => {
    const loadApplication = async () => {
      try {
        // Step 1: Initialize application
        setLoaderState({
          isLoading: true,
          progress: 10,
          message: 'Starting application...'
        });

        await new Promise(resolve => setTimeout(resolve, 200));
        
        setLoaderState({
          isLoading: true,
          progress: 30,
          message: 'Connecting to server...'
        });

        // Step 2: Test API connection by fetching tweets
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setLoaderState({
          isLoading: true,
          progress: 50,
          message: 'Loading tweets...'
        });

        // Test the tweets API endpoint to ensure backend is working
        try {
          const response = await fetch('/api/tweets?limit=1');
          if (response.ok) {
            const data = await response.json();
            const tweetCount = data.tweets?.length || 0;
            setLoaderState({
              isLoading: true,
              progress: 60,
              message: `Loaded ${tweetCount} sample tweets`
            });
          } else {
            throw new Error(`API returned status ${response.status}`);
          }
        } catch (error) {
          console.error('Error testing tweets API:', error);
          // Continue loading even if this test fails
        }

        // Step 3: Warm up ranking database connection
        setLoaderState({
          isLoading: true,
          progress: 70,
          message: 'Initializing ranking system...'
        });

        try {
          // Warm up the ranking database connection by making a quick API call
          // This will establish the connection early so it's ready when needed
          await fetch('/api/rankings?limit=1');
          
          setLoaderState({
            isLoading: true,
            progress: 80,
            message: 'Ranking system ready'
          });
        } catch (error) {
          console.error('Error warming up ranking database:', error);
          // Continue loading even if this fails
        }

        // Step 4: Finalize loading
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setLoaderState({
          isLoading: false,
          progress: 100,
          message: 'Ready!'
        });
      } catch (error) {
        console.error('Error during application load:', error);
        setLoaderState({
          isLoading: false,
          progress: 100,
          message: 'Error during initialization'
        });
      }
    };

    loadApplication();
  }, []);

  return loaderState;
}
