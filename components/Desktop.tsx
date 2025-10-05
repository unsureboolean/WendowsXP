import React, { MouseEvent, useState, useEffect } from 'react';
import type { WindowInstance, DesktopItem } from '../types';
import { Window } from './Window';
import { Icon } from './Icon';

interface DesktopProps {
  windows: WindowInstance[];
  desktopItems: DesktopItem[];
  openWindow: (item: DesktopItem) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  activeWindowId: string | null;
  onDesktopClick: (e: MouseEvent<HTMLDivElement>) => void;
}

export const Desktop: React.FC<DesktopProps> = ({
  windows,
  desktopItems,
  openWindow,
  closeWindow,
  minimizeWindow,
  maximizeWindow,
  focusWindow,
  updateWindowPosition,
  updateWindowSize,
  activeWindowId,
  onDesktopClick,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check screen size
    const checkScreenSize = () => {
      setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div
      className="relative w-full h-full"
      onClick={onDesktopClick}
    >
      {/* 
        This div handles the desktop background. It is only rendered on screens wider than 767px.
        Mobile backgrounds are handled by the CSS in index.html to support the portrait aspect-ratio lock.
        Using an inline style here can help bypass potential issues with CSS loading or browser extensions
        that might interfere with external stylesheets or head-injected styles.
      */}
      {!isMobile && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: "url('https://i.imgur.com/K9jJI4E.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
      
      {/* Desktop Icons */}
      <div className="p-4 flex flex-row flex-wrap content-start gap-0 sm:flex-col sm:flex-nowrap sm:h-full">
        {desktopItems.map(item => (
          <Icon
            key={item.id}
            name={item.name}
            icon={item.icon}
            onOpen={() => openWindow(item)}
          />
        ))}
      </div>

      {/* Windows */}
      {windows.filter(win => !win.isMinimized).map(win => (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            icon={win.icon}
            position={win.position}
            size={win.size}
            zIndex={win.zIndex}
            isActive={win.id === activeWindowId}
            isMaximized={win.isMaximized}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onPositionChange={(pos) => updateWindowPosition(win.id, pos)}
            onSizeChange={(size) => updateWindowSize(win.id, size)}
          >
            <win.app.component data={win.data} windowId={win.id}/>
          </Window>
      ))}
    </div>
  );
};