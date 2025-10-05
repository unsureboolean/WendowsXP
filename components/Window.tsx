
import React, { ReactNode, useRef, MouseEvent, useCallback, useState, useEffect } from 'react';
import { getIcon, IconType, MinimizeIcon, MaximizeIcon, RestoreIcon, CloseIcon } from '../assets/icons';

interface WindowProps {
  id: string;
  title: string;
  icon: IconType;
  children: ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isActive: boolean;
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onPositionChange: (newPosition: { x: number; y: number }) => void;
  onSizeChange: (newSize: { width: number; height: number }) => void;
}

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  icon,
  children,
  position,
  size,
  zIndex,
  isActive,
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  onSizeChange,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; winX: number; winY: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleResize = () => setIsMobile(mediaQuery.matches);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleDragMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (!dragStartRef.current) return;
    let newX = e.clientX - dragStartRef.current.x + dragStartRef.current.winX;
    let newY = e.clientY - dragStartRef.current.y + dragStartRef.current.winY;

    if (isMobile) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const taskbarHeight = 30;
      newX = Math.max(0, Math.min(newX, viewportWidth - size.width));
      newY = Math.max(0, Math.min(newY, viewportHeight - taskbarHeight - size.height));
    }

    onPositionChange({ x: newX, y: newY });
  }, [onPositionChange, isMobile, size.width, size.height]);

  const handleDragMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleDragMouseMove);
    document.removeEventListener('mouseup', handleDragMouseUp);
    dragStartRef.current = null;
  }, [handleDragMouseMove]);

  const handleDragMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (isMaximized) return;
    // Prevent dragging when clicking on buttons within the title bar
    if ((e.target as HTMLElement).closest('button')) {
        return;
    }
    onFocus(); // Focus window on title bar click
    dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        winX: position.x,
        winY: position.y,
    };
    
    document.addEventListener('mousemove', handleDragMouseMove);
    document.addEventListener('mouseup', handleDragMouseUp);
  }, [isMaximized, position.x, position.y, onFocus, handleDragMouseMove, handleDragMouseUp]);

  const IconComponent = getIcon(icon);

  const windowClasses = `${
    isMaximized ? 'fixed' : 'absolute'
  } flex flex-col border shadow-lg transition-opacity duration-100 ${
    isActive ? 'border-[#005cfa]' : 'border-gray-400'
  } ${isMaximized ? 'border-none' : ''}`;
  
  const titleBarClasses = `h-[26px] flex items-center justify-between pl-1 pr-1 text-white font-bold text-sm select-none ${ isMaximized ? '' : 'cursor-move' } ${
    isActive ? 'bg-gradient-to-b from-[#005cfa] to-[#0051e0]' : 'bg-gradient-to-b from-[#7f7f7f] to-[#6f6f6f]'
  }`;

  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0, direction: '' });

  const onResizeMouseMove = useCallback((e: globalThis.MouseEvent) => {
    e.preventDefault();
    const { direction, x, y, width, height, posX, posY } = resizeStart.current;
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    let newWidth = width;
    let newHeight = height;
    let newX = posX;
    let newY = posY;

    if (direction.includes('e')) newWidth = Math.max(200, width + dx);
    if (direction.includes('s')) newHeight = Math.max(150, height + dy);
    if (direction.includes('w')) {
      const w = width - dx;
      if (w > 200) {
        newWidth = w;
        newX = posX + dx;
      }
    }
    if (direction.includes('n')) {
      const h = height - dy;
      if (h > 150) {
        newHeight = h;
        newY = posY + dy;
      }
    }

    if (isMobile) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const taskbarHeight = 30;

        if (newX < 0) {
            newWidth += newX;
            newX = 0;
        }
        if (newY < 0) {
            newHeight += newY;
            newY = 0;
        }

        if (newX + newWidth > viewportWidth) {
            newWidth = viewportWidth - newX;
        }
        if (newY + newHeight > viewportHeight - taskbarHeight) {
            newHeight = viewportHeight - taskbarHeight - newY;
        }
    }
    
    if (newWidth !== size.width || newHeight !== size.height) {
      onSizeChange({ width: newWidth, height: newHeight });
    }
    if (newX !== position.x || newY !== position.y) {
      onPositionChange({ x: newX, y: newY });
    }
  }, [onSizeChange, onPositionChange, size, position, isMobile]);

  const onResizeMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', onResizeMouseMove);
    document.removeEventListener('mouseup', onResizeMouseUp);
  }, [onResizeMouseMove]);
  
  const onResizeMouseDown = (e: MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y,
      direction,
    };
    document.addEventListener('mousemove', onResizeMouseMove);
    document.addEventListener('mouseup', onResizeMouseUp);
  };

  const maximizedStyle = {
    top: 0,
    left: 0,
    width: '100vw',
    height: 'calc(100dvh - 30px)', // Account for 30px taskbar
    transform: 'none',
  };

  const normalStyle = {
    top: position.y,
    left: position.x,
    width: size.width,
    height: size.height,
  };
  
  return (
    <div
      ref={windowRef}
      className={windowClasses}
      style={{
        ...(isMaximized ? maximizedStyle : normalStyle),
        zIndex,
        background: '#ece9d8',
      }}
      onMouseDown={onFocus}
    >
      <div className={titleBarClasses} onMouseDown={handleDragMouseDown} onDoubleClick={onMaximize}>
        <div className="flex items-center truncate">
          <IconComponent className="w-4 h-4 mr-1.5" />
          <span className="truncate">{title}</span>
        </div>
        <div className="flex items-center">
            <button onClick={onMinimize} className="window-control-button"><MinimizeIcon className="w-2 h-2" /></button>
            <button onClick={onMaximize} className="window-control-button mx-0.5">
                {isMaximized ? <RestoreIcon className="w-3 h-3"/> : <MaximizeIcon className="w-3 h-3" />}
            </button>
            <button onClick={onClose} className="window-control-button close-button"><CloseIcon className="w-3 h-3" /></button>
        </div>
      </div>
      <div className="flex-grow p-0.5">
        <div className="w-full h-full bg-white relative">
          {children}
        </div>
      </div>
       {!isMaximized && (
        <>
          <div className="absolute -left-1 top-0 bottom-0 w-2 cursor-ew-resize" onMouseDown={(e) => onResizeMouseDown(e, 'w')} />
          <div className="absolute -right-1 top-0 bottom-0 w-2 cursor-ew-resize" onMouseDown={(e) => onResizeMouseDown(e, 'e')} />
          <div className="absolute left-0 right-0 -top-1 h-2 cursor-ns-resize" onMouseDown={(e) => onResizeMouseDown(e, 'n')} />
          <div className="absolute left-0 right-0 -bottom-1 h-2 cursor-ns-resize" onMouseDown={(e) => onResizeMouseDown(e, 's')} />
          <div className="absolute -left-1 -top-1 w-3 h-3 cursor-nwse-resize" onMouseDown={(e) => onResizeMouseDown(e, 'nw')} />
          <div className="absolute -right-1 -top-1 w-3 h-3 cursor-nesw-resize" onMouseDown={(e) => onResizeMouseDown(e, 'ne')} />
          <div className="absolute -left-1 -bottom-1 w-3 h-3 cursor-nesw-resize" onMouseDown={(e) => onResizeMouseDown(e, 'sw')} />
          <div className="absolute -right-1 -bottom-1 w-3 h-3 cursor-nwse-resize" onMouseDown={(e) => onResizeMouseDown(e, 'se')} />
        </>
      )}
      <style>{`
        .window-control-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 21px;
            height: 21px;
            background: #d6e5fA;
            border-top: 1px solid #fff;
            border-left: 1px solid #fff;
            border-right: 1px solid #000;
            border-bottom: 1px solid #000;
        }
        .window-control-button:active {
            border-top: 1px solid #000;
            border-left: 1px solid #000;
            border-right: 1px solid #fff;
            border-bottom: 1px solid #fff;
        }
        .window-control-button.close-button {
            background: #e12101;
        }
      `}</style>
    </div>
  );
};
