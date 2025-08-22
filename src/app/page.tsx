'use client';

import { useAuth } from '@/context/auth-context';
import Dashboard from '@/components/dashboard';
import LandingPage from '@/components/landing-page';
import ApiTest from '@/components/api-test';
import DebugButtons from '@/components/debug-buttons';
import FeatureTest from '@/components/feature-test';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
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

  if (user) {
    return <Dashboard />;
  }

  return (
    <div>
      <LandingPage />
      <div className="container mx-auto py-8 px-4 space-y-8">
        <FeatureTest />
        <DebugButtons />
        <ApiTest />
      </div>
    </div>
  );
}
