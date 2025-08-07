'use client';

import { CalendarDaysIcon, PencilIcon } from '@heroicons/react/24/outline';
import { User } from 'next-auth';
import { UserStats, CreditTransaction } from '@/types/account';
import Image from 'next/image';
import ReferralCard from '@/features/referrals/components/ReferralCard';
import { useUserPrefState } from '@/features/onboarding/hooks/useUserPrefState';

interface ProfileTabProps {
  user: User;
  stats: UserStats | null;
  creditHistory: CreditTransaction[];
}

export default function ProfileTab({ user, stats, creditHistory }: ProfileTabProps) {
  const { userPreferences, isLoading, error } = useUserPrefState(user?.id || null);

  // Get preferred categories (with weight > 0)
  const preferredCategories = userPreferences?.categoryPreferences ? 
    Object.entries(userPreferences.categoryPreferences)
      .filter(([, weight]) => weight > 0)
      .map(([category]) => category) : [];

  // Get preferred tags (with weight > 0)
  // Extract only the tag name part (after the colon)
  const preferredTags = userPreferences?.tagPreferences ? 
    Object.entries(userPreferences.tagPreferences)
      .filter(([, weight]) => weight > 0)
      .map(([tag]) => {
        const parts = tag.split(':');
        return parts.length > 1 ? parts[1] : tag;
      }) : [];
  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={user.image || '/assets/default-avatar.png'}
              alt="Profile"
              width={64}
              height={64}
              className="rounded-full border-2 border-gray-100 shadow-sm"
            />
            {stats?.currentStreak && stats.currentStreak > 0 && (
              <div className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {stats.currentStreak}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            {stats && (
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span className="text-gray-500">Level {stats.level}</span>
                <span className="text-gray-500">Rank #{stats.rank}</span>
                <span className="text-gray-500">{stats.accountAge} days</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="text-2xl font-bold text-gray-900">{stats.totalSwipes}</div>
            <div className="text-xs text-gray-600 mt-1">Total Swipes</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="text-2xl font-bold text-gray-900">{stats.totalCreditsEarned}</div>
            <div className="text-xs text-gray-600 mt-1">Credits Earned</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="text-2xl font-bold text-gray-900">{stats.totalMarketsParticipated}</div>
            <div className="text-xs text-gray-600 mt-1">Markets</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="text-2xl font-bold text-gray-900">{stats.currentStreak}</div>
            <div className="text-xs text-gray-600 mt-1">Day Streak</div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <CalendarDaysIcon className="w-5 h-5 mr-2 text-gray-600" />
          Recent Activity
        </h4>
        {creditHistory.length > 0 ? (
          <div className="space-y-3">
            {creditHistory.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'earned' ? 'bg-gray-800' : 
                    transaction.type === 'spent' ? 'bg-gray-500' : 'bg-gray-600'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.type === 'earned' ? 'Credits Earned' : 
                       transaction.type === 'spent' ? 'Credits Spent' : 'Credits Purchased'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${
                  transaction.type === 'earned' ? 'text-gray-800' : 
                  transaction.type === 'spent' ? 'text-gray-600' : 'text-gray-700'
                }`}>
                  {transaction.type === 'spent' ? '-' : '+'}{transaction.amount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#f5f5f7] rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm">No recent activity</p>
          </div>
        )}
      </div>
      
      {/* User Preferences Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Your Interests</h4>
          <button 
            onClick={() => window.location.href = '/pick-your-poison'}
            className="flex items-center text-sm text-primary hover:text-primary-hover hover:border-b hover:border-primary-hover cursor-pointer transition-colors"
          >
            <PencilIcon className="w-4 h-4 mr-1" />
            Update
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-gray-600">Loading preferences...</div>
        ) : error ? (
          <div className="text-red-500">Error loading preferences: {error}</div>
        ) : (
          <>
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Categories</h5>
              {preferredCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {preferredCategories.map((category) => (
                    <span 
                      key={category}
                      className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No categories selected</p>
              )}
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Tags</h5>
              {preferredTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {preferredTags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No tags selected</p>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Referral Card */}
      <ReferralCard refreshOnMount={true} />
    </div>
  );
}
