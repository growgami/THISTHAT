'use client';

import { ChartBarIcon } from '@heroicons/react/24/outline';
import { UserStats } from '../../../../types/account';

interface StatsTabProps {
  stats: UserStats | null;
}

export default function StatsTab({ stats }: StatsTabProps) {
  if (!stats) {
    return (
      <div className="bg-[#f5f5f7] rounded-lg p-12 text-center">
        <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No stats available yet. Start swiping to see your progress!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2 text-gray-600" />
          Performance Overview
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{stats.totalSwipes}</div>
            <div className="text-sm text-gray-600">Total Swipes</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gray-800 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((stats.totalSwipes / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{stats.totalCreditsEarned}</div>
            <div className="text-sm text-gray-600">Credits Earned</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gray-700 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((stats.totalCreditsEarned / 500) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{stats.totalMarketsParticipated}</div>
            <div className="text-sm text-gray-600">Markets Joined</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gray-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((stats.totalMarketsParticipated / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <h5 className="font-medium text-gray-900 mb-4">Engagement Stats</h5>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600">Current Streak</span>
              <span className="font-semibold text-gray-900">{stats.currentStreak} days</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600">Favorite Category</span>
              <span className="font-semibold text-gray-900">{stats.favoriteCategory}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600">Account Level</span>
              <span className="font-semibold text-gray-900">Level {stats.level}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Global Rank</span>
              <span className="font-semibold text-gray-900">#{stats.rank}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <h5 className="font-medium text-gray-900 mb-4">Market Activity</h5>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600">Markets Created</span>
              <span className="font-semibold text-gray-900">{stats.totalMarketsCreated}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600">Markets Participated</span>
              <span className="font-semibold text-gray-900">{stats.totalMarketsParticipated}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600">Credits Spent</span>
              <span className="font-semibold text-gray-900">{stats.totalCreditsSpent}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Net Credits</span>
              <span className={`font-semibold ${
                (stats.totalCreditsEarned - stats.totalCreditsSpent) >= 0 ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {stats.totalCreditsEarned - stats.totalCreditsSpent}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
