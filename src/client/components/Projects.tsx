import React, { useState, useEffect } from 'react';
import projects from '../data/projects.ts';

const Projects: React.FC = () => {
  const [loadTime, setLoadTime] = useState<string | null>(null);
  const [shuffledProjects, setShuffledProjects] = useState(projects);

  // Fisher-Yates (Knuth) shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const startTime = performance.now();
    
    // Shuffle the projects on each load
    setShuffledProjects(shuffleArray(projects));
    
    const timeoutId = setTimeout(() => {
      const endTime = performance.now();
      // Calculate duration in milliseconds, then convert to nanoseconds (1ms = 1,000,000ns)
      const durationMs = endTime - startTime;
      const durationNs = Math.round(durationMs);
      setLoadTime(durationNs.toLocaleString());
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Function to handle clicking on a project title
  const handleProjectClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return loadTime ? (
    <div className="font-[Arial]">
      <div className="text-[#666] text-[13px] mb-[10px] pb-[2px]">
        Results for community projects (in {loadTime} milliseconds)
      </div>
      
      {shuffledProjects.map((project, index) => (
        <div key={index} className="mb-[22px]">
          <div 
            className="text-[#2200C1] text-[16px] mb-[1px] underline cursor-pointer font-normal leading-[1.2]"
            onClick={() => handleProjectClick(project.link)}
          >
            {project.title}
          </div>
          <div className="text-[13px] leading-[1.4]">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00802A] hover:underline"
            >
              {project.link}
            </a>
            {project.repository && (
              <>
                {' '}
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6e5494] hover:underline"
                >
                  [code]
                </a>
              </>
            )}
          </div>
          <div className="text-black text-[13px] leading-[1.4] mt-[1px] font-[Arial]">
            {project.description}
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

export default Projects; 