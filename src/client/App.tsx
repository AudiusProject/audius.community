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
  const [activeTab, setActiveTab] = useState<'web' | 'music' | 'submit'>('web');
  const [searchText, setSearchText] = useState<string>(ORIGINAL_SEARCH_TEXT);
  
  const handleSearch = () => {
    setSearchKey(prevKey => prevKey + 1);
  };

  const handleOpenGithub = () => {
    window.open('https://github.com/audiusproject', '_blank');
  };

  const handleMusicTab = () => {
    setActiveTab('music');
    setSearchText('');
  };

  const handleWebTab = () => {
    setActiveTab('web');
    setSearchText(ORIGINAL_SEARCH_TEXT);
  };

  return (
    <HarmonyThemeProvider theme='day'>
      <Flex direction='column' alignItems='center'>
        <div className="w-full max-w-[600px] pt-8 pb-4">
          {/* Header with Audius logo and search bar */}
          <div className="flex flex-col mb-4">
            {/* Logo and search bar in one row */}
            <div className="flex items-center mb-2">
              <img 
                src="/static/badgePoweredByAudiusLight.svg"
                alt="Audius Logo" 
                className="h-[40px] w-auto mr-4"
              />
              
              {/* Google-style search bar */}
              <div className="flex">
                <input
                  type="text"
                  value={searchText}
                  readOnly
                  className="border border-[#919191] h-[25px] text-[#000] px-2 py-1 text-[13px] w-[350px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] bg-white"
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
          <div className="flex mb-3 border-b border-[#ebebeb] pb-1">
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
          </div>
          
          {/* Render the appropriate content based on active tab */}
          {activeTab === 'web' && <Projects key={searchKey} />}
          {activeTab === 'music' && <Music />}
        </div>
      </Flex>
    </HarmonyThemeProvider>
  )
}
