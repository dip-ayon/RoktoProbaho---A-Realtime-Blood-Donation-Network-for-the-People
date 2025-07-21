
'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';

const mockUser = {
    id: 'usr_1',
    name: 'Dip Kundu',
    email: 'dip.kundu@example.com',
    phone: '+8801711223344',
    address: '123 Mirpur, Dhaka',
    bloodType: 'O+' as const,
    availability: 'Available' as const,
    donations: 5,
    lastDonationDate: '2023-11-15',
    dateOfBirth: '1990-05-25',
    avatarUrl: 'https://placehold.co/128x128.png',
    badges: ['5+ Donations', 'First Responder'],
    role: 'donor' as const,
    weight: 75,
  };

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // In a real app, you'd validate credentials here
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      login(mockUser);
    } else {
      toast({
        title: 'Login Failed',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="text-center">
            <Icons.logo className="mx-auto h-12 w-12 text-primary mb-2" />
            <CardTitle className="text-2xl">{t('login.title')}</CardTitle>
            <CardDescription>{t('login.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('login.emailLabel')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('login.emailPlaceholder')}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t('login.passwordLabel')}</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t('login.loginButton')}
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
              {t('login.noAccount')}{' '}
              <Link href="/signup" className="underline text-primary">
                {t('login.signupLink')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
