import { useState, useCallback, useEffect } from 'react';
import { creditResetScheduler } from '../services/scheduler';
import { CREDIT_RESET_ENDPOINT } from '../constants/creditDefaults';

interface CreditResetState {
  isResetting: boolean;
  lastReset: string | null;
  nextReset: string | null;
  error: string | null;
  schedulerRunning: boolean;
}

interface CreditResetResult {
  success: boolean;
  message: string;
  count?: number;
  errors?: string[];
}

export function useCreditReset() {
  const [state, setState] = useState<CreditResetState>({
    isResetting: false,
    lastReset: null,
    nextReset: null,
    error: null,
    schedulerRunning: false
  });

  // Update state from scheduler status
  const updateSchedulerStatus = useCallback(() => {
    const status = creditResetScheduler.getStatus();
    setState(prev => ({
      ...prev,
      lastReset: status.lastReset,
      nextReset: status.nextReset,
      schedulerRunning: status.isRunning
    }));
  }, []);

  // Initialize and get scheduler status
  useEffect(() => {
    updateSchedulerStatus();
    
    // Update status periodically
    const interval = setInterval(updateSchedulerStatus, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [updateSchedulerStatus]);

  /**
   * Manually trigger a credit reset
   */
  const triggerReset = useCallback(async (): Promise<CreditResetResult> => {
    setState(prev => ({ ...prev, isResetting: true, error: null }));
    
    try {
      const response = await fetch(CREDIT_RESET_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'dev-secret'}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      setState(prev => ({
        ...prev,
        isResetting: false,
        lastReset: result.timestamp,
        error: null
      }));

      // Update scheduler status after manual reset
      setTimeout(updateSchedulerStatus, 1000);

      return {
        success: true,
        message: result.message,
        count: result.count,
        errors: result.errors
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setState(prev => ({
        ...prev,
        isResetting: false,
        error: errorMessage
      }));

      return {
        success: false,
        message: errorMessage
      };
    }
  }, [updateSchedulerStatus]);

  /**
   * Check API health status
   */
  const checkStatus = useCallback(async (): Promise<{ healthy: boolean; message: string }> => {
    try {
      const response = await fetch(CREDIT_RESET_ENDPOINT, {
        method: 'GET'
      });

      const result = await response.json();
      
      return {
        healthy: response.ok && result.status === 'healthy',
        message: result.message || 'Unknown status'
      };
    } catch (error) {
      return {
        healthy: false,
        message: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }, []);

  /**
   * Clear any error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Get time until next reset
   */
  const getTimeUntilReset = useCallback((): string | null => {
    if (!state.nextReset) return null;
    
    const now = new Date();
    const nextReset = new Date(state.nextReset);
    const diff = nextReset.getTime() - now.getTime();
    
    if (diff <= 0) return 'Reset due now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }, [state.nextReset]);

  return {
    // State
    isResetting: state.isResetting,
    lastReset: state.lastReset,
    nextReset: state.nextReset,
    error: state.error,
    schedulerRunning: state.schedulerRunning,
    
    // Actions
    triggerReset,
    checkStatus,
    clearError,
    
    // Computed
    timeUntilReset: getTimeUntilReset()
  };
}