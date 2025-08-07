'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tweet } from '@/types/tweet';
import { linkVariants } from '@/components/animations/animations';

interface TweetCardContentProps {
  tweet: Tweet;
  isSwipeDisabled: boolean;
}

export default function TweetCardContent({ 
  tweet, 
  isSwipeDisabled 
}: TweetCardContentProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Truncate tweet text with responsive character and line limits
  const truncateText = (text: string) => {
    const maxLength = isMobile ? 200 : 350; // Reduced limits to account for newlines
    const maxLines = isMobile ? 6 : 8; // Maximum number of lines
    
    // Split text into lines to check line count
    const lines = text.split('\n');
    
    // If we have too many lines, truncate by lines first
    if (lines.length > maxLines) {
      const truncatedByLines = lines.slice(0, maxLines).join('\n');
      return truncatedByLines + '...';
    }
    
    // If character count is too long, truncate by characters
    if (text.length > maxLength) {
      // Try to truncate at a word boundary near the limit
      const truncated = text.substring(0, maxLength);
      const lastSpaceIndex = truncated.lastIndexOf(' ');
      const lastNewlineIndex = truncated.lastIndexOf('\n');
      
      // Use the latest word/line boundary, or fall back to character limit
      const cutIndex = Math.max(lastSpaceIndex, lastNewlineIndex);
      if (cutIndex > maxLength * 0.8) { // Only use boundary if it's not too far back
        return text.substring(0, cutIndex) + '...';
      }
      return truncated + '...';
    }
    
    return text;
  };

  return (
    <div className="concept-card-content">
      <p className="concept-card-text mb-12 whitespace-pre-line">
        {truncateText(tweet.text)}
      </p>

      {/* Action area - clickable zone for buttons */}
      <div className="action-area">
        {/* See full tweet link */}
        <div className="text-center">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              // Redirect to the original tweet URL
              window.open(tweet.tweet_url, '_blank');
            }}
            disabled={isSwipeDisabled}
            className={`text-sm text-tertiary font-caption underline ${
              isSwipeDisabled 
                ? 'cursor-not-allowed' 
                : ''
            }`}
            whileHover={!isSwipeDisabled ? linkVariants.hover : {}}
            whileTap={!isSwipeDisabled ? linkVariants.tap : {}}
          >
            See full tweet
          </motion.button>
        </div>
      </div>
    </div>
  );
}
