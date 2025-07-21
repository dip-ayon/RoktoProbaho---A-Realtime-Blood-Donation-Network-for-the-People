'use client';

import { useAuth } from '@/context/auth-context';
import Dashboard from '@/components/dashboard';
import LandingPage from '@/components/landing-page';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { isLoggedIn, isAuthLoaded } = useAuth();

  if (!isAuthLoaded) {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="space-y-4">
                <Skeleton className="h-12 w-1/2" />
                <Skeleton className="h-8 w-3/4" />
                <div className="pt-8">
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return <LandingPage />;
}
