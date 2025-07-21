
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { AppMode } from '@/context/request-context';
import { useLanguage } from '@/context/language-context';

interface AppModeToggleProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export function AppModeToggle({ mode, setMode }: AppModeToggleProps) {
  const { t } = useLanguage();
  const isDonor = mode === 'donor';

  return (
    <div className="relative flex w-48 h-10 items-center rounded-full bg-muted p-1 border">
      <button
        onClick={() => setMode('donor')}
        className={cn(
          "relative flex-1 text-center z-10 text-sm font-semibold transition-colors h-full flex items-center justify-center rounded-full",
          isDonor ? "text-primary-foreground" : "text-foreground"
        )}
        aria-pressed={isDonor}
      >
        {t('nav.donorMode')}
      </button>
      <button
        onClick={() => setMode('recipient')}
        className={cn(
          "relative flex-1 text-center z-10 text-sm font-semibold transition-colors h-full flex items-center justify-center rounded-full",
          !isDonor ? "text-primary-foreground" : "text-foreground"
        )}
        aria-pressed={!isDonor}
      >
        {t('nav.recipientMode')}
      </button>
      <div
        className={cn(
          'absolute top-1 w-[calc(50%-4px)] h-8 bg-primary rounded-full shadow-md transform transition-transform duration-300 ease-in-out',
          isDonor ? 'translate-x-1' : 'translate-x-[calc(100%+3px)]'
        )}
      />
    </div>
  );
}
