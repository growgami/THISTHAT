'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  SunIcon, 
  MoonIcon, 
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import AccountDropdown from './AccountDropdown';
import AuthModal from '@/features/auth/containers/AuthModal';
import XLoginModal from '@/features/auth/components/XLoginModal';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface NavbarProps {
  showRankings: boolean;
  /* showThose: boolean; */
  showAccount: boolean;
  onToggleRankings: () => void;
  /* onToggleThose: () => void; */
  onToggleAccount: () => void;
}

export default function Navbar({ showRankings,/* showThose,*/ showAccount, onToggleRankings,/* onToggleThose,*/ onToggleAccount }: NavbarProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isXLoginModalOpen, setIsXLoginModalOpen] = useState(false);
  const accountRef = useRef<HTMLSpanElement>(null);
  const { isAuthenticated } = useAuth();

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Default to dark theme
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const showLoginModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const showXLoginModal = () => {
    setIsXLoginModalOpen(true);
  };

  const closeXLoginModal = () => {
    setIsXLoginModalOpen(false);
  };

  const handleAccountClick = () => {
    // If user is not authenticated, show XLoginModal
    if (!isAuthenticated) {
      showXLoginModal();
    } else {
      // If user is authenticated, toggle account view as before
      onToggleAccount();
    }
  };

  return (
    <>
      {/* Desktop Navbar - Hidden on mobile */}
      <div className="hidden md:flex fixed top-6 right-6 space-x-8 text-secondary text-sm font-medium z-50">
        <span 
          className={`cursor-pointer transition-colors ${
            showRankings 
              ? 'text-primary-hover border-b border-primary-hover' 
              : 'hover:text-primary-hover'
          }`}
          onClick={onToggleRankings}
        >
          Rankings
        </span>
        {/*
        <span 
          className={`cursor-pointer transition-colors ${
            showThose 
              ? 'text-primary-hover border-b border-primary-hover' 
              : 'hover:text-primary-hover'
          }`}
          onClick={onToggleThose}
        >
          Collection
        </span>
        */}
        
        {/* Accounts Section with Dropdown */}
        <span 
          ref={accountRef}
          className="relative cursor-pointer transition-colors hover:text-primary-hover"
          onMouseEnter={() => setIsAccountDropdownOpen(true)}
          onMouseLeave={() => {
            // Add a small delay before closing the dropdown to allow moving cursor to the dropdown
            setTimeout(() => {
              if (accountRef.current && !accountRef.current.matches(':hover')) {
                setIsAccountDropdownOpen(false);
              }
            }, 100);
          }}
          onClick={(e) => {
            // Only trigger handleAccountClick if the click is directly on the "Accounts" text
            if (e.target === e.currentTarget || (e.target as HTMLElement).textContent === 'Accounts') {
              handleAccountClick();
            }
          }}
        >
          <span className={`${showAccount ? 'text-primary-hover border-b border-primary-hover' : ''}`}>
            Accounts
          </span>
          {isAccountDropdownOpen && (
            <div
              onMouseEnter={() => setIsAccountDropdownOpen(true)}
              onMouseLeave={() => setIsAccountDropdownOpen(false)}
            >
              <AccountDropdown showLoginModal={showLoginModal} onToggleAccount={onToggleAccount} />
            </div>
          )}
        </span>
        {/*
        <span className="hover:text-primary-hover cursor-pointer transition-colors">Settings</span>
        */}
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-6 h-6 text-primary hover:text-primary-hover transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Dock - Bottom positioned, visible only on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-primary/20 backdrop-blur-xl border-t border-primary/20 px-6 py-3 shadow-2xl">
          <div className="flex items-center justify-center space-x-6">
            {/* Rankings */}
            <button
              onClick={onToggleRankings}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                showRankings 
                  ? 'text-primary-hover bg-primary/20 shadow-lg' 
                  : 'text-secondary hover:text-primary-hover hover:bg-primary/15'
              }`}
              aria-label="Rankings"
            >
              <ChartBarIcon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">Rankings</span>
            </button>

            {/* Collection 
            <button
              onClick={onToggleThose}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                showThose 
                  ? 'text-primary-hover bg-primary/20 shadow-lg' 
                  : 'text-secondary hover:text-primary-hover hover:bg-primary/15'
              }`}
              aria-label="Collection"
            >
              <RectangleStackIcon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">Collection</span>
            </button>
            */}

            {/* Account - Show auth state on mobile too */}
            <button
              onClick={handleAccountClick}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                showAccount 
                  ? 'text-primary-hover bg-primary/20 shadow-lg' 
                  : 'text-secondary hover:text-primary-hover hover:bg-primary/15'
              }`}
              aria-label="Account"
            >
              <UserIcon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">Account</span>
            </button>

            {/* Settings */}
            <button
              disabled
              className="flex flex-col items-center justify-center p-2 rounded-xl text-secondary/50 cursor-not-allowed min-w-[60px]"
              aria-label="Settings (disabled)"
            >
              <Cog6ToothIcon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">Settings</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex flex-col items-center justify-center p-2 rounded-xl text-secondary hover:text-primary-hover hover:bg-primary/15 transition-all duration-200 min-w-[60px]"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <SunIcon className="w-6 h-6" />
              ) : (
                <MoonIcon className="w-6 h-6" />
              )}
              <span className="text-xs mt-1 font-medium">Theme</span>
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        title="Sign in to continue"
        message="Connect your Twitter account to access all features"
      />

      {/* X Login Modal */}
      <XLoginModal 
        isOpen={isXLoginModalOpen} 
        onClose={closeXLoginModal} 
      />
    </>
  );
}
