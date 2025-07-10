/**
 * Centralized animation configurations for consistent motion design
 * 
 * This file contains all animation variants, transitions, and spring configurations
 * used throughout the application to ensure consistent motion design.
 */

// =============================================================================
// SPRING CONFIGURATIONS
// =============================================================================

export const springs = {
  gentle: {
    type: "spring" as const,
    stiffness: 100,
    damping: 10,
    mass: 1
  },
  snappy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25
  },
  bounce: {
    type: "spring" as const,
    stiffness: 600,
    damping: 30
  },
  smooth: {
    type: "spring" as const,
    stiffness: 300,
    damping: 25
  },
  swipe: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8
  }
};

// =============================================================================
// TRANSITION CONFIGURATIONS
// =============================================================================

export const transitions = {
  fast: { duration: 0.2 },
  medium: { duration: 0.3, ease: "easeOut" as const },
  slow: { duration: 0.6, ease: "easeOut" as const },
  fadeIn: { duration: 0.8, ease: "easeOut" as const },
  swipeSnap: { duration: 0.4, ease: "easeOut" as const },
  // Custom easing for smooth page transitions
  pageTransition: {
    duration: 0.4,
    ease: [0.25, 0.46, 0.45, 0.94] as const
  }
};

// =============================================================================
// SWIPE GESTURE CONFIGURATIONS
// =============================================================================

/**
 * Swipe gesture thresholds and configurations
 * Used for determining when a swipe action should trigger
 */
export const swipeConfig = {
  // Distance threshold for triggering swipe action
  threshold: 120,
  // Velocity threshold for quick swipes
  velocityThreshold: 500,
  // Rotation angle when dragging
  maxRotation: 15,
  // Opacity when dragging to edges
  minOpacity: 0.6
};

/**
 * Swipe animation variants for card interactions
 * Handles the visual feedback during drag and swipe actions
 */
export const swipeVariants = {
  initial: {
    x: 0,
    y: 0,
    rotate: 0,
    opacity: 1,
    scale: 1
  },
  dragging: {
    cursor: "grabbing",
    transition: springs.swipe
  },
  swipeRight: {
    x: 400,
    rotate: 20,
    opacity: 0,
    transition: transitions.swipeSnap
  },
  swipeLeft: {
    x: -400,
    rotate: -20,
    opacity: 0,
    transition: transitions.swipeSnap
  },
  snapBack: {
    x: 0,
    y: 0,
    rotate: 0,
    opacity: 1,
    scale: 1,
    transition: springs.swipe
  }
};

/**
 * Swipe indicator animations
 * Visual feedback for swipe direction hints
 */
export const swipeIndicatorVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  likeHint: {
    opacity: 0.8,
    scale: 1.1,
    color: '#10B981', // Green for like
    transition: springs.gentle
  },
  skipHint: {
    opacity: 0.8,
    scale: 1.1,
    color: '#EF4444', // Red for skip
    transition: springs.gentle
  }
};

// =============================================================================
// PAGE TRANSITION VARIANTS
// =============================================================================

/**
 * Page transition animations for main content switching
 * Used when navigating between Rankings, Collection, and Tweet views
 */
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98
  }
};

// =============================================================================
// CARD ANIMATION VARIANTS
// =============================================================================

/**
 * Card hover and interaction animations
 * Used for tweet cards, concept cards, and other interactive elements
 */
export const cardVariants = {
  initial: { 
    scale: 1,
    transition: springs.gentle
  },
  hover: {
    scale: 1.01,
    transition: springs.gentle
  },
  tap: {
    scale: 0.98,
    transition: springs.bounce
  },
  disabled: {}
};

// =============================================================================
// BUTTON ANIMATION VARIANTS
// =============================================================================

/**
 * Button interaction animations
 * Used for all clickable buttons throughout the app
 */
export const buttonVariants = {
  initial: {
    scale: 1,
    transition: springs.snappy
  },
  hover: {
    scale: 1.02,
    transition: springs.snappy
  },
  tap: {
    scale: 0.95,
    transition: springs.bounce
  }
};

// =============================================================================
// TEXT LINK ANIMATION VARIANTS
// =============================================================================

/**
 * Text link hover animations
 * Used for navigation links and text-based interactive elements
 */
export const linkVariants = {
  initial: {
    scale: 1,
    transition: springs.snappy
  },
  hover: {
    color: 'var(--secondary)',
    scale: 1.02,
    transition: springs.snappy
  },
  tap: {
    scale: 0.98,
    transition: springs.snappy
  }
};

// =============================================================================
// OVERLAY ANIMATION VARIANTS
// =============================================================================

/**
 * Modal and overlay animations
 * Used for popups, modals, and overlay content
 */
export const overlayVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 0.9,
    scale: 1,
    transition: springs.smooth
  },
  exit: {
    opacity: 0,
    scale: 1.1,
    transition: transitions.fast
  }
};

/**
 * Text animation variants for overlay content
 * Used for text inside modals and overlays
 */
export const overlayTextVariants = {
  initial: { scale: 0, rotate: -10 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      ...springs.snappy,
      delay: 0.1
    }
  },
  exit: {
    scale: 0.8,
    opacity: 0
  }
};

// =============================================================================
// UTILITY ANIMATION VARIANTS
// =============================================================================

/**
 * Shadow animation variants
 * Used for dynamic shadow effects
 */
export const shadowVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.medium
  }
};

/**
 * Simple fade in animations
 * Used for basic element appearances
 */
export const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
};

// =============================================================================
// STAGGERED ANIMATION DELAYS
// =============================================================================

/**
 * Timing delays for staggered animations
 * Used to create cascading animation effects
 */
export const staggerDelays = {
  title: 0,
  container: 0.2,
  firstCard: 0.4,
  secondCard: 0.5
}; 