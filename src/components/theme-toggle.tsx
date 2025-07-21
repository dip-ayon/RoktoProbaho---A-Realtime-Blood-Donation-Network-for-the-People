
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!isMounted) {
    return <div className="w-20 h-10 rounded-full bg-muted animate-pulse" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative w-20 h-10 rounded-full flex items-center transition-colors duration-500 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
        theme === 'light' ? 'bg-sky-400' : 'bg-gray-900'
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {/* Stars for dark mode */}
        <div className={cn("absolute w-full h-full transition-opacity duration-500", theme === 'dark' ? 'opacity-100' : 'opacity-0')}>
            <div className="absolute top-2 left-3 w-1 h-1 bg-white rounded-full" style={{ transform: 'scale(0.5)' }}></div>
            <div className="absolute top-5 left-8 w-1 h-1 bg-white rounded-full" style={{ transform: 'scale(0.8)' }}></div>
            <div className="absolute top-3 left-12 w-1 h-1 bg-white rounded-full" style={{ transform: 'scale(0.6)' }}></div>
             <div className="absolute top-6 left-1 w-1 h-1 bg-white rounded-full" style={{ transform: 'scale(0.7)' }}></div>
        </div>

        {/* Clouds for light mode */}
        <div className={cn("absolute w-full h-full transition-opacity duration-500", theme === 'light' ? 'opacity-100' : 'opacity-0')}>
            <div className="absolute -bottom-1 right-0 w-8 h-4 bg-white rounded-t-full opacity-80"></div>
            <div className="absolute -bottom-1 right-5 w-10 h-5 bg-white rounded-t-full opacity-60"></div>
        </div>
      </div>
      
      {/* Sun/Moon toggle thumb */}
      <div
        className={cn(
          'absolute w-8 h-8 rounded-full bg-white shadow-lg transform transition-transform duration-500 ease-in-out',
          'flex items-center justify-center',
          theme === 'light' ? 'translate-x-1 bg-yellow-400' : 'translate-x-11 bg-gray-300'
        )}
      >
        {/* Moon Craters */}
        <div className={cn("absolute w-full h-full transition-opacity duration-500", theme === 'dark' ? 'opacity-100' : 'opacity-0')}>
            <div className="absolute top-1 left-4 w-2 h-2 bg-gray-400 rounded-full opacity-70"></div>
            <div className="absolute top-4 left-2 w-3 h-3 bg-gray-400 rounded-full opacity-70"></div>
        </div>
      </div>
    </button>
  );
}
