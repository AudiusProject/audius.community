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
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

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

  // Find the index of a track in the tracks array
  const findTrackIndex = (trackId: string): number => {
    return tracks.findIndex(track => track.id === trackId);
  };

  // Skip to the next track
  const skipToNextTrack = async () => {
    if (playingTrackId && tracks.length > 0) {
      const currentIndex = findTrackIndex(playingTrackId);
      if (currentIndex !== -1) {
        const nextIndex = (currentIndex + 1) % tracks.length;
        const nextTrack = tracks[nextIndex];
        await togglePlayPause(nextTrack.id);
      }
    }
  };

  // Skip to the previous track
  const skipToPreviousTrack = async () => {
    if (playingTrackId && tracks.length > 0) {
      const currentIndex = findTrackIndex(playingTrackId);
      if (currentIndex !== -1) {
        const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
        const prevTrack = tracks[prevIndex];
        await togglePlayPause(prevTrack.id);
      }
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
        // Clear progress interval
        if (progressIntervalRef.current) {
          window.clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      } else {
        // Resume the current track
        audioRef.current?.play();
        setIsPlaying(true);
        // Start progress interval
        startProgressInterval();
      }
      return;
    }

    // Stop the currently playing track if there is one
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      // Clear progress interval
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    // Reset progress
    setCurrentTime(0);
    setDuration(0);

    // Set the new track as the loading track
    setLoadingTrackId(trackId);
    setPlayingTrackId(null);

    // Get the stream URL for the new track
    const streamUrl = await getStreamUrl(trackId);
    
    if (streamUrl) {
      // Create a new audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio(streamUrl);
        
        // Add event listeners
        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false);
          if (progressIntervalRef.current) {
            window.clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          skipToNextTrack();
        });

        audioRef.current.addEventListener('loadedmetadata', () => {
          setDuration(audioRef.current?.duration || 0);
        });
      } else {
        // Update the src of the existing audio element
        audioRef.current.src = streamUrl;
      }
      
      // Play the new track
      audioRef.current.play()
        .then(() => {
          setLoadingTrackId(null);
          setPlayingTrackId(trackId);
          setIsPlaying(true);
          setDuration(audioRef.current?.duration || 0);
          startProgressInterval();
        })
        .catch(error => {
          console.error('Error playing audio:', error);
          setLoadingTrackId(null);
          setIsPlaying(false);
        });
    } else {
      // If no stream URL was found, clear the loading state
      setLoadingTrackId(null);
    }
  };

  // Start interval to update progress
  const startProgressInterval = () => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = window.setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 1000);
  };

  // Handle seeking in the track
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Format time (seconds) to mm:ss
  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return '0:00';
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Clean up audio and intervals when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
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

  // Floating Music Controls component
  const FloatingMusicControls = () => {
    if (!playingTrackId && !loadingTrackId) return null;
    
    const currentTrack = tracks.find(track => track.id === playingTrackId);
    const isLoading = loadingTrackId !== null;
    
    return (
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 flex flex-col items-center z-50" style={{ width: '300px' }}>
        <div className="text-[#2200C1] font-medium mb-2 w-full overflow-hidden whitespace-nowrap text-ellipsis text-center">
          {currentTrack?.title || 'Loading...'}
        </div>
        
        {/* Progress bar and time */}
        <div className="w-full mb-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            disabled={isLoading || !playingTrackId}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2200C1]"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="text-[#2200C1] text-2xl hover:text-[#4400E1] focus:outline-none"
            onClick={skipToPreviousTrack}
            disabled={isLoading}
            aria-label="Previous Track"
          >
            ⏮️
          </button>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <button
              className="text-[#2200C1] text-2xl hover:text-[#4400E1] focus:outline-none"
              onClick={() => playingTrackId && togglePlayPause(playingTrackId)}
              aria-label={isPlaying ? "Pause" : "Play"}
              disabled={isLoading}
            >
              {isPlaying ? "⏸️" : "▶️"}
            </button>
          )}
          
          <button 
            className="text-[#2200C1] text-2xl hover:text-[#4400E1] focus:outline-none"
            onClick={skipToNextTrack}
            disabled={isLoading}
            aria-label="Next Track"
          >
            ⏭️
          </button>
        </div>
      </div>
    );
  };

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
      
      <FloatingMusicControls />
    </div>
  ) : (
    <div className="font-[Arial]">
      <div className="text-[#666] text-[13px] mb-[10px] pb-[2px]">
      </div>
    </div>
  );
};

export default Music; 