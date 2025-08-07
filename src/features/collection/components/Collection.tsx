'use client'

import { useState } from 'react';
import Image from 'next/image';
import { Tweet } from '@/types/tweet';

interface ThoseProps {
  likedTweets: Tweet[];
}

interface MiniTweetCardProps {
  tweet: Tweet;
  onClick: () => void;
}

function MiniTweetCard({ tweet, onClick }: MiniTweetCardProps) {
  // Format follower count for display
  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  // Generate random engagement metrics
  const generateMetrics = () => {
    const likes = Math.floor(Math.random() * 10000) + 100;
    const retweets = Math.floor(Math.random() * 2000) + 50;
    return { likes, retweets };
  };

  const metrics = generateMetrics();

  // Truncate tweet text for mini view
  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className="mini-concept-card cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
      onClick={onClick}
    >
      {/* Header with avatar, name, handle, and metrics */}
      <div className="mini-concept-card-header">
        <div className="mini-concept-card-avatar">
          {tweet.author_pfp ? (
            <Image 
              src={tweet.author_pfp} 
              alt={tweet.author_name}
              width={24}
              height={24}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-background">
              {tweet.author_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="mini-concept-card-author-name truncate">
                {tweet.author_name}
              </h3>
              <p className="mini-concept-card-author-handle truncate">
                @{tweet.author_name.toLowerCase().replace(/\s+/g, '')}
              </p>
            </div>
            <div className="text-right text-xs text-tertiary ml-2 flex-shrink-0">
              <div className="text-[10px]">{formatFollowers(metrics.likes)} ♥</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tweet content */}
      <div className="mini-concept-card-content">
        <p className="mini-concept-card-text">
          {truncateText(tweet.text)}
        </p>
      </div>

      {/* Selected indicator */}
      <div className="absolute bottom-2 right-2">
        <div className="w-3 h-3 rounded-full bg-primary"></div>
      </div>
    </div>
  );
}

export default function Those({ likedTweets }: ThoseProps) {
  const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);

  const handleTweetClick = (tweet: Tweet) => {
    setSelectedTweet(tweet);
  };

  const handleCloseModal = () => {
    setSelectedTweet(null);
  };

  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-6xl md:text-8xl font-light text-primary mb-4 tracking-wide font-body drop-shadow-2xl">
          Collection
        </h1>
        <p className="text-tertiary mt-2 font-caption">
          {likedTweets.length} tweets saved
        </p>
      </div>

      {/* Grid Container */}
      <div className="w-full overflow-y-auto">
        {likedTweets.length > 0 ? (
          <div className="grid grid-cols-5 gap-4 pb-8">
            {likedTweets.map((tweet, index) => (
              <MiniTweetCard
                key={`${tweet.text}-${index}`}
                tweet={tweet}
                onClick={() => handleTweetClick(tweet)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">💭</div>
            <h2 className="text-xl font-medium text-secondary mb-2">No tweets liked yet</h2>
            <p className="text-tertiary">Start liking tweets to see them here</p>
          </div>
        )}
      </div>

      {/* Modal for full tweet view */}
      {selectedTweet && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="concept-card max-w-md mx-auto relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-tertiary hover:text-primary transition-colors z-10"
            >
              ✕
            </button>
            
            {/* Full tweet content */}
            <div className="concept-card-header">
              <div className="concept-card-avatar">
                {selectedTweet.author_pfp ? (
                  <Image 
                    src={selectedTweet.author_pfp} 
                    alt={selectedTweet.author_name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-background">
                    {selectedTweet.author_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="concept-card-author-name truncate">
                  {selectedTweet.author_name}
                </h3>
                <p className="concept-card-author-handle truncate">
                  @{selectedTweet.author_name.toLowerCase().replace(/\s+/g, '')}
                </p>
              </div>
            </div>

            <div className="concept-card-content">
              <p className="concept-card-text">
                {selectedTweet.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
