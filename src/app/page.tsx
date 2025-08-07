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
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  
  // Check if user has category preferences
  const hasCategoryPreferences = userPreferences?.categoryPreferences && 
    Object.keys(userPreferences.categoryPreferences).length > 0;
  
  // For now, we'll use hasCategoryPreferences for the redirect logic
  // but hasPreferences is available if we want to check for any preferences

  useEffect(() => {
    // Redirects should only fire on desktop screens to avoid navigating away on mobile notice
    if (isMobile !== false) return;
    // Redirect to onboarding if user is authenticated but has no category preferences
    if (isAuthenticated && !prefsLoading && !hasCategoryPreferences) {
      router.push('/pick-your-poison');
    }
  }, [isAuthenticated, hasCategoryPreferences, prefsLoading, router, isMobile]);

  // Detect mobile viewport and toggle mobile-only view
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767.98px)');
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  // Mobile-only notice
  if (isMobile === null) {
    return <div />;
  }
  if (isMobile) {
    return (
      <section className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-[#0B1020] to-[#0B0D18] p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/80">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
              <rect x="3" y="4.5" width="18" height="12" rx="2" ry="2" />
              <path d="M12 16.5V21" />
              <path d="M8 21h8" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Best experienced on desktop</h1>
          <p className="mt-2 text-sm leading-6 text-white/70">
            For the full THISTHAT experience — richer visuals, keyboard shortcuts, and advanced interactions —
            please view this on a desktop or larger screen.
          </p>
          <div className="mt-6 rounded-lg bg-white/5 px-4 py-3 text-xs text-white/60">
            Tip: Resize your window or switch to a desktop device to continue.
          </div>
        </div>
      </section>
    );
  }

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
