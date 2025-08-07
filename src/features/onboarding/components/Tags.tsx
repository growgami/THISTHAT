'use client';

import { motion } from 'framer-motion';
import CATEGORIES_DATA from '@/features/onboarding/data/categories.json';
import { useOnboardingContext } from '@/features/onboarding/contexts/OnboardingContext';

interface TagsProps {
  onContinue: () => void;
}

export default function Tags({
  onContinue
}: TagsProps) {
  const { selectedCategories, selectedTags, handleTagToggle } = useOnboardingContext();
  
  // Get tags for selected categories only
  const filteredCategories = CATEGORIES_DATA.filter(category => 
    selectedCategories.includes(category.category)
  );

  // Calculate total number of selected tags
  const totalSelectedTags = Object.values(selectedTags).reduce(
    (total, categoryTags) => total + categoryTags.length,
    0
  );

  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">Refine Your Interests</h1>
      <p className="text-gray-300 mb-8">Select specific tags within your chosen categories</p>
      
      {/* Show all available tags for selected categories with consistent badge sizes */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {filteredCategories.map((categoryData) => (
          categoryData.tags.map((tag) => (
            <div
              key={`${categoryData.category}-${tag.name}`}
              className={`px-4 py-3 rounded-full text-md cursor-pointer transition-all duration-200 ${selectedTags[categoryData.category]?.includes(tag.name)
                ? 'bg-white text-black shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              onClick={() => handleTagToggle(categoryData.category, tag.name)}
            >
              {tag.name}
            </div>
          ))
        ))}
      </div>
      
      <div className="flex gap-4 justify-center">
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          disabled={totalSelectedTags === 0}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${totalSelectedTags === 0
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-primary/20'}`}
        >
          Continue to Feed
        </motion.button>
      </div>
      
      <p className={`text-sm mt-4 transition-opacity duration-200 ${totalSelectedTags === 0 ? 'opacity-100 text-gray-500' : 'opacity-0 text-transparent'}`}>
        Please select at least one tag
      </p>
    </>
  );
}