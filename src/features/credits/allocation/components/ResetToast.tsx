'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useCreditReset } from '../hooks/useCreditReset';

interface ResetToastProps {
  show: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
  message?: string;
  autoClose?: boolean;
  duration?: number;
}

export function ResetToast({ 
  show, 
  onClose, 
  type = 'info', 
  message, 
  autoClose = true, 
  duration = 5000 
}: ResetToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300); // Animation duration
  }, [onClose]);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(true);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [show, autoClose, duration, handleClose]);


  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseStyles = 'fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border transition-all duration-300 ease-in-out';
    const animationStyles = isAnimating 
      ? 'transform translate-x-0 opacity-100' 
      : 'transform translate-x-full opacity-0';
    
    const typeStyles = {
      success: 'border-green-200 bg-green-50',
      error: 'border-red-200 bg-red-50',
      info: 'border-blue-200 bg-blue-50'
    };

    return `${baseStyles} ${animationStyles} ${typeStyles[type]}`;
  };

  const getIconStyles = () => {
    const typeStyles = {
      success: 'text-green-600',
      error: 'text-red-600',
      info: 'text-blue-600'
    };
    return `w-5 h-5 ${typeStyles[type]}`;
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className={getIconStyles()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className={getIconStyles()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className={getIconStyles()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {message || getDefaultMessage()}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function getDefaultMessage(): string {
    switch (type) {
      case 'success':
        return 'Daily credits have been reset successfully!';
      case 'error':
        return 'Failed to reset daily credits. Please try again.';
      case 'info':
      default:
        return 'Credit reset is in progress...';
    }
  }
}

/**
 * Hook-integrated toast component that automatically shows reset notifications
 */
export function CreditResetToast() {
  const { isResetting, error, lastReset } = useCreditReset();
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const [toastMessage, setToastMessage] = useState('');
  const [lastResetTime, setLastResetTime] = useState<string | null>(null);

  // Show toast when reset starts
  useEffect(() => {
    if (isResetting) {
      setToastType('info');
      setToastMessage('Resetting daily credits...');
      setShowToast(true);
    }
  }, [isResetting]);

  // Show toast when reset completes or fails
  useEffect(() => {
    if (!isResetting && lastReset && lastReset !== lastResetTime) {
      setLastResetTime(lastReset);
      setToastType('success');
      setToastMessage('Daily credits have been reset successfully!');
      setShowToast(true);
    }
  }, [isResetting, lastReset, lastResetTime]);

  // Show toast on error
  useEffect(() => {
    if (error) {
      setToastType('error');
      setToastMessage(`Credit reset failed: ${error}`);
      setShowToast(true);
    }
  }, [error]);

  return (
    <ResetToast
      show={showToast}
      onClose={() => setShowToast(false)}
      type={toastType}
      message={toastMessage}
      autoClose={true}
      duration={toastType === 'error' ? 8000 : 5000}
    />
  );
}