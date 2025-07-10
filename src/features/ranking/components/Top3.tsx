'use client';

import Image from 'next/image';

interface TopItem {
  id: number;
  name: string;
  handle: string;
  score: number;
  rank: number;
  avatar?: string;
}

interface Top3Props {
  topItems: TopItem[];
}

export default function Top3({ topItems }: Top3Props) {
  // Ensure we have exactly 3 items
  const top3 = topItems.slice(0, 3);
  
  // Default avatar for items without one
  const defaultAvatar = "/assets/default-avatar.png";

  return (
    <div className="flex flex-col items-center w-full">
      {/* Top 1 - Centered at top */}
      {top3[0] && (
        <div className="flex flex-col items-center mb-8">
          <div className="text-[#c0b3a0] font-medium text-lg mb-3">
            TOP 1
          </div>
          <div className="bg-[#A0A0A0] rounded-lg w-32 h-32 flex items-center justify-center hover:bg-[#B0B0B0] transition-all duration-300 overflow-hidden">
            <Image 
              src={top3[0].avatar || defaultAvatar} 
              alt={top3[0].name}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center mt-3">
            <div className="text-[#c0b3a0] font-medium text-sm">
              {top3[0].name}
            </div>
            <div className="text-[#808080] text-xs">
              @{top3[0].handle || top3[0].name.toLowerCase().replace(/\s+/g, '')}
            </div>
          </div>
        </div>
      )}

      {/* Top 2 and 3 - Side by side at bottom */}
      <div className="flex gap-6">
        {/* Top 2 - Left */}
        {top3[1] && (
          <div className="flex flex-col items-center">
            <div className="text-[#c0b3a0] font-medium text-lg mb-3">
              TOP 2
            </div>
            <div className="bg-[#808080] rounded-lg w-32 h-32 flex items-center justify-center hover:bg-[#909090] transition-all duration-300 overflow-hidden">
              <Image 
                src={top3[1].avatar || defaultAvatar} 
                alt={top3[1].name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center mt-3">
              <div className="text-[#c0b3a0] font-medium text-sm">
                {top3[1].name}
              </div>
              <div className="text-[#808080] text-xs">
                @{top3[1].handle || top3[1].name.toLowerCase().replace(/\s+/g, '')}
              </div>
            </div>
          </div>
        )}

        {/* Top 3 - Right */}
        {top3[2] && (
          <div className="flex flex-col items-center">
            <div className="text-[#c0b3a0] font-medium text-lg mb-3">
              TOP 3
            </div>
            <div className="bg-[#606060] rounded-lg w-32 h-32 flex items-center justify-center hover:bg-[#707070] transition-all duration-300 overflow-hidden">
              <Image 
                src={top3[2].avatar || defaultAvatar} 
                alt={top3[2].name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center mt-3">
              <div className="text-[#c0b3a0] font-medium text-sm">
                {top3[2].name}
              </div>
              <div className="text-[#808080] text-xs">
                @{top3[2].handle || top3[2].name.toLowerCase().replace(/\s+/g, '')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
