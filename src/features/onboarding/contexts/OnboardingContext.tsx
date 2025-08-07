'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingContextType {
  selectedCategories: string[];
  selectedTags: Record<string, string[]>;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedTags: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  handleCategoryToggle: (categoryName: string) => void;
  handleTagToggle: (categoryName: string, tagName: string) => void;
  resetOnboardingState: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>({});

  const handleCategoryToggle = (categoryName: string) => {
    const isCurrentlySelected = selectedCategories.includes(categoryName);
    
    setSelectedCategories(prev => 
      isCurrentlySelected
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
    
    // If deselecting a category, also remove its tags
    if (isCurrentlySelected) {
      setSelectedTags(prev => {
        const newSelectedTags = { ...prev };
        delete newSelectedTags[categoryName];
        return newSelectedTags;
      });
    }
  };

  const handleTagToggle = (categoryName: string, tagName: string) => {
    setSelectedTags(prev => {
      const categoryTags = prev[categoryName] || [];
      const newCategoryTags = categoryTags.includes(tagName)
        ? categoryTags.filter(tag => tag !== tagName)
        : [...categoryTags, tagName];
      
      return {
        ...prev,
        [categoryName]: newCategoryTags
      };
    });
  };

  const resetOnboardingState = () => {
    setSelectedCategories([]);
    setSelectedTags({});
  };

  const value: OnboardingContextType = {
    selectedCategories,
    selectedTags,
    setSelectedCategories,
    setSelectedTags,
    handleCategoryToggle,
    handleTagToggle,
    resetOnboardingState
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext(): OnboardingContextType {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider');
  }
  return context;
}
