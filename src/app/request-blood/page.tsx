'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/language-context';

export default function RequestBloodRedirect() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <p className="text-lg">{t('requestBlood.redirecting')}</p>
    </div>
  );
}
