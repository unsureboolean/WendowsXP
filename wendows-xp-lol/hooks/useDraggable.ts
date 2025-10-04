import React, { useState, useCallback, useRef, MouseEvent } from 'react';

interface DraggableOptions {
  onDrag: (pos: { x: number; y: number }) => void;
  onDragStop: () => void;
  initialPosition: { x: number; y: number };
  disabled?: boolean;
}

export const useDraggable = ({ onDrag, onDragStop, initialPosition, disabled }: DraggableOptions) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: initialPosition.x, y: initialPosition.y });

  const onMouseMove = useCallback((e: globalThis.MouseEvent) => {
    // No need to check isDragging here because the listener is only added when dragging starts
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    const newPos = {
      x: elementStartPos.current.x + dx,
      y: elementStartPos.current.y + dy
    };
    onDrag(newPos);
  }, [onDrag]);

  const onMouseUp = useCallback(() => {
    onDragStop();
    setIsDragging(false);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }, [onMouseMove, onDragStop]);

  const onMouseDown = useCallback((e: MouseEvent) => {
    if (disabled) return;
    
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = { x: initialPosition.x, y: initialPosition.y }; 
    e.preventDefault();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  }, [disabled, initialPosition, onMouseMove, onMouseUp]);

  return { onMouseDown, isDragging };
};