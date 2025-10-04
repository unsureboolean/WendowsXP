import React from 'react';
import { getIcon, IconType } from '../assets/icons';

interface IconProps {
  name: string;
  icon: IconType;
  onOpen: () => void;
}

export const Icon: React.FC<IconProps> = ({ name, icon, onOpen }) => {
  const IconComponent = getIcon(icon);

  return (
    <div
      className="flex flex-col items-center justify-center w-28 h-28 p-2 rounded-md hover:bg-blue-500 hover:bg-opacity-30 focus:bg-blue-600 focus:bg-opacity-50 outline-none"
      onDoubleClick={onOpen}
      tabIndex={0}
      role="button"
      aria-label={`Open ${name}`}
    >
      <IconComponent className="w-12 h-12 mb-1" />
      <p className="text-white text-center text-xs break-words w-full" style={{ textShadow: '1px 1px 2px black' }}>
        {name}
      </p>
    </div>
  );
};
