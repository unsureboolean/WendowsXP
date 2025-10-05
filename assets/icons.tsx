
import React from 'react';

export type IconType = 'app' | 'file' | 'start' | 'computer' | 'folder' | 'im' | 'grid' | 'ie';

export const AppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2" fill="#fff" />
    <rect x="5" y="6" width="14" height="4" fill="#245edc" />
    <line x1="5" y1="13" x2="19" y2="13" stroke="#ccc" />
    <line x1="5" y1="16" x2="15" y2="16" stroke="#ccc" />
  </svg>
);

export const FileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#fff" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export const StartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="xp-start-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#59AD44'}} />
                <stop offset="50%" style={{stopColor: '#3F9535'}} />
                <stop offset="100%" style={{stopColor: '#32822B'}} />
            </linearGradient>
        </defs>
        <path d="M 2,20 a 18,18 0 1,1 36,0 a 18,18 0 1,1 -36,0" fill="url(#xp-start-grad)" stroke="#2A6E24" strokeWidth="1.5" />
        <path d="M 11 14 L 16 14 L 16 11 L 24 20 L 16 29 L 16 26 L 11 26 Z" fill="#fff" opacity="0.9" />
        <path d="M 29,18 L 29,22 L 20,22 L 20,18 Z" fill="#fff" opacity="0.9" transform="rotate(-45 24.5 20)" />
    </svg>
);

export const ComputerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#245edc" d="M42,40H6V14h36V40z M9,17v20h30V17H9z"/>
        <path fill="#b0c9e8" d="M10,18h28v18H10V18z"/>
        <path fill="#245edc" d="M38,12H10c-2.2,0-4-1.8-4-4v0c0-2.2,1.8-4,4-4h28c2.2,0,4,1.8,4,4v0C42,10.2,40.2,12,38,12z"/>
        <path fill="#f2f2f2" d="M19.5,40h9c0.3,0,0.5,0.2,0.5,0.5v2c0,0.3-0.2,0.5-0.5,0.5h-9c-0.3,0-0.5-0.2-0.5-0.5v-2C19,40.2,19.2,40,19.5,40z"/>
    </svg>
);

export const FolderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#ffca28" d="M42,16H25.5l-4-4H6c-2.2,0-4,1.8-4,4v24c0,2.2,1.8,4,4,4h36c2.2,0,4-1.8,4-4V20C46,17.8,44.2,16,42,16z"/>
    </svg>
);

export const InstantMessengerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#00c853" d="M42,9H6c-1.7,0-3,1.3-3,3v21c0,1.7,1.3,3,3,3h30l6,6V12C45,10.3,43.7,9,42,9z"/>
        <path fill="#fff" d="M12,21h24v3H12V21z M12,27h15v3H12V27z M12,15h24v3H12V15z"/>
    </svg>
);

export const GridlockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <rect width="40" height="40" x="4" y="4" fill="#212121" rx="4"/>
        <path fill="#00e676" d="M10,10h8v8h-8V10z M20,10h8v8h-8V10z M30,10h8v8h-8V10z M10,20h8v8h-8V20z M20,20h8v8h-8V20z M30,20h8v8h-8V20z M10,30h8v8h-8V30z M20,30h8v8h-8V30z M30,30h8v8h-8V30z"/>
    </svg>
);

export const InternetExplorerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#01579B" d="M24,4A20,20,0,1,0,44,24,20,20,0,0,0,24,4Z"/>
        <path fill="#FFF" d="M24.7,14c-5.1,0-9.7,2.5-12.3,6.4c-0.1,1-0.2,2-0.2,3.1c0,5.8,4.7,10.5,10.5,10.5c0.3,0,0.5,0,0.8,0 c3.7-1.1,6.5-4.2,7.2-7.9c0.1-0.5,0.1-1,0.1-1.6C31.1,19,28.2,14,24.7,14z"/>
        <path fill="#FFC107" d="M34,13.4c-0.1-0.2-0.3-0.4-0.5-0.5c-0.2-0.1-0.5-0.1-0.7,0l-3.3,1.9c-0.2,0.1-0.4,0.3-0.5,0.5 c-0.1,0.2-0.1,0.5,0,0.7l1.9,3.3c0.1,0.2,0.3,0.4,0.5,0.5c0.2,0.1,0.5,0.1,0.7,0l3.3-1.9c0.2-0.1,0.4-0.3,0.5-0.5 c0.1-0.2,0.1-0.5,0-0.7L34,13.4z"/>
    </svg>
);

// Window control icons
export const MinimizeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="#000" viewBox="0 0 10 10">
        <path d="M0 8 H 6 V 10 H 0 Z" />
    </svg>
);

export const MaximizeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" stroke="#000" strokeWidth="2" viewBox="0 0 12 12">
        <rect x="1" y="1" width="10" height="10" />
    </svg>
);

export const RestoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" stroke="#000" strokeWidth="1.5" viewBox="0 0 12 12">
        <rect x="3" y="1" width="8" height="8" fill="#fff" />
        <path d="M1,5 V3 a2,2 0 0 1 2,-2 H9" />
    </svg>
);

export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" viewBox="0 0 12 12">
        <path d="M2,2 L10,10 M10,2 L2,10" />
    </svg>
);

export const getIcon = (type: IconType): React.FC<React.SVGProps<SVGSVGElement>> => {
  switch (type) {
    case 'app':
      return AppIcon;
    case 'file':
      return FileIcon;
    case 'start':
      return StartIcon;
    case 'computer':
      return ComputerIcon;
    case 'folder':
        return FolderIcon;
    case 'im':
      return InstantMessengerIcon;
    case 'grid':
      return GridlockIcon;
    case 'ie':
      return InternetExplorerIcon;
    default:
      return FileIcon;
  }
};
