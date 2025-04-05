import React, { useState, useEffect } from 'react';
import { useSdk } from '../hooks/useSdk';
import { Track } from '@audius/sdk';


const Music: React.FC = () => {
  const { sdk } = useSdk();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadTime, setLoadTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrendingTracks = async () => {
      const startTime = performance.now();
      
      try {
        setIsLoading(true);
        // Fetch trending tracks from Audius SDK
        const response = await sdk.tracks.getTrendingTracks({
          time: 'week'
        });
        
        setTracks(response.data || []);
      } catch (error) {
        console.error('Error fetching trending tracks:', error);
      } finally {
        setIsLoading(false);
        const endTime = performance.now();
        const durationMs = endTime - startTime;
        const durationSeconds = (durationMs / 1000).toFixed(2);
        setLoadTime(durationSeconds);
      }
    };

    fetchTrendingTracks();
  }, [sdk]);

  if (isLoading) {
    return (
      <div className="font-[Arial]">
        <div className="text-[#666] text-[13px] mb-[10px] pb-[2px]">
          Loading...
        </div>
      </div>
    );
  }

  return loadTime ? (
    <div className="font-[Arial]">
      <div className="text-[#666] text-[13px] mb-[10px] pb-[2px]">
        Results 1-{tracks.length} of many (in {loadTime} seconds)
      </div>
      
      {tracks.map((track) => (
        <div key={track.id} className="mb-[22px]">
          <div className="text-[#2200C1] text-[16px] mb-[1px] underline cursor-pointer font-normal leading-[1.2]">
            {track.title}
          </div>
          <div className="text-[#00802A] text-[13px] leading-[1.4]">
            {track.permalink}
          </div>
          <div className="text-black text-[13px] leading-[1.4] mt-[1px] font-[Arial]">
            {track.user.name} ({track.user.handle}) - {track.description}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="font-[Arial]">
      <div className="text-[#666] text-[13px] mb-[10px] pb-[2px]">
      </div>
    </div>
  );
};

export default Music; 