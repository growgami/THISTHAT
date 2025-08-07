'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { signOut } from 'next-auth/react';
import { useRef } from 'react';

interface AccountDropdownProps {
  showLoginModal: () => void;
  onToggleAccount: () => void;
}

export default function AccountDropdown({ showLoginModal, onToggleAccount }: AccountDropdownProps) {
  const { isAuthenticated } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAccountClick = (e: React.MouseEvent) => {
    // Prevent the click from bubbling up to the parent which might close the dropdown
    e.stopPropagation();
    if (isAuthenticated) {
      onToggleAccount();
    } else {
      showLoginModal();
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  if (!isAuthenticated) {
    return (
      <div 
        ref={dropdownRef}
        className="absolute right-0 mt-2 w-48 bg-base-100 rounded-md shadow-lg py-1 z-50"
      >
        <button
          onClick={showLoginModal}
          className="block w-full text-left px-4 py-2 text-sm text-secondary hover:bg-base-200 hover:text-primary transition-all duration-200 ease-in-out active:bg-base-300 active:scale-95"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-48 bg-base-100 rounded-md shadow-lg py-1 z-50"
    >
      <button
        onClick={handleAccountClick}
        className="block w-full text-left px-4 py-2 text-sm text-secondary hover:bg-black/10 hover:text-primary transition-all duration-200 ease-in-out active:bg-base-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        Account
      </button>
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 ease-in-out active:bg-red-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500/20"
      >
        Log Out
      </button>
    </div>
  );
}

