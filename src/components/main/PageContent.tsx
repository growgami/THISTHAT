'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TweetCards from '@/features/tweets/components/TweetCards';
import { useTweets } from '@/features/tweets/hooks/useTweets';
import Navbar from './Navbar';
import Ranking from '@/features/ranking/components/Rankings';
import Those from '@/features/concepts/components/Collection';
import { pageVariants, transitions } from '@/lib/animations';

export default function PageContent() {
  const { currentTweets, isLoading, handleNext } = useTweets();
  const [showRankings, setShowRankings] = useState(false);
  const [showThose, setShowThose] = useState(false);

  // Mock liked tweets data - in real app this would come from a hook or context
  const [likedTweets] = useState([
    // This would be populated with tweets the user has liked
  ]);

  // Handle like action
  const handleLike = () => {
    console.log('Tweet liked!');
  };

  // Handle rankings toggle
  const handleToggleRankings = () => {
    setShowRankings(!showRankings);
    setShowThose(false); // Hide Those when showing rankings
  };

  // Handle those toggle
  const handleToggleThose = () => {
    setShowThose(!showThose);
    setShowRankings(false); // Hide rankings when showing those
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-18">
      {/* Outer border container */}
      <div className="h-[calc(100vh-9rem)] rounded-sm relative">
        {/* Navigation */}
        <Navbar 
          showRankings={showRankings} 
          showThose={showThose}
          onToggleThose={handleToggleThose}
          onToggleRankings={handleToggleRankings} 
        />

        {/* Main Content with Framer Motion transitions */}
        <div className="h-full">
          <AnimatePresence mode="wait">
            {showRankings ? (
              <motion.div
                key="rankings"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transitions.pageTransition}
                className="h-full flex flex-col items-center justify-center px-4"
              >
                <Ranking />
              </motion.div>
            ) : showThose ? (
              <motion.div
                key="collection"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transitions.pageTransition}
                className="h-full flex flex-col items-center justify-center px-4"
              >
                <Those likedTweets={likedTweets} />
              </motion.div>
            ) : (
              <motion.div
                key="tweets"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transitions.pageTransition}
                className="h-full"
              >
                <TweetCards
                  tweets={currentTweets}
                  onLike={handleLike}
                  onNext={handleNext}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
