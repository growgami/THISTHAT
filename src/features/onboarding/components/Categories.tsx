'use client';

import { motion } from 'framer-motion';
import CATEGORIES_DATA from '@/features/onboarding/data/categories.json';
import { useOnboardingContext } from '@/features/onboarding/contexts/OnboardingContext';

interface CategoriesProps {
  onSavePreferences: () => void;
  isLoading: boolean;
}

export default function Categories({
  onSavePreferences,
  isLoading
}: CategoriesProps) {
  const { selectedCategories, handleCategoryToggle } = useOnboardingContext();
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">Pick Your Poison</h1>
      <p className="text-gray-300 mb-8">Select the categories you are interested in to personalize your feed</p>
      
      <div className="flex flex-wrap gap-3 mb-8">
        {CATEGORIES_DATA.map((categoryData) => (
          <motion.div
            key={categoryData.category}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`px-4 py-3 rounded-full cursor-pointer transition-all duration-200 ${selectedCategories.includes(categoryData.category) 
              ? 'bg-white text-black shadow-lg' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => handleCategoryToggle(categoryData.category)}
          >
            <h3 className="text-md font-medium">{categoryData.category}</h3>
          </motion.div>
        ))}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSavePreferences}
        disabled={selectedCategories.length === 0 || isLoading}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${selectedCategories.length === 0
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
          : 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-primary/20'}`}
      >
        {isLoading ? 'Saving...' : 'Save Preferences'}
      </motion.button>
      
      <p className={`text-sm mt-4 transition-opacity duration-200 ${selectedCategories.length === 0 ? 'opacity-100 text-gray-500' : 'opacity-0 text-transparent'}`}>
        Please select at least one category
      </p>
    </>
  );
}