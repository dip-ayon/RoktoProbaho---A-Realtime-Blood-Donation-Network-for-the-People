
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useAuth } from '@/context/auth-context';
import { usePathname } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRequests } from '@/context/request-context';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { LanguageToggle } from './language-toggle';
import { AppModeToggle } from './app-mode-toggle';

export default function MainNav() {
  const { isLoggedIn, logout, user } = useAuth();
  const { mode } = useRequests();
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/', label: t('nav.home'), icon: Icons.layoutDashboard },
    { href: '/messages', label: t('nav.messages'), icon: Icons.chat },
    { href: '/notifications', label: t('nav.notifications'), icon: Icons.notification },
    { href: '/history', label: t('nav.history'), icon: Icons.history },
  ];
  
  const recipientNav = { href: '/donors', label: 'Donors', icon: Icons.users };
  const donorNav = { href: '/leaderboard', label: t('nav.leaderboard'), icon: Icons.leaderboard };


  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="hidden sm:inline-block text-2xl font-bold text-primary font-headline">RoktoProbaho</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-1">
          {isLoggedIn && (
             <nav className="hidden h-16 md:flex items-center gap-1">
                {navItems.map(item => {
                  const isActive = item.href === '/' ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Button asChild variant="ghost" className={cn(
                      "h-auto px-3 py-2 text-base font-semibold transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                    )}>
                      <Link href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </Button>
                  )
                })}
                 {mode === 'donor' ? (
                    <Button asChild variant="ghost" className={cn(
                      "h-auto px-3 py-2 text-base font-semibold transition-colors",
                      pathname.startsWith(donorNav.href) ? "text-primary" : "text-muted-foreground hover:text-primary"
                    )}>
                      <Link href={donorNav.href} className="flex items-center gap-2">
                        <donorNav.icon className="h-5 w-5" />
                        {donorNav.label}
                      </Link>
                    </Button>
                ) : (
                    <Button asChild variant="ghost" className={cn(
                      "h-auto px-3 py-2 text-base font-semibold transition-colors",
                      pathname.startsWith(recipientNav.href) ? "text-primary" : "text-muted-foreground hover:text-primary"
                    )}>
                      <Link href={recipientNav.href} className="flex items-center gap-2">
                        <recipientNav.icon className="h-5 w-5" />
                        {recipientNav.label}
                      </Link>
                    </Button>
                )}
                 <div className="ml-2 hidden sm:flex">
                  <AppModeToggle />
                </div>
             </nav>
          )}
        </div>

        <div className="flex-1" />

        <div className="flex justify-end items-center space-x-2">
            <div className="hidden sm:flex items-center gap-2">
                <LanguageToggle size="sm" />
            </div>
            <ThemeToggle size="sm" />
            {isLoggedIn ? (
              <div className="hidden md:flex items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                         <Avatar className="h-8 w-8">
                           <AvatarImage src={user?.avatarUrl} data-ai-hint="person" alt={user?.name} />
                           <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                         </Avatar>
                       </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>{t('nav.myAccount')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href="/settings"><Icons.settings className="mr-2" />{t('nav.settings')}</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/help"><Icons.help className="mr-2" />{t('nav.help')}</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/support"><Icons.support className="mr-2" />{t('nav.support')}</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Icons.logout className="mr-2" />
                            <span>{t('nav.logout')}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <nav className="hidden md:flex items-center space-x-2">
                 <Button asChild variant="ghost">
                  <Link href="/login">{t('nav.login')}</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">{t('nav.signup')}</Link>
                </Button>
              </nav>
            )}
        </div>
      </div>
    </header>
  );
}
