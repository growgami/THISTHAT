'use client'

import { useState, useEffect, ReactNode } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { gestureConfig } from '@/components/animations/animations';

interface SwipeAnimationProps {
  children: ReactNode;
  isDisabled: boolean;
  cardIndex: number;
  isAnyCardSwiping: boolean;
  tweetId: string;
  onSwipeStart: (cardIndex: number) => void;
  onSwipeEnd: () => void;
  onSwipeSelect?: (selectedIndex: number) => void;
  onSwipeDirectionChange: (direction: 'left' | 'right' | null) => void;
  onSwipingStateChange: (isSwiping: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void | Promise<void>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function SwipeAnimation({
  children,
  isDisabled,
  cardIndex,
  isAnyCardSwiping,
  tweetId,
  onSwipeStart,
  onSwipeEnd,
  onSwipeSelect,
  onSwipeDirectionChange,
  onSwipingStateChange,
  className,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave
}: SwipeAnimationProps) {
  const [isThisCardSwiping, setIsThisCardSwiping] = useState(false);

  // Check if this card should be disabled due to other card swiping
  const isSwipeDisabled = isDisabled || (isAnyCardSwiping && !isThisCardSwiping);

  // Spring animation for drag - reset when tweet changes
  const [{ x, opacity }, api] = useSpring(() => ({
    x: 0,
    opacity: 1,
    config: gestureConfig.spring
  }));

  // Reset spring state when tweet changes (new tweet loaded)
  useEffect(() => {
    api.start({
      x: 0,
      opacity: 1,
      immediate: true
    });
    setIsThisCardSwiping(false);
    onSwipeDirectionChange(null);
    onSwipingStateChange(false);
  }, [tweetId, api, onSwipeDirectionChange, onSwipingStateChange]);

  // Clean up swiping state when component unmounts or becomes disabled
  useEffect(() => {
    if (isSwipeDisabled && isThisCardSwiping) {
      setIsThisCardSwiping(false);
      onSwipeDirectionChange(null);
      onSwipingStateChange(false);
      onSwipeEnd();
    }
  }, [isSwipeDisabled, isThisCardSwiping, onSwipeEnd, onSwipeDirectionChange, onSwipingStateChange]);

  // Drag gesture handler
  const bind = useDrag(
    ({ active, movement: [mx], velocity: [vx], direction: [dx], cancel, first, last }) => {
      if (isSwipeDisabled) {
        cancel?.();
        return;
      }

      // On first touch, ensure clean state
      if (first) {
        api.start({
          x: 0,
          opacity: 1,
          immediate: true
        });
        setIsThisCardSwiping(true);
        onSwipingStateChange(true);
        onSwipeStart(cardIndex);
      }

      // Update swipe direction hint based on drag distance
      if (active && Math.abs(mx) > 30) {
        const direction = mx > 0 ? 'right' : 'left';
        onSwipeDirectionChange(direction);
      } else if (last) {
        onSwipeDirectionChange(null);
      }

      // Calculate opacity based on drag distance
      const progress = Math.min(Math.abs(mx) / gestureConfig.threshold, 1);
      const currentOpacity = 1 - (progress * (1 - gestureConfig.minOpacity));

      if (active) {
        // While dragging, update position and opacity
        api.start({
          x: mx,
          opacity: currentOpacity,
          immediate: true
        });
      } else {
        // When drag ends, check if threshold is met
        const shouldSwipe = Math.abs(mx) > gestureConfig.threshold || Math.abs(vx) > gestureConfig.velocityThreshold;
        
        if (shouldSwipe) {
          // Trigger swipe action
          const selectedIndex = dx > 0 ? 1 : 0; // Right = second tweet, Left = first tweet
          onSwipeSelect?.(selectedIndex);
          
          // Animate out
          api.start({
            x: dx > 0 ? 400 : -400,
            opacity: 0,
            config: { tension: 300, friction: 20 }
          });
          
          // Clean up after animation
          setTimeout(() => {
            // Force immediate reset to clean state
            api.start({ 
              x: 0, 
              opacity: 1, 
              immediate: true 
            });
            setIsThisCardSwiping(false);
            onSwipeDirectionChange(null);
            onSwipingStateChange(false);
            onSwipeEnd();
          }, 400);
        } else {
          // Snap back to center with clean animation
          api.start({
            x: 0,
            opacity: 1,
            config: gestureConfig.spring
          });
          
          // Clean up state immediately
          setTimeout(() => {
            setIsThisCardSwiping(false);
            onSwipeDirectionChange(null);
            onSwipingStateChange(false);
            onSwipeEnd();
          }, 200);
        }
      }
    },
    {
      axis: 'x',
      bounds: gestureConfig.bounds,
      rubberband: true,
      enabled: !isSwipeDisabled,
      // Reset bounds and configuration on each gesture
      from: () => [x.get(), 0],
      filterTaps: true
    }
  );

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        opacity,
        touchAction: 'none',
        cursor: isSwipeDisabled ? 'not-allowed' : 'grab',
        ...style
      }}
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </animated.div>
  );
}