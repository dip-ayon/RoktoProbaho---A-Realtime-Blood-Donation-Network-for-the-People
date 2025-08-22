
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



export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setLoading(true);
      try {
        const result = await login({ email, password });
        if (result.success) {
          toast({
            title: 'Login Successful',
            description: 'Welcome back!',
          });
        } else {
          toast({
            title: 'Login Failed',
            description: result.error || 'Invalid credentials',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Login Failed',
          description: 'An error occurred. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : t('login.loginButton')}
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
