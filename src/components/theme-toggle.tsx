
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from "class-variance-authority"


const themeToggleVariants = cva(
  'relative flex items-center rounded-full transition-colors duration-500 ease-in-out',
  {
    variants: {
      size: {
        default: 'w-20 h-10',
        sm: 'w-16 h-8',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const thumbVariants = cva(
  'absolute rounded-full bg-white shadow-lg transform transition-transform duration-500 ease-in-out flex items-center justify-center',
  {
      variants: {
          size: {
              default: 'w-8 h-8',
              sm: 'w-6 h-6'
          }
      },
      defaultVariants: {
          size: 'default'
      }
  }
);


interface ThemeToggleProps extends VariantProps<typeof themeToggleVariants> {}


export function ThemeToggle({ size }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!isMounted) {
    return <div className={cn(themeToggleVariants({size}), "bg-muted animate-pulse")} />;
  }
  
  const thumbPosition = size === 'sm' 
    ? (theme === 'light' ? 'translate-x-1' : 'translate-x-9') 
    : (theme === 'light' ? 'translate-x-1' : 'translate-x-11');


  return (
    <button
      onClick={toggleTheme}
      className={cn(
        themeToggleVariants({size}),
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
          thumbVariants({size}),
          thumbPosition,
          theme === 'light' ? 'bg-yellow-400' : 'bg-gray-300'
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
