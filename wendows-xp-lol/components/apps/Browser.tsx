
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';

// Bookmark data structure
interface Bookmark {
  name: string;
  url?: string; // URL for standard links
  isError?: boolean; // Flag for special error bookmarks
  errorContent?: { title: string; message: string }; // Content for the error
}

const bookmarks: Bookmark[] = [
  { name: "Jeff Tuel's Page", url: 'https://jefftuel.com' },
  { name: "Wikipedia", url: 'https://wikipedia.com' },
  { 
    name: "MySpace", 
    isError: true, 
    errorContent: { 
      title: "This page cannot be displayed", 
      message: "The page you are looking for might have been removed, had its name changed, or Tom is no longer your friend." 
    } 
  },
  { name: "Home Star Runner", url: 'https://homestarrunner.com' },
  { name: "Ask Jeeves", url: 'https://ask.com' },
  { 
    name: "Club Penguin", 
    isError: true, 
    errorContent: { 
      title: "Connection Lost", 
      message: "The connection to Club Penguin has been lost. Waddle on." 
    } 
  },
];

const BrowserButton: React.FC<{onClick: () => void, disabled?: boolean, children: React.ReactNode}> = ({onClick, disabled, children}) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className="text-xs text-black px-2 py-0.5 bg-[#ece9d8] border border-gray-500 rounded-sm shadow-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {children}
    </button>
);

const BookmarkButton: React.FC<{onClick: () => void, children: React.ReactNode}> = ({onClick, children}) => (
    <button
        onClick={onClick}
        className="text-xs text-black px-3 py-0.5 hover:bg-blue-200"
    >
        {children}
    </button>
);


export const Browser: React.FC<{ data: { initialUrl: string }, windowId: string }> = ({ data, windowId }) => {
  const { initialUrl } = data;
  
  // State for navigation history
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // State for UI elements and behavior
  const [addressBarValue, setAddressBarValue] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorContent, setErrorContent] = useState<{title: string, message: string} | null>(null);
  const [key, setKey] = useState(0); // Used to force iframe re-render

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentUrl = history[historyIndex];

  // This effect runs whenever the current URL changes (due to navigation, back, forward, home)
  useEffect(() => {
    // Reset error state on any new navigation
    setIsError(false);
    setErrorContent(null);
    setIsLoading(true);
    
    // Logic to control the address bar display
    if (currentUrl === initialUrl) {
      setAddressBarValue(currentUrl);
    } else {
      setAddressBarValue(''); // Clear for "Search or type..." placeholder
    }
  }, [currentUrl, initialUrl]);

  const refresh = () => {
    setIsLoading(true);
    setIsError(false);
    setKey(prevKey => prevKey + 1);
  };
  
  // The main navigation handler for address bar, bookmarks, etc.
  const handleNavigationRequest = (input: string) => {
    let urlToLoad = input.trim();
    if (!urlToLoad) return;

    // Check if it's a URL or a search query
    const isUrl = urlToLoad.includes('.') && !urlToLoad.includes(' ');
    
    if (isUrl) {
      // It's a URL, prepend https:// if needed
      if (!urlToLoad.startsWith('http://') && !urlToLoad.startsWith('https://')) {
        urlToLoad = 'https://' + urlToLoad;
      }
    } else {
      // It's a search query, construct Google search URL
      urlToLoad = `https://www.google.com/search?q=${encodeURIComponent(urlToLoad)}`;
    }
    
    // If we're already on that page, just refresh
    if (currentUrl === urlToLoad) {
        refresh();
        return;
    }

    // Update history, truncating any "forward" history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(urlToLoad);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const goHome = () => {
    // Explicitly navigate home instead of just refreshing
    handleNavigationRequest(initialUrl);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNavigationRequest(addressBarValue);
    }
  };

  const handleBookmarkClick = (bookmark: Bookmark) => {
    if (bookmark.isError && bookmark.errorContent) {
      setErrorContent(bookmark.errorContent);
      setIsError(true);
      setIsLoading(false); // Make sure loading screen is hidden
    } else if (bookmark.url) {
      handleNavigationRequest(bookmark.url);
    }
  };

  // Simple load handler now, just stops the loading indicator
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const uniqueInputId = `url-input-${windowId}`;
  
  // Determine if the address bar should show the placeholder
  const showPlaceholder = currentUrl !== initialUrl;

  return (
    <div className="w-full h-full flex flex-col bg-[#ece9d8]">
      {/* Toolbar */}
      <div className="flex items-center p-1 bg-[#ece9d8] border-b border-gray-400 gap-1 flex-shrink-0">
        <BrowserButton onClick={goBack} disabled={historyIndex === 0}>Back</BrowserButton>
        <BrowserButton onClick={goForward} disabled={historyIndex >= history.length - 1}>Forward</BrowserButton>
        <BrowserButton onClick={goHome}>Home</BrowserButton>

        <label htmlFor={uniqueInputId} className="text-xs mr-1 ml-1 text-black">Address:</label>
        <input
            id={uniqueInputId}
            type="text"
            value={addressBarValue}
            placeholder={showPlaceholder ? "Search or type a URL..." : ""}
            onChange={(e) => setAddressBarValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow bg-white border border-gray-500 text-xs px-1 py-0.5 text-black"
        />
        <button 
            onClick={() => handleNavigationRequest(addressBarValue)} 
            className="text-xs text-black px-4 py-0.5 bg-[#ece9d8] border border-gray-500 rounded-sm shadow-sm hover:bg-gray-200"
        >
            Go
        </button>
      </div>
      
      {/* Bookmarks Bar */}
      <div className="flex items-center px-1 py-0.5 bg-[#ece9d8] border-b border-gray-400 gap-1 flex-shrink-0">
        <span className="text-xs mr-1 text-black">Links:</span>
        {bookmarks.map((bookmark) => (
            <BookmarkButton key={bookmark.name} onClick={() => handleBookmarkClick(bookmark)}>
                {bookmark.name}
            </BookmarkButton>
        ))}
      </div>

      {/* Content */}
      <div className="flex-grow relative bg-white">
        {isLoading && !isError && (
            <div className="absolute inset-0 bg-white flex items-center justify-center text-gray-500 z-10">
                Loading...
            </div>
        )}
        {isError && errorContent && (
            <div className="absolute inset-0 bg-[#ece9d8] flex flex-col items-center justify-center text-black p-4 text-center z-20">
                <p className="font-bold text-lg">{errorContent.title}</p>
                <p className="mt-2">{errorContent.message}</p>
            </div>
        )}
        <iframe
          key={`${currentUrl}-${key}`}
          ref={iframeRef}
          src={isError ? 'about:blank' : currentUrl}
          onLoad={handleIframeLoad}
          onError={handleIframeLoad} // Treat network errors same as load for simplicity now
          title="Browser"
          className={`w-full h-full border-none ${isError ? 'invisible' : ''}`}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};