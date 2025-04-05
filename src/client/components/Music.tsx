import React, { useState, useEffect, useRef } from 'react';
import { useSdk } from '../hooks/useSdk';
import { Track } from '@audius/sdk';

interface MusicProps {
  searchText: string;
  onSearch: number;
}

const Music: React.FC<MusicProps> = ({ searchText, onSearch }) => {
  const { sdk } = useSdk();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadTime, setLoadTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearchResult, setIsSearchResult] = useState<boolean>(false);
  const [prevSearchKey, setPrevSearchKey] = useState<number>(onSearch);
  const [displayedSearchText, setDisplayedSearchText] = useState<string>('');
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch trending tracks
  const fetchTrendingTracks = async () => {
    const startTime = performance.now();
    
    try {
      setIsLoading(true);
      setIsSearchResult(false);
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

  // Get stream URL for a track
  const getStreamUrl = async (trackId: string): Promise<string | null> => {
    try {
      const response = await sdk.tracks.getTrackStreamUrl({ trackId });
      return response;
    } catch (error) {
      console.error('Error getting stream URL:', error);
      return null;
    }
  };

  // Toggle play/pause for a track
  const togglePlayPause = async (trackId: string) => {
    // If we're clicking on the currently playing track
    if (trackId === playingTrackId) {
      if (isPlaying) {
        // Pause the current track
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        // Resume the current track
        audioRef.current?.play();
        setIsPlaying(true);
      }
      return;
    }

    // Stop the currently playing track if there is one
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    // Set the new track as the playing track
    setPlayingTrackId(trackId);

    // Get the stream URL for the new track
    const streamUrl = await getStreamUrl(trackId);
    
    if (streamUrl) {
      // Create a new audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio(streamUrl);
        
        // Add event listener for when the audio ends
        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false);
        });
      } else {
        // Update the src of the existing audio element
        audioRef.current.src = streamUrl;
      }
      
      // Play the new track
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
    }
  };

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

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
              <button
                className="text-[#2200C1] ml-1 text-xl cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause(track.id);
                }}
                aria-label={isCurrentTrackPlaying ? "Pause" : "Play"}
              >
                {isCurrentTrackPlaying ? "⏸️" : "▶️"}
              </button>
            </div>
            <div className="text-[#00802A] text-[13px] leading-[1.4]">
              {fullPermalink}
            </div>
            <div className="text-black text-[13px] leading-[1.4] mt-[1px] font-[Arial]">
              {track.user.name} ({track.user.handle}){description ? ` - ${description}` : ''}
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