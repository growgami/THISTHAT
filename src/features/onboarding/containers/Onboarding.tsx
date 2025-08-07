'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Categories from '@/features/onboarding/components/Categories';
import Tags from '@/features/onboarding/components/Tags';
import { useUserPreferences } from '@/features/onboarding/hooks/useUserPreferences';
import { OnboardingProvider, useOnboardingContext } from '@/features/onboarding/contexts/OnboardingContext';

function OnboardingContent() {
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const { selectedCategories, selectedTags, resetOnboardingState } = useOnboardingContext();
  const { savePreferences, isLoading, error } = useUserPreferences();

  const handleSavePreferences = async () => {
    const success = await savePreferences(selectedCategories, selectedTags);
    
    if (success) {
      // Set preferences saved state and show tags component
      setPreferencesSaved(true);
      setShowTags(true);
      // Note: Don't reset state here - user needs to see the Tags component with their selections
    } else {
      // Error handling is done in the hook, but we could add UI feedback here if needed
      console.error('Failed to save preferences');
    }
  };

  const handleContinue = () => {
    // Save final preferences including tags before leaving
    savePreferences(selectedCategories, selectedTags).then((success) => {
      if (!success) {
        console.error('Failed to save final preferences with tags');
        return;
      }
      // Reset onboarding state when flow is complete
      resetOnboardingState();
      // TODO: Implement actual navigation to feed
      window.location.href = '/';
    });
  };

  return (
    <div className="min-h-screen bg-background p-18 relative overflow-hidden">
      <div className="h-[calc(100vh-9rem)] rounded-sm relative z-10 flex flex-col items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center">
          
          {/* Error message display */}
          {error && (
            <div className="mb-4 p-3 bg-red-500 text-white rounded-md">
              Error: {error}
            </div>
          )}
          
          {showTags ? (
            <Tags
              onContinue={handleContinue}
            />
          ) : preferencesSaved ? (
            // Show summary after saving
            <>
              <h1 className="text-4xl font-bold text-white mb-4">Preferences Saved!</h1>
              <p className="text-gray-300 mb-8">Here are the categories and tags you selected:</p>
              
              {/* Show selected categories */}
              <div className="flex flex-wrap gap-3 mb-8 justify-center">
                {selectedCategories.map((categoryName) => (
                  <div
                    key={categoryName}
                    className="px-4 py-3 rounded-full bg-primary text-white shadow-lg shadow-primary/20"
                  >
                    {categoryName}
                  </div>
                ))}
              </div>

              {/* Show selected tags by category */}
              <div className="mb-8 max-w-2xl mx-auto">
                {Object.entries(selectedTags).map(([categoryName, tags]) => (
                  <div key={categoryName} className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-3">{categoryName} Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tagName) => (
                        <span
                          key={tagName}
                          className="px-3 py-1 rounded-full bg-secondary text-white text-sm"
                        >
                          {tagName}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setShowTags(false);
                    setPreferencesSaved(false);
                  }}
                  className="px-6 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Back to Categories
                </button>
                <button
                  onClick={handleContinue}
                  className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                >
                  Continue to Feed
                </button>
              </div>
            </>
          ) : (
            <Categories
              onSavePreferences={handleSavePreferences}
              isLoading={isLoading}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Main export component wrapped with OnboardingProvider
export default function PageContent() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
}
