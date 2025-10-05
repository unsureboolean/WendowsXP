import React, { useState, useEffect } from 'react';

const RotateDeviceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 4H4v4"/>
        <path d="M4 8a8 8 0 0 0 8 8h1"/>
        <path d="M15 16l4-4-4-4"/>
        <rect x="6" y="10" width="8" height="12" rx="1"/>
    </svg>
);


export const OrientationLock: React.FC = () => {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.matchMedia("(max-width: 767px)").matches;
            setIsPortrait(isMobile && window.innerHeight > window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isPortrait) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white text-center z-[200000]">
            <RotateDeviceIcon className="w-24 h-24 mb-4 animate-pulse" />
            <h1 className="text-2xl font-bold">Please rotate your device</h1>
            <p className="mt-2 text-lg">This experience is best viewed in landscape mode.</p>
        </div>
    );
};