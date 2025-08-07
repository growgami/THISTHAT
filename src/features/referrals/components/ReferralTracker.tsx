'use client';

import { useReferralTracking } from '../hooks/useReferralTracking';

/**
 * Client component to handle referral tracking
 * This component should be used in the main layout to automatically
 * process referral codes from URLs
 */
export function ReferralTracker() {
  useReferralTracking();
  return null;
}
