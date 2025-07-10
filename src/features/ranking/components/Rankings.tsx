'use client';

import Top3 from './Top3';
import Rankers from './Rankers';
import { useRankings } from '../hooks/useRankings';

export default function Ranking() {
  const { data, isLoading, error } = useRankings(24); // Get 24 authors for pagination

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
  const top3Items = allRankings.slice(0, 3).map(item => ({
    ...item,
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
