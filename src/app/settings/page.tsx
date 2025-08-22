'use client';

import { useState, useEffect, useMemo } from 'react';
import { format, differenceInYears } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import type { UserProfile, AvailabilityStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useRequests } from '@/context/request-context';
import { useLanguage } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { AppModeToggle } from '@/components/app-mode-toggle';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dob, setDob] = useState<Date | undefined>();
  const [lastDonation, setLastDonation] = useState<Date | undefined>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ✅ only `mode` from requests context
  const { mode } = useRequests();
  // ✅ `language` belongs to language context
  const { t, language } = useLanguage();

  useEffect(() => {
    if (user) {
      // Normalize address into a string (handles object or string from backend)
      const addressString =
        typeof (user as any).address === 'string'
          ? (user as any).address
          : [
              (user as any).address?.street,
              (user as any).address?.city,
              (user as any).address?.state,
              (user as any).address?.country,
            ]
              .filter(Boolean)
              .join(', ');

      // Provide required fields for UserProfile and safe defaults for the UI
      const userWithDefaults = {
        // ensure required id
        id: (user as any).id ?? (user as any)._id ?? '',

        // keep all original props
        ...user,

        // UI-safe defaults
        badges: (user as any).badges ?? [],
        donations: (user as any).donations ?? '0',
        availability: ((user as any).availability as AvailabilityStatus) ?? 'Available',
        bloodType: (user as any).bloodType ?? (user as any).bloodGroup ?? 'N/A',
        avatarUrl: (user as any).avatarUrl ?? (user as any).profilePicture ?? '',
        dateOfBirth: (user as any).dateOfBirth ?? '',
        lastDonationDate: (user as any).lastDonationDate ?? '',
        phone: (user as any).phone ?? '',
        address: addressString,
      } as unknown as UserProfile;

      setProfile(userWithDefaults);

      if ((user as any).dateOfBirth) setDob(new Date((user as any).dateOfBirth));
      if ((user as any).lastDonationDate) setLastDonation(new Date((user as any).lastDonationDate));
    }
  }, [user]);

  const calculatedAge = useMemo(() => {
    if (!profile?.dateOfBirth) return 'N/A';
    try {
      return `${differenceInYears(new Date(), new Date(profile.dateOfBirth))} years`;
    } catch {
      return 'Invalid Date';
    }
  }, [profile?.dateOfBirth]);

  const handleFieldChange = (field: keyof UserProfile, value: any) => {
    setProfile((p) => (p ? { ...p, [field]: value } : null));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && profile) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFieldChange('avatarUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    if (profile) {
      const updatedProfileData: Partial<UserProfile> = {
        ...profile,
        dateOfBirth: dob ? format(dob, 'yyyy-MM-dd') : '',
        lastDonationDate: lastDonation ? format(lastDonation, 'yyyy-MM-dd') : '',
      };
      updateUser(updatedProfileData as any);
      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
    }
  };

  const handleSavePreferences = () => {
    toast({
      title: 'Preferences Saved',
      description: 'Your app preferences have been updated.',
    });
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: 'Fields are empty',
        description: 'Please fill in all password fields.',
        variant: 'destructive',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Your new password and confirmation do not match.',
        variant: 'destructive',
      });
      return;
    }
    // TODO: call your API to change password
    toast({
      title: 'Password Changed',
      description: 'Your password has been updated successfully.',
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (!profile) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold font-headline mb-2">{t('settings.title')}</h1>
      <p className="text-muted-foreground mb-8">{t('settings.description')}</p>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.profileDetails.title')}</CardTitle>
          <CardDescription>{t('settings.profileDetails.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatarUrl || undefined} data-ai-hint="person" />
              <AvatarFallback>{profile.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Label htmlFor="avatar-upload" className={cn(buttonVariants(), 'cursor-pointer')}>
                <Icons.upload className="mr-2 h-4 w-4" /> {t('settings.profileDetails.changePhoto')}
              </Label>
              <Input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              <p className="text-xs text-muted-foreground">{t('settings.profileDetails.photoHint')}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">{t('settings.profileDetails.fullName')}</Label>
              <Input id="name" value={profile.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{t('settings.profileDetails.email')}</Label>
              <Input id="email" type="email" value={profile.email} onChange={(e) => handleFieldChange('email', e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">{t('settings.profileDetails.phone')}</Label>
              <Input id="phone" type="tel" value={profile.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">{t('settings.profileDetails.address')}</Label>
              <Input
                id="address"
                value={typeof profile.address === 'string' ? profile.address : ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dob">{t('settings.profileDetails.dob')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-full justify-start text-left font-normal', !dob && 'text-muted-foreground')}
                  >
                    <Icons.calendar className="mr-2 h-4 w-4" />
                    {dob ? format(dob, 'PPP') : <span>{t('settings.profileDetails.pickDate')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dob}
                    onSelect={setDob}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1950}
                    toYear={2010}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" value={calculatedAge} readOnly disabled />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={profile.weight ?? ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  handleFieldChange('weight', isNaN(val) ? undefined : val);
                }}
                placeholder="e.g., 70"
              />
            </div>

            <div className="grid gap-2">
              <Label>{t('settings.profileDetails.lastDonation')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-full justify-start text-left font-normal', !lastDonation && 'text-muted-foreground')}
                  >
                    <Icons.calendar className="mr-2 h-4 w-4" />
                    {lastDonation ? format(lastDonation, 'PPP') : <span>{t('settings.profileDetails.pickDate')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={lastDonation} onSelect={setLastDonation} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="report">{t('settings.profileDetails.bloodReport')}</Label>
              <div className="flex items-center gap-2">
                <Input id="report" type="file" className="flex-1" />
                <Button variant="outline">
                  <Icons.upload className="mr-2 h-4 w-4" />
                  {t('settings.profileDetails.upload')}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{t('settings.profileDetails.uploadReportHint')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('settings.profileDetails.availability')}</Label>
            <RadioGroup
              value={profile.availability as AvailabilityStatus}
              onValueChange={(value) => handleFieldChange('availability', value as AvailabilityStatus)}
              className="flex flex-col sm:flex-row gap-4"
            >
              {(['Available', 'Temporarily Unavailable', 'Not Available'] as AvailabilityStatus[]).map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <RadioGroupItem value={status} id={status.replace(/ /g, '-')} />
                  <Label htmlFor={status.replace(/ /g, '-')} className="font-normal">
                    {t(`settings.profileDetails.${status.replace(/ /g, '').toLowerCase()}` as any)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label>{t('settings.profileDetails.bloodType')}</Label>
              <Input value={profile.bloodType} readOnly disabled />
            </div>
            <div>
              <Label>{t('settings.profileDetails.totalDonations')}</Label>
              <Input value={profile.donations} readOnly disabled />
            </div>
            <div className="md:col-span-2">
              <Label>{t('settings.profileDetails.badges')}</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.badges && profile.badges.length > 0 ? (
                  profile.badges.map((badge) => (
                    <Badge key={badge} variant="secondary" className="text-sm">
                      <Icons.award className="w-4 h-4 mr-1" />
                      {badge}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No badges earned yet. Start donating to earn badges!
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges}>{t('settings.profileDetails.saveChanges')}</Button>
        </CardFooter>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password here. It's a good practice to use a strong password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </CardFooter>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t('settings.appSettings.title')}</CardTitle>
          <CardDescription>{t('settings.appSettings.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label>{t('settings.appSettings.appMode')}</Label>
              <p className="text-[0.8rem] text-muted-foreground">
                Your current role is set to <strong>{mode}</strong>. Click to switch roles.
              </p>
            </div>
            <AppModeToggle />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label>{t('settings.appSettings.language')}</Label>
              <p className="text-[0.8rem] text-muted-foreground">
                {language === 'en' ? 'English' : 'Bengali'}
              </p>
            </div>
            <LanguageToggle />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-[0.8rem] text-muted-foreground">Select your preferred color scheme.</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSavePreferences}>{t('settings.appSettings.savePreferences')}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
