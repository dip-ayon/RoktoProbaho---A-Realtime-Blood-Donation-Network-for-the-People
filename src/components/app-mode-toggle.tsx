
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useRequests } from '@/context/request-context';
import { useLanguage } from '@/context/language-context';
import { Icons } from './icons';

export function AppModeToggle() {
  const { mode, setMode } = useRequests();
  const { t } = useLanguage();
  const isDonor = mode === 'donor';

  const toggleMode = () => {
    setMode(isDonor ? 'recipient' : 'donor');
  };

  return (
    <Button 
      variant={isDonor ? 'default' : 'secondary'} 
      onClick={toggleMode} 
      className="hidden sm:flex"
    >
      {isDonor ? (
        <>
          <Icons.logo className="mr-2 h-4 w-4" />
          {t('dashboard.donor')}
        </>
      ) : (
        <>
          <Icons.users className="mr-2 h-4 w-4" />
          {t('dashboard.recipient')}
        </>
      )}
    </Button>
  );
}
