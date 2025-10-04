import React, { useEffect, useRef } from 'react';
import type { DesktopItem } from '../types';
import { getIcon } from '../assets/icons';

interface StartMenuProps {
  startMenuItems: DesktopItem[];
  systemMenuItems: DesktopItem[];
  onMenuItemClick: (item: DesktopItem) => void;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ startMenuItems, systemMenuItems, onMenuItemClick, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                const startButton = document.querySelector('button > span.not-italic'); // A bit brittle, but works for this scope
                if (startButton && !startButton.parentElement!.contains(event.target as Node)) {
                   onClose();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);
    
    const SystemMenuItem: React.FC<{ item: DesktopItem }> = ({ item }) => {
      const IconComponent = getIcon(item.icon);
      return (
        <button
            onClick={() => onMenuItemClick(item)}
            className="w-full flex items-center px-4 py-1.5 text-left text-black hover:bg-[#316ac5] hover:text-white"
        >
            <IconComponent className="w-5 h-5 mr-2" />
            <span className="font-semibold">{item.name}</span>
        </button>
      );
    }

    return (
        <div ref={menuRef} className="absolute bottom-[30px] left-0 w-[400px] h-[480px] bg-white border-2 border-t-white border-l-white border-r-black border-b-black shadow-lg z-[99999] flex flex-col" style={{background: 'linear-gradient(to bottom, #2d6bce 0%, #164ca2 100%)'}}>
            {/* Header */}
            <div className="h-[65px] flex items-center p-2">
                <div className="w-12 h-12 bg-gray-200 border-2 border-white rounded-md flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </div>
                <span className="text-white text-xl font-bold" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                    Jeff
                </span>
            </div>

            {/* Content */}
            <div className="flex-grow flex border-t-2 border-t-blue-400 border-b-2 border-b-blue-700">
                {/* Left Pane */}
                <div className="w-1/2 bg-white border-r-2 border-gray-400 flex flex-col py-2">
                    {startMenuItems.slice(0, 6).map((item, index) => {
                        const IconComponent = getIcon(item.icon);
                        return (
                            <React.Fragment key={item.id}>
                                <button
                                    onClick={() => onMenuItemClick(item)}
                                    className="w-full flex items-center p-2 text-left text-black hover:bg-[#316ac5] hover:text-white"
                                >
                                    <IconComponent className="w-8 h-8 mr-3" />
                                    <span className="font-bold">{item.name}</span>
                                </button>
                                {index === 2 && <div className="border-t border-gray-300 my-1 mx-2"></div>}
                            </React.Fragment>
                        );
                    })}
                </div>
                {/* Right Pane */}
                <div className="w-1/2 flex flex-col justify-between py-2" style={{background: 'linear-gradient(to bottom, #d6e5fA 0%, #d6e5fA 100%)'}}>
                    <div>
                        {systemMenuItems.map(item => <SystemMenuItem key={item.id} item={item} />)}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="h-[40px] flex justify-end items-center p-2 bg-gradient-to-b from-[#2d6bce] to-[#164ca2]">
                {/* Placeholder for Log Off / Shut Down */}
            </div>
        </div>
    );
};