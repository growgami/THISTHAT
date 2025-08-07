import { creditResetScheduler } from './scheduler';

/**
 * Initialize the credit reset scheduler
 * This should be called once when the application starts
 */
export function initializeCreditScheduler(): void {
  // Only initialize in production or when explicitly enabled
  const shouldInitialize = 
    process.env.NODE_ENV === 'production' || 
    process.env.ENABLE_CREDIT_SCHEDULER === 'true';

  if (!shouldInitialize) {
    console.log('Credit scheduler disabled in development mode');
    return;
  }

  try {
    console.log('Initializing credit reset scheduler...');
    creditResetScheduler.start();
    console.log('Credit reset scheduler initialized successfully');
  } catch (error) {
    console.error('Failed to initialize credit reset scheduler:', error);
  }
}

/**
 * Cleanup function to stop the scheduler (useful for testing or shutdown)
 */
export function stopCreditScheduler(): void {
  try {
    creditResetScheduler.stop();
    console.log('Credit reset scheduler stopped');
  } catch (error) {
    console.error('Error stopping credit reset scheduler:', error);
  }
}

/**
 * Get scheduler status for monitoring
 */
export function getCreditSchedulerStatus() {
  return creditResetScheduler.getStatus();
}