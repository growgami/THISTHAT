'use client';

import { useState, useEffect } from 'react';
import { 
  SunIcon, 
  MoonIcon, 
  ChartBarIcon,
  RectangleStackIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface NavbarProps {
  showRankings: boolean;
  showThose: boolean;
  onToggleRankings: () => void;
  onToggleThose: () => void;
}

export default function Navbar({ showRankings, showThose, onToggleRankings, onToggleThose }: NavbarProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

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
        <span className="hover:text-primary-hover cursor-pointer transition-colors">Account</span>
        <span className="hover:text-primary-hover cursor-pointer transition-colors">Settings</span>
        
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
        <div className="bg-primary/10 backdrop-blur-lg px-4 py-2 shadow-xl">
          <div className="flex items-center justify-center space-x-4">
            {/* Rankings */}
            <button
              disabled
              className="flex flex-col items-center justify-center p-1.5 rounded-lg text-secondary/50 cursor-not-allowed"
              aria-label="Rankings (disabled)"
            >
              <ChartBarIcon className="w-5 h-5" />
              <span className="text-xs mt-0.5 font-medium">Rankings</span>
            </button>

            {/* Collection */}
            <button
              disabled
              className="flex flex-col items-center justify-center p-1.5 rounded-lg text-secondary/50 cursor-not-allowed"
              aria-label="Collection (disabled)"
            >
              <RectangleStackIcon className="w-5 h-5" />
              <span className="text-xs mt-0.5 font-medium">Collection</span>
            </button>

            {/* Account */}
            <button
              disabled
              className="flex flex-col items-center justify-center p-1.5 rounded-lg text-secondary/50 cursor-not-allowed"
              aria-label="Account (disabled)"
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-xs mt-0.5 font-medium">Account</span>
            </button>

            {/* Settings */}
            <button
              disabled
              className="flex flex-col items-center justify-center p-1.5 rounded-lg text-secondary/50 cursor-not-allowed"
              aria-label="Settings (disabled)"
            >
              <Cog6ToothIcon className="w-5 h-5" />
              <span className="text-xs mt-0.5 font-medium">Settings</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg text-secondary hover:text-primary-hover hover:bg-primary/10 transition-all duration-200"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
              <span className="text-xs mt-0.5 font-medium">Theme</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
