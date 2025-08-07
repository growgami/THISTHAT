'use client';

import { 
  BellIcon,
  EyeIcon,
  ArrowPathIcon,
  SparklesIcon,
  DocumentArrowDownIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { UserPreferences, PreferenceUpdates } from '../../../../types/account';

interface SettingsTabProps {
  preferences: UserPreferences | null;
  onPreferenceUpdate: (updates: PreferenceUpdates) => Promise<void>;
  onResetRecommendations: () => Promise<boolean | undefined>;
  onSignOut: () => Promise<void>;
  onExportData: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  isUpdating: boolean;
}

export default function SettingsTab({
  preferences,
  onPreferenceUpdate,
  onResetRecommendations,
  onSignOut,
  onExportData,
  onDeleteAccount,
  showDeleteConfirm,
  setShowDeleteConfirm,
  isUpdating
}: SettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <BellIcon className="w-5 h-5 mr-2 text-gray-600" />
          Notifications
        </h4>
        {preferences && (
          <div className="space-y-4">
            {Object.entries(preferences.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <button
                  onClick={() => onPreferenceUpdate({ 
                    notifications: { 
                      ...preferences.notifications, 
                      [key]: !value 
                    } 
                  })}
                  disabled={isUpdating}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-gray-800' : 'bg-gray-200'
                  } disabled:opacity-50`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <EyeIcon className="w-5 h-5 mr-2 text-gray-600" />
          Privacy
        </h4>
        {preferences && (
          <div className="space-y-4">
            {Object.entries(preferences.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <button
                  onClick={() => onPreferenceUpdate({
                    privacy: { ...preferences.privacy, [key]: !value }
                  })}
                  disabled={isUpdating}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-gray-800' : 'bg-gray-200'
                  } disabled:opacity-50`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendation Settings */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <SparklesIcon className="w-5 h-5 mr-2 text-gray-600" />
          Recommendations
        </h4>
        {preferences && (
          <div className="space-y-4">
            <div className="py-2 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Diversity Level</span>
                <span className="text-sm font-medium text-gray-900">{preferences.recommendations.diversityLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={preferences.recommendations.diversityLevel}
                onChange={(e) => onPreferenceUpdate({
                  recommendations: { 
                    ...preferences.recommendations, 
                    diversityLevel: parseInt(e.target.value) 
                  }
                })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <button
              onClick={onResetRecommendations}
              disabled={isUpdating}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>Reset Recommendations</span>
            </button>
          </div>
        )}
      </div>

      {/* Account Management */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <h4 className="font-semibold text-gray-900 mb-4">Account Management</h4>
        <div className="space-y-3">
          <button
            onClick={onExportData}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 w-full justify-center shadow-sm hover:shadow-md"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span>Export My Data</span>
          </button>
          
          <button
            onClick={onSignOut}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-all duration-200 w-full justify-center shadow-sm hover:shadow-md"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onDeleteAccount}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 w-full justify-center shadow-sm hover:shadow-md ${
              showDeleteConfirm 
                ? 'bg-gray-800 hover:bg-gray-900 text-white' 
                : 'bg-gray-500 hover:bg-gray-600 text-white'
            }`}
          >
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span>{showDeleteConfirm ? 'Confirm Delete Account' : 'Delete Account'}</span>
          </button>
          
          {showDeleteConfirm && (
            <div className="bg-[#f5f5f7] border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="mt-2 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
