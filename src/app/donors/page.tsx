'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import type { Donor, BloodType } from '@/lib/types';

const mockDonors: Donor[] = [
  { id: 'd_1', name: 'Karim Rahman', bloodType: 'O+', location: 'Gulshan, Dhaka', availability: 'Available', avatarUrl: 'https://placehold.co/128x128.png', age: 32, weight: 75 },
  { id: 'd_2', name: 'Fatima Akter', bloodType: 'A-', location: 'Dhanmondi, Dhaka', availability: 'Available', avatarUrl: 'https://placehold.co/128x128.png', age: 28, weight: 55 },
  { id: 'd_3', name: 'Saleh Ahmed', bloodType: 'B+', location: 'Mirpur, Dhaka', availability: 'Temporarily Unavailable', avatarUrl: 'https://placehold.co/128x128.png', age: 45, weight: 82 },
  { id: 'd_4', name: 'Nadia Chowdhury', bloodType: 'AB+', location: 'Uttara, Dhaka', availability: 'Available', avatarUrl: 'https://placehold.co/128x128.png', age: 25, weight: 60 },
  { id: 'd_5', name: 'Imran Khan', bloodType: 'O-', location: 'Banani, Dhaka', availability: 'Available', avatarUrl: 'https://placehold.co/128x128.png', age: 35, weight: 78 },
];

const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorsPage() {
    const { toast } = useToast();
    const [bloodTypeFilter, setBloodTypeFilter] = useState<BloodType | 'all'>('all');
    const [locationFilter, setLocationFilter] = useState('');
    const [displayedDonors, setDisplayedDonors] = useState(() => 
        mockDonors.filter(donor => donor.availability === 'Available')
    );

    const handleSendMessage = (donorName: string) => {
        toast({
            title: 'Message Sent!',
            description: `Your message has been sent to ${donorName}. They will be notified.`,
        });
    };

    const handleFilter = () => {
        const results = mockDonors.filter(donor => {
            const availabilityMatch = donor.availability === 'Available';
            const bloodTypeMatch = bloodTypeFilter === 'all' || donor.bloodType === bloodTypeFilter;
            const locationMatch = locationFilter.trim() === '' || 
                donor.location.toLowerCase().includes(locationFilter.trim().toLowerCase());
            
            return availabilityMatch && bloodTypeMatch && locationMatch;
        });
        setDisplayedDonors(results);
        toast({
            title: 'Filters Applied',
            description: 'The donor list has been updated based on your criteria.',
        });
    };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold font-headline mb-2">Find a Donor</h1>
      <p className="text-muted-foreground mb-8">Browse available donors and send them a message directly.</p>
      
       <Card>
        <CardHeader>
            <CardTitle>Filter Donors</CardTitle>
            <CardDescription>
                Find the right donor by filtering by location and blood type.
            </CardDescription>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 items-end">
                <div className="grid gap-1.5 sm:col-span-1">
                    <Label htmlFor="location-filter">Location</Label>
                    <Input 
                        id="location-filter"
                        placeholder="e.g., Dhaka" 
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    />
                </div>
                <div className="grid gap-1.5 sm:col-span-1">
                    <Label htmlFor="blood-type-filter">Blood Type</Label>
                    <Select onValueChange={(value: BloodType | 'all') => setBloodTypeFilter(value)} defaultValue="all">
                        <SelectTrigger id="blood-type-filter">
                            <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="all">All Blood Types</SelectItem>
                            {bloodTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleFilter} className="sm:col-span-1">
                    <Icons.filter className="mr-2 h-4 w-4" /> Filter Donors
                </Button>
            </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedDonors.length > 0 ? displayedDonors.map(donor => (
                <Card key={donor.id} className="p-4 flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-4">
                        <AvatarImage src={donor.avatarUrl} data-ai-hint="person portrait" />
                        <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg">{donor.name}</h3>
                    <p className="text-muted-foreground text-sm">{donor.location}</p>
                    <div className="text-sm text-muted-foreground my-2">
                        <span>Age: {donor.age}</span> &bull; <span>Weight: {donor.weight} kg</span>
                    </div>
                    <div className="my-4 flex items-center gap-2">
                         <Badge variant="outline" className="text-lg py-1 px-3">{donor.bloodType}</Badge>
                         <Badge className={donor.availability === 'Available' ? '' : 'bg-yellow-500'}>
                            {donor.availability}
                        </Badge>
                    </div>
                    <Button className="w-full" onClick={() => handleSendMessage(donor.name)}>
                        <Icons.chat className="mr-2 h-4 w-4" /> Message
                    </Button>
                </Card>
            )) : (
                <div className="col-span-full text-center py-16 text-muted-foreground">
                    <p>No available donors match your filter criteria.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
