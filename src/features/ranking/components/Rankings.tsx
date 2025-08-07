'use client';

import Top3 from './Top3';
import Rankers from './Rankers';
import { useRankings } from '../hooks/useRankings';
import { useEffect } from 'react';

export default function Ranking() {
  const { data, isLoading, error, refetch } = useRankings(24); // Get 24 authors for pagination

  // Refetch data when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center w-full px-4">
        <h1 className="text-6xl md:text-8xl font-light text-primary mb-2 tracking-wide font-body drop-shadow-2xl text-center">
          Rankings
        </h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-primary text-lg">Loading rankings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center w-full px-4">
        <h1 className="text-6xl md:text-8xl font-light text-primary mb-2 tracking-wide font-body drop-shadow-2xl text-center">
          Rankings
        </h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-lg">Failed to load rankings</div>
        </div>
      </div>
    );
  }

  const allRankings = data?.rankings || [];
  
  // Get top 3 for the Top3 component
  const top3Items = allRankings.slice(0, 3).map((item, index) => ({
    ...item,
    id: index + 1, // Use the index+1 as the id for Top3 component
    avatar: item.author_pfp
  }));

  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* Centered Title */}
      <h1 className="text-6xl md:text-8xl font-light text-primary mb-2 tracking-wide font-body drop-shadow-2xl text-center">
        Rankings
      </h1>

      {/* Main content area with ranking board and top3 */}
      <div className="flex items-start justify-center w-full gap-8">
        {/* Main ranking board */}
        <Rankers allRankings={allRankings} />

        {/* Top 3 Component - Now aligned with ranking list start */}
        <div className="hidden xl:block flex-shrink-0">
          <Top3 topItems={top3Items} />
        </div>
      </div>
    </div>  
  );
}
