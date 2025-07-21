
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useAuth } from '@/context/auth-context';
import { usePathname } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRequests } from '@/context/request-context';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';

export default function MainNav() {
  const { isLoggedIn, logout, user } = useAuth();
  const { mode, setMode } = useRequests();
  const pathname = usePathname();
  const { t, language, toggleLanguage, isLoaded } = useLanguage();

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/messages', label: t('nav.messages') },
    { href: '/notifications', label: t('nav.notifications') },
    { href: '/history', label: t('nav.history') },
  ];
  
  const recipientNav = { href: '/donors', label: 'Donors' };
  const donorNav = { href: '/leaderboard', label: t('nav.leaderboard') };


  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary font-headline">RoktoProbaho</span>
          </Link>
          {isLoggedIn && (
             <nav className="hidden h-16 md:flex items-center gap-2">
                {navItems.map(item => {
                  const isActive = item.href === '/' ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      className={cn(
                        "flex items-center px-4 text-sm font-medium h-full border-b-2 transition-colors",
                        isActive 
                          ? 'border-primary text-primary' 
                          : 'border-transparent text-muted-foreground hover:text-primary'
                      )}
                    >
                        {item.label}
                    </Link>
                  )
                })}
                 {mode === 'donor' ? (
                  <Link 
                    href={donorNav.href} 
                    className={cn(
                      "flex items-center px-4 text-sm font-medium h-full border-b-2 transition-colors",
                      pathname.startsWith(donorNav.href)
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-muted-foreground hover:text-primary'
                    )}
                  >
                    {donorNav.label}
                  </Link>
                ) : (
                  <Link 
                    href={recipientNav.href} 
                    className={cn(
                      "flex items-center px-4 text-sm font-medium h-full border-b-2 transition-colors",
                      pathname.startsWith(recipientNav.href)
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-muted-foreground hover:text-primary'
                    )}
                  >
                    {recipientNav.label}
                  </Link>
                )}
             </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-4">
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
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Icons.user className="mr-2 h-4 w-4" />
                                <span>{t('nav.appMode')}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => setMode('donor')} disabled={mode === 'donor'}>
                                      <Icons.userCheck className="mr-2 h-4 w-4" />
                                      {t('nav.donorMode')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setMode('recipient')} disabled={mode === 'recipient'}>
                                      <Icons.users className="mr-2 h-4 w-4" />
                                      {t('nav.recipientMode')}
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
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
              <nav className="flex items-center space-x-2">
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
