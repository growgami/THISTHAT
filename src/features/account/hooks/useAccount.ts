import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { 
  UserStats, 
  UserPreferences, 
  CreditTransaction, 
  Achievement 
} from '../../../types/account';

export function useAccount() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [creditHistory, setCreditHistory] = useState<CreditTransaction[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user account data
  const fetchAccountData = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;

    setIsLoading(true);
    try {
      // Fetch user stats
      const statsResponse = await fetch(`/api/users/${user.id}/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch user preferences
      const preferencesResponse = await fetch(`/api/users/${user.id}/preferences`);
      if (preferencesResponse.ok) {
        const preferencesData = await preferencesResponse.json();
        setPreferences(preferencesData);
      }

      // Fetch credit history
      const creditResponse = await fetch(`/api/users/${user.id}/credits/history`);
      if (creditResponse.ok) {
        const creditData = await creditResponse.json();
        setCreditHistory(creditData);
      }

      // Fetch achievements
      const achievementsResponse = await fetch(`/api/users/${user.id}/achievements`);
      if (achievementsResponse.ok) {
        const achievementsData = await achievementsResponse.json();
        setAchievements(achievementsData);
      }

      setError(null);
    } catch (err) {
      setError('Failed to load account data');
      console.error('Error fetching account data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  // Update user preferences
  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!isAuthenticated || !user?.id) return;

    try {
      const response = await fetch(`/api/users/${user.id}/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPreferences),
      });

      if (response.ok) {
        const updatedPreferences = await response.json();
        setPreferences(updatedPreferences);
        return true;
      }
    } catch (err) {
      console.error('Error updating preferences:', err);
    }
    return false;
  };

  // Purchase credits
  const purchaseCredits = async (amount: number, paymentMethod: string) => {
    if (!isAuthenticated || !user?.id) return;

    try {
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount,
          paymentMethod,
        }),
      });

      if (response.ok) {
        await fetchAccountData(); // Refresh data
        return true;
      }
    } catch (err) {
      console.error('Error purchasing credits:', err);
    }
    return false;
  };

  // Reset user's recommendation profile
  const resetRecommendations = async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      const response = await fetch(`/api/users/${user.id}/recommendations/reset`, {
        method: 'POST',
      });

      if (response.ok) {
        await fetchAccountData();
        return true;
      }
    } catch (err) {
      console.error('Error resetting recommendations:', err);
    }
    return false;
  };

  // Delete account
  const deleteAccount = async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (err) {
      console.error('Error deleting account:', err);
    }
    return false;
  };

  // Export user data (GDPR compliance)
  const exportUserData = async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      const response = await fetch(`/api/users/${user.id}/export`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `thisthat-user-data-${user.id}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return true;
      }
    } catch (err) {
      console.error('Error exporting user data:', err);
    }
    return false;
  };

  // Effect to fetch data when authentication changes
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchAccountData();
    } else {
      // Clear data when user logs out
      setStats(null);
      setPreferences(null);
      setCreditHistory([]);
      setAchievements([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, fetchAccountData]);

  return {
    // User data
    user,
    stats,
    preferences,
    creditHistory,
    achievements,
    
    // State
    isLoading,
    error,
    
    // Actions
    fetchAccountData,
    updatePreferences,
    purchaseCredits,
    resetRecommendations,
    deleteAccount,
    exportUserData,
  };
}

export default useAccount;
