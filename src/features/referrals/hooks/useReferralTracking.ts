import { useEffect } from 'react';
import { useReferrals } from './useReferrals';

/**
 * Hook to automatically track and process referral codes from URL parameters
 * This should be used in the main layout or page component
 */
export const useReferralTracking = () => {
  const { redeemReferralCode } = useReferrals();

  useEffect(() => {
    const processReferralCode = async () => {
      // Check if we're running on the client side
      if (typeof window === 'undefined') return;

      // Get the ref parameter from URL
      const urlParams = new URLSearchParams(window.location.search);
      const referralCode = urlParams.get('ref');
      
      // If no referral code, do nothing
      if (!referralCode) return;

      try {
        // Attempt to redeem the referral code
        const result = await redeemReferralCode(referralCode);
        
        if (result.success) {
          // Show success message
          alert(`Referral Code Redeemed! You've successfully redeemed a referral code and earned ${result.creditsAwarded} credits!`);
          
          // Remove the ref parameter from URL without reloading the page
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('ref');
          window.history.replaceState({}, '', newUrl.toString());
        } else {
          // Show error message
          alert(`Referral Code Invalid: ${result.message}`);
        }
      } catch (error) {
        // Show error message
        alert('Error Processing Referral: Failed to process the referral code. Please try again.');
        console.error('Error processing referral code:', error);
      }
    };

    // Process referral code when component mounts
    processReferralCode();
  }, [redeemReferralCode]);
};
