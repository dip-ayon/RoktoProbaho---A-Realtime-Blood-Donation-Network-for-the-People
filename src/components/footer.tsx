'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { useRequests } from '@/context/request-context';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const pathname = usePathname();

  // ⬇️ useAuth does not have `isLoggedIn`; derive it from `user`
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const { t } = useLanguage();
  const { mode } = useRequests();

  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-semibold">RoktoProbaho</p>
            <p className="text-sm text-muted-foreground">
              {t?.('footer.tagline') ?? 'A Realtime Blood Donation Network for the People'}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <Link
              href="/"
              className={`hover:underline ${pathname === '/' ? 'font-medium' : ''}`}
            >
              {t?.('nav.home') ?? 'Home'}
            </Link>
            <Link
              href="/donors"
              className={`hover:underline ${pathname === '/donors' ? 'font-medium' : ''}`}
            >
              {t?.('nav.donors') ?? 'Donors'}
            </Link>
            <Link
              href="/requests"
              className={`hover:underline ${pathname === '/requests' ? 'font-medium' : ''}`}
            >
              {t?.('nav.requests') ?? 'Requests'}
            </Link>
            <Link
              href="/leaderboard"
              className={`hover:underline ${pathname === '/leaderboard' ? 'font-medium' : ''}`}
            >
              {t?.('nav.leaderboard') ?? 'Leaderboard'}
            </Link>
            <Link
              href="/about"
              className={`hover:underline ${pathname === '/about' ? 'font-medium' : ''}`}
            >
              {t?.('nav.about') ?? 'About'}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {t?.('footer.loggedInAs') ?? 'Logged in as'}{' '}
                  <span className="font-medium">{user?.name ?? 'User'}</span> • {t?.('dashboard.' + mode) ?? mode}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  {t?.('actions.logout') ?? 'Logout'}
                </Button>
                <Link href="/dashboard">
                  <Button size="sm">{t?.('actions.dashboard') ?? 'Dashboard'}</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    {t?.('actions.login') ?? 'Login'}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">{t?.('actions.register') ?? 'Register'}</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {year} RoktoProbaho. {t?.('footer.rights') ?? 'All rights reserved.'}</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="hover:underline">
              {t?.('footer.privacy') ?? 'Privacy'}
            </Link>
            <Link href="/terms" className="hover:underline">
              {t?.('footer.terms') ?? 'Terms'}
            </Link>
            <a
              href="mailto:support@roktoprobaho.example"
              className="hover:underline"
            >
              {t?.('footer.contact') ?? 'Contact'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
