'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TweetCard from '@/features/tweets/containers/TweetCard';
import {
  staggerDelays,
  transitions
} from '@/components/animations/animations';


import type { TweetCardsProps } from '@/types/tweetCard';



export default function Tweets({ 
  tweets, 
  onLike, 
  onNext
}: TweetCardsProps) {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [swipingCardIndex, setSwipingCardIndex] = useState<number | null>(null);

  // Reset swiping state when tweets change
  useEffect(() => {
    setSwipingCardIndex(null);
    setSelectedCardIndex(null);
  }, [tweets]);

  const handleCardSelect = (index: number) => {
    setSelectedCardIndex(index);
    // Reset after animation completes
    setTimeout(() => {
      setSelectedCardIndex(null);
    }, 600);
  };

  const handleSwipeSelection = (selectedIndex: number) => {
    // Handle swipe selection - select the tweet at the given index
    console.log(`Selected tweet at index: ${selectedIndex}`);
    setSelectedCardIndex(selectedIndex);
    
    // Call the appropriate handlers based on selection
    if (selectedIndex === 0 || selectedIndex === 1) {
      onLike?.(); // Consider any selection as a like
      setTimeout(() => {
        setSelectedCardIndex(null);
        onNext?.();
      }, 600);
    }
  };

  const handleSwipeStart = (cardIndex: number) => {
    setSwipingCardIndex(cardIndex);
  };

  const handleSwipeEnd = () => {
    setSwipingCardIndex(null);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center -mt-8 px-4 relative">
      {/* Title - Centered on desktop, Far right side rotated on mobile */}
      <motion.h1 
        className="text-2xl md:text-7xl text-primary mb-2 sm:mb-16 tracking-tight font-body tracking-tighter md:static md:rotate-0 md:top-auto md:right-auto md:transform-none rotate-90 right-0 top-1/2 -translate-y-1/2 origin-center z-10 absolute"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: {
            ...transitions.fadeIn,
            delay: staggerDelays.title
          }
        }}
      >
        THIS <span className="text-tertiary">OR</span> THAT
      </motion.h1>

      {/* Swipe instructions for mobile - adjusted for rotated cards */}
      <motion.div 
        className="md:hidden text-center mb-6 text-sm text-tertiary"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            ...transitions.fadeIn,
            delay: staggerDelays.container + 0.2
          }
        }}
      >
      </motion.div>

      {/* Tweet Cards - Rotated 90° on mobile, Side by Side on both mobile and desktop */}
      <motion.div 
        className="flex flex-row gap-4 md:gap-8 justify-center items-center md:rotate-0 rotate-90 md:scale-100 scale-90 mb-12 md:mb-0 md:mr-0 mr-8"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            ...transitions.fadeIn,
            delay: staggerDelays.container
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              ...transitions.slow,
              delay: staggerDelays.firstCard
            }
          }}
        >
          {tweets.length >= 1 ? (
            <TweetCard
              tweet={tweets[0]}
              onLike={onLike}
              onNext={onNext}
              isDisabled={selectedCardIndex !== null && selectedCardIndex !== 0}
              onSelect={() => handleCardSelect(0)}
              onSwipeSelect={handleSwipeSelection}
              cardIndex={0}
              isAnyCardSwiping={swipingCardIndex !== null}
              onSwipeStart={handleSwipeStart}
              onSwipeEnd={handleSwipeEnd}
            />
          ) : (
            <div className="concept-card">
              <div className="concept-card-content text-center py-12">
                <p className="text-tertiary">No tweets available</p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              ...transitions.slow,
              delay: staggerDelays.secondCard
            }
          }}
        >
          {tweets.length >= 2 ? (
            <TweetCard
              tweet={tweets[1]}
              onLike={onLike}
              onNext={onNext}
              isDisabled={selectedCardIndex !== null && selectedCardIndex !== 1}
              onSelect={() => handleCardSelect(1)}
              onSwipeSelect={handleSwipeSelection}
              cardIndex={1}
              isAnyCardSwiping={swipingCardIndex !== null}
              onSwipeStart={handleSwipeStart}
              onSwipeEnd={handleSwipeEnd}
            />
          ) : (
            <div className="concept-card">
              <div className="concept-card-content text-center py-12">
                <p className="text-tertiary">No tweets available</p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
