import Image from 'next/image';

interface MetricsProps {
  streak?: number;
  totalScores?: number;
  mostLikedCategory?: string;
  globalMostLikedTweet?: {
    id: string;
    content: string;
    author: string;
    handle: string;
    likes: number;
    avatar?: string;
  };
}

export default function Metrics({ 
  streak = 47,
  totalScores = 2847,
  mostLikedCategory = "AI and Technology",
  globalMostLikedTweet = {
    id: "1",
    content: "The future of AI is not about replacing humans, but empowering them to achieve things they never thought possible.",
    author: "Tech Visionary",
    handle: "techvisionary",
    likes: 1254,
    avatar: "/assets/default-avatar.png"
  }
}: MetricsProps) {
  const defaultAvatar = "/assets/default-avatar.png";

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Streak and Total Scores Row */}
      <div className="flex gap-4">
        {/* Streak */}
        <div className="flex flex-col items-center bg-[#A0A0A0] rounded-lg p-4 w-28 h-20 justify-center hover:bg-[#B0B0B0] transition-all duration-300">
          <div className="text-[#2A3441] font-bold text-xl">
            {streak}
          </div>
          <div className="text-[#2A3441] font-medium text-xs text-center">
            Day Streak
          </div>
        </div>

        {/* Total Scores */}
        <div className="flex flex-col items-center bg-[#808080] rounded-lg p-4 w-28 h-20 justify-center hover:bg-[#909090] transition-all duration-300">
          <div className="text-white font-bold text-xl">
            {totalScores.toLocaleString()}
          </div>
          <div className="text-white font-medium text-xs text-center">
            Points Given
          </div>
        </div>
      </div>

      {/* Most Liked Category */}
      <div className="bg-[#c0b3a0] rounded-lg p-4 w-full hover:bg-[#d0c3b0] transition-all duration-300">
        <div className="text-center">
          <div className="text-[#2A3441] font-bold text-sm mb-1">
            {mostLikedCategory}
          </div>
          <div className="text-[#2A3441] font-medium text-xs">
            Most preferred category
          </div>
        </div>
      </div>

      {/* Global Most Liked Tweet - Mini Card */}
      <div className="bg-[#606060] rounded-lg p-3 w-full hover:bg-[#707070] transition-all duration-300">
        <div className="text-[#c0b3a0] font-medium text-xs mb-2 text-center">
          Global Most Liked Tweet
        </div>
        
        {/* Tweet Content */}
        <div className="bg-[#2A3441] rounded-md p-3 mb-2">
          <div className="flex items-start gap-2 mb-2">
            <Image 
              src={globalMostLikedTweet.avatar || defaultAvatar} 
              alt={globalMostLikedTweet.author}
              width={24}
              height={24}
              className="rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[#c0b3a0] font-medium text-xs truncate">
                  {globalMostLikedTweet.author}
                </span>
                <span className="text-[#808080] text-xs">
                  @{globalMostLikedTweet.handle}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-[#c0b3a0] text-xs leading-relaxed mb-2 line-clamp-3">
            {globalMostLikedTweet.content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-[#808080] text-xs">
              ❤️ {globalMostLikedTweet.likes.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
