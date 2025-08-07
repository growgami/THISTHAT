'use client';

import { useState, useEffect } from 'react';
import { useReferrals } from '../hooks/useReferrals';
import { ShareIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ReferralCardProps {
  onGenerateCode?: () => void;
  onCopyCode?: () => void;
  refreshOnMount?: boolean;
}

export default function ReferralCard({ onGenerateCode, onCopyCode, refreshOnMount = true }: ReferralCardProps) {
  const {
    referralCode,
    referralStats,
    loading,
    error,
    fetchReferralCode,
    generateReferralCode,
    getReferralLink,
    copyToClipboard,
  } = useReferrals();
  
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (refreshOnMount) {
      fetchReferralCode();
    }
  }, [fetchReferralCode, refreshOnMount]);

  const handleGenerateCode = async () => {
    try {
      await generateReferralCode();
      onGenerateCode?.();
    } catch (err) {
      console.error('Failed to generate referral code:', err);
    }
  };

  const handleCopyCode = () => {
    if (referralCode?.code) {
      copyToClipboard(referralCode.code);
      setCopied(true);
      onCopyCode?.();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = async () => {
    if (!referralLink && referralCode?.code) {
      try {
        const link = await getReferralLink();
        setReferralLink(link);
        copyToClipboard(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to generate referral link:', err);
      }
    } else {
      copyToClipboard(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading && !referralCode) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="text-red-500 text-center py-4">{error}</div>
        <button
          onClick={handleGenerateCode}
          className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Invite Friends</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Share your referral code with friends</p>
          
          {referralCode ? (
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 font-mono text-sm">
                {referralCode.code}
              </div>
              <button
                onClick={handleCopyCode}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <ClipboardIcon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={handleGenerateCode}
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Generate Referral Code
            </button>
          )}
        </div>
        
        {referralCode && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Or share this link</p>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ShareIcon className="w-5 h-5" />
                <span>Share Link</span>
              </button>
            </div>
          </div>
        )}
        
        {referralStats && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{referralStats.totalReferrals}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{referralStats.completedReferrals}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{referralStats.totalCreditsEarned}</div>
              <div className="text-xs text-gray-600">Credits</div>
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-500 pt-2">
          Earn {10} credits for each successful referral
        </div>
      </div>
    </div>
  );
}
