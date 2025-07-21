
'use client';

import * as React from 'react';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

export function LanguageToggle() {
    const { language, toggleLanguage, isLoaded } = useLanguage();
    const { isLoggedIn } = useAuth();
    
    if (!isLoaded || !isLoggedIn) {
        return null;
    }

    const isBengali = language === 'bn';

    return (
        <div className="relative flex w-48 h-10 items-center rounded-full bg-muted p-1 border">
            <button
                onClick={() => { if (isBengali) toggleLanguage(); }}
                className={cn(
                    "relative flex-1 text-center z-10 text-sm font-semibold transition-colors h-full flex items-center justify-center rounded-full",
                    !isBengali ? "text-primary-foreground" : "text-foreground"
                )}
                aria-pressed={!isBengali}
            >
                English
            </button>
            <button
                onClick={() => { if (!isBengali) toggleLanguage(); }}
                className={cn(
                    "relative flex-1 text-center z-10 text-sm font-semibold transition-colors h-full flex items-center justify-center rounded-full",
                    isBengali ? "text-primary-foreground" : "text-foreground"
                )}
                aria-pressed={isBengali}
            >
                Bengali
            </button>
            <div
                className={cn(
                    'absolute top-1 w-[calc(50%-4px)] h-8 bg-primary rounded-full shadow-md transform transition-transform duration-300 ease-in-out',
                    isBengali ? 'translate-x-[calc(100%+3px)]' : 'translate-x-1'
                )}
            />
        </div>
    );
}
