import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { Track } from '@audius/sdk';

// Define the shape of our context
interface MusicContextType {
  tracks: Track[];
  playingTrackId: string | null;
  isPlaying: boolean;
  loadingTrackId: string | null;
  currentTime: number;
  duration: number;
  togglePlayPause: (trackId: string) => Promise<void>;
  skipToNextTrack: () => Promise<void>;
  skipToPreviousTrack: () => Promise<void>;
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setTracks: (tracks: Track[]) => void;
}

// Create the context with a default value
const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Provider component
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Find the index of a track in the tracks array
  const findTrackIndex = (trackId: string): number => {
    return tracks.findIndex(track => track.id === trackId);
  };

  // Get stream URL for a track (use Audius API directly - SDK discovery node returns null in browser)
  const getStreamUrl = (trackId: string): string =>
    `https://api.audius.co/v1/tracks/${trackId}/stream`;

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
    const streamUrl = getStreamUrl(trackId);
    
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

  const contextValue: MusicContextType = {
    tracks,
    playingTrackId,
    isPlaying,
    loadingTrackId,
    currentTime,
    duration,
    togglePlayPause,
    skipToNextTrack,
    skipToPreviousTrack,
    handleSeek,
    setTracks,
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// Hook to use the music context
export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};

// Floating Music Controls component
export const FloatingMusicControls: React.FC = () => {
  const { 
    tracks, 
    playingTrackId, 
    isPlaying, 
    loadingTrackId,
    currentTime,
    duration,
    togglePlayPause,
    skipToNextTrack,
    skipToPreviousTrack,
    handleSeek
  } = useMusicContext();

  if (!playingTrackId && !loadingTrackId) return null;
  
  const currentTrack = tracks.find(track => track.id === playingTrackId);
  const isLoading = loadingTrackId !== null;
  
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

  // Format time (seconds) to mm:ss
  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return '0:00';
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
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