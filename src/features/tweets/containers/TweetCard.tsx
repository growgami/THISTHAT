'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TweetCardHeader from '@/features/tweets/components/TweetCardHeader';
import TweetCardContent from '@/features/tweets/components/TweetCardContent';
import SwipeIndicators from '@/features/tweets/components/SwipeIndicators';
import SwipeAnimation from '@/features/tweets/animations/Swipe';
import { useRanking } from '@/features/award/hooks/useAwardPoints';
import {
  overlayVariants,
  overlayTextVariants,
  shadowVariants
} from '@/components/animations/animations';

import type { TweetCardProps } from '@/types/tweetCard';

export default function TweetCard({ 
  tweet, 
  onLike, 
  onNext,
  isDisabled = false,
  onSelect,
  onSwipeSelect,
  cardIndex,
  isAnyCardSwiping,
  onSwipeStart,
  onSwipeEnd
}: TweetCardProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isThisCardSwiping, setIsThisCardSwiping] = useState(false);
  const { awardAuthorPoints } = useRanking();

  // Check if this card should be disabled due to other card swiping
  const isSwipeDisabled = isDisabled || (isAnyCardSwiping && !isThisCardSwiping);

  const handleThis = async () => {
    if (isSwipeDisabled) return;
    
    // Award points to the author when their tweet is selected
    try {
      // Debug: Log the tweet data being sent
      console.log('Tweet data for ranking:', {
        author_id: tweet.author_id,
        author_username: tweet.author,
        author_name: tweet.author_name,
        tweet_id: tweet._id
      });
      
      // Validate required fields before making API call
      if (!tweet.author_id || !tweet.author_name) {
        console.error('Missing required author fields:', {
          author_id: tweet.author_id,
          author_name: tweet.author_name
        });
        return;
      }
      
      await awardAuthorPoints({
        author_id: tweet.author_id,
        author_username: tweet.author || tweet.author_name || `user_${tweet.author_id}`, // Handle missing author field
        author_name: tweet.author_name,
        author_pfp: tweet.author_pfp // Include profile picture URL
      });
    } catch (error) {
      console.error('Failed to award author points:', error);
    }
    
    setIsSelected(true);
    onSelect?.(); // Notify parent that this card was selected
    onLike?.(); // Consider this tweet as approved
    setTimeout(() => {
      setIsSelected(false);
      onNext?.();
    }, 600);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on the action area or if disabled
    if (isSwipeDisabled) return;
    
    const target = e.target as HTMLElement;
    const isActionArea = target.closest('.action-area');
    
    if (!isActionArea) {
      handleThis();
    }
  };

  return (
    <SwipeAnimation
      isDisabled={isDisabled}
      cardIndex={cardIndex}
      isAnyCardSwiping={isAnyCardSwiping}
      tweetId={tweet._id}
      onSwipeStart={onSwipeStart}
      onSwipeEnd={onSwipeEnd}
      onSwipeSelect={onSwipeSelect}
      onSwipeDirectionChange={setSwipeDirection}
      onSwipingStateChange={setIsThisCardSwiping}
      className={`concept-card relative ${
        isSwipeDisabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'
      } select-none ${isAnyCardSwiping && !isThisCardSwiping ? 'brightness-75' : ''}`}
      onClick={handleCardClick}
      onMouseEnter={() => !isSwipeDisabled && setIsHovered(true)}
      onMouseLeave={() => !isSwipeDisabled && setIsHovered(false)}
    >
      {/* Enhanced shadow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-md pointer-events-none"
        variants={shadowVariants}
        animate={isHovered ? "visible" : "hidden"}
        style={{
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.4), 0 15px 25px -8px rgba(0, 0, 0, 0.25)',
          zIndex: -1
        }}
      />

      {/* Swipe direction indicators */}
      <SwipeIndicators swipeDirection={swipeDirection} />

      {/* Header with avatar, name, handle, and metrics */}
      <TweetCardHeader tweet={tweet} />

      {/* Tweet content */}
      <TweetCardContent 
        tweet={tweet} 
        isSwipeDisabled={isSwipeDisabled}
      />

      {/* Feedback overlay with smooth animations */}
      <AnimatePresence>
        {isSelected && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center rounded-md"
            style={{ backgroundColor: 'var(--selected-bg)' }}
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div 
              className="text-2xl font-bold"
              style={{ color: 'var(--selected-text)' }}
              variants={overlayTextVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              Selected!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SwipeAnimation>
  );
}
