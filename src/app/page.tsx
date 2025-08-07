'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageContent from '@/components/containers/main/PageContent';
import XLoginModal from '@/features/auth/components/XLoginModal';
import Onboarding from '@/features/onboarding/containers/Onboarding';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useUserPrefState } from '@/features/onboarding/hooks/useUserPrefState';

export default function Home() {
  const router = useRouter();
  const { userId, isAuthenticated, isLoading: authLoading } = useAuth();
  const { userPreferences, isLoading: prefsLoading } = useUserPrefState(userId);
  const [showLoginModal, setShowLoginModal] = useState(true);
  
  // Check if user has category preferences
  const hasCategoryPreferences = userPreferences?.categoryPreferences && 
    Object.keys(userPreferences.categoryPreferences).length > 0;
  
  // For now, we'll use hasCategoryPreferences for the redirect logic
  // but hasPreferences is available if we want to check for any preferences

  useEffect(() => {
    // Redirect to onboarding if user is authenticated but has no category preferences
    if (isAuthenticated && !prefsLoading && !hasCategoryPreferences) {
      router.push('/pick-your-poison');
    }
  }, [isAuthenticated, hasCategoryPreferences, prefsLoading, router]);

  // Show loading state while checking auth and preferences
  if (authLoading || prefsLoading) {
    return <div>Loading...</div>;
  }

  // If user is not authenticated, show the login modal
  if (!isAuthenticated) {
    return (
      <>
        <XLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        {/* If modal is closed, show onboarding as fallback */}
        {!showLoginModal && <Onboarding />}
      </>
    );
  }

  // If user is authenticated and has preferences, show main content
  return <PageContent />;
}
