
import React, { useState, useCallback, useRef, MouseEvent, useEffect } from 'react';
import { Desktop } from './components/Desktop';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import { DESKTOP_ITEMS, START_MENU_ITEMS, START_MENU_SYSTEM_ITEMS } from './data/content';
import type { WindowInstance, DesktopItem } from './types';

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);

  const nextZIndex = useRef(100);
  const nextWindowId = useRef(0);

  const focusWindow = useCallback((id: string) => {
    if (id === activeWindowId) return;

    setActiveWindowId(id);
    setWindows(prevWindows =>
      prevWindows.map(win =>
        win.id === id ? { ...win, zIndex: nextZIndex.current++ } : win
      )
    );
  }, [activeWindowId]);
  
  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position } : w));
  }, []);

  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, size } : w));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    const windowToToggle = windows.find(w => w.id === id);
    if (!windowToToggle) return;

    if (windowToToggle.isMinimized) {
        focusWindow(id);
    } else {
        if (activeWindowId === id) {
             setActiveWindowId(null);
        }
    }

    setWindows(prev =>
      prev.map(win =>
        win.id === id ? { ...win, isMinimized: !win.isMinimized } : win
      )
    );
  }, [windows, activeWindowId, focusWindow]);

  const openWindow = useCallback((item: DesktopItem) => {
    const existingWindow = windows.find(win => win.title === item.name);
    if (existingWindow) {
        focusWindow(existingWindow.id);
        if(existingWindow.isMinimized){
            minimizeWindow(existingWindow.id);
        }
        return;
    }
    
    let size;
    switch (item.app.type) {
        case 'PersonaZooApp':
            size = { width: 400, height: 275 }; // Reduced height as requested
            break;
        case 'GridlockApp':
            size = { width: 620, height: 800 };
            break;
        case 'BrowserApp':
            size = { width: 800, height: 600 };
            break;
        case 'SystemInfoApp':
            size = { width: 550, height: 500 };
            break;
        case 'MusicPlayerApp':
            size = { width: 350, height: 150 };
            break;
        default: // Notepad
            size = { width: 500, height: 400 };
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    let position;

    if (isMobile) {
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;

        const hMargin = 20; // 10px on each side
        const vMargin = 20; // 10px on top and bottom
        const taskbarHeight = 30;

        const maxWidth = viewportWidth - hMargin;
        const maxHeight = viewportHeight - taskbarHeight - vMargin;
        
        size.width = Math.min(size.width, maxWidth);
        size.height = Math.min(size.height, maxHeight);
        
        position = {
            x: Math.round((viewportWidth - size.width) / 2),
            y: Math.round((viewportHeight - taskbarHeight - size.height) / 2),
        };
        
        // Ensure position is not off-screen if calculations are weird
        if (position.x < 10) position.x = 10;
        if (position.y < 10) position.y = 10;
    } else {
        // Cascading windows for better UX on desktop
        const offset = (windows.length % 10) * 25;
        position = { x: 50 + offset, y: 50 + offset };
    }
    
    const newWindow: WindowInstance = {
      id: `win-${nextWindowId.current++}`,
      title: item.name,
      app: item.app,
      data: item.data,
      icon: item.icon,
      position: position,
      size: size,
      isMinimized: false,
      isMaximized: false, // Do not automatically maximize on mobile
      zIndex: nextZIndex.current++,
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    setStartMenuOpen(false);
  }, [windows, focusWindow, minimizeWindow]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(win => win.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(win => {
        if (win.id === id) {
          if (win.isMaximized) {
            // Restore
            return {
              ...win,
              isMaximized: false,
              position: win.preMaximizedState?.position || { x: 50, y: 50 },
              size: win.preMaximizedState?.size || { width: 500, height: 400 },
              preMaximizedState: undefined,
            };
          } else {
            // Maximize
            return {
              ...win,
              isMaximized: true,
              preMaximizedState: { position: win.position, size: win.size },
            };
          }
        }
        return win;
      })
    );
    focusWindow(id);
  }, [focusWindow]);

  const handleTaskbarClick = useCallback((id: string) => {
      const window = windows.find(win => win.id === id);
      if (!window) return;

      if (window.isMinimized) {
          minimizeWindow(id); // Toggles isMinimized to false and focuses
      } else {
          if (id === activeWindowId) {
              minimizeWindow(id); // Minimizes if active
          } else {
              focusWindow(id); // Focuses if inactive
          }
      }
  }, [windows, activeWindowId, focusWindow, minimizeWindow]);


  const handleDesktopClick = (e: MouseEvent<HTMLDivElement>) => {
    // Close Start Menu if clicking on the desktop itself
    if (e.target === e.currentTarget) {
      setStartMenuOpen(false);
    }
    // Do not setActiveWindowId(null) here to allow for icon selection without losing window focus
  };

  const didAutoOpen = useRef(false);
  useEffect(() => {
    // Function to check if it's a mobile device based on screen width
    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
    
    // Only run this on mobile, and only if no windows are open and it hasn't run before
    if (isMobile() && !didAutoOpen.current && windows.length === 0) {
        const aboutMeItem = DESKTOP_ITEMS.find(item => item.id === 'about');
        if (aboutMeItem) {
            const timer = setTimeout(() => {
                openWindow(aboutMeItem);
            }, 200); // 0.2 second delay as requested
            
            // Set the flag to true to prevent this from running again
            didAutoOpen.current = true;
            
            // Cleanup the timer if the component unmounts
            return () => clearTimeout(timer);
        }
    }
  }, [windows, openWindow]);

  return (
    <div className="app-container">
      <div className="font-['Tahoma',_sans-serif] text-[11px] overflow-hidden flex flex-col h-full w-full">
        <div className="flex-grow relative">
          <Desktop
            windows={windows}
            openWindow={openWindow}
            closeWindow={closeWindow}
            minimizeWindow={minimizeWindow}
            maximizeWindow={maximizeWindow}
            focusWindow={focusWindow}
            activeWindowId={activeWindowId}
            desktopItems={DESKTOP_ITEMS}
            onDesktopClick={handleDesktopClick}
            updateWindowPosition={updateWindowPosition}
            updateWindowSize={updateWindowSize}
          />
        </div>
        {isStartMenuOpen && (
          <StartMenu
            startMenuItems={START_MENU_ITEMS}
            systemMenuItems={START_MENU_SYSTEM_ITEMS}
            onMenuItemClick={openWindow}
            onClose={() => setStartMenuOpen(false)}
          />
        )}
        <div className="h-[30px] flex-shrink-0 z-[100000]">
          <Taskbar
              windows={windows}
              onToggleStartMenu={() => setStartMenuOpen(prev => !prev)}
              isStartMenuOpen={isStartMenuOpen}
              activeWindowId={activeWindowId}
              onTabClick={handleTaskbarClick}
          />
        </div>
      </div>
    </div>
  );
};

export default App;