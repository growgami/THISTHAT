import { useSession } from 'next-auth/react';
import TwitterSignIn from '@/features/auth/components/TwitterSignIn';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  title = "Sign in to continue",
  message = "Connect your Twitter account to access all features"
}: AuthModalProps) {
  const { data: session } = useSession();

  // Auto-close modal if user becomes authenticated
  if (session && isOpen) {
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-surface border border-border rounded-xl p-6 mx-4 max-w-md w-full shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
        
        {/* Content */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
            <p className="text-secondary text-sm">{message}</p>
          </div>
          
          {/* Sign in component */}
          <div className="pt-2">
            <TwitterSignIn />
          </div>
          
          <p className="text-xs text-tertiary">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
