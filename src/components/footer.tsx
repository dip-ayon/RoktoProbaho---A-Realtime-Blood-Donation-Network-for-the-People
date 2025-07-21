
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Icons } from './icons'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/auth-context'
import { useLanguage } from '@/context/language-context'
import { useRequests } from '@/context/request-context'

const menuItems = [
    { href: '/settings', label: 'Settings', icon: Icons.settings },
    { href: '/history', label: 'History', icon: Icons.history },
    { href: '/help', label: 'Help', icon: Icons.help },
    { href: '/support', label: 'Support', icon: Icons.support },
    { href: '/', label: 'About Us', icon: Icons.info },
];

function DesktopFooter() {
    return (
        <footer className="hidden md:block bg-card border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <Icons.logo className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold text-primary font-headline">RoktoProbaho</span>
                        </Link>
                        <p className="text-muted-foreground text-sm">
                            Connecting blood donors with recipients in real-time to save lives.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Navigate</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary">Home</Link></li>
                            <li><Link href="/donors" className="hover:text-primary">Find Donors</Link></li>
                            <li><Link href="/leaderboard" className="hover:text-primary">Leaderboard</Link></li>
                            <li><Link href="/" className="hover:text-primary">About Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
                            <li><Link href="/support" className="hover:text-primary">Contact Us</Link></li>
                            <li><Link href="/help" className="hover:text-primary">FAQ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="/" className="hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} RoktoProbaho. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 sm:mt-0">
                        <Link href="/" className="hover:text-primary">Twitter</Link>
                        <Link href="/" className="hover:text-primary">Facebook</Link>
                        <Link href="/" className="hover:text-primary">Instagram</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default function Footer() {
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();
  const { t, language, toggleLanguage, isLoaded } = useLanguage();
  const { mode, setMode } = useRequests();
  
  const navItems = [
    { href: '/', label: t('nav.home'), icon: Icons.layoutDashboard },
    { href: '/messages', label: t('nav.messages'), icon: Icons.chat },
    { href: '/notifications', label: t('nav.notifications'), icon: Icons.notification },
  ];
  
  if (!isLoggedIn) {
      return <DesktopFooter />;
  }
  
  return (
    <>
    <div className="md:hidden h-16" />
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
      <div className="container mx-auto px-1 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={cn(
                "flex flex-col items-center justify-center text-xs gap-1 flex-1 p-1 rounded-md", 
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
            )}>
              <item.icon className="w-6 h-6" />
              <span>{item.label}</span>
            </Link>
          )
        })}
         {mode === 'donor' ? (
          <Link href="/leaderboard" className={cn(
              "flex flex-col items-center justify-center text-xs gap-1 flex-1 p-1 rounded-md", 
              pathname.startsWith('/leaderboard') ? "text-primary bg-primary/10" : "text-muted-foreground"
          )}>
            <Icons.leaderboard className="w-6 h-6" />
            <span>{t('nav.leaderboard')}</span>
          </Link>
        ) : (
          <Link href="/donors" className={cn(
              "flex flex-col items-center justify-center text-xs gap-1 flex-1 p-1 rounded-md", 
              pathname.startsWith('/donors') ? "text-primary bg-primary/10" : "text-muted-foreground"
          )}>
            <Icons.users className="w-6 h-6" />
            <span>Donors</span>
          </Link>
        )}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex flex-col items-center justify-center text-xs gap-1 h-auto text-muted-foreground flex-1 p-1">
                    <Icons.menu className="w-6 h-6" />
                    <span>{t('nav.menu')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="mb-2 w-56">
                {menuItems.map(item => (
                    <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} className="flex items-center gap-2">
                           <item.icon className="w-4 h-4" />
                           <span>{t(`nav.${item.label.toLowerCase().replace(' ', '')}` as any, { defaultValue: item.label })}</span>
                        </Link>
                    </DropdownMenuItem>
                ))}
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
                <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <Icons.logout className="mr-2" />
                    <span>{t('nav.logout')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </footer>
    <DesktopFooter />
    </>
  )
}
