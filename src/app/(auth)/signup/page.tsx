
'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import type { BloodType } from '@/lib/types';

const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function SignupPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bloodType, setBloodType] = useState<BloodType | ''>('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !phone || !address || !bloodType || !password) {
        toast({
            title: 'Incomplete Form',
            description: 'Please fill out all fields to create your account.',
            variant: 'destructive',
        });
        return;
    }
    
    if (phone.length !== 11 || !/^\d{11}$/.test(phone)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid 11-digit Bangladeshi phone number.',
        variant: 'destructive',
      });
      return;
    }

    const newUserProfile = {
        id: `usr_${Date.now()}`,
        name: fullName,
        email,
        phone: `+88${phone}`,
        address,
        bloodType: bloodType as BloodType,
        availability: 'Available' as const,
        donations: 0,
        lastDonationDate: '',
        dateOfBirth: '1990-01-01', // Placeholder
        avatarUrl: 'https://placehold.co/128x128.png',
        badges: [],
        weight: 0,
        role: 'donor' as const,
    };

    toast({
      title: 'Account Created!',
      description: "You're now ready to save lives.",
    });
    login(newUserProfile);
  };

  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <Card>
          <CardHeader className="text-center">
             <Icons.logo className="mx-auto h-12 w-12 text-primary mb-2" />
            <CardTitle className="text-2xl">{t('signup.title')}</CardTitle>
            <CardDescription>{t('signup.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">{t('signup.fullNameLabel')}</Label>
                <Input id="full-name" placeholder={t('signup.fullNamePlaceholder')} required value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('signup.emailLabel')}</Label>
                <Input id="email" type="email" placeholder={t('signup.emailPlaceholder')} required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">{t('signup.phoneLabel')}</Label>
                <div className="flex items-center">
                    <span className="inline-flex items-center px-3 h-10 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        +88
                    </span>
                    <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="01XXXXXXXXX" 
                        required 
                        value={phone} 
                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} 
                        className="rounded-l-none"
                        maxLength={11}
                    />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="address">{t('signup.addressLabel')}</Label>
                  <Input id="address" placeholder={t('signup.addressPlaceholder')} required value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="blood-type">{t('signup.bloodTypeLabel')}</Label>
                  <Select required onValueChange={(value: BloodType) => setBloodType(value)} value={bloodType}>
                    <SelectTrigger id="blood-type">
                      <SelectValue placeholder={t('signup.bloodTypePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t('signup.passwordLabel')}</Label>
                <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                {t('signup.createAccountButton')}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              {t('signup.haveAccount')}{' '}
              <Link href="/login" className="underline text-primary">
                {t('signup.loginLink')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
