
'use client';

import * as React from 'react';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const languageToggleVariants = cva(
    'relative flex items-center rounded-full bg-muted p-1 border',
    {
      variants: {
        size: {
          default: 'w-48 h-10',
          sm: 'w-36 h-8',
        },
      },
      defaultVariants: {
        size: 'default',
      },
    }
);

const buttonVariants = cva(
    "relative flex-1 text-center z-10 font-semibold transition-colors h-full flex items-center justify-center rounded-full",
    {
        variants: {
            size: {
                default: 'text-sm',
                sm: 'text-xs'
            }
        },
        defaultVariants: {
            size: 'default'
        }
    }
);

const sliderVariants = cva(
    'absolute top-1 bg-primary rounded-full shadow-md transform transition-transform duration-300 ease-in-out',
    {
        variants: {
            size: {
                default: 'w-[calc(50%-4px)] h-8',
                sm: 'w-[calc(50%-3px)] h-6'
            }
        },
        defaultVariants: {
            size: 'default'
        }
    }
);


interface LanguageToggleProps extends VariantProps<typeof languageToggleVariants> {
    className?: string;
}

export function LanguageToggle({ className, size }: LanguageToggleProps) {
    const { language, toggleLanguage, isLoaded } = useLanguage();
    
    if (!isLoaded) {
        return <div className={cn(languageToggleVariants({size, className}), 'animate-pulse')} />;
    }

    const isBengali = language === 'bn';

    return (
        <div className={cn(languageToggleVariants({size, className}))}>
            <button
                onClick={() => { if (isBengali) toggleLanguage(); }}
                className={cn(
                    buttonVariants({size}),
                    !isBengali ? "text-primary-foreground" : "text-foreground"
                )}
                aria-pressed={!isBengali}
            >
                English
            </button>
            <button
                onClick={() => { if (!isBengali) toggleLanguage(); }}
                className={cn(
                    buttonVariants({size}),
                    isBengali ? "text-primary-foreground" : "text-foreground"
                )}
                aria-pressed={isBengali}
            >
                Bengali
            </button>
            <div
                className={cn(
                    sliderVariants({size}),
                    isBengali ? 'translate-x-[calc(100%+3px)]' : 'translate-x-1'
                )}
            />
        </div>
    );
}
