import * as cron from 'node-cron';
import { RESET_CRON_SCHEDULE, CREDIT_RESET_ENDPOINT } from '../constants/creditDefaults';

interface SchedulerStatus {
  isRunning: boolean;
  lastReset: string | null;
  nextReset: string | null;
  errorCount: number;
}

class CreditResetScheduler {
  private static instance: CreditResetScheduler;
  private task: cron.ScheduledTask | null = null;
  private status: SchedulerStatus = {
    isRunning: false,
    lastReset: null,
    nextReset: null,
    errorCount: 0
  };

  private constructor() {}

  static getInstance(): CreditResetScheduler {
    if (!CreditResetScheduler.instance) {
      CreditResetScheduler.instance = new CreditResetScheduler();
    }
    return CreditResetScheduler.instance;
  }

  /**
   * Start the daily credit reset scheduler
   */
  start(): void {
    if (this.task) {
      console.log('Credit reset scheduler is already running');
      return;
    }

    console.log('Starting credit reset scheduler...');
    
    this.task = cron.schedule(RESET_CRON_SCHEDULE, async () => {
      await this.executeReset();
    }, {
      timezone: 'Asia/Singapore' // Adjust timezone as needed
    });

    this.task.start();
    this.status.isRunning = true;
    this.updateNextResetTime();
    
    console.log('Credit reset scheduler started successfully');
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      this.status.isRunning = false;
      console.log('Credit reset scheduler stopped');
    }
  }

  /**
   * Execute the credit reset by calling the API endpoint
   */
  private async executeReset(): Promise<void> {
    try {
      console.log('Executing daily credit reset...');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${CREDIT_RESET_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CRON_SECRET || 'dev-secret'}`
        }
      });

      if (!response.ok) {
        throw new Error(`Reset API returned ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      this.status.lastReset = new Date().toISOString();
      this.status.errorCount = 0;
      this.updateNextResetTime();
      
      console.log('Daily credit reset completed successfully:', result);
    } catch (error) {
      this.status.errorCount++;
      console.error('Failed to execute daily credit reset:', error);
      
      // If we have too many consecutive errors, stop the scheduler
      if (this.status.errorCount >= 5) {
        console.error('Too many consecutive errors, stopping scheduler');
        this.stop();
      }
    }
  }

  /**
   * Manually trigger a credit reset (for testing or admin purposes)
   */
  async manualReset(): Promise<{ success: boolean; message: string }> {
    try {
      await this.executeReset();
      return { success: true, message: 'Manual credit reset completed successfully' };
    } catch (error) {
      return { 
        success: false, 
        message: `Manual credit reset failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Get current scheduler status
   */
  getStatus(): SchedulerStatus {
    return { ...this.status };
  }

  /**
   * Update the next reset time based on cron schedule
   */
  private updateNextResetTime(): void {
    // Calculate next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    this.status.nextReset = tomorrow.toISOString();
  }

  /**
   * Check if it's time for a reset (useful for manual checks)
   */
  shouldReset(): boolean {
    const now = new Date();
    const lastReset = this.status.lastReset ? new Date(this.status.lastReset) : null;
    
    if (!lastReset) return true;
    
    // Check if it's a new day
    return now.toDateString() !== lastReset.toDateString();
  }
}

// Export singleton instance
export const creditResetScheduler = CreditResetScheduler.getInstance();

// Export for testing
export { CreditResetScheduler };