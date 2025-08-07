'use client';

import { motion } from 'framer-motion';
import { useLoader } from '@/features/loader/hooks/useLoader';
import { transitions } from '@/components/animations/animations';

export default function LoadingScreen() {
  const { progress, message } = useLoader();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center w-full max-w-md px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transitions.fadeIn}
      >
        <motion.h1
          className="text-3xl font-bold text-primary mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          THISTHAT
        </motion.h1>
        
        <motion.div
          className="loading-bar-container"
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="loading-bar-progress"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </motion.div>
        
        <motion.p
          className="text-primary text-lg mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {Math.round(progress)}%
        </motion.p>
        
        <motion.p
          className="text-secondary text-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}
