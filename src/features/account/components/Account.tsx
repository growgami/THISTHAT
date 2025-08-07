'use client';

import { useState, useRef } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useAccount } from '../hooks/useAccount';
import { signIn, signOut } from 'next-auth/react';
import { PreferenceUpdates } from '../../../types/account';
import { 
  UserIcon,
  ChartBarIcon,
  CogIcon,
  CreditCardIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

// Tab Components
import ProfileTab from './tabs/ProfileTab';
import StatsTab from './tabs/StatsTab';
import CreditsTab from './tabs/CreditsTab';
import AchievementsTab from './tabs/AchievementsTab';
import SettingsTab from './tabs/SettingsTab';

export default function Account() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    stats, 
    preferences, 
    creditHistory, 
    achievements, 
    isLoading: accountLoading,
    error,
    updatePreferences,
    purchaseCredits,
    resetRecommendations,
    deleteAccount,
    exportUserData
  } = useAccount();

  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'settings' | 'credits' | 'achievements'>('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle sign out
  const handleSignOut = async () => {
    await signOut({ redirect: false });
  };

  // Handle preference updates
  const handlePreferenceUpdate = async (updates: PreferenceUpdates) => {
    if (!preferences) return;
    setIsUpdating(true);
    await updatePreferences(updates);
    setIsUpdating(false);
  };

  // Handle credit purchase
  const handleCreditPurchase = async (amount: number) => {
    setIsUpdating(true);
    const success = await purchaseCredits(amount, 'card');
    if (success) {
      // Show success notification
    }
    setIsUpdating(false);
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (showDeleteConfirm) {
      const success = await deleteAccount();
      if (success) {
        await signOut({ redirect: false });
      }
    } else {
      setShowDeleteConfirm(true);
    }
  };

  // Handle data export
  const handleExportData = async () => {
    const success = await exportUserData();
    if (success) {
      // Show success notification
    }
  };

  // Tab navigation
  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'stats', label: 'Stats', icon: ChartBarIcon },
    { id: 'credits', label: 'Credits', icon: CreditCardIcon },
    { id: 'achievements', label: 'Achievements', icon: TrophyIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon },
  ];

  if (authLoading) {
    return (
      <div className="flex flex-col items-center w-full px-4 pt-16 md:pt-22">
        <h1 className="text-6xl md:text-8xl font-light text-primary mb-2 tracking-wide font-body drop-shadow-2xl text-center">
          Account
        </h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-primary text-lg">Loading account...</div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show sign-in prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center w-full px-4 pt-16 md:pt-22">
        <h1 className="text-6xl md:text-8xl font-light text-primary mb-6 tracking-wide font-body drop-shadow-2xl text-center">
          Account
        </h1>
        <p className="text-lg mb-4">You need to sign in to view your account.</p>
        <button
          onClick={() => signIn('twitter')}
          className="px-4 py-2 bg-primary text-white rounded-md shadow-md hover:bg-primary-dark transition-colors"
        >
          Sign in with Twitter
        </button>
      </div>
    );
  }

  if (accountLoading) {
    return (
      <div className="flex flex-col items-center w-full px-4 pt-16 md:pt-22">
        <h1 className="text-6xl md:text-8xl font-light text-primary mb-2 tracking-wide font-body drop-shadow-2xl text-center">
          Account
        </h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-primary text-lg">Loading account data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center w-full px-4 pt-16 md:pt-22">
        <h1 className="text-6xl md:text-8xl font-light text-primary mb-2 tracking-wide font-body drop-shadow-2xl text-center">
          Account
        </h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* Header Section (in flow, stable spacing) */}
      <div className="w-full flex flex-col items-center pt-16 md:pt-22 pb-6">
        <h1 className="text-6xl md:text-8xl font-light text-primary tracking-wide font-body drop-shadow-2xl text-center">
          Account
        </h1>
        <p className="text-tertiary mt-2 font-caption">
          Manage your profile and preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="w-full max-w-6xl mb-8">
        <div className="flex justify-center space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-text-inverse border-b-2 border-text-inverse'
                    : 'text-secondary hover:text-primary-hover'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div 
        ref={scrollRef}
        className="w-full max-w-6xl overflow-y-auto pb-8"
      >
        {activeTab === 'profile' && (
          <ProfileTab 
            user={user}
            stats={stats}
            creditHistory={creditHistory}
          />
        )}

        {activeTab === 'stats' && (
          <StatsTab stats={stats} />
        )}

        {activeTab === 'credits' && (
          <CreditsTab 
            stats={stats}
            creditHistory={creditHistory}
            onCreditPurchase={handleCreditPurchase}
            isUpdating={isUpdating}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsTab achievements={achievements} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab 
            preferences={preferences}
            onPreferenceUpdate={handlePreferenceUpdate}
            onResetRecommendations={resetRecommendations}
            onSignOut={handleSignOut}
            onExportData={handleExportData}
            onDeleteAccount={handleDeleteAccount}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
            isUpdating={isUpdating}
          />
        )}
      </div>
    </div>
  );
}
