'use client'

import { useState } from 'react';
import Image from 'next/image';
import { Tweet } from '@/types/tweet';

interface TweetCardHeaderProps {
  tweet: Tweet;
}

export default function TweetCardHeader({ tweet }: TweetCardHeaderProps) {
  // Generate random engagement metrics once and store in state
  const [metrics] = useState(() => {
    const likes = Math.floor(Math.random() * 10000) + 100;
    const retweets = Math.floor(Math.random() * 2000) + 50;
    return { likes, retweets };
  });

  // Format follower count for display
  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <div className="concept-card-header">
      <div className="concept-card-avatar">
        {tweet.author_pfp ? (
          <Image 
            src={tweet.author_pfp} 
            alt={tweet.author_name}
            width={40}
            height={40}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-background">
            {tweet.author_name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="concept-card-author-name truncate">
              {tweet.author_name}
            </h3>
            <p className="concept-card-author-handle truncate">
              @{tweet.author_name.toLowerCase().replace(/\s+/g, '')}
            </p>
          </div>
          <div className="text-right text-xs text-tertiary ml-4 flex-shrink-0">
            <div>{formatFollowers(metrics.likes)} ♥ • {formatFollowers(metrics.retweets)} ↻</div>
          </div>
        </div>
      </div>
    </div>
  );
}
