import React from 'react';

export const SystemInfoWindow: React.FC<{}> = () => {
    return (
        <div className="w-full h-full bg-[#ece9d8] p-4 flex flex-col font-['Tahoma',_sans-serif] text-xs">
            <div className="text-lg mb-4">System Properties</div>
            <div className="w-full border-t border-gray-400 mb-4"></div>
            
            <div className="flex-grow bg-white p-4 border border-gray-400 shadow-inner">
                <div className="mb-4">
                    <div className="font-bold">System:</div>
                    <div className="pl-4 mt-1">
                        Microsoft Windows XP<br/>
                        Professional<br/>
                        Version 2002<br/>
                        Service Pack 3
                    </div>
                </div>

                <div className="w-full border-t border-gray-300 my-4"></div>

                <div className="mb-4">
                    <div className="font-bold">Registered to:</div>
                     <div className="pl-4 mt-1">
                        Jeff<br/>
                        Personal Portfolio
                    </div>
                </div>

                <div className="w-full border-t border-gray-300 my-4"></div>

                <div className="mb-4">
                    <div className="font-bold">Computer:</div>
                    <div className="pl-4 mt-1 flex items-center">
                        <img src="https://www.winclassic.net/attachments/xp_computer-png.312/" alt="PC" className="w-16 h-16 mr-4" />
                        <div>
                            Intel(R) Pentium(R) 4 CPU 3.00GHz<br/>
                            2.99 GHz, 2.00 GB of RAM
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <button className="px-6 py-1 bg-[#ece9d8] border border-gray-500 rounded-sm shadow-sm hover:bg-gray-200">
                    OK
                </button>
            </div>
        </div>
    );
};