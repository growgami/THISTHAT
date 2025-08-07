import { motion, AnimatePresence } from 'framer-motion';

interface SwipeIndicatorsProps {
  swipeDirection: 'left' | 'right' | null;
}

export default function SwipeIndicators({ swipeDirection }: SwipeIndicatorsProps) {
  return (
    <AnimatePresence>
      {swipeDirection && (
        <>
          {/* Select second tweet indicator (right swipe) */}
          {swipeDirection === 'right' && (
            <motion.div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.8, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.8, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-purple-500 text-white px-3 py-1 rounded-full font-semibold text-sm">
                FIRST
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
