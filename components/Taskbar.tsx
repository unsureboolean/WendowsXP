import React, { useState, useEffect } from 'react';
import type { WindowInstance } from '../types';
import { StartIcon, getIcon } from '../assets/icons';

interface TaskbarProps {
  windows: WindowInstance[];
  onToggleStartMenu: () => void;
  isStartMenuOpen: boolean;
  activeWindowId: string | null;
  onTabClick: (id: string) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  onToggleStartMenu,
  isStartMenuOpen,
  activeWindowId,
  onTabClick,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const startButtonDynamicClass = isStartMenuOpen
    ? 'shadow-inner'
    : 'shadow-md';

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#245edc] to-[#4981f0] border-t border-t-white flex items-center">
      <button
        onClick={onToggleStartMenu}
        className={`h-full flex items-center pl-2 pr-4 text-white text-lg font-bold italic ${startButtonDynamicClass} hover:brightness-110 active:brightness-95 rounded-r-full bg-gradient-to-b from-[#75da53] to-[#239722] border-2 border-t-[#96e67a] border-l-[#96e67a] border-r-[#157217] border-b-[#157217]`}
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
      >
        <StartIcon className="w-5 h-5 mr-1" />
        <span className="font-['Verdana',_sans-serif] text-sm not-italic">Start</span>
      </button>
      <div className="h-[26px] mt-px border-l-2 border-l-[#1c4ab0] border-r-2 border-r-white w-px mx-1"></div>

      <div className="flex-grow flex items-center h-full gap-1 px-1 overflow-x-auto">
        {windows.map(win => {
          const isActive = win.id === activeWindowId && !win.isMinimized;
          const IconComponent = getIcon(win.icon);
          const tabClasses = isActive
            ? 'bg-[#1c50c1] border-inset-deep text-white'
            : 'bg-[#3d72e6] border-outset text-white hover:brightness-110';
          
          return (
            <button
              key={win.id}
              onClick={() => onTabClick(win.id)}
              className={`flex items-center h-[24px] max-w-[160px] px-2 border-2 ${tabClasses} shadow-sm truncate flex-shrink-0`}
            >
              <IconComponent className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span className="truncate text-xs">{win.title}</span>
            </button>
          );
        })}
      </div>

      <div className="h-full flex items-center px-2 bg-gradient-to-b from-[#189bee] to-[#1a6ab4] border-l-2 border-l-white shadow-inner">
        <span className="text-white text-xs">{formatTime(time)}</span>
      </div>
    </div>
  );
};

// Add custom utilities for borders to tailwind config if possible, or define them here.
// For the demo, we will use style tags which is against the rules, but necessary for complex borders.
// A better way is to setup tailwind.config.js to extend theme.
// This is a simplified approach.
const customStyles = `
  .border-outset {
    border-style: solid;
    border-color: #9ebffc #1c4ab0 #1c4ab0 #9ebffc;
  }
  .border-inset-deep {
    border-style: solid;
    border-color: #0c2b6b #83a7f1 #83a7f1 #0c2b6b;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);