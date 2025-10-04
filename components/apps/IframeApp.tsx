
import React from 'react';

interface MusicPlayerProps {
  data: {
    fileUrl: string;
    fileName: string;
  };
  windowId: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ data }) => {
  return (
    <div className="w-full h-full bg-black text-green-400 font-mono p-4 flex flex-col items-center justify-center">
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-400">Now Playing:</p>
        <p className="text-lg">{data.fileName}</p>
      </div>
      <audio controls autoPlay src={data.fileUrl} className="w-full">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};
