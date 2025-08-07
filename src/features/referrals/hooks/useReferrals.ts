import { useState, useCallback } from 'react';
import { referralService } from '../services/referralService';
import { ReferralCode, ReferralStats, ReferralHistoryItem } from '@/types/referral';

export const useReferrals = () => {
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [referralHistory, setReferralHistory] = useState<ReferralHistoryItem[]>([]);
  const [referralLink, setReferralLink] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReferralCode = useCallback(async () => {
    try {
      setLoading(true);
      const code = await referralService.getReferralCode();
      setReferralCode(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch referral code');
    } finally {
      setLoading(false);
    }
  }, []);

  const generateReferralCode = useCallback(async () => {
    try {
      setLoading(true);
      const code = await referralService.generateReferralCode();
      setReferralCode(code);
      return code;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate referral code');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const redeemReferralCode = useCallback(async (code: string) => {
    try {
      setLoading(true);
      const result = await referralService.redeemReferralCode(code);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to redeem referral code');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReferralStats = useCallback(async () => {
    try {
      setLoading(true);
      const stats = await referralService.getReferralStats();
      setReferralStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch referral stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReferralHistory = useCallback(async () => {
    try {
      setLoading(true);
      const history = await referralService.getReferralHistory();
      setReferralHistory(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch referral history');
    } finally {
      setLoading(false);
    }
  }, []);

  const getReferralLink = useCallback(async () => {
    try {
      setLoading(true);
      const link = await referralService.getReferralLink();
      setReferralLink(link);
      return link;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate referral link');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return {
    referralCode,
    referralStats,
    referralHistory,
    referralLink,
    loading,
    error,
    fetchReferralCode,
    generateReferralCode,
    redeemReferralCode,
    fetchReferralStats,
    fetchReferralHistory,
    getReferralLink,
    copyToClipboard,
  };
};
