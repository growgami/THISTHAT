'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Tweet } from '@/types/tweet';
import FullTweet from '@/features/tweets/components/FullTweet';
import {
  cardVariants,
  buttonVariants,
  linkVariants,
  overlayVariants,
  overlayTextVariants,
  shadowVariants,
  staggerDelays,
  transitions,
  swipeVariants,
  swipeConfig,
  swipeIndicatorVariants
} from '@/lib/animations';

interface TweetCardsProps {
  tweets: Tweet[];
  onLike?: () => void;
  onNext?: () => void;
}

interface TweetCardProps {
  tweet: Tweet;
  onLike?: () => void;
  onNext?: () => void;
  isDisabled?: boolean;
  onSelect?: () => void;
  onSwipeSelect?: (cardIndex: number) => void;
}

function TweetCard({ 
  tweet, 
  onLike, 
  onNext,
  isDisabled = false,
  onSelect,
  onSwipeSelect
}: TweetCardProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [showFullTweet, setShowFullTweet] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleThis = () => {
    if (isDisabled) return;
    
    setIsSelected(true);
    onSelect?.(); // Notify parent that this card was selected
    onLike?.(); // Consider this tweet as approved
    setTimeout(() => {
      setIsSelected(false);
      onNext?.();
    }, 600);
  };

  const handleSwipeSelect = (direction: 'left' | 'right') => {
    if (isDisabled) return;
    
    // Swipe left = select first tweet (index 0)
    // Swipe right = select second tweet (index 1) 
    const selectedIndex = direction === 'left' ? 0 : 1;
    onSwipeSelect?.(selectedIndex);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on the action area, if disabled, or if dragging
    if (isDisabled || isDragging) return;
    
    const target = e.target as HTMLElement;
    const isActionArea = target.closest('.action-area');
    
    if (!isActionArea) {
      handleThis();
    }
  };

  // Handle drag start
  const handleDragStart = () => {
    if (isDisabled) return;
    setIsDragging(true);
  };

  // Handle drag motion
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isDisabled) return;
    
    setDragOffset({ x: info.offset.x, y: info.offset.y });
    
    // Update swipe direction hint based on drag distance
    if (Math.abs(info.offset.x) > 30) {
      setSwipeDirection(info.offset.x > 0 ? 'right' : 'left');
    } else {
      setSwipeDirection(null);
    }
  };

  // Handle drag end - determine if swipe should trigger
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isDisabled) return;
    
    setIsDragging(false);
    setSwipeDirection(null);
    setDragOffset({ x: 0, y: 0 });
    
    const { offset, velocity } = info;
    const isQuickSwipe = Math.abs(velocity.x) > swipeConfig.velocityThreshold;
    const isLongSwipe = Math.abs(offset.x) > swipeConfig.threshold;
    
    if (isQuickSwipe || isLongSwipe) {
      if (offset.x > 0) {
        // Swipe right - select second tweet
        handleSwipeSelect('right');
      } else {
        // Swipe left - select first tweet
        handleSwipeSelect('left');
      }
    }
  };

  // Calculate dynamic styles based on drag
  const getDynamicStyles = () => {
    if (!isDragging) return {};
    
    const { x } = dragOffset;
    const absX = Math.abs(x);
    const progress = Math.min(absX / swipeConfig.threshold, 1);
    
    return {
      opacity: 1 - (progress * (1 - swipeConfig.minOpacity))
    };
  };

  // Format follower count for display
  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  // Generate random engagement metrics once and store in state
  const [metrics] = useState(() => {
    const likes = Math.floor(Math.random() * 10000) + 100;
    const retweets = Math.floor(Math.random() * 2000) + 50;
    return { likes, retweets };
  });

  // Truncate tweet text with responsive character limits
  const truncateText = (text: string) => {
    const maxLength = isMobile ? 180 : 370;
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (showFullTweet) {
    return (
      <FullTweet 
        tweet={tweet} 
        onClose={() => setShowFullTweet(false)}
        onLike={onLike}
        onNext={onNext}
      />
    );
  }

  return (
    <motion.div 
      className={`concept-card relative ${
        isDisabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'
      } select-none`}
      onClick={handleCardClick}
      onMouseEnter={() => !isDisabled && setIsHovered(true)}
      onMouseLeave={() => !isDisabled && setIsHovered(false)}
      drag={!isDisabled ? "x" : false}
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{
        boxShadow: '8px 8px 32px rgba(0, 0, 0, 0.15)',
        rotate: isDragging ? dragOffset.x * 0.1 : 0,
        ...getDynamicStyles()
      }}
      variants={swipeVariants}
      initial="initial"
      animate={isDragging ? "dragging" : "initial"}
      whileHover={!isDisabled && !isDragging ? cardVariants.hover : cardVariants.disabled}
      whileTap={!isDisabled && !isDragging ? cardVariants.tap : cardVariants.disabled}
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
      <AnimatePresence>
        {isDragging && swipeDirection && (
          <>
                         {/* Select second tweet indicator (right swipe) */}
             {swipeDirection === 'right' && (
               <motion.div
                 className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
                 variants={swipeIndicatorVariants}
                 initial="hidden"
                 animate="likeHint"
                 exit="hidden"
               >
                 <div className="bg-blue-500 text-white px-3 py-1 rounded-full font-semibold text-sm">
                   SECOND
                 </div>
               </motion.div>
             )}
             
             {/* Select first tweet indicator (left swipe) */}
             {swipeDirection === 'left' && (
               <motion.div
                 className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
                 variants={swipeIndicatorVariants}
                 initial="hidden"
                 animate="skipHint"
                 exit="hidden"
               >
                 <div className="bg-purple-500 text-white px-3 py-1 rounded-full font-semibold text-sm">
                   FIRST
                 </div>
               </motion.div>
             )}
          </>
        )}
      </AnimatePresence>

      {/* Header with avatar, name, handle, and metrics */}
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

      {/* Tweet content */}
      <div className="concept-card-content">
        <p className="concept-card-text mb-6">
          {truncateText(tweet.text)}
        </p>

        {/* Action area - clickable zone for buttons */}
        <div className="action-area">
          {/* Single $THIS button */}
          <div className="flex justify-center mb-1 sm:mb-4">
            <motion.button
              onClick={handleThis}
              disabled={isDisabled}
              className={`px-16 sm:px-32 py-1.5 sm:py-2.5 rounded-md font-medium font-ui text-sm sm:text-base ${
                isDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
              style={{ backgroundColor: 'var(--border)', color: 'var(--text-inverse)' }}
              whileHover={!isDisabled ? buttonVariants.hover : {}}
              whileTap={!isDisabled ? buttonVariants.tap : {}}
            >
              $THIS
            </motion.button>
          </div>

          {/* See full tweet link */}
          <div className="text-center">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowFullTweet(true);
              }}
              disabled={isDisabled}
              className={`text-sm text-tertiary font-caption underline ${
                isDisabled 
                  ? 'cursor-not-allowed' 
                  : ''
              }`}
              whileHover={!isDisabled ? linkVariants.hover : {}}
              whileTap={!isDisabled ? linkVariants.tap : {}}
            >
              See full tweet
            </motion.button>
          </div>
        </div>
      </div>

      {/* Feedback overlay with smooth animations */}
      <AnimatePresence>
        {isSelected && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center rounded-md"
            style={{ backgroundColor: 'var(--border)' }}
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div 
              className="text-2xl font-bold"
              style={{ color: 'var(--background)' }}
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
    </motion.div>
  );
}

export default function TweetCards({ 
  tweets, 
  onLike, 
  onNext
}: TweetCardsProps) {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [isGlobalSwiping, setIsGlobalSwiping] = useState(false);

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

  // Global swipe handlers
  const handleGlobalDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    console.log('Global drag', event, info);
    setIsGlobalSwiping(true);
  };

  const handleGlobalDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsGlobalSwiping(false);
    
    const { offset, velocity } = info;
    const isQuickSwipe = Math.abs(velocity.x) > swipeConfig.velocityThreshold;
    const isLongSwipe = Math.abs(offset.x) > swipeConfig.threshold;
    
    if (isQuickSwipe || isLongSwipe) {
      if (offset.x > 0) {
        // Swipe right - select second tweet
        handleSwipeSelection(1);
      } else {
        // Swipe left - select first tweet
        handleSwipeSelection(0);
      }
    }
  };

  return (
    <motion.div 
      className="h-full flex flex-col items-center justify-center -mt-8 px-4 relative"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0}
      onDrag={handleGlobalDrag}
      onDragEnd={handleGlobalDragEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Title */}
      <motion.h1 
        className="text-4xl md:text-7xl text-primary mb-2 sm:mb-16 tracking-tight font-body tracking-tighter"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: {
            ...transitions.fadeIn,
            delay: staggerDelays.title
          }
        }}
      >
        THISTHAT
      </motion.h1>

      {/* Swipe instructions for mobile */}
      <motion.div 
        className="md:hidden text-center mb-4 text-sm text-tertiary"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            ...transitions.fadeIn,
            delay: staggerDelays.container + 0.2
          }
        }}
      >
        <p>← Swipe left for FIRST • Swipe right for SECOND →</p>
      </motion.div>

      {/* Tweet Cards - Side by Side on desktop, Stacked on mobile */}
      <motion.div 
        className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-center"
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

      {/* Global swipe indicator */}
      <AnimatePresence>
        {isGlobalSwiping && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-black/20 backdrop-blur-sm rounded-xl px-6 py-3">
              <p className="text-white font-semibold">← FIRST • SECOND →</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
