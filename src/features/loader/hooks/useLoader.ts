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
              progress: 70,
              message: tweetCount > 0 ? 'Tweets loaded successfully' : 'Connected to database'
            });
          } else {
            throw new Error('API not responding');
          }
        } catch (apiError) {
          console.warn('Could not fetch tweets:', apiError);
          setLoaderState({
            isLoading: true,
            progress: 70,
            message: 'Loading offline mode...'
          });
        }

        // Step 3: Final setup
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setLoaderState({
          isLoading: true,
          progress: 90,
          message: 'Finalizing...'
        });

        // Small delay to show completion
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Complete loading
        setLoaderState({
          isLoading: false,
          progress: 100,
          message: 'Ready!'
        });
      } catch (error) {
        console.error('Error during loading:', error);
        setLoaderState({
          isLoading: false,
          progress: 100,
          message: 'Ready with errors'
        });
      }
    };

    loadApplication();
  }, []);

  return loaderState;
}
