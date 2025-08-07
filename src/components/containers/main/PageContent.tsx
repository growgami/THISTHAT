'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TweetCards from '@/features/tweets/containers/Tweets';
import { useTweets } from '@/features/tweets/hooks/useTweets';
import Navbar from '../layout/Navbar';
import LoadingScreen from '@/features/loader/components/LoadingScreen';
import Ranking from '@/features/ranking/components/Rankings';
import Those from '@/features/collection/components/Collection';
import Account from '@/features/account/components/Account';
import { pageVariants, transitions } from '@/components/animations/animations';
import { Spotlight } from '@/features/tweets/animations/Spotlight';

export default function PageContent() {
  const { currentTweets, isLoading, error, handleNext } = useTweets();
  const [showRankings, setShowRankings] = useState(false);
  const [showThose, setShowThose] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

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
    setShowAccount(false); // Hide Account when showing rankings
  };

  // Handle those toggle
  const handleToggleThose = () => {
    setShowThose(!showThose);
    setShowRankings(false); // Hide rankings when showing those
    setShowAccount(false); // Hide Account when showing those
  };

  // Handle account toggle
  const handleToggleAccount = () => {
    setShowAccount(!showAccount);
    setShowRankings(false); // Hide rankings when showing account
    setShowThose(false); // Hide those when showing account
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Tweets</h2>
          <p className="text-gray-300 mb-4">{error.message || 'Failed to load tweets. Please try again later.'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-18 relative overflow-hidden">
      {/* Spotlight Background Overlay */}
      <Spotlight />
      
      {/* Outer border container */}
      <div className="h-[calc(100vh-9rem)] rounded-sm relative z-10">
        {/* Navigation */}
        <Navbar 
          showRankings={showRankings} 
          showThose={showThose}
          showAccount={showAccount}
          onToggleThose={handleToggleThose}
          onToggleRankings={handleToggleRankings}
          onToggleAccount={handleToggleAccount}
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
            ) : showAccount ? (
              <motion.div
                key="account"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transitions.pageTransition}
                className="h-full flex flex-col items-center justify-center px-4"
              >
                <Account />
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
