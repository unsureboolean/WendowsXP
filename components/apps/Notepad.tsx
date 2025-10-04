
import React from 'react';

interface NotepadProps {
  data: string;
  windowId: string;
}

export const Notepad: React.FC<NotepadProps> = ({ data }) => {
  return (
    <div className="w-full h-full bg-white font-mono text-black text-sm p-2 overflow-y-auto">
      <pre className="whitespace-pre-wrap">{data}</pre>
    </div>
  );
};
