'use client';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useLanguage } from '@/context/language-context';
import { notifications as mockNotifications } from '@/lib/data';
import type { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function NotificationsPage() {
    const { t } = useLanguage();

    const getIconForType = (type: Notification['type']) => {
        switch (type) {
            case 'offer_accepted': return <Icons.userCheck className="text-green-500" />;
            case 'new_message': return <Icons.chat className="text-blue-500" />;
            case 'request_fulfilled': return <Icons.check className="text-primary" />;
            case 'welcome': return <Icons.logo className="text-primary" />;
            default: return <Icons.notification />;
        }
    };

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold font-headline mb-2">Notifications</h1>
      <p className="text-muted-foreground mb-8">Here are your latest updates and alerts.</p>
      
       <Card>
        <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>All your important updates in one place.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 p-2">
           {mockNotifications.length > 0 ? mockNotifications.map((notif) => (
             <div key={notif.id} className={cn("flex items-start gap-4 p-4 rounded-lg", !notif.read ? "bg-muted" : "bg-transparent")}>
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-background rounded-full">
                    {getIconForType(notif.type)}
                </div>
                <div className="flex-grow">
                    <p className="text-sm">{notif.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.date}</p>
                </div>
                <div className='flex items-center gap-2'>
                    {notif.link && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={notif.link}>View</Link>
                        </Button>
                    )}
                    {!notif.read && <div className="h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0" aria-label="Unread"></div>}
                </div>
             </div>
           )) : (
            <div className="text-center py-16 text-muted-foreground">
                <Icons.notification className="w-12 h-12 mx-auto mb-4" />
                <p>You have no new notifications.</p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
