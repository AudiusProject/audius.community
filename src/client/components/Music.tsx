import React, { useState, useEffect } from 'react';
import { useSdk } from '../hooks/useSdk';
import { useMusicContext } from '../contexts/MusicContext';

interface MusicProps {
  searchText: string;
  onSearch: number;
}

const Music: React.FC<MusicProps> = ({ searchText, onSearch }) => {
  const { sdk } = useSdk();
  const { 
    tracks, 
    setTracks, 
    playingTrackId, 
    isPlaying, 
    loadingTrackId, 
    togglePlayPause 
  } = useMusicContext();
  
  const [loadTime, setLoadTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearchResult, setIsSearchResult] = useState<boolean>(false);
  const [prevSearchKey, setPrevSearchKey] = useState<number>(onSearch);
  const [displayedSearchText, setDisplayedSearchText] = useState<string>('');

  // Fetch trending tracks
  const fetchTrendingTracks = async () => {
    const startTime = performance.now();
    
    try {
      setIsLoading(true);
      setIsSearchResult(false);
      // Fetch trending tracks from Audius SDK
      // TODO: put sdk back once using bridgerton
      // const response = await sdk.tracks.getTrendingTracks({
      //   time: 'week'
      // });
      const response = await fetch('https://bridgerton.audius.co/v1/tracks/trending?time=week&limit=10');
      const data = await response.json();
      setTracks(data.data || []);
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

  // Search for tracks
  const searchTracks = async () => {
    // Special case for empty search or "trending" keyword
    if (!searchText.trim() || searchText.trim().toLowerCase() === 'trending') {
      // Show trending tracks for empty search or "trending" keyword
      fetchTrendingTracks();
      setDisplayedSearchText('trending');
      return;
    }

    const startTime = performance.now();
    
    try {
      setIsLoading(true);
      setIsSearchResult(true);
      // Update the displayed search text when search is triggered
      setDisplayedSearchText(searchText);
      
      // Search tracks from Audius SDK
      const response = await sdk.tracks.searchTracks({
        query: searchText
      });
      
      const data = response.data || [];
      setTracks(data);
    } catch (error) {
      console.error('Error searching tracks:', error);
    } finally {
      setIsLoading(false);
      const endTime = performance.now();
      const durationMs = endTime - startTime;
      const durationSeconds = (durationMs / 1000).toFixed(2);
      setLoadTime(durationSeconds);
    }
  };

  // Function to handle clicking on a track title
  const handleTrackClick = (permalink: string) => {
    window.open(permalink, '_blank', 'noopener,noreferrer');
  };

  // Format track description: truncate if longer than 200 characters
  const formatDescription = (description: string | null | undefined): string => {
    if (!description) return '';
    
    if (description.length > 200) {
      return description.substring(0, 200) + '...';
    }
    
    return description;
  };

  // Initial load - fetch trending tracks
  useEffect(() => {
    if (searchText === 'trending') {
      fetchTrendingTracks();
      setDisplayedSearchText('trending');
    } else {
      searchTracks();
    }
  }, []);

  // When search button is clicked (searchKey changes)
  useEffect(() => {
    if (onSearch !== prevSearchKey) {
      setPrevSearchKey(onSearch);
      searchTracks();
    }
  }, [onSearch, searchText]);

  // Spinner component for loading state
  const LoadingSpinner = () => (
    <div className="ml-1 inline-flex items-center justify-center">
      <span className="text-[#6666DD] text-lg px-0.5" style={{ animation: 'pulse 0.8s infinite', animationDelay: '0s' }}>•</span>
      <span className="text-[#6666DD] text-lg px-0.5" style={{ animation: 'pulse 0.8s infinite', animationDelay: '0.4s' }}>•</span>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );

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
        {isSearchResult 
          ? `Results 1-${tracks.length} for "${displayedSearchText}" (in ${loadTime} seconds)` 
          : `Trending tracks 1-${tracks.length} of many (in ${loadTime} seconds)`}
      </div>
      
      {tracks.map((track) => {
        const fullPermalink = `https://audius.co${track.permalink}`;
        const description = formatDescription(track.description);
        const isCurrentTrackPlaying = track.id === playingTrackId && isPlaying;
        const isCurrentTrackLoading = track.id === loadingTrackId;
        
        return (
          <div key={track.id} className="mb-[22px]">
            <div className="flex items-center">
              <div 
                className="text-[#2200C1] text-[16px] mb-[1px] underline cursor-pointer font-normal leading-[1.2] overflow-hidden whitespace-nowrap text-ellipsis max-w-[90%]"
                onClick={() => handleTrackClick(fullPermalink)}
                title={track.title}
              >
                {track.title}
              </div>
              {isCurrentTrackLoading ? (
                <LoadingSpinner />
              ) : (
                <button
                  className="text-[#2200C1] ml-1 text-xl cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause(track.id);
                  }}
                  aria-label={isCurrentTrackPlaying ? "Pause" : "Play"}
                  disabled={isCurrentTrackLoading}
                >
                  {isCurrentTrackPlaying ? "⏸️" : "▶️"}
                </button>
              )}
            </div>
            <div className="text-[#00802A] text-[13px] leading-[1.4]">
              {fullPermalink}
            </div>
            <div className="text-black text-[13px] leading-[1.4] mt-[1px] font-[Arial]">
              {track.user.name} (@{track.user.handle}){description ? ` - ${description}` : ''}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="font-[Arial]">
      <div className="text-[#666] text-[13px] mb-[10px] pb-[2px]">
      </div>
    </div>
  );
};

export default Music; 