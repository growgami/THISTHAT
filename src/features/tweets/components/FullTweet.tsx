'use client'

import { useState } from 'react';
import { Tweet as ReactTweet } from 'react-tweet';
import { Tweet } from '@/types/tweet';

interface FullTweetProps {
  tweet: Tweet;
  onClose: () => void;
  onLike?: () => void;
  onNext?: () => void;
}

export default function FullTweet({ 
  tweet, 
  onClose, 
  onLike, 
  onNext 
}: FullTweetProps) {
  const [isSelected, setIsSelected] = useState(false);

  const handleThis = () => {
    setIsSelected(true);
    onLike?.(); // Consider this tweet as approved
    setTimeout(() => {
      setIsSelected(false);
      onNext?.();
    }, 600);
  };

  // Extract tweet ID from the tweet URL or use a fallback
  const getTweetId = () => {
    // If tweet has a URL field, extract ID from it
    if (tweet.tweet_url) {
      const match = tweet.tweet_url.match(/status\/(\d+)/);
      if (match) return match[1];
    }
    
    // Fallback: use a demo tweet ID if no URL available
    return '1683900196632969216'; // Demo tweet ID
  };

  const tweetId = getTweetId();

  return (
    <div className="concept-card relative max-h-[600px] overflow-hidden">
      {/* Header with close button */}
      <div className="concept-card-header">
        <h3 className="font-title text-lg text-primary flex-1">Full Tweet</h3>
        <button
          onClick={onClose}
          className="text-tertiary hover:text-primary transition-colors text-xl font-ui"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Tweet embed container */}
      <div className="concept-card-content">
        <div className="max-h-70 overflow-y-auto">
          <ReactTweet id={tweetId} />
        </div>

        {/* Single $THIS button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleThis}
            className="px-32 py-2.5 rounded-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md font-ui"
            style={{ backgroundColor: 'var(--border)', color: 'var(--background)' }}
          >
            $THIS
          </button>
        </div>
      </div>

      {/* Feedback overlay */}
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl transition-opacity duration-300">
          <div className="text-2xl font-bold text-success">
            Selected!
          </div>
        </div>
      )}
    </div>
  );
}
