'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import type {
  UserProfile,
  BloodRequest,
  DonationOpportunity,
  BloodType,
  UrgencyLevel,
  DonationOffer,
} from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import MapView from '@/components/map-view';
import { useToast } from '@/hooks/use-toast';
import { useRequests } from '@/context/request-context';
import { useLanguage } from '@/context/language-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialRequests: BloodRequest[] = [
  {
    id: 'req_1',
    requesterName: 'Self',
    bloodType: 'A+',
    quantity: 2,
    location: 'Gulshan, Dhaka',
    urgency: 'Urgent',
    date: '2024-05-20',
    status: 'Completed',
    neededByDate: '2024-05-21',
    offers: [
      {
        id: 'offer_1',
        donorId: 'd_1',
        donorName: 'Dip Kundu',
        donorBloodType: 'A+',
        donorAvatarUrl: 'https://placehold.co/128x128.png',
        status: 'Completed',
      },
    ],
  },
  {
    id: 'req_2',
    requesterName: 'Family Member',
    bloodType: 'B-',
    quantity: 1,
    location: 'Dhanmondi, Dhaka',
    urgency: 'High',
    date: '2024-06-10',
    status: 'Open',
    neededByDate: '2024-06-12',
    offers: [
      {
        id: 'offer_2',
        donorId: 'd_2',
        donorName: 'Anika Tabassum',
        donorBloodType: 'B-',
        donorAvatarUrl:
          'https://images.unsplash.com/photo-1535643302794-19c3804b874b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NTI1MjkwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        status: 'Pending',
      },
      {
        id: 'offer_3',
        donorId: 'd_3',
        donorName: 'Raihan Chowdhury',
        donorBloodType: 'O+',
        donorAvatarUrl:
          'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NTI1MjkwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        status: 'Pending',
      },
    ],
  },
  {
    id: 'req_3',
    requesterName: 'Self',
    bloodType: 'O-',
    quantity: 1,
    location: 'Banani, Dhaka',
    urgency: 'Medium',
    date: '2024-06-18',
    status: 'Open',
    neededByDate: '2024-06-20',
    offers: [],
  },
];

const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const urgencyLevels: UrgencyLevel[] = ['Urgent', 'High', 'Medium', 'Low'];
const mapLibraries: ('places')[] = ['places'];
const mapContainerStyle = {
  height: '300px',
  width: '100%',
  borderRadius: '0.375rem',
  overflow: 'hidden',
};

function RequestBloodForm() {
  const { toast } = useToast();
  const { addOpportunity } = useRequests();
  const { t } = useLanguage();

  const [patientName, setPatientName] = useState('');
  const [bloodType, setBloodType] = useState<BloodType | ''>('');
  const [quantity, setQuantity] = useState(1);
  const [urgency, setUrgency] = useState<UrgencyLevel | ''>('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState('');
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [neededDate, setNeededDate] = useState<Date>();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: mapLibraries,
    id: 'request-form-map-script',
  });

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newMarker = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setMarker(newMarker);

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: newMarker }, (results, status) => {
          if (status === 'OK') {
            if (results && results[0]) {
              setLocation(results[0].formatted_address);
            } else {
              toast({
                title: 'Location not found',
                description: 'Could not find an address for the selected point.',
                variant: 'destructive',
              });
            }
          } else {
            toast({
              title: 'Geocoder failed',
              description: `Could not determine address: ${status}`,
              variant: 'destructive',
            });
          }
        });
      }
    },
    [toast]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (phone.length !== 11 || !/^\d{11}$/.test(phone)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid 11-digit Bangladeshi phone number.',
        variant: 'destructive',
      });
      return;
    }

    if (!patientName || !bloodType || !location || !urgency || !phone || quantity < 1 || !neededDate) {
      toast({
        title: t('requestBlood.incompleteForm'),
        description: 'Please fill all required fields and set a date.',
        variant: 'destructive',
      });
      return;
    }

    addOpportunity({
      patientName,
      bloodType,
      quantity,
      location,
      urgency,
      phone: `+88${phone}`,
      lat: marker?.lat,
      lng: marker?.lng,
      neededByDate: format(neededDate, 'yyyy-MM-dd'),
      details: details,
    });

    toast({
      title: t('requestBlood.requestSubmitted'),
      description: t('requestBlood.searchingDonors'),
      variant: 'default',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 p-1 pr-4">
      <div className="grid gap-2">
        <Label htmlFor="patient-name">{t('requestBlood.patientName')}</Label>
        <Input
          id="patient-name"
          placeholder={t('requestBlood.patientNamePlaceholder')}
          required
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="blood-type">{t('requestBlood.requiredBloodType')}</Label>
          <Select required onValueChange={(value: BloodType) => setBloodType(value)} value={bloodType}>
            <SelectTrigger id="blood-type">
              <SelectValue placeholder={t('requestBlood.selectPlaceholder')} />
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
        <div className="grid gap-2">
          <Label htmlFor="quantity">{t('requestBlood.quantity')}</Label>
          <Input
            id="quantity"
            type="number"
            placeholder={t('requestBlood.quantityPlaceholder')}
            required
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">{t('requestBlood.location')}</Label>
        <p className="text-sm text-muted-foreground">Enter your address. Map pinning is optional.</p>

        <Input
          id="location"
          placeholder={t('requestBlood.addressPlaceholder')}
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Optional Map Section */}
        <div className="mt-2">
          <details className="group">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              📍 Pin exact location on map (Optional)
            </summary>
            <div className="mt-2">
              {loadError && <div className="text-destructive text-center p-4">Map could not be loaded. Please check API key and refresh.</div>}
              {!isLoaded && !loadError && <div className="text-muted-foreground text-center p-4">Loading map...</div>}
              {isLoaded && !loadError && (
                <div style={mapContainerStyle}>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={{ lat: 23.8103, lng: 90.4125 }} // Dhaka
                    zoom={11}
                    onClick={onMapClick}
                    options={{ disableDefaultUI: true, zoomControl: true }}
                  >
                    {marker && <Marker position={marker} />}
                  </GoogleMap>
                </div>
              )}
              {marker && (
                <p className="text-xs text-muted-foreground mt-1">
                  ✅ Location pinned at: {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
                </p>
              )}
            </div>
          </details>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="urgency">{t('requestBlood.urgency')}</Label>
          <Select required onValueChange={(value: UrgencyLevel) => setUrgency(value)} value={urgency}>
            <SelectTrigger id="urgency">
              <SelectValue placeholder={t('requestBlood.selectPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {urgencyLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>{t('requestBlood.neededBy')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn('w-full justify-start text-left font-normal', !neededDate && 'text-muted-foreground')}
              >
                <Icons.calendar className="mr-2 h-4 w-4" />
                {neededDate ? format(neededDate, 'PPP') : <span>{t('requestBlood.pickDate')}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={neededDate}
                onSelect={setNeededDate}
                initialFocus
                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="contact-person">{t('requestBlood.contactPhone')}</Label>
        <div className="flex items-center">
          <span className="inline-flex items-center px-3 h-10 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
            +88
          </span>
          <Input
            id="contact-person"
            type="tel"
            placeholder="01XXXXXXXXX"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            className="rounded-l-none"
            maxLength={11}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="details">{t('requestBlood.additionalDetails')}</Label>
        <Textarea
          id="details"
          placeholder={t('requestBlood.detailsPlaceholder')}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>

      <DialogClose asChild>
        <Button type="submit" className="w-full mt-2">
          {t('requestBlood.submitButton')}
        </Button>
      </DialogClose>
    </form>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { opportunities, mode } = useRequests();
  const { t } = useLanguage();
  const [requests, setRequests] = useState<BloodRequest[]>(initialRequests);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const handleOfferDonation = (opportunity: DonationOpportunity) => {
    toast({
      title: 'Offer Sent!',
      description: `Your offer to help ${opportunity.patientName} has been sent. You will be notified when they respond.`,
    });
  };

  // ✅ Strictly type the updater and ensure offers/status use literal unions
  const handleOfferResponse = (requestId: string, offerId: string, accepted: boolean) => {
    setRequests((prev: BloodRequest[]) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        const target = req.offers?.find((o) => o.id === offerId);
        if (!target) return req;

        const updatedOffers: DonationOffer[] = (req.offers ?? []).map((offer) => {
          if (offer.id === offerId) {
            return {
              ...offer,
              status: (accepted ? 'Accepted' : 'Declined') as DonationOffer['status'],
            };
          }
          // if accepting one offer, decline other pending ones
          if (accepted && offer.status === 'Pending') {
            return { ...offer, status: 'Declined' };
          }
          return offer;
        });

        const newRequestStatus: BloodRequest['status'] = accepted ? 'Fulfilled' : req.status;

        toast({
          title: `Offer ${accepted ? 'Accepted' : 'Declined'}`,
          description: `You have ${accepted ? 'accepted' : 'declined'} the offer from ${target.donorName}.`,
          variant: accepted ? 'default' : 'destructive',
        });

        return {
          ...req,
          offers: updatedOffers,
          status: newRequestStatus,
        };
      })
    );
  };

  // ✅ Also keep DonationOffer status literal here
  const handleBloodCollected = (requestId: string, offerId: string) => {
    setRequests((prev: BloodRequest[]) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        const target = req.offers?.find((o) => o.id === offerId);
        if (!target) return req;

        const updatedOffers: DonationOffer[] = (req.offers ?? []).map((offer) =>
          offer.id === offerId ? { ...offer, status: 'Completed' } : offer
        );

        toast({
          title: 'Donation Complete!',
          description: `Thank you for confirming. ${target.donorName}'s donation count has been increased.`,
        });

        return {
          ...req,
          offers: updatedOffers,
          status: 'Completed',
        };
      })
    );
  };

  if (!user) {
    return null; // or a loader
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold font-headline mb-2">
          {t('dashboard.welcome', { name: user.name })}
        </h1>
        <p className="text-muted-foreground">
          {t('dashboard.modeIntro', { mode: t(`dashboard.${mode}`) })}
        </p>
      </div>

      {mode === 'donor' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-headline">{t('dashboard.nearbyRequests')}</h2>
            <p className="text-muted-foreground">{t('dashboard.nearbyRequestsDesc')}</p>
          </div>
          {opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((op) => (
                <Card key={op.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{op.patientName}</CardTitle>
                      <Badge variant="destructive">{op.urgency}</Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1 pt-1">
                      <Icons.location className="w-4 h-4" /> {op.location} ({op.distance})
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Blood Group</span>
                      <span className="font-semibold">{op.bloodType}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-semibold">
                        {op.quantity} {op.quantity > 1 ? t('units') : t('units').slice(0, -1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Needed By</span>
                      <span className="font-semibold">
                        {format(new Date(op.neededByDate), 'PPP')}
                      </span>
                    </div>
                  </CardContent>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="m-6 mt-0">
                        <Icons.map className="mr-2 h-4 w-4" />
                        {t('dashboard.viewDetails')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Donation Opportunity</DialogTitle>
                        <DialogDescription>
                          A patient nearby needs your help. Please review the details below.
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-[calc(100vh-16rem)]">
                        <div className="px-6 pb-6 space-y-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Patient:</span>
                            <span className="font-semibold">{op.patientName}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Blood Type:</span>
                            <Badge variant="outline">{op.bloodType}</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="font-semibold">
                              {op.quantity} {op.quantity > 1 ? t('units') : t('units').slice(0, -1)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Urgency:</span>
                            <Badge variant="destructive">{op.urgency}</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Needed By:</span>
                            <span className="font-semibold">
                              {format(new Date(op.neededByDate), 'PPP')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Donation Center:</span>
                            <span className="font-semibold text-right">{op.hospitalName}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Address:</span>
                            <span className="text-right">{op.hospitalAddress}</span>
                          </div>
                          {op.details && (
                            <div className="text-sm">
                              <span className="text-muted-foreground font-semibold">
                                Additional Details:
                              </span>
                              <p className="mt-1 p-2 bg-muted rounded-md">{op.details}</p>
                            </div>
                          )}
                          <div className="mt-2 rounded-lg overflow-hidden">
                            {op.lat && op.lng ? (
                              <MapView lat={op.lat} lng={op.lng} />
                            ) : (
                              <div className="h-[250px] rounded-lg bg-muted flex items-center justify-center text-center p-4 text-muted-foreground">
                                📍 Location: {op.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </ScrollArea>
                      <DialogFooter className="grid grid-cols-2 gap-2 p-4 border-t sm:p-6 sm:flex sm:flex-row sm:justify-end sm:space-x-2">
                        <Button asChild variant="outline" className="w-full sm:w-auto">
                          <a href={`tel:${op.phone}`}>
                            <Icons.phone className="mr-2 h-4 w-4" /> Contact
                          </a>
                        </Button>
                        <Button onClick={() => handleOfferDonation(op)} className="w-full sm:w-auto">
                          <Icons.userCheck className="mr-2 h-4 w-4" /> Offer
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">{t('dashboard.noOpportunities')}</p>
          )}
        </div>
      )}

      {mode === 'recipient' && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{t('dashboard.myBloodRequests')}</CardTitle>
              <CardDescription>
                {requests.length > 0
                  ? t('dashboard.myBloodRequestsDesc')
                  : 'You have no active blood requests.'}
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Icons.add className="mr-2 h-4 w-4" /> {t('dashboard.newRequest')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t('requestBlood.title')}</DialogTitle>
                  <DialogDescription>{t('requestBlood.description')}</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] sm:max-h-[80vh]">
                  <RequestBloodForm />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent className="space-y-6">
            {requests.length > 0 ? (
              requests.map((req) => (
                <Card key={req.id} className="overflow-hidden">
                  <div className="p-4 bg-card">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-semibold">Request for {req.bloodType}</span>
                          <Badge
                            variant={
                              req.status === 'Open'
                                ? 'destructive'
                                : req.status === 'Completed'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {req.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {req.quantity} {t('units')} needed at {req.location} by{' '}
                          <span className="font-semibold">
                            {format(new Date(req.neededByDate), 'PPP')}
                          </span>
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground text-left sm:text-right">
                        Requested on {req.date}
                      </div>
                    </div>
                  </div>

                  {req.offers && req.offers.length > 0 && (
                    <div className="p-4 border-t">
                      <h4 className="font-semibold mb-3 text-sm">
                        Offers Received ({req.offers?.filter((o) => o.status === 'Pending').length || 0}{' '}
                        Pending)
                      </h4>
                      <div className="space-y-3">
                        {req.offers.map((offer) => (
                          <div
                            key={offer.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-md bg-muted gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={offer.donorAvatarUrl} data-ai-hint="person portrait" />
                                <AvatarFallback>{offer.donorName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{offer.donorName}</p>
                                <p className="text-sm text-muted-foreground">
                                  Blood Type: {offer.donorBloodType}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
                              {offer.status === 'Pending' && req.status === 'Open' && (
                                <>
                                  <Button size="sm" onClick={() => handleOfferResponse(req.id, offer.id, true)}>
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleOfferResponse(req.id, offer.id, false)}
                                  >
                                    Decline
                                  </Button>
                                </>
                              )}
                              {offer.status === 'Accepted' && (
                                <>
                                  <Button asChild size="sm">
                                    <Link href="/messages">
                                      <Icons.chat className="mr-2 h-4 w-4" /> Chat
                                    </Link>
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Icons.phone className="mr-2 h-4 w-4" /> Contact
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleBloodCollected(req.id, offer.id)}
                                  >
                                    <Icons.check className="mr-2 h-4 w-4" /> Blood Collected
                                  </Button>
                                </>
                              )}
                              {offer.status === 'Declined' && <Badge variant="secondary">Declined</Badge>}
                              {offer.status === 'Completed' && <Badge>Completed</Badge>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!req.offers || req.offers.length === 0) && (
                    <div className="p-4 border-t text-center text-sm text-muted-foreground">
                      <p>No offers received for this request yet.</p>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>You haven't made any blood requests yet.</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4">
                      <Icons.add className="mr-2 h-4 w-4" /> Create Your First Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{t('requestBlood.title')}</DialogTitle>
                      <DialogDescription>{t('requestBlood.description')}</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[70vh] sm:max-h-[80vh]">
                      <RequestBloodForm />
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
