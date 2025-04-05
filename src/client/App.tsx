import {
  ThemeProvider as HarmonyThemeProvider,
  Flex,
} from '@audius/harmony'
import Projects from './components/Projects'
import Music from './components/Music'
import { useState } from 'react'

// Original search text constant
const ORIGINAL_SEARCH_TEXT = "community projects built on the Audius protocol";

export default function App() {
  const [searchKey, setSearchKey] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'web' | 'music' | 'submit' | 'badges'>('web');
  const [searchText, setSearchText] = useState<string>(ORIGINAL_SEARCH_TEXT);
  
  const handleSearch = () => {
    setSearchKey(prevKey => prevKey + 1);
  };

  const handleOpenGithub = () => {
    window.open('https://github.com/audiusproject', '_blank');
  };

  const handleOpenAudiusDocs = () => {
    window.open('https://docs.audius.org', '_blank', 'noopener,noreferrer');
  };

  const handleDownloadBadges = () => {
    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = '/static/Developer Badges.zip';
    link.download = 'Developer Badges.zip';
    link.setAttribute('download', 'Developer Badges.zip');
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  };

  const handleMusicTab = () => {
    setActiveTab('music');
    setSearchText('trending');
  };

  const handleWebTab = () => {
    setActiveTab('web');
    setSearchText(ORIGINAL_SEARCH_TEXT);
  };

  const handleBadgesTab = () => {
    handleDownloadBadges();
  };

  // Allow the search bar to be editable when on the Music tab
  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeTab === 'music') {
      setSearchText(e.target.value);
    }
  };

  // Handle key press events for the search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <HarmonyThemeProvider theme='day'>
      <Flex direction='column' alignItems='center'>
        <div className="w-full max-w-[800px] min-w-[400px] px-5 pt-8 pb-4 mx-auto">
          {/* Header with Audius logo and search bar */}
          <div className="flex flex-col mb-4">
            {/* Logo and search bar in one row */}
            <div className="flex items-center mb-2 flex-wrap">
              <img 
                src="/static/badgePoweredByAudiusLight.svg"
                alt="Audius Logo" 
                className="h-[40px] w-auto mr-4 mb-2 cursor-pointer"
                onClick={handleOpenAudiusDocs}
              />
              
              {/* Google-style search bar */}
              <div className="flex flex-1 min-w-[300px]">
                <input
                  type="text"
                  value={searchText}
                  readOnly={activeTab !== 'music'}
                  onChange={handleSearchTextChange}
                  onKeyDown={handleKeyDown}
                  className="border border-[#919191] h-[25px] text-[#000] px-2 py-1 text-[13px] flex-1 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] bg-white"
                />
                <button 
                  className="bg-[#dcdcdc] border border-[#919191] border-l-0 h-[25px] text-[13px] px-2 hover:bg-[#c6c6c6]"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex mb-3 border-b border-[#ebebeb] pb-1 flex-wrap">
            <div 
              className={`text-[13px] mr-4 pb-1 cursor-pointer ${activeTab === 'web' ? 'text-[#1a0dab] border-b-[3px] border-[#1a0dab]' : 'text-[#5f6368]'}`}
              onClick={handleWebTab}
            >
              Web
            </div>
            <div 
              className={`text-[13px] mr-4 pb-1 cursor-pointer ${activeTab === 'music' ? 'text-[#1a0dab] border-b-[3px] border-[#1a0dab]' : 'text-[#5f6368]'}`}
              onClick={handleMusicTab}
            >
              Music
            </div>
            <div 
              className={`text-[13px] mr-4 pb-1 cursor-pointer ${activeTab === 'submit' ? 'text-[#1a0dab] border-b-[3px] border-[#1a0dab]' : 'text-[#5f6368]'}`}
              onClick={handleOpenGithub}
            >
              Add My Project
            </div>
            <div 
              className={`text-[13px] mr-4 pb-1 cursor-pointer ${activeTab === 'badges' ? 'text-[#1a0dab] border-b-[3px] border-[#1a0dab]' : 'text-[#5f6368]'}`}
              onClick={handleBadgesTab}
            >
              Download Dev Badges
            </div>
          </div>
          
          {/* Render the appropriate content based on active tab */}
          {activeTab === 'web' && <Projects key={searchKey} />}
          {activeTab === 'music' && <Music searchText={searchText} onSearch={searchKey} />}
        </div>
      </Flex>
    </HarmonyThemeProvider>
  )
}
