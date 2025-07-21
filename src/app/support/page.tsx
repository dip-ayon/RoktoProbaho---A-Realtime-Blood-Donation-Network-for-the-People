'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/icons';
import { useLanguage } from '@/context/language-context';

export default function SupportPage() {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold font-headline mb-2 text-center">{t('support.title')}</h1>
      <p className="text-muted-foreground mb-8 text-center">{t('support.description')}</p>
      
       <Card>
        <CardHeader>
            <CardTitle>{t('support.cardTitle')}</CardTitle>
            <CardDescription>{t('support.cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="email">{t('support.emailLabel')}</Label>
                <Input id="email" type="email" placeholder={t('support.emailPlaceholder')} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="subject">{t('support.subjectLabel')}</Label>
                <Input id="subject" placeholder={t('support.subjectPlaceholder')} />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="message">{t('support.messageLabel')}</Label>
                <Textarea id="message" placeholder={t('support.messagePlaceholder')} rows={6}/>
            </div>
            <Button className="w-full">
                <Icons.send className="mr-2" /> {t('support.sendButton')}
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
