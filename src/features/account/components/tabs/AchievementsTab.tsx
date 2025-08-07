'use client';

import { TrophyIcon } from '@heroicons/react/24/outline';
import { Achievement } from '../../../../types/account';

interface AchievementsTabProps {
  achievements: Achievement[];
}

export default function AchievementsTab({ achievements }: AchievementsTabProps) {
  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);

  return (
    <div className="space-y-6">
      {/* Achievements Overview */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Your Achievements</h4>
            <div className="text-3xl font-bold text-gray-900">{unlockedAchievements.length}</div>
            <div className="text-sm text-gray-600">out of {achievements.length} unlocked</div>
          </div>
          <TrophyIcon className="w-16 h-16 text-gray-300" />
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gray-800 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <TrophyIcon className="w-5 h-5 mr-2 text-gray-600" />
            Unlocked Achievements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map((achievement) => (
              <div key={achievement.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{achievement.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      Unlocked {new Date(achievement.unlockedAt!).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <TrophyIcon className="w-5 h-5 mr-2 text-gray-400" />
            Locked Achievements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedAchievements.map((achievement) => (
              <div key={achievement.id} className="bg-[#f5f5f7] rounded-lg p-4 border border-gray-200 opacity-60">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl grayscale">{achievement.icon}</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-600">{achievement.title}</h5>
                    <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Achievements */}
      {achievements.length === 0 && (
        <div className="bg-[#f5f5f7] rounded-lg p-12 text-center">
          <TrophyIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No achievements available yet</p>
        </div>
      )}
    </div>
  );
}
