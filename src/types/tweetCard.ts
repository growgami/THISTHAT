import type { Tweet } from '@/types/tweet';

export interface TweetCardsProps {
  tweets: Tweet[];
  onLike?: () => void;
  onNext?: () => void;
}

export interface TweetCardProps {
  tweet: Tweet;
  onLike?: () => void;
  onNext?: () => void;
  isDisabled?: boolean;
  onSelect?: () => void;
  onSwipeSelect?: (cardIndex: number) => void;
  cardIndex: number;
  isAnyCardSwiping: boolean;
  onSwipeStart: (cardIndex: number) => void;
  onSwipeEnd: () => void;
}
