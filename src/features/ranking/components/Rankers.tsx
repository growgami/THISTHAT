'use client';

import { useState } from 'react';
import { RankerItem } from '../hooks/useRankings';

interface RankersProps {
  allRankings: RankerItem[];
}

export default function Rankers({ allRankings }: RankersProps) {
  const itemsPerPage = 8;
  const totalPages = Math.ceil(allRankings.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allRankings.slice(startIndex, endIndex);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const rankings = getCurrentPageItems();

  return (
    <div className="bg-background p-12 rounded-lg max-w-2xl w-full">
      {/* Rankings List - Fixed height container */}
      <div className="space-y-6 min-h-[384px]">
        {rankings.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            {/* Author info - Fixed width section */}
            <div className="flex items-center gap-3 w-48 flex-shrink-0">
              {item.author_pfp && (
                <img 
                  src={item.author_pfp} 
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="text-primary font-medium text-sm truncate">
                  {item.name}
                </div>
                <div className="text-tertiary text-xs truncate">
                  @{item.handle}
                </div>
              </div>
            </div>

            {/* Main ranking bar - Consistent width */}
            <div className="flex-1 relative min-w-0">
              <div
                className="h-8 bg-[#3a3a3c] rounded-sm transition-all duration-300 hover:bg-[#B0B0B0]"
                style={{ 
                  width: `${Math.max(30, item.score * 100)}%`,
                }}
              />
              {/* Rank number overlay */}
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2A3441] font-medium text-sm">
                #{item.rank}
              </span>
            </div>
            
            {/* Score bar - Fixed width */}
            <div className="w-24 relative flex-shrink-0">
              <div
                className="h-8 bg-[#3a3a3c] rounded-sm transition-all duration-300 hover:bg-[#909090]"
                style={{ 
                  width: `${item.score * 100}%`,
                }}
              />
              {/* Score text */}
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white font-medium text-xs">
                {Math.round(item.score * 100)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#A0A0A0] text-[#2A3441] rounded-sm font-medium text-sm hover:bg-[#B0B0B0] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Previous
        </button>
        
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-2 rounded-sm font-medium text-sm transition-all duration-300 ${
                currentPage === page
                  ? 'bg-[#3a3a3c] text-[#2A3441]'
                  : 'bg-[#3a3a3c] text-white hover:bg-[#909090]'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#3a3a3c] text-[#2A3441] rounded-sm font-medium text-sm hover:bg-[#B0B0B0] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
